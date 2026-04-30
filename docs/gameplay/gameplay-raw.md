Agent completed. agent_id: wwww-gameplay, agent_type: Gameplay Designer, status: completed, description: Design 3 age-tiered game modes, elapsed: 1147s, total_turns: 0, duration: 1122s

I now have everything I need. I have read:
- The full existing `GameState` type and component patterns
- The `page.tsx` (existing 4-7 mode) in full
- The research doc across all key sections (competitive landscape, age-band UX, feature taxonomy, COPPA)
- The character SVG library (`Mochi`, `Bunny`, `Egg`, `CoinwoodScene`)

Writing all four design documents now. These are long; each one is produced in full below.

---

## `docs/gameplay/mode-coinland-4-7.md`

```markdown
# Mode: Coinland — Ages 4–7
> **Win Win Win · Coinwood Story World**
> Version: 1.0 · Author: Gameplay Designer · Status: Ready for engineering

---

## 1. Overview & Design Philosophy

Coinland is the entry door to Coinwood for children aged 4–7 (pre-reader through early reader).
It follows the **tap-and-celebrate** paradigm established in the MVP: every interaction must be
completeable by a child who cannot read, using icon-first navigation, ≥60 px tap targets, and
instant audio/visual feedback on every state change.

**Design pillars for this age band (per AAP joint media engagement guidance and Common Sense
Media UX criteria):**
1. No required reading — every concept expressible as icon + sound
2. ≥ 60 px touch targets on all interactive elements
3. Maximum 2–3 choices per screen (Miller's Law reduced for under-7s)
4. Celebration-first error recovery — no "wrong answer" text; redirect with animation
5. Parent co-use layer always accessible but not required for child's core loop
6. Session length nudge at 10 minutes (AAP guideline: 1 hr/day limit for ages 2–5)

> **Learning citations:**
> - CFPB Money As You Grow — Activities for ages 3–5: counting coins, earning through helping,
>   piggy bank metaphor. https://www.consumerfinance.gov/consumer-tools/money-as-you-grow/ ⚠ verify-live
> - Jump$tart Coalition National Standards, Grade Band K–2: "Explain that people work to earn
>   money to buy things they need and want." https://www.jumpstart.org/national-standards/ ⚠ verify-live

---

## 2. Core Loop (Daily, ~8–10 min)

```
OPEN APP
  │
  ▼
Mochi greets with voice cue + animation
  │
  ▼
TODAY'S JOBS (2–3 chores shown as large emoji cards)
  │  tap a chore → celebrate animation + coin rain → coins appear in hand
  ▼
CHOOSE A JAR (Save 🐷 / Spend 🍭 / Give ❤️ — large tiles, coin flies into jar)
  │
  ▼
MINI-GAME UNLOCK (after all chores done — Coin Catch OR Match-the-Coin)
  │
  ▼
STORY MOMENT (30-sec animated mascot story — optional / parent can skip)
  │
  ▼
DONE screen → confetti → Mochi celebrates → streak updated
```

No math required beyond counting 1–10 coins. Jar totals shown as coin-stack illustrations,
not numbers (numbers present but secondary).

---

## 3. New Feature: Coin Catch Mini-Game

### Concept
Coins fall from the sky above Coinwood. Kid taps them before they hit the ground. Runs 60 seconds.
Teaches: coins have value, you earn by acting, counting.

### Mechanics
- Coins appear at random x-positions, fall at varying speeds (slow → fast as time progresses)
- Each caught coin = +1 to a "caught" counter (shown as a coin-stack illustration, not just a number)
- Miss 5 coins → Mochi makes a gentle "uh-oh" sound (no shame text)
- Session ends at 60 sec → caught total displayed → coins deposited to Spend jar as bonus
- Max payout per session: 10 coins (capped to prevent grind exploitation)
- Coin types: penny (tan), nickel (gray), dime (tiny silver), quarter (larger gold) — visual only,
  all worth 1 game-coin in v1; v2 can add value differentiation

### Accessibility
- Large coin tap targets: min 64 px diameter
- Coin appears with a short audio "whoosh" so screen-reader/sound-dependent kids can locate it
- Slow mode available: parent can set "easy" in settings (coins fall 50% slower)

### React Component: `<CoinCatch />`
```tsx
// Props
interface CoinCatchProps {
  durationSec?: number;        // default 60
  maxPayout?: number;          // default 10
  difficulty?: "easy" | "normal"; // easy = slow coins
  onComplete: (coinsCaught: number) => void;
}
```

Internal state:
```ts
type FallingCoin = {
  id: string;
  x: number;        // 0–100 vw percentage
  y: number;        // current y position (animated via requestAnimationFrame)
  speed: number;    // px per frame
  type: "penny" | "nickel" | "dime" | "quarter";
  caught: boolean;
};
```

---

## 4. New Feature: Match-the-Coin Game

### Concept
Two coins shown side-by-side. Child taps the one that is "bigger" (worth more).
Teaches: relative numeric value, greater-than concept, coin recognition.

### Mechanics
- Round structure: 5 questions per session
- Coin pairs drawn from: penny (1¢) vs nickel (5¢), nickel vs dime (10¢), dime vs quarter (25¢),
  penny vs quarter, nickel vs quarter
- Correct tap → big green glow + cheerful sound + +2 XP
- Wrong tap → gentle bounce animation, "Try again!" + correct coin highlighted (no penalty)
- Coin size on screen is consistent (not reflecting real value) — child must read the number label
  or rely on Mochi's voice cue (Web Speech API reads "penny" or "quarter")
- All 5 correct in a row → bonus confetti + "You're a coin expert!" celebration

### Voice Cues (Web Speech API v1)
```ts
// On coin display
speechSynthesis.speak(new SpeechSynthesisUtterance("Which is bigger? The penny or the quarter?"));
// On correct
speechSynthesis.speak(new SpeechSynthesisUtterance("That's right! The quarter is bigger!"));
// On wrong
speechSynthesis.speak(new SpeechSynthesisUtterance("Oops! Let's try again!"));
```

### React Component: `<MatchTheCoin />`
```tsx
interface MatchTheCoinProps {
  roundCount?: number;    // default 5
  voiceEnabled?: boolean; // default true
  onComplete: (score: number) => void;
}
```

---

## 5. New Feature: Story Mode

### Concept
30-second animated vignettes starring Mochi and Bo. Parent-read or auto-voiced.
No quiz — pure narrative with 1 embedded financial concept.
Teaches: money concepts via story metaphor (not instruction).

### Story Library (v1 — 6 stories)

| # | Title | Mascot | Concept | Key line |
|---|-------|--------|---------|----------|
| S1 | Mochi Finds a Coin | Mochi | Earning | "I found a coin on the path! Mochi knew — a found coin is a lucky start." |
| S2 | Bo Learns to Share | Bunny Bo | Giving | "Bo had 3 carrots. She gave 1 to her friend. She still felt full." |
| S3 | The Big Save | Mochi + Bo | Saving | "Mochi wanted a red ball. He saved a coin each day. Then — it was his!" |
| S4 | Needs vs. Wants | Sage | Needs/Wants | "Sage needed food. She wanted a shiny acorn. Food came first." |
| S5 | The Leaky Jar | Mochi | Spending wisely | "Mochi spent every coin the moment he got it. His jar stayed empty." |
| S6 | Coins for the Garden | Grace | Charitable giving | "Grace planted coins in Coinwood's garden. Flowers grew for everyone." |

### Animation Format
- Scene rendered as SVG/CSS animation layers (existing `CoinwoodScene` + character SVGs)
- Each story: 3 "frames" (scene slides), each 8–10 seconds, auto-advance
- Speech bubble advances on tap or auto after audio completes
- Parent can read along — text shown in large font with high contrast

### React Component: `<StoryPlayer />`
```tsx
interface StoryFrame {
  sceneEmoji: string;
  bgMood: "day" | "sunset" | "night";
  characterLeft: "Mochi" | "Bo" | "Sage" | "Grace" | null;
  characterRight: "Mochi" | "Bo" | "Sage" | "Grace" | null;
  speechBubble: string;       // text shown in speech bubble
  voiceLine: string;          // Web Speech API text
}

interface StoryPlayerProps {
  story: StoryFrame[];
  onComplete: () => void;
  voiceEnabled?: boolean;
}
```

---

## 6. Voice Cues System (Web Speech API v1)

All voice cues use `window.speechSynthesis`. Default voice: system default.
Parent settings: mute / voice on / slow speed (rate: 0.8).

```ts
// lib/voice.ts
export function speak(text: string, rate = 1.0) {
  if (typeof window === "undefined") return;
  const utt = new SpeechSynthesisUtterance(text);
  utt.rate = rate;
  utt.pitch = 1.2;   // slightly higher = child-friendly
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utt);
}
```

**Trigger points:**
- App open → Mochi says greeting
- Chore tapped → "Great job! [chore name]!"
- Coin deposited → "[Jar name] jar is filling up!"
- Story frame → reads speech bubble text
- Coin Catch start → "Catch the coins! Ready, go!"
- Match-the-Coin question → reads coin names + question
- Session end → "Amazing work today! See you tomorrow!"

**v2:** Replace Web Speech API with real voice-over audio files (`.mp3`) in `/public/vo/`.

---

## 7. Existing Features: Enhancements

### Chore Cards
- Existing `ChoreButton` retained; add `voiceLine` prop (Mochi reads chore name on hover/focus)
- Add "parent confirms" mode toggle for ages 4–5 (parent must tap to approve completion)

### Jar Tiles
- Existing `JarTile` retained; add coin-stack illustration (number of coin SVGs stacked in jar,
  visual fill) — mirrors the `FancyJar` component already in `characters.tsx`
- On jar reaches milestone (10, 25, 50 coins) → jar "overflows" with mini confetti burst

### Goal Widget
- Existing goal modal retained; add emoji-only goal presets for non-readers:
  🚲 Bike · 🧸 Stuffed Animal · 🍦 Ice Cream · 🎈 Balloon · 🎠 Toy

---

## 8. Component Inventory (Coinland / 4-7 mode)

| Component | File | Purpose |
|-----------|------|---------|
| `<CoinCatch />` | `components/games/CoinCatch.tsx` | 60-sec coin-tap mini-game |
| `<MatchTheCoin />` | `components/games/MatchTheCoin.tsx` | Which coin is bigger? |
| `<StoryPlayer />` | `components/stories/StoryPlayer.tsx` | 30-sec animated story |
| `<StoryFrame />` | `components/stories/StoryFrame.tsx` | Single frame within story |
| `<VoiceCueButton />` | `components/ui/VoiceCueButton.tsx` | Tappable area that speaks |
| `<CoinStack />` | `components/ui/CoinStack.tsx` | Visual coin stack (not number) |
| `<JarFillMeter />` | `components/ui/JarFillMeter.tsx` | Jar with animated liquid fill |
| `<CelebrationBurst />` | `components/ui/CelebrationBurst.tsx` | Confetti + emoji burst overlay |
| `<SessionNudge />` | `components/ui/SessionNudge.tsx` | "10 min played! Great job!" prompt |
| `ChoreButton` | existing | Enhanced: voiceLine prop added |
| `JarTile` | existing | Enhanced: FancyJar visual mode |
| `Mochi` | existing | Enhanced: "celebrate" + "sleep" moods |
| `Bunny` | existing | Enhanced: "happy" + "share" moods |

---

## 9. State Model Extensions (4-7 mode)

```ts
// Additions to existing GameState for Coinland features
// (merge into base GameState under ageBand === "4-7" guard)

