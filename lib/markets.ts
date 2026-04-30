/**
 * Markets mode (13-18) — play-money portfolio simulator.
 * v0: hardcoded universe with deterministic random-walk price simulation.
 * v0.2 will swap in yahoo-finance2 for real prices.
 */

export type Stock = {
  ticker: string;
  name: string;
  emoji: string;
  sector: string;
  basePrice: number; // starting price for the random-walk simulation
  blurb: string; // age-appropriate "what does this company make"
};

export const STOCKS: Stock[] = [
  { ticker: "AAPL", name: "Apple", emoji: "🍎", sector: "Tech", basePrice: 195.5, blurb: "Makes iPhones, iPads, and Macs. One of the most valuable companies in the world." },
  { ticker: "MSFT", name: "Microsoft", emoji: "🪟", sector: "Tech", basePrice: 425.0, blurb: "Makes Windows, Xbox, and Office. Owns LinkedIn and Minecraft." },
  { ticker: "GOOGL", name: "Alphabet (Google)", emoji: "🔍", sector: "Tech", basePrice: 175.0, blurb: "Owns Google Search, YouTube, Android, and Gmail. Makes money mostly from ads." },
  { ticker: "DIS", name: "Disney", emoji: "🏰", sector: "Entertainment", basePrice: 100.0, blurb: "Owns Disney+, Pixar, Marvel, Star Wars, ESPN, and Disney Parks." },
  { ticker: "NKE", name: "Nike", emoji: "👟", sector: "Apparel", basePrice: 75.0, blurb: "Makes shoes, clothes, and sports gear. Famous swoosh logo." },
  { ticker: "MCD", name: "McDonald's", emoji: "🍔", sector: "Food", basePrice: 290.0, blurb: "Largest fast-food chain in the world. Sells burgers, fries, and Happy Meals." },
  { ticker: "RBLX", name: "Roblox", emoji: "🎮", sector: "Gaming", basePrice: 45.0, blurb: "Online platform where users create and play games. Has its own currency, Robux." },
  { ticker: "TSLA", name: "Tesla", emoji: "🚗", sector: "Auto", basePrice: 250.0, blurb: "Makes electric cars and solar panels. Founded by Elon Musk." },
  { ticker: "COST", name: "Costco", emoji: "🛒", sector: "Retail", basePrice: 880.0, blurb: "Big warehouse store you have to be a member to shop at. Famous for $1.50 hot dogs." },
  { ticker: "KO", name: "Coca-Cola", emoji: "🥤", sector: "Beverages", basePrice: 65.0, blurb: "Largest soda company. Owns Coke, Sprite, Fanta, Dasani, and Powerade." },
  { ticker: "SBUX", name: "Starbucks", emoji: "☕", sector: "Food", basePrice: 90.0, blurb: "Largest coffee chain in the world. Over 38,000 stores globally." },
  { ticker: "NVDA", name: "Nvidia", emoji: "🧠", sector: "Tech", basePrice: 950.0, blurb: "Makes the chips that power video games and most AI. One of the fastest-growing companies ever." },
];

export type Position = {
  ticker: string;
  shares: number; // can be fractional
  avgCost: number; // average price paid per share
};

export type Portfolio = {
  cash: number;
  positions: Position[];
  history: { date: string; value: number }[]; // daily portfolio total value
};

export type Trade = {
  id: string;
  date: string;
  ticker: string;
  side: "buy" | "sell";
  shares: number;
  price: number;
  total: number;
};

export type MarketsState = {
  portfolio: Portfolio;
  trades: Trade[];
  prices: Record<string, number>; // ticker -> current simulated price
  priceHistory: Record<string, { date: string; close: number }[]>; // ticker -> history
  lessonsCompleted: string[];
  badges: string[];
  lastUpdate: string;
};

export const MARKETS_STORAGE_KEY = "winwinwin.markets.v1";
export const STARTING_CASH = 10000;

export function newMarketsState(): MarketsState {
  const today = new Date().toISOString().slice(0, 10);
  const prices: Record<string, number> = {};
  const priceHistory: Record<string, { date: string; close: number }[]> = {};
  // seed with 60 days of history per ticker
  for (const s of STOCKS) {
    const history = generatePriceHistory(s.basePrice, 60, s.ticker);
    priceHistory[s.ticker] = history;
    prices[s.ticker] = history[history.length - 1].close;
  }
  return {
    portfolio: {
      cash: STARTING_CASH,
      positions: [],
      history: [{ date: today, value: STARTING_CASH }],
    },
    trades: [],
    prices,
    priceHistory,
    lessonsCompleted: [],
    badges: [],
    lastUpdate: today,
  };
}

/**
 * Deterministic seeded random-walk price simulation.
 * Each ticker has a unique seed → reproducible price stream.
 */
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 2 ** 32;
    return state / 2 ** 32;
  };
}

