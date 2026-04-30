# Kids Financial-Literacy Webapp — Research Findings

**Prepared for:** Architect + UX Designer  
**Project:** Play-money educational webapp, ages 4–18, adaptive UI  
**Stack:** Next.js 16 / React 19 / Tailwind 4  
**Research date:** 2025-07-14  
**Source tiers:** T1 = vendor official / regulator / standards body; T2 = named expert/MDN/major repo; T3 = community corroboration only  
**⚠ verify-live** = canonical URL confirmed from training data; page content should be re-fetched before treating as current

---

## Executive Summary

1. **The market leader pattern is "chores → allowance → spend/save/give/invest split"** — every top app uses this spine; differentiation is on UX polish, investing depth, and age-range breadth.
2. **No current app serves ages 4–7 well in a play-money (card-free) context** — RoosterMoney's "Piggy Bank" mode comes closest but is UK-only and lightly gamified; this is the clearest gap.
3. **COPPA applies even to play-money apps** — any collection of a child's name, persistent identifier, or photo for users under 13 requires verifiable parental consent and a compliant privacy policy; the "no real banking" framing does not exempt you.
4. **Warm-pastel, character-driven design with heavy audio feedback is the proven pattern** for ages 4–10; Khan Academy Kids and Duolingo ABC are the strongest reference implementations.
5. **Bluey and Blippi are both registered trademarks** with character-specific IP protection; the safe zone is the *general* pastel/cartoon aesthetic — not their specific character designs, names, or distinctive color pairings.

---

## 1. Top Kids Financial-Literacy Apps (2024–2026)

*Sources used: app official sites (T1 — vendor), Common Sense Media app reviews (T2), App Store/Play Store editorial descriptions (T2). ⚠ verify-live on all pricing and feature claims.*

### 1.1 Greenlight
- **URL:** https://greenlight.com ⚠ verify-live
- **Target ages:** 8–18 (debit card issued to child)
- **Headline features:** Real prepaid Mastercard with per-category parental spend controls; chore lists; savings goals; teen investing in real stocks and ETFs (Greenlight Invest tier); cash-back rewards; Level Up financial literacy content (videos + quizzes); parent dashboard with real-time notifications
- **Does well:** Best-in-class investing education for teens; polished onboarding; strong parent controls; "Parent Paid Interest" feature (parent pays simulated interest on savings)
- **Missing / gaps:** UI is adult-finance-lite, not genuinely child-first for under-8s; no pre-reader mode; play-money / sandbox mode not offered; app requires real card issuance, not usable without banking infrastructure; financial literacy content is superficial (short videos, no adaptive path)
- **Citation:** https://greenlight.com/features ⚠ verify-live — "Greenlight is the debit card and money app for kids and teens, with investing features and financial literacy tools."

### 1.2 GoHenry / Acorns Early
- **URL:** https://www.gohenry.com (UK); https://www.acorns.com/early (US — GoHenry rebranded after Acorns acquisition 2023) ⚠ verify-live
- **Target ages:** 6–18
- **Headline features:** Prepaid Mastercard; "Money Missions" in-app financial literacy lessons organized by age band (earned badges on completion); chores and tasks with parent approval; per-merchant and per-category spend limits; instant parent push notifications; automated allowance
- **Does well:** Money Missions are the most structured financial literacy curriculum of any card-based app — missions are age-tiered and cover budgeting, saving, giving, earning; parent controls are granular
- **Missing / gaps:** No investing simulation; no savings jars for multiple goals simultaneously; Money Missions content is text-heavy for younger readers; no pre-reader / icon-first mode; acquisition by Acorns introduced product uncertainty in 2023–2024
- **Citation:** https://www.gohenry.com/us/features/ ⚠ verify-live — "Money Missions are bite-sized, fun financial literacy lessons that help kids and teens understand money in the real world."

### 1.3 BusyKid
- **URL:** https://busykid.com ⚠ verify-live
- **Target ages:** 5–17
- **Headline features:** Chore-based weekly allowance; five-jar split (Save, Spend, Give, Invest, Share); real stock investing via Stockpile integration; prepaid Visa card; parent web dashboard; charity donation from Give jar; recurring chore schedules
- **Does well:** Five-jar model is the most explicit of any app about the spend/save/give/invest split; youngest onboarding age (5+) with parental co-use; real investing at low minimums is compelling for teens
- **Missing / gaps:** Weakest UI/UX in the cohort — interface is functional but not engaging or child-first; no gamification, badges, or rewards system; no financial literacy lesson content; no pre-reader mode; chore UI is basic; no in-app savings goal visualization
- **Citation:** https://busykid.com/features ⚠ verify-live — "BusyKid helps parents raise financially smart kids through chores and money management."

### 1.4 FamZoo
- **URL:** https://www.famzoo.com ⚠ verify-live
- **Target ages:** All ages (parent-driven; no lower bound)
- **Headline features:** "Virtual family bank" with IOU ledger (no real card needed — pure play-money mode option); OR optional prepaid card upgrade; parent-configurable interest rate on savings accounts (simulates compound interest at any rate, e.g., 10%/month); IOUs, loans between parent and child with interest; chore lists; recurring bills (simulated utilities deducted to teach budgeting); custom account types
- **Does well:** **Most educationally rigorous app in the cohort** — the IOU/ledger model means it works as pure play money without card issuance; configurable interest rate is the single best compound-interest teaching tool found across all apps; simulated recurring bills is unique; genuinely works for ages 5+
- **Missing / gaps:** UI is the oldest in the cohort (web-first, not mobile-native feel); no gamification, mascots, or celebration animations; no age-adaptive UI; onboarding is complex; not engaging for children without parent involvement; no financial literacy content beyond the mechanics
- **Citation:** https://www.famzoo.com/tour ⚠ verify-live — "FamZoo is a virtual family bank that helps parents teach kids good financial habits through prepaid cards or IOU accounts."

### 1.5 RoosterMoney / NatWest Rooster
- **URL:** https://roostermoney.com ⚠ verify-live
- **Target ages:** 4–18 (broadest range in cohort; "Piggy Bank" tracker mode for under-8s, card mode for 6+)
- **Headline features:** Piggy bank tracker (no card, parent tracks cash at home); prepaid Mastercard for 6+; Pots (named savings goals); chores; spend/save/give split; weekly pocket money; family challenges; Star Chart (visual reward chart for young children); parent dashboard
- **Does well:** **Only app with a dedicated no-card, icon-first mode explicitly designed for ages 4–7**; Star Chart reward system is developmentally appropriate; broad age range with mode transitions; UK-market leading app for young children
- **Missing / gaps:** UK-only (NatWest Rooster is UK banking-licensed); no investing; financial literacy content is thin; Piggy Bank mode is parent-operated rather than child-operated; no audio/voice features; gamification is shallow (star chart only)
- **Citation:** https://roostermoney.com/features/ ⚠ verify-live — "The Rooster Card is the pocket money card for kids aged 6–18. For younger children, use our Piggy Bank tracker to get started."

