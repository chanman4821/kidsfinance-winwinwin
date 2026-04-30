"use client";
import React from "react";

/**
 * Full-bleed illustrated game scene SVG — sky, sun, clouds, rolling hills, trees, signs.
 * Like a Pokemon / Animal Crossing town entrance.
 */
export function GameScene() {
  return (
    <svg
      viewBox="0 0 800 1400"
      preserveAspectRatio="xMidYMax slice"
      className="fixed inset-0 w-full h-full -z-10"
      aria-hidden="true"
    >
      <defs>
        {/* sky */}
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="40%" stopColor="#bae6fd" />
          <stop offset="70%" stopColor="#fef9c3" />
          <stop offset="100%" stopColor="#fde68a" />
        </linearGradient>
        {/* sun glow */}
        <radialGradient id="sunglow">
          <stop offset="0%" stopColor="#fef08a" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#fde047" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#fde047" stopOpacity="0" />
        </radialGradient>
        {/* mountain */}
        <linearGradient id="mountain" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        {/* mountain back */}
        <linearGradient id="mountainBack" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
        {/* hill */}
        <linearGradient id="hill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
        {/* hill front */}
        <linearGradient id="hillFront" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>
        {/* tree */}
        <radialGradient id="tree" cx="50%" cy="40%">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="100%" stopColor="#15803d" />
        </radialGradient>
      </defs>

      {/* SKY */}
      <rect width="800" height="900" fill="url(#sky)" />
      {/* sun */}
      <circle cx="640" cy="180" r="160" fill="url(#sunglow)" />
      <circle cx="640" cy="180" r="65" fill="#fde047" />
      <circle cx="630" cy="170" r="20" fill="#fef9c3" opacity="0.6" />

      {/* CLOUDS — fluffy SVG clouds */}
      <g className="anim-cloud-1" opacity="0.95">
        <ellipse cx="80" cy="260" rx="55" ry="22" fill="white" />
        <ellipse cx="120" cy="245" rx="42" ry="28" fill="white" />
        <ellipse cx="160" cy="265" rx="35" ry="20" fill="white" />
      </g>
      <g className="anim-cloud-2" opacity="0.9">
        <ellipse cx="500" cy="120" rx="65" ry="25" fill="white" />
        <ellipse cx="540" cy="100" rx="50" ry="32" fill="white" />
      </g>
      <g className="anim-cloud-3" opacity="0.85">
        <ellipse cx="250" cy="380" rx="48" ry="20" fill="white" />
        <ellipse cx="285" cy="370" rx="38" ry="25" fill="white" />
      </g>

      {/* BIRDS */}
      <g className="anim-cloud-2" opacity="0.7">
        <path d="M 350 300 Q 358 295 366 300 M 366 300 Q 374 295 382 300" stroke="#1f2937" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </g>

      {/* DISTANT MOUNTAINS */}
      <path d="M 0 700 L 100 580 L 200 640 L 320 540 L 420 620 L 540 560 L 680 640 L 800 580 L 800 800 L 0 800 Z" fill="url(#mountainBack)" />
      <path d="M 0 750 L 80 640 L 180 700 L 300 600 L 420 680 L 560 620 L 700 700 L 800 660 L 800 850 L 0 850 Z" fill="url(#mountain)" opacity="0.85" />

      {/* MIDDLE HILLS */}
      <path d="M 0 850 Q 100 760 200 820 T 400 800 T 600 820 T 800 790 L 800 1000 L 0 1000 Z" fill="url(#hill)" />
      {/* TREES on hills */}
      <g>
        <ellipse cx="120" cy="800" rx="22" ry="32" fill="url(#tree)" />
        <rect x="115" y="810" width="10" height="20" fill="#854d0e" />
        <ellipse cx="250" cy="780" rx="28" ry="40" fill="url(#tree)" />
        <rect x="244" y="795" width="12" height="25" fill="#854d0e" />
        <ellipse cx="500" cy="800" rx="25" ry="36" fill="url(#tree)" />
        <rect x="494" y="815" width="12" height="22" fill="#854d0e" />
        <ellipse cx="650" cy="790" rx="30" ry="42" fill="url(#tree)" />
        <rect x="644" y="810" width="12" height="25" fill="#854d0e" />
      </g>

      {/* FRONT HILL — ground for the player */}
      <path d="M 0 1000 Q 200 950 400 1000 T 800 1000 L 800 1400 L 0 1400 Z" fill="url(#hillFront)" />
      {/* grass tufts */}
      <g fill="#15803d">
        <path d="M 60 1100 q 4 -8 8 0 z" />
        <path d="M 200 1080 q 5 -10 10 0 z" />
        <path d="M 360 1110 q 4 -8 8 0 z" />
        <path d="M 540 1080 q 5 -10 10 0 z" />
        <path d="M 720 1110 q 4 -8 8 0 z" />
      </g>
      {/* flowers */}
      <g>
        <circle cx="100" cy="1090" r="5" fill="#ec4899" /><circle cx="100" cy="1090" r="2" fill="#fef3c7" />
        <circle cx="280" cy="1075" r="5" fill="#facc15" /><circle cx="280" cy="1075" r="2" fill="#fef3c7" />
        <circle cx="450" cy="1095" r="5" fill="#a855f7" /><circle cx="450" cy="1095" r="2" fill="#fef3c7" />
        <circle cx="620" cy="1080" r="5" fill="#ef4444" /><circle cx="620" cy="1080" r="2" fill="#fef3c7" />
      </g>

      {/* PATH leading up the hill */}
      <path d="M 380 1400 Q 400 1200 380 1050 L 420 1050 Q 440 1200 420 1400 Z" fill="#fde68a" opacity="0.7" stroke="#d97706" strokeWidth="1" />
    </svg>
  );
}
