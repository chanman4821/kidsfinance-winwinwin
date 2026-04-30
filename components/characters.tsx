"use client";
import React from "react";

/**
 * Hand-drawn SVG characters for Coinwood.
 * All characters render at any size via viewBox; pass `className` to style.
 * Animations applied via CSS classes from globals.css.
 */

export function Mochi({ className = "", mood = "happy" }: { className?: string; mood?: "happy" | "wave" | "sleep" | "celebrate" }) {
  return (
    <svg viewBox="0 0 200 220" className={className} aria-label="Mochi the dog">
      {/* shadow */}
      <ellipse cx="100" cy="210" rx="60" ry="6" fill="rgba(0,0,0,0.15)" />
      {/* body */}
      <ellipse cx="100" cy="160" rx="55" ry="40" fill="#f4c896" />
      <ellipse cx="100" cy="160" rx="50" ry="35" fill="#f9d8b0" />
      {/* legs */}
      <rect x="70" y="180" width="18" height="22" rx="9" fill="#f4c896" />
      <rect x="112" y="180" width="18" height="22" rx="9" fill="#f4c896" />
      {/* tail (wagging) */}
      <g className={mood === "happy" || mood === "celebrate" ? "wag-origin" : ""}>
        <path d="M 150 145 Q 175 130 168 110" stroke="#e8a96a" strokeWidth="14" fill="none" strokeLinecap="round" />
      </g>
      {/* head */}
      <circle cx="100" cy="95" r="55" fill="#f9d8b0" />
      <circle cx="100" cy="95" r="50" fill="#fce0bf" />
      {/* ears (floppy) */}
      <ellipse cx="55" cy="80" rx="22" ry="32" fill="#c98a55" transform="rotate(-15 55 80)" />
      <ellipse cx="145" cy="80" rx="22" ry="32" fill="#c98a55" transform="rotate(15 145 80)" />
      <ellipse cx="55" cy="78" rx="14" ry="22" fill="#e0a577" transform="rotate(-15 55 78)" />
      <ellipse cx="145" cy="78" rx="14" ry="22" fill="#e0a577" transform="rotate(15 145 78)" />
      {/* eyes */}
      {mood === "sleep" ? (
        <>
          <path d="M 78 88 Q 85 95 92 88" stroke="#2b2640" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 108 88 Q 115 95 122 88" stroke="#2b2640" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="85" cy="90" r="7" fill="#2b2640" />
          <circle cx="115" cy="90" r="7" fill="#2b2640" />
          <circle cx="87" cy="88" r="2.5" fill="white" />
          <circle cx="117" cy="88" r="2.5" fill="white" />
        </>
      )}
      {/* eyebrows for celebrate */}
      {mood === "celebrate" && (
        <>
          <path d="M 75 78 L 92 75" stroke="#2b2640" strokeWidth="3" strokeLinecap="round" />
          <path d="M 108 75 L 125 78" stroke="#2b2640" strokeWidth="3" strokeLinecap="round" />
        </>
      )}
      {/* snout */}
      <ellipse cx="100" cy="110" rx="22" ry="16" fill="#fff" stroke="#e8a96a" strokeWidth="1.5" />
      {/* nose */}
      <ellipse cx="100" cy="103" rx="6" ry="4.5" fill="#2b2640" />
      <ellipse cx="98" cy="101" rx="2" ry="1" fill="rgba(255,255,255,0.4)" />
      {/* mouth + tongue */}
      <path d="M 100 108 Q 100 118 92 120" stroke="#2b2640" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M 100 108 Q 100 118 108 120" stroke="#2b2640" strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="100" cy="122" rx="8" ry="6" fill="#ff6b8b" />
      <line x1="100" y1="118" x2="100" y2="125" stroke="#cc4f6e" strokeWidth="1" />
      {/* cheek blush */}
      <circle cx="68" cy="105" r="6" fill="#ffb3c8" opacity="0.6" />
      <circle cx="132" cy="105" r="6" fill="#ffb3c8" opacity="0.6" />
      {/* waving paw for wave mood */}
      {mood === "wave" && (
        <g className="wave-paw">
          <ellipse cx="40" cy="140" rx="12" ry="14" fill="#f4c896" />
        </g>
      )}
    </svg>
  );
}

