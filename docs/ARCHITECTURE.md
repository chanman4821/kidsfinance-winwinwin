# Win Win Win — Master Architecture

**Version**: 1.0 (April 2026)
**Owner**: Project lead
**Status**: Living document — single source of truth for the full app

---

## 1. PRODUCT OVERVIEW

### Mission
Teach kids ages 4–18 to be smart with money — through a fun, story-driven game world (Coinwood) — so they grow up financially capable and avoid the debt traps adults fall into.

### Win-Win-Win positioning
- **Kid wins**: learns saving, spending, giving, investing, business, economics through play
- **Parent wins**: chore tracker, allowance manager, visibility into kid's financial habits, no real-money risk
- **Society wins**: catches the financial-literacy crisis at the root — kids exit teenage years with habits adults have to learn the hard way

### Target audiences
- **Primary kids**: ages 4–18 (mixed range — adaptive UX)
- **Primary parent**: 30–50, household income $50K+, values financial literacy, finds Greenlight too expensive at $9.99/mo
- **B2B (Year 2+)**: school districts, after-school programs, JA chapters

### Business model
- **Free tier**: 1 kid, basic chores + Coinland (4-7) + Coinwood Village (8-12) chapters 1–2, no Crew
- **Family $7.99/mo or $79/yr**: unlimited kids, full curriculum, 1 Crew, Family League
- **Family+ $14.99/mo**: multiple Crews, Markets mode + real-stock-tracker, parent webinars, advanced cosmetics
- **Schools $5/student/year B2B**: classroom mode, teacher dashboard, CEE-aligned curriculum

