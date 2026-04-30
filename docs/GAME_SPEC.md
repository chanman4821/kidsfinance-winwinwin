# WIN WIN WIN — Master Game Spec
**Status:** Proposed (awaiting user sign-off) · **Version:** 1.0 · **Date:** 2026-04-29

---

## TL;DR — what we're building

A free-to-play, Roblox-style **Tycoon RPG** where kids ages 6-18 start businesses, trade with NPC kids, negotiate buyouts, invest in simulated stocks, and build a financial empire. The first product to combine real curriculum-aligned financial-literacy with playable tycoon-game depth and cosmetic-only monetization.

**Wedge (validated by competitive research):**
> The market has a clean blind spot at the intersection of *playable tycoon depth* + *real financial literacy curriculum* + *F2P social design* for ages 6-18. No fintech app, no Roblox tycoon, no EdTech product occupies this space.

---

## Locked decisions (user signed off)

1. **Monetization:** Free + creator economy (Roblox model). Cosmetics + parent-gated Gem IAP + brand partnerships + teen-creator economy v3+. **No pay-to-win.** Gems buy cool, not power.
2. **Wedge / Pitch:** "A tycoon RPG where kids start any business they want, trade with other kids, negotiate buyouts, invest in stocks, and build an empire — the first simulation that teaches finance & business by letting kids actually run them."
3. **MVP scope:** Single-player + 50-NPC trading partners + 8 starter ventures + simulated stock market (12 tickers) + 3-round acquisition mechanic + weekly leaderboard. Multiplayer hooks scaffolded but mocked with NPCs for v1.

---

## Four-spec stack

This master doc is a 5-minute read. Deep dives:

| File | What's in it |
|---|---|
| **`docs/spec/01-research.md`** | Competitive landscape brief — Greenlight/GoHenry/Step/FamZoo, Roblox economy mechanics, Prodigy/SIFMA EdTech, COPPA enforcement (Epic $275M, Xbox $20M, Alexa $25M, TikTok pending). Tier-1 sources cited (Roblox 10-K FY2025, FTC, SIFMA, NextGen PF). Confidence 0.86. |
| **`docs/spec/02-architecture.md`** | System design — Next.js 16 + Drizzle + Neon + Auth.js v5 + Pusher + Stripe + PostHog + Sentry. Server-authoritative CQRS. State machine (`GameState`, `GameAction`, reducer). 14 DB tables. NPC `TradingPartner` interface (v1 NpcKid → v2 RealKid swap). Stock market (Ornstein-Uhlenbeck mean-reverting). 5 build phases. 3 ADRs. 12 acceptance criteria. |
| **`docs/spec/03-economy.md`** | Currency taxonomy (Coins / Gems / Stars). 8-venture catalog with ROI numbers. Level 1-50 XP curve. Stock volatility bands. Acquisition multiples (3x-7x). Anti-farming royalty. 5 Gem SKUs. Brand partnership pricing tiers ($15K-$150K/mo). Curriculum map to NextGen PF + CEE + Jump$tart standards. 5 post-launch tuning levers. |
| **`docs/spec/04-data-model.md`** | Full Drizzle schema (~1300 lines) for 14 tables: players, ventures, transactions (append-only ledger), stock_holdings (sharesX10000 bigint, no floats), market_prices, employees, npc_roster, trade_offers, acquisitions, loans, leaderboard, seasons, parent_consents (immutable COPPA audit), mutation_log (idempotency keys). Plus 5 query helpers. |

---

## The three pillars (decided across all 4 specs)

### Pillar 1: Server-authoritative game state (ADR-001)
- **Why:** localStorage is cheatable, no leaderboard integrity, COPPA-incompatible, can't migrate to multiplayer.
- **How:** All mutations through `POST /api/game/action` → Drizzle transaction → returns full snapshot. Optimistic UI for snappiness, server reconciles within 1 round-trip. Idempotency keys + Vercel KV rate limits prevent double-spend + spam.
- **Cost:** ~$40/mo at 1K DAU (Neon + Vercel + KV).

### Pillar 2: Deterministic seeded RNG, no LLM in hot path (ADR-002)
- **Why:** LLM latency 500-2000ms breaks the tycoon loop. Non-deterministic = unfair perception. Under-13 needs content safety. Cost unbounded.
- **How:** All NPC trade offers + stock prices derive from `seededRandom(seed + day)`. NPC personality parameterized (4 types). Trade rationaleText from kid-friendly lookup table.
- **Effect:** deterministic, testable, reproducible, offline-capable, zero marginal cost.

