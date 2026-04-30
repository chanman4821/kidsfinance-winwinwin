"use client";
import React from "react";

/**
 * Money-themed cartoon characters & SVG avatars.
 * Replaces animal mascots with on-brand finance characters.
 */

/* ============================================================
 * MONEY PANDA — primary mascot "Sparkle"
 * Cool black-and-white panda with $ sunglasses, gold chain,
 * money sparkles. Roblox / Adopt-Me cool-kid vibe.
 * ============================================================ */
export function MoneyPanda({ className = "", mood = "happy" }: { className?: string; mood?: "happy" | "wave" | "celebrate" | "sleep" }) {
  return (
    <svg viewBox="0 0 260 280" className={className} aria-label="Money Panda">
      <defs>
        <radialGradient id="pandaWhite" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f1f5f9" />
        </radialGradient>
        <radialGradient id="pandaBlack" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0f172a" />
        </radialGradient>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="60%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <radialGradient id="cheekP" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#fb7185" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#fb7185" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* soft shadow under panda */}
      <ellipse cx="130" cy="265" rx="80" ry="6" fill="rgba(15,23,42,0.18)" />

      {/* BODY — round chibi panda body, white */}
      <ellipse cx="130" cy="190" rx="68" ry="58" fill="url(#pandaWhite)" stroke="#e2e8f0" strokeWidth="1.5" />

      {/* BLACK ARMS holding money */}
      <ellipse cx="72" cy="185" rx="22" ry="32" fill="url(#pandaBlack)" />
      <ellipse cx="188" cy="185" rx="22" ry="32" fill="url(#pandaBlack)" />

      {/* BLACK LEGS */}
      <ellipse cx="100" cy="252" rx="22" ry="14" fill="url(#pandaBlack)" />
      <ellipse cx="160" cy="252" rx="22" ry="14" fill="url(#pandaBlack)" />
      {/* white toe pads */}
      <ellipse cx="98" cy="252" rx="8" ry="5" fill="#f1f5f9" />
      <ellipse cx="162" cy="252" rx="8" ry="5" fill="#f1f5f9" />

      {/* MONEY STACK in left paw */}
      <g transform="translate(60, 195) rotate(-8)">
        <rect x="0" y="0" width="34" height="22" rx="3" fill="#10b981" stroke="#047857" strokeWidth="1.5"/>
        <rect x="-3" y="3" width="34" height="22" rx="3" fill="#34d399" stroke="#047857" strokeWidth="1.5"/>
        <rect x="-6" y="6" width="34" height="22" rx="3" fill="#86efac" stroke="#047857" strokeWidth="1.5"/>
        <text x="11" y="22" fontFamily="Lilita One, sans-serif" fontSize="14" fontWeight="900" fill="#047857">$</text>
      </g>

      {/* GOLD CHAINS — stacked rapper style 🎵 */}
      <g>
        {/* Chain 1 — top thin Cuban link */}
        <ellipse cx="130" cy="148" rx="40" ry="6" fill="none" stroke="url(#goldGrad)" strokeWidth="3"/>
        {/* fake link segments */}
        {[-30, -20, -10, 0, 10, 20, 30].map((dx) => (
          <ellipse key={`l1-${dx}`} cx={130 + dx} cy={148 + Math.abs(dx) * 0.05} rx="3" ry="2.5" fill="#fde047" stroke="#92400e" strokeWidth="0.8"/>
        ))}

        {/* Chain 2 — rope chain (medium) */}
        <ellipse cx="130" cy="158" rx="48" ry="8" fill="none" stroke="url(#goldGrad)" strokeWidth="5"/>
        <ellipse cx="130" cy="158" rx="48" ry="8" fill="none" stroke="#fde047" strokeWidth="1.5" strokeDasharray="4 2"/>

        {/* Chain 3 — chunky Cuban bottom */}
        <ellipse cx="130" cy="170" rx="55" ry="10" fill="none" stroke="url(#goldGrad)" strokeWidth="6"/>
        {[-40, -25, -10, 5, 20, 35].map((dx) => (
          <rect key={`l3-${dx}`} x={127 + dx} y={167 + Math.abs(dx) * 0.07} width="6" height="6" rx="1.5" fill="#fbbf24" stroke="#92400e" strokeWidth="1"/>
        ))}

        {/* HUGE $ MEDALLION (the bling) */}
        <circle cx="130" cy="190" r="26" fill="url(#goldGrad)" stroke="#92400e" strokeWidth="3"/>
        <circle cx="130" cy="190" r="22" fill="none" stroke="#fef3c7" strokeWidth="1.5" opacity="0.6"/>
        {/* diamond accents on medallion */}
        <text x="115" y="180" fontSize="10">💎</text>
        <text x="138" y="180" fontSize="10">💎</text>
        <text x="115" y="208" fontSize="10">💎</text>
        <text x="138" y="208" fontSize="10">💎</text>
        {/* big $ in center */}
        <text x="130" y="201" textAnchor="middle" fontFamily="Lilita One, sans-serif" fontSize="32" fontWeight="900" fill="#92400e">$</text>
        {/* shine streak */}
        <path d="M 116 175 Q 122 178 119 188" stroke="#fef3c7" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7"/>
      </g>

      {/* HEAD — round, white */}
      <ellipse cx="130" cy="115" rx="62" ry="55" fill="url(#pandaWhite)" stroke="#e2e8f0" strokeWidth="1.5" />
      {/* head highlight */}
      <ellipse cx="113" cy="100" rx="22" ry="14" fill="white" opacity="0.6"/>

      {/* BLACK EARS — classic panda tufts */}
      <ellipse cx="82" cy="72" rx="16" ry="18" fill="url(#pandaBlack)" />
      <ellipse cx="178" cy="72" rx="16" ry="18" fill="url(#pandaBlack)" />
      {/* pink inner-ear */}
      <ellipse cx="82" cy="76" rx="6" ry="8" fill="#fb7185" opacity="0.7"/>
      <ellipse cx="178" cy="76" rx="6" ry="8" fill="#fb7185" opacity="0.7"/>

      {/* BLACK EYE PATCHES (classic panda mask, slightly tilted = cool) */}
      <ellipse cx="105" cy="115" rx="16" ry="20" fill="url(#pandaBlack)" transform="rotate(-15, 105, 115)"/>
      <ellipse cx="155" cy="115" rx="16" ry="20" fill="url(#pandaBlack)" transform="rotate(15, 155, 115)"/>

      {/* DOLLAR-SIGN SUNGLASSES (cool kid) - sit on top of eye patches when happy/wave/celebrate */}
      {mood !== "sleep" && (
        <g>
          {/* lens frames */}
          <circle cx="105" cy="115" r="14" fill="#0f172a" stroke="#fde047" strokeWidth="2.5"/>
          <circle cx="155" cy="115" r="14" fill="#0f172a" stroke="#fde047" strokeWidth="2.5"/>
          {/* lens tinted gradient */}
          <circle cx="105" cy="115" r="11" fill="#1e3a8a" opacity="0.85"/>
          <circle cx="155" cy="115" r="11" fill="#1e3a8a" opacity="0.85"/>
          {/* $ inside each lens */}
          <text x="105" y="121" textAnchor="middle" fontFamily="Lilita One, sans-serif" fontSize="16" fontWeight="900" fill="#fde047">$</text>
          <text x="155" y="121" textAnchor="middle" fontFamily="Lilita One, sans-serif" fontSize="16" fontWeight="900" fill="#fde047">$</text>
          {/* nose bridge */}
          <line x1="119" y1="115" x2="141" y2="115" stroke="#fde047" strokeWidth="2.5" strokeLinecap="round"/>
          {/* lens shine */}
          <circle cx="100" cy="110" r="3" fill="white" opacity="0.7"/>
          <circle cx="150" cy="110" r="3" fill="white" opacity="0.7"/>
        </g>
      )}

      {/* sleep eyes (closed, no shades) */}
      {mood === "sleep" && (
        <g>
          <path d="M 95 115 Q 105 122 115 115" stroke="#0f172a" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <path d="M 145 115 Q 155 122 165 115" stroke="#0f172a" strokeWidth="3" fill="none" strokeLinecap="round"/>
        </g>
      )}

      {/* CHEEK BLUSH */}
      <ellipse cx="88" cy="140" rx="10" ry="6" fill="url(#cheekP)"/>
      <ellipse cx="172" cy="140" rx="10" ry="6" fill="url(#cheekP)"/>

      {/* NOSE — small black */}
      <ellipse cx="130" cy="138" rx="6" ry="5" fill="#0f172a"/>
      {/* nose shine */}
      <ellipse cx="128" cy="136" rx="2" ry="1.5" fill="white" opacity="0.6"/>

      {/* MOUTH — happy smile */}
      <path d="M 130 144 L 130 150" stroke="#0f172a" strokeWidth="2" strokeLinecap="round"/>
      <path d="M 117 152 Q 130 162 143 152" stroke="#0f172a" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {/* tongue when celebrate */}
      {mood === "celebrate" && (
        <ellipse cx="130" cy="158" rx="6" ry="4" fill="#fb7185"/>
      )}

      {/* WAVING PAW with cash fan */}
      {mood === "wave" && (
        <g transform="translate(195, 130) rotate(15)">
          <ellipse cx="0" cy="0" rx="14" ry="16" fill="url(#pandaBlack)"/>
          <text x="-4" y="-12" fontSize="22">💵</text>
        </g>
      )}

      {/* FLOATING MONEY SPARKLES around */}
      <g className="anim-float">
        <text x="20" y="40" fontSize="22" opacity="0.9">✨</text>
        <text x="220" y="55" fontSize="22" opacity="0.9">💸</text>
        <text x="225" y="200" fontSize="18" opacity="0.85">⭐</text>
        <text x="14" y="180" fontSize="18" opacity="0.85">💰</text>
      </g>

      {/* CELEBRATE EXTRAS */}
      {mood === "celebrate" && (
        <g>
          <text x="40" y="20" fontSize="24">🎉</text>
          <text x="200" y="20" fontSize="24">🎉</text>
          <text x="120" y="10" fontSize="18">✨</text>
          <text x="20" y="100" fontSize="16">💎</text>
          <text x="220" y="100" fontSize="16">💎</text>
        </g>
      )}
    </svg>
  );
}

