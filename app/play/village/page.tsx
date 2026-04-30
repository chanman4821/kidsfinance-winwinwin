"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  buyInventory,
  buyShop,
  CHORES,
  ChoreV,
  collectShopIncome,
  dailyShopIncome,
  newVillageState,
  openStand,
  pickWeather,
  PRODUCTS,
  setPrice,
  setProduct,
  SHOPS,
  upgradeStand,
  VILLAGE_STORAGE,
  VillageState,
  Weather,
} from "@/lib/village";
import { CoinwoodScene, Mochi } from "@/components/characters";

type Tab = "home" | "stand" | "shops" | "goals" | "pet";

const WEATHER_EMOJI: Record<Weather, string> = { sunny: "☀️", cloudy: "☁️", rainy: "🌧️" };

function loadVillage(): VillageState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(VILLAGE_STORAGE);
    return raw ? (JSON.parse(raw) as VillageState) : null;
  } catch {
    return null;
  }
}

function saveVillage(s: VillageState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(VILLAGE_STORAGE, JSON.stringify(s));
}

export default function VillagePage() {
  const [state, setState] = useState<VillageState | null>(null);
  const [tab, setTab] = useState<Tab>("home");
  const [doneChores, setDoneChores] = useState<Set<string>>(new Set());
  const [confetti, setConfetti] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setState(loadVillage());
  }, []);

  useEffect(() => {
    if (state) saveVillage(state);
  }, [state]);

  if (!state) return <Onboarding onStart={(s) => setState(s)} />;

  function fireToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  function fireConfetti() {
    setConfetti(true);
    setTimeout(() => setConfetti(false), 1300);
  }

  function doChore(c: ChoreV) {
    if (!state || doneChores.has(c.id)) return;
    setState({ ...state, coins: state.coins + c.coins, xp: state.xp + c.coins });
    setDoneChores(new Set([...doneChores, c.id]));
    fireConfetti();
    fireToast(`+${c.coins} coins! 🪙`);
  }

  function moveToJar(jar: keyof VillageState["jars"], amount: number) {
    if (!state || amount > state.coins) return;
    setState({
      ...state,
      coins: state.coins - amount,
      jars: { ...state.jars, [jar]: state.jars[jar] + amount },
    });
    fireToast(`Moved ${amount} to ${jar}!`);
  }

  function handleBuyInventory(units: number) {
    if (!state) return;
    const r = buyInventory(state, units);
    if (r.error) fireToast(r.error);
    else {
      setState(r.state);
      fireToast(`Made ${units} cups!`);
    }
  }

  function handleOpenStand() {
    if (!state) return;
    if (state.stand.inventoryUnits === 0) {
      fireToast("Buy ingredients first!");
      return;
    }
    const next = openStand(state);
    setState(next);
    fireConfetti();
    const last = next.stand.history[next.stand.history.length - 1];
    fireToast(`Sold ${last.sold} cups · profit ${last.profit > 0 ? "+" : ""}${last.profit}`);
  }

  function handleSetPrice(p: number) {
    if (!state) return;
    setState(setPrice(state, p));
  }

  function handleUpgradeStand() {
    if (!state) return;
    const r = upgradeStand(state);
    if (r.error) fireToast(r.error);
    else {
      setState(r.state);
      fireConfetti();
      fireToast(`Stand upgraded to lvl ${r.state.stand.level}!`);
    }
  }

  function handleSetProduct(p: keyof typeof PRODUCTS) {
    if (!state) return;
    const r = setProduct(state, p);
    if (r.error) fireToast(r.error);
    else setState(r.state);
  }

  function handleBuyShop(shopId: string) {
    if (!state) return;
    const r = buyShop(state, shopId);
    if (r.error) fireToast(r.error);
    else {
      setState(r.state);
      fireConfetti();
      fireToast(`Bought ${SHOPS.find((s) => s.id === shopId)?.name}!`);
    }
  }

  function handleCollectShops() {
    if (!state) return;
    const income = dailyShopIncome(state);
    if (income === 0) {
      fireToast("Buy a shop first!");
      return;
    }
    setState(collectShopIncome(state));
    fireConfetti();
    fireToast(`Collected ${income} coins from your shops!`);
  }

  return (
    <div className="relative min-h-screen pb-28 bg-transparent">
      <CoinwoodScene />

      {/* Header */}
      <div className="max-w-md mx-auto px-3 pt-3 relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <Link href="/" className="text-xs underline text-[#2b2640]/60 font-bold bungee">
            ← back
          </Link>
          <div className="display text-xl font-bold flex-1 text-center">🏘️ Coinwood Village</div>
          <div className="w-12 text-right">
            <div className="text-lg">{WEATHER_EMOJI[state.stand.todayWeather]}</div>
          </div>
        </div>

        {/* Mochi greeting */}
        <div className="flex items-end gap-2 mb-3">
          <div className="w-20 h-24 anim-float">
            <Mochi className="w-full h-full" mood="happy" />
          </div>
          <div className="bg-white rounded-2xl px-3 py-2 self-center mt-1 shadow-[0_4px_0_0_black] border-[4px] border-black flex-1 relative">
            <div className="absolute -left-3 top-3 w-0 h-0 border-y-[8px] border-y-transparent border-r-[10px] border-r-white" />
            <div className="absolute -left-[14px] top-[10px] w-0 h-0 border-y-[10px] border-y-transparent border-r-[12px] border-r-[#2b2640]" />
            <div className="text-[10px] text-[#2b2640]/60 font-bold uppercase">Mayor Mochi</div>
            <div className="text-xs font-bold leading-tight">
              {state.stand.todayWeather === "sunny" && "Sunny day! Perfect for the lemonade stand 🍋"}
              {state.stand.todayWeather === "cloudy" && "Cloudy today — fewer customers but it's still a good day."}
              {state.stand.todayWeather === "rainy" && "It's raining — maybe focus on chores or a lesson today."}
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          <Stat icon="🪙" label="Coins" value={state.coins} bg="bg-[#fff3b0]" />
          <Stat icon="🐷" label="Save" value={state.jars.save} bg="bg-[#d4f4dd]" />
          <Stat icon="🍭" label="Spend" value={state.jars.spend} bg="bg-[#fed7aa]" />
          <Stat icon="❤️" label="Give" value={state.jars.give} bg="bg-[#ffe4a3]" />
        </div>

        {/* Tab content */}
        {tab === "home" && (
          <HomeTab state={state} doneChores={doneChores} onChore={doChore} onMove={moveToJar} />
        )}
        {tab === "stand" && (
          <StandTab
            state={state}
            onBuyInventory={handleBuyInventory}
            onSetPrice={handleSetPrice}
            onSetProduct={handleSetProduct}
            onOpen={handleOpenStand}
            onUpgrade={handleUpgradeStand}
          />
        )}
        {tab === "shops" && <ShopsTab state={state} onBuy={handleBuyShop} onCollect={handleCollectShops} />}
        {tab === "goals" && <GoalsTab state={state} setState={setState} />}
        {tab === "pet" && <PetTab state={state} />}
      </div>

      {confetti && <Confetti />}
      {toast && <Toast msg={toast} />}

      {/* Bottom dock */}
      <nav className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur border-t-[3px] border-white shadow-[0_-4px_12px_rgba(0,0,0,0.08)] z-30">
        <div className="max-w-md mx-auto flex">
          {([
            { id: "home", emoji: "🏠", label: "Home" },
            { id: "stand", emoji: "🍋", label: "Stand" },
            { id: "shops", emoji: "🏪", label: "Shops" },
            { id: "goals", emoji: "🎯", label: "Goals" },
            { id: "pet", emoji: "🐰", label: "Pet" },
          ] as { id: Tab; emoji: string; label: string }[]).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-3 flex flex-col items-center gap-0.5 ${
                tab === t.id ? "text-[#2b2640] bg-[#fff3b0]" : "text-[#2b2640]/50"
              } transition-colors`}
            >
              <div className={`text-2xl ${tab === t.id ? "scale-125" : ""} transition-transform`}>{t.emoji}</div>
              <div className="display text-[9px] uppercase tracking-wider font-bold">{t.label}</div>
            </button>
          ))}
        </div>
      </nav>

      <button
        className="fixed top-2 right-2 text-[10px] text-[#2b2640]/40 underline z-30"
        onClick={() => {
          if (confirm("Reset Village progress?")) {
            localStorage.removeItem(VILLAGE_STORAGE);
            setState(null);
            setDoneChores(new Set());
          }
        }}
      >
        reset
      </button>
    </div>
  );
}

/* ===== Onboarding ===== */
function Onboarding({ onStart }: { onStart: (s: VillageState) => void }) {
  const [name, setName] = useState("");
  return (
    <div className="relative min-h-screen bg-transparent">
      <CoinwoodScene />
      <div className="max-w-md mx-auto px-6 pt-12 pb-12 relative z-10">
        <div className="text-center mb-6">
          <div className="w-40 h-44 mx-auto anim-float">
            <Mochi className="w-full h-full" mood="wave" />
          </div>
          <h1 className="display text-3xl font-bold mt-2">Welcome to Coinwood Village!</h1>
          <p className="text-sm text-[#2b2640]/70 mt-2 px-4">
            You&apos;re a new resident. Let&apos;s set up your home and meet the townsfolk.
          </p>
        </div>
        <div className="bg-white rounded-3xl p-5 border-[5px] border-black shadow-2xl space-y-4">
          <label className="block">
            <div className="display text-xs uppercase tracking-wider mb-1 font-bold">Your name</div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Type your name"
              className="w-full px-4 py-3 rounded-2xl border-[4px] border-black/20 bg-white focus:outline-none focus:border-[#5aa9e6] text-lg"
            />
          </label>
          <button
            disabled={!name.trim()}
            onClick={() => onStart(newVillageState(name.trim()))}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full text-lg font-bold text-white bg-[#5aa9e6] border-[5px] border-black shadow-[0_8px_0_0_black] active:translate-y-1 active:shadow-[0_2px_0_0_black] disabled:opacity-50 bungee"
          >
            Move to Coinwood 🏠
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===== HOME TAB: chores + jar transfers ===== */
function HomeTab({
  state,
  doneChores,
  onChore,
  onMove,
}: {
  state: VillageState;
  doneChores: Set<string>;
  onChore: (c: ChoreV) => void;
  onMove: (jar: keyof VillageState["jars"], amount: number) => void;
}) {
  const undone = CHORES.filter((c) => !doneChores.has(c.id));
  return (
    <div className="space-y-3">
      <div className="bg-white rounded-2xl p-3 border-[4px] border-black shadow-lg">
        <div className="display text-base mb-2 flex items-center gap-2">
          <span className="text-2xl">✅</span> Today&apos;s chores
        </div>
        {undone.length === 0 ? (
          <div className="text-sm text-[#2b2640]/60 italic text-center py-3">
            All chores done! 🎉 Try the Lemonade Stand or buy a shop.
          </div>
        ) : (
          <div className="space-y-2">
            {undone.slice(0, 5).map((c) => (
              <button
                key={c.id}
                onClick={() => onChore(c)}
                className="w-full flex items-center gap-3 p-3 bg-white rounded-2xl border-[3px] border-black/30 active:scale-95 hover:border-blue-600 transition-all text-left"
              >
                <div className="text-3xl">{c.emoji}</div>
                <div className="flex-1">
                  <div className="font-bold text-sm">{c.title}</div>
                  <div className="text-[10px] text-[#2b2640]/60 font-bold">🪙 +{c.coins}</div>
                </div>
                <div className="bg-[#6ad48b] text-white px-3 py-1.5 rounded-full bungee text-xs font-bold">Done!</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {state.coins > 0 && (
        <div className="bg-white rounded-2xl p-3 border-[4px] border-black shadow-lg">
          <div className="display text-base mb-1 flex items-center gap-2">
            <span className="text-2xl">🫙</span> Move coins to jars
          </div>
          <div className="text-xs text-[#2b2640]/70 mb-3">
            You have <strong>🪙 {state.coins}</strong> in your wallet. Move some to Save, Spend, or Give.
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onMove("save", Math.min(5, state.coins))}
              disabled={state.coins < 1}
              className="bg-[#6ad48b] text-white py-2 rounded-xl bungee font-bold text-xs disabled:opacity-40 active:scale-95"
            >
              🐷 +5 Save
            </button>
            <button
              onClick={() => onMove("spend", Math.min(5, state.coins))}
              disabled={state.coins < 1}
              className="bg-[#fb923c] text-white py-2 rounded-xl bungee font-bold text-xs disabled:opacity-40 active:scale-95"
            >
              🍭 +5 Spend
            </button>
            <button
              onClick={() => onMove("give", Math.min(5, state.coins))}
              disabled={state.coins < 1}
              className="bg-[#ffd84d] text-[#2b2640] py-2 rounded-xl bungee font-bold text-xs disabled:opacity-40 active:scale-95"
            >
              ❤️ +5 Give
            </button>
          </div>
          <button
            onClick={() => {
              const total = state.coins;
              const s = Math.round(total * 0.5);
              const g = Math.round(total * 0.2);
              const sp = total - s - g;
              onMove("save", s);
              setTimeout(() => onMove("give", g), 50);
              setTimeout(() => onMove("spend", sp), 100);
            }}
            disabled={state.coins < 5}
            className="mt-2 w-full bg-[#5aa9e6] text-white py-2 rounded-xl bungee font-bold text-xs disabled:opacity-40 active:scale-95"
          >
            ✨ Smart split: 50% Save · 30% Spend · 20% Give
          </button>
        </div>
      )}
    </div>
  );
}

/* ===== STAND TAB: Lemonade Stand mini-game ===== */
function StandTab({
  state,
  onBuyInventory,
  onSetPrice,
  onSetProduct,
  onOpen,
  onUpgrade,
}: {
  state: VillageState;
  onBuyInventory: (n: number) => void;
  onSetPrice: (p: number) => void;
  onSetProduct: (p: keyof typeof PRODUCTS) => void;
  onOpen: () => void;
  onUpgrade: () => void;
}) {
  const lastDay = state.stand.history[state.stand.history.length - 1];
  const product = PRODUCTS[state.stand.product];
  const upgradeCost = state.stand.level * 80;
  return (
    <div className="space-y-3">
      <div className="bg-white rounded-2xl p-4 border-[4px] border-black shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <div className="text-3xl">{product.emoji}</div>
          <div className="flex-1">
            <div className="display text-lg font-bold leading-tight capitalize">{state.stand.product} Stand</div>
            <div className="text-[10px] text-[#2b2640]/60 font-bold">
              Lvl {state.stand.level} · Day {state.stand.daysOpen} · {WEATHER_EMOJI[state.stand.todayWeather]} {state.stand.todayWeather}
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-yellow-100 rounded-xl p-3 mb-3">
          <div className="flex justify-between items-center mb-2">
            <div className="text-xs font-bold text-[#2b2640]/70">Set price (per cup)</div>
            <div className="display text-2xl font-bold">🪙 {state.stand.price}</div>
          </div>
          <input
            type="range"
            min={1}
            max={15}
            value={state.stand.price}
            onChange={(e) => onSetPrice(parseInt(e.target.value))}
            className="w-full accent-[#fb923c]"
          />
          <div className="text-[10px] text-[#2b2640]/60 mt-1">
            Cost per cup: 🪙 {product.unitCost} · Profit per cup: 🪙 {state.stand.price - product.unitCost}
          </div>
        </div>

        {/* Inventory */}
        <div className="bg-[#d4f4dd]/60 rounded-xl p-3 mb-3">
          <div className="flex justify-between items-center mb-2">
            <div className="text-xs font-bold text-[#2b2640]/70">Inventory ready</div>
            <div className="display text-xl font-bold">{state.stand.inventoryUnits} cups</div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[5, 10, 20].map((n) => (
              <button
                key={n}
                onClick={() => onBuyInventory(n)}
                disabled={state.coins < n * product.unitCost}
                className="bg-[#6ad48b] text-white py-2 rounded-xl bungee font-bold text-xs disabled:opacity-40 active:scale-95"
              >
                Make {n}
                <div className="text-[9px] opacity-80">🪙 {n * product.unitCost}</div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onOpen}
          disabled={state.stand.inventoryUnits === 0}
          className="w-full py-4 rounded-full bungee font-bold text-white text-lg bg-[#fb923c] border-[4px] border-black shadow-[0_8px_0_0_black] active:translate-y-1 active:shadow-[0_2px_0_0_black] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          🚀 Open the stand!
        </button>
      </div>

      {/* Last day report */}
      {lastDay && (
        <div className="bg-white rounded-2xl p-3 border-[4px] border-black shadow-lg">
          <div className="display text-sm font-bold mb-2 flex items-center gap-2">
            <span className="text-xl">📊</span> Day {lastDay.day} report
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-[#fff3b0] rounded-lg p-2">
              <div className="text-[9px] uppercase font-bold text-[#2b2640]/70">Sold</div>
              <div className="display text-lg font-bold">{lastDay.sold}</div>
            </div>
            <div className="bg-[#cfe7ff] rounded-lg p-2">
              <div className="text-[9px] uppercase font-bold text-[#2b2640]/70">Revenue</div>
              <div className="display text-lg font-bold">🪙{lastDay.revenue}</div>
            </div>
            <div className={`${lastDay.profit >= 0 ? "bg-[#d4f4dd]" : "bg-[#fed7aa]"} rounded-lg p-2`}>
              <div className="text-[9px] uppercase font-bold text-[#2b2640]/70">Profit</div>
              <div className="display text-lg font-bold">{lastDay.profit >= 0 ? "+" : ""}🪙{lastDay.profit}</div>
            </div>
          </div>
          <div className="text-[10px] text-[#2b2640]/60 mt-2 italic">
            💡 {lastDay.profit > 0 ? "Profit means you made money!" : lastDay.profit === 0 ? "Break-even — try a different price." : "Loss — your costs were higher than what you sold for."}
          </div>
        </div>
      )}

      {/* Products + upgrade */}
      <div className="bg-white rounded-2xl p-3 border-[4px] border-black shadow-lg">
        <div className="display text-sm font-bold mb-2">🛒 Products & upgrades</div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          {(Object.keys(PRODUCTS) as (keyof typeof PRODUCTS)[]).map((p) => {
            const meta = PRODUCTS[p];
            const locked = meta.unlockLevel > state.stand.level;
            const active = state.stand.product === p;
            return (
              <button
                key={p}
                onClick={() => onSetProduct(p)}
                disabled={locked}
                className={`p-2 rounded-xl border-2 ${
                  active
                    ? "bg-[#fff3b0] border-[#ccaa3d]"
                    : locked
                    ? "bg-[#2b2640]/5 border-[#2b2640]/10 opacity-50"
                    : "bg-white border-[#2b2640]/10 hover:border-blue-600"
                } text-left transition-all`}
              >
                <div className="text-2xl">{meta.emoji}</div>
                <div className="display font-bold text-xs capitalize">{p}</div>
                <div className="text-[10px] text-[#2b2640]/60">
                  {locked ? `🔒 lvl ${meta.unlockLevel}` : `cost 🪙${meta.unitCost}`}
                </div>
              </button>
            );
          })}
        </div>
        <button
          onClick={onUpgrade}
          disabled={state.coins < upgradeCost || state.stand.level >= 4}
          className="w-full bg-[#5aa9e6] text-white py-2 rounded-xl bungee font-bold text-xs disabled:opacity-40 active:scale-95"
        >
          ⬆️ Upgrade stand to lvl {state.stand.level + 1} · 🪙 {upgradeCost}
        </button>
      </div>
    </div>
  );
}

/* ===== SHOPS TAB: passive income ===== */
function ShopsTab({
  state,
  onBuy,
  onCollect,
}: {
  state: VillageState;
  onBuy: (id: string) => void;
  onCollect: () => void;
}) {
  const owned = state.shopsOwned;
  const dailyTotal = dailyShopIncome(state);
  return (
    <div className="space-y-3">
      <div className="bg-yellow-100 rounded-2xl p-3 border-[4px] border-black shadow text-xs text-[#2b2640]/80">
        💡 <strong>Buy a shop = passive income.</strong> Each shop pays you coins every day, even when you&apos;re not playing. Take more lessons → shops pay even more!
      </div>

      {owned.length > 0 && (
        <div className="bg-[#d4f4dd] rounded-2xl p-3 border-[4px] border-black shadow-lg">
          <div className="display text-sm font-bold mb-1">Your shops earn</div>
          <div className="display text-3xl font-bold">🪙 {dailyTotal}/day</div>
          <button
            onClick={onCollect}
            className="mt-2 w-full bg-[#4fa86c] text-white py-3 rounded-full bungee font-bold text-base active:scale-95 shadow-[0_8px_0_0_black]"
          >
            💰 Collect today&apos;s coins
          </button>
        </div>
      )}

      <div className="space-y-2">
        {SHOPS.map((s) => {
          const isOwned = owned.includes(s.id);
          return (
            <div
              key={s.id}
              className={`bg-white rounded-2xl p-3 border-[4px] border-black shadow-lg flex items-center gap-3 ${
                isOwned ? "ring-2 ring-[#6ad48b]" : ""
              }`}
            >
              <div className="text-4xl shrink-0">{s.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="display font-bold text-base leading-tight">{s.name}</div>
                <div className="text-[11px] text-[#2b2640]/70 line-clamp-2">{s.description}</div>
                <div className="text-[10px] text-[#2b2640]/60 font-bold mt-0.5">
                  💸 {s.basePassive} coins/day
                </div>
              </div>
              {isOwned ? (
                <div className="text-2xl">✅</div>
              ) : (
                <button
                  onClick={() => onBuy(s.id)}
                  disabled={state.coins < s.cost}
                  className="bg-[#5aa9e6] text-white px-3 py-2 rounded-full bungee font-bold text-xs disabled:opacity-40 shrink-0"
                >
                  🪙 {s.cost}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ===== GOALS TAB ===== */
const GOAL_PRESETS = [
  { name: "Lego set", emoji: "🧱", target: 50 },
  { name: "New book", emoji: "📚", target: 30 },
  { name: "Video game", emoji: "🎮", target: 100 },
  { name: "Skateboard", emoji: "🛹", target: 150 },
  { name: "Stuffed animal", emoji: "🧸", target: 40 },
  { name: "Bike", emoji: "🚲", target: 300 },
];

function GoalsTab({ state, setState }: { state: VillageState; setState: (s: VillageState) => void }) {
  return (
    <div className="space-y-3">
      <div className="bg-yellow-100 rounded-2xl p-3 border-[4px] border-black shadow text-xs">
        💡 <strong>Set a goal you&apos;re saving for.</strong> Every coin in your Save jar gets you closer!
      </div>

      {state.goal && (
        <div className="bg-[#d4f4dd] rounded-2xl p-4 border-[4px] border-black shadow-lg">
          <div className="display text-xs uppercase tracking-wider font-bold text-[#2b2640]/70">CURRENT GOAL</div>
          <div className="flex items-center gap-3 mt-1">
            <div className="text-5xl">{state.goal.emoji}</div>
            <div className="flex-1">
              <div className="display text-xl font-bold leading-tight">{state.goal.name}</div>
              <div className="text-sm font-bold mt-1">
                🪙 {state.jars.save} / {state.goal.target}
              </div>
              <div className="mt-2 h-3 bg-white/60 rounded-full overflow-hidden border-[3px] border-black">
                <div
                  className="h-full bg-[#4fa86c] transition-all duration-500"
                  style={{ width: `${Math.min(100, (state.jars.save / state.goal.target) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {GOAL_PRESETS.map((g) => (
          <button
            key={g.name}
            onClick={() => setState({ ...state, goal: { name: g.name, emoji: g.emoji, target: g.target } })}
            className="bg-white rounded-2xl p-3 border-[4px] border-black shadow active:scale-95 transition-transform text-left"
          >
            <div className="text-4xl mb-1">{g.emoji}</div>
            <div className="display font-bold text-sm">{g.name}</div>
            <div className="text-[11px] text-[#2b2640]/60 font-bold">🪙 {g.target}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ===== PET TAB ===== */
function PetTab({ state }: { state: VillageState }) {
  const stage = Math.min(3, Math.floor(state.xp / 100));
  const stageName = ["Egg", "Baby", "Young", "Adult"][stage];
  const stageEmoji = ["🥚", "🐣", "🐰", "🐰✨"][stage];
  const next = (stage + 1) * 100;
  const pct = (state.xp % 100);
  return (
    <div className="space-y-3">
      <div className="bg-white rounded-2xl p-6 border-[4px] border-black shadow-lg text-center">
        <div className="text-8xl my-4 anim-float">{stageEmoji}</div>
        <div className="display text-2xl font-bold">{state.petName}</div>
        <div className="text-xs text-[#2b2640]/60 font-bold uppercase tracking-wider">{stageName} stage</div>
        {stage < 3 && (
          <>
            <div className="mt-3 h-3 bg-[#2b2640]/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#fb923c] transition-all" style={{ width: `${pct}%` }} />
            </div>
            <div className="text-[10px] text-[#2b2640]/60 mt-1">
              {state.xp % 100} / 100 XP to next stage
            </div>
          </>
        )}
        {stage === 3 && (
          <div className="text-sm text-[#2b2640]/70 mt-2 italic">{state.petName} is fully grown! 🌟</div>
        )}
      </div>

      <div className="bg-yellow-100 rounded-2xl p-3 border-[3px] border-black text-xs text-[#2b2640]/80">
        💡 Your pet evolves as you earn XP. Do chores, sell lemonade, take lessons — every action helps {state.petName} grow.
      </div>
    </div>
  );
}

/* ===== HUD bits ===== */
function Stat({ icon, label, value, bg }: { icon: string; label: string; value: number; bg: string }) {
  return (
    <div className={`${bg} rounded-xl p-2 text-center border-[3px] border-black`}>
      <div className="text-lg leading-none">{icon}</div>
      <div className="display text-base font-bold leading-none mt-0.5">{value}</div>
      <div className="text-[8px] uppercase tracking-wider font-bold text-[#2b2640]/60">{label}</div>
    </div>
  );
}

function Toast({ msg }: { msg: string }) {
  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 bg-[#2b2640] text-white px-4 py-2 rounded-full bungee font-bold text-sm shadow-lg z-50 anim-bounce-in">
      {msg}
    </div>
  );
}

function Confetti() {
  const pieces = Array.from({ length: 24 });
  return (
    <div className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center">
      {pieces.map((_, i) => {
        const angle = (i / pieces.length) * Math.PI * 2;
        const dist = 80 + Math.random() * 120;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist;
        const emoji = ["🪙", "✨", "🎉", "⭐", "💫"][i % 5];
        return (
          <span
            key={i}
            className="confetti"
            style={{ "--dx": `${dx}px`, "--dy": `${dy}px`, animationDelay: `${i * 8}ms` } as React.CSSProperties}
          >
            {emoji}
          </span>
        );
      })}
    </div>
  );
}