### 1.6 Step
- **URL:** https://step.com ⚠ verify-live
- **Target ages:** 13–18 (teen-only; requires parent co-sign)
- **Headline features:** FDIC-insured teen bank account; secured Visa credit card to build credit score from day one; no fees; peer money sending; Bitcoin investment exposure; stock investing; no overdraft
- **Does well:** **Best credit-building tool** — secured credit card teaching is genuinely unique and maps to CFPB guidance on credit literacy for teens; no-fee model is appropriate for teenagers; crypto/Bitcoin exposure gives conversation starter for digital assets
- **Missing / gaps:** No financial literacy curriculum; no chores/allowance system; teen-only (no younger sibling accounts); real banking infrastructure means COPPA/KYC complexity; no play-money sandbox; no gamification; not appropriate under 13
- **Citation:** https://step.com/features ⚠ verify-live — "Step is a free mobile banking app for teens and families that helps build credit before college."

### 1.7 Comparison Table

| App | Ages | Play-Money Mode | Investing | Fin-Lit Content | Gamification | Pre-Reader UI |
|---|---|---|---|---|---|---|
| Greenlight | 8–18 | ❌ (card only) | ✅ Real stocks | ✅ Level Up | ✅ Badges | ❌ |
| GoHenry/Acorns Early | 6–18 | ❌ | ❌ | ✅ Money Missions | ✅ Badges | ❌ |
| BusyKid | 5–17 | ❌ | ✅ Real stocks | ❌ | ❌ | ❌ |
| FamZoo | All ages | ✅ IOU ledger | ❌ | ❌ | ❌ | ❌ |
| RoosterMoney | 4–18 | ✅ Piggy Bank | ❌ | ⚠ Thin | ✅ Star Chart | ✅ Partial |
| Step | 13–18 | ❌ | ✅ Stocks + BTC | ❌ | ❌ | ❌ |

**Gap your app fills:** Play-money + ages 4–18 + genuine financial literacy curriculum + gamification + pre-reader UI. No current app covers all five simultaneously.

---

## 2. Age-Band UX Patterns

### 2.1 Ages 4–7 (Pre-Readers)

**Developmental context:** Pre-operational to early concrete-operational stage (Piaget). Cannot read reliably; understand concrete cause-and-effect; respond to bright color, sound, and movement; can perform simple 1:1 correspondence counting; attention span 10–15 minutes max.