/* Backwards-compat alias for any old `<MoneyUnicorn />` imports — points at the new panda */
export const MoneyUnicorn = MoneyPanda;

/* ============================================================
 * MONEY UNICORN (legacy SVG kept for fallback) — DEPRECATED
 * ============================================================ */
function _LegacyMoneyUnicorn({ className = "", mood = "happy" }: { className?: string; mood?: "happy" | "wave" | "celebrate" | "sleep" }) {
  return (
    <svg viewBox="0 0 260 280" className={className} aria-label="Money Unicorn">
      <defs>
        <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef3f8" />
          <stop offset="50%" stopColor="#fce7f3" />
          <stop offset="100%" stopColor="#e9d5ff" />
        </linearGradient>
        <linearGradient id="maneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a7f3d0" />
          <stop offset="33%" stopColor="#67e8f9" />
          <stop offset="66%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#fbcfe8" />
        </linearGradient>
        <linearGradient id="hornGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="60%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <radialGradient id="cheekGrad" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#fb7185" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#fb7185" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* soft shadow */}
      <ellipse cx="130" cy="265" rx="80" ry="6" fill="rgba(120,90,180,0.18)" />

      {/* MANE BACK (rainbow streamers behind head) */}
      <g>
        <path d="M 70 80 Q 30 90 35 140 Q 40 175 70 165 Z" fill="url(#maneGrad)" opacity="0.85"/>
        <path d="M 60 100 Q 20 130 30 170 Q 50 195 75 175 Z" fill="url(#maneGrad)" opacity="0.7"/>
      </g>

      {/* BODY (round chibi pony body) */}
      <ellipse cx="130" cy="180" rx="70" ry="55" fill="url(#bodyGrad)" />
      {/* belly highlight */}
      <ellipse cx="130" cy="195" rx="48" ry="32" fill="white" opacity="0.55"/>

      {/* legs (4 stubby) */}
      <rect x="80" y="220" width="22" height="38" rx="11" fill="#f5d0fe"/>
      <rect x="108" y="225" width="22" height="35" rx="11" fill="#f5d0fe"/>
      <rect x="135" y="225" width="22" height="35" rx="11" fill="#f5d0fe"/>
      <rect x="163" y="220" width="22" height="38" rx="11" fill="#f5d0fe"/>
      {/* hoof tips (gold) */}
      <ellipse cx="91" cy="258" rx="13" ry="5" fill="#fbbf24"/>
      <ellipse cx="119" cy="260" rx="13" ry="5" fill="#fbbf24"/>
      <ellipse cx="146" cy="260" rx="13" ry="5" fill="#fbbf24"/>
      <ellipse cx="174" cy="258" rx="13" ry="5" fill="#fbbf24"/>

      {/* GOLD COIN NECKLACE (chunky) */}
      <g>
        <ellipse cx="130" cy="148" rx="42" ry="8" fill="none" stroke="#fbbf24" strokeWidth="3"/>
        {/* Big $ medallion */}
        <circle cx="130" cy="156" r="16" fill="url(#hornGrad)" stroke="#92400e" strokeWidth="2"/>
        <text x="130" y="163" textAnchor="middle" fontFamily="Lilita One, sans-serif" fontSize="22" fontWeight="900" fill="#92400e">$</text>
      </g>

      {/* HEAD — round cute */}
      <ellipse cx="130" cy="115" rx="62" ry="55" fill="url(#bodyGrad)" />
      {/* head highlight */}
      <ellipse cx="113" cy="100" rx="22" ry="14" fill="white" opacity="0.5"/>

      {/* EARS */}
      <path d="M 78 85 Q 75 60 95 70 Q 95 88 80 92 Z" fill="#f5d0fe"/>
      <path d="M 182 85 Q 185 60 165 70 Q 165 88 180 92 Z" fill="#f5d0fe"/>
      <path d="M 84 80 Q 84 70 92 75" fill="none" stroke="#fb7185" strokeWidth="2" opacity="0.6"/>
      <path d="M 176 80 Q 176 70 168 75" fill="none" stroke="#fb7185" strokeWidth="2" opacity="0.6"/>

      {/* MANE (top — rainbow tuft falling forward) */}
      <g>
        <path d="M 100 70 Q 95 50 115 55 Q 120 75 105 75 Z" fill="url(#maneGrad)"/>
        <path d="M 130 60 Q 125 35 145 45 Q 150 70 132 70 Z" fill="url(#maneGrad)"/>
        <path d="M 155 65 Q 155 45 175 55 Q 175 75 158 72 Z" fill="url(#maneGrad)"/>
      </g>

      {/* HORN — golden spiral with $ */}
      <g>
        <path d="M 130 12 L 142 65 L 118 65 Z" fill="url(#hornGrad)" stroke="#92400e" strokeWidth="1.5" strokeLinejoin="round"/>
        {/* spiral lines */}
        <path d="M 122 30 Q 130 28 138 30" stroke="#92400e" strokeWidth="1.5" fill="none"/>
        <path d="M 121 42 Q 130 40 139 42" stroke="#92400e" strokeWidth="1.5" fill="none"/>
        <path d="M 120 54 Q 130 52 140 54" stroke="#92400e" strokeWidth="1.5" fill="none"/>
        {/* $ on horn */}
        <text x="130" y="50" textAnchor="middle" fontFamily="Lilita One, sans-serif" fontSize="14" fontWeight="900" fill="#fef3c7">$</text>
        {/* horn glow tip */}
        <circle cx="130" cy="14" r="4" fill="#fef3c7" opacity="0.9"/>
      </g>

      {/* EYES — big sparkly */}
      {mood === "sleep" ? (
        <g>
          <path d="M 100 115 Q 110 125 120 115" stroke="#1f2937" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
          <path d="M 140 115 Q 150 125 160 115" stroke="#1f2937" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
        </g>
      ) : (
        <g>
          {/* eye whites */}
          <ellipse cx="110" cy="115" rx="13" ry="16" fill="white" stroke="#1f2937" strokeWidth="2"/>
          <ellipse cx="150" cy="115" rx="13" ry="16" fill="white" stroke="#1f2937" strokeWidth="2"/>
          {/* iris (lavender to teal gradient) */}
          <ellipse cx="110" cy="118" rx="9" ry="11" fill="#8b5cf6"/>
          <ellipse cx="150" cy="118" rx="9" ry="11" fill="#8b5cf6"/>
          {/* dollar-sign pupils!  */}
          <text x="110" y="124" textAnchor="middle" fontFamily="Lilita One, sans-serif" fontSize="15" fontWeight="900" fill="#fde047">$</text>
          <text x="150" y="124" textAnchor="middle" fontFamily="Lilita One, sans-serif" fontSize="15" fontWeight="900" fill="#fde047">$</text>
          {/* sparkle */}
          <circle cx="106" cy="111" r="2.5" fill="white"/>
          <circle cx="146" cy="111" r="2.5" fill="white"/>
        </g>
      )}

      {/* CHEEK BLUSH */}
      <ellipse cx="92" cy="135" rx="11" ry="7" fill="url(#cheekGrad)"/>
      <ellipse cx="168" cy="135" rx="11" ry="7" fill="url(#cheekGrad)"/>

      {/* SMILE */}
      <path d="M 117 148 Q 130 162 143 148" stroke="#1f2937" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>

      {/* FLOATING MONEY SPARKLES around (always visible) */}
      <g className="anim-float">
        <text x="20" y="40" fontSize="20" opacity="0.9">✨</text>
        <text x="220" y="55" fontSize="22" opacity="0.9">💸</text>
        <text x="225" y="200" fontSize="18" opacity="0.85">⭐</text>
        <text x="14" y="180" fontSize="16" opacity="0.85">💰</text>
      </g>

      {/* CELEBRATE EXTRAS */}
      {mood === "celebrate" && (
        <g>
          <text x="50" y="20" fontSize="24">🎉</text>
          <text x="200" y="20" fontSize="24">🎉</text>
          <text x="120" y="8" fontSize="18">✨</text>
        </g>
      )}

      {/* WAVE — front hoof up with money fan */}
      {mood === "wave" && (
        <g>
          <text x="195" y="160" fontSize="32" transform="rotate(-15, 200, 150)">💵</text>
        </g>
      )}
    </svg>
  );
}

