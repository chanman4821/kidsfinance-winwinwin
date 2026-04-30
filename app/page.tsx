"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CoachCoin, MoneyUnicorn, KidAvatar, COMPANIONS, type CompanionId, type HairStyle, type OutfitStyle } from "@/components/money-characters";

const SKINS = [
  { id: "fair", color: "#ffe0bd" },
  { id: "light", color: "#fcd9a8" },
  { id: "tan", color: "#e8b388" },
  { id: "brown", color: "#a06a3f" },
  { id: "deep", color: "#5a3318" },
];

const HAIR_COLORS = [
  { id: "black", color: "#1f2937" },
  { id: "brown", color: "#5b3015" },
  { id: "blonde", color: "#fbbf24" },
  { id: "red", color: "#dc2626" },
  { id: "purple", color: "#a855f7" },
  { id: "blue", color: "#3b82f6" },
];

const HAIRS: { id: HairStyle; label: string }[] = [
  { id: "short", label: "Short" },
  { id: "long", label: "Long" },
  { id: "curly", label: "Curly" },
  { id: "buzz", label: "Buzz" },
  { id: "bun", label: "Bun" },
  { id: "afro", label: "Afro" },
];

const OUTFITS: { id: OutfitStyle; label: string; emoji: string }[] = [
  { id: "tee", label: "Tee", emoji: "👕" },
  { id: "suit", label: "Suit", emoji: "🤵" },
  { id: "hoodie", label: "Hoodie", emoji: "🧥" },
  { id: "blazer", label: "Blazer", emoji: "💼" },
  { id: "vest", label: "$ Vest", emoji: "💰" },
  { id: "tracksuit", label: "Tracks", emoji: "🏃" },
];

type Profile = {
  name: string;
  age: number;
  skin: string;
  hair: HairStyle;
  hairColor: string;
  outfit: OutfitStyle;
  companion: CompanionId;
  cash: number;
  createdAt: string;
};

const STORAGE = "winwinwin.profile.v3";

function speak(text: string) {
  if (typeof window === "undefined") return;
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95;
    u.pitch = 1.15;
    u.volume = 0.7;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch { /* noop */ }
}

function pickWorld(age: number): { href: string; name: string; emoji: string } {
  if (age <= 7) return { href: "/play/coinland", name: "COIN LAND", emoji: "⭐" };
  if (age <= 12) return { href: "/play/village", name: "COIN TOWN", emoji: "🏘️" };
  return { href: "/play/markets", name: "MONEY WORLD", emoji: "📈" };
}

