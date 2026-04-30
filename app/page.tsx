"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Mochi } from "@/components/characters";

const SKINS = [
  { id: "tan", color: "#d4a574" },
  { id: "peach", color: "#ffd6b3" },
  { id: "olive", color: "#bda476" },
  { id: "brown", color: "#8b5a2b" },
  { id: "espresso", color: "#5d3a1a" },
];

const HATS = [
  { id: "none", emoji: "", label: "None" },
  { id: "cap", emoji: "🧢", label: "Cap" },
  { id: "crown", emoji: "👑", label: "Crown" },
  { id: "wizard", emoji: "🧙", label: "Wizard" },
  { id: "party", emoji: "🥳", label: "Party" },
  { id: "cool", emoji: "😎", label: "Cool" },
];

const PETS = [
  { id: "rabbit", emoji: "🐰", label: "Bunny" },
  { id: "dog", emoji: "🐶", label: "Puppy" },
  { id: "cat", emoji: "🐱", label: "Kitty" },
  { id: "fox", emoji: "🦊", label: "Fox" },
  { id: "panda", emoji: "🐼", label: "Panda" },
  { id: "frog", emoji: "🐸", label: "Frog" },
];

type Profile = {
  name: string;
  age: number;
  skin: string;
  hat: string;
  pet: string;
  createdAt: string;
};

const STORAGE = "winwinwin.profile.v1";

function speak(text: string) {
  if (typeof window === "undefined") return;
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95;
    u.pitch = 1.2;
    u.volume = 0.7;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch {
    /* ignore */
  }
}

function pickWorld(age: number): { href: string; name: string; emoji: string } {
  if (age <= 7) return { href: "/play/coinland", name: "Coin Land", emoji: "⭐" };
  if (age <= 12) return { href: "/play/village", name: "Coin Town", emoji: "🏘️" };
  return { href: "/play/markets", name: "Money World", emoji: "📈" };
}

