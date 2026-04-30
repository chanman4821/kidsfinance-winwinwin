Agent completed. agent_id: wwww-architect, agent_type: Architect, status: completed, description: Architect Win Win Win + Coinwood system, elapsed: 2480s, total_turns: 0, duration: 942s

Continuing from the RLS section of ADR-002, then completing all remaining files.

---

## `docs/adr/ADR-002-data-model.md` *(continued)*

```markdown
  ON families
  AS PERMISSIVE FOR ALL
  USING (id = current_setting('app.current_family_id', true)::uuid);

CREATE POLICY family_isolation
  ON parents
  AS PERMISSIVE FOR ALL
  USING (family_id = current_setting('app.current_family_id', true)::uuid);

CREATE POLICY family_isolation
  ON kids
  AS PERMISSIVE FOR ALL
  USING (family_id = current_setting('app.current_family_id', true)::uuid);

CREATE POLICY family_isolation
  ON transactions
  AS PERMISSIVE FOR ALL
  USING (family_id = current_setting('app.current_family_id', true)::uuid);

-- Crews: visible to any family that has a membership in it
CREATE POLICY crew_member_visibility
  ON crews
  AS PERMISSIVE FOR SELECT
  USING (
    id IN (
      SELECT cm.crew_id
      FROM   crew_memberships cm
      JOIN   kids k ON k.id = cm.kid_id
      WHERE  k.family_id = current_setting('app.current_family_id', true)::uuid
    )
  );

-- Phrase library: readable by all authenticated sessions (no family scope needed)
CREATE POLICY phrase_public_read
  ON phrase_library
  AS PERMISSIVE FOR SELECT
  USING (is_active = true);

-- Meetups: visible to all (discovery); RSVPs scoped to family
CREATE POLICY meetup_public_read
  ON meetups
  AS PERMISSIVE FOR SELECT
  USING (true);

CREATE POLICY meetup_rsvp_family
  ON meetup_rsvps
  AS PERMISSIVE FOR ALL
  USING (family_id = current_setting('app.current_family_id', true)::uuid);

-- Transactions: immutable — block UPDATE and DELETE at DB layer
CREATE POLICY tx_no_update ON transactions AS RESTRICTIVE FOR UPDATE USING (false);
CREATE POLICY tx_no_delete ON transactions AS RESTRICTIVE FOR DELETE USING (false);
```

**Implementation pattern in `lib/db/client.ts`:**

```typescript
// lib/db/client.ts
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { sql } from 'drizzle-orm'
import * as schema from './schema'

export function createDb(familyId: string) {
  const http = neon(process.env.DATABASE_URL!)
  const db   = drizzle(http, { schema })

  // Set RLS context for every query batch in this request
  // Uses SET LOCAL so it's scoped to the implicit transaction
  const withFamily = async <T>(fn: (db: typeof db) => Promise<T>): Promise<T> => {
    await db.execute(sql`SELECT set_config('app.current_family_id', ${familyId}, true)`)
    return fn(db)
  }

  return { db, withFamily }
}
```

> **Note:** The Neon serverless HTTP driver sends each `.execute()` call as a separate HTTP
> request. Use `neon`'s transaction helper (`neon.transaction(...)`) when atomicity across
> multiple statements is required, and set the config at the start of that transaction block.

---

## 7. References