type CoinlandState = {
  coinCatchHighScore: number;
  coinCatchLastPlayDate: string;      // YYYY-MM-DD — 1 session per day cap
  matchTheCoinBestRun: number;        // consecutive correct answers
  storiesWatched: string[];           // story IDs watched
  voiceEnabled: boolean;
  sessionStartTime: string | null;    // ISO timestamp for 10-min nudge
};
```

Full extended `GameState` (additions to existing `lib/game.ts`):
```ts
export type GameState = {
  // ... existing fields unchanged ...
  kidName: string;
  ageBand: AgeBand;
  petName: string;
  petStage: 0 | 1 | 2 | 3;
  xp: number;
  streakDays: number;
  lastPlayDate: string;
  jars: { save: number; spend: number; give: number };
  goal: { name: string; target: number; emoji: string } | null;
  chores: Chore[];
  lessonsCompleted: string[];
  badges: string[];
  createdAt: string;
  // --- Coinland additions ---
  coinland?: CoinlandState;
};
```

---

## 10. Financial Concepts Map

| Concept | Feature | Standard Citation |
|---------|---------|-------------------|
| Money is earned, not given | Chore → coin flow | Jump$tart K–2: "Explain that people work to earn money" |
| Coins have value | Match-the-Coin | CFPB Ages 3–5: coin recognition activity |
| Save / Spend / Give | Jar allocation | CFPB Ages 3–5: piggy bank split metaphor |
| Saving toward a goal | Goal widget | CFPB Ages 6–10: "Pick a savings goal" |
| Giving helps others | Bo's story, Give jar | Jump$tart K–2: charitable giving concept |
| Needs vs. Wants | Sage's story | CFPB Ages 6–10: "Think about needs vs. wants" |

---

## 11. No Dark Patterns Checklist

- ✅ No paid loot boxes or randomized paid rewards
- ✅ No infinite scroll or session extension mechanics
- ✅ No shame mechanics ("wrong answer" → redirect, not penalize)
- ✅ Session nudge at 10 minutes (AAP guidance)
- ✅ Coin Catch payout capped at 10 coins/day
- ✅ No push notifications without parent opt-in (COPPA)
- ✅ No social comparison features in this mode (age-inappropriate)
```

---

## `docs/gameplay/mode-village-8-12.md`

```markdown
# Mode: Coinwood Village — Ages 8–12
> **Win Win Win · Coinwood Story World**
> Version: 1.0 · Author: Gameplay Designer · Status: Ready for engineering

---

## 1. Overview & Design Philosophy

**Coinwood Village** is the 8–12 mode — an Animal Crossing × Stardew Valley-inspired town
simulation and light tycoon game. The kid plays as a Coinwood citizen who earns coins through
chores, runs a lemonade stand, owns shops, completes quests, and builds real financial intuition.

All currency is play-money (Coinwood Coins, symbol 🪙). No real money, no card, no banking.

**Design pillars (per CFPB and Jump$tart grade 3–5 / 6–8 standards):**
- Concrete arithmetic visible at all times (kid can follow the math)
- Achievement + badge systems peak motivationally at this age band
- Autonomy with background parent guardrails
- 3–5 min lesson chunks with immediate application to game state
- Vocabulary introduction: budget, income, profit, interest, passive income, opportunity cost

> **Learning citations:**
> - CFPB Money As You Grow, Ages 6–10: earning, saving goals, spending tradeoffs.
>   https://www.consumerfinance.gov/consumer-tools/money-as-you-grow/ ⚠ verify-live
> - Jump$tart Coalition National Standards, Grade Bands 3–5 and 6–8: earning income, saving,
>   investing basics, charitable giving, spending wisely.
>   https://www.jumpstart.org/national-standards/ ⚠ verify-live
> - Council for Economic Education, Financial Literacy standards grade 4–8:
>   supply/demand, opportunity cost, profit.
>   https://www.councilforeconed.org/ ⚠ verify-live

---

## 2. Core Daily Loop (~15–20 min)

```
OPEN APP
  │
  ▼
Mochi Daily Greeting → weather forecast (affects lemonade demand today!)
  │
  ▼
CHORES (same 3-chore pattern, age-appropriate tasks, parent-approved)
  │  complete → earn coins → choose split or smart-split
  ▼
JAR ALLOCATION (Save 🐷 / Spend 🍭 / Give ❤️ — new: % split helper)
  │
  ▼
LEMONADE STAND (daily mini-game — make pricing decision, serve customers)
  │  day-end profit → auto-routes to Spend jar (can redirect to Save)
  ▼
COINWOOD QUESTS (3 daily quests — Duolingo-pattern — each drops XP chest)
  │
  ▼
LESSON (one lesson card available; 3–5 min; earns badge + XP on completion)
  │
  ▼
SHOP CHECK-IN (passive income generated from owned shops → collect coins)
  │
  ▼
FAMILY LEAGUE check (weekly XP rank within family — visible but low-pressure)
  │
  ▼
DONE → streak updated → pet progression shown
```

---

## 3. Lemonade Stand Mini-Game

### Design Goal
Teach: supply & demand, pricing decisions, profit margin, inventory costs, weather effects.
Aligned to: CEE standard — "Markets and prices" — grade 4–6.

### Daily Setup Phase (before serving)
Kid sees:
1. **Weather card** (drawn from daily seed): ☀️ Sunny / 🌤 Cloudy / 🌧 Rainy / 🥵 Heat Wave / 🌬 Windy
2. **Demand forecast** from Sage (squirrel mentor): "Sunny day — lots of thirsty customers!"
3. **Ingredient costs** (subtracted automatically if kid confirms purchase):
   - Lemons: 🪙5 per batch (makes ~10 cups)
   - Sugar: 🪙3 per batch
   - Cups: 🪙2 per 10 cups
   - Total ingredient cost: 🪙10 per batch of 10 cups
4. Kid chooses **price per cup**: 🪙1 / 🪙2 / 🪙3 / 🪙4 / 🪙5
5. Kid chooses **batches to make**: 1 / 2 / 3 (limited by Spend jar balance)

### Weather × Demand Matrix

| Weather | Customers | Notes shown to kid |
|---------|-----------|-------------------|
| ☀️ Sunny | 8–12 | "Great day! Charge a bit more." |
| 🌤 Cloudy | 5–8 | "Normal day. Medium price." |
| 🌧 Rainy | 1–4 | "Slow day. Lower price to attract customers." |
| 🥵 Heat Wave | 14–18 | "Everyone is thirsty! Stock up!" |
| 🌬 Windy | 3–6 | "Cups keep blowing over. Tough day." |

Demand is also price-elastic: higher price → fewer customers at the same weather level.
Sage shows a simple emoji chart: "Price $2 → 😊😊😊 customers. Price $5 → 😐 customers."

### Serving Phase (mini-game, 30 sec)
- Customers walk by on screen (animated SVG — Coinwood animals)
- Kid taps customer → cup flies to them → 🪙 pops up
- Customers who aren't served in time leave (shrug emoji) — teaches urgency / opportunity cost

### Day-End Profit Calculation (always visible)
```
Revenue  = cups sold × price per cup
Cost     = batches made × 🪙10
Profit   = Revenue − Cost

Example: 2 batches (🪙20 cost), 18 cups sold at 🪙3 = 🪙54 revenue → 🪙34 profit
```
Profit breakdown shown as a bar chart (recharts `<BarChart>`) with Revenue and Cost bars.
Sage explains: "That's your PROFIT! Revenue minus costs. Great job!"

### Expansion Track (unlock over weeks)

| Level | Shop | Unlock Cost | New Item | Profit Potential |
|-------|------|-------------|---------|-----------------|
| 1 | Lemonade Stand | Starting | Lemonade | 🪙5–40/day |
| 2 | Cookie Wagon | 🪙150 | Cookies (+🪙4/unit cost) | 🪙10–60/day |
| 3 | Bunny's Burrow Bakery | 🪙400 | Muffins, Cake | 🪙20–100/day |
| 4 | Corner Store | 🪙1000 | Mixed goods | 🪙30–150/day |

Expansion unlocks new serving animations and new item types. Teaches: business growth,
reinvestment of profits, operating costs scale with business size.

### React Component: `<LemonadeStand />`
```tsx
interface LemonadeStandProps {
  spendBalance: number;
  expansionLevel: 1 | 2 | 3 | 4;
  onDayComplete: (profit: number, lessonUnlocked?: string) => void;
}

// Internal sub-components:
// <WeatherCard weather={weather} demandHint={hint} />
// <IngredientShop onConfirm={handlePurchase} />
// <PricePicker value={price} onChange={setPrice} />
// <CustomerLane customers={customers} onTap={serveCustomer} />
// <ProfitBreakdown revenue={r} cost={c} profit={p} />
```

---

## 4. Shop Ownership — Passive Income Mechanic

### Design Goal
Teach: passive income, investing (capital deployed → returns), opportunity cost of purchase.
Aligned to: Jump$tart Grade 6–8: "Describe sources of income beyond employment."

### How It Works
1. Kid saves up enough coins in Save jar to "buy" a shop slot in Coinwood
2. Shop generates passive income each day kid opens the app (simulates "business runs itself")
3. Income rate = base rate × lesson multiplier × foot-traffic level
4. Foot traffic rises as kid completes lessons in that shop's category

### Available Shops (3 slots, kid can own 1–3)

| Shop | Buy Price | Base Daily Income | Lesson Category | Mascot Owner |
|------|-----------|-------------------|-----------------|-------------|
| Bunny's Burrow Bakery | 🪙250 | 🪙8–15/day | Budgeting | Bo |
| Owl's Bookshop | 🪙200 | 🪙6–12/day | Lessons & learning | Olivia |
| Sam's Repair Garage | 🪙300 | 🪙10–18/day | Earning & income | Sam |

Lesson multiplier: each completed lesson in the shop's category adds +10% to daily income.
Max multiplier: 2.0× (after 10 lessons in category).

### Foot Traffic Events (weekly, random)
- 🎉 "Coinwood Festival" → ×2 income for 2 days
- 🌧 "Rainy week" → ×0.5 income for 1 day
- 📰 "Owl's Bookshop featured in Coinwood Times!" → ×3 income for 1 day
- 🏗 "Road construction" → ×0.7 income for 3 days

These events are displayed as a "Coinwood News" ticker on the home screen.
Teaches: external market factors affect business (intro to macro concepts).

### React Component: `<ShopOwnership />`
```tsx
interface ShopOwnershipProps {
  ownedShops: OwnedShop[];
  availableShops: ShopDefinition[];
  saveBalance: number;
  lessonsCompleted: string[];
  onBuyShop: (shopId: string) => void;
  onCollectIncome: (shopId: string, amount: number) => void;
}

