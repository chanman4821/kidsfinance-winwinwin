# Win Win Win — Architecture Spec
**Version:** 0.1 · **Status:** Proposed · **Author:** Architect agent

## Brief
- **Problem:** v0 stores all state in localStorage (cheatable, no leaderboard, COPPA-incompatible, can't migrate to multiplayer).
- **Decision:** Promote v0 functional reducer to server-authoritative CQRS on locked stack (Next.js 16 + Drizzle + Neon + Auth.js v5 + Pusher + Stripe + PostHog + Sentry).
- **Riskiest assumption:** Every action = server round-trip. Need <200ms perceived latency via optimistic UI.

## 1. System Diagram
Client (Next.js + optimistic UI) → Auth.js middleware (COPPA boundary) → Route handlers → Drizzle txn → Neon Postgres + Vercel KV (rate limits, idempotency). Pusher pushes state-update events. Stripe webhook for billing. PostHog events anonymized for under-13.

## 2. Persistence
**Postgres (source of truth, all game state):** players, game_states, ventures, transactions (append-only ledger), stock_holdings (sharesX10000 bigint, no floats), market_prices, employees, npc_roster, trade_offers, acquisitions, loans (rate_bps), leaderboard, seasons, parent_consents (immutable COPPA audit).

**Vercel KV (ephemeral):** `rl:{player}:{verb}` 60s rate limit, `idem:{key}` 24h dedup, `tick:{player}` 24h, `npc_offers:{player}` 6h.

**Client:** UI prefs only (darkMode, soundEnabled). NEVER game state.

## 3. Auth + COPPA
Auth.js v5 + Credentials/Google OAuth (13+ only).

**Under-13 state machine:** UNKNOWN → age_gate → UNDER_13 → parent_email_sent → AWAITING_CONSENT → (consent_granted) → ACTIVE | (consent_denied) → BLOCKED.

**Flow:** birth year only (minimal data) → age computed → parent email collected → Resend signed-JWT consent link 48h TTL → parent creates Auth.js account → grants consent (immutable parent_consents row) → child account created with parent_id FK + Stripe Family Plan attached.

**Parent dashboard:** read-only child portfolio + session time + spending limits + revoke consent (hard-deletes child PII per COPPA Article 6).

## 4. Game State Machine (TypeScript)

```ts
export type VentureKind = "lemonade"|"candy"|"slime"|"lawn_mowing"|"art"|"dog_walking"|"gaming_cafe"|"food_truck";
export type GamePhase =
  | { phase: "onboarding"; step: "venture_pick"|"name_pick" }
  | { phase: "playing" }
  | { phase: "season_ended"; seasonId: string; finalRank: number }
  | { phase: "suspended"; reason: string };
export type Venture = { id: string; kind: VentureKind; level: number; status: "building"|"open"|"closed"|"franchised"; dailyRevenueCents: number; locationId: string; employeeIds: string[] };
export type StockHolding = { ticker: string; sharesX10000: number; avgCostCents: number };
export type Loan = { id: string; principalCents: number; rateBps: number; termDays: number; balanceCents: number; status: "active"|"paid_off"|"defaulted" };
export type GameState = { playerId: string; seasonId: string; phase: GamePhase; cashBalanceCents: number; creditScore: number; ventures: Venture[]; stockHoldings: StockHolding[]; loans: Loan[]; employeeIds: string[]; xp: number; level: number; totalDonatedCents: number; badges: string[]; lastTickAt: string };
export type GameAction =
  | { type: "COLLECT_REVENUE"; ventureId: string; idem: string }
  | { type: "UPGRADE_VENTURE"; ventureId: string; idem: string }
  | { type: "HIRE_EMPLOYEE"; npcId: string; ventureId: string; idem: string }
  | { type: "BUY_STOCK"; ticker: string; sharesX10000: number; idem: string }
  | { type: "SELL_STOCK"; ticker: string; sharesX10000: number; idem: string }
  | { type: "ACCEPT_TRADE"; offerId: string; idem: string }
  | { type: "REJECT_TRADE"; offerId: string }
  | { type: "INITIATE_ACQ"; targetNpcId: string; offer: AcquisitionOffer; idem: string }
  | { type: "DONATE"; amountCents: number; charityId: string; idem: string }
  | { type: "TAKE_LOAN"; amountCents: number; termDays: number; idem: string }
  | { type: "REPAY_LOAN"; loanId: string; amountCents: number; idem: string }
  | { type: "FRANCHISE_VENTURE"; ventureId: string; idem: string };
export type GameReducer = (state: GameState, action: GameAction, ctx: { db: DrizzleClient; playerId: string }) => Promise<GameState>;
```

**Tick cadence (hybrid):** Ventures accrue revenue every real-world hour (Vercel cron `:00`). Stock prices tick once per calendar day (`0:00 UTC`). NPC trade proposals refresh every 6 hours per player. NOT a real-time loop.

## 5. NPC Trading Partners (deterministic, no LLM)

```ts
export type NpcPersonality = "aggressive"|"cautious"|"generous"|"competitive";
export type NpcKid = { id: string; name: string; emoji: string; personality: NpcPersonality; seed: number; ventureKinds: VentureKind[]; cashBalanceCents: number; stockHoldings: StockHolding[]; level: number };
export type TradeOffer = { id: string; fromNpcId: string; toPlayerId: string; give: {...}; want: {...}; expiresAt: string; rationaleText: string };

export interface TradingPartner {
  id: string; displayName: string; avatarEmoji: string; ventures: Venture[]; level: number;
  proposeTrade(toPlayer: GameState, marketPrices: Record<string,number>, day: number): Promise<TradeOffer | null>;
  respondToTrade(offer: TradeOffer): Promise<"accept"|"reject"|"counter">;
}

export function proposeTrade(npc: NpcKid, player: GameState, marketPrices: Record<string,number>, day: number): TradeOffer | null;
```

**Logic:** seed = `npc.seed + day`. Roll trade probability by personality (aggressive=0.6 / cautious=0.2 / generous=0.4 / competitive=0.5). If yes, scan player ventures for kind overlap, value at `dailyRevenueCents × 365 × sectorPE`, propose cash at 10–20% premium (personality modulates). Offer expires 24h. Pusher event `new-trade-offer` on `private-player-{playerId}`.

## 6. Stock Market (Ornstein-Uhlenbeck mean-reverting)

```
p(t+1) = p(t) + θ × (μ - p(t)) + σ_sector × ε_sector + σ_idio × ε_idio
```
- θ = 0.03 mean-reversion speed
- ε_sector = shared per-sector noise (correlated moves)
- σ Tech 2.5%/day, Food 1.2%, Entertainment 1.8%, Apparel 1.5%
- News event: `seededRandom(day) < 0.15` → random sector ±5–15% one-day shock
- Headlines from kid-friendly template lookup (e.g. "🍔 McDonald's launches space burger — shares jump!")
- Daily cron `/api/stock/tick`: compute → upsert market_prices → mark-to-market all holdings → recompute leaderboard → push `market-tick` to `presence-season-{seasonId}`

## 7. Acquisition / M&A

**Valuation:** `enterpriseValue = dailyRevenueCents × 365 × sectorPE × (1 + npcLevel × 0.1)`
sectorPE: lemonade=8 candy=10 slime=12 lawn_mowing=6 art=9 dog_walking=7 gaming_cafe=15 food_truck=11.

**Negotiation FSM (3 rounds max):** INITIATED → NPC_COUNTERED → PLAYER_RECOUNTERED → [ACCEPTED|REJECTED|LAPSED]. NPC accepts immediately if offer ≥ 115% valuation. NPC counters at 112% if 90–115%. NPC rejects if <90%.

**Financing:** Cash (atomic txn deducted), Loan (TAKE_LOAN first; rate = 500 + (850 - creditScore) × 2 bps; term 90–180d), Stock-swap (only competitive/generous personalities accept).

**Close:** clone NPC venture into player ventures table at level 1. Soft-delete NPC for that player's season.

## 8. Anti-Cheat Guardrails

**CQRS:** commands → /api/game/action, queries read state. Client never mutates balance.

**Idempotency:** every action carries `idem` UUID → KV check `idem:{key}` → cached response if hit; else process in Drizzle txn → write KV (24h TTL).

**Rate limits (KV sliding window):** COLLECT_REVENUE 30/hr per venture / BUY|SELL_STOCK 20/hr per player / ACCEPT|REJECT_TRADE 10/hr / INITIATE_ACQ 5/hr / DONATE 10/hr.

**Validation guards:** `cashBalanceCents >= 0` DB constraint (no negative without active loan). `sharesX10000 > 0` before sell. Revenue rejected if venture status ≠ open. Zod validation pre-reducer. Transactions table append-only via Postgres RLS.

## 9. Multiplayer Hooks for v2

`TradingPartner` is the seam. NpcKid (v1) and RealKid (v2 Pusher-backed) both implement it. Engine never calls NpcKid directly.

**Pusher channel topology (locked now):**
- `private-player-{playerId}` — state-update / new-trade-offer / loan-approved / achievement-unlocked
- `private-venture-{ventureId}` — revenue-accrued / employee-event
- `presence-season-{seasonId}` — leaderboard-update / market-tick / player-joined
- `presence-trade-floor` — open-trade-broadcast (v2 only)

`trade_offers.from_npc_id` nullable + `from_player_id` nullable → either source works without migration in v2.

## 10. Telemetry Event Taxonomy (PostHog)

| event | required props | when fires |
|---|---|---|
| venture_started | player_id, venture_kind, cash_at_start_cents | onboarding venture pick |
| revenue_collected | player_id, venture_id, venture_kind, amount_cents, venture_level | COLLECT_REVENUE |
| venture_upgraded | player_id, venture_id, new_level, cost_cents | UPGRADE_VENTURE |
| stock_traded | player_id, ticker, side, shares, price_cents, portfolio_value_cents | BUY_STOCK / SELL_STOCK |
| trade_offered | player_id, npc_id, npc_personality, offer_value_cents, want_value_cents | NPC offer inserted |
| trade_accepted | player_id, npc_id, offer_id, net_value_delta_cents | ACCEPT_TRADE |
| trade_rejected | player_id, npc_id, offer_id | REJECT_TRADE |
| acquisition_initiated | player_id, npc_id, offer_cents, valuation_cents, round | INITIATE_ACQ |
| acquisition_completed | player_id, npc_id, final_price_cents, financing_type, rounds_taken | ACCEPTED status |
| level_up | player_id, new_level, xp_total, unlock_name | level increments |
| loan_taken | player_id, amount_cents, rate_bps, term_days | TAKE_LOAN |
| donation_made | player_id, amount_cents, charity_id, lifetime_donated_cents | DONATE |
| leaderboard_rank_changed | player_id, season_id, old_rank, new_rank | leaderboard tick |
| parent_consent_granted | parent_id, child_id, consent_method, age_band | parent_consents insert |
| season_ended | player_id, season_id, final_rank, portfolio_value_cents, total_ventures | season status=ended |

Under-13: player_id replaced with anonymized session_hash until consent confirmed.

## 11. File Structure

```
kidsfinance/
├── app/
│   ├── (auth)/sign-in, sign-up, parent-consent/[token]
│   ├── (game)/play, venture/[id], stocks, trade, acquire/[npcId], leaderboard
│   ├── (parent)/dashboard, spending-limits, billing
│   └── api/
│       ├── game/action (POST mutations), state (GET), tick (cron hourly)
│       ├── stock/tick (cron daily 00:00 UTC)
│       ├── npc/propose (cron 6-hourly)
│       ├── leaderboard (ISR 60s)
│       ├── stripe/webhook
│       └── auth/[...nextauth]
├── lib/
│   ├── game/{state,engine,ventures,levels,economy}.ts
│   ├── npc/{types,engine,roster}.ts
│   ├── market/{types,simulation,news,sectors}.ts
│   ├── acquisition/{valuation,negotiation}.ts
│   ├── auth/{config,coppa}.ts
│   ├── pusher/{server,channels}.ts
│   ├── stripe/family.ts
│   ├── telemetry/events.ts
│   ├── anti-cheat/guards.ts
│   └── db/index.ts
├── db/
│   ├── schema/ (14 files: players, ventures, transactions, stock-holdings, employees, npc-roster, trade-offers, acquisitions, loans, market-prices, leaderboard, seasons, parent-consents)
│   ├── migrations/
│   └── seed.ts
├── components/
│   ├── game/{VentureCard,VentureUpgradeModal,TradeOfferModal,AcquisitionFlow,StockChart,LeaderboardTable}.tsx
│   ├── ui/{CoinDisplay,XpBar,BadgeShelf}.tsx
│   ├── auth/{AgeGate,ParentConsentForm}.tsx
│   └── layout/{GameShell,NavBar}.tsx
└── public/{sounds,sprites}/
```

## 12. Build Phases

**Phase 0 — Scaffold (Wk 1):** all DB migrations, Auth.js v5, COPPA gate + consent flow, Stripe webhook skeleton, Sentry+PostHog init, Vercel cron stubs, Pusher server client. Exit: 13+ sign-up works, parent consent flow sends email and creates linked accounts, all tables in Neon.

**Phase 1 — Single Venture Loop (Wk 2-4):** earn → reinvest → level-up loop server-authoritative. Jars (save/spend/donate). Hire first NPC employee. Single-season leaderboard. Anti-cheat guards on all mutations. Exit: end-to-end loop runs, leaderboard real, revenue_collected + level_up events fire.

**Phase 2 — Stock Market (Wk 5-6):** 12 simulated tickers, daily tick cron, integer share accounting, Recharts portfolio chart, news events, lessons. Exit: cron runs, prices visible, buy/sell <300ms p95, stock_traded fires.

**Phase 3 — M&A + NPC Trading (Wk 7-9):** 50 NPCs/season, proposeTrade engine, trade UI, 3-round acquisition, loans, credit score, franchise. Exit: cash+loan acquisition end-to-end, NPC sends ≥1 offer within 24h of L3 reach.

**Phase 4 — Multiplayer/Social (Wk 10-13):** RealKid implements TradingPartner. presence-trade-floor live. Real P2P trades. Real-time leaderboard. Friend system. Weekly reset. Exit: 2 real players trade end-to-end, leaderboard <60s update.

**Phase 5 — Cosmetics + Monetization (Wk 14-16):** cosmetic shop (avatars, stand skins, venture themes), Stripe Family Plan stars currency (cosmetics only — no P2W), parent spending controls at checkout, brand partnership hooks. Exit: parent budget enforced, Stripe webhook grants items, no economy advantage from paid.

## 13. ADRs

**ADR-001 — Server-authoritative CQRS via Drizzle txns**
Context: localStorage cheatable, no leaderboard, COPPA-incompatible.
Decision: All economy mutations through `/api/game/action`. Server reducer in `db.transaction()` updates game_states + transactions atomically. Returns full snapshot. Optimistic UI replaced by server response within 1 round-trip. localStorage only UI prefs.
Consequences: ✅ leaderboard integrity ✅ parent dashboard real-time ✅ trivial anti-cheat ⚠️ network round-trip per action (mitigated by optimistic UI + Pusher) ⚠️ Vercel cold-starts 200-400ms (mitigated by Neon connection pooling).

**ADR-002 — Deterministic seeded LCG, no LLM in hot path**
Context: LLM latency 500-2000ms incompatible with snappy tycoon loop. Non-deterministic = unfair perception. Under-13 needs content safety. Cost unbounded.
Decision: All NPC + stock decisions from `seededRandom(seed + day)`. Personality parameterized (4 types × weights). Trade rationaleText from kid-friendly lookup table.
Consequences: ✅ deterministic, testable, reproducible ✅ zero marginal cost ✅ offline-capable ⚠️ NPC variety bounded (compensated by 50 NPCs/season × trait combos).

**ADR-003 — TradingPartner interface as v1→v2 seam; Pusher topology locked now**
Context: v1 NPCs, v2 real kids. Direct NpcKid coupling = engine rewrite for v2. Channel rename = breaks live mobile clients.
Decision: NpcKid + future RealKid both implement TradingPartner. Engine depends only on interface. Channel names constants in lib/pusher/channels.ts treated as public API. trade_offers.from_npc_id + from_player_id both nullable.
Consequences: ✅ v2 multiplayer = additive change ✅ channels won't break clients ⚠️ minor over-engineering in v1 (8-line interface).

## 14. Acceptance Criteria — MVP Done

1. New 13+ player completes age-gate → name → venture pick in <2 min, game world loads with cashBalanceCents=0 in Postgres.
2. <13 entry blocks game world without parent consent flow; auth middleware returns 403 from AWAITING_CONSENT account.
3. Server authority: collect revenue reflects in Neon within 500ms. localStorage edits have ZERO effect on balance after next server response.
4. Idempotency: same idem key twice returns identical response; transactions table has exactly 1 row for that key.
5. Rate limit: 11th COLLECT_REVENUE in 60s on same venture returns 429 with retry-after.
6. Stock market: daily 00:00 UTC cron updates 12 tickers in market_prices, Pusher market-tick reaches client <5s.
7. NPC trade offer: within 24h of player L3, ≥1 NPC offer in trade_offers triggers trade_offered event.
8. Leaderboard: top 10 updated <60s of any portfolio change. ISR stale-while-revalidate max-age 60s.
9. Acquisition: cash-financed M&A end-to-end atomic — no partial state on crash mid-negotiation.
10. Parent dashboard: shows linked child cash/ventures/XP. Sets weekly spending limit. Stripe checkout rejects over-limit.
11. Observability: every /api/game/action exception in Sentry with player_id + action.type tags. P95 latency in Sentry perf dashboard.
12. Stripe Family: webhook sets stripe_customer_id + activates stars balance within 30s.

---
*Status: Proposed. Sign-off required before Phase 1 begins.*
*Next: api-designer (OpenAPI 3.1 for /api/game/action), data-modeler (Drizzle DDL — IN FLIGHT), ux-ui-designer (game world wireframes by age band).*