### Pillar 3: TradingPartner interface as v1→v2 multiplayer seam (ADR-003)
- **Why:** Direct NpcKid coupling = engine rewrite when v2 ships real-kid trading. Pusher channel renames break live mobile clients.
- **How:** v1 NpcKid + v2 RealKid both implement TradingPartner. Engine depends only on the interface. Pusher topology (`private-player-{id}`, `presence-season-{id}`, `presence-trade-floor`) locked from day 1. `trade_offers.from_npc_id` + `from_player_id` both nullable.
- **Effect:** v2 multiplayer is an *additive* change — zero engine rewrites.

---

## The core loop

```
            ┌──────────────────────────────────────────────────────────────┐
            │                        DAILY SESSION                         │
            │                                                              │
   ┌────────▼──────┐    ┌──────────┐    ┌─────────┐    ┌──────────────┐  │
   │  COLLECT      │───▶│ REINVEST │───▶│  TRADE  │───▶│   COMPETE    │  │
   │  revenue from │    │ in venture│    │  with   │    │  on weekly   │  │
   │  ventures     │    │ upgrade   │    │   NPC   │    │  leaderboard │  │
   │  every hour   │    │ /new biz  │    │  /stock │    │              │  │
   └───────────────┘    └──────────┘    └─────────┘    └──────────────┘  │
            ▲                                                              │
            └──────────────────────────────────────────────────────────────┘

   30-second win:    tap collect on idle ventures → see Coins credited
   5-minute mission: NPC mini-quest (deliver order, negotiate price)
   30-min session:   chapter quest + 2 lessons + 3 stock trades + 1 upgrade
   7-day arc:        ROI hit → next venture unlock + streak + leaderboard
```

**Player verbs (12 total):** COLLECT_REVENUE / UPGRADE_VENTURE / HIRE_EMPLOYEE / BUY_STOCK / SELL_STOCK / ACCEPT_TRADE / REJECT_TRADE / INITIATE_ACQ / DONATE / TAKE_LOAN / REPAY_LOAN / FRANCHISE_VENTURE.

---

## The 8 starter ventures (per economy spec)

| Lvl | Venture | Unlock | Net/day | ROI | Skill taught |
|---|---|---|---|---|---|
| 1 | 🍋 Lemonade Stand | 50 | 65 | 1d | Revenue vs cost |
| 3 | 🍬 Candy Shop | 350 | 115 | 3d | Markup + restock |
| 5 | 🧪 Slime Lab | 1,200 | 240 | 5d | Batch production |
| 8 | 🌿 Lawn Mowing | 3,000 | 450 | 7d | Labor scheduling |
| 10 | 🐾 Dog Walking | 6,500 | 800 | 8d | Service contracts |
| 12 | 🎨 Art Commissions | 12,000 | 1,400 | 9d | Pricing creative work |
| 20 | ��️ Gaming Cafe | 40,000 | 4,000 | 10d | Overhead vs throughput |
| 25 | 🚚 Food Truck | 120,000 | 9,800 | 12d | Logistics + location bidding |

---

## COPPA compliance baseline (non-negotiable)

| Risk | Guardrail |
|---|---|
| Epic Games $275M fine (chat ON by default for <13) | Chat disabled by default for <13. Parent must explicitly enable. |
| Xbox $20M fine (collected data before consent) | NO data collection until parent consent flow completes. |
| Amazon Alexa $25M fine (retained data after deletion request) | Hard-delete child PII on consent revocation per COPPA Article 6. |
| TikTok pending (no separate <13 vs 13+ pipeline) | **Separate data pipelines from day 1** for 6-12 (COPPA tier) vs 13-18 (COPPA-exempt). No retrofitting. |
| Roblox 10-K Jan 2026 mandatory age-check | Mandatory parent email at signup for under-13. Resend signed-JWT consent link 48h TTL. |

---

## 5 build phases