export default function HomePage() {
  const router = useRouter();
  const [step, setStep] = useState<"hi" | "name" | "age" | "skin" | "hat" | "pet" | "go">("hi");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | null>(null);
  const [skin, setSkin] = useState(SKINS[0].id);
  const [hat, setHat] = useState(HATS[0].id);
  const [pet, setPet] = useState(PETS[0].id);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) setProfile(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (step === "hi") speak("Hi! I'm Mochi! Let's play!");
    if (step === "name") speak("What's your name?");
    if (step === "age") speak("How old are you?");
    if (step === "skin") speak("Pick your color!");
    if (step === "hat") speak("Pick a hat!");
    if (step === "pet") speak("Pick your pet!");
    if (step === "go" && profile) speak(`Great job ${profile.name}! Let's go to ${pickWorld(profile.age).name}!`);
  }, [step, profile]);

  function finish() {
    if (!name.trim() || age == null) return;
    const p: Profile = { name: name.trim(), age, skin, hat, pet, createdAt: new Date().toISOString() };
    localStorage.setItem(STORAGE, JSON.stringify(p));
    setProfile(p);
    setStep("go");
  }

  // Returning kid — go straight to their world
  if (profile && step !== "go") {
    return <ReturningKid profile={profile} onPlay={() => router.push(pickWorld(profile.age).href)} onReset={() => { localStorage.removeItem(STORAGE); setProfile(null); setStep("hi"); }} />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* SATURATED BG with sun + clouds */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <svg viewBox="0 0 800 1400" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 w-full h-full">
          <defs>
            <linearGradient id="sky2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="50%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
            <radialGradient id="sun2"><stop offset="0%" stopColor="#fef08a" /><stop offset="60%" stopColor="#facc15" /><stop offset="100%" stopColor="#facc15" stopOpacity="0" /></radialGradient>
          </defs>
          <rect width="800" height="1400" fill="url(#sky2)" />
          <circle cx="640" cy="180" r="160" fill="url(#sun2)" />
          <circle cx="640" cy="180" r="65" fill="#facc15" />
          {/* hills */}
          <path d="M 0 1100 Q 200 950 400 1050 T 800 1000 L 800 1400 L 0 1400 Z" fill="#16a34a" />
          <path d="M 0 1200 Q 200 1080 400 1180 T 800 1130 L 800 1400 L 0 1400 Z" fill="#15803d" />
        </svg>
        <div className="absolute top-16 left-0 text-6xl anim-cloud-1">☁️</div>
        <div className="absolute top-32 right-10 text-5xl anim-cloud-2">☁️</div>
        <div className="absolute top-52 left-20 text-4xl anim-cloud-3">☁️</div>
      </div>

      <div className="relative z-10 max-w-md mx-auto min-h-screen flex flex-col items-center px-4">
        {/* Title */}
        <div className="pt-6 text-center">
          <h1 className="display text-5xl font-black drop-shadow-[0_4px_0_rgba(0,0,0,0.2)]">
            <span className="text-white" style={{ WebkitTextStroke: "3px #1d4ed8" }}>WIN</span>{" "}
            <span className="text-white" style={{ WebkitTextStroke: "3px #16a34a" }}>WIN</span>{" "}
            <span className="text-white" style={{ WebkitTextStroke: "3px #ea580c" }}>WIN</span>
          </h1>
        </div>

        {/* Mascot — always present */}
        <div className="my-2 w-48 h-52 anim-float mascot-shadow">
          <Mochi className="w-full h-full" mood={step === "hi" ? "wave" : step === "go" ? "celebrate" : "happy"} />
        </div>

        {/* SPEECH + STEP CONTENT */}
        <div className="w-full">
          {step === "hi" && (
            <div className="text-center anim-bounce-in">
              <div className="relative bg-white border-4 border-[#0f172a] rounded-3xl px-5 py-4 shadow-[0_6px_0_0_#0f172a] mb-5">
                <div className="absolute -left-[14px] top-7 w-0 h-0 border-y-[12px] border-y-transparent border-r-[14px] border-r-white" />
                <div className="absolute -left-[20px] top-[22px] w-0 h-0 border-y-[16px] border-y-transparent border-r-[18px] border-r-[#0f172a]" />
                <div className="display text-2xl font-bold">Hi! I&apos;m Mochi! 👋</div>
              </div>
              <button
                onClick={() => setStep("name")}
                className="w-full bg-gradient-to-b from-[#facc15] to-[#ca8a04] text-[#0f172a] display font-black text-2xl px-8 py-6 rounded-full border-4 border-white shadow-[0_8px_0_0_#78350f,0_12px_24px_rgba(250,204,21,0.5)] active:translate-y-2 active:shadow-[0_2px_0_0_#78350f] transition-all"
                style={{ textShadow: "0 2px 0 rgba(255,255,255,0.4)" }}
              >
                Let&apos;s Play! 🚀
              </button>
            </div>
          )}

          {step === "name" && (
            <div className="anim-bounce-in">
              <div className="relative bg-white border-4 border-[#0f172a] rounded-3xl px-5 py-4 shadow-[0_6px_0_0_#0f172a] mb-4">
                <div className="absolute -left-[14px] top-6 w-0 h-0 border-y-[12px] border-y-transparent border-r-[14px] border-r-white" />
                <div className="absolute -left-[20px] top-[20px] w-0 h-0 border-y-[16px] border-y-transparent border-r-[18px] border-r-[#0f172a]" />
                <div className="display text-xl font-bold text-center">What&apos;s your name?</div>
              </div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value.slice(0, 20))}
                placeholder="Type here"
                className="w-full px-6 py-5 rounded-3xl border-4 border-white text-2xl display font-bold text-center focus:outline-none focus:border-yellow-300 bg-white shadow-lg"
                autoFocus
              />
              <button
                onClick={() => name.trim() && setStep("age")}
                disabled={!name.trim()}
                className="w-full mt-4 bg-gradient-to-b from-[#22c55e] to-[#15803d] text-white display font-black text-2xl px-8 py-6 rounded-full border-4 border-white shadow-[0_8px_0_0_#14532d,0_12px_24px_rgba(34,197,94,0.5)] active:translate-y-2 active:shadow-[0_2px_0_0_#14532d] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ textShadow: "0 2px 0 rgba(0,0,0,0.2)" }}
              >
                Next ▶
              </button>
            </div>
          )}

          {step === "age" && (
            <div className="anim-bounce-in">
              <div className="relative bg-white border-4 border-[#0f172a] rounded-3xl px-5 py-4 shadow-[0_6px_0_0_#0f172a] mb-4">
                <div className="absolute -left-[14px] top-6 w-0 h-0 border-y-[12px] border-y-transparent border-r-[14px] border-r-white" />
                <div className="absolute -left-[20px] top-[20px] w-0 h-0 border-y-[16px] border-y-transparent border-r-[18px] border-r-[#0f172a]" />
                <div className="display text-xl font-bold text-center">How old are you, {name}?</div>
              </div>
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

          {step === "skin" && (
            <div className="anim-bounce-in">
              <div className="relative bg-white border-4 border-[#0f172a] rounded-3xl px-5 py-4 shadow-[0_6px_0_0_#0f172a] mb-4">
                <div className="absolute -left-[14px] top-6 w-0 h-0 border-y-[12px] border-y-transparent border-r-[14px] border-r-white" />
                <div className="absolute -left-[20px] top-[20px] w-0 h-0 border-y-[16px] border-y-transparent border-r-[18px] border-r-[#0f172a]" />
                <div className="display text-xl font-bold text-center">Pick your color! 🎨</div>
              </div>
              <div className="grid grid-cols-5 gap-3 mb-5">
                {SKINS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSkin(s.id)}
                    className={`aspect-square rounded-full border-4 transition-all ${skin === s.id ? "border-yellow-300 scale-110 shadow-2xl" : "border-white/60"}`}
                    style={{ background: s.color }}
                  />
                ))}
              </div>
              <button
                onClick={() => setStep("hat")}
                className="w-full bg-gradient-to-b from-[#22c55e] to-[#15803d] text-white display font-black text-2xl px-8 py-6 rounded-full border-4 border-white shadow-[0_8px_0_0_#14532d,0_12px_24px_rgba(34,197,94,0.5)] active:translate-y-2 active:shadow-[0_2px_0_0_#14532d] transition-all"
                style={{ textShadow: "0 2px 0 rgba(0,0,0,0.2)" }}
              >
                Next ▶
              </button>
            </div>
          )}

          {step === "hat" && (
            <div className="anim-bounce-in">
              <div className="relative bg-white border-4 border-[#0f172a] rounded-3xl px-5 py-4 shadow-[0_6px_0_0_#0f172a] mb-4">
                <div className="absolute -left-[14px] top-6 w-0 h-0 border-y-[12px] border-y-transparent border-r-[14px] border-r-white" />
                <div className="absolute -left-[20px] top-[20px] w-0 h-0 border-y-[16px] border-y-transparent border-r-[18px] border-r-[#0f172a]" />
                <div className="display text-xl font-bold text-center">Pick a hat! 🎩</div>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-5">
                {HATS.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => setHat(h.id)}
                    className={`p-4 rounded-2xl border-4 bg-white transition-all ${hat === h.id ? "border-yellow-400 scale-110 shadow-2xl" : "border-white/60"}`}
                  >
                    <div className="text-5xl">{h.emoji || "🚫"}</div>
                    <div className="display text-xs font-bold mt-1">{h.label}</div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep("pet")}
                className="w-full bg-gradient-to-b from-[#22c55e] to-[#15803d] text-white display font-black text-2xl px-8 py-6 rounded-full border-4 border-white shadow-[0_8px_0_0_#14532d,0_12px_24px_rgba(34,197,94,0.5)] active:translate-y-2 active:shadow-[0_2px_0_0_#14532d] transition-all"
                style={{ textShadow: "0 2px 0 rgba(0,0,0,0.2)" }}
              >
                Next ▶
              </button>
            </div>
          )}

          {step === "pet" && (
            <div className="anim-bounce-in">
              <div className="relative bg-white border-4 border-[#0f172a] rounded-3xl px-5 py-4 shadow-[0_6px_0_0_#0f172a] mb-4">
                <div className="absolute -left-[14px] top-6 w-0 h-0 border-y-[12px] border-y-transparent border-r-[14px] border-r-white" />
                <div className="absolute -left-[20px] top-[20px] w-0 h-0 border-y-[16px] border-y-transparent border-r-[18px] border-r-[#0f172a]" />
                <div className="display text-xl font-bold text-center">Pick your pet! 🐾</div>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-5">
                {PETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPet(p.id)}
                    className={`p-4 rounded-2xl border-4 bg-white transition-all ${pet === p.id ? "border-yellow-400 scale-110 shadow-2xl" : "border-white/60"}`}
                  >
                    <div className="text-5xl">{p.emoji}</div>
                    <div className="display text-xs font-bold mt-1">{p.label}</div>
                  </button>
                ))}
              </div>
              <button
                onClick={finish}
                className="w-full bg-gradient-to-b from-[#facc15] to-[#ca8a04] text-[#0f172a] display font-black text-2xl px-8 py-6 rounded-full border-4 border-white shadow-[0_8px_0_0_#78350f,0_12px_24px_rgba(250,204,21,0.5)] active:translate-y-2 active:shadow-[0_2px_0_0_#78350f] transition-all anim-pulse-glow"
                style={{ textShadow: "0 2px 0 rgba(255,255,255,0.4)" }}
              >
                Done! 🎉
              </button>
            </div>
          )}

          {step === "go" && profile && (
            <div className="anim-bounce-in text-center">
              <div className="relative bg-white border-4 border-[#0f172a] rounded-3xl px-5 py-4 shadow-[0_6px_0_0_#0f172a] mb-5">
                <div className="absolute -left-[14px] top-7 w-0 h-0 border-y-[12px] border-y-transparent border-r-[14px] border-r-white" />
                <div className="absolute -left-[20px] top-[22px] w-0 h-0 border-y-[16px] border-y-transparent border-r-[18px] border-r-[#0f172a]" />
                <div className="display text-xl font-bold leading-snug">
                  Great job {profile.name}! 🌟<br />
                  Let&apos;s go to {pickWorld(profile.age).name}!
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
          <Link href="/parent" className="text-xs text-white/80 underline display font-bold">
            👨‍👩‍👧 Grown-ups click here
          </Link>
        </div>
      </div>
    </div>
  );
}

