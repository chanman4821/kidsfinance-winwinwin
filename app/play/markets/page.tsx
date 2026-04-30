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
import { CoinwoodScene, Mochi } from "@/components/characters";
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

  if (!state) return <div className="p-8 text-center">Loading Coinwood Markets…</div>;

  const total = portfolioTotalValue(state);
  const investedValue = total - state.portfolio.cash;
  const totalGain = total - STARTING_CASH;
  const totalGainPct = ((total - STARTING_CASH) / STARTING_CASH) * 100;

  function handleBuy(ticker: string, dollars: number) {
    if (!state) return;
    const r = buy(state, ticker, dollars);
    if (r.error) {
      alert(r.error);
      return;
    }
    setState(r.state);
    setTradeFor(null);
  }
  function handleSell(ticker: string, shares: number) {
    if (!state) return;
    const r = sell(state, ticker, shares);
    if (r.error) {
      alert(r.error);
      return;
    }
    setState(r.state);
    setTradeFor(null);
  }

  return (
    <div className="relative min-h-screen pb-28 bg-transparent">
      <CoinwoodScene />

      <div className="max-w-md mx-auto px-3 pt-3 relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <Link href="/" className="text-xs underline text-[#2b2640]/60 font-bold bungee">← back</Link>
          <div className="display text-xl font-bold flex-1 text-center">📈 Coinwood Markets</div>
          <div className="w-16" />
        </div>

        <div className="bg-white rounded-2xl p-4 border-2 border-slate-900/15 shadow-lg mb-3">
          <div className="text-xs uppercase tracking-wider text-[#2b2640]/60 font-bold bungee">Total Portfolio</div>
          <div className="display text-3xl font-bold leading-none mt-1">
            ${total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
          <div className={`text-sm font-bold mt-1 ${totalGain >= 0 ? "text-[#4fa86c]" : "text-[#cc4f6e]"}`}>
            {totalGain >= 0 ? "▲" : "▼"} ${Math.abs(totalGain).toFixed(2)} ({totalGainPct.toFixed(2)}%) all-time
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="bg-[#d4f4dd] rounded-xl p-2 text-center">
              <div className="text-[10px] uppercase tracking-wider text-[#2b2640]/70 font-bold">Cash</div>
              <div className="display font-bold text-base">${state.portfolio.cash.toFixed(2)}</div>
            </div>
            <div className="bg-[#fff3b0] rounded-xl p-2 text-center">
              <div className="text-[10px] uppercase tracking-wider text-[#2b2640]/70 font-bold">Invested</div>
              <div className="display font-bold text-base">${investedValue.toFixed(2)}</div>
            </div>
          </div>
        </div>

        <div className="flex gap-1 mb-3">
          {(["portfolio", "discover", "labs", "crew"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-xl bungee font-bold text-xs uppercase tracking-wider ${
                tab === t
                  ? "bg-[#5aa9e6] text-white shadow-[0_3px_0_0_#3b80b0]"
                  : "bg-white/70 text-[#2b2640]/60 border border-slate-900/15"
              }`}
            >
              {t === "portfolio" ? "📊 Holdings" : t === "discover" ? "🔍 Discover" : t === "labs" ? "🧪 Labs" : "👥 Crew"}
            </button>
          ))}
        </div>

        {tab === "portfolio" && <Holdings state={state} onTrade={setTradeFor} />}
        {tab === "discover" && <Discover state={state} onTrade={setTradeFor} />}
        {tab === "labs" && <Labs />}
        {tab === "crew" && <CrewPlaceholder />}
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
            const fresh = resetMarkets();
            setState(fresh);
          }
        }}
      >
        reset
      </button>
    </div>
  );
}

function Holdings({ state, onTrade }: { state: MarketsState; onTrade: (ticker: string) => void }) {
  if (state.portfolio.positions.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 text-center border-2 border-slate-900/15 shadow-lg">
        <div className="w-32 h-36 mx-auto">
          <Mochi className="w-full h-full" mood="happy" />
        </div>
        <div className="display text-xl mt-2">Your portfolio is empty</div>
        <div className="text-sm text-[#2b2640]/70 mt-1">
          Tap <strong>🔍 Discover</strong> to find stocks. Start with companies you know!
        </div>
        <div className="text-xs text-[#2b2640]/50 mt-3 italic">
          You have <strong>${state.portfolio.cash.toFixed(2)}</strong> of play money to invest. Real-world prices, no real risk.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {state.portfolio.positions.map((p) => {
        const stock = STOCKS.find((s) => s.ticker === p.ticker)!;
        const value = positionValue(p, state.prices);
        const gain = positionGain(p, state.prices);
        const price = state.prices[p.ticker];
        return (
          <button
            key={p.ticker}
            onClick={() => onTrade(p.ticker)}
            className="w-full bg-white rounded-2xl p-3 border-2 border-slate-900/15 shadow-lg flex items-center gap-3 active:scale-95 transition-transform text-left"
          >
            <div className="text-4xl shrink-0">{stock.emoji}</div>
            <div className="flex-1 min-w-0">
              <div className="display font-bold text-base leading-tight truncate">{stock.name}</div>
              <div className="text-[10px] text-[#2b2640]/60 font-bold uppercase">{p.ticker} · {p.shares.toFixed(2)} sh</div>
              <div className={`text-xs font-bold mt-0.5 ${gain.abs >= 0 ? "text-[#4fa86c]" : "text-[#cc4f6e]"}`}>
                {gain.abs >= 0 ? "▲" : "▼"} ${Math.abs(gain.abs).toFixed(2)} ({gain.pct.toFixed(2)}%)
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="display font-bold text-base">${value.toFixed(2)}</div>
              <div className="text-[10px] text-[#2b2640]/60 font-bold">@ ${price.toFixed(2)}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function Discover({ state, onTrade }: { state: MarketsState; onTrade: (ticker: string) => void }) {
  return (
    <div className="space-y-2">
      <div className="bg-yellow-100 rounded-2xl p-3 border-2 border-slate-900/15 shadow text-xs text-[#2b2640]/80">
        💡 <strong>Tip:</strong> Invest in companies you know and use. Coca-Cola, Disney, Apple, Roblox — these are real companies you interact with every day.
      </div>
      {STOCKS.map((s) => {
        const price = state.prices[s.ticker];
        const history = state.priceHistory[s.ticker] ?? [];
        const day1 = history[Math.max(0, history.length - 30)]?.close ?? price;
        const change30d = ((price - day1) / day1) * 100;
        return (
          <button
            key={s.ticker}
            onClick={() => onTrade(s.ticker)}
            className="w-full bg-white rounded-2xl p-3 border-2 border-slate-900/15 shadow flex items-center gap-3 active:scale-95 transition-transform text-left"
          >
            <div className="text-4xl shrink-0">{s.emoji}</div>
            <div className="flex-1 min-w-0">
              <div className="display font-bold text-base leading-tight">{s.name}</div>
              <div className="text-[10px] text-[#2b2640]/60 font-bold uppercase">{s.ticker} · {s.sector}</div>
              <div className="text-[11px] text-[#2b2640]/70 line-clamp-2 mt-0.5">{s.blurb}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="display font-bold text-base">${price.toFixed(2)}</div>
              <div className={`text-[10px] font-bold ${change30d >= 0 ? "text-[#4fa86c]" : "text-[#cc4f6e]"}`}>
                {change30d >= 0 ? "▲" : "▼"} {Math.abs(change30d).toFixed(2)}% 30d
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function Labs() {
  const [contrib, setContrib] = useState(50);
  const [years, setYears] = useState(30);
  const [rate, setRate] = useState(8);

  const fv = useMemo(() => compoundFutureValue(contrib, years, rate, 0), [contrib, years, rate]);
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
    return { months, years: (months / 12).toFixed(1), totalPaid: totalPaid.toFixed(2), interestPaid: (totalPaid - 500).toFixed(2) };
  }, []);

  return (
    <div className="space-y-3">
      <div className="bg-white rounded-2xl p-4 border-2 border-slate-900/15 shadow-lg">
        <div className="display text-lg mb-1 flex items-center gap-2">🧪 Compound Interest Lab</div>
        <div className="text-xs text-[#2b2640]/70 mb-3">See how saving a little every month grows over time.</div>

        <div className="space-y-3">
          <SliderRow label="Save per month" value={contrib} min={5} max={500} step={5} prefix="$" onChange={setContrib} />
          <SliderRow label="For how many years" value={years} min={1} max={50} step={1} suffix=" yr" onChange={setYears} />
          <SliderRow label="Average yearly return" value={rate} min={0} max={15} step={0.5} suffix="%" onChange={setRate} />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="bg-[#fff3b0] rounded-xl p-2">
            <div className="text-[10px] uppercase font-bold text-[#2b2640]/70">You put in</div>
            <div className="display text-sm font-bold mt-1">${totalContributed.toLocaleString()}</div>
          </div>
          <div className="bg-[#d4f4dd] rounded-xl p-2">
            <div className="text-[10px] uppercase font-bold text-[#2b2640]/70">Interest</div>
            <div className="display text-sm font-bold mt-1 text-[#4fa86c]">+${interestEarned.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          </div>
          <div className="bg-[#5aa9e6] text-white rounded-xl p-2">
            <div className="text-[10px] uppercase font-bold opacity-80">Final value</div>
            <div className="display text-sm font-bold mt-1">${fv.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          </div>
        </div>

        <div className="mt-3 p-3 bg-yellow-100 rounded-xl text-xs text-[#2b2640]/80 italic">
          💡 If you start <strong>10 years earlier</strong>, you&apos;d have ${(compoundFutureValue(contrib, years + 10, rate, 0) - fv).toLocaleString(undefined, { maximumFractionDigits: 0 })} MORE money. <strong>Time</strong> is the magic.
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border-2 border-slate-900/15 shadow-lg">
        <div className="display text-lg mb-1 flex items-center gap-2">💳 Credit Card Trap</div>
        <div className="text-xs text-[#2b2640]/70 mb-3">What happens if you spend $500 on a credit card and only pay the minimum each month?</div>

        <div className="bg-[#fed7aa]/60 rounded-xl p-3">
          <div className="grid grid-cols-2 gap-2 text-center">
            <div>
              <div className="text-[10px] uppercase font-bold text-[#2b2640]/70">Time to pay off</div>
              <div className="display text-2xl font-bold text-[#cc4f6e]">{creditMonths.years} yrs</div>
              <div className="text-[10px] text-[#2b2640]/60">({creditMonths.months} months)</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-[#2b2640]/70">Total interest paid</div>
              <div className="display text-2xl font-bold text-[#cc4f6e]">${creditMonths.interestPaid}</div>
              <div className="text-[10px] text-[#2b2640]/60">on a $500 purchase</div>
            </div>
          </div>
        </div>

        <div className="mt-3 p-3 bg-[#d4f4dd]/60 rounded-xl text-xs text-[#2b2640]/80 italic">
          💡 At 22% APR, paying only the minimum turns a $500 charge into ${creditMonths.totalPaid}. <strong>Always pay your balance in full.</strong>
        </div>
      </div>
    </div>
  );
}

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
        <div className="display text-base font-bold">
          {prefix}{value}{suffix}
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
      />
    </div>
  );
}

function CrewPlaceholder() {
  return (
    <div className="bg-white rounded-2xl p-6 text-center border-2 border-slate-900/15 shadow-lg">
      <div className="text-6xl mb-3">👥</div>
      <div className="display text-xl">Investment Crews — Coming Soon</div>
      <div className="text-sm text-[#2b2640]/70 mt-2">
        Start a Crew with 2-8 friends. Share your portfolio, see what they&apos;re buying, and discuss strategies. Parent-approved on both sides — totally safe.
      </div>
      <div className="mt-4 p-3 bg-yellow-100 rounded-xl text-xs text-left">
        <strong>What you&apos;ll be able to do:</strong>
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>Share &quot;why I bought&quot; notes (predefined safe phrases only)</li>
          <li>Weekly Crew Report from Owl Olivia explaining what worked</li>
          <li>Monthly Crew Tournament — best portfolio of the month</li>
          <li>Family-only — no strangers, no chat, no DMs</li>
        </ul>
      </div>
    </div>
  );
}

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
  const change30 = recent30.length > 1 ? ((price - recent30[0].close) / recent30[0].close) * 100 : 0;

  const sellShares = position ? Math.min(position.shares, amount / price) : 0;

  return (
    <div className="fixed inset-0 bg-[#2b2640]/50 flex items-end sm:items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-3xl p-5 max-w-md w-full max-h-[85vh] overflow-y-auto border-2 border-slate-900/15 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="text-5xl">{stock.emoji}</div>
          <div className="flex-1">
            <div className="display text-xl font-bold leading-tight">{stock.name}</div>
            <div className="text-xs text-[#2b2640]/60 font-bold">{stock.ticker} · {stock.sector}</div>
          </div>
          <button onClick={onClose} className="text-[#2b2640]/40 text-3xl w-10 h-10">×</button>
        </div>

        <div className="bg-white rounded-2xl p-3 mb-3 border border-slate-900/15/30">
          <div className="flex items-baseline gap-2">
            <div className="display text-3xl font-bold">${price.toFixed(2)}</div>
            <div className={`text-sm font-bold ${change30 >= 0 ? "text-[#4fa86c]" : "text-[#cc4f6e]"}`}>
              {change30 >= 0 ? "▲" : "▼"} {Math.abs(change30).toFixed(2)}% (30d)
            </div>
          </div>
          <Sparkline data={recent30.map((h) => h.close)} positive={change30 >= 0} />
          <div className="text-xs text-[#2b2640]/70 mt-2">{stock.blurb}</div>
        </div>

        {position && (
          <div className="bg-[#d4f4dd] rounded-2xl p-3 mb-3 border border-slate-900/15 text-xs">
            <strong>You own {position.shares.toFixed(2)} shares</strong> · avg cost ${position.avgCost.toFixed(2)} · worth ${(position.shares * price).toFixed(2)}
          </div>
        )}

        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setSide("buy")}
            className={`flex-1 py-3 rounded-xl bungee font-bold ${side === "buy" ? "bg-[#6ad48b] text-white shadow shadow-blue-900/10" : "bg-white border border-slate-900/15/30"}`}
          >
            Buy
          </button>
          <button
            disabled={!position}
            onClick={() => setSide("sell")}
            className={`flex-1 py-3 rounded-xl bungee font-bold ${
              side === "sell" ? "bg-[#fb923c] text-white shadow-[0_3px_0_0_#9a3412]" : "bg-white border border-slate-900/15/30 disabled:opacity-40"
            }`}
          >
            Sell
          </button>
        </div>

        <div className="mb-3">
          <div className="flex justify-between mb-2">
            <div className="text-xs font-bold text-[#2b2640]/70">{side === "buy" ? "Amount to buy" : "Amount to sell"}</div>
            <div className="display text-lg font-bold">${amount}</div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[25, 100, 500, 1000].map((n) => (
              <button
                key={n}
                onClick={() => setAmount(n)}
                disabled={side === "buy" ? n > state.portfolio.cash : n > (position ? position.shares * price : 0)}
                className={`py-2 rounded-xl bungee font-bold text-sm ${
                  amount === n ? "bg-[#5aa9e6] text-white" : "bg-white border border-slate-900/15/30"
                } disabled:opacity-30`}
              >
                ${n}
              </button>
            ))}
          </div>
          <div className="text-xs text-[#2b2640]/60 mt-2 font-bold">
            {side === "buy"
              ? `≈ ${(amount / price).toFixed(4)} shares · You have $${state.portfolio.cash.toFixed(2)}`
              : `≈ ${sellShares.toFixed(4)} shares`}
          </div>
        </div>

        <button
          onClick={() => (side === "buy" ? onBuy(ticker, amount) : onSell(ticker, sellShares))}
          className={`w-full py-3 rounded-full bungee font-bold text-white text-lg border-2 border-slate-900/15 shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-[0_1px_0_0_rgba(0,0,0,0.2)] ${
            side === "buy" ? "bg-[#6ad48b]" : "bg-[#fb923c]"
          }`}
        >
          {side === "buy" ? `Buy $${amount} of ${ticker}` : `Sell ${sellShares.toFixed(2)} shares`}
        </button>
      </div>
    </div>
  );
}

function Sparkline({ data, positive }: { data: number[]; positive: boolean }) {
  if (data.length < 2) return null;
  const w = 280;
  const h = 60;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-12 mt-2">
      <polyline points={points} fill="none" stroke={positive ? "#4fa86c" : "#cc4f6e"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