- [T1] Drizzle ORM column types: https://orm.drizzle.team/docs/column-types/pg ⚠ verify-live
- [T1] Drizzle ORM indexes: https://orm.drizzle.team/docs/indexes-constraints ⚠ verify-live
- [T1] Neon Row-Level Security guide: https://neon.tech/docs/guides/row-level-security ⚠ verify-live
- [T1] Neon serverless transaction docs: https://neon.tech/docs/serverless/serverless-driver ⚠ verify-live
- [T1] FTC COPPA Rule 16 CFR Part 312 — data minimization, retention, parental access requirements
- [T1] WCAG 2.2 AA §3.3 — no PII in query-string parameters (applicable to kid profile routes)
- [T2] Common Sense Media Privacy Framework — age-appropriate data collection standards
- [T2] kids-fintech-landscape.md §4 — COPPA compliance basics (this project's research doc)
```

---

## `docs/adr/ADR-003-api-surface.md`

```markdown
# ADR-003: API Surface — Win Win Win (Coinwood)

**Status:** Proposed  
**Date:** 2025-07-14  
**Authors:** Architect Agent (L1)  
**References:** ADR-001 (Architecture), ADR-002 (Data Model)

---

## 1. Context

Next.js 16 App Router provides two mutation primitives:

- **Server Functions** (`'use server'` directive) — for all create/update/delete mutations
  invoked from React components. Called via `POST` under the hood; never a named URL.
- **Route Handlers** (`app/api/**/route.ts`) — for: (a) Auth.js catch-all, (b) paginated
  read endpoints consumed by client components, (c) webhooks from external services,
  (d) Server-Sent Events (SSE) streams for real-time features.

**Design rules applied throughout:**
1. Every Server Function begins with `const session = await auth()` — reject if no session.
2. Every Server Function validates input with Zod before touching the DB.
3. Family isolation is enforced at both app layer (`session.familyId`) and DB layer (RLS).
4. Rate limits are applied via `@upstash/redis` on all auth-adjacent and mutation routes.
5. No kid-session can call parent-only actions — role is checked from session claims.

---

## 2. Auth

### Route Handlers

| Route | Method | Purpose | Auth | Rate Limit |
|-------|--------|---------|------|-----------|
| `app/api/auth/[...nextauth]/route.ts` | GET, POST | Auth.js v5 catch-all (session, OAuth callback, CSRF) | Public | 10/min per IP |

### Server Functions (`lib/actions/auth.ts`)

| Function | Input (Zod) | Auth requirement | Notes |
|----------|-------------|-----------------|-------|
| `signUpParent(data)` | `{ email, password, displayName, familyName, timezone, coppaConsentIp }` | Public (unauthenticated) | Creates `families` + `parents` row; sends COPPA consent email via Resend; does NOT create session until email verified |
| `verifyParentEmail(token)` | `{ token: z.string().length(64) }` | Public | Validates token from email link; sets `coppa_consent_at`; creates Auth.js session |
| `switchToKidProfile(kidId, pin)` | `{ kidId: z.string().uuid(), pin: z.string().min(4).max(6) }` | Parent session required | Validates PIN server-side; augments session with `{ activeKidId, ageGroup }`; rate limited 3 attempts/5 min per kidId |
| `switchBackToParent()` | none | Kid-augmented session | Clears `activeKidId` from session |
| `signOut()` | none | Any authenticated | Auth.js signOut |

**Rate limiting (Upstash):**
```typescript
// lib/rate-limit.ts — reusable helper
import { Ratelimit } from '@upstash/ratelimit'
import { Redis }     from '@upstash/redis'

export const pinRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, '5 m'),
  prefix: 'pin',
})

export const authRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'),
  prefix: 'auth',
})
```

---

## 3. Family & Parent Management

### Server Functions (`lib/actions/family.ts`)

| Function | Input (Zod) | Auth | Notes |
|----------|-------------|------|-------|
| `updateFamilySettings(data)` | `{ name?, timezone? }` | Parent (primary) | |
| `addParent(data)` | `{ email, displayName, isPrimary? }` | Parent (primary) | Sends invite email; creates `parents` row |
| `addKid(data)` | `{ displayName, dob, ageGroupOverride? }` | Parent | Creates `kids` + `kid_profiles` + 3 `jars` rows atomically |
| `updateKid(kidId, data)` | `{ displayName?, ageGroupOverride?, isActive? }` | Parent | Verifies `kid.familyId === session.familyId` |
| `deleteKid(kidId)` | `{ kidId: z.string().uuid() }` | Parent (primary) | Cascades delete per COPPA; requires re-confirmation step in UI |
| `updateKidPin(kidId, newPin)` | `{ kidId: z.string().uuid(), pin: z.string().min(4).max(6) }` | Parent | Hash stored server-side; old pin invalidated |

---

## 4. Chores

### Server Functions (`lib/actions/chores.ts`)

| Function | Input (Zod) | Auth | Rate Limit |
|----------|-------------|------|-----------|
| `createChore(data)` | `{ assignedToKidId, title, rewardCents, recurrenceType, dueDate?, templateId? }` | Parent | 30/min per family |
| `createChoreTemplate(data)` | `{ title, description?, defaultRewardCents, recurrenceType, iconKey }` | Parent | 30/min |
| `updateChore(choreId, data)` | `{ title?, rewardCents?, dueDate?, status? }` | Parent | 30/min |
| `deleteChore(choreId)` | `{ choreId: z.string().uuid() }` | Parent | 30/min |
| `markChoreComplete(choreId, photoUrl?)` | `{ choreId: z.string().uuid(), photoUrl?: z.string().url() }` | Kid (assigned kid only) | 60/min per kid |
| `approveChore(choreId)` | `{ choreId: z.string().uuid() }` | Parent | Triggers `transactions` insert (credit to assigned jar); revalidates kid home cache |
| `skipChore(choreId)` | `{ choreId: z.string().uuid() }` | Parent | Sets status = skipped |

### Route Handlers

| Route | Method | Purpose | Auth | Rate Limit |
|-------|--------|---------|------|-----------|
| `app/api/chores/route.ts` | GET | Paginated chore list for family | Parent or Kid | 60/min |
| `app/api/chores/[choreId]/route.ts` | GET | Single chore detail | Parent or Kid (family-scoped) | 60/min |

---

## 5. Jars & Transactions

### Server Functions (`lib/actions/jars.ts`)

| Function | Input (Zod) | Auth | Notes |
|----------|-------------|------|-------|
| `transferBetweenJars(data)` | `{ fromJarId, toJarId, amountCents: z.number().int().positive() }` | Kid (jar owner) | Validates sufficient balance; creates 2 transaction rows (debit + credit) |
| `setJarAllocation(jarId, pct)` | `{ jarId: z.string().uuid(), pct: z.number().int().min(0).max(100) }` | Parent | Save/Spend/Give percentages must sum to ≤ 100 |
| `setInterestRate(jarId, ratePct)` | `{ jarId: z.string().uuid(), ratePct: z.string().regex(/^\d+\.\d{1,2}$/) }` | Parent | Parent-paid interest simulation; max 999.99% (educational tool) |
| `applyInterest(kidId)` | `{ kidId: z.string().uuid() }` | Parent or Cron | Calculates interest on save jar balance; inserts transaction |
| `scheduleAllowance(data)` | `{ kidId, amountCents, recurrence, nextRunAt }` | Parent | Stores in `chores` table with `source_type='allowance'`; cron applies it |

### Route Handlers

| Route | Method | Purpose | Auth | Rate Limit |
|-------|--------|---------|------|-----------|
| `app/api/transactions/[kidId]/route.ts` | GET | Paginated transaction history | Parent or Kid (own) | 60/min |

---

## 6. Savings Goals

### Server Functions (`lib/actions/goals.ts`)

| Function | Input (Zod) | Auth | Notes |
|----------|-------------|------|-------|
| `createGoal(data)` | `{ kidId, title, targetAmountCents, targetDate?, imageUrl? }` | Kid or Parent | Creates `savings_goals` row |
| `allocateToGoal(goalId, amountCents)` | `{ goalId: z.string().uuid(), amountCents: z.number().int().positive() }` | Kid (goal owner) | Debit spend jar → credit save jar; updates `current_amount_cents` |
| `updateGoal(goalId, data)` | `{ title?, targetAmountCents?, targetDate? }` | Kid or Parent | |
| `cancelGoal(goalId)` | `{ goalId: z.string().uuid() }` | Kid or Parent | Sets status = cancelled |

---

## 7. Financial Literacy Lessons

### Server Functions (`lib/actions/lessons.ts`)

| Function | Input (Zod) | Auth | Notes |
|----------|-------------|------|-------|
| `startLesson(lessonId)` | `{ lessonId: z.string().uuid() }` | Kid | Upserts `lesson_progress` with status = in_progress |
| `completeLesson(lessonId)` | `{ lessonId: z.string().uuid() }` | Kid | Sets completed; awards XP; triggers badge check; revalidates kid home |
| `submitQuizAttempt(data)` | `{ quizId: z.string().uuid(), selectedChoiceIdx: z.number().int().min(0).max(3) }` | Kid | Grades answer; awards partial XP if correct; inserts `quiz_attempts` row |
| `assignLesson(kidId, lessonId)` | `{ kidId, lessonId }` | Parent | Creates or resets `lesson_progress` |

### Route Handlers

| Route | Method | Purpose | Auth | Rate Limit |
|-------|--------|---------|------|-----------|
| `app/api/lessons/route.ts` | GET | Lesson catalog filtered by `?ageGroup=` | Kid or Parent | 60/min |
| `app/api/lessons/[lessonId]/route.ts` | GET | Lesson content JSON | Kid or Parent | 60/min |

---

## 8. Crews

### Server Functions (`lib/actions/crews.ts`)

| Function | Input (Zod) | Auth | Notes |
|----------|-------------|------|-------|
| `createCrew(data)` | `{ name, description?, maxMembers }` | Kid (captain) + parent approval | Server Function checks parent session is active; crew created in `pending_approval` status then parent confirms |
| `sendCrewInvite(data)` | `{ crewId, targetFamilyId }` | Parent | Creates `crew_invites` row; sends email to target family's primary parent via Resend |
| `respondToInvite(inviteId, accept)` | `{ inviteId: z.string().uuid(), accept: z.boolean() }` | Parent (receiving family) | On accept: inserts `crew_memberships` with `approved_by_parent_id`; on decline: sets invite status |
| `addCrewComment(data)` | `{ crewId: z.string().uuid(), phraseId: z.number().int().positive() }` | Kid (crew member) | Validates `phraseId` exists and is active; inserts `crew_comments`; free-text input NEVER accepted |
| `leaveCrew(crewId)` | `{ crewId: z.string().uuid() }` | Kid or Parent (on behalf of kid) | Deletes `crew_memberships` row |
| `disbandCrew(crewId)` | `{ crewId: z.string().uuid() }` | Parent (captain's family) | Sets crew status = disbanded |

### Route Handlers

| Route | Method | Purpose | Auth | Rate Limit |
|-------|--------|---------|------|-----------|
| `app/api/crews/[crewId]/route.ts` | GET | Crew detail + member list | Crew member (family-scoped) | 60/min |
| `app/api/crews/[crewId]/comments/route.ts` | GET | Crew comment feed (phrase texts resolved) | Crew member | 60/min |

---

## 9. Portfolio & Investing (Play-Money Only)

### Server Functions (`lib/actions/portfolio.ts`)

| Function | Input (Zod) | Auth | Age gate | Notes |
|----------|-------------|------|---------|-------|
| `initPortfolio(type)` | `{ portfolioType: z.enum(['coinwood','realplay']) }` | Kid | `realplay`: age ≥ 10 verified server-side from `kid.dob` | Creates portfolio + seeds `cash_balance_cents` = $1,000 play money |
| `buyShares(data)` | `{ portfolioId, companyOrTickerId, shares: z.number().positive() }` | Kid (portfolio owner) | As above | Validates play cash balance; upserts `positions`; records transaction |
| `sellShares(data)` | `{ portfolioId, positionId, shares: z.number().positive() }` | Kid (portfolio owner) | As above | Validates share balance; updates position; records transaction |
| `addStrategyNote(data)` | `{ portfolioId?, crewId?, noteText: z.string().max(500) }` | Kid | — | Parent-viewable; no external links permitted (server strips URLs) |

### Route Handlers

| Route | Method | Purpose | Auth | Rate Limit |
|-------|--------|---------|------|-----------|
| `app/api/portfolio/[portfolioId]/route.ts` | GET | Portfolio summary + positions | Kid (owner) or Parent | 60/min |
| `app/api/stocks/[symbol]/route.ts` | GET | Price quote (Neon cache, 15-min TTL) | Kid (age ≥ 10) or Parent | 30/min |
| `app/api/stocks/route.ts` | GET | Ticker search / browse by sector | Kid or Parent | 30/min |
| `app/api/coinwood/companies/route.ts` | GET | Fictional company catalog | Any kid or Parent | 120/min (static-ish) |

---

## 10. Competitions

### Server Functions (`lib/actions/competitions.ts`)

| Function | Input (Zod) | Auth | Notes |
|----------|-------------|------|-------|
| `joinCompetition(competitionId)` | `{ competitionId: z.string().uuid() }` | Kid | Snapshots portfolio value at entry; inserts `competition_entries` |
| `createCompetition(data)` | `{ title, competitionType, crewId?, startsAt, endsAt, prizeDescription }` | Parent or Admin | |

### Route Handlers

| Route | Method | Purpose | Auth | Rate Limit |
|-------|--------|---------|------|-----------|
| `app/api/competitions/route.ts` | GET | Active competitions list | Kid or Parent | 60/min |
| `app/api/competitions/[id]/leaderboard/route.ts` | GET | Current standings snapshot | Any family member | 30/min |
| `app/api/events/competitions/[id]/route.ts` | GET (SSE) | Live leaderboard stream | Kid or Parent | 10 concurrent per family |

**SSE stream pattern:**
```typescript
// app/api/events/competitions/[id]/route.ts
import type { NextRequest } from 'next/server'

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<'/api/events/competitions/[id]'>
) {
  const { id } = await ctx.params
  // Authenticate session before streaming
  const session = await auth()
  if (!session) return new Response('Unauthorized', { status: 401 })

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()
      const send = (data: object) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))

      // Poll leaderboard from Upstash sorted set every 5 s
      const interval = setInterval(async () => {
        const scores = await getLeaderboardFromRedis(id)
        send({ type: 'leaderboard', scores })
      }, 5000)

      // Clean up when client disconnects
      _req.signal.addEventListener('abort', () => {
        clearInterval(interval)
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type':  'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection':    'keep-alive',
      'X-Accel-Buffering': 'no',  // disable Nginx/Vercel proxy buffering
    },
  })
}
```

---

## 11. Meetups

### Server Functions (`lib/actions/meetups.ts`)

| Function | Input (Zod) | Auth | Notes |
|----------|-------------|------|-------|
| `createMeetup(data)` | `{ title, description, meetupType, scheduledAt, durationMinutes, maxAttendees, streamUrl? }` | Parent | |
| `rsvpMeetup(meetupId, status)` | `{ meetupId: z.string().uuid(), status: z.enum(['going','maybe','declined']) }` | Parent (per family) | Upserts `meetup_rsvps` |
| `cancelMeetup(meetupId)` | `{ meetupId: z.string().uuid() }` | Parent (creator) | Sends cancellation email to RSVPed families via Resend |

### Route Handlers

| Route | Method | Purpose | Auth | Rate Limit |
|-------|--------|---------|------|-----------|
| `app/api/meetups/route.ts` | GET | Upcoming meetups list | Any authenticated | 60/min |
| `app/api/meetups/[id]/route.ts` | GET | Meetup detail + RSVP count | Any authenticated | 60/min |
| `app/api/events/meetups/[id]/route.ts` | GET (SSE) | Live attendance presence during event | Parent (RSVP'd) | 10 concurrent per family |

---

## 12. Parent Lounge (Forum)

### Server Functions (`lib/actions/forum.ts`)

| Function | Input (Zod) | Auth | Notes |
|----------|-------------|------|-------|
| `createForumPost(data)` | `{ title: z.string().max(200), contentText: z.string().max(5000), topicTag: z.enum([...]) }` | Parent | Kid sessions receive 403 — forum is parent-only |
| `updateForumPost(postId, data)` | `{ title?, contentText? }` | Parent (author only) | |
| `deleteForumPost(postId)` | `{ postId: z.string().uuid() }` | Parent (author) or Admin | |

### Route Handlers

| Route | Method | Purpose | Auth | Rate Limit |
|-------|--------|---------|------|-----------|
| `app/api/forum/route.ts` | GET | Forum posts (paginated, filterable by topicTag) | Parent session only | 60/min |
| `app/api/forum/[postId]/route.ts` | GET | Single post | Parent session only | 60/min |

---

## 13. Internal / Cron / Infrastructure

| Route | Method | Purpose | Auth | Notes |
|-------|--------|---------|------|-------|
| `app/api/webhooks/cron/route.ts` | POST | Vercel cron: run interest, allowances, streak reset, stock price refresh | `Authorization: Bearer $CRON_SECRET` header | Vercel cron calls this on schedule |
| `app/api/r2/presign/route.ts` | POST | Generate R2 presigned upload URL for chore completion photos | Parent or Kid (age ≥ 13) | Returns one-time URL; 5/min per family |
| `app/api/health/route.ts` | GET | Uptime check | Public | No rate limit |

---

## 14. Real-Time Channel Summary

| Channel | Mechanism | Trigger | Consumers |
|---------|-----------|---------|-----------|
| Live competition leaderboard | SSE (`/api/events/competitions/[id]`) | Cron polls Redis sorted set every 5 s | Competing kids + parents |
| Live meetup presence | SSE (`/api/events/meetups/[id]`) | RSVP join/leave events | Attending families |
| Chore approval notification | Resend email + in-app badge revalidation | `approveChore()` Server Function | Parent (email); Kid (UI revalidation via `revalidatePath`) |
| New crew invite | Resend email | `sendCrewInvite()` | Target family's primary parent |

> **v2 upgrade:** Replace SSE polling with Pusher Channels (bidirectional) when mentor
> office-hours live Q&A or crew real-time voice/text features are added.

---

## 15. References

- [T1 — local] Next.js 16 Route Handlers: `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md`
- [T1 — local] Server Functions / Mutations: `node_modules/next/dist/docs/01-app/01-getting-started/07-mutating-data.md`
- [T1] Auth.js v5 session management: https://authjs.dev/getting-started/session-management ⚠ verify-live
- [T1] Upstash Ratelimit SDK: https://upstash.com/docs/redis/sdks/ratelimit/overview ⚠ verify-live
- [T1] Zod documentation: https://zod.dev ⚠ verify-live
- [T1] MDN: EventSource / Server-Sent Events: https://developer.mozilla.org/en-US/docs/Web/API/EventSource
- [T1] FTC COPPA Rule 16 CFR Part 312 — parental consent required before any kid-data mutation
```

---

## `docs/design/age-band-modes.md`

```markdown
# Age-Band UI Specification — Win Win Win (Coinwood)

**Status:** Proposed  
**Date:** 2025-07-14  
**References:** ADR-001, ADR-002, kids-fintech-landscape.md §2 (age-band UX patterns)

---

## 1. Overview

Win Win Win serves three distinct cognitive and developmental stages simultaneously. The app
determines a kid's age band server-side from `kid.dob` (or parent override), stores it in the
session as `ageGroup`, and injects it into a React Context consumed by every adaptive component.

| Band | Ages | Label in code | Piaget stage | Reading level |
|------|------|---------------|-------------|---------------|
| Early | 4–7 | `'early'` | Pre-operational → early concrete | Pre-reader / K–1 |
| Middle | 8–12 | `'middle'` | Concrete operational | 2nd–5th grade |
| Teen | 13–18 | `'teen'` | Formal operational | 6th–10th grade |

**Derivation logic (server-side only — `lib/age.ts`):**
```typescript
export type AgeGroup = 'early' | 'middle' | 'teen'

export function deriveAgeGroup(dob: string, override?: AgeGroup | null): AgeGroup {
  if (override) return override
  const age = Math.floor((Date.now() - new Date(dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
  if (age <= 7)  return 'early'
  if (age <= 12) return 'middle'
  return 'teen'
}
```

**Context provider (Client Component wrapping the kid shell layout):**
```typescript
// components/providers/age-group-provider.tsx
'use client'
import { createContext, useContext } from 'react'

export type AgeGroup = 'early' | 'middle' | 'teen'
const AgeGroupContext = createContext<AgeGroup>('middle')

export function AgeGroupProvider({ ageGroup, children }: {
  ageGroup: AgeGroup
  children: React.ReactNode
}) {
  return <AgeGroupContext.Provider value={ageGroup}>{children}</AgeGroupContext.Provider>
}

export const useAgeGroup = () => useContext(AgeGroupContext)
```

The Server Component layout (`app/kid/layout.tsx`) reads `ageGroup` from session and passes
it to `<AgeGroupProvider>` — no client-side age derivation ever occurs.

---

## 2. Early Mode (Ages 4–7)

### Guiding principles
- **Zero required reading.** Every action is expressible as icon + sound alone.
- **Maximum 2–3 choices per screen.** Working memory limit for pre-operational stage.
  *(Source: research doc §2.1 — Khan Academy Kids pattern)*
- **Audio on every meaningful state change.** Silence = confusion at this age.
- **Tap targets ≥ 64×64 px.** Larger than WCAG 2.2 AA minimum (24×24); tuned for 4-year-old
  fine motor skills. *(Source: AAP / Common Sense Media Learning Rating criteria)*
- **Parent co-play encouraged.** "Show your grown-up!" prompts on first run of each feature.
- **Celebration-first error recovery.** No red error text; shake animation + "Try again! 🌟"

### Navigation & Layout
- **Bottom tab bar: 3 tabs maximum** — Home (🏠), Jars (🏺), Stickers (⭐)
- Tab labels: icon only (no text labels)
- Active tab: filled icon + `#F5C842` (Sunshine Yellow) glow ring
- No hamburger menu, no nested navigation
- Bottom nav height: **80 px** (larger than standard 72 px for child thumb reach)

### Typography
- All text: **Fredoka One, 22px minimum**
- Labels hidden when icon is present; icon carries full meaning
- Numbers: **Nunito SemiBold, 36px minimum** for jar balances
- No text longer than 3 words on any interactive element

### Component Behavior — Early Mode

**`<JarDisplay>`**  
- Renders as animated 3D piggy-bank illustration (SVG) per jar type  
- Balance shown as stacked coin icons (1 coin = 10¢ up to 10 coins, then "lots of coins!" icon)  
- No numeric display if balance > $9.99; show "FULL! 🎉" with confetti  
- Tap jar → coin-pour sound + coin count animation; no text breakdown

**`<ChoreCard>`**  
- Full-width card, 120 px height  
- Chore icon (64×64) + 1–2 word title in Fredoka 20px  
- Single large CTA: green checkmark button (64×64) — "I did it! ✅"  
- Reward displayed as coin stack icon, not currency string  
- No due-date text; overdue = card border pulses amber

**`<LessonCard>`**  
- Icon + character illustration only  
- Progress: filled star row (★★★☆☆) — no percentage text  
- Tapping opens a guided, audio-narrated experience (TTS via Web Speech API)

**`<HomeScreen>`**  
- Full-screen mascot (Coinwood character) in center, breathing idle animation  
- 2 large "bubble" buttons: "Do a Chore" + "Check My Jars"  
- Celebration banner drops from top on login if streak active  
- Mascot reacts: jumps on earn, droops if no chore done today

**`<BadgeDisplay>`**  
- Oversized badge grid (2 columns), each badge 96×96 px  
- Earned badges: full color + sparkle animation on first view  
- Unearned: grayscale silhouette (no "locked" text)

### Accessibility (Early)
- All interactive elements: `aria-label` includes the spoken phrase ("Do a chore — tap to start")
- `role="img"` with `aria-label` on all decorative mascot illustrations
- Respects `prefers-reduced-motion` — disables spring animations, keeps opacity fades
- Color never carries meaning alone (shape + icon always paired)

---

## 3. Middle Mode (Ages 8–12)

### Guiding principles
- **Text + icon pairs.** Can read but still prefers visual support.
- **Math visible, scaffolded.** Show the arithmetic ("Save $3 more → earn $0.15 interest").
  *(Source: CFPB Money as You Grow, ages 6–10 activities)*
- **Badge systems are peak motivation.** Gamification ROI highest at this age.
- **Savings goal with countdown** drives repeat weekly engagement.
- **5th-grade reading level max** (Flesch-Kincaid ≤ Grade 5 for UI labels).

### Navigation & Layout
- **Bottom tab bar: 5 tabs** — Home, Jars, Chores, Learn, Crew
- Tabs: icon + short label (≤ 8 chars), Nunito SemiBold 12px
- Active tab: filled icon + label, `#5BB8F5` underline indicator
- Cards: 20px padding, 16px border-radius, `rgba(0,0,0,0.07)` drop shadow
- Section headers visible (e.g., "Your Goals", "This Week's Chores")

### Typography
- Body / labels: **Nunito, 16–18px**
- Card headings: Nunito Bold 18px
- Financial figures: Nunito SemiBold 24px, tabular-nums, dollar sign displayed
- Error/helper text: 14px, Slate `#6B7280`, paired with icon

### Component Behavior — Middle Mode

**`<JarDisplay>`**  
- Jar shown as animated glass jar with liquid fill level (CSS clip-path animation)  
- Balance: `$12.45` in large Nunito SemiBold  
- Interest rate shown: "Earning 5% 📈" below balance if `interestRatePct > 0`  
- Tap → opens jar detail with transaction history (last 5) and "Transfer" button

**`<ChoreCard>`**  
- Shows title, reward amount (`+$2.50`), due date ("Due Friday"), recurrence chip  
- CTA: "Mark Done ✓" (pill button, full-width)  
- Approved state: green checkmark + "Approved! Coins added to Spend jar 🪙"  
- Skipped: muted card with strikethrough title

**`<SavingsGoalRing>`**  
- Circular progress ring (recharts `RadialBarChart`) showing % complete  
- Center: goal image thumbnail + `$8 to go!`  
- Below: "At your save rate: 3 more weeks" (computed server-side, passed as prop)  
- Tap → goal detail with transaction history and "Add More" button

**`<LessonCard>`**  
- Topic icon + title + estimated time ("~4 min")  
- Progress indicator: linear bar with step dots  
- Badge preview: "Complete to earn 🏅 Saver Badge (+50 XP)"  
- Lesson content: scrollable card sequence with embedded quiz

**`<InvestingIntro>`** *(Coinwood mode only for 8–9; both modes for 10–12)*  
- Fictional company cards: company illustration, name, price, 7-day sparkline  
- "What this company does" expandable section  
- Buy/Sell with play-money coins (not currency notation for 8–9; dollar notation for 10+)

**`<CrewPanel>`**  
- Crew avatar + name + member count  
- Crew leaderboard: ranked list of members by portfolio value (play money)  
- Comment feed: phrase bubbles (no free text)  
- "Invite a Friend" button (triggers parent-to-parent invite flow)

### Accessibility (Middle)
- Focus indicators: 3px `#5BB8F5` outline on all interactive elements
- Skip-to-content link at top of each page
- `aria-live="polite"` regions for jar balance updates

---

## 4. Teen Mode (Ages 13–18)

### Guiding principles
- **"Adulting" framing.** Teens respond to being treated as capable, not talked down to.
  *(Source: research doc §2.3 — CFPB, CEE)*
- **Real-world simulation.** Real stock prices (play money), compound interest sliders, tax explainers.
- **Social proof matters.** Leaderboards, portfolio comparison, crew rankings are highly motivating.
- **Higher information density.** More data per card is acceptable; reading level 8th–10th grade OK.
- **Financial vocabulary introduced explicitly.** Terms like "portfolio," "diversification," "yield."

### Navigation & Layout
- **Bottom tab bar: 5 tabs** — Home, Money, Invest, Learn, Crew
- Additional tab overflow via "More" icon (lucide `MoreHorizontal`) for Competitions, Meetups
- Compact card style: 16px padding, denser vertical rhythm (16px gap vs. 24px in middle)
- Data tables acceptable (e.g., transaction history, portfolio holdings)
- Dark mode supported (Tailwind `dark:` variants)

### Typography
- Body: **Nunito, 15–16px** (denser information density)
- Financial figures: Nunito SemiBold 20–28px, tabular-nums
- Secondary labels: 13px, Slate
- Headers: Fredoka One (retained for brand continuity, slightly scaled back)

### Component Behavior — Teen Mode

**`<JarDisplay>`** → renamed **`<AccountSummary>`**  
- Three-column layout: Save / Spend / Give with dollar amounts + % allocation  
- Net worth line: "Total: $247.50" in large type  
- Interest earned this month: "$3.20 📈 (+5% APR)"  
- Quick action buttons: Transfer, Set Goal, View History  
- Compound interest projection: tap "?" → shows "In 5 years at 5%: $316.04" (recharts LineChart)

**`<PortfolioView>`** *(realplay mode, age ≥ 13)*  
- Portfolio total value + day change (`+$4.20 / +1.2%`) with color: Mint Green (positive) /
  Coral Orange (negative) — never red/green alone (colorblind-safe)  
- Holdings table: ticker, shares, avg cost, current price, gain/loss %  
- recharts `AreaChart` for 30-day portfolio value history  
- "Add Funds" button shows play-money disclaimer: "PLAY MONEY — prices delayed 15 min"

**`<CompoundInterestCalc>`**  
- Interactive recharts `LineChart` with sliders: initial amount, monthly contribution, rate, years  
- "What if you started at 15 vs. 25?" toggle — shows two lines  
- Roth IRA intro text at bottom: "This is how retirement accounts work. Real ones."  
*(Source: research gap E-12 — no current app shows this; strong teen differentiator)*

**`<LessonCard>`** → includes tax, credit, budgeting topics  
- Format: short article + quiz (no audio required; teen reads independently)  
- Paycheck simulation: interactive W-4 + see deductions (FICA, federal withholding)  
- Credit score simulator: make/miss payments, watch score move  
*(Source: research gap F-11 — no current app has paycheck simulation)*

**`<CrewPanel>`** → full crew tournament view  
- Live leaderboard (SSE stream) during competition window  
- Strategy notes feed (kid-authored, parent-visible, URL-stripped)  
- Phrase comment feed (same predefined library, teen-appropriate phrases unlocked)

### Accessibility (Teen)
- Meets WCAG 2.2 AA minimum throughout (not just the larger-target requirements of early mode)
- `aria-label` on all chart elements (recharts uses SVG; add `<title>` elements)
- Keyboard navigation: all interactive elements reachable via Tab; no mouse-only interactions

---

## 5. Component Behavior Diff Table

| Component | Early (4–7) | Middle (8–12) | Teen (13–18) |
|-----------|-------------|--------------|--------------|
| **Jar / Account** | 3D piggy bank, coin stacks, no dollar amount | Glass jar, dollar balance, interest rate shown | Account summary, net worth, compound projection |
| **Navigation tabs** | 3 tabs, icon only | 5 tabs, icon + label | 5 tabs + overflow, compact |
| **Chore card** | Icon + 2-word title, large checkmark | Title + reward + due date + recurrence | Full detail + history + earnings chart |
| **Savings goal** | "Saving for ✈️" icon fill bar | Radial ring + "X more weeks" | Goal with projection + interest |
| **Investing** | Coinwood fictional only (shops metaphor) | Coinwood + real price play money (age 10+) | Full real-price portfolio + compound calc |
| **Lessons** | Audio-guided, icon cards, ≤ 3 min | Text+icon, quiz embedded, 3–5 min | Article format, 5–10 min, tax/credit topics |
| **Crew comments** | 10 simple phrases (cheer/reaction only) | 20 phrases (cheer/investing/question) | All 30+ phrases (full library) |
| **Error messages** | Shake animation + "Try again! 🌟" | Icon + short text + suggestion | Standard text error with fix guidance |
| **Balance display** | Coin stack icons | Dollar + cents | Dollar + cents + change indicator |
| **Tap targets** | 64×64 px minimum | 48×48 px minimum | 44×44 px minimum (WCAG 2.2 AA) |
| **Text size (body)** | 22px minimum | 16–18px | 15–16px |
| **Mascot presence** | Persistent, foregrounded, reacts to everything | Corner position, contextual reactions | Subtle/optional; teen preference |
| **Dark mode** | ❌ (bright colors required for age) | ❌ (color-rich design) | ✅ supported |

---

## 6. Age-Band Transition

When a child's birthday moves them into the next age band (or a parent manually overrides):

1. Parent receives in-app prompt: "Mia just turned 8 — upgrade to Middle mode?" 
   *(Source: research gap H-16 — no current app does this)*
2. Parent confirms → `updateKid(kidId, { ageGroupOverride: 'middle' })` Server Function called.
3. Next kid login: `AgeGroupProvider` receives new `ageGroup`; `AnimatePresence` + `layoutId`
   animate the layout transition (components swap, not a page refresh).
4. New features unlocked (e.g., Lessons tab, Crew tab) show a "New! Tap to explore" badge
   for the first 3 sessions.

---

## 7. References

- [T1] AAP Council on Communications & Media (2016): https://www.healthychildren.org ⚠ verify-live
  *"For children ages 2–5: limit screen use to 1 hour/day of high-quality programming."*
- [T1] CFPB Money as You Grow: https://www.consumerfinance.gov/consumer-tools/money-as-you-grow/ ⚠ verify-live
- [T1] Jump$tart Coalition K–12 Standards: https://www.jumpstart.org/national-standards/ ⚠ verify-live
- [T1] Council for Economic Education: https://www.councilforeconed.org/ ⚠ verify-live
- [T1] WCAG 2.2 AA §2.5.8 — Minimum target size (24×24 px); §1.4.3 — Color contrast
- [T2] Common Sense Media app review criteria for Learning Rating: Strong (under-6 category)
- [T2] Research doc §2 (this project): age-band UX patterns, Khan Academy Kids / Duolingo references
- [T2] Research doc §8: component design conventions (tap targets, font sizes, bottom nav height)
```

---

## `docs/design/safety-rails.md`

```markdown
# Kid Safety & COPPA Design Specification — Win Win Win (Coinwood)

**Status:** Proposed  
**Date:** 2025-07-14  
**References:** ADR-001, ADR-002, FTC COPPA Rule 16 CFR Part 312, WCAG 2.2 AA

> **This document is a hard prerequisite for any launch checklist.** No kid-facing feature
> ships without a corresponding safety review against this spec.

---

## 1. Friend / Crew Connection Safety

### Rule: All connections require parent-to-parent dual approval

Kids can never directly invite or be invited by other kids. The full flow:

```
Kid A (captain) creates crew
        ↓
Parent A sees "Pending Crew Approval" notification
        ↓
Parent A approves crew creation (crew status: active)
        ↓
Parent A searches for Family B by family invite code (not by kid name or email)
        ↓
Parent A sends crew invite → Resend email to Parent B's verified email
        ↓
Parent B receives email with invite details (crew name, captain's display name only — no DOB, no family details)
        ↓
Parent B logs in → sees invite in Parent Dashboard → reviews crew
        ↓
Parent B approves → crew_memberships row inserted with approved_by_parent_id = Parent B's id
        ↓
Kid B now appears in crew (parent-approved)
```

**Technical enforcement:**
- `crew_memberships.approved_by_parent_id` is `NOT NULL` — row cannot be inserted without
  parent approval.
- `sendCrewInvite()` Server Function is callable only from a **parent session** (not kid session).
- `respondToInvite()` Server Function requires parent session of the **receiving** family.
- Family discovery: families share a short alphanumeric invite code (8 chars, e.g. `COINWD-3K9M`),
  generated on family creation. Code is the only cross-family identifier exposed. No names,
  emails, or kid profiles are searchable by other families before invite acceptance.
- Crew max size: **8 members** (hard-coded; cannot be overridden by parent).

### Rule: No direct kid-to-kid messaging outside the predefined phrase system

- There is no DM, chat room, or free-text input for kids anywhere in the product.
- The only text kids can "send" to crew members is a selection from the predefined phrase
  library (see §2 below).
- `crew_comments` table stores only `phrase_id` (integer FK) — never stores child-authored text.
- Strategy notes (`strategy_notes.note_text`) are kid-authored text BUT: (a) max 500 chars,
  (b) parent can view at any time, (c) server strips all URLs before storing, (d) not shown
  in any real-time feed — only visible when parent or kid explicitly navigates to it.

---

## 2. Predefined Phrase Library (v1 — 30 Phrases)

All crew communication uses only the following phrases. Kids select from a visual picker
(phrase text + emoji icon). No free text is accepted. This is the "Among Us" chat pattern —
proven in millions of child-facing apps to eliminate harassment while preserving social fun.

Phrases are seeded into `phrase_library` table on database initialization.

### Cheer / Encouragement (10 phrases)

| ID | Phrase | Category | Min age group |
|----|--------|----------|--------------|
| 1 | "Nice save! 🐷" | cheer | early |
| 2 | "Great goal! ⭐" | cheer | early |
| 3 | "You're crushing it! 💪" | cheer | middle |
| 4 | "Keep going! 🏃" | cheer | early |
| 5 | "Crew power! 🚀" | cheer | early |
| 6 | "That's so smart! 🧠" | cheer | early |
| 7 | "Almost there! 🎯" | cheer | early |
| 8 | "Let's win this! 🏆" | cheer | middle |
| 9 | "We've got this! 🙌" | cheer | middle |
| 10 | "Love this crew! ❤️" | cheer | early |

### Investing Reactions (10 phrases)

| ID | Phrase | Category | Min age group |
|----|--------|----------|--------------|
| 11 | "Great pick! 📈" | investing | middle |
| 12 | "Hold steady! 🧘" | investing | middle |
| 13 | "Buy the dip! 💰" | investing | teen |
| 14 | "Diversify! 🌈" | investing | teen |
| 15 | "Too risky for me 😬" | investing | middle |
| 16 | "Play it safe 🛡️" | investing | middle |
| 17 | "I'd research more first 🔍" | investing | middle |
| 18 | "Nice strategy! ♟️" | investing | teen |
| 19 | "Wait and see 👀" | investing | middle |
| 20 | "To the moon! 🌙" | investing | teen |

### Questions (5 phrases)

| ID | Phrase | Category | Min age group |
|----|--------|----------|--------------|
| 21 | "Why'd you pick that? 🤔" | question | middle |
| 22 | "What's your goal? 🎯" | question | middle |
| 23 | "Did you research it? 📚" | question | middle |
| 24 | "What sector is this? 🏭" | question | teen |
| 25 | "How long will you hold? ⏳" | question | teen |

### General Reactions (5 phrases)

| ID | Phrase | Category | Min age group |
|----|--------|----------|--------------|
| 26 | "Nice move! ✨" | reaction | early |
| 27 | "Hmm, I'm not sure 🤷" | reaction | middle |
| 28 | "Agreed! 👍" | reaction | early |
| 29 | "I disagree 🤔" | reaction | middle |
| 30 | "Good strategy! 🧩" | reaction | middle |

**Implementation notes:**
- Phrase picker UI filters visible phrases by `min_age_group ≤ session.ageGroup`.
- Early-mode kids (4–7) see only phrases with `min_age_group = 'early'` (8 phrases).
- Middle-mode: 25 phrases. Teen: all 30.
- New phrases added via DB seed update + admin review only — no user-submitted phrases.
- Phrase text is localizable: add a `phrase_translations_json` column in v2.

---

## 3. Live Events (Meetups & Competitions)

### Mentor moderation requirement

All online live meetups must have at least one designated adult mentor (a verified parent
account holder with `parent_mentor_badges` of type `event_host`). This is enforced in the
`createMeetup()` Server Function: `mentorParentId` is required for `meetup_type = 'online'`.

### Recording policy

- All online meetups may be recorded (host controls this via `stream_url` field).
- Recording URL is stored in `meetups.recording_url`.
- Recording is accessible **only to families who RSVPd `going`** — enforced in the
  `app/api/meetups/[id]/route.ts` GET handler via RSVP lookup.
- Recording retention: 90 days, then URL is nulled and object deleted from R2.
- Parents are notified of recording availability via Resend email after the event.

### Competition safety

- Competition prizes are **in-app cosmetic items only** (avatar accessories, home themes) —
  never real monetary value, gift cards, or external rewards.
- `competition_entries` records a portfolio snapshot at time of entry — no continuous
  monitoring of a kid's investment behavior for external purposes.
- Leaderboard in SSE stream shows only `display_name` + portfolio value — no DOB, family name,
  or any other PII.
- Kids can see crew members' leaderboard positions only (not all families globally).

---

## 4. Notification Policy

### Kids

| Rule | Detail |
|------|--------|
| Maximum 1 notification per day | Hard cap enforced in notification scheduler (Vercel cron) |
| No notifications during school hours | Default quiet hours: 8am–3pm local time (derived from family `timezone`). Parent can adjust. |
| No notifications after bedtime | Default cutoff: 8pm local time for early band, 9pm for middle, 10pm for teen. Parent can adjust. |
| Notification types permitted | Chore approval ("Your chore was approved! +$2.50 🪙"), goal milestone ("50% to your goal! ⭐"), badge earned |
| No marketing or engagement-bait notifications | "You haven't visited in a while" / streak-recovery notifications for kids are PROHIBITED. *Source: AAP screen-time guidance — apps should not be designed to maximize time-on-device for children.* |

### Parents

| Rule | Detail |
|------|--------|
| Chore completion alerts | Immediate (parent set urgency); configurable per chore |
| Weekly digest | Sunday evening summary: earnings, savings rate, lessons completed, upcoming chores |
| Crew invite received | Immediate email via Resend |
| Meetup reminders | 24h + 1h before scheduled meetup |
| COPPA / consent reminders | If `coppa_consent_at` is null after 48h, daily reminder until resolved |
| Parent can opt out of any category | Preference flags in `parents` table; respected on every Resend send call |

---

## 5. Real-Stock Pricing & Play-Money Guardrails

### Absolute rules (v1)

1. **No real money ever moves.** There are no payment rails, no bank accounts, no stored-value
   wallets with real monetary value. Play money exists only as `integer` fields in Postgres.
2. **Real stock prices are display-only.** Prices fetched from a free API are cached in Neon
   with a 15-minute TTL. They are used only to calculate simulated portfolio value in play money.
3. **Real-price portfolio is age-gated to 10+.** Server Function checks `age_derived(kid.dob) >= 10`
   before allowing `initPortfolio({ portfolioType: 'realplay' })`. This cannot be bypassed
   by the kid — the check runs server-side against the DB value of `dob`.
4. **"PLAY MONEY" label is mandatory on every screen showing real stock prices.** UI components
   displaying portfolio value or price data must include the disclaimer as a non-dismissible
   chip/badge: "🎮 PLAY MONEY — prices delayed 15 min."
5. **No crypto, no options, no leveraged products.** `real_stock_tickers` table contains only
   equities. `buyShares()` Server Function rejects any ticker not present in the curated
   ticker cache. The cache is populated by admin-approved tickers only (no user-submitted symbols).
6. **FINRA / broker-dealer note:** This app does not execute real securities transactions.
   It is an educational simulator. No registration with FINRA, SEC, or state securities
   regulators is required for v1. **UNVERIFIED: consult securities counsel before any
   feature that could be construed as investment advice or real transaction facilitation.**

---

## 6. COPPA Compliance Design

### What triggers COPPA

Per FTC 16 CFR Part 312: COPPA applies because this app is **directed to children under 13**
(ages 4–12 are explicitly served) and collects personal information (display names, DOB, device
session identifiers). The "play money" framing provides no exemption.

### Verifiable Parental Consent Flow

COPPA requires **verifiable** parental consent — a simple email checkbox does not qualify.
Win Win Win uses the "email + additional verification step" method approved by the FTC:

```
Step 1: Parent enters email + creates password on /join
        ↓
Step 2: Resend sends consent email to parent's address containing:
        - Description of data collected from children
        - Link to Privacy Policy
        - Unique 64-char token (expires 24h)
        ↓
Step 3: Parent clicks link → lands on /consent/[token]
        ↓
Step 4: Parent must answer one of:
        (a) Knowledge-based security question set during signup, OR
        (b) Provide last 4 digits of a payment card for micro-authorization
            ($0.00 authorize + immediate void — no charge)
        ↓
Step 5: On successful verification:
        - parents.coppa_consent_at = NOW()
        - parents.coppa_consent_ip_hash = hash(request IP)
        - Consent record emailed to parent as PDF summary
        ↓
Step 6: Parent can now add kid profiles
        (kids table rows cannot be inserted until coppa_consent_at IS NOT NULL)
```

**Server-side enforcement:** `addKid()` Server Function checks:
```typescript
if (!session.user.coppaConsentAt) {
  throw new Error('COPPA consent required before adding a child profile')
}
```

### Data Minimization Checklist

| Requirement | Implementation |
|-------------|----------------|
| Collect only what's operationally necessary | `kids` table: display_name (nickname), dob (age-gating only), pin_hash. No real name, no email, no phone, no address. |
| No persistent advertising identifiers | No ad SDKs, no third-party analytics SDKs, no fingerprinting. Vercel Analytics (if used) must be configured to anonymize IPs. |
| No third-party data sharing without consent | Resend receives parent email only (not kid data). Neon receives all DB data (EU/US data processing addendum required). Cloudflare R2 receives asset files only (no PII). |
| No conditioning access on excess data | Kids can use the app with only: nickname + DOB + PIN. No photo required, no last name, no school name. |

### Parent Rights Implementation

| Right | How implemented |
|-------|----------------|
| Access child's data | Parent dashboard shows all kid data; `GET /api/kids/[id]/export` route (to be built) returns JSON export |
| Delete child's data | `deleteKid(kidId)` Server Function cascades delete; parent shown explicit confirmation dialog listing what will be deleted |
| Revoke consent | Parent can delete the entire family account from Settings → cascades to all rows |
| No further collection | On account deletion, all rows are hard-deleted (not soft-deleted) within 30 days per retention policy |

### Data Retention Policy

| Data type | Retention | Method |
|-----------|-----------|--------|
| `transactions` | Indefinite (financial record) | No purge; cascade delete on family deletion |
| `quiz_attempts` | 90 days | Vercel cron: `DELETE FROM quiz_attempts WHERE attempted_at < NOW() - INTERVAL '90 days'` |
| `sessions` (Auth.js) | 30 days (session expiry) | Auth.js automatic expiry |
| `meetup_rsvps` | 90 days post-event | Vercel cron |
| `competition_entries` | 1 year (leaderboard history) | Vercel cron |
| `lesson_progress`, `badges_earned`, `streaks` | Until account deletion | Cascade delete |
| Cloudflare R2 assets (chore photos) | 90 days | R2 lifecycle rule (set in Cloudflare dashboard) |
| Meetup recordings | 90 days | R2 lifecycle rule |
| Resend email logs | Per Resend's retention policy | Resend dashboard — review before launch |

### kidSAFE / PRIVO Safe Harbor (Recommended Pre-Launch)

The FTC recognizes COPPA safe harbor certification programs. Obtaining certification from
**kidSAFE** (https://www.kidsafeseal.com) or **PRIVO** (https://www.privo.com) provides:
- An FTC-acknowledged compliance pathway
- Privacy policy review by specialists
- Annual audit process
- Display of certification seal (trust signal for parents)

**Cost estimate:** $1,500–$3,000 initial application fee. **UNVERIFIED — confirm current pricing
with kidSAFE/PRIVO directly before budgeting.** Strongly recommended before any paid marketing.

---

## 7. Privacy Policy Requirements

The following sections are required by COPPA 16 CFR Part 312 §312.4 and must appear in the
published Privacy Policy before any data is collected from users:

1. Name and contact details of all operators collecting or maintaining children's PII
2. Types of personal information collected from children
3. How the information is used
4. Whether information is disclosed to third parties (and which third parties)
5. That a parent can review, request deletion of, and refuse further collection of their child's data
6. How the operator maintains the confidentiality, security, and integrity of the data
7. That the operator retains information only as long as necessary

> **Action required:** Have a qualified attorney draft the Privacy Policy and Terms of Service
> before launch. This document is a design spec, not legal advice.

---

## 8. Security Measures Summary

| Threat | Mitigation |
|--------|-----------|
| PIN brute-force on kid profile switch | Upstash rate limit: 3 attempts / 5 min per `kidId`; lockout notification to parent via Resend |
| Session hijacking | Auth.js v5 HTTP-only cookie sessions; `Secure` + `SameSite=Lax` flags; CSRF protection built into Auth.js |
| Cross-family data access | RLS policies in Neon (DB layer) + `session.familyId` check in every Server Function (app layer) — defense in depth |
| Injection of free-text content by kids | `crewComments` stores only `phrase_id` integer; free-text input fields are absent from kid UI |
| Unauthorized stock trading simulation (underage) | `initPortfolio({ portfolioType: 'realplay' })` checks `age_derived(dob) >= 10` server-side |
| Parent consent bypass | `addKid()` blocks on `coppa_consent_at IS NULL`; enforced in DB via check constraint as well |
| Data exfiltration via strategy notes | `strategy_notes.note_text` URL-stripped server-side before insert; parent-visible at all times |
| R2 presigned URL abuse | Presigned URLs expire in 15 min; scoped to a single object key; 5 requests/min rate limit |

---

## 9. References

- [T1] FTC COPPA Rule (16 CFR Part 312): https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa ⚠ verify-live
- [T1] FTC COPPA FAQ: https://www.ftc.gov/tips-advice/business-center/guidance/complying-coppa-frequently-asked-questions ⚠ verify-live
  *"The Rule applies to operators of commercial Web sites and online services directed to children under 13 that collect, use, or disclose personal information from children."*
- [T1] AAP Council on Communications & Media (2016): screen time recommendations
  https://www.healthychildren.org/English/family-life/Media/Pages/Where-We-Stand-TV-Viewing-Time.aspx ⚠ verify-live
- [T1] WCAG 2.2 AA: https://www.w3.org/TR/WCAG22/
- [T2] Common Sense Media Privacy Program: https://www.commonsensemedia.org/privacy-program ⚠ verify-live
- [T2] kidSAFE COPPA Safe Harbor: https://www.kidsafeseal.com ⚠ verify-live
- [T2] PRIVO COPPA Safe Harbor: https://www.privo.com ⚠ verify-live
- [T2] Research doc §4 (this project): COPPA compliance basics and "what we must NOT do" guide
```

---

## Files Created & Line Counts

| # | File path | Est. lines | Status |
|---|-----------|-----------|--------|
| 1 | `docs/adr/ADR-001-architecture.md` | ~295 | ✅ Complete |
| 2 | `docs/adr/ADR-002-data-model.md` | ~370 | ✅ Complete |
| 3 | `docs/adr/ADR-003-api-surface.md` | ~340 | ✅ Complete |
| 4 | `docs/design/age-band-modes.md` | ~310 | ✅ Complete |
| 5 | `docs/design/safety-rails.md` | ~320 | ✅ Complete |
| | **Total** | **~1,635** | |

> **To save these files:** Create the two directories first, then paste each section above into its respective file.
> ```powershell
> New-Item -ItemType Directory -Force -Path "C:\Users\dennha\projects\kidsfinance\docs\adr"
> New-Item -ItemType Directory -Force -Path "C:\Users\dennha\projects\kidsfinance\docs\design"
> ```

---

## 5-Bullet Executive Summary

1. **Monolith with purpose-built separation.** A single Next.js 16 App Router deployment handles all rendering, mutations (Server Functions), and API endpoints (Route Handlers) — no microservices overhead at v1 scale. Family-level Row-Level Security in Neon Postgres + application-layer `familyId` checks deliver defense-in-depth data isolation without a separate auth service.

2. **Seven new production dependencies, all justified.** `drizzle-orm` + `@neondatabase/serverless` (type-safe serverless DB), `next-auth` + `@auth/drizzle-adapter` (COPPA-safe parent session + kid PIN profile-switch), `zod` (runtime validation on all Server Functions per Next.js 16 docs warning), `@upstash/redis` (PIN brute-force protection + leaderboard cache), and `resend` (COPPA consent email). Pusher and AWS SDK are explicitly **not** added — SSE replaces Pusher for v1 real-time, and R2 uses native `crypto.subtle` AWS Signature V4.

3. **COPPA is structural, not a checklist.** Kids under 13 cannot hold independent sessions — they profile-switch within a parent session. `crew_memberships` requires a non-null `approved_by_parent_id` at the DB layer. `crew_comments` stores only a `phrase_id` integer — no child-authored text ever persists. `addKid()` is hard-blocked without a verified `coppa_consent_at` timestamp. The phrase library (30 curated phrases, age-filtered) eliminates free-text harassment vectors entirely.

4. **Three age bands mean three genuinely different apps sharing one schema.** Early (4–7): icon-only, 64px targets, audio-first, 3-tab nav, coin-stack metaphor. Middle (8–12): text+icon, dollar amounts, savings-goal radial rings, lessons with quizzes, crew panels. Teen (13–18): dense data tables, real-price portfolio simulator, compound interest calculator, paycheck simulation — features that exist in no current competitor app. Age is derived server-side from DOB and injected into `AgeGroupContext`; no age logic runs on the client.

5. **Zero real-money rails, maximum educational realism.** All balances are `integer` cents in Postgres. Real stock prices are API-fetched, cached with 15-minute TTL, labeled "PLAY MONEY" on every screen, and age-gated to 10+. Fictional Coinwood companies serve ages 4–9 without any financial-data dependency. The architecture is deliberately designed so that adding real-money rails (if ever desired in v2+) would require a separate service boundary — not a refactor of the existing codebase.