type OwnedShop = {
  shopId: string;
  purchasedAt: string;     // ISO date
  totalEarned: number;
  pendingIncome: number;   // collectible today
  footTrafficEvent?: FootTrafficEvent;
};
```

---

## 5. Compound Interest Visualizer Widget

### Design Goal
Teach: compound interest, time value of money, "pay yourself first."
Aligned to: CFPB Ages 11–13: "Understand how savings can grow with compound interest."

### Widget Layout
Three sliders:
1. **Weekly saving**: 🪙5 → 🪙100 (step 5)
2. **Years**: 1 → 20 (step 1)
3. **Annual interest rate**: 1% → 15% (step 0.5%) — labeled "Coinwood Bank rate"

Output: recharts `<AreaChart>` showing balance growth over time.
Two lines: "With interest 🟢" vs "Without interest (just saving) 🔵"
Highlight: difference between lines at year 10, year 20 (labeled "Extra coins from interest!")

Sage narrates: "If you save 🪙20/week at 5% for 10 years, you'll have 🪙[X]! Without interest,
only 🪙[Y]. That extra 🪙[Z] is FREE — Coinwood Bank paid YOU!"

### Calculation
```ts
function compoundGrowth(weeklyAmount: number, years: number, annualRate: number): number[] {
  const weeklyRate = annualRate / 52 / 100;
  const weeks = years * 52;
  let balance = 0;
  return Array.from({ length: weeks + 1 }, (_, w) => {
    if (w > 0) balance = (balance + weeklyAmount) * (1 + weeklyRate);
    return Math.round(balance);
  }).filter((_, i) => i % 52 === 0); // yearly data points
}
```

### React Component: `<CompoundChart />`
```tsx
interface CompoundChartProps {
  weeklyAmount: number;
  years: number;
  annualRatePct: number;
  mentorComment?: string;
}
// Renders: AreaChart (recharts) + stat callout boxes
// Internally uses SliderInput component
```

---

## 6. Family League Mechanic

### Design Goal
Teach: effort-based competition, intrinsic vs extrinsic motivation.
Ranked by **XP earned** (effort), NOT coins saved (wealth) — avoids reinforcing economic inequality.

### Structure
- Rolling 7-day window XP leaderboard within the family group
- Leagues: 🥉 Bronze (0–499 XP/week) → 🥈 Silver (500–999) → 🥇 Gold (1000–1999) → 💎 Diamond (2000+)
- Each league bracket has a shared visual icon displayed on profile
- Kid's rank shown as a card: "You're #2 in your family this week! 🥈"
- XP sources: chore completion, lesson badge, quest chest, lemonade stand day

### Anti-Dark-Pattern Rules
- No cross-family leaderboards — family-circle only (COPPA / social safety)
- No "your sibling beat you" shame notification — only positive: "You moved up to Silver! 🎉"
- Parent can disable Family League per child in settings
- Leaderboard shows first names only (no photos) — COPPA safe

### Weekly Reset
- Sunday midnight reset
- Kids who were top scorer get a "This Week's MVP" badge in their profile (cosmetic only)
- Weekly email digest to parent (opt-in): "Maya earned 847 XP this week! 🥇 Gold league."

### React Component: `<FamilyLeague />`
```tsx
interface FamilyLeagueMember {
  kidName: string;          // no photo, no last name
  weeklyXp: number;
  league: "bronze" | "silver" | "gold" | "diamond";
  isCurrentUser: boolean;
}

interface FamilyLeagueProps {
  members: FamilyLeagueMember[];
  currentUserXp: number;
  weekEndsAt: string;       // ISO date
}
```

---

## 7. Coinwood Quests — Daily 3-Quest Pattern

### Design Goal
Teach: daily habits, goal-setting, variety of financial actions.
Modeled after Duolingo Daily Quest: 3 quests, each completeable in <5 min, together ~15 min.

### Quest Pool (drawn randomly each day, 3 shown)

| Quest ID | Description | XP Chest |
|----------|-------------|----------|
| Q01 | Complete all 3 chores today | 🪙Gold Chest (50 XP) |
| Q02 | Run the lemonade stand | 🪙Silver Chest (25 XP) |
| Q03 | Complete one lesson | 🪙Gold Chest (50 XP) |
| Q04 | Add coins to your Save jar | 🪙Bronze Chest (10 XP) |
| Q05 | Collect passive income from a shop | 🪙Bronze Chest (10 XP) |
| Q06 | Set or update your savings goal | 🪙Bronze Chest (10 XP) |
| Q07 | Check the Compound Interest widget | 🪙Bronze Chest (10 XP) |
| Q08 | Donate to Give jar (any amount) | 🪙Silver Chest (25 XP) |
| Q09 | Answer a Raccoon Alert correctly | 🪙Silver Chest (25 XP) |
| Q10 | Log in 3 days in a row | 🪙Gold Chest (50 XP) |

### Chest Animation
On quest completion → chest animates opening → XP coins scatter → XP bar fills.
XP is capped by chest tier, not variable (Bronze = always 10, Silver = always 25, Gold = always 50).
**No randomized/variable rewards** — avoids gambling-like variable ratio reinforcement.

### React Component: `<DailyQuest />`
```tsx
interface Quest {
  id: string;
  description: string;
  chestTier: "bronze" | "silver" | "gold";
  xpReward: 10 | 25 | 50;
  completed: boolean;
  completedAt?: string;
}

interface DailyQuestProps {
  quests: Quest[];          // always 3
  onQuestComplete: (questId: string) => void;
}
```

---

## 8. Bank Robber Arc — Scam Awareness (5–8 Episodes)

### Design Goal
Teach: scam awareness, phishing recognition, get-rich-quick skepticism.
Aligned to: CFPB consumer protection resources; not formally in Jump$tart K-8 but critical life skill.

### Villain: Rocky the Raccoon 🦝
Rocky is a mischievous but lovable raccoon who tries to trick Coinwood citizens.
He is not scary — he's bumbling and always caught. Tone: comical, not threatening.
Each episode: Rocky appears with a "deal" → kid identifies the scam → Rocky is foiled →
kid earns "Scam Buster" badge for episode completion.

### Episode Library (8 episodes)

| Ep | Title | Scam Type | Rocky's Pitch | Correct Answer |
|----|-------|-----------|---------------|----------------|
| 1 | The Magic Money Tree | Get-rich-quick | "Send me 🪙10, I'll send back 🪙100 tomorrow!" | "That's impossible — money doesn't multiply like that." |
| 2 | The Fake Prize | Fake lottery | "You won! Just pay 🪙20 to claim your prize." | "Real prizes don't need you to pay first." |
| 3 | The Phishing Email | Phishing | Rocky sends a fake "Coinwood Bank" message asking for password. | "Never share your password." |
| 4 | The Investment Guarantee | Investment fraud | "100% guaranteed returns! Zero risk!" | "No investment has zero risk — that's a lie." |
| 5 | The Stolen Identity | Identity theft | Rocky asks for kid's "birthday and address to send a gift." | "Personal info is private — don't share." |
| 6 | The Urgency Trick | Pressure sales | "This deal expires in 60 SECONDS! Buy now!" | "Real deals don't disappear in 60 seconds." |
| 7 | The Copycat | Brand impersonation | Rocky dresses as Mochi to ask for the password. | "Real friends/apps never ask for your password." |
| 8 | The Pyramid | Pyramid scheme | "Recruit 5 friends, you all get rich!" | "When only recruiters profit, that's a pyramid scheme." |

### Episode Format
1. Rocky appears in a scene (animated SVG panel, comic-style)
2. Rocky delivers his pitch (speech bubble, voice line optional)
3. Kid chooses: "This sounds fishy 🐟" / "This sounds great!" / "I need to ask a grown-up"
4. If correct → Mochi celebrates → Olivia explains why it was a scam (1 sentence)
5. If incorrect → gentle retry with hint — "Hmm, something smells off about that deal..."
6. Episode complete → badge + XP chest

### React Component: `<RaccoonAlert />`
```tsx
interface RaccoonEpisode {
  id: string;
  title: string;
  scamType: string;
  panel: RaccoonPanel[];     // 2–3 comic panels
  choices: string[];         // always 3
  correctChoice: number;
  explanation: string;       // Olivia's explanation
  badge: string;
}

interface RaccoonAlertProps {
  episode: RaccoonEpisode;
  onComplete: (passed: boolean) => void;
}
```

---

## 9. Pet Companion Progression

### Progression Track (XP thresholds, matches existing `petStageFromXp`)

| Stage | XP | Visual | Name |
|-------|----|--------|------|
| 0 | 0–49 | 🥚 Egg | Mystery Egg |
| 1 | 50–199 | 🐣 Baby Bunny | Baby Bo |
| 2 | 200–499 | 🐰 Bunny | Bo |
| 3 | 500–999 | 🐰🎩 Bunny with Hat | Fancy Bo |
| 4 | 1000–1999 | 🐰✨ Bunny in Graduation Cap | Scholar Bo |
| 5 | 2000+ | 🐰👑 Bunny in Crown | Royal Bo |

### Outfit Shop (cosmetics, earned via XP — never purchased)

| Outfit | XP Unlock | Description |
|--------|-----------|-------------|
| 🎩 Top Hat | 300 XP | Classic entrepreneur look |
| 🎓 Graduation Cap | 600 XP | "You're a learner!" |
| 🌸 Flower Crown | 400 XP | Spring Coinwood vibes |
| 🧣 Scarf | 200 XP | Cozy savings mascot |
| 👑 Crown | 1500 XP | Diamond league reward |
| 🦺 Apron | 500 XP | Lemonade Stand entrepreneur |

**No paid cosmetics. All outfits earned via XP milestones.**
Active outfit shown on HUD pet display and in Coinwood Village scene.

### React Component: `<PetOutfitCloset />`
```tsx
interface PetOutfit {
  id: string;
  name: string;
  emoji: string;
  xpRequired: number;
  unlocked: boolean;
}

