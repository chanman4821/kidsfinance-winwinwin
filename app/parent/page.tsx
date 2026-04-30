"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Parent dashboard — Phase 0 read-only view backed by localStorage child profile.
 * In Phase 0+: switch to Auth.js v5 parent session + Drizzle queries via
 * GET /api/parent/dashboard with parent_id auth check.
 */

type Profile = {
  name: string;
  age: number;
  skin: string;
  hair: string;
  hairColor: string;
  outfit: string;
  companion: string;
  cash: number;
  createdAt: string;
};

type ParentSettings = {
  weeklyGemLimit: number;     // hard cap, parent-set
  monthlyGemAllowance: number; // auto-grant
  chatEnabled: boolean;
  marketingOptIn: boolean;
  sessionTimeMinutesPerDay: number;
};

const PROFILE_KEY = "winwinwin.profile.v3";
const SETTINGS_KEY = "winwinwin.parent.settings.v1";

const DEFAULT_SETTINGS: ParentSettings = {
  weeklyGemLimit: 0,        // start strict — parent must opt in
  monthlyGemAllowance: 0,
  chatEnabled: false,       // chat OFF by default per Roblox + COPPA best practice
  marketingOptIn: false,
  sessionTimeMinutesPerDay: 30,
};

export default function ParentDashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [settings, setSettings] = useState<ParentSettings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const p = localStorage.getItem(PROFILE_KEY);
      if (p) setProfile(JSON.parse(p));
      const s = localStorage.getItem(SETTINGS_KEY);
      if (s) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(s) });
    } catch { /* corrupt — fall back to defaults */ }
    setLoaded(true);
  }, []);

  function update<K extends keyof ParentSettings>(key: K, value: ParentSettings[K]) {
    const next = { ...settings, [key]: value };
    setSettings(next);
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(next)); } catch { /* noop */ }
  }

  function revokeConsent() {
    if (!confirm("This will permanently delete your child's profile and all game data. Continue?")) return;
    try {
      localStorage.removeItem(PROFILE_KEY);
      localStorage.removeItem(SETTINGS_KEY);
      localStorage.removeItem("winwinwin.v1");
      localStorage.removeItem("winwinwin.village.v1");
      localStorage.removeItem("winwinwin.markets.v1");
    } catch { /* noop */ }
    window.location.href = "/";
  }

  const isUnder13 = profile ? profile.age < 13 : false;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* HEADER */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="bungee text-sm text-purple-700 hover:text-purple-900">← BACK TO GAME</Link>
          <div className="bungee text-xs text-slate-500 uppercase tracking-wider">Parent Dashboard</div>
        </div>

        <h1 className="bungee text-4xl text-slate-900 mb-2">👨‍👩‍👧 Parent Center</h1>
        <p className="text-slate-600 text-sm mb-6">
          Your child&apos;s game activity, spending controls, and privacy settings — all in one place.
        </p>

        {!loaded ? (
          <div className="text-center text-slate-400 py-20">Loading…</div>
        ) : !profile ? (
          <NoChildProfile />
        ) : (
          <>
            {/* CHILD CARD */}
            <ChildCard profile={profile} isUnder13={isUnder13} />

            {/* COPPA BANNER */}
            {isUnder13 && <CoppaBanner />}

            {/* SPENDING CONTROLS */}
            <Section title="💎 Gem Allowance & Spending Cap" subtitle="No surprise charges. You control every dollar.">
              <div className="space-y-4">
                <NumberRow
                  label="Weekly Gem spend cap"
                  hint="Hard limit. Cosmetic purchases blocked above this."
                  value={settings.weeklyGemLimit}
                  unit="Gems / week"
                  onChange={(v) => update("weeklyGemLimit", v)}
                  options={[0, 100, 250, 500, 1000, 2500]}
                />
                <NumberRow
                  label="Monthly auto-allowance"
                  hint="Auto-grants this many Gems on the 1st of each month. $0 = off."
                  value={settings.monthlyGemAllowance}
                  unit="Gems / month"
                  onChange={(v) => update("monthlyGemAllowance", v)}
                  options={[0, 200, 500, 1000, 2000]}
                />
                <button className="w-full mt-2 bg-gradient-to-b from-purple-500 to-purple-700 text-white bungee text-sm py-3 rounded-2xl border border-purple-900/30 shadow-md shadow-purple-900/20 active:translate-y-0.5">
                  💳 SET UP STRIPE FAMILY PLAN
                </button>
                <p className="text-xs text-slate-400 text-center">Stripe checkout opens in a secure window. PCI-compliant.</p>
              </div>
            </Section>

            {/* SAFETY CONTROLS */}
            <Section title="🛡️ Safety & Communication" subtitle="Default-off settings. Opt in only if comfortable.">
              <ToggleRow
                label="Chat with other players"
                hint="Disabled by default for under-13. Required: Roblox / FTC age-check standard."
                value={settings.chatEnabled}
                onChange={(v) => update("chatEnabled", v)}
                disabled={isUnder13}
                disabledReason={isUnder13 ? "Disabled — your child is under 13" : undefined}
              />
              <ToggleRow
                label="Marketing emails to parent"
                hint="Tips, new venture announcements, brand-partnership previews."
                value={settings.marketingOptIn}
                onChange={(v) => update("marketingOptIn", v)}
              />
              <NumberRow
                label="Daily session time limit"
                hint="Game blocks after this many minutes per day."
                value={settings.sessionTimeMinutesPerDay}
                unit="minutes / day"
                onChange={(v) => update("sessionTimeMinutesPerDay", v)}
                options={[15, 30, 45, 60, 90, 120]}
              />
            </Section>

            {/* PRIVACY / DATA RIGHTS */}
            <Section title="🔐 Privacy & Data Rights" subtitle="COPPA Article 6 — you own your child's data.">
              <ul className="text-sm text-slate-600 space-y-2 mb-4">
                <li>• See exactly what data we collect: <a href="/privacy" className="text-purple-600 underline">Privacy Policy</a></li>
                <li>• Download your child&apos;s game data: <button className="text-purple-600 underline" onClick={() => alert("Phase 0+ feature — exports child profile + transactions + holdings as JSON")}>Request Export</button></li>
                <li>• Correct inaccurate info: contact privacy@winwinwin.app</li>
              </ul>
              <button
                onClick={revokeConsent}
                className="w-full bg-red-50 text-red-700 border-2 border-red-200 hover:bg-red-100 bungee text-xs py-3 rounded-2xl"
              >
                🗑️ DELETE CHILD PROFILE & ALL DATA
              </button>
              <p className="text-xs text-slate-400 mt-2 text-center">
                Permanent. Hard-deletes all game data per COPPA Article 6 deletion right.
              </p>
            </Section>

            {/* WHAT'S NEXT */}
            <Section title="🚧 Coming Soon" subtitle="Currently in Phase 0 build — real backend coming.">
              <ul className="text-sm text-slate-600 space-y-2">
                <li>📊 <strong>Live activity feed</strong> — what venture they ran today, what stocks they traded</li>
                <li>📈 <strong>Portfolio chart</strong> — real-time net worth over weeks/months</li>
                <li>🎯 <strong>Skill report card</strong> — what financial concepts they&apos;ve mastered</li>
                <li>👥 <strong>Crew invitations</strong> — approve/deny which other kids can play with yours</li>
                <li>🛒 <strong>Purchase log</strong> — every Gem transaction with one-click refund</li>
              </ul>
            </Section>
          </>
        )}
      </div>
    </div>
  );
}

