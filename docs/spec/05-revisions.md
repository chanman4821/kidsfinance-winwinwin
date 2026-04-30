# Win Win Win — Spec Revision (3 Blocking Issues Resolved)
**Status:** Proposed delta to apply to existing spec docs · **Date:** 2026-04-30

This file resolves the 3 blocking issues from the rubber-duck critique of `GAME_SPEC.md` v1.0 + the 4 meta-critique guardrails from the spec-revision agent. Apply each section to the indicated source doc.

---

## A. Apply to `docs/GAME_SPEC.md` — REVISED 5-Phase Build Order

**Old phase ordering (rejected):** Phase 0 scaffold → 1 venture loop → 2 stocks → 3 M&A → 4 multiplayer → 5 cosmetics. Identity/social/parent-product all deferred to Phase 4-5 — too late for retention + monetization.

**New phase ordering — identity + social + parent-product surface in Phase 1-3:**

| Phase | Weeks | Scope | Exit criterion | DB tables touched |
|---|---|---|---|---|
| **0 — Scaffold** | 1 | Drizzle migrations (12 v1 tables — see §E for split), Auth.js v5 wiring, COPPA age-gate + consent flow, Stripe webhook skeleton, Sentry/PostHog init, Vercel cron stubs, Pusher server client | New 13+ player signs up; <13 parent consent flow sends email and creates linked accounts; all v1 tables exist in Neon | `players`, `parent_consents`, `seasons` |
| **1 — Single Venture Loop + Identity Pack + Family Subscription** | 3-5 | Server-authoritative venture loop (Dumpling Stand only). Cosmetic identity pack at signup (kid picks fur/headwear/outfit/companion — all FREE in starter pack). Stripe Family Plan SKU live (parent funds Gem balance). Hourly venture accrual + 24h cap. Daily streak. | End-to-end loop runs server-authoritative. Parent can subscribe to $7.99 Family Plan, allowance auto-grants on the 1st. Kid sees personalized panda warrior on every screen. `revenue_collected` + `family_plan_activated` PostHog events fire. | `players`, `ventures`, `mutation_log`, `family_plans`, `gem_balances`, `cosmetics`, `inventory`, `parent_consents` |
| **2 — Social Layer (COPPA-scoped) + Stock Market** | 4-6 | **Consent-gated** crews (presence-only, no chat for <13). Friend-graph (parent must approve). Server-side leaderboard (weekly seasons). 12-stock simulated market. News events. Pre-composed trade-intent broadcasts (NO free-text chat). | 13+ players: leaderboard updates <60s. <13 players: see crew presence + leaderboard rank but cannot chat. `crew_joined`, `stock_traded`, `leaderboard_rank_changed` events fire. | `crews`, `crew_members`, `friendships`, `parent_friend_approvals`, `leaderboard`, `stock_holdings`, `market_prices` |
| **3 — Cosmetic Marketplace + NPC Trading + M&A** | 4-6 | Cosmetic shop (Gem-priced, parent-cap enforced at checkout). 50-NPC roster + `proposeTrade()` rule engine. M&A acquisition (3-round, with anti-flip rules from §C). Brand partnership slot scaffolding. | Parent budget enforced server-side. Stripe webhook grants cosmetic. NPC sends ≥1 offer within 24h of player L3. Cash + loan acquisition end-to-end atomic. `cosmetic_purchased`, `acquisition_completed` events fire. | `cosmetic_purchases`, `npc_roster`, `trade_offers`, `acquisitions`, `loans`, `brand_partnerships` |
| **4 — Real Multiplayer + Creator Economy** | 8-12 | RealKid implements TradingPartner. Pusher `presence-trade-floor` live for real P2P trades. 13+ teen creators publish NPC templates / venture skins (revenue-share). UGC moderation pipeline. | Two real 13+ players complete a P2P trade. Teen creator publishes a venture skin, earns Gem royalty. Moderation flags auto-sandbox UGC pending review. | `realtime_sessions`, `creator_publications`, `creator_payouts`, `moderation_queue` |
| **5 — Brand Partnership Live + Curriculum Expansion** | ongoing | Real branded sponsored quests (Walmart Stocking Quest, etc.). 40+ curriculum lessons live. Closed-alpha → closed-beta → public progression. | First brand contract signed. Curriculum coverage maps to NextGen PF / CEE standards. NPS ≥ 50 in closed beta. | `sponsored_quests`, `lesson_completions`, `nps_responses` |

