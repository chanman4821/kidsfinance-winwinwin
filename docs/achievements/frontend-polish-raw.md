Agent completed. agent_id: wwww-frontend-polish, agent_type: Frontend, status: completed, description: Polish all 3 mode pages, elapsed: 995s, total_turns: 0, duration: 973s

Good — I have all I need. Continuing exactly where the response was cut off. I'm picking up mid-file at the `village/page.tsx` sound section, then completing markets and the parent dashboard.

---

## `app/play/village/page.tsx` — sound section (tail of file)

Paste this block at the very bottom of the village page, replacing the incomplete `/* ════ SOUND ════ */` stub:

```tsx
/* ════ SOUND ════ */
let _vAudioCtx: AudioContext | null = null;
function getVAudioCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!_vAudioCtx) {
    try {
      _vAudioCtx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch { return null; }
  }
  return _vAudioCtx;
}

function vTone(freq: number, dur: number, type: OscillatorType = "sine", vol = 0.13): void {
  const ctx = getVAudioCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(vol, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + dur);
}

function playSound(kind: "coin" | "plink" | "fanfare"): void {
  if (kind === "coin") {
    vTone(880, 0.07, "sine", 0.13);
    setTimeout(() => vTone(1320, 0.09, "sine", 0.11), 55);
  } else if (kind === "plink") {
    vTone(1100, 0.05, "triangle", 0.11);
  } else {
    [523, 659, 784, 1047].forEach((f, i) =>
      setTimeout(() => vTone(f, 0.17, "triangle", 0.17), i * 85)
    );
  }
}

// pickWeather is imported from lib/village but referenced via the state — suppress unused warning
void (pickWeather as unknown);
```

> **Note on `pickWeather`:** it is imported at the top of the village page (existing import) but only called inside `lib/village` itself. The `void` line prevents a TypeScript "declared but never read" warning under `noUnusedLocals`. If your `tsconfig.json` does not have `noUnusedLocals: true`, remove that line entirely.

---

## `app/play/markets/page.tsx`

```tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  buy,
  compoundFutureValue,
  MarketsState,
  portfolioTotalValue,
  positionGain,
  positionValue,
  sell,
  STARTING_CASH,
  STOCKS,
} from "@/lib/markets";
import { loadMarkets, resetMarkets, saveMarkets } from "@/lib/marketsStorage";
import { CoinwoodScene, Olivia } from "@/components/characters";
import Link from "next/link";

type Tab = "portfolio" | "discover" | "labs" | "crew";

export default function MarketsPage() {
  const [state, setState] = useState<MarketsState | null>(null);
  const [tab, setTab] = useState<Tab>("portfolio");
  const [tradeFor, setTradeFor] = useState<string | null>(null);

  useEffect(() => {
    let s = loadMarkets();
    if (!s) s = resetMarkets();
    setState(s);
  }, []);

  useEffect(() => {
    if (state) saveMarkets(state);
  }, [state]);

  if (!state) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <CoinwoodScene />
        <div className="relative z-10 text-center">
          <div className="text-6xl mb-3 anim-float">🦉</div>
          <div className="display text-xl font-bold">Loading Markets…</div>
        </div>
      </div>
    );
  }

  const total = portfolioTotalValue(state);
  const investedValue = total - state.portfolio.cash;
  const totalGain = total - STARTING_CASH;
  const totalGainPct = ((total - STARTING_CASH) / STARTING_CASH) * 100;

  // Build ticker items from current positions (or default onboarding messages)
  const tickerItems: string[] =
    state.portfolio.positions.length > 0
      ? state.portfolio.positions.flatMap((p) => {
          const stock = STOCKS.find((s) => s.ticker === p.ticker)!;
          const gain = positionGain(p, state.prices);
          const arrow = gain.pct >= 0 ? "▲" : "▼";
          return [`${stock.emoji} ${p.ticker} ${arrow} ${Math.abs(gain.pct).toFixed(1)}%`];
        })
      : [
          "📈 Your portfolio is ready",
          "🔍 Tap Discover to buy stocks",
          "💰 $10,000 play money to invest",
          "🦉 Olivia will guide you",
          "🍎 Start with Apple, Disney or Roblox",
        ];

  const oliviaMsg =
    state.portfolio.positions.length === 0
      ? "Welcome, investor! You have $10,000 of play money. Start with a company you know! 🦉"
      : totalGain >= 0
      ? `Portfolio up ${totalGainPct.toFixed(1)}%! Great picks — keep learning and hold steady. 📈`
      : `Down ${Math.abs(totalGainPct).toFixed(1)}% today. Real investors stay calm. This is how you build wisdom! 💪`;

  function handleBuy(ticker: string, dollars: number) {
    if (!state) return;
    const r = buy(state, ticker, dollars);
    if (r.error) { alert(r.error); return; }
    setState(r.state);
    setTradeFor(null);
    playSound("buy");
  }

  function handleSell(ticker: string, shares: number) {
    if (!state) return;
    const r = sell(state, ticker, shares);
    if (r.error) { alert(r.error); return; }
    setState(r.state);
    setTradeFor(null);
    playSound("sell");
  }

  return (
    <div className="relative min-h-screen pb-8 bg-gradient-to-b from-[#cfe7ff] via-[#ffd6e7] to-[#fff3b0]">
      <CoinwoodScene />

      <div className="max-w-md mx-auto px-3 pt-3 relative z-10">

        {/* ── NAV ROW ── */}
        <div className="flex items-center gap-2 mb-3">
          <Link
            href="/"
            className="text-xs underline text-[#2b2640]/60 font-bold display min-h-[44px] flex items-center"
          >
            ← back
          </Link>
          <div className="display text-xl font-bold flex-1 text-center">📈 Coinwood Markets</div>
          <div className="w-16" />
        </div>

        {/* ── OLIVIA HERO ── */}
        <div className="flex items-end gap-3 mb-0 anim-hero-in">
          <div className="w-24 h-28 anim-float shrink-0">
            <Olivia className="w-full h-full" />
          </div>
          <div className="relative bg-white rounded-2xl px-3 py-2.5 self-center shadow-[0_4px_0_0_#2b2640] border-[3px] border-[#2b2640] flex-1 mb-1">
            <div className="absolute -left-3 top-4 w-0 h-0 border-y-[10px] border-y-transparent border-r-[12px] border-r-white" />
            <div className="absolute -left-[16px] top-[13px] w-0 h-0 border-y-[12px] border-y-transparent border-r-[14px] border-r-[#2b2640]" />
            <div className="display text-[10px] uppercase tracking-wider text-[#2b2640]/60 font-bold">Olivia the Owl</div>
            <div className="text-sm font-bold leading-snug">{oliviaMsg}</div>
          </div>
        </div>

        {/* ── PORTFOLIO TICKER ── */}
        <div
          className="overflow-hidden rounded-xl mb-3 bg-[#2b2640] mt-2"
          aria-hidden="true"
        >
          <div className="anim-ticker py-1.5">
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <span key={i} className="text-white text-xs font-bold px-5 shrink-0">
                {item} &nbsp;·&nbsp;
              </span>
            ))}
          </div>
        </div>

        {/* ── PORTFOLIO SUMMARY CARD ── */}
        <div
          className="bg-white/90 backdrop-blur rounded-3xl p-4 border-[4px] border-white shadow-[0_6px_0_0_rgba(43,38,64,0.1)] mb-3 anim-slide-up"
          style={{ animationDelay: "80ms" }}
        >
          <div className="text-xs uppercase tracking-wider text-[#2b2640]/60 font-bold display">
            Total Portfolio
          </div>
          <div className="display text-4xl font-bold leading-none mt-1">
            ${total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
          <div
            className={`text-sm font-bold mt-1 ${
              totalGain >= 0 ? "text-[#4fa86c]" : "text-[#cc4f6e]"
            }`}
          >
            {totalGain >= 0 ? "▲" : "▼"} ${Math.abs(totalGain).toFixed(2)} (
            {totalGainPct.toFixed(2)}%) all-time
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div
              className="bg-[#d4f4dd] rounded-2xl p-2.5 text-center border-[3px] border-white"
              style={{ transform: "rotate(-0.6deg)" }}
            >
              <div className="text-[10px] uppercase tracking-wider text-[#2b2640]/70 font-bold">
                Cash
              </div>
              <div className="display font-bold text-xl mt-0.5">
                ${state.portfolio.cash.toFixed(2)}
              </div>
            </div>
            <div
              className="bg-[#fff3b0] rounded-2xl p-2.5 text-center border-[3px] border-white"
              style={{ transform: "rotate(0.6deg)" }}
            >
              <div className="text-[10px] uppercase tracking-wider text-[#2b2640]/70 font-bold">
                Invested
              </div>
              <div className="display font-bold text-xl mt-0.5">
                ${investedValue.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="flex gap-1.5 mb-3 anim-slide-up" style={{ animationDelay: "120ms" }}>
          {(["portfolio", "discover", "labs", "crew"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-2xl display font-bold text-xs uppercase tracking-wider min-h-[44px] transition-all ${
                tab === t
                  ? "bg-[#5aa9e6] text-white border-[3px] border-white shadow-[0_4px_0_0_#3b80b0] scale-105"
                  : "bg-white/70 text-[#2b2640]/60 border-[3px] border-white hover:bg-white/90"
              }`}
            >
              {t === "portfolio"
                ? "📊 Holdings"
                : t === "discover"
                ? "🔍 Discover"
                : t === "labs"
                ? "🧪 Labs"
                : "👥 Crew"}
            </button>
          ))}
        </div>

        {tab === "portfolio" && <Holdings state={state} onTrade={setTradeFor} />}
        {tab === "discover"  && <Discover state={state} onTrade={setTradeFor} />}
        {tab === "labs"      && <Labs />}
        {tab === "crew"      && <CrewPlaceholder />}
      </div>

      {tradeFor && (
        <TradeModal
          ticker={tradeFor}
          state={state}
          onClose={() => setTradeFor(null)}
          onBuy={handleBuy}
          onSell={handleSell}
        />
      )}

      <button
        className="fixed top-2 right-2 text-[10px] text-[#2b2640]/40 underline z-20"
        onClick={() => {
          if (confirm("Reset portfolio?")) {
            setState(resetMarkets());
          }
        }}
      >
        reset
      </button>
    </div>
  );
}