export default function HomePage() {
  const router = useRouter();
  const [step, setStep] = useState<"hi" | "name" | "age" | "skin" | "hair" | "outfit" | "companion" | "go">("hi");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | null>(null);
  const [skin, setSkin] = useState(SKINS[1].color);
  const [hair, setHair] = useState<HairStyle>("short");
  const [hairColor, setHairColor] = useState(HAIR_COLORS[0].color);
  const [outfit, setOutfit] = useState<OutfitStyle>("vest");
  const [companion, setCompanion] = useState<CompanionId>("piggy");

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) setProfile(JSON.parse(raw));
    } catch { /* noop */ }
  }, []);

  useEffect(() => {
    if (step === "hi") speak("Hey friend! I'm Sparkle the Money Unicorn! Let's make magic money!");
    if (step === "name") speak("What's your name?");
    if (step === "age") speak("How old are you?");
    if (step === "skin") speak("Pick your skin!");
    if (step === "hair") speak("Pick your hair!");
    if (step === "outfit") speak("Pick your fit!");
    if (step === "companion") speak("Pick your money buddy!");
    if (step === "go" && profile) speak(`Let's go ${profile.name}!`);
  }, [step, profile]);

  function finish() {
    if (!name.trim() || age == null) return;
    const p: Profile = { name: name.trim(), age, skin, hair, hairColor, outfit, companion, cash: 100, createdAt: new Date().toISOString() };
    localStorage.setItem(STORAGE, JSON.stringify(p));
    setProfile(p);
    setStep("go");
  }

  if (profile && step === "hi") {
    return <ReturningKid profile={profile} onPlay={() => router.push(pickWorld(profile.age).href)} onReset={() => { localStorage.removeItem(STORAGE); setProfile(null); }} />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden">

      <div className="relative z-10 max-w-md mx-auto min-h-screen flex flex-col px-4">
        {/* TOP BAR — Roblox style with cash counter */}
        <div className="pt-4 flex items-center justify-between">
          <div className="cash-counter">
            <span className="text-2xl">💰</span>
            <span>$0</span>
          </div>
          <Link href="/parent" className="cash-counter !bg-gradient-to-b !from-[#a855f7] !to-[#6b21a8] !text-white">
            <span>👨‍👩‍👧</span>
          </Link>
        </div>

        {/* TITLE */}
        <div className="text-center mt-2">
          <h1 className="bungee text-6xl text-yellow-300 ">WIN WIN WIN</h1>
          <div className="bungee text-sm text-white -sm mt-1">MONEY GAMES</div>
        </div>

        {/* CHARACTER */}
        <div className="mt-3 flex justify-center">
          <div className="avatar-frame w-56 h-56 p-3 anim-float">
            {step === "hi" || step === "name" || step === "age" ? (
              <MoneyUnicorn className="w-full h-full" mood={step === "hi" ? "wave" : "happy"} />
            ) : (
              <KidAvatar className="w-full h-full" skin={skin} hair={hair} hairColor={hairColor} outfit={outfit} />
            )}
          </div>
        </div>

        {/* STEP CONTENT */}
        <div className="mt-4 flex-1">
          {step === "hi" && (
            <div className="text-center anim-bounce-in">
              <SpeechBubble>HEY! I&apos;M <span className="text-fuchsia-500">SPARKLE</span>! ✨<br/>LET&apos;S MAKE <span className="text-amber-500">MAGIC MONEY!</span> 💸</SpeechBubble>
              <RobloxButton onClick={() => setStep("name")} color="green" pulse>PLAY ▶</RobloxButton>
            </div>
          )}

          {step === "name" && (
            <div className="anim-bounce-in">
              <SpeechBubble>WHAT&apos;S YOUR NAME?</SpeechBubble>
              <input
                value={name}
                onChange={(e) => setName(e.target.value.slice(0, 16))}
                placeholder="TYPE NAME"
                className="w-full px-6 py-5 rounded-3xl border-2 border-slate-900/15 bungee text-3xl text-center bg-white text-black focus:outline-none focus:border-yellow-300 shadow-lg shadow-blue-900/15"
                autoFocus
                style={{ letterSpacing: "0.05em" }}
              />
              <div className="mt-5">
                <RobloxButton onClick={() => name.trim() && setStep("age")} color="green" disabled={!name.trim()}>NEXT ▶</RobloxButton>
              </div>
            </div>
          )}

          {step === "age" && (
            <div className="anim-bounce-in">
              <SpeechBubble>HOW OLD ARE YOU, {name.toUpperCase()}?</SpeechBubble>
              <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: 15 }, (_, i) => i + 4).map((a) => (
                  <button
                    key={a}
                    onClick={() => { setAge(a); setTimeout(() => setStep("skin"), 200); }}
                    className={`bungee text-3xl py-5 rounded-3xl border-2 border-slate-900/15 transition-all ${
                      age === a
                        ? "bg-gradient-to-b from-yellow-400 to-yellow-600 text-black shadow shadow-blue-900/10 scale-110"
                        : "bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-900/15 active:translate-y-2 active:shadow-sm"
                    }`}
                    style={{ textShadow: age === a ? "1px 1px 0 rgba(255,255,255,0.4)" : "2px 2px 0 black" }}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === "skin" && (
            <div className="anim-bounce-in">
              <SpeechBubble>PICK YOUR SKIN!</SpeechBubble>
              <div className="grid grid-cols-5 gap-3 mb-5">
                {SKINS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSkin(s.color)}
                    className={`aspect-square rounded-2xl border-2 border-slate-900/15 transition-all ${skin === s.color ? "scale-110 shadow-[0_0_20px_5px_rgba(250,204,21,0.8)]" : ""}`}
                    style={{ background: s.color }}
                  />
                ))}
              </div>
              <RobloxButton onClick={() => setStep("hair")} color="green">NEXT ▶</RobloxButton>
            </div>
          )}

          {step === "hair" && (
            <div className="anim-bounce-in">
              <SpeechBubble>PICK YOUR HAIR!</SpeechBubble>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {HAIRS.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => setHair(h.id)}
                    className={`p-2 rounded-2xl border-2 border-slate-900/15 bg-white transition-all flex flex-col items-center ${hair === h.id ? "scale-105 shadow-[0_0_20px_5px_rgba(250,204,21,0.8)]" : "shadow shadow-blue-900/10"}`}
                  >
                    <div className="w-16 h-20"><KidAvatar className="w-full h-full" skin={skin} hair={h.id} hairColor={hairColor} outfit="tee" /></div>
                    <div className="bungee text-xs">{h.label}</div>
                  </button>
                ))}
              </div>
              <div className="flex gap-2 mb-4 justify-center">
                {HAIR_COLORS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setHairColor(c.color)}
                    className={`w-10 h-10 rounded-full border border-slate-900/15 transition-all ${hairColor === c.color ? "scale-125 shadow-[0_0_15px_4px_rgba(250,204,21,0.8)]" : ""}`}
                    style={{ background: c.color }}
                  />
                ))}
              </div>
              <RobloxButton onClick={() => setStep("outfit")} color="green">NEXT ▶</RobloxButton>
            </div>
          )}

          {step === "outfit" && (
            <div className="anim-bounce-in">
              <SpeechBubble>PICK YOUR FIT!</SpeechBubble>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {OUTFITS.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => setOutfit(o.id)}
                    className={`p-3 rounded-2xl border-2 border-slate-900/15 bg-white transition-all flex flex-col items-center ${outfit === o.id ? "scale-105 shadow-[0_0_20px_5px_rgba(250,204,21,0.8)]" : "shadow shadow-blue-900/10"}`}
                  >
                    <div className="text-3xl">{o.emoji}</div>
                    <div className="bungee text-xs mt-1">{o.label}</div>
                  </button>
                ))}
              </div>
              <RobloxButton onClick={() => setStep("companion")} color="green">NEXT ▶</RobloxButton>
            </div>
          )}

          {step === "companion" && (
            <div className="anim-bounce-in">
              <SpeechBubble>PICK YOUR MONEY BUDDY!</SpeechBubble>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {COMPANIONS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCompanion(c.id)}
                    className={`p-3 rounded-2xl border-2 border-slate-900/15 bg-white transition-all ${companion === c.id ? "scale-105 shadow-[0_0_20px_5px_rgba(250,204,21,0.8)]" : "shadow shadow-blue-900/10"}`}
                  >
                    <div className="text-4xl">{c.emoji}</div>
                    <div className="bungee text-[10px] mt-1">{c.name}</div>
                  </button>
                ))}
              </div>
              <RobloxButton onClick={finish} color="gold" pulse>DONE! 🎉</RobloxButton>
            </div>
          )}

          {step === "go" && profile && (
            <div className="anim-bounce-in text-center">
              <SpeechBubble>
                LET&apos;S GO <span className="text-yellow-400">{profile.name.toUpperCase()}</span>!<br/>
                ENTER <span className="text-green-400">{pickWorld(profile.age).name}</span>!
              </SpeechBubble>
              <Link href={pickWorld(profile.age).href}>
                <RobloxButton color="green" pulse>START {pickWorld(profile.age).emoji}</RobloxButton>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


/* === SPEECH BUBBLE — bold, black-stroked === */
function SpeechBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative bg-white border-2 border-slate-900/15 rounded-3xl px-5 py-4 shadow-lg shadow-blue-900/15 mb-5">
      <div className="absolute -left-[16px] top-7 w-0 h-0 border-y-[14px] border-y-transparent border-r-[16px] border-r-white" />
      <div className="absolute -left-[24px] top-[22px] w-0 h-0 border-y-[18px] border-y-transparent border-r-[20px] border-r-black" />
      <div className="bungee text-2xl text-center text-black leading-tight" style={{ letterSpacing: "0.02em" }}>
        {children}
      </div>
    </div>
  );
}

