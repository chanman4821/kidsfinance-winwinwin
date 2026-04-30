/**
 * Coinwood Village (8-12 mode) game logic.
 * Lemonade Stand + Shop ownership + chore + lessons.
 */

export type Weather = "sunny" | "cloudy" | "rainy";
export type Product = "lemonade" | "cookies" | "muffins" | "sandwiches";

export type StandState = {
  price: number; // current price per cup
  product: Product; // currently selling
  inventoryCost: number; // total coins spent on ingredients
  inventoryUnits: number; // cups available to sell
  level: number; // 1=basic stand, 2=upgraded stand, 3=cookies, 4=bakery
  todayWeather: Weather;
  daysOpen: number;
  totalRevenue: number;
  totalProfit: number;
  history: { day: number; revenue: number; profit: number; sold: number; weather: Weather }[];
};

export type Shop = {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  basePassive: number; // coins per day base
  description: string;
  owned?: boolean;
  daysOwned?: number;
};

export type VillageState = {
  kidName: string;
  petName: string;
  level: number;
  xp: number;
  streakDays: number;
  lastPlayDate: string;
  coins: number;
  jars: { save: number; spend: number; give: number };
  goal: { name: string; target: number; emoji: string } | null;
  stand: StandState;
  shopsOwned: string[];
  lessonsCompleted: string[];
  badges: string[];
  todayChoreXp: number;
};

export const VILLAGE_STORAGE = "winwinwin.village.v1";

export const SHOPS: Shop[] = [
  { id: "bakery", name: "Bunny's Burrow Bakery", emoji: "🥐", cost: 50, basePassive: 5, description: "Sells fresh bread and pastries every morning." },
  { id: "bookshop", name: "Owl's Bookshop", emoji: "📚", cost: 80, basePassive: 7, description: "Cozy bookstore — Owl Olivia recommends every book." },
  { id: "icecream", name: "Mochi's Ice Cream", emoji: "🍦", cost: 120, basePassive: 10, description: "Famous for the Mochi Mango flavor. Lines every weekend." },
  { id: "garden", name: "Grace's Flower Garden", emoji: "🌷", cost: 200, basePassive: 18, description: "Sells flowers + plants. Steady customers." },
  { id: "toystore", name: "Sage's Toy Workshop", emoji: "🧸", cost: 350, basePassive: 35, description: "Hand-crafted wooden toys. Famous in three towns." },
  { id: "pizza", name: "Sam's Pizza Place", emoji: "🍕", cost: 500, basePassive: 50, description: "Slow service but the pizza is legendary." },
];

export const PRODUCTS: Record<Product, { unitCost: number; unlockLevel: number; emoji: string; baseDemand: number }> = {
  lemonade: { unitCost: 2, unlockLevel: 1, emoji: "🍋", baseDemand: 25 },
  cookies: { unitCost: 3, unlockLevel: 2, emoji: "🍪", baseDemand: 22 },
  muffins: { unitCost: 4, unlockLevel: 3, emoji: "🧁", baseDemand: 20 },
  sandwiches: { unitCost: 6, unlockLevel: 4, emoji: "🥪", baseDemand: 18 },
};

export type ChoreV = { id: string; emoji: string; title: string; coins: number };

export const CHORES: ChoreV[] = [
  { id: "v1", emoji: "🛏️", title: "Make your bed", coins: 5 },
  { id: "v2", emoji: "🦷", title: "Brush teeth (morning + night)", coins: 5 },
  { id: "v3", emoji: "🧦", title: "Put away laundry", coins: 10 },
  { id: "v4", emoji: "🍽️", title: "Clear the dinner table", coins: 8 },
  { id: "v5", emoji: "🐕", title: "Walk the dog", coins: 12 },
  { id: "v6", emoji: "🚮", title: "Take out the trash", coins: 10 },
  { id: "v7", emoji: "📚", title: "Read for 20 minutes", coins: 15 },
  { id: "v8", emoji: "✏️", title: "Finish homework", coins: 15 },
];

export function newVillageState(name: string): VillageState {
  return {
    kidName: name,
    petName: "Bo",
    level: 1,
    xp: 0,
    streakDays: 1,
    lastPlayDate: todayStr(),
    coins: 30,
    jars: { save: 0, spend: 0, give: 0 },
    goal: null,
    stand: {
      price: 5,
      product: "lemonade",
      inventoryCost: 0,
      inventoryUnits: 0,
      level: 1,
      todayWeather: pickWeather(),
      daysOpen: 0,
      totalRevenue: 0,
      totalProfit: 0,
      history: [],
    },
    shopsOwned: [],
    lessonsCompleted: [],
    badges: [],
    todayChoreXp: 0,
  };
}

export function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function pickWeather(): Weather {
  const r = Math.random();
  if (r < 0.5) return "sunny";
  if (r < 0.85) return "cloudy";
  return "rainy";
}

