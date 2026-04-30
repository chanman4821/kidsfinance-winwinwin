# Win Win Win — Game Economy Design Spec
**Version:** 1.0
**Author:** Economy Designer agent
**Status:** Draft — values marked `(tuning placeholder)` require A/B playtest validation
**Last updated:** 2026-04-29

---

## 0. Design Axioms

1. Every Coin is **earned**, never bought. No IAP unlocks progression.
2. Every sink is a **lesson** — spending, upkeep, payroll, and investment are real financial concepts, not punishments.
3. **Gems buy cool, not power.** A Gem-free player can reach Level 50 with the same economic outcomes as a paying player.
4. The economy must be **solvent at steady state**: total daily inflow ≤ total daily sinks + 5 % savings buffer.
5. Numbers in this document are **tunable levers**, not sacred values. Every figure has a named tuning lever in §10.

---

## 1. Currency Taxonomy

Three currencies. Three jobs. No overlap.

### 1.1 Soft Currency — Coins 🪙

| Property | Value |
|---|---|
| Earned by | Ventures, chores, quests, lessons, login bonus |
| Purchased with real money | ❌ Never |
| Primary use | Unlocking ventures, upgrades, employee salaries, cosmetics |
| Daily hard cap (non-passive sources) | 500 Coins |
| Passive income cap | None — uncapped (teaches passive income concept) |

Faucets (daily inflow at Level 10–20 active player):
- Login bonus 5 / Chores ~50 / Lessons+quests ~75 (capped at 500) / Venture passives 800–1,200
- Total ~930–1,330 Coins/day

Sinks: Cosmetics 50–500 / Venture upgrades 200–2,000 / Employee salaries 20–80/day per hire / Acquisition negotiation fee 50–200 / Premium location fee 100/wk

Steady-state: ~1,200 inflow = ~900 sinks + ~300 net savings (25% target rate).

### 1.2 Hard Currency — Gems 💎

| Property | Value |
|---|---|
| Earned by | Season Pass weekly allotment (3/week), rare quest drops (max 10/week) |
| Purchased with real money | ✅ Via parent-approved IAP only (COPPA-compliant) |
| Primary use | Cosmetics, time-skips (capped), season pass themes |
| Pay-to-win gate | ❌ Cannot buy Coins, XP, venture unlocks, or stock advantages |
| Daily time-skip cap | 3 hours of venture operation per day (75 Gems/skip, 3 skips max) |

Conversion rules: Gems→Coins PROHIBITED. Coins→Gems PROHIBITED. Gems→cosmetics ✅.

### 1.3 Reputation Currency — Stars ⭐

| Property | Value |
|---|---|
| Earned by | Quests, 5-star NPC reviews, 7-day streak, community events |
| Time-lock | Max +5 Stars/day. Streak bonus +3 on day 7 |
| Purchased | ❌ Never |
| Spent on | Reputation shopfront skins, NPC dialogue unlocks, negotiation advantage (−0.5× target multiple) |
| Lifetime cap | 500 Stars |

---

## 2. Venture Catalog — 8 Starters

Revenue formula: `Daily Revenue = Base × Demand Multiplier × (1 + Upgrade Tier × 0.15)`. Tier 0, neutral demand.

| Venture | Unlock | Daily Rev | Daily Upkeep | Net Daily | ROI | Skill | Difficulty |
|---|---|---|---|---|---|---|---|
| 🍋 Lemonade Stand | 50 | 80 | 15 | **65** | ~1d | Revenue vs cost | Linear |
| 🍬 Candy Shop | 350 | 150 | 35 | **115** | ~3d | Markup + restock | Mild |
| 🧪 Slime Lab | 1,200 | 320 | 80 | **240** | ~5d | Batch production | Moderate |
| 🌿 Lawn Mowing | 3,000 | 600 | 150 | **450** | ~7d | Labor scheduling | Moderate |
| 🐾 Dog Walking | 6,500 | 1,100 | 300 | **800** | ~8d | Service contracts | Hard |
| 🎨 Art Commissions | 12,000 | 1,800 | 400 | **1,400** | ~9d | Pricing creative | Hard |
| 🕹️ Gaming Cafe | 40,000 | 5,500 | 1,500 | **4,000** | ~10d | Overhead vs throughput | Expert |
| 🚚 Food Truck | 120,000 | 14,000 | 4,200 | **9,800** | ~12d | Location + logistics | Expert |

---

## 3. Progression Curve

XP per action:
- Daily login 10 / Quick lesson 30 / Medium lesson 75 / Capstone 250 / Venture cycle 20 / Stock trade 15 / Minor quest 100 / Chapter quest 400 / Acquisition 500 / 7-day streak 150

Level thresholds (formula `XP_to_next(n) = 100 × n^1.4`):
| Lvl | Cumulative XP | Unlock |
|---|---|---|
| 1 | 0 | Lemonade Stand |
| 3 | 364 | Candy Shop |
| 5 | 1,406 | Slime Lab + Stock Market (paper) |
| 8 | 4,312 | Lawn Mowing + Employee Hire |
| 10 | 7,530 | Dog Walking + NPC Acquisition |
| 12 | 13,000 | Art Commissions |
| 15 | 24,200 | Stars currency unlocked |
| 20 | 51,000 | Gaming Cafe + full Stock Market (live sim) |
| 25 | 92,000 | Food Truck |
| 30 | 152,000 | Full M&A suite |
| 35 | 234,000 | Investment Portfolio tools |
| 40 | 336,000 | Brand Partnership quests |
| 50 | 590,000 | 🏆 Tycoon prestige rank |