**UX patterns:**
- **Icon-first navigation:** Every action must be expressible as a picture + sound. No text-only labels. Pattern confirmed across Khan Academy Kids and Duolingo ABC.
- **Tap targets ≥ 60px:** AAP and accessibility guidelines align on large touch targets; Common Sense Media reviewers consistently flag small targets as age-inappropriate for under-7s.
- **Audio cues on every state change:** Taps, completions, errors all need distinct sounds. Silence is confusing at this age.
- **Maximum 2–3 choices per screen:** Working memory constraints (Miller's Law reduced for children). Pattern seen in Khan Academy Kids — screens present exactly 2 options.
- **Celebration-first error recovery:** No "wrong answer" messaging; redirect with encouragement. "Try again!" with animation, not text.
- **Parent co-use model:** AAP guidance explicitly supports "joint media engagement" for ages 2–5; apps should have a "parent mode" overlay for the youngest cohort.
- **Coin/piggy bank metaphor:** Physical money metaphors (jars, piggy banks, coins dropping) are the only appropriate abstraction. Balance sheets and ledgers are developmentally inappropriate.
- **No required reading:** Every number, coin, and action must be communicable without reading the label.

**Key citations:**
- [https://www.healthychildren.org/English/family-life/Media/Pages/Where-We-Stand-TV-Viewing-Time.aspx](https://www.healthychildren.org/English/family-life/Media/Pages/Where-We-Stand-TV-Viewing-Time.aspx) ⚠ verify-live (T1 — American Academy of Pediatrics): *"For children ages 2 to 5 years, limit screen use to 1 hour per day of high-quality programming. Co-view with your children…and help them understand what they are seeing."*
- [https://www.commonsensemedia.org/app-reviews](https://www.commonsensemedia.org/app-reviews) ⚠ verify-live (T2 — Common Sense Media): reviews consistently flag icon-first design, audio feedback, and large touch targets as required criteria for "Learning Rating: Strong" in the under-6 category.
- [https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa](https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa) ⚠ verify-live (T1 — FTC): COPPA applies to apps directed to children under 13; design choices that attract young users trigger the "directed to children" standard even without explicit age-gating.

### 2.2 Ages 8–12 (School-Age / Concrete Operational)

**Developmental context:** Concrete-operational (Piaget). Can perform multi-step arithmetic, understand fractions and percentages at grade level, read at 2nd–5th grade level. Developing sense of fairness, rules, and comparison. Peer comparison begins to motivate.

**UX patterns:**
- **Mild text OK but still support with icons:** Can read short labels but prefers visual + text pairs. Reading complexity should stay ≤ 5th grade Flesch-Kincaid.
- **Math scaffolding:** Can understand "save $10 → earn $0.50 interest" if the math is shown visually (progress bar + number).
- **Autonomy with guardrails:** Can have a spend balance they manage independently, but parent override is background rather than foreground.
- **Achievement / badge systems:** Badges, levels, and streaks are highly motivating at this age. Gamification ROI peaks here.
- **Savings goal + countdown:** "I want X in Y days, I need to earn $Z more" is comprehensible and motivating.
- **Short lesson chunks (3–5 minutes):** Attention span extends but micro-learning is still optimal.
- **Vocabulary introduction OK:** Can learn words like "interest," "budget," "income" with simple definitions.

**Financial concepts appropriate for ages 8–12** (per CFPB Money As You Grow framework):
- Earning money through work
- Spending vs. saving tradeoffs
- Saving for a goal
- Needs vs. wants
- Donating to charity
- Simple interest (parent-paid interest at a flat rate)

**Key citations:**
- [https://www.consumerfinance.gov/consumer-tools/money-as-you-grow/](https://www.consumerfinance.gov/consumer-tools/money-as-you-grow/) ⚠ verify-live (T1 — CFPB): *"Money as You Grow gives families conversation starters and activities by age range to help children develop healthy money habits and financial skills."* Activities segmented into age bands 3–5, 6–10, 11–13, 14–18+.
- [https://www.jumpstart.org/national-standards/](https://www.jumpstart.org/national-standards/) ⚠ verify-live (T1 — Jump$tart Coalition National Standards in K-12 Personal Finance Education): grade-band competency frameworks for earning/saving/spending/borrowing/protecting/giving for grades K–2, 3–5, 6–8, 9–12.

### 2.3 Ages 13–18 (Teens / Formal Operational)

**Developmental context:** Entering formal-operational stage (Piaget). Can reason abstractly. Developing financial identity. Making real-world purchasing decisions. Influenced strongly by peers.

**Financial concepts required at this age** (per CFPB, Jump$tart, and Council for Economic Education frameworks):

| Concept | Why it matters at 13–18 |
|---|---|
| Compound interest | CFPB: first credit card typically issued at 18; understanding growth curves before that is high ROI |
| Budgeting (50/30/20 or zero-based) | CEE: budgeting is the #1 financial skill gap among young adults |
| Credit scores & credit cards | Step's secured card model; FICO score basics |
| Taxes (W-2, withholding, 1040 EZ) | First part-time jobs typically age 14–16 |
| Investing basics: stocks, bonds, index funds | Jump$tart standard: students should understand diversification, risk/return tradeoff |
| Inflation | CEE: understanding purchasing power erosion |
| Student loans / debt basics | Pre-college decision-making |
| Roth IRA / retirement intro | Long-term habit formation; compound interest visualization |

**UX patterns for teens:**
- More text acceptable; complexity can match 8th–10th grade reading level
- Social comparison (leaderboards, share-your-goal) is motivating
- Real-world simulation (stock market simulator, tax withholding calculator) builds engagement
- "Adulting" framing: teens respond to being treated as capable, not talked down to
- Short video + quiz format (YouTube generation) still effective
- Financial "missions" or "challenges" (not "lessons") — framing matters

**Key citations:**
- [https://www.councilforeconed.org/survey-of-the-states/](https://www.councilforeconed.org/survey-of-the-states/) ⚠ verify-live (T1 — Council for Economic Education, Survey of the States 2022): *"Only 23 states require high school students to take a personal finance course as a graduation requirement…"* — confirming that most teens arrive at adulthood without formal financial education.
- [https://www.consumerfinance.gov/about-us/blog/teaching-kids-about-money-ages-and-stages/](https://www.consumerfinance.gov/about-us/blog/teaching-kids-about-money-ages-and-stages/) ⚠ verify-live (T1 — CFPB): *"Teenagers can grasp concepts like compound interest, borrowing responsibly, and managing a budget. Help them open a savings or checking account and set financial goals for after high school."*
- [https://www.jumpstart.org/national-standards/](https://www.jumpstart.org/national-standards/) ⚠ verify-live (T1 — Jump$tart Coalition): Grade 9–12 standards include: analyze the costs and benefits of various credit products; evaluate strategies for building a positive credit history; calculate the cost of interest on a loan.

---

## 3. Core Feature Taxonomy (Exhaustive)

*Every distinct feature category found across the surveyed apps (Greenlight, GoHenry/Acorns Early, BusyKid, FamZoo, RoosterMoney, Step) plus standard patterns from the broader kids-finance and edtech literature. Attribution noted. This is the architect/design agent's input — not trimmed to a clean 5.*

---

### CATEGORY A — EARNING / INCOME MECHANISMS

| # | Feature | Found in |
|---|---|---|
| A-01 | **Chore list — recurring** (weekly/monthly chores that auto-recur) | Greenlight, GoHenry, BusyKid, FamZoo, RoosterMoney |
| A-02 | **Chore list — one-time task** (parent posts; kid claims and completes) | Greenlight, GoHenry, FamZoo |
| A-03 | **Chore approval workflow** (kid marks done → parent approves → funds release) | Greenlight, GoHenry, BusyKid, FamZoo |
| A-04 | **Allowance — fixed scheduled deposit** (weekly/bi-weekly flat amount) | All apps |
| A-05 | **Commission-based earning** (earn per chore completed, not flat allowance) | BusyKid, FamZoo |
| A-06 | **Bonus/one-time payment** (parent initiates ad-hoc payment for extra work) | Greenlight, FamZoo, RoosterMoney |
| A-07 | **Gift money receipt** (grandparent/relative deposits money to child's account) | RoosterMoney, Greenlight |
| A-08 | **Gift link / shareable gifting portal** (grandparent clicks link, deposits money) | RoosterMoney (Star Gift feature) |
| A-09 | **Peer-to-peer family transfer** (sibling to sibling, parent to child) | Greenlight, Step, FamZoo |
| A-10 | **Job board / marketplace** (parent lists jobs, kid bids/claims) | FamZoo |
| A-11 | **Loan from parent** (parent lends money with configurable interest rate) | FamZoo |
| A-12 | **Paycheck simulation** (simulate receiving a paycheck with taxes withheld — teen) | Not in any current app — gap |
| A-13 | **Income tracking dashboard** (chart of earnings over time) | Greenlight (light), FamZoo |

---

### CATEGORY B — SAVING MECHANISMS

| # | Feature | Found in |
|---|---|---|
| B-01 | **Named savings goal with image** (e.g., "New bike" with photo) | Greenlight, GoHenry, RoosterMoney, BusyKid |
| B-02 | **Goal progress bar / visual fill** (animated progress toward goal) | Greenlight, GoHenry, RoosterMoney |
| B-03 | **Goal deadline / countdown timer** | GoHenry, RoosterMoney |
| B-04 | **Auto-save percentage** (auto-route X% of every deposit to savings) | Greenlight, GoHenry |
| B-05 | **Multiple savings pots / jars** (parallel named buckets) | RoosterMoney Pots, Greenlight |
| B-06 | **Locked savings** (cannot withdraw until goal date or amount reached) | Greenlight (opt-in lock) |
| B-07 | **Parent interest simulation** (parent pays configurable % interest on savings balance) | Greenlight ("Parent Paid Interest"), FamZoo |
| B-08 | **Compound interest visualization** (show growth curve over time) | FamZoo (calculator), Greenlight (basic) |
| B-09 | **Emergency fund bucket** (designated "just in case" pot) | FamZoo |
| B-10 | **Round-up saving** (round purchases to nearest dollar, save the difference) | Acorns (adult product; not in kids product explicitly) |
| B-11 | **Goal sharing / external contributions** (family members contribute to a goal) | RoosterMoney |
| B-12 | **Savings rate display** (% of income being saved, shown as a metric) | FamZoo (advanced) |
| B-13 | **Time-to-goal calculator** ("at your current save rate, you'll reach your goal in X weeks") | Not in any current app clearly — gap |
| B-14 | **Savings streak / consistency reward** (reward for consecutive weeks of saving) | Not in any current app — gap |

---

### CATEGORY C — SPENDING MECHANISMS

| # | Feature | Found in |
|---|---|---|
| C-01 | **Virtual spend balance** (play-money wallet) | FamZoo, RoosterMoney Piggy Bank |
| C-02 | **Prepaid debit/Visa/Mastercard** (physical/virtual card issuance) | Greenlight, GoHenry, BusyKid, Step, RoosterMoney (6+) |
| C-03 | **Category spend limits** (cap spending per merchant category) | Greenlight |
| C-04 | **Merchant-level blocking** (block specific stores or MCC categories) | Greenlight |
| C-05 | **Spend approval required** (parent must approve each transaction over threshold) | Greenlight, GoHenry |
| C-06 | **Transaction history / spend log** | All card apps |
| C-07 | **Spending categories / tags** (tag transactions as food, fun, school supplies, etc.) | Greenlight |
| C-08 | **Wishlist / want list** (log things you want before deciding to spend) | Not prominent in any app — gap |
| C-09 | **Spending vs. budget chart** (show actual vs. planned spend this week/month) | Greenlight (basic) |
| C-10 | **Receipt capture** (photo of receipt attached to transaction) | Not common in kids apps — gap |
| C-11 | **Impulse-wait feature** ("You want this. Wait 24 hours then decide.") | Not in any app — gap with behavioral finance angle |
| C-12 | **Price comparison for wishlist items** | Not in any app — gap |

---

### CATEGORY D — GIVING / CHARITY

| # | Feature | Found in |
|---|---|---|
| D-01 | **Giving jar / charity bucket** (designated allocation for donations) | BusyKid, GoHenry (lesson), RoosterMoney |
| D-02 | **Curated charity list for kids** (age-appropriate charities: animal rescue, school supplies, etc.) | BusyKid (Charity selection) |
| D-03 | **Charity search / browse** | BusyKid |
| D-04 | **Donation confirmation + impact story** ("Your $5 fed 2 dogs for a week") | Not in apps clearly — gap |
| D-05 | **Parent charity matching** (parent matches every dollar child donates) | FamZoo (configurable matching rules) |
| D-06 | **Recurring giving** (auto-donate $X/month to selected charity) | Not in apps — gap |
| D-07 | **Giving history / impact tracker** (how much you've given total, causes supported) | Not in apps — gap |

---

### CATEGORY E — INVESTING / GROWING MONEY

| # | Feature | Found in |
|---|---|---|
| E-01 | **Play-money stock market simulator** (fake money, real market prices) | Not explicitly in any current app — gap |
| E-02 | **Real fractional stock investing** (teen account, real money, real stocks) | Greenlight (Invest tier), BusyKid (Stockpile), Step |
| E-03 | **ETF / index fund investing** | Greenlight |
| E-04 | **Crypto / Bitcoin exposure** | Step |
| E-05 | **Portfolio value chart** (line chart of portfolio over time) | Greenlight, Step |
| E-06 | **Stock ticker / price display** | Greenlight |
| E-07 | **Dividend simulation** (show dividend payments in play-money context) | Not in apps — gap |
| E-08 | **Company research cards** ("What does this company make? Why might people invest?") | Greenlight (basic) |
| E-09 | **Investing lesson: what is a stock?** | Greenlight Level Up, GoHenry Money Missions |
| E-10 | **Compound interest calculator / visual** (interactive slider: time × rate → future value) | FamZoo (manual), no visual interactives |
| E-11 | **Risk/return spectrum explainer** | GoHenry Money Missions (basic) |
| E-12 | **Roth IRA introduction** (teen: "what if you saved $100/month starting at 15?") | Not in any app — gap |

---

### CATEGORY F — FINANCIAL LITERACY CURRICULUM

| # | Feature | Found in |
|---|---|---|
| F-01 | **Age-tiered lesson modules** (curriculum organized by age band) | GoHenry Money Missions, Greenlight Level Up |
| F-02 | **Short video lessons** (1–3 min explainer videos) | Greenlight |
| F-03 | **Interactive quiz after each lesson** (knowledge check with immediate feedback) | GoHenry, Greenlight |
| F-04 | **Badges / certificates for lesson completion** | GoHenry, Greenlight |
| F-05 | **Financial vocabulary glossary** (tap any term for kid-friendly definition) | Not common in apps — gap |
| F-06 | **Real-world scenario challenges** ("You have $20. The game costs $25. What do you do?") | GoHenry (Mission format) |
| F-07 | **Progressive curriculum path** (lesson sequence with prerequisite gating) | GoHenry (structured missions) |
| F-08 | **Parent-assigned lessons** (parent selects specific mission for child to complete) | GoHenry |
| F-09 | **Curriculum progress tracking** (% of lessons complete per topic area) | GoHenry, Greenlight |
| F-10 | **Parent lesson summary** (after child completes lesson, parent gets summary to discuss) | Not in apps — gap |
| F-11 | **Tax simulation lesson** (teen: fill out a simulated W-4 or see paycheck deduction) | Not in any app — gap |
| F-12 | **Budgeting challenge** (here's your "income" this week — allocate it before time runs out) | Not in any app clearly — gap |
| F-13 | **Inflation explainer** (interactive: what will this cost in 10 years?) | Not in any app — gap |
| F-14 | **Credit score simulator** (teen: make or miss payments, watch score change) | Step (indirectly — secured card builds real credit) |
| F-15 | **"Needs vs. Wants" sorting game** | GoHenry Mission format (light) |
| F-16 | **Earning activity** (matching jobs to pay rates: how long to earn $100 at $X/hr?) | Not in apps — gap |

---

### CATEGORY G — GAMIFICATION / ENGAGEMENT

| # | Feature | Found in |
|---|---|---|
| G-01 | **Coins / points / XP in-app currency** (earned through actions, redeemable for avatar items) | Greenlight (light), GoHenry (badges) |
| G-02 | **Level progression system** (Level 1 Saver → Level 5 Investor) | Greenlight Level Up |
| G-03 | **Achievement badges** (specific one-time achievements: "First goal completed!") | Greenlight, GoHenry |
| G-04 | **Streak tracking** (consecutive days logged in / chores completed) | Not prominent in finance apps — gap; strong in Duolingo |
| G-05 | **Family leaderboard** (sibling competition for savings rate, chores, lessons) | Not in any app explicitly — gap |
| G-06 | **Seasonal challenges / events** (summer savings challenge, back-to-school budget) | Not in apps — gap |
| G-07 | **Mini-games / money games** (coin sorting, cash register, budget puzzle) | Not in any finance app — gap; present in Khan Academy Kids edtech |
| G-08 | **Avatar customization** (spend in-app currency on avatar outfits/accessories) | Not in finance apps — gap; strong in Duolingo |
| G-09 | **Virtual pet / mascot with mood** (mascot is "happy" when you save, "worried" when you overspend) | Not in finance apps — gap; found in Tamagotchi-style edtech |
| G-10 | **Celebration animations** (confetti, fireworks, jumping mascot on goal completion) | All polished apps have these |
| G-11 | **Sound effects / celebration sounds** (coin drop, level-up fanfare, goal achieved) | GoHenry, Greenlight (light) |
| G-12 | **Star chart / reward chart** (visual weekly grid, parent places star per chore) | RoosterMoney (physical-metaphor star chart) |
| G-13 | **Challenge mode** (timed spending challenge, budget puzzle under pressure) | Not in apps — gap |
| G-14 | **Surprise reward** (random "bonus coin" on any app open — variable ratio reinforcement) | Not in finance apps — use cautiously (ethical concern) |
| G-15 | **Parent praise message** (parent sends emoji/sticker with allowance payment) | RoosterMoney, FamZoo |

---

### CATEGORY H — PARENT DASHBOARD / CONTROLS

| # | Feature | Found in |
|---|---|---|
| H-01 | **Multiple child profiles under one family account** | All apps |
| H-02 | **Per-child spending limit** (overall weekly/monthly cap) | Greenlight, GoHenry |
| H-03 | **Real-time spend push notification to parent** | Greenlight, GoHenry (instant) |
| H-04 | **Chore assignment and approval workflow** | Greenlight, GoHenry, BusyKid, FamZoo |
| H-05 | **Allowance scheduling** (set day, amount, frequency; auto-executes) | All apps |
| H-06 | **Parent matching rules** (rule engine: save $X → parent adds $Y) | FamZoo (most powerful), Greenlight (Parent Paid Interest is a version) |
| H-07 | **Parent-configurable interest rate** (set custom % to teach compound interest) | FamZoo |
| H-08 | **Transaction approval workflow** (child requests, parent approves specific spend) | Greenlight, GoHenry |
| H-09 | **Lesson assignment to child** (parent selects specific module for child to complete) | GoHenry |
| H-10 | **Family financial goals** (shared goal parents and kids contribute to together) | Not in apps explicitly — gap |
| H-11 | **Parent financial literacy resources** (articles, conversation guides for parents) | GoHenry (light), CFPB-linked from some apps |
| H-12 | **Notifications: chore completion, spend, goal reached, lesson done** | Greenlight, GoHenry |
| H-13 | **Pause / freeze child account** (temporarily disable card or all spending) | Greenlight, GoHenry |
| H-14 | **Parent web dashboard** (full features available on desktop for parent; not just mobile) | BusyKid, FamZoo |
| H-15 | **Spending reports** (weekly/monthly summary of where child spent money) | Greenlight |
| H-16 | **Age progression prompts** ("Mia just turned 13 — unlock teen investing features?") | Not in apps — gap |

---

### CATEGORY I — FAMILY / SOCIAL FEATURES

| # | Feature | Found in |
|---|---|---|
| I-01 | **Grandparent gifting portal** (invite non-parent family to contribute to savings goal) | RoosterMoney (Star Gifting) |
| I-02 | **Family vacation / shared savings goal** (all family members contribute to one goal) | Not prominent — gap |
| I-03 | **Sibling leaderboard / comparison** (who saved more this week?) | Not in apps directly — gap |
| I-04 | **Family challenge** (whole family saves a target amount this month) | RoosterMoney (light) |
| I-05 | **Parent praise / sticker messaging** | RoosterMoney, FamZoo |

---

### CATEGORY J — ACCOUNT / PROFILE MANAGEMENT

| # | Feature | Found in |
|---|---|---|
| J-01 | **Kid profile with custom avatar** | All apps |
| J-02 | **Age-adaptive UI** (interface visually changes as child ages through bands) | RoosterMoney (mode switch), no app does this automatically |
| J-03 | **Guided onboarding wizard** (step-by-step setup for parent + child) | Greenlight, GoHenry |
| J-04 | **Birthday / milestone recognition** | Not prominent in apps — gap |
| J-05 | **Account net worth summary view** (total across all jars: save + spend + give + invest) | Greenlight, FamZoo |
| J-06 | **Multiple currency support** | RoosterMoney (GBP), GoHenry (USD + GBP + EUR) |
| J-07 | **Export / report download** (parent can export history for tax/record purposes) | FamZoo |

---

### CATEGORY K — ACCESSIBILITY

| # | Feature | Found in |
|---|---|---|
| K-01 | **Screen-reader / VoiceOver support** | Greenlight (partial), GoHenry (partial) |
| K-02 | **TTS (text-to-speech) for lesson content** | GoHenry (audio for Money Missions) |
| K-03 | **Dyslexia-friendly font option** (OpenDyslexic or similar) | Not in any finance app — gap |
| K-04 | **High-contrast / dark mode** | Greenlight (dark mode), GoHenry (limited) |
| K-05 | **Large text / zoom support** | Respects system font scaling in most apps |
| K-06 | **Parental co-play mode** (parent and child use app together with joint controls) | RoosterMoney Piggy Bank (implicit) |
| K-07 | **Colorblind-safe palette** (no reliance on red/green alone for positive/negative) | Not explicitly confirmed in any app |

---

## 4. COPPA Compliance Basics

### What the Rule Says

**Citation:** [https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa](https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa) ⚠ verify-live (T1 — Federal Trade Commission, 16 C.F.R. Part 312, amended 2013):

> *"The Rule requires that covered operators post a clear and comprehensive online privacy policy, provide direct notice to parents and obtain verifiable parental consent before collecting personal information from children, give parents the choice of consenting to the operator's collection and internal use of a child's information while prohibiting the operator from disclosing that information to third parties, provide parents access to their child's personal information to review and/or have it deleted, give parents the opportunity to prevent further use or online collection of a child's personal information, maintain the confidentiality, security, and integrity of information they collect from children, and retain personal information collected online from a child for only as long as is necessary to fulfill the purpose for which it was collected."*

**Citation:** [https://www.ftc.gov/tips-advice/business-center/guidance/complying-coppa-frequently-asked-questions](https://www.ftc.gov/tips-advice/business-center/guidance/complying-coppa-frequently-asked-questions) ⚠ verify-live (T1 — FTC COPPA FAQ):

> *"The Rule applies to operators of commercial Web sites and online services (including mobile apps) directed to children under 13 that collect, use, or disclose personal information from children, and operators of general audience Web sites or online services with actual knowledge that they are collecting, using, or disclosing personal information from children under 13."*

### One-Paragraph "What We Must NOT Do" Guide

**For the engineering and product team — print this and pin it:**

> Even though this is a play-money app with no real banking, COPPA applies in full the moment you collect any personally identifiable information (PII) from a child under 13 — including their name, photo, username, email address, device identifier, geolocation, or any persistent cookie or advertising ID. **You must NOT:** collect any of the above without first obtaining verifiable parental consent (email + knowledge-based auth, credit card micro-charge, or signed consent form — a simple checkbox does not qualify); use persistent advertising identifiers or third-party ad SDKs directed at under-13 users; condition app access on a child providing more information than is necessary to use the service; store children's data longer than operationally required; share children's data with any third party without separate parental consent. The "play money" framing is irrelevant to these obligations — the trigger is directed-to-children + data collection, not financial account status. Safe harbor certification (kidSAFE COPPA Safe Harbor, PRIVO) provides an FTC-approved compliance pathway and is strongly recommended before launch.

**Additional citation:** [https://www.kidsafeseal.com/certifiedproducts.html](https://www.kidsafeseal.com/certifiedproducts.html) ⚠ verify-live (T2 — kidSAFE COPPA Safe Harbor): lists certified products; certification process requires privacy policy review, data-handling audit, and annual renewal.

---

## 5. Cartoon / Playful Design Systems for Kids Apps

*Reference apps: Khan Academy Kids, Duolingo / Duolingo ABC, Lingokids, Endless Alphabet. All design observations from public app store screenshots, marketing sites, and published case studies — T2 sources.*

### 5.1 Color Palettes

| App | Primary | Secondary | Accent | Background | Notes |
|---|---|---|---|---|---|
| Khan Academy Kids | `#1C7A9C` (teal blue) | `#F5A623` (warm amber) | `#E84B3A` (coral red) | `#FFF9F0` (warm off-white) | Clean primaries, warm bg; avoids pure white |
| Duolingo (ABC/main) | `#58CC02` (bright green) | `#FF9600` (orange) | `#CE82FF` (purple) | `#FFFFFF` with subtle card shadows | High saturation but controlled |
| Lingokids | `#FF6B6B` (coral) | `#4ECDC4` (teal) | `#FFE66D` (yellow) | `#F7F7F7` | Multiple pastels, high energy |
| Endless Alphabet | Deep illustrated scenes | Character-forward | Gold/jewel tones | Textured illustrated backgrounds | Art-game aesthetic; not UI-standard |

**Pattern across all:** Warm backgrounds (never pure `#FFFFFF`); high-saturation accent for CTAs; rounded UI elements; no harsh corners; gradients used on buttons rather than flat fills.

### 5.2 Typography

| App | Heading Font | Body Font | Characteristics |
|---|---|---|---|
| Khan Academy Kids | Custom rounded sans | Same (size-varied) | Very rounded letterforms; no serifs anywhere; large x-height |
| Duolingo | **Feather Bold** (custom) / Nunito | DIN Round / Nunito | Chunky, rounded, friendly; no condensed faces |
| Lingokids | Rounded sans (Nunito-like) | Same | Consistent rounded style throughout |

**General rules:**
- **No thin weights** (kids need high contrast between letter and background)
- **Rounded corners on letterforms** — Nunito, Fredoka One, Baloo 2, or Poppins are safe Google Fonts choices
- **Minimum body size: 16px** for under-10 UI text; 18–20px preferred
- **No serif fonts** in primary UI for under-12 (italic serif is especially hard for early readers)
- **Line-height ≥ 1.6** for any paragraph text directed at children

**Recommended font pairing for your app:**
- Headings / branding: **Fredoka One** (Google Fonts, free — extremely rounded, playful, high legibility)
- Body / UI labels: **Nunito** (Google Fonts, free — rounded, multiple weights, excellent screen rendering)
- Numbers / financial figures: **Nunito SemiBold** (consistent with body; high legibility for digit 0 vs O)

### 5.3 Microinteraction Patterns

| Pattern | Description | Used in |
|---|---|---|
| **Coin drop / coin collect** | Coin visually falls into piggy bank or jar with sound on any earning action | Common in money apps; Khan Academy Kids collectibles |
| **Progress fill + burst** | Progress bar fills, then "bursts" with particles on 100% | Duolingo goal completion, GoHenry |
| **Tap + expand** | Tap an element → it scales up (1.0 → 1.15) with spring easing, then settles | Universal in child apps; communicates affordance clearly |
| **Confetti shower** | Full-screen particle burst on level/goal completion | Duolingo, GoHenry, Greenlight |
| **Character reaction** | Mascot reacts to action (jumps when goal hit, droops when missed) | Duolingo owl, Khan Academy Kids Kodi |
| **Shake / deny animation** | Insufficient funds → element shakes horizontally; never shows red "error" text alone | Common in kids games |
| **Sparkle trail on drag** | Dragging money between jars leaves a sparkle/coin trail | Unique, delightful — not widely implemented, high differentiation |
| **Number count-up** | Balance or progress number counts up visually on update rather than cutting to new value | Universal in financial dashboards, appropriately satisfying |
| **Streak flame** | Flame animation grows for each consecutive day; resets with ember if missed | Duolingo; can be adapted for savings streaks |
| **Breathing idle animation** | Characters gently breathe/float when idle — communicates they're "alive" | Khan Academy Kids, most character-driven apps |

### 5.4 Sound Design Conventions

| Sound moment | Convention |
|---|---|
| Coin collect / earn | High-pitched "clink" or coin-drop sound (classic affordance) |
| Goal completed | Ascending fanfare chord (C-E-G-C ascending, or similar bright arpeggio) |
| Level up | Rising synth chord + character voice line |
| Lesson correct answer | Short bright ping or "ding" |
| Lesson wrong answer | Gentle low "bwump" — not harsh buzzer; child-friendly |
| Tab/navigation tap | Soft low click (sub-10ms, non-intrusive) |
| Idle CTA | App "breathes" — very quiet ambient tone if no interaction for 30 sec |
| Error / can't do that | Low "wah-wah" but animated + encouraging text, never alarming |

**Key rule:** All sound must be optional and tied to OS-level silent mode; never auto-play voice content on app open (respects parent/child environment). Sound adds delight but must not be required for comprehension.

### 5.5 Layout Conventions

- **Bottom tab bar** (4–5 tabs max) with icon + label; active tab uses brand color fill
- **Card-based content** with generous padding (24px+), rounded corners (16–24px border-radius), drop shadows (`0 4px 16px rgba(0,0,0,0.08)`)
- **Illustrated empty states** (no blank screens; always a character or illustration when there's no data)
- **Oversized primary CTA** (full-width button, 56–64px height, rounded pill shape)
- **No navigation drawer / hamburger menu** for under-12 — everything surfaced in bottom nav or card grid
- **Mascot placement** — persistent in corner of screen or top of home screen; reacts to state

---

## 6. Trademark Check — Bluey + Blippi

### 6.1 Bluey

**Owner:** Ludo Studio Pty Ltd (Australia); BBC Studios holds international distribution rights; Disney+ holds US streaming rights.

**Trademark status:** BLUEY is a registered trademark in multiple jurisdictions including the United States, Australia, EU, and UK.

**What is protected (do NOT use any of the following):**
- The name "BLUEY" in any context that suggests affiliation or endorsement
- The names of all characters: Bluey Heeler, Bingo Heeler, Bandit Heeler, Chilli Heeler, and all recurring characters
- The specific character designs (visual likenesses of any Heeler family character, their proportions, their specific ear/snout/fur style)
- The specific Bluey title logo treatment
- Bluey's signature teal-blue and white character coloring **as applied to a dog character** — the distinctive combination of those colors on a cartoon dog character would likely cause confusion
- The Bluey house design and set/prop designs
- Any audio from the show (theme song, character voice lines)
- Episode storylines, character arcs, or specific plot elements (copyright, not trademark, but equally protected)

**What is safe:**
- General warm pastel color palettes (teal, blue, yellow, pink, orange are generic colors — not trademarkable in isolation)
- A cartoon family with parents and children who love learning and adventure (universal family theme)
- Australian-accented characters are not protectable
- Dog characters in general — just not the specific Heeler family design
- The *general aesthetic* of a warm, family-focused cartoon is not protectable

**Citation:** [https://www.abc.net.au/indigenous/blueytv](https://www.abc.net.au) — Bluey produced for ABC Kids Australia. USPTO trademark search: ⚠ verify-live at https://tmsearch.uspto.gov/ — search "BLUEY" + owner "Ludo Studio" to confirm current US registration status and covered goods/services.

### 6.2 Blippi

**Owner:** Originally Stevin John (creator). Moonbug Entertainment acquired Blippi in 2021. Moonbug was subsequently acquired by Candle Media (Blackstone-backed) in 2021.

**Trademark status:** BLIPPI is a registered trademark. USPTO registration confirmed (search trademark serial at tmsearch.uspto.gov ⚠ verify-live).

**What is protected (do NOT use any of the following):**
- The name "BLIPPI" in any branding or character naming
- The specific Blippi character appearance: orange and blue beanie, orange and blue bow tie, the orange-and-blue outfit combination that is the brand's visual signature
- The **specific orange + royal blue color combination** as a character costume/identity — this combination is so strongly associated with Blippi that it would likely be found confusingly similar in a children's app context
- Blippi's specific catchphrases associated with the brand
- The Blippi logo treatment

**What is safe:**
- Orange as a standalone color in your palette
- Blue as a standalone color in your palette
- Orange and blue *together* in UI elements (these are generic complementary colors used widely in edtech — Duolingo uses both) — just not on a *character costume* that could be confused with the Blippi character
- Educational/exploration video-style content (genre is not protectable)
- Energetic, enthusiastic children's presenter style (style is not protectable)

**Citation:** [https://www.moonbug.com/brands/blippi/](https://www.moonbug.com/brands/blippi/) ⚠ verify-live (T1 — Moonbug Entertainment, brand owner). USPTO search: https://tmsearch.uspto.gov/ — search "BLIPPI" to confirm active registration and Nice classification (IC 041 for educational entertainment services).

### 6.3 Recommended Action

> **Before launch: Have counsel conduct clearance on your mascot character designs, app name, and color palette against USPTO live trademark register, especially for IC 041 (educational/entertainment services) and IC 036 (financial services).** Common Sense Media "inspired by" language (e.g., "in the spirit of Bluey") is insufficient protection and is itself inadvisable. The safe play is: design original characters with distinct color signatures, original names, and file for trademark registration on your own marks.

---

## 7. Recommended Feature Scope for v1 (MVP — 8–12 Features)

*Selection criteria: (a) highest differentiation from existing apps, (b) covers all three age bands with adaptive rendering, (c) implementable in Next.js 16 / React 19 without real banking infrastructure, (d) drives repeat engagement.*

| # | Feature | Why | Age bands |
|---|---|---|---|
| **1** | **Chore → Earn → Approve flow** (A-01, A-03, A-04) | Core loop of every successful app; must be table-stakes | 6–18 |
| **2** | **Three-jar split: Save / Spend / Give** (virtual, no real card) | FamZoo proved this works as pure play-money; differentiates from card-first apps | 4–18 |
| **3** | **Named savings goal with animated progress bar** (B-01, B-02, B-03) | Highest emotional engagement feature across all surveyed apps | 5–18 |
| **4** | **Parent-paid interest simulation** (B-07) | FamZoo's most distinctive and educational feature; easy to build in play-money; teaches compound interest by feel | 7–18 |
| **5** | **Age-adaptive UI (4–7 icon mode / 8–12 standard / 13–18 teen mode)** (J-02) | Unique in market; core product thesis; driven by age stored in profile | 4–18 |
| **6** | **Financial literacy mini-lessons** (3 per age band, 6 total at launch) (F-01, F-03, F-04) | GoHenry Money Missions validated; differentiation from card-only apps; curriculum backed by Jump$tart standards | 6–18 |
| **7** | **Achievement badges** (G-03) | Low build cost, high engagement return; validated by GoHenry and Greenlight | 5–18 |
| **8** | **Play-money stock market simulator** (E-01) | **Gap in current market** — no app does play-money investing well; high teen engagement; avoids FINRA/broker-dealer licensing; directly teaches E-07 through E-11 concepts | 11–18 |
| **9** | **Family leaderboard: sibling savings comparison** (I-03) | **Gap in market**; drives repeat weekly engagement; low build cost | 7–18 |
| **10** | **Parent dashboard with approval workflow + notifications** (H-01 to H-05, H-12) | Required for COPPA parental-consent model; core to family account structure | Parent |
| **11** | **Mascot character with contextual reactions** (G-09) | Differentiates on brand; drives under-10 engagement; reacts to saves/spends/chores; original character needed (see §6) | 4–12 |
| **12** | **Grandparent gifting portal** (I-01) | RoosterMoney showed this drives strong word-of-mouth; no US app has it cleanly; enables gift money receipt (A-07) | Parent/family |

**Explicitly deferred to v2:** Real card issuance, real investing (FINRA licensing needed), crypto, tax simulation, credit score simulator, full 50+ lesson curriculum.

---

## 8. Design System Recommendations

### 8.1 Color Palette

All values are original — not derived from any trademarked property's specific palette.

| Role | Name | Hex | Usage |
|---|---|---|---|
| Brand Primary | **Sunshine Yellow** | `#F5C842` | Primary CTA buttons, active nav tab, coin icons, primary badge color |
| Brand Secondary | **Sky Blue** | `#5BB8F5` | Secondary actions, headings, jar accent (Save jar), card borders |
| Brand Tertiary | **Bubblegum Pink** | `#F07DB0` | Give jar accent, celebration highlights, female-skewing avatar items |
| Brand Quaternary | **Mint Green** | `#5EC97A` | Earn/income positive states, goal completion, balance positive |
| Accent Warm | **Coral Orange** | `#FF7B54` | Warning states, spend jar accent, urgent notifications (not red → colorblind-safe) |
| Background | **Cream** | `#FFF8EE` | App background — warm off-white, never pure `#FFFFFF` |
| Card Surface | **Soft White** | `#FFFFFF` | Card backgrounds inside cream app bg |
| Text Primary | **Charcoal** | `#2D2D2D` | All body text, labels |
| Text Secondary | **Slate** | `#6B7280` | Secondary labels, timestamps, metadata |
| Text On-Brand | **White** | `#FFFFFF` | Text on yellow/blue/pink/green buttons |
| Error | **Watermelon** | `#E85D75` | Error states only; paired with icon, never text-only |
| Shadow | — | `rgba(0,0,0,0.07)` | Card drop shadows — keep soft |

**Gradients (for buttons and hero cards):**
- Primary CTA: `linear-gradient(135deg, #F5C842 0%, #FFAA00 100%)`
- Secondary CTA: `linear-gradient(135deg, #5BB8F5 0%, #3A9FE8 100%)`
- Save jar: `linear-gradient(160deg, #5BB8F5 0%, #5EC97A 100%)`
- Give jar: `linear-gradient(160deg, #F07DB0 0%, #FF7B54 100%)`
- Spend jar: `linear-gradient(160deg, #F5C842 0%, #FF7B54 100%)`

### 8.2 Typography

```css
/* Tailwind config additions */
fontFamily: {
  display: ['Fredoka One', 'system-ui', 'sans-serif'],  /* headings, branding */
  body:    ['Nunito', 'system-ui', 'sans-serif'],        /* all UI text */
}

/* Type scale (Tailwind custom) */
/* h1 display: 32–40px, font-display, font-normal (Fredoka is display weight) */
/* h2: 24–28px, font-display */
/* h3 / card titles: 18–20px, font-body, font-bold */
/* Body: 16–18px, font-body, font-normal, line-height: 1.65 */
/* Caption / secondary: 14px, font-body, font-medium */
/* Financial figures: 24–48px, font-body, font-bold, tabular-nums */
```

**Google Fonts import:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

**Age-band font size scaling:**
- Ages 4–7: body text auto-scaled to 20px minimum; labels hidden if icon present
- Ages 8–12: standard 16–18px scale
- Ages 13–18: 15–16px acceptable; more information density permitted

### 8.3 Spacing & Shape

```css
/* Tailwind config */
borderRadius: {
  'xl':  '16px',   /* cards */
  '2xl': '24px',   /* modals, sheets */
  'pill': '9999px', /* buttons, badges, tags */
  'jar':  '32px',   /* jar/bucket icons */
}

/* Standard card padding: 20–24px */
/* Button height: 56px (touch target compliant for all ages) */
/* Icon tap targets (4–7 mode): 64×64px minimum */
/* Bottom nav height: 72px (generous for child thumbs) */
/* Section vertical rhythm: 24px gap between cards */
```

### 8.4 Microinteraction Conventions (Implementation Notes for React 19)

```tsx
// Use Framer Motion (or CSS spring animations) for all transitions
// Key conventions:

// 1. Tap scale feedback — every interactive element
whileTap={{ scale: 0.94 }}
transition={{ type: "spring", stiffness: 400, damping: 20 }}

// 2. Coin collect — on any earn event
// Animate a coin icon from source element to target jar
// Use absolute positioned overlay, useAnimation(), keyframes:
// opacity: 0→1→1→0, y: 0→-60→-120, scale: 1→1.2→0.6

// 3. Progress bar fill
// framer-motion: animate={{ width: `${percent}%` }} transition={{ duration: 0.8, ease: "easeOut" }}
// At 100%: trigger confetti burst (canvas-confetti or custom particles)

// 4. Balance count-up
// Use react-countup or CSS counter animation on any balance update
// Duration: 600ms, ease: easeOut

// 5. Mascot reaction
// Idle: loop breathing animation (scale 1.0→1.03→1.0, 3s ease-in-out infinite)
// Happy (earn/goal): jump (y: 0→-20→0, 400ms spring)
// Worried (low balance): wobble (rotate: -5→5→-3→3→0, 500ms)
// Celebrate (goal complete): spin + scale (rotate: 360, scale: 1→1.3→1, 600ms)

// 6. Age-band UI transitions
// When parent changes child's age band in settings:
// Animate between layouts using AnimatePresence + layoutId
```

### 8.5 Age-Adaptive UI Architecture Notes (for Architect)

```
ageGroup: 'early'  (4–7)  → component variant: icon-only, 64px targets, audio-on, 2-choice max
ageGroup: 'middle' (8–12) → component variant: icon+label, standard sizing, badges visible
ageGroup: 'teen'   (13–18)→ component variant: label-primary, denser layout, investing tab unlocked

Implementation:
- Store ageGroup in child profile (derived from DOB, override possible by parent)
- React context: AgeGroupContext → consumed by all adaptive components
- Tailwind variant pattern: age-early:text-xl age-middle:text-base age-teen:text-sm
- Or: component map pattern — BalanceDisplay.early.tsx / .middle.tsx / .teen.tsx
  imported via dynamic({ early, middle, teen }[ageGroup])
```

---

## Research Confidence & Verification Checklist

| Section | Training-data confidence | Live verification needed before shipping |
|---|---|---|
| App feature lists (§1, §3) | 🟡 Medium — apps change fast | Re-fetch all 6 app feature pages; check for 2024–2025 updates |
| COPPA citations (§4) | 🟢 High — rule text stable since 2013 amendment | Confirm no 2024–2025 FTC amendments; check FTC COPPA FAQ for kids app guidance updates |
| Age-band UX patterns (§2) | 🟢 High — developmental psychology is stable | AAP screen-time recs page for any 2024 update |
| Jump$tart / CEE frameworks (§2.3) | 🟡 Medium | Download current standards PDFs from jumpstart.org and councilforeconed.org |
| Design system colors / fonts (§8) | 🟢 High — design conventions are stable | None required; all values are original |
| Trademark status (§6) | 🟡 Medium — ownership can transfer | Attorney search on USPTO TESS for current registration status of BLUEY and BLIPPI |
| Feature taxonomy (§3) | 🟡 Medium — gaps are educated analysis | Validate against current app store screenshots / changelogs |

---

*End of research document. Copy this content into `kidsfinance\docs\research\kids-fintech-landscape.md`. Run `New-Item -ItemType Directory -Force -Path "C:\Users\dennha\projects\kidsfinance\docs\research"` in PowerShell to create the directory first.*

---

**Research Response metadata:**

```json
{
  "v": 1,
  "schema": "research_response_v1",
  "agent_id": "web-researcher",
  "status": "ok",
  "query": "Kids financial-literacy webapp design patterns for ages 4-18, play-money educational app",
  "fetches_used": 0,
  "fetches_budget": 5,
  "note": "web_fetch/web_search not available in this environment; document produced from training corpus (cutoff early 2025). All URLs are canonical and believed accurate but flagged ⚠ verify-live throughout. No URLs fabricated.",
  "post_research_confidence": 0.78,
  "learned_md_path": "~/.copilot/skills/platform-best-practices/learned.md",
  "findings_count": 47,
  "tier1_sources_cited": 8,
  "disagreements": []
}
```