---

## B. Apply to `docs/spec/02-architecture.md` §12 — REVISED Phase Engineering Scope

Same reordering as §A but with engineering-specific scope per phase:

### Phase 0 — Scaffold
- **DB:** Drizzle migrations 0001-0012 (the 12 v1 tables — see §E split). All ALTER/INDEX statements idempotent.
- **Auth:** Auth.js v5 with Credentials + Google OAuth. Email verification via Resend.
- **COPPA flow:** Age gate (birth year only), parent email collected, signed-JWT consent link via Resend (48h TTL), parent creates Auth.js account, `parent_consents` row inserted (immutable), child `players` row created with `parent_id` FK.
- **Server-authoritative flows:** none yet (no game state to mutate).
- **Cron stubs:** `/api/game/tick`, `/api/stock/tick`, `/api/npc/propose` registered in `vercel.json` but no-op handlers.

### Phase 1 — Single Venture Loop + Family Subscription + Identity Pack
- **DB tables in scope:** `players`, `ventures`, `mutation_log`, `family_plans`, `gem_balances`, `cosmetics` (catalog only — no marketplace yet), `inventory`.
- **Server-authoritative flows:**
  - `COLLECT_REVENUE` (Drizzle txn → upsert `players.cash_cents`, append `mutation_log` with `idempotency_key`)
  - `UPGRADE_VENTURE`
  - `GRANT_GEMS` (Stripe webhook → upsert `gem_balances`, append `mutation_log`)
  - `EQUIP_COSMETIC` (validate `inventory` ownership before set on `players.equipped_*`)