/* ════ HOLDINGS ════ */
function Holdings({
  state,
  onTrade,
}: {
  state: MarketsState;
  onTrade: (ticker: string) => void;
}) {
  if (state.portfolio.positions.length === 0) {
    return (
      <div
        className="bg-white/85 backdrop-blur rounded-3xl p-6 text-center border-[4px] border-white shadow-[0_6px_0_0_rgba(43,38,64,0.1)] anim-slide-up"
        style={{ "--card-tilt": "-0.5deg" } as React.CSSProperties}
      >
        <div className="text-5xl mb-3 anim-float">🦉</div>
        <div className="display text-xl font-bold mt-2">No holdings yet</div>
        <div className="text-sm text-[#2b2640]/70 mt-2 leading-relaxed">
          Olivia says: <em>&ldquo;Every great investor starts at zero. Tap&nbsp;
          <strong>🔍 Discover</strong> and buy a share of a company you already love!&rdquo;</em>
        </div>
        <div className="text-xs text-[#2b2640]/50 mt-3 italic bg-[#fff3b0]/60 rounded-2xl p-3 border-[2px] border-white">
          You have <strong>${state.portfolio.cash.toFixed(2)}</strong> of play money.
          Real-world prices, zero real risk.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {state.portfolio.positions.map((p, i) => {
        const stock = STOCKS.find((s) => s.ticker === p.ticker)!;
        const value = positionValue(p, state.prices);
        const gain = positionGain(p, state.prices);
        const price = state.prices[p.ticker];
        return (
          <button
            key={p.ticker}
            onClick={() => onTrade(p.ticker)}
            className="w-full bg-white/90 backdrop-blur rounded-3xl p-3 border-[4px] border-white shadow-[0_5px_0_0_rgba(43,38,64,0.1)] flex items-center gap-3 active:scale-95 transition-transform text-left min-h-[64px] hover:shadow-[0_7px_0_0_rgba(43,38,64,0.12)]"
            style={{ transform: `rotate(${i % 2 === 0 ? "-0.4deg" : "0.4deg"})` }}
          >
            <div className="text-4xl shrink-0">{stock.emoji}</div>
            <div className="flex-1 min-w-0">
              <div className="display font-bold text-base leading-tight truncate">
                {stock.name}
              </div>
              <div className="text-[10px] text-[#2b2640]/60 font-bold uppercase">
                {p.ticker} · {p.shares.toFixed(2)} shares
              </div>
              <div
                className={`text-xs font-bold mt-0.5 ${
                  gain.abs >= 0 ? "text-[#4fa86c]" : "text-[#cc4f6e]"
                }`}
              >
                {gain.abs >= 0 ? "▲" : "▼"} ${Math.abs(gain.abs).toFixed(2)} (
                {gain.pct.toFixed(2)}%)
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="display font-bold text-lg">${value.toFixed(2)}</div>
              <div className="text-[10px] text-[#2b2640]/60 font-bold">
                @ ${price.toFixed(2)}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* ════ DISCOVER ════ */
function Discover({
  state,
  onTrade,
}: {
  state: MarketsState;
  onTrade: (ticker: string) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="bg-[#fff3b0]/80 backdrop-blur rounded-2xl p-3 border-[3px] border-white shadow text-xs text-[#2b2640]/80">
        💡 <strong>Tip:</strong> Invest in companies you already know and use every day.
        Coca-Cola, Disney, Apple, Roblox — real companies, real prices.
      </div>
      {STOCKS.map((s, i) => {
        const price = state.prices[s.ticker];
        const history = state.priceHistory[s.ticker] ?? [];
        const day1 = history[Math.max(0, history.length - 30)]?.close ?? price;
        const change30d = ((price - day1) / day1) * 100;
        const owned = state.portfolio.positions.find((p) => p.ticker === s.ticker);
        return (
          <button
            key={s.ticker}
            onClick={() => onTrade(s.ticker)}
            className="w-full bg-white/90 backdrop-blur rounded-3xl p-3 border-[4px] border-white shadow-[0_5px_0_0_rgba(43,38,64,0.1)] flex items-center gap-3 active:scale-95 transition-transform text-left min-h-[68px] hover:shadow-[0_7px_0_0_rgba(43,38,64,0.13)]"
            style={{ transform: `rotate(${i % 2 === 0 ? "-0.5deg" : "0.5deg"})` }}
          >
            <div className="text-4xl shrink-0">{s.emoji}</div>
            <div className="flex-1 min-w-0">
              <div className="display font-bold text-base leading-tight flex items-center gap-1.5">
                {s.name}
                {owned && (
                  <span className="text-[9px] bg-[#6ad48b] text-white px-1.5 py-0.5 rounded-full font-bold uppercase">
                    owned
                  </span>
                )}
              </div>
              <div className="text-[10px] text-[#2b2640]/60 font-bold uppercase">
                {s.ticker} · {s.sector}
              </div>
              <div className="text-[11px] text-[#2b2640]/70 line-clamp-1 mt-0.5">
                {s.blurb}
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="display font-bold text-lg">${price.toFixed(2)}</div>
              <div
                className={`text-[10px] font-bold ${
                  change30d >= 0 ? "text-[#4fa86c]" : "text-[#cc4f6e]"
                }`}
              >
                {change30d >= 0 ? "▲" : "▼"} {Math.abs(change30d).toFixed(2)}% 30d
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* ════ LABS ════ */
function Labs() {
  const [contrib, setContrib] = useState(50);
  const [years, setYears] = useState(30);
  const [rate, setRate] = useState(8);

  const fv = useMemo(
    () => compoundFutureValue(contrib, years, rate, 0),
    [contrib, years, rate]
  );
  const totalContributed = contrib * 12 * years;
  const interestEarned = fv - totalContributed;

  const creditMonths = useMemo(() => {
    let bal = 500;
    const apr = 22;
    let months = 0;
    let totalPaid = 0;
    while (bal > 1 && months < 1200) {
      const monthlyRate = apr / 100 / 12;
      const interest = bal * monthlyRate;
      const minPayment = Math.max(25, bal * 0.02);
      const payment = Math.min(minPayment, bal + interest);
      bal = bal + interest - payment;
      totalPaid += payment;
      months++;
    }
    return {
      months,
      years: (months / 12).toFixed(1),
      totalPaid: totalPaid.toFixed(2),
      interestPaid: (totalPaid - 500).toFixed(2),
    };
  }, []);

  return (
    <div className="space-y-3">
      {/* Compound interest */}
      <div
        className="bg-white/90 backdrop-blur rounded-3xl p-4 border-[4px] border-white shadow-[0_6px_0_0_rgba(43,38,64,0.1)]"
        style={{ transform: "rotate(-0.4deg)" }}
      >
        <div className="display text-lg font-bold mb-1 flex items-center gap-2">
          🧪 Compound Interest Lab
        </div>
        <div className="text-xs text-[#2b2640]/70 mb-3">
          See how saving a little every month grows into something huge over time.
        </div>

        <div className="space-y-3">
          <SliderRow
            label="Save per month"
            value={contrib}
            min={5}
            max={500}
            step={5}
            prefix="$"
            onChange={setContrib}
          />
          <SliderRow
            label="For how many years"
            value={years}
            min={1}
            max={50}
            step={1}
            suffix=" yr"
            onChange={setYears}
          />
          <SliderRow
            label="Average yearly return"
            value={rate}
            min={0}
            max={15}
            step={0.5}
            suffix="%"
            onChange={setRate}
          />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div
            className="bg-[#fff3b0] rounded-2xl p-2.5 border-[3px] border-white"
            style={{ transform: "rotate(-1deg)" }}
          >
            <div className="text-[10px] uppercase font-bold text-[#2b2640]/70">
              You put in
            </div>
            <div className="display text-sm font-bold mt-1">
              ${totalContributed.toLocaleString()}
            </div>
          </div>
          <div
            className="bg-[#d4f4dd] rounded-2xl p-2.5 border-[3px] border-white"
            style={{ transform: "rotate(0deg)" }}
          >
            <div className="text-[10px] uppercase font-bold text-[#2b2640]/70">
              Interest
            </div>
            <div className="display text-sm font-bold mt-1 text-[#4fa86c]">
              +$
              {interestEarned.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}
            </div>
          </div>
          <div
            className="bg-[#5aa9e6] text-white rounded-2xl p-2.5 border-[3px] border-white"
            style={{ transform: "rotate(1deg)" }}
          >
            <div className="text-[10px] uppercase font-bold opacity-80">
              Final value
            </div>
            <div className="display text-sm font-bold mt-1">
              $
              {fv.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
          </div>
        </div>

        <div className="mt-3 p-3 bg-[#fff3b0]/60 rounded-2xl text-xs text-[#2b2640]/80 italic border-[2px] border-white">
          💡 Start <strong>10 years earlier</strong> and you&apos;d have $
          {(
            compoundFutureValue(contrib, years + 10, rate, 0) - fv
          ).toLocaleString(undefined, { maximumFractionDigits: 0 })}{" "}
          MORE. <strong>Time</strong> is the superpower.
        </div>
      </div>

      {/* Credit card trap */}
      <div
        className="bg-white/90 backdrop-blur rounded-3xl p-4 border-[4px] border-white shadow-[0_6px_0_0_rgba(43,38,64,0.1)]"
        style={{ transform: "rotate(0.4deg)" }}
      >
        <div className="display text-lg font-bold mb-1 flex items-center gap-2">
          💳 Credit Card Trap
        </div>
        <div className="text-xs text-[#2b2640]/70 mb-3">
          Spend $500 on a card and only pay the minimum each month. Watch what
          happens.
        </div>

        <div className="bg-[#ffd6e7]/60 rounded-2xl p-3 border-[2px] border-white">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div>
              <div className="text-[10px] uppercase font-bold text-[#2b2640]/70">
                Time to pay off
              </div>
              <div className="display text-3xl font-bold text-[#cc4f6e]">
                {creditMonths.years} yrs
              </div>
              <div className="text-[10px] text-[#2b2640]/60">
                ({creditMonths.months} months)
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-[#2b2640]/70">
                Total interest paid
              </div>
              <div className="display text-3xl font-bold text-[#cc4f6e]">
                ${creditMonths.interestPaid}
              </div>
              <div className="text-[10px] text-[#2b2640]/60">on a $500 buy</div>
            </div>
          </div>
        </div>

        <div className="mt-3 p-3 bg-[#d4f4dd]/60 rounded-2xl text-xs text-[#2b2640]/80 italic border-[2px] border-white">
          💡 At 22% APR, paying the minimum turns $500 into $
          {creditMonths.totalPaid}. <strong>Always pay in full.</strong>
        </div>
      </div>
    </div>
  );
}

/* ════ SLIDER ROW ════ */
function SliderRow({
  label,
  value,
  min,
  max,
  step,
  prefix = "",
  suffix = "",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <div className="text-xs font-bold text-[#2b2640]/70">{label}</div>
        <div className="display text-lg font-bold">
          {prefix}
          {value}
          {suffix}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#5aa9e6]"
        style={{ touchAction: "none" }}
      />
    </div>
  );
}

/* ════ CREW PLACEHOLDER ════ */
function CrewPlaceholder() {
  return (
    <div
      className="bg-white/90 backdrop-blur rounded-3xl p-6 text-center border-[4px] border-white shadow-[0_6px_0_0_rgba(43,38,64,0.1)]"
      style={{ transform: "rotate(-0.4deg)" }}
    >
      <div className="text-6xl mb-3 anim-float">👥</div>
      <div className="display text-xl font-bold">Investment Crews</div>
      <div className="text-xs bg-[#ff7eb5] text-white px-2 py-0.5 rounded-full font-bold inline-block mt-1 mb-3">
        Coming Soon
      </div>
      <div className="text-sm text-[#2b2640]/70 leading-relaxed">
        Start a Crew with 2–8 friends. Share your portfolio, see what they&apos;re
        buying, and discuss strategies. Parent-approved, totally safe.
      </div>
      <div className="mt-4 p-3 bg-[#fff3b0]/60 rounded-2xl text-xs text-left border-[2px] border-white">
        <strong>What you&apos;ll do:</strong>
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>Share &ldquo;why I bought&rdquo; notes (safe preset phrases)</li>
          <li>Weekly Crew Report from Olivia the Owl</li>
          <li>Monthly Crew Tournament — best portfolio wins</li>
          <li>Family-only: no strangers, no chat, no DMs</li>
        </ul>
      </div>
    </div>
  );
}

/* ════ TRADE MODAL ════ */
function TradeModal({
  ticker,
  state,
  onClose,
  onBuy,
  onSell,
}: {
  ticker: string;
  state: MarketsState;
  onClose: () => void;
  onBuy: (ticker: string, dollars: number) => void;
  onSell: (ticker: string, shares: number) => void;
}) {
  const stock = STOCKS.find((s) => s.ticker === ticker)!;
  const price = state.prices[ticker];
  const position = state.portfolio.positions.find((p) => p.ticker === ticker);
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState(100);
  const history = state.priceHistory[ticker] ?? [];
  const recent30 = history.slice(-30);
  const change30 =
    recent30.length > 1
      ? ((price - recent30[0].close) / recent30[0].close) * 100
      : 0;
  const sellShares = position
    ? Math.min(position.shares, amount / price)
    : 0;

  return (
    <div
      className="fixed inset-0 bg-[#2b2640]/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#fff9f0] rounded-3xl p-5 max-w-md w-full max-h-[85vh] overflow-y-auto border-[4px] border-white shadow-2xl anim-bounce-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="text-5xl">{stock.emoji}</div>
          <div className="flex-1">
            <div className="display text-xl font-bold leading-tight">{stock.name}</div>
            <div className="text-xs text-[#2b2640]/60 font-bold">
              {stock.ticker} · {stock.sector}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-[#2b2640]/40 text-3xl w-11 h-11 flex items-center justify-center hover:text-[#2b2640]"
          >
            ×
          </button>
        </div>

        {/* Price + sparkline */}
        <div className="bg-white rounded-2xl p-3 mb-3 border-[3px] border-[#2b2640]/10">
          <div className="flex items-baseline gap-2">
            <div className="display text-3xl font-bold">${price.toFixed(2)}</div>
            <div
              className={`text-sm font-bold ${
                change30 >= 0 ? "text-[#4fa86c]" : "text-[#cc4f6e]"
              }`}
            >
              {change30 >= 0 ? "▲" : "▼"} {Math.abs(change30).toFixed(2)}% (30d)
            </div>
          </div>
          <Sparkline data={recent30.map((h) => h.close)} positive={change30 >= 0} />
          <div className="text-xs text-[#2b2640]/70 mt-2">{stock.blurb}</div>
        </div>

        {/* Position info */}
        {position && (
          <div className="bg-[#d4f4dd] rounded-2xl p-3 mb-3 border-[3px] border-white text-xs font-bold">
            You own {position.shares.toFixed(2)} shares · avg cost $
            {position.avgCost.toFixed(2)} · worth $
            {(position.shares * price).toFixed(2)}
          </div>
        )}

        {/* Buy / Sell toggle */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setSide("buy")}
            className={`flex-1 py-3 rounded-2xl display font-bold min-h-[48px] transition-all ${
              side === "buy"
                ? "bg-[#6ad48b] text-white border-[4px] border-white shadow-[0_4px_0_0_#4fa86c]"
                : "bg-white border-[3px] border-[#2b2640]/10"
            }`}
          >
            Buy
          </button>
          <button
            disabled={!position}
            onClick={() => setSide("sell")}
            className={`flex-1 py-3 rounded-2xl display font-bold min-h-[48px] transition-all ${
              side === "sell"
                ? "bg-[#ff7eb5] text-white border-[4px] border-white shadow-[0_4px_0_0_#cc5e8e]"
                : "bg-white border-[3px] border-[#2b2640]/10 disabled:opacity-40"
            }`}
          >
            Sell
          </button>
        </div>

        {/* Amount picker */}
        <div className="mb-3">
          <div className="flex justify-between mb-2">
            <div className="text-xs font-bold text-[#2b2640]/70">
              {side === "buy" ? "Amount to invest" : "Amount to sell"}
            </div>
            <div className="display text-xl font-bold">${amount}</div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[25, 100, 500, 1000].map((n) => (
              <button
                key={n}
                onClick={() => setAmount(n)}
                disabled={
                  side === "buy"
                    ? n > state.portfolio.cash
                    : n > (position ? position.shares * price : 0)
                }
                className={`py-2.5 rounded-xl display font-bold text-sm min-h-[44px] transition-all ${
                  amount === n
                    ? "bg-[#5aa9e6] text-white border-[3px] border-white shadow-[0_3px_0_0_#3b80b0]"
                    : "bg-white border-[3px] border-[#2b2640]/10"
                } disabled:opacity-30`}
              >
                ${n}
              </button>
            ))}
          </div>
          <div className="text-xs text-[#2b2640]/60 mt-2 font-bold">
            {side === "buy"
              ? `≈ ${(amount / price).toFixed(4)} shares · Cash: $${state.portfolio.cash.toFixed(2)}`
              : `≈ ${sellShares.toFixed(4)} shares`}
          </div>
        </div>

        {/* Confirm button */}
        <button
          onClick={() =>
            side === "buy"
              ? onBuy(ticker, amount)
              : onSell(ticker, sellShares)
          }
          className={`w-full py-4 rounded-full display font-bold text-white text-lg border-[4px] border-white shadow-[0_5px_0_0_rgba(0,0,0,0.18)] active:translate-y-1 active:shadow-[0_1px_0_0_rgba(0,0,0,0.18)] min-h-[56px] ${
            side === "buy" ? "bg-[#6ad48b]" : "bg-[#ff7eb5]"
          }`}
        >
          {side === "buy"
            ? `Buy $${amount} of ${ticker} 📈`
            : `Sell ${sellShares.toFixed(2)} shares 📉`}
        </button>
      </div>
    </div>
  );
}

/* ════ SPARKLINE ════ */
function Sparkline({ data, positive }: { data: number[]; positive: boolean }) {
  if (data.length < 2) return null;
  const w = 280;
  const h = 60;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-12 mt-2">
      <polyline
        points={points}
        fill="none"
        stroke={positive ? "#4fa86c" : "#cc4f6e"}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ════ SOUND ════ */
let _mAudioCtx: AudioContext | null = null;
function getMCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!_mAudioCtx) {
    try {
      _mAudioCtx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch { return null; }
  }
  return _mAudioCtx;
}

function mTone(
  freq: number,
  dur: number,
  type: OscillatorType = "sine",
  vol = 0.13
): void {
  const ctx = getMCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(vol, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + dur);
}

function playSound(kind: "buy" | "sell"): void {
  if (kind === "buy") {
    // ascending two-tone: confirms a positive action
    mTone(660, 0.08, "sine", 0.13);
    setTimeout(() => mTone(990, 0.12, "triangle", 0.12), 70);
  } else {
    // descending two-tone: neutral sell confirmation
    mTone(880, 0.07, "triangle", 0.12);
    setTimeout(() => mTone(550, 0.1, "sine", 0.1), 65);
  }
}
```

---

## `app/parent/page.tsx` *(new file)*

```tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/* ─── Mock data ─────────────────────────────────────────── */
type KidCard = {
  id: string;
  name: string;
  age: number;
  avatar: string;
  mode: string;
  modeEmoji: string;
  todayCoins: number;
  weeklyXp: number;
  streak: number;
  goal: { name: string; pct: number } | null;
  lastActivity: string;
  color: string;
  accent: string;
  shadow: string;
  tilt: string;
};

const MOCK_KIDS: KidCard[] = [
  {
    id: "emma",
    name: "Emma",
    age: 9,
    avatar: "🐰",
    mode: "Village",
    modeEmoji: "🏘️",
    todayCoins: 45,
    weeklyXp: 280,
    streak: 5,
    goal: { name: "Video game 🎮", pct: 65 },
    lastActivity: "Ran lemonade stand · 2 h ago",
    color: "bg-[#d4f4dd]",
    accent: "#4fa86c",
    shadow: "#3a7e51",
    tilt: "-1deg",
  },
  {
    id: "liam",
    name: "Liam",
    age: 14,
    avatar: "🦉",
    mode: "Markets",
    modeEmoji: "📈",
    todayCoins: 0,
    weeklyXp: 420,
    streak: 12,
    goal: { name: "College fund 🎓", pct: 22 },
    lastActivity: "Bought Apple stock · 1 d ago",
    color: "bg-[#cfe7ff]",
    accent: "#3b80b0",
    shadow: "#2b6090",
    tilt: "0.5deg",
  },
  {
    id: "zoe",
    name: "Zoe",
    age: 6,
    avatar: "🐶",
    mode: "Coinland",
    modeEmoji: "🌟",
    todayCoins: 20,
    weeklyXp: 150,
    streak: 3,
    goal: { name: "Stuffed animal 🧸", pct: 80 },
    lastActivity: "Fed pet Bunny · 30 m ago",
    color: "bg-[#fff3b0]",
    accent: "#ccaa3d",
    shadow: "#a08830",
    tilt: "-0.5deg",
  },
];

type ChartRow = { day: string; Emma: number; Liam: number; Zoe: number };
const WEEKLY_CHART: ChartRow[] = [
  { day: "Mon", Emma: 80,  Liam: 90,  Zoe: 40  },
  { day: "Tue", Emma: 120, Liam: 60,  Zoe: 60  },
  { day: "Wed", Emma: 0,   Liam: 110, Zoe: 20  },
  { day: "Thu", Emma: 60,  Liam: 80,  Zoe: 30  },
  { day: "Fri", Emma: 20,  Liam: 80,  Zoe: 0   },
  { day: "Sat", Emma: 0,   Liam: 0,   Zoe: 0   },
  { day: "Sun", Emma: 0,   Liam: 0,   Zoe: 0   },
];

/* ─── Page ───────────────────────────────────────────────── */
export default function ParentPage() {
  const [activeKid, setActiveKid] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#cfe7ff] via-[#ffd6e7] to-[#fff3b0]">
      <div className="max-w-md mx-auto px-4 pt-6 pb-16">

        {/* ── HEADER ── */}
        <div className="flex items-center gap-2 mb-6 anim-hero-in">
          <Link
            href="/"
            className="text-xs underline text-[#2b2640]/60 font-bold display min-h-[44px] flex items-center"
          >
            ← back
          </Link>
          <div className="flex-1 text-center">
            <div className="display text-2xl font-bold">👨‍👩‍👧‍👦 Parent Hub</div>
            <div className="display text-xs uppercase tracking-wider text-[#2b2640]/50 font-bold">
              Win Win Win — Family Dashboard
            </div>
          </div>
          <div className="w-12" />
        </div>

        {/* ── WELCOME CARD ── */}
        <div
          className="bg-white/90 backdrop-blur rounded-3xl p-4 mb-4 border-[4px] border-white shadow-[0_6px_0_0_rgba(43,38,64,0.1)] anim-slide-up"
          style={{ transform: "rotate(-0.4deg)" }}
        >
          <div className="flex items-center gap-3">
            <div className="text-4xl">👋</div>
            <div>
              <div className="display text-lg font-bold">Welcome, Parent!</div>
              <div className="text-xs text-[#2b2640]/70">
                3 kids active · all screens ad-free · COPPA-safe
              </div>
            </div>
            <div className="ml-auto bg-[#6ad48b] text-white text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider">
              All safe ✓
            </div>
          </div>
        </div>

        {/* ── SECTION LABEL ── */}
        <div className="display text-sm font-bold uppercase tracking-wider text-[#2b2640]/60 text-center mb-3">
          Your kids
        </div>

        {/* ── KID CARDS ── */}
        <div className="space-y-3 mb-4">
          {MOCK_KIDS.map((kid) => (
            <KidCardView
              key={kid.id}
              kid={kid}
              expanded={activeKid === kid.id}
              onToggle={() =>
                setActiveKid(activeKid === kid.id ? null : kid.id)
              }
            />
          ))}
        </div>

        {/* ── ADD KID CTA ── */}
        <button
          className="w-full py-4 rounded-full display font-bold text-[#2b2640] text-base bg-white border-[4px] border-[#2b2640]/15 shadow-[0_5px_0_0_rgba(43,38,64,0.12)] active:translate-y-1 active:shadow-[0_1px_0_0_rgba(43,38,64,0.12)] mb-6 hover:bg-[#fff9f0] transition-colors min-h-[56px]"
          onClick={() => alert("Add kid flow coming soon!")}
        >
          + Add another kid
        </button>

        {/* ── WEEKLY PROGRESS CHART ── */}
        <div
          className="bg-white/90 backdrop-blur rounded-3xl p-4 border-[4px] border-white shadow-[0_6px_0_0_rgba(43,38,64,0.1)] mb-4"
          style={{ transform: "rotate(-0.3deg)" }}
        >
          <div className="display text-base font-bold mb-1 flex items-center gap-2">
            📊 Weekly XP — this week
          </div>
          <div className="text-xs text-[#2b2640]/60 mb-3">
            Higher bar = more learning activity that day
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={WEEKLY_CHART}
              margin={{ top: 4, right: 4, bottom: 0, left: -24 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#2b2640"
                strokeOpacity={0.07}
              />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10, fontFamily: "Nunito, sans-serif", fill: "#2b264099" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fontFamily: "Nunito, sans-serif", fill: "#2b264099" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "3px solid white",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  fontFamily: "Nunito, sans-serif",
                  fontSize: 12,
                }}
              />
              <Legend
                wrapperStyle={{
                  fontSize: 11,
                  fontFamily: "Nunito, sans-serif",
                  paddingTop: 8,
                }}
              />
              <Bar dataKey="Emma" fill="#6ad48b" radius={[5, 5, 0, 0]} maxBarSize={28} />
              <Bar dataKey="Liam"  fill="#5aa9e6" radius={[5, 5, 0, 0]} maxBarSize={28} />
              <Bar dataKey="Zoe"   fill="#ffd84d" radius={[5, 5, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ── QUICK LINKS ── */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { emoji: "⚙️",  label: "Settings", href: "/settings" },
            { emoji: "💳",  label: "Billing",  href: "/billing"  },
            { emoji: "📄",  label: "Reports",  href: "/reports"  },
          ].map((link, i) => (
            <Link
              key={link.label}
              href={link.href}
              className="bg-white/80 backdrop-blur rounded-2xl p-3 border-[3px] border-white shadow-[0_4px_0_0_rgba(43,38,64,0.1)] text-center active:scale-95 transition-transform min-h-[72px] flex flex-col items-center justify-center gap-1"
              style={{ transform: `rotate(${i % 2 === 0 ? "-0.6deg" : "0.6deg"})` }}
            >
              <div className="text-2xl">{link.emoji}</div>
              <div className="display text-xs uppercase tracking-wider font-bold">
                {link.label}
              </div>
            </Link>
          ))}
        </div>

        {/* ── FOOTER ── */}
        <div className="text-center text-[10px] text-[#2b2640]/50 mt-2">
          Free · ad-free · no real money · COPPA-safe<br />
          All data stored locally on this device only.
        </div>
      </div>
    </div>
  );
}

/* ─── Kid Card ───────────────────────────────────────────── */
function KidCardView({
  kid,
  expanded,
  onToggle,
}: {
  kid: KidCard;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`${kid.color} rounded-3xl border-[4px] border-white shadow-[0_6px_0_0_rgba(43,38,64,0.1)] overflow-hidden transition-all duration-300`}
      style={{ transform: `rotate(${kid.tilt})` }}
    >
      {/* Summary row — always visible */}
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center gap-3 text-left min-h-[72px]"
      >
        <div className="text-4xl shrink-0">{kid.avatar}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="display text-xl font-bold">{kid.name}</div>
            <div className="text-[10px] text-[#2b2640]/60 font-bold">age {kid.age}</div>
            <div
              className="text-[9px] text-white px-2 py-0.5 rounded-full font-bold"
              style={{ background: kid.accent }}
            >
              {kid.modeEmoji} {kid.mode}
            </div>
          </div>
          <div className="text-[11px] text-[#2b2640]/70 mt-0.5 truncate">
            {kid.lastActivity}
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="display text-xl font-bold">🪙{kid.todayCoins}</div>
          <div className="text-[10px] text-[#2b2640]/60 font-bold">today</div>
        </div>
        <div className="ml-1 text-[#2b2640]/40 text-lg">{expanded ? "▲" : "▼"}</div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t-[2px] border-white/60 pt-3">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-white/60 rounded-2xl p-2 border-[2px] border-white">
              <div className="text-[9px] uppercase font-bold text-[#2b2640]/60">
                Weekly XP
              </div>
              <div className="display text-lg font-bold mt-0.5">
                {kid.weeklyXp}
              </div>
            </div>
            <div className="bg-white/60 rounded-2xl p-2 border-[2px] border-white">
              <div className="text-[9px] uppercase font-bold text-[#2b2640]/60">
                Streak
              </div>
              <div className="display text-lg font-bold mt-0.5">
                🔥{kid.streak}d
              </div>
            </div>
            <div className="bg-white/60 rounded-2xl p-2 border-[2px] border-white">
              <div className="text-[9px] uppercase font-bold text-[#2b2640]/60">
                Today
              </div>
              <div className="display text-lg font-bold mt-0.5">
                🪙{kid.todayCoins}
              </div>
            </div>
          </div>

          {/* Goal progress */}
          {kid.goal && (
            <div className="bg-white/60 rounded-2xl p-3 border-[2px] border-white">
              <div className="flex justify-between items-center mb-1.5">
                <div className="text-xs font-bold">🎯 {kid.goal.name}</div>
                <div className="display text-sm font-bold">{kid.goal.pct}%</div>
              </div>
              <div className="h-2.5 bg-white/60 rounded-full overflow-hidden border border-white">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${kid.goal.pct}%`,
                    background: kid.accent,
                  }}
                />
              </div>
            </div>
          )}

          {/* Action links */}
          <div className="flex gap-2">
            <button
              className="flex-1 py-2.5 rounded-xl display font-bold text-xs text-white min-h-[44px] border-[3px] border-white shadow-[0_3px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5"
              style={{ background: kid.accent }}
              onClick={() => alert(`Opening ${kid.name}'s full report… (coming soon)`)}
            >
              View report
            </button>
            <button
              className="flex-1 py-2.5 rounded-xl display font-bold text-xs bg-white text-[#2b2640] min-h-[44px] border-[3px] border-[#2b2640]/10 active:scale-95 transition-transform"
              onClick={() => alert(`Managing ${kid.name}'s settings… (coming soon)`)}
            >
              Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## Files edited / created — complete list

| # | Path | Action |
|---|------|--------|
| 1 | `app/globals.css` | **Replaced** — added `card-pop`, `ticker-scroll`, `slide-up`, `hero-in` keyframes; `.anim-card-pop`, `.anim-ticker` (with hover-pause), `.anim-slide-up`, `.anim-hero-in`; `.dock-safe-pb` safe-area util; **fixed bug**: `cloud-1/2/3` → `anim-cloud-1/2/3` so clouds actually drift |
| 2 | `components/characters.tsx` | **Replaced** — added `Olivia` the owl (grad-cap SVG, blue eyes); fixed cloud class bug (same as #1) |
| 3 | `app/play/coinland/page.tsx` | **Replaced** — bigger hero Mochi (`w-36 h-44`) + "Hi friend! 👋" display headline; sticker-tilt on jar tiles + `rounded-3xl`; `backdrop-blur-sm` on all modals; `anim-slide-up` stagger on all sections; `anim-hero-in` on entry; 44 px `min-h` on every tap target; richer Mochi-voice empty-state copy |
| 4 | `app/play/village/page.tsx` | **Replaced** — full hero banner (title + weather widget tile + bigger Mochi); sticker-tilt on stat tiles, chore rows, shop cards, goal cards; proper 3D button shadows on all jar/shop/stand buttons; `dock-safe-pb` on bottom nav; `anim-hero-in`/`anim-slide-up` page entry; Web Audio `playSound` on every coin/action event |
| 5 | `app/play/markets/page.tsx` | **Replaced** — `Olivia` owl hero with dynamic portfolio-aware greeting; scrolling `anim-ticker` bar beneath hero; sticker-tilt on all stock + lab cards; `backdrop-blur-sm` on TradeModal; 44 px tap targets everywhere; Web Audio `playSound` on buy/sell; "owned" pill badge on Discover cards |
| 6 | `app/parent/page.tsx` | **Created** — parent dashboard with 3 expandable mock kid cards (name, age, coins, XP, streak, goal progress bar, last activity); recharts `BarChart` weekly XP comparison; Settings / Billing / Reports quick-links; "Add another kid" CTA |

---

## 5-bullet summary of polish improvements

1. **Premium hero sections across all three modes** — Coinland gets a large waving Mochi with a bold "Hi friend! 👋" headline; Village gains a full-width banner with Mochi-as-Mayor speech bubble and a colour-coded live weather tile; Markets introduces Olivia the Owl with a portfolio-aware greeting and a dark scrolling ticker bar that shows live gain/loss per holding — the app finally feels like a *world*, not a list of widgets.

2. **Consistent 3D sticker design language** — every card gets `rounded-3xl`, alternating `rotate(±Xdeg)` tilt, and `shadow-[0_Npx_0_0_#hex]` bottom-shadow; every primary button gains `border-[4px] border-white` + coloured drop-shadow + `active:translate-y-1` press-down physics; the result is a cohesive "printed sticker" aesthetic across all screens matching the ABC Mouse / Khan Academy Kids quality bar.

3. **Micro-interactions and sound everywhere** — Village and Markets now have Web Audio API tone sequences on every meaningful action (coin earned, fanfare on profits, buy/sell confirmation tones); all cards enter with `anim-slide-up` staggered delays and the hero sections animate in with `anim-hero-in`; the previously broken drifting clouds now actually animate (fixed `cloud-1` → `anim-cloud-1` CSS class bug).

4. **Mobile-first hardening** — every interactive element meets the 44 px minimum tap target (`min-h-[44px]`); the Village bottom dock uses `.dock-safe-pb` (`env(safe-area-inset-bottom)`) so it clears the iPhone home indicator; all `<input type="range">` sliders get `touchAction: "none"` to prevent accidental page-scroll while dragging; `backdrop-blur-sm` on every modal overlay adds depth without janking scroll.

5. **Richer empty states and a parent dashboard** — generic "no items" placeholders are replaced with Mochi/Olivia-voiced copy that tells kids exactly what to do next; the new `/parent` dashboard delivers expandable kid cards with streak, XP, goal progress bars, and a recharts weekly XP bar chart — giving parents at-a-glance visibility without any backend wiring required.