/* === ROBLOX BUTTON === */
function RobloxButton({ children, onClick, color, disabled, pulse }: { children: React.ReactNode; onClick?: () => void; color: "green" | "blue" | "red" | "yellow" | "gold" | "purple" | "orange"; disabled?: boolean; pulse?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rbx-btn ${color} w-full ${pulse ? "anim-neon-pulse" : ""}`}
    >
      {children}
    </button>
  );
}

/* === RETURNING KID === */
function ReturningKid({ profile, onPlay, onReset }: { profile: Profile; onPlay: () => void; onReset: () => void }) {
  const world = pickWorld(profile.age);
  const companion = COMPANIONS.find((c) => c.id === profile.companion);
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="relative z-10 max-w-md mx-auto min-h-screen flex flex-col items-center px-4">
        <div className="pt-4 flex items-center justify-between w-full">
          <div className="cash-counter">
            <span className="text-2xl">💰</span>
            <span>${profile.cash}</span>
          </div>
          <Link href="/parent" className="cash-counter !bg-gradient-to-b !from-[#a855f7] !to-[#6b21a8] !text-white">
            <span>👨‍👩‍👧</span>
          </Link>
        </div>

        <h1 className="bungee text-6xl text-yellow-300  mt-4 text-center">WIN WIN WIN</h1>

        <div className="rbx-card mt-6 p-5 w-full text-center">
          <div className="avatar-frame w-44 h-44 p-2 mx-auto mb-3">
            <KidAvatar skin={profile.skin} hair={profile.hair} hairColor={profile.hairColor} outfit={profile.outfit} className="w-full h-full" />
          </div>
          <div className="bungee text-3xl text-black">WELCOME BACK</div>
          <div className="bungee text-4xl text-blue-700 -sm">{profile.name.toUpperCase()}!</div>
          <div className="text-sm font-bold mt-2">{companion?.emoji} {companion?.name} is ready!</div>
          <button onClick={onPlay} className="rbx-btn green w-full mt-4 anim-neon-pulse">PLAY {world.emoji}</button>
        </div>

        <button onClick={onReset} className="bungee text-xs text-white/80 underline mt-6">START OVER</button>
      </div>
    </div>
  );
}