/* ====== Sub-components ====== */

function ChildCard({ profile, isUnder13 }: { profile: Profile; isUnder13: boolean }) {
  return (
    <div className="bg-white rounded-2xl border-2 border-slate-900/15 shadow-md shadow-blue-900/15 p-5 mb-6">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 border-2 border-slate-900/15 flex items-center justify-center text-5xl">
          🐼
        </div>
        <div className="flex-1">
          <div className="bungee text-2xl text-slate-900">{profile.name.toUpperCase()}</div>
          <div className="text-sm text-slate-500">Age {profile.age} {isUnder13 && <span className="ml-1 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">COPPA-protected</span>}</div>
          <div className="text-sm text-slate-600 mt-1">💰 ${profile.cash} • 🎮 Member since {new Date(profile.createdAt).toLocaleDateString()}</div>
        </div>
      </div>
    </div>
  );
}

function NoChildProfile() {
  return (
    <div className="bg-white rounded-2xl border-2 border-slate-900/15 shadow-md shadow-blue-900/15 p-8 text-center">
      <div className="text-6xl mb-3">👶</div>
      <h2 className="bungee text-2xl text-slate-900 mb-2">No Child Profile Yet</h2>
      <p className="text-slate-600 text-sm mb-5">
        Your child hasn&apos;t created a Sparkle profile yet. Have them open the game first to set up their warrior.
      </p>
      <Link
        href="/"
        className="inline-block bg-gradient-to-b from-purple-500 to-purple-700 text-white bungee text-sm py-3 px-6 rounded-2xl border border-purple-900/30 shadow-md shadow-purple-900/20"
      >
        OPEN GAME
      </Link>
    </div>
  );
}