/* Returning kid screen */
function ReturningKid({ profile, onPlay, onReset }: { profile: Profile; onPlay: () => void; onReset: () => void }) {
  const world = pickWorld(profile.age);
  const petEmoji = PETS.find((p) => p.id === profile.pet)?.emoji ?? "🐰";
  const hatEmoji = HATS.find((h) => h.id === profile.hat)?.emoji ?? "";
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[#0ea5e9] via-[#22d3ee] to-[#22c55e]" />
      <div className="relative z-10 max-w-md mx-auto min-h-screen flex flex-col items-center px-4 pt-12">
        <h1 className="display text-4xl font-black drop-shadow-[0_4px_0_rgba(0,0,0,0.2)] mb-4">
          <span className="text-white" style={{ WebkitTextStroke: "3px #1d4ed8" }}>WIN</span>{" "}
          <span className="text-white" style={{ WebkitTextStroke: "3px #16a34a" }}>WIN</span>{" "}
          <span className="text-white" style={{ WebkitTextStroke: "3px #ea580c" }}>WIN</span>
        </h1>
        <div className="card-game p-6 text-center w-full">
          <div className="text-6xl mb-1 relative inline-block">
            <span>{petEmoji}</span>
            {hatEmoji && <span className="absolute -top-3 -right-1 text-3xl">{hatEmoji}</span>}
          </div>
          <div className="display text-3xl font-black">Welcome back, {profile.name}!</div>
          <div className="text-sm text-[#1f2937]/70 mt-1">Ready for {world.name}?</div>
          <button onClick={onPlay} className="btn-game btn-game-huge w-full mt-5 anim-pulse-glow">
            Play! {world.emoji}
          </button>
        </div>
        <button onClick={onReset} className="text-xs text-white/80 underline display font-bold mt-6">
          Start over
        </button>
        <div className="flex-1" />
        <Link href="/parent" className="text-xs text-white/80 underline display font-bold pb-4">
          👨‍👩‍👧 Grown-ups
        </Link>
      </div>
    </div>
  );
}
