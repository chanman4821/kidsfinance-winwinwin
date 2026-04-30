"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CoinwoodScene, Mochi } from "@/components/characters";

type Mode = {
  href: string;
  emoji: string;
  title: string;
  ageLabel: string;
  ageMin: number;
  ageMax: number;
  blurb: string;     // KID words — what you DO
  perks: string[];   // 3 fun things, kid words
  bg: string;
  storageKey: string;
};

const MODES: Mode[] = [
  {
    href: "/play/coinland",
    emoji: "⭐",
    title: "Coin Land",
    ageLabel: "Little kids",
    ageMin: 4,
    ageMax: 7,
    blurb: "Tap coins, play games, hatch a pet!",
    perks: ["🪙 Tap-to-catch coins", "🥚 Hatch your pet", "🎵 Story with Mochi"],
    bg: "bg-[#fde68a]",
    storageKey: "winwinwin.v1",
  },
  {
    href: "/play/village",
    emoji: "🏘️",
    title: "Coin Town",
    ageLabel: "Big kids",
    ageMin: 8,
    ageMax: 12,
    blurb: "Sell lemonade, buy shops, save for stuff!",
    perks: ["🍋 Run a lemonade stand", "🏪 Own shops", "🦝 Beat the Bank Robber"],
    bg: "bg-[#bbf7d0]",
    storageKey: "winwinwin.village.v1",
  },
  {
    href: "/play/markets",
    emoji: "📈",
    title: "Money World",
    ageLabel: "Teens",
    ageMin: 13,
    ageMax: 18,
    blurb: "Buy real companies, grow your money, learn to be rich!",
    perks: ["📊 Pick real companies", "✨ Watch money grow", "💳 Beat the credit trap"],
    bg: "bg-[#bfdbfe]",
    storageKey: "winwinwin.markets.v1",
  },
];

