export type AgeBand = "4-7" | "8-12" | "13-18";

export type Chore = {
  id: string;
  emoji: string;
  title: string;
  coins: number;
  ageBand: AgeBand;
  done?: boolean;
};

export type Lesson = {
  id: string;
  emoji: string;
  title: string;
  ageBand: AgeBand;
  mentor: string;
  blurb: string;
  quiz: { q: string; options: string[]; correct: number; why: string }[];
  badge: string;
};

export type GameState = {
  kidName: string;
  ageBand: AgeBand;
  petName: string;
  petStage: 0 | 1 | 2 | 3; // egg, baby, kid, adult
  xp: number;
  streakDays: number;
  lastPlayDate: string; // YYYY-MM-DD
  jars: { save: number; spend: number; give: number };
  goal: { name: string; target: number; emoji: string } | null;
  chores: Chore[];
  lessonsCompleted: string[];
  badges: string[];
  createdAt: string;
};

export const STORAGE_KEY = "winwinwin.v1";

export const STAGES = ["🥚 Egg", "🐣 Baby", "🐰 Kid", "🐰✨ Adult"] as const;
export const STAGE_EMOJI = ["🥚", "🐣", "🐰", "🐰"] as const;

export function levelFromXp(xp: number): number {
  // 50 XP per level, hard cap 99
  return Math.min(99, Math.floor(xp / 50) + 1);
}

export function xpToNextLevel(xp: number): { current: number; needed: number; pct: number } {
  const inLevel = xp % 50;
  return { current: inLevel, needed: 50, pct: (inLevel / 50) * 100 };
}

export function petStageFromXp(xp: number): 0 | 1 | 2 | 3 {
  if (xp < 50) return 0;
  if (xp < 200) return 1;
  if (xp < 500) return 2;
  return 3;
}

export function totalCoins(s: GameState): number {
  return s.jars.save + s.jars.spend + s.jars.give;
}

export function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function defaultChores(): Chore[] {
  return [
    { id: "c1", emoji: "🛏️", title: "Make your bed", coins: 5, ageBand: "4-7" },
    { id: "c2", emoji: "🦷", title: "Brush teeth (morning + night)", coins: 5, ageBand: "4-7" },
    { id: "c3", emoji: "🧦", title: "Put away laundry", coins: 10, ageBand: "8-12" },
    { id: "c4", emoji: "🍽️", title: "Clear the dinner table", coins: 8, ageBand: "8-12" },
    { id: "c5", emoji: "🐕", title: "Walk the dog", coins: 12, ageBand: "8-12" },
    { id: "c6", emoji: "🚮", title: "Take out the trash", coins: 10, ageBand: "8-12" },
    { id: "c7", emoji: "📚", title: "Read for 20 minutes", coins: 15, ageBand: "8-12" },
    { id: "c8", emoji: "🚗", title: "Help wash the car", coins: 20, ageBand: "13-18" },
    { id: "c9", emoji: "🌱", title: "Water the plants", coins: 5, ageBand: "4-7" },
    { id: "c10", emoji: "✏️", title: "Finish homework", coins: 15, ageBand: "8-12" },
  ];
}

export function defaultLessons(): Lesson[] {
  return [
    {
      id: "L1",
      emoji: "🪙",
      title: "What is a Coin?",
      ageBand: "4-7",
      mentor: "🐶 Mochi",
      blurb:
        "A coin is a tiny piece of money you can earn by doing things to help. The more you help, the more coins you get!",
      quiz: [
        {
          q: "How do you get coins?",
          options: ["By asking nicely", "By doing chores or learning", "They just appear", "From the TV"],
          correct: 1,
          why: "Coins are EARNED. You do something helpful, you get coins. That's how money works in the real world too!",
        },
        {
          q: "What can you do with coins?",
          options: ["Eat them", "Save, spend, or give them", "Throw them", "Hide them forever"],
          correct: 1,
          why: "Every coin can be saved (for later), spent (now), or given (to help others). You choose!",
        },
      ],
      badge: "🏅 First Coin",
    },
    {
      id: "L2",
      emoji: "🫙",
      title: "Save, Spend, or Give?",
      ageBand: "8-12",
      mentor: "🐿️ Squirrel Sage",
      blurb:
        "Every time you earn coins you have a choice. SAVE for something big later, SPEND on something fun now, or GIVE to help someone. The smartest people do all three.",
      quiz: [
        {
          q: "If you want a $30 toy and only have $5, what should you do?",
          options: ["Cry about it", "Put it in your Save jar each week", "Spend the $5 on candy", "Give up"],
          correct: 1,
          why: "Saving a little each week adds up FAST. That's how you get the things you really want.",
        },
        {
          q: "Why do people give money away?",
          options: ["They're rich", "It feels good and helps others", "They have to", "It's a trick"],
          correct: 1,
          why: "Giving makes you AND the other person feel good. Even small amounts help a lot.",
        },
      ],
      badge: "🏅 Three Jars",
    },
    {
      id: "L3",
      emoji: "📈",
      title: "What is a Stock?",
      ageBand: "13-18",
      mentor: "🦉 Owl Olivia",
      blurb:
        "A stock is a tiny piece of a real company that you can own. If the company grows, your piece becomes worth more. That's how regular people build wealth over time.",
      quiz: [
        {
          q: "What does it mean to 'own a stock'?",
          options: [
            "You own the whole company",
            "You own a small piece of the company",
            "You're the boss",
            "You get free stuff",
          ],
          correct: 1,
          why: "One stock = one tiny share. If a company has 1 million shares and you own 1, you own one millionth of it.",
        },
        {
          q: "Why is starting EARLY important when investing?",
          options: [
            "It's not, age doesn't matter",
            "Compound growth turns small amounts into big amounts over time",
            "Stocks are cheaper for kids",
            "Adults already have everything",
          ],
          correct: 1,
          why: "Compound interest is when your money EARNS money, and that money earns more money. Starting at 15 vs 25 makes you 2-3x richer at 65.",
        },
      ],
      badge: "🏅 First Investor",
    },
  ];
}