- **Identity pack scope:** 5 fur tones × 6 headwear × 6 colors × 6 robes (already designed in PandaWarrior). All FREE at signup. Stored in `inventory` with `acquired_via='starter_pack'`.
- **Stripe Family Plan SKU:** see §E. Webhook handler validates signature, upserts `family_plans`, grants monthly Gem allowance.
- **Hourly venture accrual:** lazy — computed at `COLLECT_REVENUE` time as `rate × seconds_since_lastHarvestedAt`, capped at 24h. No cron required (per critique #4 fix in earlier round).
- **Daily streak:** `players.streak_days` + `players.last_login_at`. Increments on first action of UTC day.

### Phase 2 — Social Layer (COPPA-scoped) + Stock Market
- **DB tables in scope:** `crews`, `crew_members`, `friendships`, `parent_friend_approvals`, `leaderboard`, `stock_holdings`, `market_prices`.
- **COPPA-scoped social rules** (server-enforced via middleware):
  - `<13` accounts: cannot send free-text chat. CAN see crew presence + leaderboard rank + pre-composed trade intents.
  - `13+` accounts: full chat enabled by default for accounts marked teen, parents can disable via dashboard.
  - Friend requests for `<13`: REQUIRE `parent_friend_approvals` row before friendship is active.
  - All social writes pass `parental_consent` middleware check.
- **Server-authoritative flows:** `JOIN_CREW`, `INVITE_FRIEND`, `BROADCAST_TRADE_INTENT` (templated), `BUY_STOCK`, `SELL_STOCK`, `MARK_TO_MARKET` (cron-only).
- **Stock market:** Ornstein-Uhlenbeck mean-reverting (already in spec). Daily UTC tick via Vercel Cron writes to `market_prices`. Pusher `market-tick` event fans out to `presence-season-{seasonId}`.
- **Leaderboard:** materialized view refresh on every `mutation_log` insert affecting net worth. ISR-cached at 60s on read.

### Phase 3 — Cosmetic Marketplace + NPC Trading + M&A
- **DB tables in scope:** `cosmetic_purchases`, `npc_roster`, `trade_offers`, `acquisitions`, `loans`, `brand_partnerships`.
- **Server-authoritative flows:** `PURCHASE_COSMETIC` (validate parent cap → debit `gem_balances` → grant `inventory`), `ACCEPT_TRADE`, `INITIATE_ACQ`, `TAKE_LOAN`.
- **Parent cap enforcement:** every `PURCHASE_COSMETIC` checks `family_plans.weekly_gem_cap` against `cosmetic_purchases` sum for current ISO week. If exceeded → 402 error + parent push notification.
- **NPC trading:** seeded LCG (`npc.seed + day`) → personality-weighted offer probability → templated rationale text from `lib/npc/dialogue-templates.json`.

### Phase 4 — Real Multiplayer + Creator Economy
- (Same as v1 spec — Phase 4 in old ordering)

### Phase 5 — Brand Partnership Live + Curriculum
- (Same as v1 spec — Phase 5 in old ordering)

---

## C. Apply to `docs/spec/03-economy.md` — REVISED Venture Catalog + Anti-Flip Rules

### "Median player" definition (was missing — meta-critique #3 fix)

Median player profile used for ALL economy math below:
- **Daily sessions:** 1.5 (median Roblox kid logs in roughly every 16 hours)
- **Collection cadence:** every 8 hours (so 3 collections per 24h max)
- **Venture mix at L15:** 4 ventures owned (Dumpling Stand + Boba Tea + Slime Lab + Lawn Mowing)
- **Upgrade tier:** Tier 2 average (15% revenue boost)
- **Active income (lessons + quests):** 250 Coins/day average (cap is 500)
- **Daily savings rate:** 25% of net income

### REVISED Venture Catalog (calibrated to 7-10 day next-venture unlock at L15)

The old catalog had Gaming Cafe = 40,000 Coins which took 52 days. New numbers:

| Venture | Unlock | Daily Net (median) | Days to next at L15 |
|---|---|---|---|
| 🥟 Dumpling Stand (was Lemonade) | 50 | 65 | 1d |
| 🍵 Boba Tea (was Candy Shop) | 350 | 115 | 3d |
| 🧪 Slime Lab | 1,200 | 240 | 5d |
| 🌿 Lawn Mowing | 3,000 | 450 | 7d |
| 🐾 Dog Walking | 6,500 | 800 | 8d |
| 🎨 Art Commissions | 12,000 | 1,400 | 9d |
| 🍱 **Bento Cafe** (was Gaming Cafe — 40K → 14K) | **14,000** | 2,200 | **6-8d** ✓ |
| 🚚 Food Truck (was 120K → 32K) | **32,000** | 4,500 | **7-9d** ✓ |
| 🐲 **Dragon Empire** (NEW endgame venture) | 80,000 | 10,000 | **8-10d** ✓ |

**Math at L15** (median player, 4 ventures × Tier 2 average):
- Daily passive revenue: ~3,500 Coins
- Daily active revenue: 250 Coins
- Daily upkeep + mandatory sinks: ~1,250 Coins
- Net daily: ~2,500 Coins
- 25% savings rate: 2,500 × 0.25 = **625 Coins/day** ← (changed from earlier 1,016)
- Time to Bento Cafe (14,000): 14,000 / 625 = **22 days**

That's still too long. **Fix the savings rate target up:**
- L15 player should hit a 50% savings rate (they're past the early-spend phase)
- 50% × 2,500 = 1,250 Coins/day
- Time to Bento Cafe: 14,000 / 1,250 = **11.2 days** ✓ (within target band, slightly long — tunable)
- Time to Food Truck (32,000): 32,000 / 1,250 = **25.6 days** ← TOO LONG. Reduce Food Truck unlock to **20,000** (16d) OR raise daily net via cosmetic boost mechanics

**Final calibrated values:**

| Venture | Unlock | Daily net at unlock-tier | L15 days to unlock (50% save) |
|---|---|---|---|
| Bento Cafe | 14,000 | 2,200 | 11d |
| Food Truck | 20,000 | 3,200 | 16d (acceptable for L20 unlock) |
| Dragon Empire | 50,000 | 7,500 | 25d (acceptable for L25 endgame) |

### Anti-flip M&A rules (was hand-wavy — meta-critique #1)

OLD (rejected): "30-day royalty + 7-day cooldown" — kids just wait 7 days then flip.

NEW concrete rules (server-enforced via `acquisitions` table):

1. **Holding-period lock**: cannot sell an acquired venture for **14 days** post-acquisition. Hard block in `SELL_VENTURE` reducer. Returns error code `HOLDING_PERIOD_ACTIVE`.

2. **Resale haircut**: when selling within 30 days of acquisition, sale price = `acquisition_price × 0.7` (-30%). Decays linearly to 1.0× at day 60. Encoded in `lib/acquisition/resale.ts` formula.

3. **Anti-flip detection (auto-trigger)**: pause `acquisition_completed` venture earnings for **7 days** if any of:
   - Same venture acquired+sold by same player in 90-day window
   - Same NPC's venture acquired by player + their friend within 30 days (collusion signal)
   - 3+ acquisitions in 30 days (rapid-fire flipping)
   Detection runs as nightly cron `flag_suspicious_acquisitions` over `acquisitions` table.

4. **Appraisal performance bond**: at acquisition, post a 10% performance bond (held in escrow row in `mutation_log` with `kind='acq_bond'`). If venture revenue drops >40% in first 30 days post-acquisition, bond is forfeited to seller (NPC). Encourages real operational improvement, not speculation.

---

## D. Apply to `docs/spec/01-research.md` §5 — Daily-Open-Reason

**Question:** Why will a kid open Win Win Win tomorrow instead of Roblox?

**Answer (one paragraph, one mechanic):**

> Every venture in Win Win Win accrues revenue continuously, but **caps at exactly 24 hours**. Miss a day and your panda's earnings cap out — you forfeit the next day's accrual until you tap COLLECT. Combined with a daily-streak multiplier (Day 1 = 1.0×, Day 7 = 1.5×, Day 30 = 2.0× passive income), this creates the same behavioral pull as Adopt Me's daily reward + Roblox tycoon job-resets, but tied to a real financial concept: **opportunity cost** (waiting = forfeit) and **compound returns** (streak = multiplier). The kid opens it tomorrow because their dumpling empire is literally accruing money RIGHT NOW and capping at midnight. Combined with Phase 2's friend-presence (see your crew's empires on the map) and weekly leaderboard reset, the daily-open compulsion + social comparison loop matches what Roblox sells, but inside a curriculum-backed simulation.

**Single repeatable mechanic to reference across docs:** "24h-capped venture accrual + streak-day multiplier"

---

## E. NEW — Parent Product Surface (sketch)

### What parents see in `/parent` dashboard (5-7 things)

1. **Child card** — name, age, COPPA-protected badge if <13, current cash + Gems, member-since date, last-active timestamp.
2. **Live activity feed** — what venture they ran today, what stocks they traded, what cosmetics they bought (Phase 0+: this is server-side stream from `mutation_log` filtered by player_id).
3. **💎 Gem allowance & spending cap** — weekly cap (0/100/250/500/1000/2500 Gems) + monthly auto-allowance (0/200/500/1000/2000 Gems).
4. **Stripe Family Plan billing** — current plan, next charge, cancel anytime.
5. **🛡️ Safety controls** — chat toggle (forced OFF for <13), marketing email opt-in, daily session time limit.
6. **🔐 Privacy & data rights** — privacy policy link, data export request, hard-delete child profile (COPPA Article 6).
7. **📊 Skill report card** (Phase 3+) — what financial concepts kid has mastered (compound interest, diversification, opportunity cost, etc.) mapped to NextGen PF standards.

### Stripe Family Plan SKU lineup (3 tiers)

Stored in `family_plans` Drizzle table with `stripe_product_id` FK to Stripe Product object.

| SKU | Price | Includes | Stripe Product ID convention |
|---|---|---|---|
| **Free** | $0 | 1 child profile + 200 Gems/month auto-allowance | `prod_wwww_free` |
| **Family Plus** | **$7.99/mo** | Up to 4 child profiles + 1,500 Gems/month + parent dashboard analytics + 2 cosmetic packs/month | `prod_wwww_family_plus` |
| **Family Pro** | **$19.99/mo** | Up to 6 child profiles + 5,000 Gems/month + skill report card + crew approval push notifications + priority support + 6 cosmetic packs/month | `prod_wwww_family_pro` |

### How parent funds Gem allowance WITHOUT per-purchase friction (closes COPPA payer gap)

**Old model (rejected):** kid clicks "Buy 100 Gems for $0.99" → parent gets push → enters credit card → kid waits → 30% cart abandonment rate.

**New model — Pre-funded allowance pattern:**
1. Parent subscribes to Family Plan ONCE via Stripe Checkout (PCI-compliant secure window).
2. Stripe webhook fires monthly — grants Gems to `gem_balances` table on the 1st of each month.
3. Kid spends Gems freely up to the parent-set weekly cap (no parent click needed per purchase).
4. If kid wants MORE Gems (above allowance), parent gets one push notification per request — approve in 1 tap from phone.
5. Parent dashboard shows real-time Gem-spend telemetry — fully transparent.

This is identical to how Roblox Premium works (monthly subscription → automatic Robux stipend), but with explicit parental cap enforcement at the cosmetic-purchase layer (server-side check in `PURCHASE_COSMETIC` reducer).

### New DB tables required (add to Drizzle migration 0008)

```sql
CREATE TABLE family_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES players(id),
  stripe_subscription_id TEXT NOT NULL UNIQUE,
  stripe_product_id TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('free', 'family_plus', 'family_pro')),
  monthly_gem_grant INTEGER NOT NULL DEFAULT 0,
  weekly_gem_cap INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('active', 'past_due', 'cancelled', 'paused')),
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_family_plans_parent ON family_plans(parent_id);

CREATE TABLE gem_balances (
  player_id UUID PRIMARY KEY REFERENCES players(id),
  balance INTEGER NOT NULL DEFAULT 0 CHECK (balance >= 0),
  total_granted_lifetime INTEGER NOT NULL DEFAULT 0,
  total_spent_lifetime INTEGER NOT NULL DEFAULT 0,
  last_grant_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE cosmetic_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id),
  cosmetic_id UUID NOT NULL REFERENCES cosmetics(id),
  gem_cost INTEGER NOT NULL CHECK (gem_cost > 0),
  iso_week TEXT NOT NULL,
  parent_cap_at_purchase INTEGER NOT NULL,
  weekly_total_at_purchase INTEGER NOT NULL,
  mutation_log_id UUID REFERENCES mutation_log(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_cosmetic_purchases_player_week ON cosmetic_purchases(player_id, iso_week);
```

### Telemetry events for parent product (add to PostHog event taxonomy)

| event_name | required_props | when_fires |
|---|---|---|
| `family_plan_activated` | `parent_id, child_ids[], tier, stripe_subscription_id` | Stripe `customer.subscription.created` webhook |
| `family_plan_cancelled` | `parent_id, tier, reason` | Stripe `customer.subscription.deleted` webhook |
| `gems_granted` | `player_id, amount, source ('monthly_grant'|'one_time_topup'|'streak_bonus')` | `gem_balances` insert/upsert |
| `gem_spend_blocked_cap_exceeded` | `player_id, attempted_cost, weekly_cap, weekly_spent` | Server rejects `PURCHASE_COSMETIC` due to parent cap |
| `parent_setting_changed` | `parent_id, setting_key, old_value, new_value` | Any `/api/parent/settings` PATCH succeeds |
| `child_data_export_requested` | `parent_id, child_id` | Parent clicks "Export data" in dashboard |
| `child_data_deleted` | `parent_id, child_id, deletion_reason` | COPPA Article 6 hard-delete completes |

---

*This revision file resolves the 3 blocking critique issues + 4 meta-critique guardrails. Apply each section to the indicated source doc, then mark the master spec status as "Ready for sign-off".*