function tickerSeed(ticker: string, day: number): number {
  let h = day;
  for (let i = 0; i < ticker.length; i++) {
    h = ((h << 5) - h + ticker.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function generatePriceHistory(basePrice: number, days: number, ticker: string): { date: string; close: number }[] {
  const history: { date: string; close: number }[] = [];
  const today = new Date();
  let price = basePrice;
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const date = d.toISOString().slice(0, 10);
    const rng = seededRandom(tickerSeed(ticker, days - i));
    // daily ±2.5% with slight upward drift
    const change = (rng() - 0.48) * 0.05;
    price = Math.max(0.5, price * (1 + change));
    history.push({ date, close: Number(price.toFixed(2)) });
  }
  return history;
}

/** Simulate a new daily price tick for all stocks (run once per app session refresh) */
export function tickPrices(state: MarketsState): MarketsState {
  const today = new Date().toISOString().slice(0, 10);
  if (state.lastUpdate === today) return state; // already today
  const newPrices = { ...state.prices };
  const newHistory = { ...state.priceHistory };
  for (const s of STOCKS) {
    const last = state.prices[s.ticker] ?? s.basePrice;
    const rng = seededRandom(tickerSeed(s.ticker, Date.now()));
    const change = (rng() - 0.48) * 0.05;
    const next = Math.max(0.5, Number((last * (1 + change)).toFixed(2)));
    newPrices[s.ticker] = next;
    newHistory[s.ticker] = [...(newHistory[s.ticker] ?? []), { date: today, close: next }].slice(-180);
  }
  const portfolioValue = portfolioTotalValue({ ...state, prices: newPrices });
  const newPortfolio = {
    ...state.portfolio,
    history: [...state.portfolio.history, { date: today, value: portfolioValue }].slice(-365),
  };
  return { ...state, prices: newPrices, priceHistory: newHistory, portfolio: newPortfolio, lastUpdate: today };
}

export function portfolioTotalValue(state: MarketsState): number {
  let total = state.portfolio.cash;
  for (const p of state.portfolio.positions) {
    total += p.shares * (state.prices[p.ticker] ?? 0);
  }
  return Number(total.toFixed(2));
}

export function positionValue(p: Position, prices: Record<string, number>): number {
  return Number((p.shares * (prices[p.ticker] ?? 0)).toFixed(2));
}

export function positionGain(p: Position, prices: Record<string, number>): { abs: number; pct: number } {
  const cur = (prices[p.ticker] ?? 0);
  const abs = Number((p.shares * (cur - p.avgCost)).toFixed(2));
  const pct = p.avgCost > 0 ? ((cur - p.avgCost) / p.avgCost) * 100 : 0;
  return { abs, pct: Number(pct.toFixed(2)) };
}

export function buy(state: MarketsState, ticker: string, dollars: number): { state: MarketsState; error?: string } {
  if (dollars <= 0) return { state, error: "Amount must be positive" };
  if (dollars > state.portfolio.cash) return { state, error: `Not enough cash. You have $${state.portfolio.cash.toFixed(2)}` };
  const price = state.prices[ticker];
  if (!price) return { state, error: "Ticker not found" };
  const shares = Number((dollars / price).toFixed(4));
  const today = new Date().toISOString().slice(0, 10);
  const existing = state.portfolio.positions.find((p) => p.ticker === ticker);
  let newPositions: Position[];
  if (existing) {
    const newShares = existing.shares + shares;
    const newAvg = (existing.shares * existing.avgCost + shares * price) / newShares;
    newPositions = state.portfolio.positions.map((p) =>
      p.ticker === ticker ? { ticker, shares: Number(newShares.toFixed(4)), avgCost: Number(newAvg.toFixed(2)) } : p
    );
  } else {
    newPositions = [...state.portfolio.positions, { ticker, shares, avgCost: price }];
  }
  const trade: Trade = { id: `${Date.now()}`, date: today, ticker, side: "buy", shares, price, total: dollars };
  return {
    state: {
      ...state,
      portfolio: { ...state.portfolio, cash: Number((state.portfolio.cash - dollars).toFixed(2)), positions: newPositions },
      trades: [trade, ...state.trades].slice(0, 100),
    },
  };
}

export function sell(state: MarketsState, ticker: string, shares: number): { state: MarketsState; error?: string } {
  const pos = state.portfolio.positions.find((p) => p.ticker === ticker);
  if (!pos) return { state, error: "You don't own that stock" };
  if (shares > pos.shares) return { state, error: `You only have ${pos.shares} shares` };
  const price = state.prices[ticker];
  if (!price) return { state, error: "Ticker not found" };
  const today = new Date().toISOString().slice(0, 10);
  const total = Number((shares * price).toFixed(2));
  const remaining = Number((pos.shares - shares).toFixed(4));
  const newPositions = remaining > 0.0001
    ? state.portfolio.positions.map((p) => (p.ticker === ticker ? { ...p, shares: remaining } : p))
    : state.portfolio.positions.filter((p) => p.ticker !== ticker);
  const trade: Trade = { id: `${Date.now()}`, date: today, ticker, side: "sell", shares, price, total };
  return {
    state: {
      ...state,
      portfolio: { ...state.portfolio, cash: Number((state.portfolio.cash + total).toFixed(2)), positions: newPositions },
      trades: [trade, ...state.trades].slice(0, 100),
    },
  };
}

/** Compound interest formula: FV = P(1+r/n)^(nt) + PMT * [((1+r/n)^(nt) - 1)/(r/n)] */
export function compoundFutureValue(monthlyContribution: number, years: number, annualRate: number, startingPrincipal = 0): number {
  const r = annualRate / 100;
  const n = 12;
  const t = years;
  if (r === 0) return startingPrincipal + monthlyContribution * n * t;
  const factor = Math.pow(1 + r / n, n * t);
  const fvPrincipal = startingPrincipal * factor;
  const fvContrib = monthlyContribution * ((factor - 1) / (r / n));
  return Number((fvPrincipal + fvContrib).toFixed(2));
}

/** What would $1 today be worth after years of inflation */
export function realValue(amount: number, years: number, inflationRate = 3): number {
  return Number((amount / Math.pow(1 + inflationRate / 100, years)).toFixed(2));
}