export function Bunny({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 200" className={className} aria-label="Bunny Bo">
      <ellipse cx="80" cy="190" rx="40" ry="5" fill="rgba(0,0,0,0.12)" />
      {/* body */}
      <ellipse cx="80" cy="140" rx="38" ry="35" fill="#fff" />
      <ellipse cx="80" cy="140" rx="33" ry="30" fill="#fafafa" />
      {/* feet */}
      <ellipse cx="62" cy="175" rx="14" ry="9" fill="#fff" stroke="#e0e0e0" strokeWidth="1" />
      <ellipse cx="98" cy="175" rx="14" ry="9" fill="#fff" stroke="#e0e0e0" strokeWidth="1" />
      <ellipse cx="62" cy="178" rx="6" ry="3" fill="#ffb3c8" />
      <ellipse cx="98" cy="178" rx="6" ry="3" fill="#ffb3c8" />
      {/* head */}
      <circle cx="80" cy="85" r="42" fill="#fff" />
      {/* ears (long) */}
      <ellipse cx="58" cy="35" rx="10" ry="35" fill="#fff" transform="rotate(-10 58 35)" />
      <ellipse cx="102" cy="35" rx="10" ry="35" fill="#fff" transform="rotate(10 102 35)" />
      <ellipse cx="58" cy="40" rx="5" ry="25" fill="#ffd6e7" transform="rotate(-10 58 40)" />
      <ellipse cx="102" cy="40" rx="5" ry="25" fill="#ffd6e7" transform="rotate(10 102 40)" />
      {/* eyes */}
      <circle cx="68" cy="82" r="6" fill="#2b2640" />
      <circle cx="92" cy="82" r="6" fill="#2b2640" />
      <circle cx="70" cy="80" r="2" fill="#fff" />
      <circle cx="94" cy="80" r="2" fill="#fff" />
      {/* nose */}
      <path d="M 76 95 Q 80 100 84 95 Q 80 92 76 95 Z" fill="#ff7eb5" />
      {/* mouth */}
      <path d="M 80 100 Q 76 104 72 102" stroke="#2b2640" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M 80 100 Q 84 104 88 102" stroke="#2b2640" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* whiskers */}
      <line x1="55" y1="98" x2="40" y2="95" stroke="#999" strokeWidth="1" />
      <line x1="55" y1="100" x2="40" y2="102" stroke="#999" strokeWidth="1" />
      <line x1="105" y1="98" x2="120" y2="95" stroke="#999" strokeWidth="1" />
      <line x1="105" y1="100" x2="120" y2="102" stroke="#999" strokeWidth="1" />
      {/* cheek blush */}
      <circle cx="55" cy="92" r="5" fill="#ffb3c8" opacity="0.7" />
      <circle cx="105" cy="92" r="5" fill="#ffb3c8" opacity="0.7" />
    </svg>
  );
}

export function Egg({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 130" className={className} aria-label="Egg">
      <ellipse cx="50" cy="125" rx="30" ry="3" fill="rgba(0,0,0,0.12)" />
      <path d="M 50 15 C 80 15 88 75 88 95 C 88 115 70 125 50 125 C 30 125 12 115 12 95 C 12 75 20 15 50 15 Z" fill="#fff8e7" stroke="#e8d6a8" strokeWidth="2" />
      <ellipse cx="40" cy="50" rx="6" ry="10" fill="#ffe9b8" opacity="0.7" />
      {/* spots */}
      <circle cx="60" cy="65" r="3" fill="#ffd684" opacity="0.8" />
      <circle cx="35" cy="80" r="2.5" fill="#ffd684" opacity="0.8" />
      <circle cx="70" cy="90" r="3.5" fill="#ffd684" opacity="0.8" />
      <circle cx="50" cy="100" r="2" fill="#ffd684" opacity="0.8" />
    </svg>
  );
}

/** Scene background — sky with sun, drifting clouds, hills */
export function CoinwoodScene({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      <svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full">
        {/* sky gradient */}
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#cfe7ff" />
            <stop offset="60%" stopColor="#ffd6e7" />
            <stop offset="100%" stopColor="#fff3b0" />
          </linearGradient>
          <radialGradient id="sun">
            <stop offset="0%" stopColor="#fff8c2" />
            <stop offset="60%" stopColor="#ffd84d" />
            <stop offset="100%" stopColor="#ffb84d" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="400" height="800" fill="url(#sky)" />
        {/* sun */}
        <circle cx="320" cy="100" r="80" fill="url(#sun)" opacity="0.7" />
        <circle cx="320" cy="100" r="40" fill="#ffd84d" />
        {/* hills */}
        <path d="M 0 700 Q 100 620 200 680 T 400 660 L 400 800 L 0 800 Z" fill="#a8d8b9" />
        <path d="M 0 740 Q 80 700 180 730 T 400 720 L 400 800 L 0 800 Z" fill="#7cc99a" />
      </svg>
      {/* drifting clouds */}
      <div className="cloud-1 absolute top-16 left-0 text-5xl">☁️</div>
      <div className="cloud-2 absolute top-32 right-10 text-4xl">☁️</div>
      <div className="cloud-3 absolute top-52 left-20 text-3xl">☁️</div>
    </div>
  );
}

/** A jar with stacked coin SVGs visible inside */
export function FancyJar({
  label,
  amount,
  max,
  color,
  className = "",
}: {
  label: string;
  amount: number;
  max: number;
  color: string;
  className?: string;
}) {
  const pct = Math.min(100, (amount / Math.max(1, max)) * 100);
  // up to 8 coin discs visible, stacked
  const coinCount = Math.min(8, Math.ceil(amount / 5));
  const coins = Array.from({ length: coinCount });
  return (
    <div className={`fancy-jar-wrap ${className}`}>
      <div className="fancy-jar">
        {/* lid */}
        <div className="fancy-jar-lid" />
        {/* glass body */}
        <div className="fancy-jar-body">
          {/* fill */}
          <div
            className="fancy-jar-fill"
            style={{ height: `${pct}%`, background: color }}
          />
          {/* coins */}
          <div className="fancy-jar-coins">
            {coins.map((_, i) => (
              <div
                key={i}
                className="fancy-jar-coin"
                style={{
                  bottom: `${10 + i * 10}px`,
                  left: `${30 + (i % 2) * 8 - 4}%`,
                  animationDelay: `${i * 100}ms`,
                }}
              >
                🪙
              </div>
            ))}
          </div>
          {/* shine */}
          <div className="fancy-jar-shine" />
          {/* label */}
          <div className="fancy-jar-amount">🪙{amount}</div>
        </div>
      </div>
      <div className="fancy-jar-label">{label}</div>
    </div>
  );
}