Session arcs:
- 30s win: tap-collect ventures
- 5min mission: NPC mini-quest
- 30min session: chapter quest + 2 lessons + 3 trades + 1 upgrade
- 7-day arc: ROI hit → next venture unlock + streak bonus + leaderboard

---

## 4. Stock Market Mechanics

12 simulated tickers across 10 sectors (LMND/SWTS/SLMX/YRDX/WOOF/ARTT/GAME/NOMM/ENRG/BLDR/TECH/ECOX). 3 volatility tiers:
- Low ±2% σ / max ±5% swing
- Med ±5% σ / max ±12% swing
- High ±10% σ / max ±25% swing

Daily tick: Gaussian random walk μ=+0.1%/day. News event probability 15%/ticker/day with `[-20%, +25%]` price modifier. Plain-English headlines with visible price-impact preview before confirming trade. Sector correlation cluster at 0.4.

Sample 14-day LMND price walk (Day 5 +15% news event "Back-to-School Lemonade Craze!", Day 11 −8% "Candy Rivals Slash Prices"). Player who held through both: +8.9% over 14d. Teaching anchor for risk/reward.

---

## 5. Acquisition Mechanic

Valuation: `Acquisition Price = Daily Net Profit × Multiple` where Multiple = 3 + Growth (0–2) + Sentiment (0–2) + Age (0–1), capped at 7×.

Negotiation steps: Scout 50 / First offer 100 / Counter-offer 50 / Walk = 50% refund.

**Anti-farming earnings tax**: 20% of daily revenue paid as royalty to seller for 30 days post-acquisition. One acquisition per 7-day cooldown.

---

## 6. Steady-State Economy Equation

```
Inflow = 900 (passives) + 430 (active) + 5 (login)  = 1,335 Coins/day
Sinks  = 100 (employees) + 14 (fees) + 150 (upgrades) + 35 (cosmetics) + 20 (negotiations) = 319 Coins/day
Net    = 1,016 Coins/day saved (25% rate)
```

Inflation buffer: target 20–30% savings rate. >35% triggers Big Upgrade Event. <15% triggers 10% salary relief.

---

## 7. Gem SKUs (5 total, no P2W)

| SKU | Price | Contents |
|---|---|---|
| 🌟 Starter Pack | $1.99 | 150 Gems + Golden Coin avatar frame + "First Venture" title |
| 🎨 Creator Bundle | $4.99 | 500 Gems + Slime Workshop skin + 3 sticker pack |
| 📅 Season Pass | $7.99/mo | 1,200 Gems/mo + seasonal cosmetics + 1 time-skip token/wk |
| 👔 Tycoon Pack | $14.99 | 2,500 Gems + Tycoon Office HQ skin + CEO outfit + nameplate |
| 👨‍👩‍👧‍👦 Family Bundle | $24.99 | 5,000 Gems for 4 child profiles + Family Crest creator + skin set |

Gems CAN buy: avatar skins, frames, emotes, venture visual skins, time-skips (capped 3hr/day), season themes, name effects.
Gems CANNOT buy: Coins, Stars, XP boosts, venture unlocks, stock advantages, acquisition fee waivers.

---

## 8. Brand Partnership Slots

5 creative inventory slots: Venture Skin / Weekend Quest / Branded NPC / Billboard / Bonus Currency Event.

Pricing:
- Tier 1 Micro: $15K/mo, 1 slot (regional brands)
- Tier 2 Mid: $50K/mo, 2 slots (national retailers)
- Tier 3 Premium: $150K/mo, all 5 slots (Walmart/Target/major FMCG)

Brand safety: COPPA + CARU pre-review. No direct purchase CTAs. Educational angle required. Max 1 brand per category simultaneously. Pre-approved character review board.

---

## 9. Curriculum Map (NextGen PF / CEE / Jump$tart / NEFE)

| Mechanic | Skill | Standard |
|---|---|---|
| Coins faucets | Income from work | NextGen PF 2.1 |
| Venture ROI | Opportunity cost | CEE Standard 2 |
| Passive income / reinvest | Compounding | NextGen PF 4.3 |
| Stock volatility + news | Risk vs reward | Jump$tart IV.1 |
| 12-ticker portfolio | Diversification | NextGen PF 4.4 |
| Acquisition multiples | M&A valuation | CEE Entrepreneurship 4 |
| Gems = cosmetic only | Needs vs wants | NextGen PF 1.1 |
| Employee salaries | Labor costs | CEE Business Lit 3 |
| 30-day royalty | Contracts/obligations | CEE Standard 7 |
| Brand weekend events | Advertising literacy | NEFE Standard 3 |

---

## 10. Tuning Levers (post-launch live ops)

1. **Daily Coin Cap** — pull up if D7 < 40% retention; pull down if savings rate > 35%.
2. **Venture Unlock Cost** — pull up if median reaches Food Truck before L30; pull down if 14-day stall rate > 25%.
3. **Stock Volatility Band** — pull down if abandon rate > 40% or win-rate > 80%; pull up if win-rate too high.
4. **News Event Probability** — pull up if stock DAU < 20% of total; pull down if top decile earns > 3× median via stocks.
5. **Acquisition Cooldown + Multiple Floor** — pull down if < 5% of L10+ attempt acquisition/wk; pull up if > 15% complete 2+/wk (flip-farming).

---

*Tier-1 sources: NextGen PF (ngpf.org), Council for Economic Education (councilforeconed.org), Jump$tart Coalition (jumpstart.org), NEFE (nefe.org).*
