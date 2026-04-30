"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CoinwoodScene, Mochi } from "@/components/characters";

type Mode = {
  href: string;
  emoji: string;
  title: string;
  age: string;
  blurb: string;
  perks: string[];
  bg: string;
  ring: string;
  status: "ready" | "beta" | "soon";
};

const MODES: Mode[] = [
  {
    href: "/play/coinland",
    emoji: "🌟",
    title: "Coinland",
    age: "Ages 4–7",
    blurb: "Tap, count, and play. Meet Mochi the dog and learn what coins are.",
    perks: ["Coin Catch mini-game", "Story Time with Mochi", "Save / Spend / Give jars", "Pet egg → bunny"],
    bg: "bg-[#fff3b0]",
    ring: "ring-[#ccaa3d]",
    status: "ready",
  },
  {
    href: "/play/village",
    emoji: "🏘️",
    title: "Coinwood Village",
    age: "Ages 8–12",
    blurb: "Move into the town. Run a lemonade stand, buy shops, save toward goals, beat the Bank Robber.",
    perks: ["Lemonade Stand business sim", "Shop ownership (passive income)", "Savings goals", "Family League · 15 lessons"],
    bg: "bg-[#d4f4dd]",
    ring: "ring-[#4fa86c]",
    status: "beta",
  },
  {
    href: "/play/markets",
    emoji: "📈",
    title: "Coinwood Markets",
    age: "Ages 13–18",
    blurb: "Real-stock portfolio with $10K play money. Compound interest lab, credit card trap, business builder.",
    perks: ["12 real companies (Apple, Disney, Roblox…)", "Compound Interest Lab", "Credit Card Trap simulator", "Investment Crews (peer learning)"],
    bg: "bg-[#cfe7ff]",
    ring: "ring-[#3b80b0]",
    status: "ready",
  },
];

export default function HomePage() {
  const [hasCoinland, setHasCoinland] = useState(false);
  const [hasMarkets, setHasMarkets] = useState(false);
  const [hasVillage, setHasVillage] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setHasCoinland(!!localStorage.getItem("winwinwin.v1"));
    setHasMarkets(!!localStorage.getItem("winwinwin.markets.v1"));
    setHasVillage(!!localStorage.getItem("winwinwin.village.v1"));
  }, []);

  return (
    <div className="relative min-h-screen pb-12 bg-gradient-to-b from-[#cfe7ff] via-[#ffd6e7] to-[#fff3b0]">
      <CoinwoodScene />

      <div className="max-w-md mx-auto px-4 pt-6 pb-8 relative z-10">
        {/* Header / hero */}
        <div className="text-center mb-6">
          <div className="w-40 h-44 mx-auto anim-float">
            <Mochi className="w-full h-full" mood="wave" />
          </div>
          <h1 className="display text-4xl font-bold mt-2 leading-tight">
            <span className="text-[#5aa9e6]">Win</span>{" "}
            <span className="text-[#ff7eb5]">Win</span>{" "}
            <span className="text-[#ccaa3d]">Win</span>
          </h1>
          <p className="text-sm text-[#2b2640]/70 mt-2 px-4 leading-snug">
            A fun way for kids to learn money, saving, and investing — with Mochi and friends.
          </p>
        </div>

        {/* Mode picker */}
        <div className="space-y-4 mb-6">
          <div className="display text-sm font-bold uppercase tracking-wider text-[#2b2640]/60 text-center">
            Pick your world
          </div>

          {MODES.map((m, i) => {
            const has =
              (m.href === "/play/coinland" && hasCoinland) ||
              (m.href === "/play/markets" && hasMarkets) ||
              (m.href === "/play/village" && hasVillage);
            return (
              <Link
                key={m.href}
                href={m.href}
                className={`block ${m.bg} rounded-3xl p-4 border-[4px] border-white shadow-[0_8px_0_0_rgba(0,0,0,0.12),0_12px_24px_rgba(0,0,0,0.1)] active:translate-y-1 active:shadow-[0_4px_0_0_rgba(0,0,0,0.12)] transition-transform`}
                style={{ transform: `rotate(${i % 2 === 0 ? -1 : 1}deg)` }}
              >
                <div className="flex items-start gap-3">
                  <div className="text-6xl shrink-0 anim-float" style={{ animationDelay: `${i * 0.3}s` }}>
                    {m.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="display text-xl font-bold">{m.title}</div>
                      {m.status === "ready" && (
                        <div className="text-[10px] bg-[#6ad48b] text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                          Ready
                        </div>
                      )}
                      {m.status === "beta" && (
                        <div className="text-[10px] bg-[#ff7eb5] text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                          Beta
                        </div>
                      )}
                      {m.status === "soon" && (
                        <div className="text-[10px] bg-[#2b2640]/40 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                          Soon
                        </div>
                      )}
                      {has && <div className="text-[10px] bg-white px-2 py-0.5 rounded-full font-bold">▶ continue</div>}
                    </div>
                    <div className="display text-xs uppercase tracking-wider text-[#2b2640]/60 font-bold">{m.age}</div>
                    <div className="text-xs text-[#2b2640]/80 mt-1 leading-snug">{m.blurb}</div>
                  </div>
                </div>
                <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1">
                  {m.perks.map((p) => (
                    <li key={p} className="text-[11px] flex items-center gap-1 leading-tight">
                      <span className="text-[#4fa86c]">✓</span>
                      <span className="text-[#2b2640]/80">{p}</span>
                    </li>
                  ))}
                </ul>
              </Link>
            );
          })}
        </div>

        {/* Footer / parent + about */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Link
            href="/parent"
            className="bg-white/80 backdrop-blur rounded-2xl p-3 border-[3px] border-white shadow text-center active:scale-95 transition-transform"
          >
            <div className="text-2xl">👨‍👩‍👧‍👦</div>
            <div className="display text-xs uppercase tracking-wider font-bold mt-1">Parent</div>
          </Link>
          <Link
            href="/about"
            className="bg-white/80 backdrop-blur rounded-2xl p-3 border-[3px] border-white shadow text-center active:scale-95 transition-transform"
          >
            <div className="text-2xl">💡</div>
            <div className="display text-xs uppercase tracking-wider font-bold mt-1">About</div>
          </Link>
        </div>

        <div className="text-center text-[10px] text-[#2b2640]/50 mt-4">
          Free · ad-free · no real money · COPPA-safe<br />
          Built for families. Made with 💛 by the Coinwood team.
        </div>
      </div>
    </div>
  );
}