interface PetOutfitClosetProps {
  currentXp: number;
  outfits: PetOutfit[];
  activeOutfitId: string;
  onEquip: (outfitId: string) => void;
}
```

---

## 10. Concepts Taught — Feature Map

| Financial Concept | Feature | Standard Citation |
|------------------|---------|-------------------|
| Earning income through work | Chore → coin flow | Jump$tart 3–5: "Describe how people earn income" |
| Budgeting (allocating income) | Jar split, smart split | Jump$tart 3–5: "Develop a plan for spending and saving" |
| Saving toward a goal | Save jar + goal widget | CFPB Ages 6–10: "Pick a savings goal" |
| Opportunity cost | Lemonade pricing choice | CEE Grade 4–6: "Every choice has a cost" |
| Supply and demand | Weather × demand matrix | CEE Grade 4–6: "Markets and prices" |
| Profit margin | Lemonade revenue − cost | CEE Grade 5–7: "Revenue, cost, profit" |
| Compound interest | CompoundChart widget | CFPB Ages 11–13: "How savings grow with interest" |
| Passive income / investing | Shop ownership | Jump$tart 6–8: "Sources of income beyond employment" |
| Charitable giving | Give jar, quest | Jump$tart 3–5: "Identify ways to give" |
| Scam awareness | Rocky episodes | CFPB consumer protection resources |
| Reinvestment of profits | Expansion track | CEE: business growth |
| Weekly budgeting | Smart split helper | CFPB: allocate income across needs |

> **Unverified claims (not yet backed by tier-1 source):**
> - Specific XP thresholds for pet stages are game-design decisions, not research-backed
> - Weather demand elasticity values are game-design estimates; real supply/demand teaching
>   should note these are simplified models

---

## 11. Full Component Inventory (Village / 8-12 mode)

| Component | File | Purpose |
|-----------|------|---------|
| `<LemonadeStand />` | `components/village/LemonadeStand.tsx` | Core mini-game |
| `<WeatherCard />` | `components/village/WeatherCard.tsx` | Daily weather + demand hint |
| `<IngredientShop />` | `components/village/IngredientShop.tsx` | Buy batches before serving |
| `<PricePicker />` | `components/village/PricePicker.tsx` | Slider to set cup price |
| `<CustomerLane />` | `components/village/CustomerLane.tsx` | Animated customer tap-to-serve |
| `<ProfitBreakdown />` | `components/village/ProfitBreakdown.tsx` | BarChart revenue/cost/profit |
| `<ShopOwnership />` | `components/village/ShopOwnership.tsx` | Shop grid + buy/collect UI |
| `<ShopCard />` | `components/village/ShopCard.tsx` | Single shop tile |
| `<FootTrafficBadge />` | `components/village/FootTrafficBadge.tsx` | Foot-traffic event badge |
| `<CompoundChart />` | `components/village/CompoundChart.tsx` | Recharts compound interest viz |
| `<FamilyLeague />` | `components/village/FamilyLeague.tsx` | Weekly XP leaderboard |
| `<LeagueRow />` | `components/village/LeagueRow.tsx` | Single member in league |
| `<DailyQuest />` | `components/village/DailyQuest.tsx` | 3-quest Duolingo pattern |
| `<QuestCard />` | `components/village/QuestCard.tsx` | Single quest + chest animation |
| `<ChestOpen />` | `components/village/ChestOpen.tsx` | Chest opening animation |
| `<RaccoonAlert />` | `components/village/RaccoonAlert.tsx` | Rocky scam episode player |
| `<RaccoonPanel />` | `components/village/RaccoonPanel.tsx` | Comic panel within episode |
| `<PetOutfitCloset />` | `components/village/PetOutfitCloset.tsx` | Outfit selection grid |
| `<OutfitCard />` | `components/village/OutfitCard.tsx` | Single outfit + lock/unlock |
| `<CoinwoodNewsTicker />` | `components/village/CoinwoodNewsTicker.tsx` | Scrolling event news |
| `<SmartSplitHelper />` | `components/ui/SmartSplitHelper.tsx` | 50/30/20 split prompt |
| `ChoreButton` | existing | Reused unchanged |
| `JarTile` | existing | Reused unchanged |
| `Mochi` | existing | Enhanced moods |
| `Bunny` | existing | Enhanced moods + outfits |

---

## 12. State Model — Village GameState

```ts
// lib/villageGame.ts (extends base GameState)

export type LemonadeExpansionLevel = 1 | 2 | 3 | 4;

export type LemonadeStandState = {
  expansionLevel: LemonadeExpansionLevel;
  totalProfitEarned: number;
  daysRun: number;
  lastRunDate: string;          // YYYY-MM-DD, 1 run per day
  pendingExpansionUnlock: boolean;
};

export type OwnedShop = {
  shopId: "bakery" | "bookshop" | "garage";
  purchasedAt: string;
  totalEarned: number;
  pendingIncome: number;
  footTrafficEventId?: string;
  footTrafficEndsDate?: string;
};

export type DailyQuestState = {
  date: string;                 // YYYY-MM-DD
  quests: {
    id: string;
    completed: boolean;
    completedAt?: string;
  }[];
};

export type WeeklyLeagueEntry = {
  weekStartDate: string;        // Monday YYYY-MM-DD
  xpEarned: number;
  league: "bronze" | "silver" | "gold" | "diamond";
  rank: number;
};

export type VillageGameState = GameState & {
  // Mode guard
  mode: "village";

  // Lemonade Stand
  lemonadeStand: LemonadeStandState;

  // Shop Ownership
  ownedShops: OwnedShop[];

  // Daily Quests
  dailyQuests: DailyQuestState;

  // Family League
  weeklyLeagueHistory: WeeklyLeagueEntry[];
  currentWeekXp: number;

  // Raccoon Arc
  raccoonEpisodesCompleted: string[];   // episode IDs

  // Pet Outfits
  unlockedOutfits: string[];            // outfit IDs
  activeOutfitId: string;

  // Compound Chart last-used params (persist for returning users)
  compoundChartParams: {
    weeklyAmount: number;
    years: number;
    annualRatePct: number;
  };
};
```

---

## 13. No Dark Patterns Checklist

- ✅ No paid cosmetics — all outfits earned via XP
- ✅ No loot boxes — XP chests have fixed, known rewards (no randomized value)
- ✅ No infinite scroll in any UI
- ✅ No "streak shame" — broken streak shown as "Start a new streak!" not "You failed"
- ✅ No cross-family social comparison — only within family circle
- ✅ Family League ranked by effort (XP) not wealth (coins)
- ✅ Lemonade payout capped by realistic mechanics — no grind exploitation
- ✅ Rocky episodes never use real-stakes fear — tone always comical + educational
- ✅ Shop income requires app engagement, not pay-to-accelerate
- ✅ Parent can disable Family League per child
```

---

## `docs/gameplay/mode-markets-13-18.md`

```markdown
# Mode: Coinwood Markets — Ages 13–18
> **Win Win Win · Coinwood Story World**
> Version: 1.0 · Author: Gameplay Designer · Status: Ready for engineering

---

## ⚠️ CRITICAL NOTICE — PLAY MONEY ONLY

**ALL portfolio activity in Coinwood Markets uses PLAY MONEY (virtual Coinwood Dollars, symbol $CW).**
No real money is invested, transferred, or held at any point. This is a simulation.
Starting balance: $10,000 CW (play money). No real brokerage account. No real securities.
Real stock price data is used for educational realism, but all transactions are simulated.

This must be disclosed:
- On the mode onboarding screen (prominent, above the fold)
- In the app's Terms of Service / COPPA-compliant privacy policy
- In the parent dashboard under "About Coinwood Markets"

---

## 1. Overview & Design Philosophy

**Coinwood Markets** is the 13–18 mode — a serious investing + entrepreneurship simulation.
Tone: "adulting" — treats teens as capable, not talked down to. Mentor character is Owl Olivia,
who gives expert-but-approachable guidance. Visual style: cleaner, more data-dense than Village,
but still Coinwood's warm palette.

**Design pillars (per CFPB, Jump$tart 9–12, and CEE grade 9–12 standards):**
- Real company names + real stock prices → authenticity drives engagement
- Compound interest lab → visceral understanding before first real credit card
- Credit card simulation → before teens turn 18 and get real offers
- Business builder → entrepreneurial thinking
- Behavioral finance → meta-awareness of own biases
- Tax sim → before first part-time job

> **Learning citations:**
> - CFPB Money As You Grow, Ages 14–18: compound interest, borrowing responsibly, budgeting,
>   financial goals after high school.
>   https://www.consumerfinance.gov/consumer-tools/money-as-you-grow/ ⚠ verify-live
> - Jump$tart Coalition Standards, Grade 9–12: analyze costs/benefits of credit products,
>   evaluate strategies for building credit, calculate interest on loans, understand investing.
>   https://www.jumpstart.org/national-standards/ ⚠ verify-live
> - Council for Economic Education, Survey of the States 2022: "Only 23 states require a personal
>   finance course as a graduation requirement" — confirming the curriculum gap.
>   https://www.councilforeconed.org/survey-of-the-states/ ⚠ verify-live

---

## 2. Core Daily Loop (~20–30 min)

```
OPEN APP
  │
  ▼
Olivia's Market Morning Brief (1-sentence summary of simulated market mood)
  │
  ▼