/** Demand model: how many cups customers want at the kid's set price. */
export function calcDemand(product: Product, price: number, weather: Weather, standLevel: number): number {
  const base = PRODUCTS[product].baseDemand;
  const weatherMod = weather === "sunny" ? 1.4 : weather === "cloudy" ? 1.0 : 0.5;
  // price elasticity: optimal price is around 4-6 per cup for lemonade
  const optimalPrice = PRODUCTS[product].unitCost * 2.5;
  const priceMod = Math.max(0.1, 1.5 - (price - optimalPrice) * 0.15);
  // stand-level boost
  const levelMod = 1 + (standLevel - 1) * 0.1;
  return Math.round(base * weatherMod * priceMod * levelMod);
}

/** Buy ingredients to make N cups */
export function buyInventory(state: VillageState, units: number): { state: VillageState; error?: string } {
  const cost = PRODUCTS[state.stand.product].unitCost * units;
  if (cost > state.coins) return { state, error: `Need ${cost} coins, you have ${state.coins}` };
  return {
    state: {
      ...state,
      coins: state.coins - cost,
      stand: {
        ...state.stand,
        inventoryCost: state.stand.inventoryCost + cost,
        inventoryUnits: state.stand.inventoryUnits + units,
      },
    },
  };
}

/** Open the stand — sell as many cups as demand allows */
export function openStand(state: VillageState): VillageState {
  const demand = calcDemand(state.stand.product, state.stand.price, state.stand.todayWeather, state.stand.level);
  const sold = Math.min(demand, state.stand.inventoryUnits);
  const revenue = sold * state.stand.price;
  const costOfSold = sold * PRODUCTS[state.stand.product].unitCost;
  const profit = revenue - costOfSold;
  const day = state.stand.daysOpen + 1;
  return {
    ...state,
    coins: state.coins + revenue,
    xp: state.xp + Math.floor(profit / 2) + 10,
    stand: {
      ...state.stand,
      inventoryUnits: state.stand.inventoryUnits - sold,
      inventoryCost: state.stand.inventoryCost - costOfSold,
      daysOpen: day,
      totalRevenue: state.stand.totalRevenue + revenue,
      totalProfit: state.stand.totalProfit + profit,
      todayWeather: pickWeather(),
      history: [
        ...state.stand.history,
        { day, revenue, profit, sold, weather: state.stand.todayWeather },
      ].slice(-30),
    },
  };
}

/** Upgrade stand: improves demand multiplier; unlocks new products */
export function upgradeStand(state: VillageState): { state: VillageState; error?: string } {
  const upgradeCost = state.stand.level * 80;
  if (state.coins < upgradeCost) return { state, error: `Need ${upgradeCost} coins to upgrade` };
  if (state.stand.level >= 4) return { state, error: "Already at max level!" };
  return {
    state: {
      ...state,
      coins: state.coins - upgradeCost,
      stand: { ...state.stand, level: state.stand.level + 1 },
      xp: state.xp + 50,
    },
  };
}

export function setProduct(state: VillageState, product: Product): { state: VillageState; error?: string } {
  if (PRODUCTS[product].unlockLevel > state.stand.level) {
    return { state, error: `Upgrade to level ${PRODUCTS[product].unlockLevel} to unlock ${product}` };
  }
  return { state: { ...state, stand: { ...state.stand, product, inventoryUnits: 0, inventoryCost: 0 } } };
}

export function setPrice(state: VillageState, price: number): VillageState {
  return { ...state, stand: { ...state.stand, price: Math.max(1, Math.min(20, price)) } };
}

/** Buy a shop — pure passive income mechanic */
export function buyShop(state: VillageState, shopId: string): { state: VillageState; error?: string } {
  const shop = SHOPS.find((s) => s.id === shopId);
  if (!shop) return { state, error: "Shop not found" };
  if (state.shopsOwned.includes(shopId)) return { state, error: "Already owned" };
  if (state.coins < shop.cost) return { state, error: `Need ${shop.cost} coins, you have ${state.coins}` };
  return {
    state: {
      ...state,
      coins: state.coins - shop.cost,
      shopsOwned: [...state.shopsOwned, shopId],
      xp: state.xp + 100,
    },
  };
}

export function dailyShopIncome(state: VillageState): number {
  // Each shop pays basePassive coins/day, multiplied by 1 + (lessons completed × 0.05)
  const lessonBonus = 1 + state.lessonsCompleted.length * 0.05;
  let total = 0;
  for (const id of state.shopsOwned) {
    const s = SHOPS.find((x) => x.id === id);
    if (s) total += Math.floor(s.basePassive * lessonBonus);
  }
  return total;
}

export function collectShopIncome(state: VillageState): VillageState {
  const income = dailyShopIncome(state);
  return {
    ...state,
    coins: state.coins + income,
    xp: state.xp + Math.floor(income / 5),
  };
}

export function moveCoins(state: VillageState, jar: keyof VillageState["jars"], amount: number): VillageState {
  if (amount > state.coins) return state;
  return {
    ...state,
    coins: state.coins - amount,
    jars: { ...state.jars, [jar]: state.jars[jar] + amount },
  };
}

export function addChoreCoins(state: VillageState, c: ChoreV): VillageState {
  return { ...state, coins: state.coins + c.coins, xp: state.xp + c.coins, todayChoreXp: state.todayChoreXp + c.coins };
}