export default function HomePage() {
  const [step, setStep] = useState<"intro" | "pick" | "modes">("intro");
  const [age, setAge] = useState<number | null>(null);
  const [hasProgress, setHasProgress] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    setHasProgress({
      "winwinwin.v1": !!localStorage.getItem("winwinwin.v1"),
      "winwinwin.village.v1": !!localStorage.getItem("winwinwin.village.v1"),
      "winwinwin.markets.v1": !!localStorage.getItem("winwinwin.markets.v1"),
    });
    const anyProgress =
      !!localStorage.getItem("winwinwin.v1") ||
      !!localStorage.getItem("winwinwin.village.v1") ||
      !!localStorage.getItem("winwinwin.markets.v1");
    if (anyProgress) setStep("modes");
  }, []);

  const recommendedMode = age == null ? null : MODES.find((m) => age >= m.ageMin && age <= m.ageMax);

  return (
    <div className="relative min-h-screen pb-12">
      <CoinwoodScene />

      <div className="max-w-md mx-auto px-4 pt-6 pb-8 relative z-10">
        {/* HERO — always shown */}
        <div className="text-center mb-4">
          <div className="w-44 h-48 mx-auto anim-float">
            <Mochi className="w-full h-full" mood="wave" />
          </div>
          <h1 className="display text-5xl font-bold mt-2 leading-tight">
            <span className="text-[#1d4ed8]">Win</span>{" "}
            <span className="text-[#16a34a]">Win</span>{" "}
            <span className="text-[#ea580c]">Win</span>
          </h1>
        </div>

        {/* STEP 1 — INTRO */}
        {step === "intro" && (
          <div className="bg-white rounded-3xl p-5 border-[4px] border-white shadow-2xl text-center anim-bounce-in">
            <div className="text-2xl">👋</div>
            <div className="display text-2xl font-bold mt-1">Hi! I&apos;m Mochi!</div>
            <div className="text-base text-[#1f2937]/80 mt-2 leading-snug">
              Want to learn about <strong>money</strong> and have <strong>fun</strong>?
            </div>
            <div className="text-base text-[#1f2937]/80 mt-1 leading-snug">
              Let&apos;s pick a game just for <strong>you!</strong>
            </div>
            <button
              onClick={() => setStep("pick")}
              className="mt-5 w-full inline-flex items-center justify-center gap-2 px-6 py-5 rounded-full text-2xl font-bold text-white bg-gradient-to-b from-[#22c55e] to-[#16a34a] border-[4px] border-white shadow-[0_8px_0_0_#15803d,0_12px_24px_rgba(34,197,94,0.4)] active:translate-y-2 active:shadow-[0_2px_0_0_#15803d] display anim-pulse-glow"
            >
              Yes! Let&apos;s go! 🚀
            </button>
          </div>
        )}

        {/* STEP 2 — AGE PICKER */}
        {step === "pick" && (
          <div className="bg-white rounded-3xl p-5 border-[4px] border-white shadow-2xl anim-bounce-in">
            <div className="text-center mb-4">
              <div className="text-2xl">🎂</div>
              <div className="display text-2xl font-bold mt-1">How old are you?</div>
              <div className="text-sm text-[#1f2937]/60 mt-1">Tap your age</div>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {Array.from({ length: 15 }, (_, i) => i + 4).map((a) => (
                <button
                  key={a}
                  onClick={() => setAge(a)}
                  className={`py-4 rounded-2xl display font-bold text-2xl transition-all border-[3px] ${
                    age === a
                      ? "bg-[#2563eb] text-white border-white shadow-lg scale-110"
                      : "bg-[#f9fafb] border-[#e5e7eb] text-[#1f2937]/70 hover:border-[#2563eb]"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
            {recommendedMode && (
              <div className="bg-gradient-to-br from-[#fef3c7] to-[#fde68a] rounded-2xl p-4 border-2 border-white text-center anim-pop-in">
                <div className="text-xs uppercase tracking-wider font-bold text-[#92400e]">For age {age}, your game is</div>
                <div className="text-5xl mt-2">{recommendedMode.emoji}</div>
                <div className="display text-2xl font-bold mt-1">{recommendedMode.title}</div>
                <div className="text-sm text-[#1f2937]/80 mt-1">{recommendedMode.blurb}</div>
                <Link
                  href={recommendedMode.href}
                  className="mt-3 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-lg font-bold text-white bg-gradient-to-b from-[#22c55e] to-[#16a34a] border-[3px] border-white shadow-[0_5px_0_0_#15803d] active:translate-y-1 active:shadow-[0_1px_0_0_#15803d] display"
                >
                  Start Playing! ▶
                </Link>
                <div className="mt-2">
                  <button
                    onClick={() => setStep("modes")}
                    className="text-xs text-[#1f2937]/60 underline display font-bold"
                  >
                    Or pick a different game →
                  </button>
                </div>
              </div>
            )}
            {!recommendedMode && (
              <button
                onClick={() => setStep("modes")}
                className="w-full text-sm text-[#1f2937]/60 underline display font-bold py-2"
              >
                Skip — show me all games →
              </button>
            )}
          </div>
        )}

        {/* STEP 3 — ALL MODES */}
        {step === "modes" && (
          <>
            <div className="text-center mb-3">
              <div className="display text-lg font-bold text-[#1f2937]/70 uppercase tracking-wider">Pick your world</div>
            </div>
            <div className="space-y-3 mb-4">
              {MODES.map((m, i) => {
                const has = hasProgress[m.storageKey];
                return (
                  <Link
                    key={m.href}
                    href={m.href}
                    className={`block ${m.bg} rounded-3xl p-4 border-[4px] border-white shadow-[0_8px_0_0_rgba(0,0,0,0.12),0_12px_24px_rgba(0,0,0,0.1)] active:translate-y-1 active:shadow-[0_4px_0_0_rgba(0,0,0,0.12)] transition-transform`}
                    style={{ transform: `rotate(${i % 2 === 0 ? -1 : 1}deg)` }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-7xl shrink-0 anim-float" style={{ animationDelay: `${i * 0.3}s` }}>
                        {m.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="display text-2xl font-bold leading-tight">{m.title}</div>
                        <div className="display text-xs uppercase tracking-wider text-[#1f2937]/60 font-bold">
                          Ages {m.ageMin}–{m.ageMax}
                        </div>
                        <div className="text-sm text-[#1f2937]/90 mt-1 font-semibold leading-snug">{m.blurb}</div>
                      </div>
                    </div>
                    <ul className="mt-3 space-y-1">
                      {m.perks.map((p) => (
                        <li key={p} className="text-sm leading-tight font-bold">{p}</li>
                      ))}
                    </ul>
                    {has && (
                      <div className="mt-3 inline-block bg-white px-3 py-1 rounded-full text-xs font-bold display">
                        ▶ continue your game
                      </div>
                    )}
                    {!has && (
                      <div className="mt-3 inline-block bg-gradient-to-b from-[#22c55e] to-[#16a34a] text-white px-4 py-2 rounded-full text-base font-bold display shadow-[0_3px_0_0_#15803d]">
                        Start! ▶
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>

            <button
              onClick={() => setStep("pick")}
              className="w-full text-sm text-[#1f2937]/60 underline display font-bold py-2 mb-4"
            >
              ← Pick by age instead
            </button>
          </>
        )}

        {/* GROWN-UPS LINK */}
        <div className="text-center mt-6">
          <Link
            href="/parent"
            className="text-xs text-[#1f2937]/50 underline display font-bold"
          >
            👨‍👩‍👧 Grown-ups click here
          </Link>
        </div>

        <div className="text-center text-[10px] text-[#1f2937]/40 mt-4">
          Free · No ads · No real money · Safe for kids
        </div>
      </div>
    </div>
  );
}