### Differentiators vs Greenlight/GoHenry/BusyKid
- ✅ Free tier (they don't have one)
- ✅ Investment Crews (peer learning) — nobody has this
- ✅ Hybrid investing (fictional Coinwood shops <10, real stocks 10+)
- ✅ Story-driven RPG progression
- ✅ Adaptive UI by age band (3 distinct modes)
- ✅ Engagement psychology (Duolingo-style streaks, leagues, daily quests) tuned for LEARNING outcomes

---

## 2. THE 3-MODE STRATEGY

| Mode | Age | Game Type | Core Mechanic | Concepts Taught |
|---|---|---|---|---|
| **Coinland** | 4-7 | Tap-and-celebrate mini-games | Tap coins, drag to jars, count, listen to stories | Coins exist, counting, save/spend/give |
| **Coinwood Village** | 8-12 | Sim/tycoon (Animal Crossing × Stardew) | Chores → coins → Lemonade Stand business → buy shops → savings goals | Earning, budgets, supply/demand, profit margin, simple interest, passive income, scam awareness, charity |
| **Coinwood Markets** | 13-18 | Investing simulator + business builder | Real-stock portfolio with play money, Investment Crews, compound interest lab, credit sim, business plan | Stocks/ETFs/bonds, dividends, compound interest, credit & APR, taxes, business basics, behavioral finance, fraud detection |

Each mode is its own React tree under `/play/<mode>/` with its own state (`CoinlandState`, `VillageState`, `MarketsState`). Shared shell handles auth, family, parent dashboard, leaderboards, settings.

---

## 3. INFORMATION ARCHITECTURE (Sitemap)

```
/                              Welcome / mode picker (logged out)
/login                         Parent login
/setup                         First-time onboarding (parent + first kid)
/setup/add-kid                 Add another kid profile

/play                          Mode picker for logged-in kid (auto-routes if age fixed)
/play/coinland                 4-7 toddler mode
  ├── /play/coinland/jars      drag coins to jars (mini-game)
  ├── /play/coinland/catch     coin-catch mini-game
  ├── /play/coinland/match     match-the-coin mini-game
  └── /play/coinland/story     animated story listener

/play/village                  8-12 sim mode (Coinwood Village)
  ├── /play/village/home       Town center, daily quests, mascots
  ├── /play/village/chores     chore tracker
  ├── /play/village/jars       Save/Spend/Give jar UI
  ├── /play/village/stand      Lemonade Stand mini-game (set price, buy ingredients, sell)
  ├── /play/village/shops      Shop ownership (passive income mechanic)
  ├── /play/village/goals      savings goals
  ├── /play/village/lessons    village curriculum (15-20 lessons)
  ├── /play/village/league     Family League leaderboard
  ├── /play/village/pet        pet evolution + customization
  └── /play/village/scams      Bank Robber arc (scam awareness)

/play/markets                  13-18 investing mode
  ├── /play/markets/portfolio  holdings overview
  ├── /play/markets/discover   browse 25-30 real stocks
  ├── /play/markets/trade/[t]  buy/sell ticker
  ├── /play/markets/labs       compound interest, credit card, tax sim
  ├── /play/markets/business   business builder mini-game
  ├── /play/markets/lessons    markets curriculum (20-30 lessons)
  ├── /play/markets/crew       Investment Crew (peer feed + report)
  └── /play/markets/cycles     Bull/Bear historical simulator

/lessons/[id]                  Deep lesson view (shared by all modes)
/leaderboard                   Family League across all modes
/parent                        Parent dashboard
  ├── /parent/family           manage kids
  ├── /parent/chores           assign/approve chores
  ├── /parent/billing          subscription
  ├── /parent/lounge           Parent Lounge (forum + tips)
  ├── /parent/safety           Crew approvals, content filters
  └── /parent/reports          weekly progress report per kid
/settings                      account/profile/family settings
/about                         marketing landing
/pricing                       pricing page
```

---

## 4. WORLD: COINLAND (4-7)

### Setting
A bright, big-button island where coins fall from trees and Mochi cheers loudly. Voice-first (browser TTS for v1, real VO for v2). Pre-readers — almost zero text, all icons.

### Mascots
- **Mayor Mochi** 🐶 — narrator + cheerleader

### Game loop (30s sessions, 5-10 per day)
1. Open app → Mochi waves and says (voiced) "Let's catch coins!"
2. Pick mini-game from 4 big buttons:
   - Coin Catch (60s of falling coins to tap)
   - Match the Coin (which is the bigger coin)
   - Drag to Jars (tutorial-grade drag-drop)
   - Story Time (60-second animated mascot story)
3. Earn coins → coins automatically split 33/33/33 to Save/Spend/Give (no choice yet, too young)
4. Pet egg gets a heart → eventually hatches
5. Sticker reward + Mochi celebration

### Concepts taught
- Coins exist
- Counting (1-20)
- Bigger vs smaller (5¢ vs 25¢)
- 3 jars exist (save, spend, give)
- Helping = earning

### Lessons (5)
1. "What is a coin?" — counting + recognition
2. "Earning vs getting" — earned vs gifted
3. "The three jars" — save/spend/give intro (icons only)
4. "Why we share" — giving teaches kindness
5. "Pet bunny needs love" — caring for things

### Visual / audio language
- Pastel sky/clouds/hills
- Mochi 30% of screen
- Big chunky buttons (60px+ touch targets)
- Voice cues for every interaction (Web Speech API)
- Sound effects: coin clink, level-up, pet purr
- Confetti everywhere

---

## 5. WORLD: COINWOOD VILLAGE (8-12)

### Setting
Vibrant cartoon island town. Player arrives as new resident, gets a starter home, meets mascots, builds up their plot of Coinwood. Animal Crossing meets Stardew Valley meets a finance curriculum.

### Mascots
- **Mayor Mochi** 🐶 — town leader, gives daily quests
- **Squirrel Sage** 🐿️ — Save jar mentor; teaches savings goals + interest
- **Sloth Sam** 🦥 — Spend jar mentor; teaches mindful spending + opportunity cost
- **Giraffe Grace** 🦒 — Give jar mentor; teaches charity + impact
- **Owl Olivia** 🦉 — investing intro mentor; teaches owning shops
- **Bunny Bo** 🐰 — kid's first pet companion; evolves
- **Bank Robber 🦝** — recurring villain, teaches scam awareness

### World zones
- **Town Center** — daily quests, Mochi greets, quick actions
- **Bank** — Save jar with simulated interest (5% APY weekly tick)
- **Charity Garden** — Give jar funds plant trees, build school, etc. (visible impact stories)
- **Marketplace** — kid's lemonade stand, shop browser
- **Town Hall** — Family League leaderboard, achievements wall
- **Mountain Path** — locked progression unlocks (lesson chapters)
- **Player's Home** — pet, room decoration, wardrobe

### Core game loop (10-30 min sessions, daily)
1. Open app → Mochi says "morning! 3 quests today"
2. Daily Quests panel (3 tasks, e.g., "do 2 chores", "sell 5 cups", "complete 1 lesson")
3. Do chores → earn coins → tap Save/Spend/Give to allocate
4. Visit Marketplace → run lemonade stand for the day:
   - See today's weather (☀️ ☁️ ☔)
   - Set price (kid chooses 1-10 coins/cup)
   - Buy ingredients (cost = 2 coins/cup)
   - Open stand → sales happen automatically based on demand model
   - End-of-day report: revenue - cost = profit (or loss!)
5. Once enough coins, buy a Coinwood Shop (50-500 coins each)
   - Shops generate passive daily income based on lesson-completion rate
   - Teaches: passive income, why education compounds wealth
6. Take a lesson → earn 30 XP + 10 coins + badge
7. Check Family League position
8. Pet Bo gets a heart, eventually evolves

### Mini-games
- **Lemonade Stand** (core economy sim) — pricing, demand, profit margin
- **Shop browser** — passive income unlock
- **Daily Quest chest** — capped random reward (Duolingo-style)
- **Goal tracker** — visible progress to a real-world goal
- **Bank Robber arc** — 5-8 scam-awareness episodes (phishing email game, get-rich-quick spotting, fake-investment detection)

### Concepts taught (curriculum-mapped)
| Concept | Where |
|---|---|
| Earning | Chores, lemonade revenue |
| Saving | Save jar, savings goals, simulated 5% interest |
| Budgeting | Daily allowance allocation, lemonade stand cost mgmt |
| Wants vs needs | Spend jar lessons |
| Opportunity cost | Sloth Sam lessons |
| Supply / demand | Lemonade stand pricing experiments |
| Profit / margin | Lemonade stand end-of-day reports |
| Passive income | Shop ownership |
| Compound interest | Visualizer in Bank zone (slider + chart) |
| Charity / impact | Give jar + Charity Garden |
| Scam awareness | Bank Robber arc |
| Family teamwork | Family League |

### Lessons (15)
Complete list TBD — mapped to CEE Standards K-4 + 5-8.

### Story arc (Chapters 1-3 of the 5-chapter Coinwood story)
- **Ch 1: New Resident** — kid arrives, gets home, first 5 coins, first chore
- **Ch 2: Townsfolk** — meet the 4 mentor mascots
- **Ch 3: Shopkeeper** — first lemonade stand, then second product, then bakery, then store

### Family League
- Bronze → Silver → Gold → Diamond
- Family circle only (parent-invited cousins/classmates, ≤8 members)
- Ranks by XP earned this week (effort, not wealth)
- Promotes/demotes weekly

---

## 6. WORLD: COINWOOD MARKETS (13-18)

### Setting
Grown-up version of Coinwood — same mascots but now serious tools. Look feels like a polished investing app (Public.com vibes) but with Coinwood pastels and Owl Olivia as guide.

### Mascots
- **Owl Olivia** 🦉 — primary mentor, investing teacher
- All Village mascots remain (kid grew up with them)

### Core game loop (15-45 min sessions, daily-to-weekly)
1. Open app → portfolio dashboard with today's price changes
2. Check Crew feed (what did friends buy/sell? why?)
3. Take a lesson (compound interest, credit, taxes, behavioral finance)
4. Adjust portfolio (buy, sell, rebalance)
5. Owl Olivia weekly Crew Report explains what worked

### Features (each is a sub-page)
1. **Portfolio Dashboard** — total value, cash, invested, all-time gain, holdings list
2. **Discover** — 25-30 real public companies (Apple, Disney, Roblox, Nvidia, McDonald's, etc.) with price + 30-day change + age-appropriate "what they do" blurb
3. **Trade Modal** — buy/sell with $ amount, sparkline chart, position summary
4. **Compound Interest Lab** — interactive slider playground (monthly contribution × years × rate → future value)
5. **Credit Card Trap Sim** — show how 22% APR on $500 with min payment = years of debt
6. **Tax 101 Sim** — W-2 income calculator (gross → withholding → take-home)
7. **Bull/Bear Cycle Sim** — time-warp through 2008 crash, COVID, dot-com bubble — see your portfolio
8. **Business Builder** — write a 1-page business plan, simulate 12 months (revenue, costs, burn, break-even)
9. **Behavioral Finance Lessons** — 5 lessons on FOMO, loss aversion, anchoring, herd, recency
10. **Scam Detection Trainer** — phishing/pump-dump rapid-fire game
11. **Investment Crew** — 2-8 friends, parent-approved, share strategy notes (predefined phrases), weekly Crew Report
12. **Tournaments** — monthly best-portfolio competition

### Real-stock data
- v1: deterministic random-walk simulation seeded by ticker (zero deps, ships today)
- v0.2: yahoo-finance2 npm package (free, no key, daily quotes)
- v1.0: Polygon.io free tier with caching for production reliability

### Concepts taught (curriculum-mapped)
| Concept | Where |
|---|---|
| Stocks / ETFs / bonds / dividends | Discover + lessons |
| Market cap, P/E ratio | Stock detail page |
| Diversification | Portfolio analyzer |
| Risk vs return | Bull/Bear sim |
| Compound interest | Compound Lab |
| Credit & APR | Credit Card Trap |
| Taxes | Tax 101 Sim |
| Business basics (CAC/LTV/burn) | Business Builder |
| Behavioral finance | 5-lesson series |
| Fraud detection | Scam Trainer |
| Peer learning | Investment Crew |
| Market history | Cycle Simulator |

### Lessons (20)
Complete list TBD — mapped to CEE Standards 9-12 + Jump$tart National Standards.

### Story arc (Chapters 4-5)
- **Ch 4: Investor** — Coinwood Stock Market opens, kid gets first $10K play money
- **Ch 5: Mayor's Apprentice** — kid grooms to govern Coinwood: budgets, taxes, lending, scam-defense

---

## 7. SHARED SYSTEMS (apply to all 3 modes)

### Auth & Identity
- Parent: email + Google (Auth.js v5)
- Kid: PIN-based profile switch within parent's session (Auth.js multi-profile)
- Family: parent owns the family unit, can have N kid profiles

### Family management
- Parent invites another parent (2-parent households)
- Parent adds kid profile (name, DOB, mode auto-routes by age)
- Parent removes kid (with grace period)

### Cross-mode XP & badges
- Kid's level + XP carry across modes (one identity)
- Badges from any mode show in unified profile
- Cosmetics (pet outfits, room decor) usable across modes

### Family League (cross-mode)
- Ranks all kids in the family by weekly XP earned
- Bronze → Silver → Gold → Diamond
- Promotes/demotes weekly
- Parent-only opt-in to extend to cousins/classmates (≤8 total)

### Notification system
- Parent gets daily digest of kid activity (kid-friendly summary)
- Kids get max 1 push/day, parent-controlled time window
- No notifications outside parent-set hours

### Parent Dashboard
- All kids visible at a glance
- Per-kid: chores assigned/done, lessons completed, jars balance, current mode, time-on-app today
- Approve crew invites, approve real-money purchases (when added)
- Reset chores, assign new chores, set allowance schedule

### Parent Lounge
- Forum (vetted, family-only)
- Money Night Out scheduler (parent-organized in-person or virtual)
- Lesson plan sharing
- Money Mentor badge (parent helps 5+ other families)

### Settings
- Profile (name, age, mode override)
- Family (add/remove members)
- Billing (subscription tier, payment method)
- Privacy (COPPA controls)
- Notifications

### Billing (Stripe)
- Plans: Free, Family ($7.99/$79), Family+ ($14.99/$149), School ($5/student/yr)
- Stripe Billing Portal for self-service
- 14-day free trial on paid tiers
- Family discount: 10% off Family+ when billed yearly

---

## 8. DATA MODEL (entities)

### Core
- **Family** — parent group; PK `id`; has many `Parent`, `Kid`
- **Parent** — auth account; FK `familyId`; email, name, role (owner/parent/guardian)
- **Kid** — KidProfile; FK `familyId`; name, DOB, ageBand (computed), pinHash, currentMode
- **Subscription** — FK `familyId`; tier, status, periodEnd, stripeCustomerId

### Cross-mode game state
- **XPLedger** — FK `kidId`; source ("chore"/"lesson"/"quest"), amount, timestamp
- **Badge** — FK `kidId`; type, earnedAt
- **Streak** — FK `kidId`; days, lastDayPlayed, freezeRemaining
- **CosmeticOwned** — FK `kidId`; itemId, equipped, source

### Coinland (4-7)
- **CoinlandState** — FK `kidId`; jars { save, spend, give }, lessonsCompleted[], petStage

### Village (8-12)
- **VillageState** — FK `kidId`; coins, jars, level, streakDays, lessonsCompleted[], todayChoreXp
- **VillageStand** — FK `kidId`; price, product, inventoryUnits, level, daysOpen, totalRevenue/Profit, history[]
- **VillageShop** — FK `kidId`; shopId, daysOwned (player owns shops with passive income)
- **VillageGoal** — FK `kidId`; name, emoji, target, currentSaved
- **Chore** — FK `familyId`; emoji, title, coins, recurringSchedule
- **ChoreCompletion** — FK `kidId`, `choreId`; completedAt, approvedAt, approvedBy

### Markets (13-18)
- **MarketsState** — FK `kidId`; cash, lessonsCompleted[]
- **Stock** — global; ticker, name, sector, basePrice, blurb
- **StockPrice** — global; ticker, date, open/high/low/close (cached daily)
- **Position** — FK `kidId`, `ticker`; shares (fractional), avgCost
- **Trade** — FK `kidId`, `ticker`; side (buy/sell), shares, price, total, date

### Crews (Markets)
- **Crew** — FK `creatorParentId`; name, maxMembers (≤8)
- **CrewMembership** — FK `crewId`, `kidId`, `parentId` (approver)
- **CrewInvite** — FK `crewId`, `inviterParentId`, `inviteeParentEmail`; status
- **StrategyNote** — FK `kidId`, `ticker`; note (predefined phrase IDs only)
- **CrewComment** — FK `crewId`, `kidId`, `targetNoteId`; phraseId (enum from library)

### Lessons (shared)
- **Lesson** — global; ageBand, mentor, blurb, contentBlocks[], quiz[], badgeReward
- **LessonProgress** — FK `kidId`, `lessonId`; startedAt, completedAt, quizScore
- **QuizAttempt** — FK `kidId`, `lessonId`, `questionId`; pickedIndex, correct, attemptedAt

### Family social
- **FamilyLeagueRound** — FK `familyId`; weekStart, leaderboard[], promotionsEarned[]
- **Competition** — global; type (festival/tournament/quiz-night), startsAt, endsAt
- **CompetitionEntry** — FK `competitionId`, `kidId`; score, rank
- **Meetup** — FK `familyId`; type, scheduledAt, invitees[]
- **MeetupRSVP** — FK `meetupId`, `parentId`; status

### Parent
- **ParentForumPost** — FK `parentId`; threadId, body, createdAt
- **ParentMentorBadge** — FK `parentId`; familiesHelped, earnedAt

---

## 9. TECH STACK (locked)

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16 App Router | Server components, route groups, Turbopack |
| UI | React 19 + TS 5 | Modern React features |
| Styling | Tailwind v4 | New @theme block, fast |
| Components | shadcn/ui patterns (own components) | Full control, no lock-in |
| Charts | recharts | Already installed, good a11y |
| Icons | lucide-react | Already installed |
| Auth | Auth.js v5 | Multi-provider, multi-profile capable |
| DB | Postgres via Drizzle ORM | Type-safe, fast, serverless-friendly |
| DB host | Neon (serverless Postgres) | Free tier viable, Vercel-native |
| Hosting | Vercel | First-party Next.js, edge-friendly |
| Asset CDN | Cloudflare R2 + R2.dev | Free egress, character/cosmetic SVGs |
| CMS | Sanity.io free tier | Lessons + story content edited by non-engineers |
| Stock data | yahoo-finance2 (npm, no key) | Free real prices, daily cron |
| Real-time | Pusher Channels free | Crew updates, league live |
| Payments | Stripe Billing | Subscriptions + family/school plans |
| Email | Resend | Parent notifications, kid summaries |
| Analytics | PostHog free | Product events, learning KPI tracking |
| Monitoring | Sentry free tier | Error reporting |

---

## 10. BUILD ROADMAP (10 phases)

### Phase 1: Foundation (Week 1)
- Mode picker landing page (`/`)
- Onboarding flow (parent + first kid)
- Auth scaffolding (Auth.js placeholder, localStorage in v0)
- Shared layout (header, footer, navigation)
- Brand layer (palette, fonts, mascot SVGs)

### Phase 2: Coinland (Week 1-2)
- Move existing one-page MVP to `/play/coinland`
- Add 4 mini-games (Catch, Match, Drag, Story)
- Voice cues via Web Speech API
- 5 lessons with audio
- Pet evolution loop

### Phase 3: Village (Week 2-3)
- `/play/village/home` — town center
- `/play/village/chores` — chore tracker (parent-assigned in v0.5)
- `/play/village/jars` — Save/Spend/Give
- `/play/village/stand` — Lemonade Stand mini-game (FULL: pricing, demand, weather, day cycle)
- `/play/village/shops` — Shop ownership (passive income)
- `/play/village/goals` — savings goals
- `/play/village/lessons` — 15 lessons
- `/play/village/league` — Family League placeholder
- `/play/village/pet` — pet evolution
- `/play/village/scams` — Bank Robber Ch 1 episode

### Phase 4: Markets (Week 3-4)
- `/play/markets/portfolio` — DONE
- `/play/markets/discover` — DONE
- `/play/markets/trade/[t]` — DONE (modal currently)
- `/play/markets/labs` — DONE (compound + credit)
- `/play/markets/business` — Business Builder (NEW)
- `/play/markets/cycles` — Bull/Bear Sim (NEW)
- `/play/markets/lessons` — 20 lessons
- `/play/markets/crew` — placeholder → real impl in Phase 5

### Phase 5: Crews + Real auth (Week 5)
- Auth.js full impl (parent email + Google + kid PIN)
- Drizzle schema + Neon Postgres migration from localStorage
- Crew formation flow
- Strategy notes + predefined-phrase comments
- Owl Olivia weekly report (LLM-generated summary)

### Phase 6: Competitions + Meetups (Week 6)
- Family League real (cross-mode XP aggregation)
- Crew Tournament (monthly)
- Coinwood Festival (quarterly platform-wide)
- Family Game Night scheduler

### Phase 7: Parent Dashboard + Lounge (Week 7)
- `/parent` full dashboard
- `/parent/lounge` forum
- Parent notification digest
- Approve crew invites flow

### Phase 8: B2B School Edition (Week 8-10)
- Teacher dashboard
- Classroom mode (1 teacher → 30 students)
- Curriculum aligned report (CEE / Jump$tart standards)
- Bulk invite + LMS export
- Pricing page for schools

### Phase 9: Mobile PWA polish (Week 10-11)
- Service Worker for offline lessons
- Add to Home Screen prompts
- Touch-optimization audit
- Performance audit (Lighthouse 90+)

### Phase 10: Marketing site + launch (Week 12)
- `/about`, `/pricing`, `/blog`
- SEO + Open Graph
- Common Sense Media submission
- Product Hunt launch
- Reddit r/parenting + r/personalfinance soft launch

---

## 11. CONTENT PRODUCTION PIPELINE

### Lesson content
- Source: Council for Economic Education + Jump$tart Coalition + CFPB Money As You Grow + NextGen PF (all free, public-domain or CC-BY)
- Author: AI-rewrite into kid voice → human edit → Sanity CMS
- Format: JSON schema (id, title, ageBand, prerequisites, contentBlocks, quiz, badgeReward, mentor)

### Mascot dialogue
- Bible: `docs/content/story-bible.md` (TBD from agent output)
- Voice: per-mascot speech pattern guide
- Tooling: AI-draft → human edit → JSON manifest per scene

### Story arcs
- 5 chapters total (1-2 in Coinland → 3 in Village → 4-5 in Markets)
- Each chapter has 5-10 sub-arcs
- Author: agent-drafted → human edit

### Asset pipeline (v1 = $0)
- Mascots: emoji + hand-coded SVG (already done)
- Backgrounds: SVG scene component (already done)
- Animations: Lottie free tier or CSS keyframes
- Audio: Web Speech API + Freesound CC0
- v0.2: Bing Image Creator (free DALL-E 3) for richer character art
- v1.0: Fiverr cleanup pass + Rive animations + ElevenLabs voices

---

## 12. SAFETY RAILS (non-negotiable)

| Rule | Why |
|---|---|
| All friend/crew connections require parent-to-parent invite + dual approval | COPPA + child safety |
| All chat uses predefined phrase library only (Among Us pattern) | Eliminates bullying + grooming surface |
| Crew size capped at 8 | Research shows >8 kills the social-learning benefit |
| Live events mentor-moderated, recorded for parent review | Liability + transparency |
| Notification policy: 1/day max for kids, parent-set hours | AAP screen-time guidance |
| Real-stock pricing PLAY MONEY only in v1 | No SEC liability, no real-money risk |
| No real-money purchases for cosmetics ever | UK CMA + APA loot-box research |
| No social leaderboards across families (only family circle) | Common Sense Media kid-app framework |
| Engagement KPIs tracked AGAINST learning KPIs | If engagement up + learning flat = immediate fix |
| COPPA: under-13 verifiable parental consent + data minimization | FTC 16 CFR Part 312 |

---

## 13. SUCCESS METRICS

### Learning KPIs (PRIMARY — optimize for these)
- **Concepts mastered per kid per week** (lessons completed with quiz score ≥ 80%)
- **7-day concept retention** (spaced-repetition test recall)
- **Save-rate** (% of earned coins voluntarily saved — target ≥ 30%)
- **Give-rate** (% to Give jar — target ≥ 10% — indicates pro-social development)
- **Goal completion rate** (kid sets a savings goal and reaches it)
- **Parent NPS** (monthly 1-tap survey, target 50+)

### Engagement KPIs (track for product health, NEVER as the success metric)
- DAU, streak length, league promotion rate, daily-quest completion rate, time-on-app

### Growth KPIs (commercial)
- Free → Family conversion (target 4-7%)
- Family → Family+ upgrade (target 15%)
- Annual vs monthly mix (target 60%+ annual)
- Family expansion (≥ 1.5 kids per family avg)
- B2B (Year 2): pilot schools, $/student

---

## 14. ANTI-RATIONALIZATION (the project rules)

| Trap | Reality |
|---|---|
| "Just ship a one-pager" | One-pagers don't teach; build the world |
| "Skip the design phase" | Every shipped pixel without ADR is debt |
| "Engagement is the metric" | Wrong metric — kids learn or this fails |
| "Real money would be more compelling" | Real money = months of compliance + child safety risk; play money first |
| "Strangers in the crew would create network effects" | Stranger contact = child-safety lawsuit; family circle only |
| "Streaks should never be broken" | Forgiving streaks (Duolingo freeze) > shaming streaks |
| "Add ads to monetize" | Marketing to under-18 = regulatory + brand risk; subscription only |
| "Prefer flashy art over working mechanics" | Working mechanics first, art investment after validation |