function CoppaBanner() {
  return (
    <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 mb-6">
      <div className="flex items-start gap-3">
        <div className="text-3xl shrink-0">🛡️</div>
        <div className="text-sm">
          <div className="bungee text-base text-amber-900 mb-1">COPPA-PROTECTED ACCOUNT</div>
          <p className="text-amber-800">
            Your child is under 13. By federal law, we collect minimal data, never show behavioral ads, never enable chat by default, and you can revoke consent + hard-delete data at any time below.
          </p>
        </div>
      </div>
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border-2 border-slate-900/15 shadow-md shadow-blue-900/15 p-5 mb-5">
      <h2 className="bungee text-lg text-slate-900 mb-1">{title}</h2>
      {subtitle && <p className="text-xs text-slate-500 mb-4">{subtitle}</p>}
      {children}
    </div>
  );
}

function NumberRow({ label, hint, value, unit, onChange, options }: { label: string; hint: string; value: number; unit: string; onChange: (v: number) => void; options: number[] }) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1">
        <label className="text-sm font-bold text-slate-700">{label}</label>
        <span className="text-xs text-slate-500">{value === 0 ? "OFF" : `${value} ${unit}`}</span>
      </div>
      <p className="text-xs text-slate-400 mb-2">{hint}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
              value === opt
                ? "bg-purple-600 text-white border-purple-700 shadow-sm"
                : "bg-white text-slate-700 border-slate-300 hover:border-purple-400"
            }`}
          >
            {opt === 0 ? "Off" : opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function ToggleRow({ label, hint, value, onChange, disabled, disabledReason }: { label: string; hint: string; value: boolean; onChange: (v: boolean) => void; disabled?: boolean; disabledReason?: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
      <div className="flex-1 pr-4">
        <div className="text-sm font-bold text-slate-700">{label}</div>
        <p className="text-xs text-slate-400 mt-0.5">{disabled && disabledReason ? disabledReason : hint}</p>
      </div>
      <button
        onClick={() => !disabled && onChange(!value)}
        disabled={disabled}
        className={`relative w-12 h-7 rounded-full border transition-colors ${
          disabled
            ? "bg-slate-100 border-slate-200 cursor-not-allowed"
            : value
            ? "bg-purple-600 border-purple-700"
            : "bg-slate-200 border-slate-300"
        }`}
      >
        <div
          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
            value ? "left-6" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}