PORTFOLIO CHECK (see current holdings, today's simulated price change, P&L)
  │
  ▼
CREW PICKS FEED (opt-in: see strategy notes from investment crew members)
  │
  ▼
TAKE A LESSON (one module from curriculum; quiz at end; earn XP + badge)
  │
  ▼
ADJUST HOLDINGS (buy/sell fractional shares with $CW play money)
  │
  ▼
QUIZ / CHALLENGE (daily concept question from Olivia — 1 question, 30 sec)
  │
  ▼
EARN XP → check Family League rank → done
```

---

## 3. Portfolio Simulator

### Play-Money Framework
- Starting balance: **$10,000 CW** (Coinwood Dollars — play money)
- No real brokerage. No real trades. No real accounts. No real money.
- Real-time (or delayed) stock prices fetched for educational realism
- Kid can buy/sell fractional shares (e.g., buy 0.1 share of Apple)

### Stock Universe (25–30 companies — kid-relatable brands)

| Ticker | Company | Why it's on the list |
|--------|---------|---------------------|
| AAPL | Apple | Every kid owns an iPhone or wants one |
| MSFT | Microsoft | Xbox, Teams (school), Office |
| DIS | Disney | Movies, theme parks |
| NKE | Nike | Sneakers, Jordan brand |
| MCD | McDonald's | The #1 teen fast food stop |
| RBLX | Roblox | Direct teen/tween gaming platform |
| AMZN | Amazon | Shopping, Prime Video |
| NFLX | Netflix | Streaming |
| SBUX | Starbucks | Teen coffee culture |
| TSLA | Tesla | EV hype; good lesson on volatility |
| GOOG | Alphabet / Google | YouTube, search |
| META | Meta | Instagram, WhatsApp |
| SPOT | Spotify | Music streaming |
| SNAP | Snap | Snapchat |
| V | Visa | Credit/payment networks |
| JPM | JPMorgan Chase | Banking intro |
| WMT | Walmart | Retail comparison vs Amazon |
| TGT | Target | Teen shopping |
| LULU | Lululemon | Athleisure brand |
| F | Ford | Vehicles, EV transition |
| BA | Boeing | Aviation/industry |
| PFE | Pfizer | Pharma — relevant post-COVID |
| KO | Coca-Cola | Classic dividend payer |
| SPY | S&P 500 ETF | Index fund concept |
| QQQ | Nasdaq-100 ETF | Tech index fund |

**SPY and QQQ included specifically to teach index fund diversification vs. stock-picking.**

### Stock Data Source Recommendation

**Recommended: `yahoo-finance2` npm package**

Rationale:
- Free, no API key required, no sign-up — fastest path to MVP, no credentials to manage
- Works server-side in Next.js App Router (Route Handler: `GET /api/stock/[ticker]`)
- Returns real delayed quotes (typically 15–20 min delay, acceptable for educational use)
- Package: `npm install yahoo-finance2` — maintained, TypeScript-typed
- Handles the full universe of 25 tickers needed

```ts
// app/api/stock/[ticker]/route.ts
import yahooFinance from "yahoo-finance2";

export async function GET(req: Request, { params }: { params: { ticker: string } }) {
  try {
    const quote = await yahooFinance.quote(params.ticker);
    return Response.json({
      ticker: quote.symbol,
      price: quote.regularMarketPrice,
      change: quote.regularMarketChange,
      changePct: quote.regularMarketChangePercent,
      name: quote.longName,
      // Do NOT forward raw response — only safe fields
    });
  } catch {
    return Response.json({ error: "quote_unavailable" }, { status: 503 });
  }
}
```

**Fallback: Finnhub free tier** (60 req/min, requires free API key — minimal setup)
URL: https://finnhub.io — free tier covers all 25 tickers with polling interval ≥ 1 req/sec.
Use Finnhub if yahoo-finance2 rate-limits or has availability issues.

**Do NOT use Polygon.io free tier for this** — free tier only provides end-of-day data,
not delayed real-time quotes needed for an engaging educational experience.

**⚠️ Data compliance note:** All fetched prices are for educational display only. The app
never executes real trades. Prices are labeled "EDUCATIONAL DATA — DELAYED" in the UI.

### Portfolio UI
Recharts `<LineChart>` showing portfolio value over the kid's simulated session history.
Each row in holdings list:
```
[Company Logo emoji] AAPL     Apple Inc.
Shares: 0.50    Avg cost: $182.40
Current: $188.00   P&L: +$2.80 (+1.5%) 🟢
```

### React Component: `<PortfolioSimulator />`
```tsx
interface Holding {
  ticker: string;
  companyName: string;
  sharesHeld: number;        // fractional OK
  avgCostBasis: number;      // per share
  currentPrice: number;      // from yahoo-finance2
  changeToday: number;       // price delta
  changePct: number;
}

interface PortfolioSimulatorProps {
  cashBalance: number;       // $CW remaining
  holdings: Holding[];
  portfolioHistory: { date: string; value: number }[];
  onBuy: (ticker: string, dollarAmount: number) => void;
  onSell: (ticker: string, shares: number) => void;
}
```

### Trade Flow
1. Kid taps a stock → `<StockDetailCard />` opens
2. Shows: price chart (7-day or 30-day toggle), company description (2 sentences),
   key stats: Market Cap, P/E ratio (labeled and explained), dividend yield
3. "Buy" → enter dollar amount ($CW) → "Buy $50 CW of AAPL" → confirms → updates holdings
4. "Sell" → enter shares → confirms → cash returned to balance
5. Transaction logged to history

---

## 4. Investment Crew Mechanic

### Design Goal
Teach: peer learning, strategy discussion, portfolio comparison, social investing.
Aligned to: Jump$tart 9–12: "evaluate investment strategies."

### Safety Rules (hard requirements)
- Parent must approve both sides of every crew connection (kid A's parent AND kid B's parent)
- Maximum crew size: 2–8 kids
- No direct messaging — only pre-approved strategy phrases
- No photos, last names, or full school names shown — first name only (COPPA)
- Parent can see all crew strategy notes in parent dashboard
- Parent can remove kid from any crew at any time

### Crew Mechanics
- Each kid has their own private portfolio (separate $CW balance per kid)
- Opt-in portfolio sharing: "Share my holdings with crew" toggle (off by default)
- Strategy notes: kid picks from a **predefined phrase library** (no free text — COPPA safe)

### Strategy Phrase Library (30 starter phrases)

| # | Phrase | Category |
|---|--------|---------|
| 1 | "I like this stock because everyone uses their products." | Consumer insight |
| 2 | "I bought the S&P 500 ETF — spreading the risk." | Diversification |
| 3 | "This stock is down 20% — I think it'll bounce back." | Buy the dip |
| 4 | "I'm holding long-term — not selling even if it drops." | Long-term thinking |
| 5 | "This company has a dividend — they pay shareholders!" | Income investing |
| 6 | "I put everything in one stock — risky, I know!" | Risk acknowledgment |
| 7 | "I'm avoiding this sector right now." | Sector rotation |
| 8 | "I compared the P/E ratios before buying." | Fundamental analysis |
| 9 | "This stock is too expensive — waiting for a pullback." | Patience |
| 10 | "I'm 70% ETFs, 30% individual stocks." | Asset allocation |
| 11 | "I sold at a loss to buy something better — tax loss harvesting concept." | Advanced |
| 12 | "I invested in companies I personally use every day." | Consumer thesis |
| 13 | "The market dropped — I didn't panic and sell." | Discipline |
| 14 | "I think this sector will grow in the next 5 years." | Forward thinking |
| 15 | "I copied a famous investor's strategy." | Learning from others |
| 16 | "I put extra in during the dip — buying more at a lower price." | Dollar-cost averaging |
| 17 | "My portfolio is up 12% this month!" | Performance share |
| 18 | "I'm keeping 20% cash in case something goes on sale." | Cash reserve |
| 19 | "I'm testing whether stock-picking beats the index." | Active vs passive |
| 20 | "I lost money this week — but it's play money, so I'm learning!" | Growth mindset |
| 21 | "I researched this company's earnings before buying." | Due diligence |
| 22 | "I'm holding 5 different sectors to diversify." | Sector diversification |
| 23 | "This company has a strong brand — I think it's a moat." | Economic moat |
| 24 | "I sold everything — going 100% cash until I understand more." | Conservative |
| 25 | "I invested in both US and international stocks." | Geographic diversification |
| 26 | "I added $100 CW every week, no matter what." | Dollar-cost averaging |
| 27 | "This stock is popular but I think it's overvalued." | Valuation skepticism |
| 28 | "I followed FOMO and bought at the top — lesson learned!" | Behavioral finance |
| 29 | "I think bonds are safer for this part of my portfolio." | Risk management |
| 30 | "Olivia taught me to check free cash flow before buying." | Mentor insight |

### Weekly Crew Report
Auto-generated by mentor character Owl Olivia every Sunday:
```
📊 Crew Report — Week of [date]
[Kid1] portfolio: +3.2% | Top holding: AAPL
[Kid2] portfolio: -1.4% | Top holding: TSLA
[Kid3] portfolio: +0.8% | 100% SPY

Olivia's note: "This week's market theme: tech stocks rose.
Did diversification help? [Kid2]'s all-in Tesla bet cost them this week.
Next week's challenge: Can anyone outperform SPY?"
```

### React Component: `<InvestmentCrew />`
```tsx
interface CrewMember {
  kidFirstName: string;     // only first name — COPPA
  portfolioValueCW: number;
  weeklyReturnPct: number;
  topHolding: string;       // ticker
  lastStrategyNote?: string; // phrase from library
  sharingEnabled: boolean;
}

interface InvestmentCrewProps {
  crewMembers: CrewMember[];
  weeklyReport: string;     // Olivia's auto-generated text
  onPostStrategyNote: (phraseId: string) => void;
  currentUserCrewId: string;
}
```

---

## 5. Compound Interest Lab

### Design Goal
Visceral, interactive understanding of time value of money and the cost of waiting.
Aligned to: CFPB: "compound interest before first credit card" guidance.

### Interactive Scenarios

Three sliders:
1. **Monthly contribution**: $0 → $500 (step $25)
2. **Years**: 1 → 50 (step 1)
3. **Average annual return**: 1% → 12% (step 0.5%)

Output: recharts `<AreaChart>` with three lines:
- Line A: **Start saving at 18** (your current plan)
- Line B: **Start at 25** (7-year delay)
- Line C: **Start at 35** (17-year delay)

All three lines converge at year 0 and diverge dramatically over time.
At the right side of the chart: labeled callout boxes showing final values.

Olivia says: "The person who started at 18 has $[X]. The person who started at 35 has $[Y].
Same monthly amount. Same rate. The difference is just TIME."

### Calculation
```ts
function futureValue(
  monthlyContribution: number,
  years: number,
  annualReturnPct: number
): number {
  const r = annualReturnPct / 100 / 12;
  const n = years * 12;
  if (r === 0) return monthlyContribution * n;
  return monthlyContribution * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
}
```

### React Component: `<CompoundInterestLab />`
```tsx
interface CompoundInterestLabProps {
  initialAgeForComparison?: number; // default 18
}
// Renders: three AreaChart lines + slider controls + Olivia commentary
```

---

## 6. Credit Card Simulator

### Design Goal
Teach: APR, minimum payments, debt spiral, interest cost.
Aligned to: Jump$tart 9–12: "analyze the costs and benefits of credit products; calculate cost
of interest on a loan." CFPB: credit literacy for teens before turning 18.

### Setup
- Virtual credit card with $500 CW limit (play money)
- Kid "buys" items from a Coinwood shopping list (preset items: $40 headphones, $80 shoes, etc.)
- Balance accumulates; kid chooses each month: pay minimum / pay full / pay custom amount

### Minimum Payment Spiral
```
Balance: $400
APR: 18%
Monthly rate: 1.5%

Month 1 interest: $6.00
Minimum payment: $15 (or 2% of balance, whichever is greater)
After payment: balance = $400 + $6 - $15 = $391

Time to pay off at minimum payments: ~3 years 2 months
Total interest paid: ~$147

vs.

Pay $50/month: paid off in 9 months, $27 total interest
```

Visualized as a recharts `<LineChart>` comparing:
- "Minimum only" line (balance decreases painfully slowly)
- "Fixed $50/month" line (much faster payoff)
- "Pay in full each month" → no interest line (flat at 0)

Olivia explains: "Credit cards aren't evil — but paying minimum only means you pay for those
headphones TWICE over three years. That's the trap."

### APR Comparison
Toggle between 0% APR (introductory) vs 18% APR (standard) vs 29% APR (penalty rate).
Shows dramatically different payoff timelines on same chart.

### React Component: `<CreditCardSim />`
```tsx
interface CreditCardSimProps {
  creditLimit?: number;    // default 500 CW
  apr?: number;            // default 18
  purchases: { name: string; cost: number; emoji: string }[];
  onComplete: () => void;
}

type CreditSimState = {
  balance: number;
  totalInterestPaid: number;
  monthsElapsed: number;
  paymentHistory: { month: number; payment: number; interest: number; balance: number }[];
};
```

---

## 7. Business Builder

### Design Goal
Teach: business plan basics, revenue/costs/profit, LTV, CAC, burn rate, break-even.
Aligned to: CEE grade 9–12 entrepreneurship standards; Jump$tart 9–12 income sources.

### Format: 12-Month Business Simulation

**Step 1 — Fill the One-Page Plan Template:**
| Field | Kid Input |
|-------|-----------|
| Business name | e.g., "Maya's Dog Walking" |
| What you sell | e.g., "Dog walking service, $20/walk" |
| Monthly customers | e.g., 5 dogs |
| Monthly revenue | Auto-calculated: 5 × $20 × 4 weeks = $400/mo |
| Monthly costs | Supplies ($20), marketing ($10), insurance ($15) → $45/mo |
| Monthly profit | $400 − $45 = $355/mo |

**Step 2 — Simulate 12 months:**
- Month 1–3: ramp-up (50% of target customers)
- Month 4–8: full operations
- Month 9–10: random event (competitor opens, or big client found)
- Month 11–12: expansion decision (raise prices? hire help? → new sim)

**Metrics taught (shown in UI with definitions):**
- **Break-even**: "Month 1 you spend $45 on setup and earn $200. You break even by day 12."
- **CAC (Customer Acquisition Cost)**: "You spent $10 on flyers and got 2 new clients. CAC = $5."
- **LTV (Lifetime Value)**: "Each client stays 6 months × $80/mo = $480 LTV."
- **Burn rate**: "If you had $0 revenue for a month, how long could you survive on savings?"

**Step 3 — Chart the 12 months:**
Recharts `<BarChart>` showing Revenue, Costs, Profit for each of 12 months.
Line overlay showing cumulative profit.

### React Component: `<BusinessBuilder />`
```tsx
interface BusinessPlan {
  name: string;
  productDescription: string;
  pricePerUnit: number;
  unitsPerMonth: number;
  monthlyFixedCosts: number;
  monthlyVariableCostPerUnit: number;
}

interface BusinessBuilderProps {
  onComplete: (plan: BusinessPlan, finalProfit: number) => void;
}
```

---

## 8. Bull/Bear Cycle Simulator

### Design Goal
Teach: market cycles, staying the course, panic-selling consequences.
Aligned to: Jump$tart 9–12: "evaluate how economic conditions and personal factors affect
investment value."

### Historical Scenarios (3 scenarios)

| Scenario | Period | Peak drop | Recovery |
|----------|--------|-----------|---------|
| 🐻 2008 Global Financial Crisis | 2007–2009 | −57% | Recovered by 2013 |
| 🦠 2020 COVID Crash | Feb–Mar 2020 | −34% | Recovered in 5 months |
| 💻 Dot-Com Bubble | 2000–2002 | −49% (Nasdaq −78%) | S&P recovered by 2007 |

### Mechanics
1. Kid sees their current portfolio value (from Portfolio Simulator)
2. "What if this happened?" — kid chooses a scenario
3. Time-warp: chart fast-forwards showing portfolio value as if invested during that period
4. Decision point: "It's month 3, you're down 40%. Do you: (A) Sell everything, (B) Hold, (C) Buy more?"
5. Simulation continues to show outcome of choice A vs B vs C
6. Result screen: "Holders who stayed in recovered their losses. Sellers locked in the loss."

### Olivia's Teaching Moment (per scenario)
"In March 2020, the market dropped 34% in 5 weeks. Investors who sold lost money.
Investors who held recovered everything by August 2020. Panic-selling is the most expensive
decision in investing."

### React Component: `<BullBearSimulator />`
```tsx
type HistoricalScenario = "2008_gfc" | "2020_covid" | "2000_dotcom";

interface BullBearSimulatorProps {
  portfolioValueCW: number;
  onComplete: (scenarioId: HistoricalScenario, choice: "sell" | "hold" | "buy") => void;
}
```

---

## 9. Tax 101 Simulator

### Design Goal
Teach: gross vs. net pay, W-2 withholding, FICA, state tax, capital gains.
Aligned to: Jump$tart 9–12: "Explain the purpose and process of tax filing."
CFPB: teens starting first jobs at 14–16.

### W-2 Paycheck Calculator

Inputs:
- Hourly wage: $10 → $25/hr (step $0.50)
- Hours per week: 5 → 40
- State dropdown: 5 representative states (no state tax: TX, FL; high: CA, NY; mid: OH)
- Filing status: Single (always, for simplicity in v1)

Auto-calculated outputs (displayed as a pay stub):
```
GROSS PAY:           $400.00/week
Federal withholding: −$36.00   (single, standard deduction, bracket)
FICA Social Security:−$24.80   (6.2%)
FICA Medicare:       −$5.80    (1.45%)
State (CA):          −$14.00   (approx 3.5% effective for this income)
─────────────────────────────
NET TAKE-HOME:       $319.40
```

Olivia says: "You earn $400 but take home $319. That $80 goes to roads, schools, and
Social Security. Now you know why your first paycheck is a surprise!"

### Capital Gains Explainer
Simple toggle: "You bought AAPL at $150. You sell at $200. Profit = $50."
- Held < 1 year → short-term capital gain (taxed as income)
- Held ≥ 1 year → long-term capital gain (0%, 15%, or 20% — shown for teens in 0% bracket)

Visual: two columns showing tax bill for each holding period.

### React Component: `<TaxSim />`
```tsx
interface TaxSimProps {
  mode: "paycheck" | "capital_gains";
  onComplete: () => void;
}
```

---

## 10. Behavioral Finance Lessons (5 modules)

All delivered in the existing `LessonModal` format but with richer interactive examples.

| # | Lesson | Bias Taught | Interactive Element |
|---|--------|-------------|---------------------|
| BF1 | The FOMO Trade | FOMO (fear of missing out) | Kid watches RBLX go up 30% → feels urge → quiz |
| BF2 | The Loss That Hurts More | Loss aversion | Gain $100 vs lose $100 — brain reaction comparison |
| BF3 | The Anchor Effect | Anchoring | Shoe was $200, now $120 — is it a good deal? |
| BF4 | Following the Herd | Herd behavior | Meme stock simulation — everyone's buying, should you? |
| BF5 | The Hot Hand Fallacy | Recency bias | Stock up 5 days in a row — does that predict day 6? |

Each lesson: 3-min reading → 2 question quiz → "What you can do about it" advice card.
Olivia narrates throughout.

---

## 11. Scam Detection Trainer

### Design Goal
Teach: phishing recognition, investment fraud, pump-and-dump, identity theft.
Extension of Rocky's arc from Village mode, but at teen sophistication level.

### Format: Rapid-Fire "Scam or Legit?" Game
- 10 rounds per session
- Each round shows a fake screenshot: email, text message, social post, or website
- Kid taps "🚩 Scam" or "✅ Legit" within 10 seconds
- Correct → +5 XP, explanation shown
- Wrong → explanation shown, retry

### Scenario Types (10 total per session, drawn from pool of 30+)

| Type | Example |
|------|---------|
| Phishing email | "Your bank account is compromised — click here to verify" (fake bank logo) |
| Crypto "guaranteed" returns | "Invest $100 in CoinBro, guaranteed 500% returns in 24 hrs!" |
| Pump-and-dump text | "🚀 RKKT stock about to explode! My guy is connected. Buy NOW!" |
| Fake prize | "You won an iPhone! Submit credit card for $1 shipping." |
| Identity theft DM | "Hey, I'm from the government. Need your SSN to send your stimulus check." |
| Romance investment scam | "My uncle is a crypto trader. I can get you in on the next big thing 😊" |
| Urgency pressure | "LAST CHANCE — this offer expires in 47 seconds!" |
| Pyramid pitch | "For $200 you get a kit, then recruit 5 friends and you're RICH!" |
| Fake NFT | "Buy this exclusive NFT — guaranteed to 100× in value!" |
| Too-good job offer | "Earn $5,000/week from home — just pay a $50 training fee!" |

### React Component: `<ScamDetectionTrainer />`
```tsx
interface ScamScenario {
  id: string;
  type: string;
  screenshotDescription: string;  // rendered as styled mock screenshot
  isScam: boolean;
  explanation: string;
  redFlags: string[];             // bullet list of warning signs
}

interface ScamDetectionTrainerProps {
  scenarios: ScamScenario[];
  onComplete: (score: number) => void;
}
```

---

## 12. Concepts Taught — Feature Map

| Financial Concept | Feature | Standard Citation |
|------------------|---------|-----------------|
| Stocks, ETFs, market cap | Portfolio Simulator | Jump$tart 9–12: investing basics |
| Diversification | SPY/QQQ in stock list + Crew notes | Jump$tart 9–12: risk/return tradeoff |
| P/E ratio, dividends | Stock Detail Card | ⚠ UNVERIFIED — game design choice (intro to fundamentals) |
| Compound interest, time value | Compound Interest Lab | CFPB Ages 14–18: compound interest |
| Credit, APR, minimum payments | Credit Card Sim | Jump$tart 9–12: cost of credit |
| Business basics (CAC/LTV/burn) | Business Builder | CEE grade 9–12: entrepreneurship |
| Market cycles, panic-selling | Bull/Bear Sim | Jump$tart 9–12: economic conditions + investments |
| Taxes (withholding, FICA) | Tax Sim | Jump$tart 9–12: tax filing purpose |
| Capital gains | Tax Sim (capital gains tab) | Jump$tart 9–12: investment taxation |
| Behavioral biases | 5 Behavioral Finance Lessons | ⚠ UNVERIFIED (behavioral finance not in current Jump$tart standards; included for practical value) |
| Fraud detection | Scam Detection Trainer | CFPB consumer protection resources |
| Peer investing discussion | Investment Crew | ⚠ UNVERIFIED — design innovation, no direct standard equivalent |

> **Unverified claims:**
> - Specific P/E ratio teaching at age 13–14 is a game design choice; not formally in Jump$tart K-12 standards
> - Behavioral finance lesson topics are drawn from academic literature (Kahneman & Tversky) but not in K-12 curriculum standards — included based on practical financial literacy value
> - Investment Crew mechanic has no direct parallel in standards — designed to address peer learning gap found in competitive research

---

## 13. Full Component Inventory (Markets / 13-18 mode)

| Component | File | Purpose |
|-----------|------|---------|
| `<PortfolioSimulator />` | `components/markets/PortfolioSimulator.tsx` | Main portfolio view |
| `<PortfolioChart />` | `components/markets/PortfolioChart.tsx` | LineChart of portfolio value |
| `<HoldingsTable />` | `components/markets/HoldingsTable.tsx` | Holdings list with P&L |
| `<StockDetailCard />` | `components/markets/StockDetailCard.tsx` | Company info + buy/sell |
| `<StockPriceChart />` | `components/markets/StockPriceChart.tsx` | 7/30-day price line chart |
| `<TradeConfirmModal />` | `components/markets/TradeConfirmModal.tsx` | Buy/sell confirmation |
| `<PlayMoneyBadge />` | `components/markets/PlayMoneyBadge.tsx` | Persistent "PLAY MONEY" disclosure |
| `<InvestmentCrew />` | `components/markets/InvestmentCrew.tsx` | Crew feed + strategy notes |
| `<CrewMemberCard />` | `components/markets/CrewMemberCard.tsx` | Single crew member |
| `<StrategyNotePicke />` | `components/markets/StrategyNotePicker.tsx` | Phrase library selector |
| `<WeeklyCrewReport />` | `components/markets/WeeklyCrewReport.tsx` | Olivia's auto report |
| `<CompoundInterestLab />` | `components/markets/CompoundInterestLab.tsx` | Start at 18/25/35 comparison |
| `<CreditCardSim />` | `components/markets/CreditCardSim.tsx` | APR + minimum payment spiral |
| `<DebtPayoffChart />` | `components/markets/DebtPayoffChart.tsx` | LineChart payoff comparison |
| `<BusinessBuilder />` | `components/markets/BusinessBuilder.tsx` | 12-month business sim |
| `<BusinessPlanForm />` | `components/markets/BusinessPlanForm.tsx` | One-page plan inputs |
| `<BusinessRevenueChart />` | `components/markets/BusinessRevenueChart.tsx` | Monthly revenue/cost bars |
| `<BullBearSimulator />` | `components/markets/BullBearSimulator.tsx` | Historical crash sim |
| `<ScenarioCrashChart />` | `components/markets/ScenarioCrashChart.tsx` | Crash + recovery LineChart |
| `<TaxSim />` | `components/markets/TaxSim.tsx` | Paycheck + cap gains sim |
| `<PayStubDisplay />` | `components/markets/PayStubDisplay.tsx` | Styled pay stub |
| `<BehavioralLesson />` | `components/markets/BehavioralLesson.tsx` | BF lesson player |
| `<ScamDetectionTrainer />` | `components/markets/ScamDetectionTrainer.tsx` | Rapid-fire scam quiz |
| `<ScamScenarioCard />` | `components/markets/ScamScenarioCard.tsx` | Mock screenshot + flags |
| `<MarketMorningBrief />` | `components/markets/MarketMorningBrief.tsx` | Olivia daily summary |
| `<DailyQuizCard />` | `components/markets/DailyQuizCard.tsx` | Olivia's 1-question daily |
| `<OliviaCommentary />` | `components/markets/OliviaCommentary.tsx` | Mentor callout box |
| `<FamilyLeague />` | shared | Reused from Village mode |

---

## 14. State Model — Markets GameState

```ts
// lib/marketsGame.ts

export type PortfolioHolding = {
  ticker: string;
  sharesHeld: number;         // fractional
  totalCostBasis: number;     // $CW spent
  purchaseHistory: { date: string; shares: number; priceAtPurchase: number }[];
};

export type CrewMembership = {
  crewId: string;
  members: {
    kidFirstName: string;
    weeklyReturnPct: number;
    sharingEnabled: boolean;
    lastStrategyPhraseId?: string;
  }[];
  weeklyReports: string[];    // Olivia-generated text, 1 per week
};

export type CreditSimState = {
  currentBalance: number;     // $CW
  totalInterestPaid: number;
  monthsSimulated: number;
  paymentStrategy: "minimum" | "fixed50" | "full" | null;
  purchaseLog: { name: string; amount: number; date: string }[];
};

export type BusinessPlanState = {
  planName: string;
  monthlyRevenue: number;
  monthlyCosts: number;
  monthlyProfit: number;
  simulatedMonths: number;    // 0–12
  totalProfit: number;
  eventLog: string[];         // random events encountered
};

export type MarketsGameState = GameState & {
  mode: "markets";

  // Portfolio
  cashBalanceCW: number;           // play money, starts at 10000
  holdings: PortfolioHolding[];
  portfolioHistory: { date: string; valueCW: number }[];
  tradeCount: number;

  // Crew
  crew: CrewMembership | null;

  // Compound Interest Lab (persist last params)
  compoundLabParams: {
    monthlyContribution: number;
    years: number;
    annualReturnPct: number;
  };

  // Credit Card Sim
  creditSim: CreditSimState | null;

  // Business Builder
  businessPlan: BusinessPlanState | null;

  // Bull/Bear Sim
  bullBearScenariosCompleted: ("2008_gfc" | "2020_covid" | "2000_dotcom")[];

  // Tax Sim
  taxSimLastRun: {
    hourlyWage: number;
    hoursPerWeek: number;
    stateCode: string;
    netPay: number;
  } | null;

  // Behavioral Finance
  behavioralLessonsCompleted: string[];  // BF1–BF5

  // Scam Trainer
  scamTrainerHighScore: number;
  scamTrainerLastSession: { date: string; score: number } | null;

  // Daily Quiz
  dailyQuizHistory: { date: string; correct: boolean }[];
};
```

---

## 15. No Dark Patterns + Safety Checklist

- ✅ All transactions are PLAY MONEY — disclosed prominently on every screen with $CW symbol
- ✅ Real stock data labeled "EDUCATIONAL DATA — DELAYED" in UI
- ✅ Investment Crew: parent approval both sides, predefined phrases only, first names only
- ✅ No paid cosmetics, no paid portfolio boosts
- ✅ No real brokerage account creation, no KYC, no SSN collection
- ✅ Scam trainer uses fictional scenarios — no real phishing links
- ✅ No push notifications without parent opt-in
- ✅ Business Builder uses fictional scenarios — no real business registration
- ✅ Credit Card Sim: clear "SIMULATION — NOT REAL DEBT" label throughout
- ✅ No cross-family leaderboards (family-circle only, parent-controlled)
- ✅ COPPA: no last names, no photos, no real addresses collected from under-13s
  (note: this mode targets 13+; mixed-age families still need COPPA caution for siblings)
```

---

## `docs/gameplay/cross-mode-progression.md`

```markdown
# Cross-Mode Progression — Win Win Win
> **Coinwood Story World · All Ages**
> Version: 1.0 · Author: Gameplay Designer · Status: Ready for engineering

---

## 1. Unified XP & Level System

All three modes feed into a single XP total on the child's profile.
XP is the universal currency of progress across Coinland, Village, and Markets.

### XP Formula

```ts
// lib/game.ts (existing, extended)
export function levelFromXp(xp: number): number {
  return Math.min(99, Math.floor(xp / 50) + 1);
}
```

### XP Sources by Mode

| Source | Coinland (4-7) | Village (8-12) | Markets (13-18) |
|--------|---------------|----------------|-----------------|
| Chore completion | +5–15 XP | +5–20 XP | +5–25 XP |
| Lesson completion | +30 XP | +30 XP | +40 XP |
| Daily quest (bronze) | — | +10 XP | +10 XP |
| Daily quest (silver) | — | +25 XP | +25 XP |
| Daily quest (gold) | — | +50 XP | +50 XP |
| Mini-game completion | +5 XP (Coin Catch) | +15 XP (Lemonade Stand) | +20 XP (Scam Trainer) |
| Streak (3-day) | +10 XP | +10 XP | +10 XP |
| Streak (7-day) | +25 XP | +25 XP | +25 XP |
| Lesson perfect score | +10 XP bonus | +10 XP bonus | +15 XP bonus |
| Family League MVP | — | +50 XP | +50 XP |

### Level Tier Names (cosmetic title shown on profile)

| Level | Title | Mode context |
|-------|-------|-------------|
| 1–5 | 🌱 Coinwood Seedling | All modes |
| 6–10 | 🪙 Coin Collector | All modes |
| 11–20 | 💰 Saver | All modes |
| 21–30 | 📊 Budget Builder | Village + |
| 31–40 | 🏪 Shop Owner | Village + |
| 41–55 | 📈 Investor | Markets + |
| 56–70 | 🏦 Market Maker | Markets + |
| 71–85 | 🦉 Olivia's Apprentice | Markets + |
| 86–99 | 👑 Coinwood Champion | Any mode |

---

## 2. Badge System — Unified Across Modes

Badges earned in any mode appear on the child's unified profile badge wall.
Three badge tiers:

| Tier | Visual | Awarded for |
|------|--------|-------------|
| 🥉 Bronze | Bronze circle | First completion of any feature type |
| 🥈 Silver | Silver circle | Consistent use (7 days streak, 5 lessons) |
| 🥇 Gold | Gold star | Mastery (all lessons in category, perfect quiz streak) |

### Cross-Mode Badge Examples

| Badge | Mode | Trigger |
|-------|------|---------|
| 🏅 First Coin | Coinland | Complete first chore |
| 🏅 Three Jars | Coinland | Deposit to all 3 jars |
| 🏅 Lemonade Legend | Village | Run lemonade stand 10 days |
| 🏅 Shop Owner | Village | Buy first shop in Coinwood |
| 🏅 Compound Fan | Village | Use Compound Chart 5 times |
| 🏅 Scam Buster | Village + Markets | Complete all Rocky episodes / Scam Trainer |
| 🏅 First Investor | Markets | Buy first stock |
| 🏅 Diversifier | Markets | Hold 5+ different assets |
| 🏅 Debt Destroyer | Markets | Pay off Credit Card Sim in full |
| 🏅 Tax Smart | Markets | Complete Tax Sim |
| 🏅 Crew Captain | Markets | Join and contribute to a Crew |
| 🏅 Streak 30 | Any | 30-day login streak |

**Badges are cosmetic + motivational only. They unlock no paid content.**

---

## 3. Mode Graduation — Growing Up in Coinwood

### Automatic Unlock (age-triggered)
When a child's parent updates their age on the parent dashboard to cross a mode boundary,
a graduation flow is triggered:

**From Coinland (4-7) → Village (8-12):**
1. Olivia appears (first introduction of this character): "Wow, you've grown! Ready for
   Coinwood Village? Your coins and badges come with you."
2. Confetti + special "Graduated to Village!" badge
3. XP and badges fully preserved — no reset
4. Jars carry over (save/spend/give balances preserved)
5. New features unlock: Lemonade Stand, Shop Ownership, Compound Chart, Family League

**From Village (8-12) → Markets (13-18):**
1. Owl Olivia: "You're ready for Coinwood Markets. Your Coinwood wisdom unlocks your
   starting portfolio. Time to invest!"
2. Starting $CW portfolio balance gets a one-time "Coinwood Scholarship" bonus:
   - XP 0–999 → $10,000 CW starting balance
   - XP 1000–2999 → $12,000 CW starting balance (Village progression rewarded)
   - XP 3000+ → $15,000 CW starting balance (Village master)
3. All badges and XP carry over
4. Rocky episodes from Village already count in Markets scam awareness history
5. New features unlock: Portfolio Simulator, Crew, Business Builder, Tax Sim

### Manual Unlock (parent override)
Parent can unlock a higher mode ahead of age (e.g., advanced 11-year-old wanting Markets features).
Parent dashboard: "Unlock early access to [mode] for [child's name]? They'll keep all existing
progress. This is irreversible." — requires explicit parent confirmation.

### Mode Downgrades: Not supported
A child cannot be moved down to an earlier mode. All content persists.

---

## 4. Parent Dashboard — All Three Modes, One View

### Dashboard Structure (one parent account, multiple children)

```
FAMILY OVERVIEW
┌─────────────────────────────────────────────────────────┐
│  👧 Maya (age 10) — Village Mode — Lvl 22 🥈 Silver     │
│  Streak: 7 days 🔥 | This week: 380 XP                 │
│  Lemonade Stand: ran 3× this week | Shop: Owl's Books  │
│  [View Details] [Assign Lesson] [Adjust Settings]       │
├─────────────────────────────────────────────────────────│
│  👦 Liam (age 7) — Coinland Mode — Lvl 6 🌱             │
│  Streak: 3 days 🔥 | This week: 95 XP                  │
│  Stories watched: 2 | Chores done: 8/9 this week        │
│  [View Details] [Adjust Settings]                       │
├─────────────────────────────────────────────────────────│
│  👧 Zoe (age 15) — Markets Mode — Lvl 41 📈             │
│  Portfolio: $11,240 CW (+12.4%) | Crew: 3 members       │
│  Lessons this week: Tax 101, FOMO lesson                │
│  [View Details] [Crew Settings] [Approve Crew Invites] │
└─────────────────────────────────────────────────────────┘
```

### Per-Child Detail Panel
- **Mode-appropriate summary**: chores (all modes), jars (all modes), mode-specific metrics
- **Lesson progress**: which lessons completed, which pending, badge wall
- **Weekly XP chart** (recharts `<BarChart>` — 8 weeks of bars)
- **Family League rank** (if enabled)
- **Parent controls**: disable specific features per child (e.g., turn off Crew for Zoe)
- **Lesson assignment**: parent can "assign" a specific lesson that appears as a highlighted
  quest for the child ("Mom assigned: Tax 101 — complete it today!")
- **Mode graduation**: "Maya turned 13 this week — unlock Markets mode?" prompt

### Parent Dashboard React Components

| Component | Purpose |
|-----------|---------|
| `<FamilyOverview />` | All children card grid |
| `<ChildSummaryCard />` | Per-child overview tile |
| `<ChildDetailPanel />` | Full per-child drill-down |
| `<WeeklyXpChart />` | 8-week XP history bars |
| `<LessonProgressGrid />` | Badge wall + % complete per topic |
| `<ModeGraduationPrompt />` | Age-up unlock modal |
| `<CrewApprovalPanel />` | Approve/reject crew connections |
| `<FeatureTogglePanel />` | Per-child feature on/off |
| `<LessonAssignmentPicker />` | Assign lesson to child |
| `<FamilyLeagueParentView />` | Full league table for parent |

---

## 5. Family League — Cross-Mode

Family League works across all modes simultaneously. A 7-year-old in Coinland and a 15-year-old
in Markets are in the same family league.

**Fairness design:** XP is normalized for age band:
- Coinland (4-7): XP × 1.5 multiplier (simpler tasks, less XP available per action)
- Village (8-12): XP × 1.0 (base multiplier)
- Markets (13-18): XP × 0.9 (more XP available per action, slight reduction for fairness)

This means younger kids with the same effort level as older kids can compete meaningfully.

**League display:**
```
🏆 Family League — Week of July 14
1. 🥇 Maya (Village) — 420 XP (Gold)
2. 🥈 Zoe (Markets) — 380 XP (Silver)
3. 🥉 Liam (Coinland) — 190 XP (Bronze)
```
All kids see their name + mode emoji. Tone is celebratory not competitive.
Parent can disable the comparison entirely per child if desired.

---

## 6. Cosmetics — Shared Across Modes

The pet companion system and outfit closet are shared regardless of mode.
A kid who earns the 🎓 Graduation Cap at 600 XP in Village keeps it when they graduate to Markets.

**Cosmetic inventory lives on the base `GameState`** (not per-mode state).
All cosmetics are XP-earned. None are purchasable. None are mode-locked.

### Shared Cosmetics Types

| Type | Examples | How Earned |
|------|---------|------------|
| Pet outfits | Top Hat, Crown, Apron, Scarf | XP milestones (see Village doc) |
| Profile border | Gold border, Diamond sparkle | League rank achievements |
| Home screen theme | Coinland Meadow, Village Market, Market Skyline | Mode graduation |
| Badge frame | Bronze/Silver/Gold frame around badge wall | Total badges earned |

**No cross-child cosmetic sharing** — each child has their own wardrobe.

---

## 7. Data Architecture Note for Engineer

The existing `GameState` in `lib/game.ts` is the base type.
Each mode extends it with a discriminated union:

```ts
export type AppGameState =
  | (GameState & { mode: "coinland"; coinland: CoinlandState })
  | (GameState & { mode: "village"; village: VillageGameState })
  | (GameState & { mode: "markets"; markets: MarketsGameState });
```

Storage key per child profile: `winwinwin.v2.[childId]`
(bump storage key from v1 to v2 when multi-child support is added — migrate v1 on load)

Parent account stored separately: `winwinwin.parent.[parentId]`
Contains: child profile list, family league XP rolls, crew approvals, feature toggle overrides.

---

## 8. Age Transitions — Notification Patterns

| Event | Who sees it | Message |
|-------|------------|---------|
| Streak milestone (7/30/100 days) | Child | "🔥 [N]-day streak! You're on fire!" |
| Level up | Child | "⭐ Level [N]! [new title]!" |
| League rank up | Child | "You hit [League]! Keep going!" |
| Child turns 8 | Parent | "Maya turned 8! Ready to unlock Coinwood Village?" |
| Child turns 13 | Parent | "Zoe is 13! Unlock Coinwood Markets for teen investing?" |
| All lessons complete (a mode) | Child + Parent | "🎓 Maya completed all Village lessons!" |
| 30-day streak | Child | "🔥 30 days! You're a Coinwood Champion!" |

All notifications: opt-in, parent-controlled, no dark-pattern urgency language.
```

---

## Summary

**Files designed (with approximate line counts):**

| File | Lines | Status |
|------|-------|--------|
| `docs/gameplay/mode-coinland-4-7.md` | ~200 | ✅ Complete |
| `docs/gameplay/mode-village-8-12.md` | ~410 | ✅ Complete |
| `docs/gameplay/mode-markets-13-18.md` | ~450 | ✅ Complete |
| `docs/gameplay/cross-mode-progression.md` | ~200 | ✅ Complete |

**5-bullet design summary:**

1. **Three fully distinct modes, one unified world.** Coinland (4-7) is tap-and-celebrate with Coin Catch, Match-the-Coin, and voiced story shorts. Village (8-12) is an Animal Crossing-style tycoon loop: chores → lemonade stand → shop ownership → compound interest chart → scam-awareness raccoon arc. Markets (13-18) is a serious simulator with real stock prices (yahoo-finance2, play money $CW, clearly disclosed), a credit card APR spiral, business plan builder, and Bull/Bear historical crash scenarios — every concept mapped to CFPB/Jump$tart/CEE tier-1 standards.

2. **XP is the universal spine.** A single XP total flows across all three modes and feeds into level titles, pet outfit unlocks, and the Family League leaderboard. The league ranks by effort (XP earned) not wealth (coins saved), with cross-mode fairness normalization so a 7-year-old in Coinland can meaningfully compete with a 14-year-old in Markets. All cosmetics are XP-gated — zero paid content.

3. **No dark patterns, full stop.** No randomized loot boxes (XP chests have fixed, disclosed rewards), no shame mechanics (wrong answer → encourage + retry), no infinite scroll, no streak shame, no paid cosmetics, no real-money transactions anywhere, no cross-family social features — only family-circle parent-approved connections (COPPA-safe, first names only, predefined phrase library for crew notes).

4. **Every financial concept is traced to a tier-1 source.** CFPB Money As You Grow, Jump$tart Coalition National Standards, and CEE are cited for each learning claim. Unverified claims (behavioral finance lesson topics, P/E ratio intro at age 13, Rocky XP thresholds) are explicitly flagged in each document rather than presented as established standards.

5. **Engineer-ready component inventory + TypeScript state models.** Every document includes a full React component list (PascalCase, file paths, typed props interfaces), TypeScript state types extending the existing `GameState` from `lib/game.ts`, and data source code snippets — including the yahoo-finance2 Next.js Route Handler pattern and compound interest / future value calculation functions.

<output>
```json
{
  "request_id": "gameplay-design-winwinwin-001",
  "agent_id": "gameplay-designer",
  "status": "ok",
  "summary": "Designed all four gameplay documents for Win Win Win covering Coinland (4-7), Coinwood Village (8-12), Coinwood Markets (13-18), and cross-mode progression. Each document is engineer-ready with component inventories, TypeScript state models, and tier-1 learning citations.",
  "artifacts": [
    {
      "type": "design-document",
      "ref": "docs/gameplay/mode-coinland-4-7.md"
    },
    {
      "type": "design-document",
      "ref": "docs/gameplay/mode-village-8-12.md"
    },
    {
      "type": "design-document",
      "ref": "docs/gameplay/mode-markets-13-18.md"
    },
    {
      "type": "design-document",
      "ref": "docs/gameplay/cross-mode-progression.md"
    }
  ],
  "confidence": {
    "score": 0.91,
    "tier": "high",
    "rationale": "All learning claims traced to CFPB/Jump$tart/CEE tier-1 sources. Unverified claims explicitly flagged. Component names follow existing codebase conventions. State models extend existing GameState type in lib/game.ts exactly. Stock data recommendation (yahoo-finance2) based on confirmed package characteristics. Play-money disclosure embedded in document per hard rules.",
    "evidence": [
      "https://www.consumerfinance.gov/consumer-tools/money-as-you-grow/ (CFPB, T1)",
      "https://www.jumpstart.org/national-standards/ (Jump$tart, T1)",
      "https://www.councilforeconed.org/survey-of-the-states/ (CEE, T1)",
      "Existing lib/game.ts GameState type read and extended precisely",
      "Existing components (ChoreButton, JarTile, Mochi, Bunny, CoinwoodScene) incorporated"
    ]
  },
  "next_actions": [
    "Engineer creates docs/gameplay/ directory and saves the four documents from this response",
    "Engineer implements CoinCatch and MatchTheCoin mini-games (Coinland additions, lowest complexity)",
    "Engineer implements yahoo-finance2 Route Handler at app/api/stock/[ticker]/route.ts",
    "Engineer scaffolds VillageGameState and MarketsGameState types extending existing GameState",
    "Parent dashboard wireframes needed before FamilyLeague and CrewApprovalPanel implementation",
    "Legal review: COPPA disclosure copy for Markets mode play-money disclosure and privacy policy update"
  ],
  "unverified_claims": [
    "P/E ratio teaching at age 13-14 is a game design choice — not formally in Jump$tart K-12 standards",
    "Behavioral finance lesson topics (FOMO, loss aversion, anchoring, herd behavior, recency bias) drawn from academic literature (Kahneman & Tversky) but not in K-12 curriculum standards — included for practical financial literacy value",
    "Investment Crew mechanic has no direct parallel in standards — designed to address peer learning gap in competitive research",
    "Weather demand elasticity values in Lemonade Stand are game-design estimates, simplified models",
    "Specific XP thresholds for pet outfit unlocks are game-design decisions, not research-backed",
    "Cross-mode XP normalization multipliers (Coinland ×1.5, Village ×1.0, Markets ×0.9) are design estimates, not derived from research"
  ],
  "blockers": []
}
```
</output>
