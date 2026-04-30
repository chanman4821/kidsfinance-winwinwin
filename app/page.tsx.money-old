"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CoachCoin, KidAvatar, COMPANIONS, MoneyScene, type CompanionId, type HairStyle, type OutfitStyle } from "@/components/money-characters";

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
  { id: "vest", label: "Money Vest", emoji: "💰" },
  { id: "tracksuit", label: "Tracksuit", emoji: "🏃" },
];

type Profile = {
  name: string;
  age: number;
  skin: string;
  hair: HairStyle;
  hairColor: string;
  outfit: OutfitStyle;
  companion: CompanionId;
  createdAt: string;
};

const STORAGE = "winwinwin.profile.v2";

function speak(text: string) {
  if (typeof window === "undefined") return;
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95;
    u.pitch = 1.15;
    u.volume = 0.7;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch { /* ignore */ }
}

function pickWorld(age: number): { href: string; name: string; emoji: string } {
  if (age <= 7) return { href: "/play/coinland", name: "Coin Land", emoji: "⭐" };
  if (age <= 12) return { href: "/play/village", name: "Coin Town", emoji: "🏘️" };
  return { href: "/play/markets", name: "Money World", emoji: "📈" };
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
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (step === "hi") speak("Hi! I'm Coach Coin! Let's play and learn money!");
    if (step === "name") speak("What's your name?");
    if (step === "age") speak("How old are you?");
    if (step === "skin") speak("Pick your skin color!");
    if (step === "hair") speak("Pick your hair!");
    if (step === "outfit") speak("Pick your outfit!");
    if (step === "companion") speak("Pick your money buddy!");
    if (step === "go" && profile) speak(`Awesome ${profile.name}! Let's go to ${pickWorld(profile.age).name}!`);
  }, [step, profile]);

  function finish() {
    if (!name.trim() || age == null) return;
    const p: Profile = { name: name.trim(), age, skin, hair, hairColor, outfit, companion, createdAt: new Date().toISOString() };
    localStorage.setItem(STORAGE, JSON.stringify(p));
    setProfile(p);
    setStep("go");
  }

  if (profile && step === "hi") {
    return <ReturningKid profile={profile} onPlay={() => router.push(pickWorld(profile.age).href)} onReset={() => { localStorage.removeItem(STORAGE); setProfile(null); }} />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <MoneyScene />

      <div className="relative z-10 max-w-md mx-auto min-h-screen flex flex-col items-center px-4">
        {/* Title */}
        <div className="pt-6 text-center">
          <h1 className="display text-6xl font-black drop-shadow-[0_4px_0_rgba(0,0,0,0.3)] tracking-tight">
            <span className="text-white" style={{ WebkitTextStroke: "4px #1d4ed8" }}>WIN</span>{" "}
            <span className="text-white" style={{ WebkitTextStroke: "4px #16a34a" }}>WIN</span>{" "}
            <span className="text-white" style={{ WebkitTextStroke: "4px #ea580c" }}>WIN</span>
          </h1>
          <div className="display text-base text-white font-bold mt-1 tracking-wider drop-shadow-[0_2px_0_rgba(0,0,0,0.4)]">
            MONEY GAMES FOR KIDS
          </div>
        </div>

        {/* Mascot or Avatar Preview */}
        <div className="my-3 w-52 h-56 anim-float mascot-shadow">
          {step === "hi" || step === "name" || step === "age" ? (
            <CoachCoin className="w-full h-full" mood={step === "hi" ? "wave" : "happy"} />
          ) : (
            <KidAvatar className="w-full h-full" skin={skin} hair={hair} hairColor={hairColor} outfit={outfit} />
          )}
        </div>

        <div className="w-full">
          {/* STEP HI */}
          {step === "hi" && (
            <div className="text-center anim-bounce-in">
              <div className="relative bg-white border-4 border-[#0f172a] rounded-3xl px-5 py-4 shadow-[0_6px_0_0_#0f172a] mb-5">
                <div className="absolute -left-[14px] top-7 w-0 h-0 border-y-[12px] border-y-transparent border-r-[14px] border-r-white" />
                <div className="absolute -left-[20px] top-[22px] w-0 h-0 border-y-[16px] border-y-transparent border-r-[18px] border-r-[#0f172a]" />
                <div className="display text-2xl font-bold leading-tight">
                  Hi! I&apos;m <span className="text-[#ca8a04]">Coach Coin</span>! 💰
                </div>
                <div className="text-base font-bold text-[#1f2937]/80 mt-1">Let&apos;s learn about money!</div>
              </div>
              <BigButton onClick={() => setStep("name")} color="yellow">Let&apos;s Go! 🚀</BigButton>
            </div>
          )}

          {/* STEP NAME */}
          {step === "name" && (
            <div className="anim-bounce-in">
              <Speech>What&apos;s your name?</Speech>
              <input
                value={name}
                onChange={(e) => setName(e.target.value.slice(0, 20))}
                placeholder="Your name"
                className="w-full px-6 py-5 rounded-3xl border-4 border-white text-2xl display font-bold text-center focus:outline-none focus:border-yellow-300 bg-white shadow-lg"
                autoFocus
              />
              <div className="mt-4">
                <BigButton onClick={() => name.trim() && setStep("age")} color="green" disabled={!name.trim()}>Next ▶</BigButton>
              </div>
            </div>
          )}

          {/* STEP AGE */}
          {step === "age" && (
            <div className="anim-bounce-in">
              <Speech>How old are you, {name}?</Speech>
              <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: 15 }, (_, i) => i + 4).map((a) => (
                  <button
                    key={a}
                    onClick={() => { setAge(a); setTimeout(() => setStep("skin"), 250); }}
                    className={`display font-black text-3xl py-6 rounded-2xl border-4 border-white transition-all ${
                      age === a
                        ? "bg-gradient-to-b from-[#facc15] to-[#ca8a04] text-[#0f172a] shadow-[0_6px_0_0_#78350f] scale-110"
                        : "bg-gradient-to-b from-[#0ea5e9] to-[#0284c7] text-white shadow-[0_6px_0_0_#075985] active:translate-y-1"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP SKIN */}
          {step === "skin" && (
            <div className="anim-bounce-in">
              <Speech>Pick your skin color!</Speech>
              <div className="grid grid-cols-5 gap-3 mb-5">
                {SKINS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSkin(s.color)}
                    className={`aspect-square rounded-full border-4 transition-all ${skin === s.color ? "border-yellow-300 scale-110 shadow-2xl" : "border-white/60"}`}
                    style={{ background: s.color }}
                  />
                ))}
              </div>
              <BigButton onClick={() => setStep("hair")} color="green">Next ▶</BigButton>
            </div>
          )}

          {/* STEP HAIR */}
          {step === "hair" && (
            <div className="anim-bounce-in">
              <Speech>Pick your hair style!</Speech>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {HAIRS.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => setHair(h.id)}
                    className={`p-2 rounded-2xl border-4 bg-white transition-all flex flex-col items-center ${hair === h.id ? "border-yellow-400 scale-105 shadow-2xl" : "border-white/60"}`}
                  >
                    <div className="w-16 h-20">
                      <KidAvatar className="w-full h-full" skin={skin} hair={h.id} hairColor={hairColor} outfit="tee" />
                    </div>
                    <div className="display text-xs font-bold mt-1">{h.label}</div>
                  </button>
                ))}
              </div>
              <div className="flex gap-2 mb-4 justify-center">
                {HAIR_COLORS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setHairColor(c.color)}
                    className={`w-9 h-9 rounded-full border-3 transition-all ${hairColor === c.color ? "border-yellow-300 scale-125 shadow-xl" : "border-white/60"}`}
                    style={{ background: c.color, borderWidth: 3 }}
                  />
                ))}
              </div>
              <BigButton onClick={() => setStep("outfit")} color="green">Next ▶</BigButton>
            </div>
          )}

          {/* STEP OUTFIT */}
          {step === "outfit" && (
            <div className="anim-bounce-in">
              <Speech>Pick your outfit!</Speech>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {OUTFITS.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => setOutfit(o.id)}
                    className={`p-2 rounded-2xl border-4 bg-white transition-all flex flex-col items-center ${outfit === o.id ? "border-yellow-400 scale-105 shadow-2xl" : "border-white/60"}`}
                  >
                    <div className="text-3xl">{o.emoji}</div>
                    <div className="display text-xs font-bold mt-1">{o.label}</div>
                  </button>
                ))}
              </div>
              <BigButton onClick={() => setStep("companion")} color="green">Next ▶</BigButton>
            </div>
          )}

          {/* STEP COMPANION */}
          {step === "companion" && (
            <div className="anim-bounce-in">
              <Speech>Pick your money buddy!</Speech>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {COMPANIONS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCompanion(c.id)}
                    className={`p-3 rounded-2xl border-4 bg-white transition-all ${companion === c.id ? "border-yellow-400 scale-105 shadow-2xl" : "border-white/60"}`}
                  >
                    <div className="text-4xl">{c.emoji}</div>
                    <div className="display text-xs font-bold mt-1">{c.name}</div>
                    <div className="text-[10px] text-[#1f2937]/60 leading-tight">{c.tagline}</div>
                  </button>
                ))}
              </div>
              <BigButton onClick={finish} color="yellow" glow>Done! 🎉</BigButton>
            </div>
          )}

          {/* STEP GO */}
          {step === "go" && profile && (
            <div className="anim-bounce-in text-center">
              <div className="relative bg-white border-4 border-[#0f172a] rounded-3xl px-5 py-4 shadow-[0_6px_0_0_#0f172a] mb-5">
                <div className="display text-xl font-bold leading-snug">
                  AWESOME, <span className="text-[#ca8a04]">{profile.name.toUpperCase()}</span>! 🌟<br />
                  Let&apos;s go to <span className="text-[#16a34a]">{pickWorld(profile.age).name}</span>!
                </div>
              </div>
              <Link
                href={pickWorld(profile.age).href}
                className="block w-full bg-gradient-to-b from-[#22c55e] to-[#15803d] text-white display font-black text-2xl px-8 py-6 rounded-full border-4 border-white shadow-[0_8px_0_0_#14532d,0_12px_24px_rgba(34,197,94,0.5)] active:translate-y-2 active:shadow-[0_2px_0_0_#14532d] transition-all anim-pulse-glow"
                style={{ textShadow: "0 2px 0 rgba(0,0,0,0.2)" }}
              >
                Start Adventure {pickWorld(profile.age).emoji}
              </Link>
            </div>
          )}
        </div>

        <div className="flex-1" />
        <div className="pb-4 mt-4">
          <Link href="/parent" className="text-xs text-white/90 underline display font-bold drop-shadow">
            👨‍👩‍👧 Grown-ups
          </Link>
        </div>
      </div>
    </div>
  );
}

function Speech({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative bg-white border-4 border-[#0f172a] rounded-3xl px-5 py-4 shadow-[0_6px_0_0_#0f172a] mb-4">
      <div className="absolute -left-[14px] top-6 w-0 h-0 border-y-[12px] border-y-transparent border-r-[14px] border-r-white" />
      <div className="absolute -left-[20px] top-[20px] w-0 h-0 border-y-[16px] border-y-transparent border-r-[18px] border-r-[#0f172a]" />
      <div className="display text-xl font-bold text-center">{children}</div>
    </div>
  );
}

function BigButton({ children, onClick, color, disabled, glow }: { children: React.ReactNode; onClick?: () => void; color: "green" | "yellow" | "blue"; disabled?: boolean; glow?: boolean }) {
  const styles: Record<string, string> = {
    green: "bg-gradient-to-b from-[#22c55e] to-[#15803d] text-white shadow-[0_8px_0_0_#14532d,0_12px_24px_rgba(34,197,94,0.5)] active:shadow-[0_2px_0_0_#14532d]",
    yellow: "bg-gradient-to-b from-[#facc15] to-[#ca8a04] text-[#0f172a] shadow-[0_8px_0_0_#78350f,0_12px_24px_rgba(250,204,21,0.5)] active:shadow-[0_2px_0_0_#78350f]",
    blue: "bg-gradient-to-b from-[#0ea5e9] to-[#0284c7] text-white shadow-[0_8px_0_0_#075985,0_12px_24px_rgba(14,165,233,0.5)] active:shadow-[0_2px_0_0_#075985]",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full ${styles[color]} display font-black text-2xl px-8 py-6 rounded-full border-4 border-white active:translate-y-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed ${glow ? "anim-pulse-glow" : ""}`}
      style={{ textShadow: color === "yellow" ? "0 2px 0 rgba(255,255,255,0.4)" : "0 2px 0 rgba(0,0,0,0.2)" }}
    >
      {children}
    </button>
  );
}

function ReturningKid({ profile, onPlay, onReset }: { profile: Profile; onPlay: () => void; onReset: () => void }) {
  const world = pickWorld(profile.age);
  const companion = COMPANIONS.find((c) => c.id === profile.companion);
  return (
    <div className="relative min-h-screen overflow-hidden">
      <MoneyScene />
      <div className="relative z-10 max-w-md mx-auto min-h-screen flex flex-col items-center px-4 pt-12">
        <h1 className="display text-5xl font-black drop-shadow-[0_4px_0_rgba(0,0,0,0.3)] mb-3 text-center">
          <span className="text-white" style={{ WebkitTextStroke: "4px #1d4ed8" }}>WIN</span>{" "}
          <span className="text-white" style={{ WebkitTextStroke: "4px #16a34a" }}>WIN</span>{" "}
          <span className="text-white" style={{ WebkitTextStroke: "4px #ea580c" }}>WIN</span>
        </h1>
        <div className="bg-white border-4 border-white rounded-3xl p-6 text-center w-full shadow-2xl">
          <div className="w-40 h-44 mx-auto">
            <KidAvatar skin={profile.skin} hair={profile.hair} hairColor={profile.hairColor} outfit={profile.outfit} className="w-full h-full" />
          </div>
          <div className="display text-3xl font-black mt-2">WELCOME BACK, {profile.name.toUpperCase()}!</div>
          <div className="text-base font-bold text-[#1f2937]/70 mt-1">
            {companion?.emoji} {companion?.name} is ready! Let&apos;s go to <span className="text-[#ea580c]">{world.name}</span>!
          </div>
          <button onClick={onPlay} className="w-full mt-5 bg-gradient-to-b from-[#22c55e] to-[#15803d] text-white display font-black text-2xl px-8 py-6 rounded-full border-4 border-white shadow-[0_8px_0_0_#14532d,0_12px_24px_rgba(34,197,94,0.5)] active:translate-y-2 active:shadow-[0_2px_0_0_#14532d] transition-all anim-pulse-glow"
            style={{ textShadow: "0 2px 0 rgba(0,0,0,0.2)" }}
          >
            Play! {world.emoji}
          </button>
        </div>
        <button onClick={onReset} className="text-xs text-white/80 underline display font-bold mt-6">Start over</button>
        <div className="flex-1" />
        <Link href="/parent" className="text-xs text-white/90 underline display font-bold pb-4">👨‍👩‍👧 Grown-ups</Link>
      </div>
    </div>
  );
}