| Phase | Weeks | Scope | Exit criterion |
|---|---|---|---|
| **0 — Scaffold** | 1 | DB migrations (14 tables), Auth.js v5, COPPA flow, Stripe webhook skeleton, Sentry/PostHog, Vercel cron stubs, Pusher server | New 13+ player signs up; <13 parent consent flow sends email and creates linked accounts; all tables in Neon |
| **1 — Single Venture Loop** | 2-4 | Earn → reinvest → level-up loop server-authoritative. Jars (save/spend/donate). First NPC employee. Single-season leaderboard. Anti-cheat guards. | End-to-end loop runs, leaderboard shows real data, `revenue_collected` + `level_up` PostHog events fire |
| **2 — Stock Market** | 5-6 | 12 tickers, daily tick cron, integer share accounting, Recharts portfolio, news events, lessons | Daily cron updates prices, buy/sell <300ms p95, `stock_traded` fires |
| **3 — M&A + NPC Trading** | 7-9 | 50-NPC roster, `proposeTrade()` engine, trade UI, 3-round acquisition, loans, credit score, franchise | Cash+loan acquisition end-to-end atomic, NPC sends ≥1 offer within 24h of L3 reach |
| **4 — Multiplayer/Social** | 10-13 | RealKid implements TradingPartner. presence-trade-floor live. Real P2P trades. Real-time leaderboard. Friends. Weekly reset. | 2 real players complete a trade, leaderboard updates <60s |
| **5 — Cosmetics + Brand** | 14-16 | Cosmetic shop. Stripe Family Plan Gems. Parent spending cap enforced at checkout. Brand partnership hooks. | Parent budget enforced, Stripe webhook grants items, no economy advantage from paid |

---

## What gets BURNED (current `/app`)

- `/play/coinland` chore-tap demo
- `/play/village` lemonade-only single-screen
- `/play/markets` static-stock picker
- localStorage-only persistence
- Current 3-route page model (replaced by single tycoon world + venture / stocks / trade / acquire / leaderboard / parent dashboard sub-routes)

## What we KEEP

- Next.js 16 + Tailwind v4 + TypeScript scaffolding
- All authored skills in `~/.copilot/skills/*.md`
- All deps already in `package.json` (Drizzle/Neon/Auth.js/Stripe/Pusher/PostHog/Sentry/Recharts)
- Roblox-bold visual language (Bungee + Press Start 2P fonts, 5px black borders, 8px black stamp shadows)
- Coach Coin mascot + KidAvatar customization SVGs
- `lib/markets.ts` LCG implementation (extended into the new mean-reverting model)

---

## 12 MVP acceptance criteria (excerpted from architecture spec §14)

1. New 13+ player completes age-gate → name → venture pick in <2 min, game world loads with `cashBalanceCents=0` in Postgres
2. <13 entry blocks game world without parent consent; auth middleware returns 403 from AWAITING_CONSENT
3. Server authority: revenue collected reflects in Neon within 500ms; localStorage edits have ZERO effect
4. Idempotency: same idem key twice → identical response; transactions table has exactly 1 row
5. Rate limit: 11th COLLECT_REVENUE in 60s on same venture returns 429 + retry-after
6. Stock market: 00:00 UTC cron updates 12 tickers, `market-tick` Pusher event reaches client <5s
7. NPC trade offer: within 24h of L3, ≥1 offer in `trade_offers` triggers `trade_offered` event
8. Leaderboard: top 10 updated <60s of any portfolio change. ISR stale-while-revalidate 60s
9. Acquisition: cash-financed M&A end-to-end atomic — no partial state on mid-negotiation crash
10. Parent dashboard: shows linked child cash/ventures/XP. Weekly spending limit. Stripe checkout rejects over-limit
11. Observability: every action exception in Sentry with `player_id` + `action.type` tags. P95 latency in Sentry perf
12. Stripe Family: webhook sets `stripe_customer_id` + activates Gems balance within 30s

---

## Open questions for sign-off

1. **Roblox-style avatar system** — keep current Coach Coin + KidAvatar SVGs, OR commission illustrated character pack (delays Phase 1, costs ~$3-5K)?
2. **Currency naming** — keep "Coins / Gems / Stars" OR pick branded names (e.g., "Wins / Stash / Rep")?
3. **Charity tie-in** — DONATE verb routes to which real-world partner (DonorsChoose, Junior Achievement, GiveDirectly)? Or simulated only for v1?
4. **Beta gate** — closed alpha (10 families) → closed beta (100) → public, OR straight to public soft launch?
5. **Parent product surface** — separate `/parent` web app OR same app with role-based view?

---

*Sign off this master spec to unblock Phase 0 (DB scaffold + auth + COPPA flow). Phase 0 is non-game-loop work and can run in parallel with answering the 5 open questions.*