/* ============================================================
 * COACH COIN — primary mascot (replaces Mochi the dog)
 * Friendly anthropomorphic gold coin with face + arms
 * ============================================================ */
export function CoachCoin({ className = "", mood = "happy" }: { className?: string; mood?: "happy" | "wave" | "celebrate" | "sleep" }) {
  return (
    <svg viewBox="0 0 240 260" className={className} aria-label="Coach Coin">
      {/* shadow */}
      <ellipse cx="120" cy="245" rx="80" ry="8" fill="rgba(0,0,0,0.18)" />

      {/* coin body — concentric circles for depth */}
      <circle cx="120" cy="120" r="100" fill="#fbbf24" />
      <circle cx="120" cy="120" r="100" fill="url(#coinGloss)" />
      <circle cx="120" cy="120" r="92" fill="none" stroke="#92400e" strokeWidth="4" />
      <circle cx="120" cy="120" r="82" fill="none" stroke="#fde68a" strokeWidth="2" opacity="0.6" />

      <defs>
        <radialGradient id="coinGloss" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#fef9c3" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#d97706" stopOpacity="0.4" />
        </radialGradient>
      </defs>

      {/* dollar sign center */}
      <text x="120" y="155" textAnchor="middle" fontFamily="Lilita One, Fredoka, sans-serif" fontSize="120" fontWeight="900" fill="#92400e" opacity="0.25">$</text>

      {/* eyes */}
      {mood === "sleep" ? (
        <>
          <path d="M 90 105 Q 100 115 110 105" stroke="#1f2937" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M 130 105 Q 140 115 150 105" stroke="#1f2937" strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          {/* eye whites */}
          <ellipse cx="100" cy="105" rx="14" ry="16" fill="white" />
          <ellipse cx="140" cy="105" rx="14" ry="16" fill="white" />
          {/* pupils */}
          <circle cx="103" cy="108" r="7" fill="#1f2937" />
          <circle cx="143" cy="108" r="7" fill="#1f2937" />
          {/* highlights */}
          <circle cx="105" cy="105" r="3" fill="white" />
          <circle cx="145" cy="105" r="3" fill="white" />
        </>
      )}

      {/* eyebrows for celebrate */}
      {mood === "celebrate" && (
        <>
          <path d="M 86 88 Q 100 80 114 88" stroke="#1f2937" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M 126 88 Q 140 80 154 88" stroke="#1f2937" strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      )}

      {/* cheek blush */}
      <circle cx="78" cy="135" r="9" fill="#f87171" opacity="0.7" />
      <circle cx="162" cy="135" r="9" fill="#f87171" opacity="0.7" />

      {/* mouth */}
      <path d="M 95 145 Q 120 175 145 145" stroke="#1f2937" strokeWidth="5" fill="white" strokeLinecap="round" strokeLinejoin="round" />
      {/* tongue */}
      <ellipse cx="120" cy="158" rx="8" ry="6" fill="#f87171" />

      {/* arms — pure white gloves like Mickey Mouse */}
      <g>
        {/* left arm */}
        <path d="M 30 170 Q 18 185 22 205" stroke="#1f2937" strokeWidth="4" fill="none" strokeLinecap="round" />
        {/* right arm — waving */}
        {mood === "wave" || mood === "celebrate" ? (
          <g className="paw-wave">
            <path d="M 210 170 Q 225 145 230 120" stroke="#1f2937" strokeWidth="4" fill="none" strokeLinecap="round" />
            <circle cx="232" cy="115" r="14" fill="white" stroke="#1f2937" strokeWidth="3" />
          </g>
        ) : (
          <path d="M 210 170 Q 222 185 218 205" stroke="#1f2937" strokeWidth="4" fill="none" strokeLinecap="round" />
        )}
      </g>
      {/* gloves at hands */}
      <circle cx="22" cy="205" r="14" fill="white" stroke="#1f2937" strokeWidth="3" />
      {!(mood === "wave" || mood === "celebrate") && (
        <circle cx="218" cy="205" r="14" fill="white" stroke="#1f2937" strokeWidth="3" />
      )}

      {/* feet — rounded boots */}
      <ellipse cx="90" cy="235" rx="22" ry="12" fill="#1f2937" />
      <ellipse cx="150" cy="235" rx="22" ry="12" fill="#1f2937" />
      <ellipse cx="92" cy="232" rx="16" ry="6" fill="#374151" />
      <ellipse cx="152" cy="232" rx="16" ry="6" fill="#374151" />

      {/* sparkles around (celebrate mood) */}
      {mood === "celebrate" && (
        <>
          <text x="20" y="40" fontSize="20" fill="#fde047">✨</text>
          <text x="200" y="40" fontSize="20" fill="#fde047">✨</text>
          <text x="50" y="80" fontSize="14" fill="#fde047">⭐</text>
          <text x="180" y="80" fontSize="14" fill="#fde047">⭐</text>
        </>
      )}
    </svg>
  );
}

/* ============================================================
 * KID AVATAR — customizable cartoon kid
 * Skin tone + hair style + outfit
 * ============================================================ */
type AvatarProps = {
  className?: string;
  skin?: string;       // hex color
  hair?: HairStyle;
  hairColor?: string;
  outfit?: OutfitStyle;
};

export type HairStyle = "short" | "long" | "curly" | "buzz" | "bun" | "afro";
export type OutfitStyle = "tee" | "suit" | "hoodie" | "blazer" | "vest" | "tracksuit";

const SKIN_DEFAULT = "#fcd34d";
const HAIR_DEFAULT = "#451a03";

export function KidAvatar({
  className = "",
  skin = SKIN_DEFAULT,
  hair = "short",
  hairColor = HAIR_DEFAULT,
  outfit = "tee",
}: AvatarProps) {
  return (
    <svg viewBox="0 0 200 240" className={className} aria-label="Your character">
      {/* shadow */}
      <ellipse cx="100" cy="232" rx="55" ry="6" fill="rgba(0,0,0,0.18)" />

      {/* legs */}
      <rect x="78" y="180" width="18" height="50" rx="6" fill={outfit === "suit" || outfit === "blazer" ? "#1f2937" : outfit === "tracksuit" ? "#dc2626" : "#1e40af"} />
      <rect x="104" y="180" width="18" height="50" rx="6" fill={outfit === "suit" || outfit === "blazer" ? "#1f2937" : outfit === "tracksuit" ? "#dc2626" : "#1e40af"} />

      {/* shoes */}
      <ellipse cx="87" cy="232" rx="14" ry="6" fill="#1f2937" />
      <ellipse cx="113" cy="232" rx="14" ry="6" fill="#1f2937" />

      {/* body / outfit */}
      <Outfit outfit={outfit} />

      {/* arms */}
      <ellipse cx="55" cy="155" rx="10" ry="22" fill={skin} stroke="#1f2937" strokeWidth="2" />
      <ellipse cx="145" cy="155" rx="10" ry="22" fill={skin} stroke="#1f2937" strokeWidth="2" />
      {/* hands */}
      <circle cx="55" cy="180" r="9" fill={skin} stroke="#1f2937" strokeWidth="2" />
      <circle cx="145" cy="180" r="9" fill={skin} stroke="#1f2937" strokeWidth="2" />

      {/* neck */}
      <rect x="92" y="100" width="16" height="14" fill={skin} stroke="#1f2937" strokeWidth="2" />

      {/* head */}
      <circle cx="100" cy="75" r="42" fill={skin} stroke="#1f2937" strokeWidth="3" />

      {/* ears */}
      <ellipse cx="60" cy="78" rx="6" ry="10" fill={skin} stroke="#1f2937" strokeWidth="2" />
      <ellipse cx="140" cy="78" rx="6" ry="10" fill={skin} stroke="#1f2937" strokeWidth="2" />

      {/* hair */}
      <Hair hair={hair} hairColor={hairColor} />

      {/* eyes */}
      <circle cx="84" cy="72" r="4.5" fill="#1f2937" />
      <circle cx="116" cy="72" r="4.5" fill="#1f2937" />
      <circle cx="86" cy="70" r="1.5" fill="white" />
      <circle cx="118" cy="70" r="1.5" fill="white" />

      {/* smile */}
      <path d="M 86 88 Q 100 98 114 88" stroke="#1f2937" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* cheek blush */}
      <circle cx="72" cy="85" r="5" fill="#fda4af" opacity="0.6" />
      <circle cx="128" cy="85" r="5" fill="#fda4af" opacity="0.6" />
    </svg>
  );
}

function Outfit({ outfit }: { outfit: OutfitStyle }) {
  if (outfit === "suit") {
    return (
      <g>
        <path d="M 60 120 L 60 180 L 140 180 L 140 120 Q 130 110 100 110 Q 70 110 60 120 Z" fill="#1f2937" stroke="#0f172a" strokeWidth="2" />
        <path d="M 100 110 L 90 180 M 100 110 L 110 180" stroke="white" strokeWidth="2" />
        <circle cx="95" cy="140" r="2" fill="white" />
        <circle cx="95" cy="160" r="2" fill="white" />
        {/* tie */}
        <path d="M 96 110 L 100 130 L 104 110 Z" fill="#dc2626" />
        <path d="M 100 130 L 95 170 L 100 175 L 105 170 Z" fill="#dc2626" />
      </g>
    );
  }
  if (outfit === "blazer") {
    return (
      <g>
        <path d="M 60 120 L 60 180 L 140 180 L 140 120 Q 130 110 100 110 Q 70 110 60 120 Z" fill="#1e40af" stroke="#1e3a8a" strokeWidth="2" />
        <rect x="92" y="115" width="16" height="65" fill="white" />
        <path d="M 96 115 L 100 135 L 104 115" fill="#dc2626" />
      </g>
    );
  }
  if (outfit === "hoodie") {
    return (
      <g>
        <path d="M 55 125 L 55 180 L 145 180 L 145 125 Q 130 105 100 105 Q 70 105 55 125 Z" fill="#7c3aed" stroke="#5b21b6" strokeWidth="2" />
        {/* hood */}
        <path d="M 65 110 Q 100 95 135 110 Q 130 100 100 95 Q 70 100 65 110 Z" fill="#6d28d9" stroke="#5b21b6" strokeWidth="2" />
        {/* drawstrings */}
        <line x1="92" y1="120" x2="92" y2="140" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <line x1="108" y1="120" x2="108" y2="140" stroke="white" strokeWidth="2" strokeLinecap="round" />
        {/* pocket */}
        <path d="M 70 150 L 130 150 L 125 175 L 75 175 Z" fill="#6d28d9" stroke="#5b21b6" strokeWidth="2" />
      </g>
    );
  }
  if (outfit === "vest") {
    return (
      <g>
        {/* shirt under */}
        <rect x="60" y="115" width="80" height="65" fill="white" stroke="#e5e7eb" strokeWidth="2" />
        {/* vest */}
        <path d="M 60 125 L 60 180 L 90 180 L 95 130 L 60 125 Z" fill="#16a34a" stroke="#14532d" strokeWidth="2" />
        <path d="M 140 125 L 140 180 L 110 180 L 105 130 L 140 125 Z" fill="#16a34a" stroke="#14532d" strokeWidth="2" />
        {/* dollar sign on chest */}
        <text x="100" y="160" textAnchor="middle" fontFamily="Lilita One, sans-serif" fontSize="22" fontWeight="900" fill="#facc15">$</text>
      </g>
    );
  }
  if (outfit === "tracksuit") {
    return (
      <g>
        <path d="M 60 120 L 60 180 L 140 180 L 140 120 Q 130 110 100 110 Q 70 110 60 120 Z" fill="#dc2626" stroke="#991b1b" strokeWidth="2" />
        {/* white stripes */}
        <rect x="65" y="115" width="6" height="65" fill="white" />
        <rect x="129" y="115" width="6" height="65" fill="white" />
        <rect x="92" y="115" width="16" height="65" fill="white" />
      </g>
    );
  }
  // default tee
  return (
    <g>
      <path d="M 60 120 L 60 180 L 140 180 L 140 120 Q 130 110 100 110 Q 70 110 60 120 Z" fill="#3b82f6" stroke="#1e40af" strokeWidth="2" />
      <text x="100" y="155" textAnchor="middle" fontFamily="Lilita One, sans-serif" fontSize="34" fontWeight="900" fill="#facc15">$</text>
    </g>
  );
}

function Hair({ hair, hairColor }: { hair: HairStyle; hairColor: string }) {
  if (hair === "short") {
    return (
      <path d="M 60 65 Q 100 30 140 65 Q 145 50 130 40 Q 100 25 70 40 Q 55 50 60 65 Z" fill={hairColor} stroke="#1f2937" strokeWidth="2" />
    );
  }
  if (hair === "long") {
    return (
      <g>
        <path d="M 60 60 Q 100 20 140 60 L 145 110 Q 140 85 135 80 L 130 65 Q 100 35 70 65 L 65 80 Q 60 85 55 110 Z" fill={hairColor} stroke="#1f2937" strokeWidth="2" />
      </g>
    );
  }
  if (hair === "curly") {
    return (
      <g>
        <circle cx="70" cy="50" r="13" fill={hairColor} stroke="#1f2937" strokeWidth="2" />
        <circle cx="100" cy="40" r="15" fill={hairColor} stroke="#1f2937" strokeWidth="2" />
        <circle cx="130" cy="50" r="13" fill={hairColor} stroke="#1f2937" strokeWidth="2" />
        <circle cx="58" cy="65" r="10" fill={hairColor} stroke="#1f2937" strokeWidth="2" />
        <circle cx="142" cy="65" r="10" fill={hairColor} stroke="#1f2937" strokeWidth="2" />
      </g>
    );
  }
  if (hair === "buzz") {
    return (
      <path d="M 65 60 Q 100 45 135 60 Q 130 50 100 45 Q 70 50 65 60 Z" fill={hairColor} opacity="0.85" />
    );
  }
  if (hair === "bun") {
    return (
      <g>
        <path d="M 60 65 Q 100 30 140 65 Q 145 50 130 40 Q 100 25 70 40 Q 55 50 60 65 Z" fill={hairColor} stroke="#1f2937" strokeWidth="2" />
        <circle cx="100" cy="28" r="14" fill={hairColor} stroke="#1f2937" strokeWidth="2" />
      </g>
    );
  }
  if (hair === "afro") {
    return (
      <ellipse cx="100" cy="42" rx="55" ry="38" fill={hairColor} stroke="#1f2937" strokeWidth="2" />
    );
  }
  return null;
}

/* ============================================================
 * KUNG FU PANDA-THEMED COMPANIONS
 * Asian-cute critters that follow the kid around
 * ============================================================ */
export type CompanionId = "dumpling" | "dragon" | "luckycat" | "koi" | "lantern" | "fortunecookie";

export const COMPANIONS: { id: CompanionId; emoji: string; name: string; tagline: string }[] = [
  { id: "dumpling",      emoji: "🥟", name: "Bao",      tagline: "Cute & profitable" },
  { id: "dragon",        emoji: "🐲", name: "Drako",    tagline: "Breathes gold" },
  { id: "luckycat",      emoji: "🐱", name: "Lucky",    tagline: "Brings fortune" },
  { id: "koi",           emoji: "🐠", name: "Koi",      tagline: "Swims to riches" },
  { id: "lantern",       emoji: "🏮", name: "Lumi",     tagline: "Lights the way" },
  { id: "fortunecookie", emoji: "🥠", name: "Fortune",  tagline: "Knows secrets" },
];

/* ============================================================
 * MONEY-THEMED SCENE — coin city with falling coins
 * ============================================================ */
export function MoneyScene() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <svg viewBox="0 0 800 1400" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="moneysky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="40%" stopColor="#3b82f6" />
            <stop offset="80%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#84cc16" />
          </linearGradient>
        </defs>
        <rect width="800" height="1400" fill="url(#moneysky)" />
        {/* big sun */}
        <circle cx="640" cy="180" r="80" fill="#facc15" />
        <circle cx="640" cy="180" r="65" fill="#fde047" />
        {/* hill silhouettes */}
        <path d="M 0 1100 Q 200 950 400 1050 T 800 1000 L 800 1400 L 0 1400 Z" fill="#15803d" />
        <path d="M 0 1200 Q 200 1080 400 1180 T 800 1130 L 800 1400 L 0 1400 Z" fill="#14532d" />
      </svg>

      {/* falling coins */}
      <div className="absolute top-0 left-[10%] text-3xl anim-cloud-1 opacity-70">🪙</div>
      <div className="absolute top-0 left-[30%] text-2xl anim-cloud-3 opacity-60">💰</div>
      <div className="absolute top-0 left-[55%] text-3xl anim-cloud-2 opacity-70">💵</div>
      <div className="absolute top-0 left-[75%] text-2xl anim-cloud-1 opacity-60">💎</div>
      <div className="absolute top-10 left-[85%] text-3xl anim-cloud-3 opacity-70">🪙</div>
    </div>
  );
}

/* Keep old characters as re-exports for backwards compat */
export { Mochi, Bunny, Egg, FancyJar, CoinwoodScene } from "./characters-legacy";
