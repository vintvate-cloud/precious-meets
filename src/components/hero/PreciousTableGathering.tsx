import React from "react";

interface DiningTableSVGProps {
  tableId: string;
}

function DiningTableSVG({ tableId }: DiningTableSVGProps) {
  return (
    <div className="absolute inset-x-0 bottom-0 w-full h-36 sm:h-42 z-20 pointer-events-none">
      <svg viewBox="0 0 320 160" className="w-full h-full drop-shadow-xl">
        <defs>
          <linearGradient id={`${tableId}-woodGrad`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#854d0e" />
            <stop offset="50%" stopColor="#582a0d" />
            <stop offset="100%" stopColor="#381a08" />
          </linearGradient>
          <linearGradient id={`${tableId}-runnerBurgundy`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4a0f21" />
            <stop offset="50%" stopColor="#691C35" />
            <stop offset="100%" stopColor="#4a0f21" />
          </linearGradient>
          <radialGradient id={`${tableId}-candleGlow`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#f59e0b" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Table Ground Shadow */}
        <ellipse cx="160" cy="148" rx="145" ry="10" fill="#0f172a" opacity="0.32" />

        {/* BACK ROW CHAIRS (Behind table) */}
        {/* Chair 1 (Left Back) */}
        <g transform="translate(56, 44)">
          <rect x="8" y="0" width="3.5" height="42" rx="1.5" fill="#3f1e09" />
          <rect x="28" y="0" width="3.5" height="42" rx="1.5" fill="#3f1e09" />
          <path d="M 4 4 C 4 0 36 0 36 4 L 34 22 L 6 22 Z" fill="#582a0d" stroke="#8d4013" strokeWidth="0.8" />
        </g>
        {/* Chair 2 (Center Back) */}
        <g transform="translate(140, 44)">
          <rect x="8" y="0" width="3.5" height="42" rx="1.5" fill="#3f1e09" />
          <rect x="28" y="0" width="3.5" height="42" rx="1.5" fill="#3f1e09" />
          <path d="M 4 4 C 4 0 36 0 36 4 L 34 22 L 6 22 Z" fill="#582a0d" stroke="#8d4013" strokeWidth="0.8" />
        </g>
        {/* Chair 3 (Right Back) */}
        <g transform="translate(224, 44)">
          <rect x="8" y="0" width="3.5" height="42" rx="1.5" fill="#3f1e09" />
          <rect x="28" y="0" width="3.5" height="42" rx="1.5" fill="#3f1e09" />
          <path d="M 4 4 C 4 0 36 0 36 4 L 34 22 L 6 22 Z" fill="#582a0d" stroke="#8d4013" strokeWidth="0.8" />
        </g>

        {/* TABLE LEGS & BRACING */}
        <rect x="42" y="96" width="7" height="50" rx="2" fill="#2d1306" />
        <rect x="52" y="96" width="6" height="46" rx="2" fill="#3f1e09" />
        <rect x="271" y="96" width="7" height="50" rx="2" fill="#2d1306" />
        <rect x="261" y="96" width="6" height="46" rx="2" fill="#3f1e09" />
        <line x1="45" y1="134" x2="275" y2="134" stroke="#2d1306" strokeWidth="4.5" />

        {/* TABLE SURFACE OVAL */}
        <ellipse cx="160" cy="94" rx="138" ry="19" fill={`url(#${tableId}-woodGrad)`} stroke="#a16207" strokeWidth="1" />
        <ellipse cx="160" cy="91" rx="135" ry="16.5" fill="#5a2408" />

        {/* BURGUNDY RUNNER CLOTH (#691C35) */}
        <path
          d="M 48 93 C 48 83 272 83 272 93 C 272 97 48 97 48 93 Z"
          fill={`url(#${tableId}-runnerBurgundy)`}
        />
        {/* Runner side drops with gold fringe */}
        <polygon points="48,93 44,112 52,112 48,93" fill="#691C35" />
        <line x1="44" y1="112" x2="52" y2="112" stroke="#c6a568" strokeWidth="2" />
        <polygon points="272,93 268,112 276,112 272,93" fill="#691C35" />
        <line x1="268" y1="112" x2="276" y2="112" stroke="#c6a568" strokeWidth="2" />

        {/* BRASS CANDELABRA & CANDLELIGHT */}
        <g transform="translate(148, 60)">
          {/* Ambient Candle Glow Aura */}
          <circle cx="12" cy="12" r="28" fill={`url(#${tableId}-candleGlow)`} opacity="0.65" className="animate-pulse" />
          {/* Stand */}
          <rect x="10.5" y="18" width="3.5" height="14" fill="#facc15" />
          <ellipse cx="12" cy="32" rx="9" ry="3" fill="#ca8a04" />
          <path d="M 3 22 Q 12 28 21 22" stroke="#facc15" strokeWidth="2.5" fill="none" />
          {/* 3 Candles */}
          <rect x="2" y="14" width="2.5" height="8" fill="#fef08a" />
          <rect x="10.8" y="9" width="2.5" height="11" fill="#fef08a" />
          <rect x="19.5" y="14" width="2.5" height="8" fill="#fef08a" />
          {/* Flames */}
          <ellipse cx="3.2" cy="11" rx="1.6" ry="3.8" fill="#f97316" className="animate-pulse" />
          <ellipse cx="12" cy="6" rx="2" ry="4.2" fill="#f97316" className="animate-pulse" />
          <ellipse cx="20.7" cy="11" rx="1.6" ry="3.8" fill="#f97316" className="animate-pulse" />
        </g>

        {/* DINING DISHES & WINE FOR 6 */}
        <ellipse cx="76" cy="92" rx="9" ry="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
        <ellipse cx="112" cy="94" rx="9" ry="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
        <ellipse cx="208" cy="94" rx="9" ry="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
        <ellipse cx="244" cy="92" rx="9" ry="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />

        {/* Warm Bread Basket */}
        <ellipse cx="128" cy="91" rx="10" ry="4" fill="#92400e" />
        <ellipse cx="128" cy="89" rx="8" ry="3" fill="#fef3c7" />

        {/* Wine Glasses with Burgundy Red Wine */}
        <g transform="translate(90, 82)">
          <polygon points="2,0 6,0 4,6 4,11 6,11 2,11 4,11 4,6" stroke="#ffffff" strokeWidth="0.8" fill="none" opacity="0.85" />
          <polygon points="2.5,2 5.5,2 4,5" fill="#991b1b" />
        </g>
        <g transform="translate(227, 82)">
          <polygon points="2,0 6,0 4,6 4,11 6,11 2,11 4,11 4,6" stroke="#ffffff" strokeWidth="0.8" fill="none" opacity="0.85" />
          <polygon points="2.5,2 5.5,2 4,5" fill="#991b1b" />
        </g>

        {/* FRONT ROW CHAIR FRAMES */}
        <g transform="translate(64, 102)">
          <ellipse cx="18" cy="16" rx="15" ry="5.5" fill="#582a0d" stroke="#8d4013" strokeWidth="0.8" />
          <line x1="7" y1="18" x2="5" y2="46" stroke="#2d1306" strokeWidth="3.5" />
          <line x1="29" y1="18" x2="31" y2="46" stroke="#2d1306" strokeWidth="3.5" />
        </g>
        <g transform="translate(142, 104)">
          <ellipse cx="18" cy="16" rx="15" ry="5.5" fill="#582a0d" stroke="#8d4013" strokeWidth="0.8" />
          <line x1="7" y1="18" x2="5" y2="46" stroke="#2d1306" strokeWidth="3.5" />
          <line x1="29" y1="18" x2="31" y2="46" stroke="#2d1306" strokeWidth="3.5" />
        </g>
        <g transform="translate(220, 102)">
          <ellipse cx="18" cy="16" rx="15" ry="5.5" fill="#582a0d" stroke="#8d4013" strokeWidth="0.8" />
          <line x1="7" y1="18" x2="5" y2="46" stroke="#2d1306" strokeWidth="3.5" />
          <line x1="29" y1="18" x2="31" y2="46" stroke="#2d1306" strokeWidth="3.5" />
        </g>
      </svg>
    </div>
  );
}

export function PreciousTableGathering() {
  return (
    <>
      {/* 
        ====================================================================
        TABLE 1: LEFT SIDE DINING TABLE & 6 GUESTS
        Spawns after 3 seconds with golden aura, 6 guests walk in,
        sit down, and their legs stop moving completely!
        ====================================================================
      */}
      <div className="absolute bottom-1 sm:bottom-2 left-[2%] sm:left-[4%] md:left-[6%] w-72 sm:w-80 md:w-92 h-44 sm:h-52 pointer-events-none select-none z-20">
        <div className="table-spawn relative w-full h-full">
          {/* Golden Particle Spawn Pulse (active at 3s) */}
          <div className="table-spawn-burst absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-32 rounded-full border-2 border-[#c6a568] bg-[#c6a568]/15 blur-sm" />
          </div>


          {/* BACK ROW GUESTS (Behind Table Surface, z-10) */}
          {/* Guest L1 (Seat 1 - Back Left) */}
          <div className="absolute bottom-10 left-[6%] z-10 dinner-guest-L1 pointer-events-auto">
            <div className="relative w-14 sm:w-16 md:w-18 h-36 sm:h-42 md:h-48">
              <svg viewBox="0 0 100 200" className="w-full h-full drop-shadow-md">
                <ellipse cx="50" cy="192" rx="18" ry="3.5" fill="#0f172a" opacity="0.22" />
                {/* Walking Legs: Steps constantly while walking */}
                <g className="guest-walking-legs-L1">
                  <g className="guest-legs-stride-front">
                    <path d="M 46 115 L 42 155 L 38 188" stroke="#64748b" strokeWidth="11" strokeLinecap="round" />
                    <path d="M 38 188 L 26 191 L 39 193 Z" fill="#1e293b" />
                  </g>
                  <g className="guest-legs-stride-back">
                    <path d="M 54 115 L 58 155 L 62 188" stroke="#94a3b8" strokeWidth="11" strokeLinecap="round" />
                    <path d="M 62 188 L 74 191 L 61 193 Z" fill="#1e293b" />
                  </g>
                </g>
                {/* Seated Resting Legs: Motionless once seated at table */}
                <g className="guest-seated-legs-L1">
                  <path d="M 46 120 L 46 155 L 42 180" stroke="#64748b" strokeWidth="10.5" strokeLinecap="round" />
                  <path d="M 42 180 L 32 183 L 42 185 Z" fill="#1e293b" />
                  <path d="M 54 120 L 54 155 L 58 180" stroke="#94a3b8" strokeWidth="10.5" strokeLinecap="round" />
                  <path d="M 58 180 L 68 183 L 58 185 Z" fill="#1e293b" />
                </g>
                <g className="guest-torso-1">
                  <path d="M 36 68 L 64 68 L 60 118 L 40 118 Z" fill="#1e3a8a" />
                  <rect x="38" y="112" width="24" height="6" fill="#475569" />
                  <g className="guest-arm-toast">
                    <path d="M 62 72 L 74 95 L 82 80" stroke="#1e3a8a" strokeWidth="7" strokeLinecap="round" fill="none" />
                    <circle cx="83" cy="78" r="4" fill="#fbcfe8" />
                    <polygon points="81,72 87,72 84,77 84,81" fill="#991b1b" stroke="#ffffff" strokeWidth="0.6" />
                  </g>
                  <rect x="47" y="56" width="6" height="12" fill="#fbcfe8" />
                  <ellipse cx="50" cy="46" rx="9" ry="11" fill="#fbcfe8" />
                  <path d="M 40 46 C 40 34 60 34 60 46 Z" fill="#0f172a" />
                </g>
              </svg>
            </div>
          </div>

          {/* Guest L2 (Seat 2 - Back Center) */}
          <div className="absolute bottom-10 left-[34%] z-10 dinner-guest-L2 pointer-events-auto">
            <div className="relative w-15 sm:w-17 md:w-19 h-38 sm:h-44 md:h-50">
              <svg viewBox="0 0 100 210" className="w-full h-full drop-shadow-md">
                <ellipse cx="50" cy="202" rx="20" ry="3.5" fill="#0f172a" opacity="0.22" />
                <g className="guest-walking-legs-L2">
                  <g className="guest-legs-stride-front">
                    <path d="M 44 125 L 40 165 L 36 198" stroke="#1e293b" strokeWidth="12" strokeLinecap="round" />
                    <path d="M 36 198 L 22 201 L 37 203 Z" fill="#020617" />
                  </g>
                  <g className="guest-legs-stride-back">
                    <path d="M 56 125 L 60 165 L 64 198" stroke="#334155" strokeWidth="12" strokeLinecap="round" />
                    <path d="M 64 198 L 78 201 L 63 203 Z" fill="#020617" />
                  </g>
                </g>
                <g className="guest-seated-legs-L2">
                  <path d="M 44 128 L 44 165 L 40 190" stroke="#1e293b" strokeWidth="11" strokeLinecap="round" />
                  <path d="M 40 190 L 28 193 L 40 195 Z" fill="#020617" />
                  <path d="M 56 128 L 56 165 L 60 190" stroke="#334155" strokeWidth="11" strokeLinecap="round" />
                  <path d="M 60 190 L 72 193 L 60 195 Z" fill="#020617" />
                </g>
                <g className="guest-torso-1">
                  <path d="M 32 70 L 68 70 L 65 130 L 35 130 Z" fill="#1e293b" />
                  <polygon points="50,70 45,95 55,95" fill="#ffffff" />
                  <polygon points="50,75 48,98 52,98" fill="#691C35" />
                  <g className="guest-arm-gesturing">
                    <path d="M 66 74 L 75 105 L 85 96" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" fill="none" />
                    <circle cx="86" cy="94" r="4" fill="#fed7aa" />
                  </g>
                  <rect x="47" y="58" width="6" height="12" fill="#fed7aa" />
                  <ellipse cx="50" cy="46" rx="9.5" ry="11" fill="#fed7aa" />
                  <path d="M 40 44 C 40 32 60 32 60 44 Z" fill="#f8fafc" />
                  <path d="M 44 48 C 44 58 56 58 56 48 Z" fill="#f8fafc" />
                </g>
              </svg>
            </div>
          </div>

          {/* Guest L3 (Seat 3 - Back Right) */}
          <div className="absolute bottom-10 left-[62%] z-10 dinner-guest-L3 pointer-events-auto">
            <div className="relative w-14 sm:w-16 md:w-18 h-36 sm:h-42 md:h-48">
              <svg viewBox="0 0 100 200" className="w-full h-full drop-shadow-md">
                <ellipse cx="50" cy="192" rx="17" ry="3.5" fill="#0f172a" opacity="0.22" />
                <g className="guest-walking-legs-L3">
                  <g className="guest-legs-stride-front">
                    <path d="M 47 135 L 44 165 L 42 188" stroke="#ca8a04" strokeWidth="8" strokeLinecap="round" />
                    <path d="M 42 188 L 32 191 L 43 192 Z" fill="#0f172a" />
                  </g>
                  <g className="guest-legs-stride-back">
                    <path d="M 53 135 L 56 165 L 58 188" stroke="#eab308" strokeWidth="8" strokeLinecap="round" />
                    <path d="M 58 188 L 68 191 L 57 192 Z" fill="#0f172a" />
                  </g>
                </g>
                <g className="guest-seated-legs-L3">
                  <path d="M 47 138 L 47 165 L 43 185" stroke="#ca8a04" strokeWidth="8" strokeLinecap="round" />
                  <path d="M 43 185 L 34 187 L 43 188 Z" fill="#0f172a" />
                  <path d="M 53 138 L 53 165 L 57 185" stroke="#eab308" strokeWidth="8" strokeLinecap="round" />
                  <path d="M 57 185 L 66 187 L 57 188 Z" fill="#0f172a" />
                </g>
                <g className="guest-torso-1">
                  <path d="M 38 68 L 62 68 L 70 142 L 30 142 Z" fill="#eab308" />
                  <rect x="36" y="98" width="28" height="5" fill="#ca8a04" />
                  <g className="guest-arm-toast">
                    <path d="M 64 72 L 70 102 L 78 88" stroke="#eab308" strokeWidth="6.5" strokeLinecap="round" fill="none" />
                    <circle cx="79" cy="86" r="3.5" fill="#78350f" />
                    <polygon points="77,80 83,80 80,85 80,89" fill="#991b1b" stroke="#ffffff" strokeWidth="0.6" />
                  </g>
                  <rect x="47" y="56" width="6" height="12" fill="#78350f" />
                  <ellipse cx="50" cy="46" rx="9" ry="11" fill="#78350f" />
                  <path d="M 40 44 C 40 30 60 30 60 44 Z" fill="#1c1917" />
                </g>
              </svg>
            </div>
          </div>

          {/* TABLE BODY (Middle Layer, z-20) */}
          <DiningTableSVG tableId="leftTable" />

          {/* FRONT ROW GUESTS (In Front of Table, z-30) */}
          {/* Guest L4 (Seat 4 - Front Left) */}
          <div className="absolute bottom-0 left-[10%] z-30 dinner-guest-L4 pointer-events-auto">
            <div className="relative w-14 sm:w-16 md:w-18 h-36 sm:h-42 md:h-48">
              <svg viewBox="0 0 100 200" className="w-full h-full drop-shadow-md">
                <ellipse cx="50" cy="192" rx="18" ry="3.5" fill="#0f172a" opacity="0.22" />
                <g className="guest-walking-legs-L4">
                  <g className="guest-legs-stride-front">
                    <path d="M 45 120 L 40 160 L 36 190" stroke="#7c3aed" strokeWidth="11" strokeLinecap="round" />
                    <path d="M 36 190 L 24 192 L 37 194 Z" fill="#0f172a" />
                  </g>
                  <g className="guest-legs-stride-back">
                    <path d="M 55 120 L 60 160 L 64 190" stroke="#9333ea" strokeWidth="11" strokeLinecap="round" />
                    <path d="M 64 190 L 76 192 L 63 194 Z" fill="#0f172a" />
                  </g>
                </g>
                <g className="guest-seated-legs-L4">
                  <path d="M 45 125 L 45 155 L 40 180" stroke="#7c3aed" strokeWidth="10.5" strokeLinecap="round" />
                  <path d="M 40 180 L 30 183 L 40 185 Z" fill="#0f172a" />
                  <path d="M 55 125 L 55 155 L 60 180" stroke="#9333ea" strokeWidth="10.5" strokeLinecap="round" />
                  <path d="M 60 180 L 70 183 L 60 185 Z" fill="#0f172a" />
                </g>
                <g className="guest-torso-1">
                  <path d="M 36 70 L 64 70 L 58 122 L 42 122 Z" fill="#cbd5e1" />
                  <g className="guest-arm-gesturing">
                    <path d="M 38 74 L 28 98 L 22 90" stroke="#cbd5e1" strokeWidth="7" strokeLinecap="round" fill="none" />
                    <circle cx="21" cy="88" r="3.5" fill="#fed7aa" />
                  </g>
                  <rect x="47" y="58" width="6" height="12" fill="#fed7aa" />
                  <ellipse cx="50" cy="48" rx="9" ry="11" fill="#fed7aa" />
                  <circle cx="50" cy="45" r="12" fill="#18181b" />
                </g>
              </svg>
            </div>
          </div>

          {/* Guest L5 (Seat 5 - Front Center) */}
          <div className="absolute bottom-0 left-[38%] z-30 dinner-guest-L5 pointer-events-auto">
            <div className="relative w-14 sm:w-16 md:w-18 h-36 sm:h-42 md:h-48">
              <svg viewBox="0 0 100 200" className="w-full h-full drop-shadow-md">
                <ellipse cx="50" cy="192" rx="18" ry="3.5" fill="#0f172a" opacity="0.22" />
                <g className="guest-walking-legs-L5">
                  <g className="guest-legs-stride-front">
                    <path d="M 46 120 L 42 160 L 38 188" stroke="#1e293b" strokeWidth="10.5" strokeLinecap="round" />
                    <path d="M 38 188 L 26 191 L 39 193 Z" fill="#020617" />
                  </g>
                  <g className="guest-legs-stride-back">
                    <path d="M 54 120 L 58 160 L 62 188" stroke="#334155" strokeWidth="10.5" strokeLinecap="round" />
                    <path d="M 62 188 L 74 191 L 61 193 Z" fill="#020617" />
                  </g>
                </g>
                <g className="guest-seated-legs-L5">
                  <path d="M 46 125 L 46 155 L 41 180" stroke="#1e293b" strokeWidth="10" strokeLinecap="round" />
                  <path d="M 41 180 L 31 183 L 41 185 Z" fill="#020617" />
                  <path d="M 54 125 L 54 155 L 59 180" stroke="#334155" strokeWidth="10" strokeLinecap="round" />
                  <path d="M 59 180 L 69 183 L 59 185 Z" fill="#020617" />
                </g>
                <g className="guest-torso-1">
                  <path d="M 34 68 L 66 68 L 62 126 L 38 126 Z" fill="#047857" />
                  <g className="guest-arm-gesturing">
                    <path d="M 64 72 L 76 96 L 82 85" stroke="#047857" strokeWidth="7" strokeLinecap="round" fill="none" />
                    <circle cx="83" cy="83" r="3.5" fill="#fed7aa" />
                  </g>
                  <rect x="47" y="56" width="6" height="12" fill="#fed7aa" />
                  <ellipse cx="50" cy="46" rx="9" ry="10.5" fill="#fed7aa" />
                  <path d="M 41 45 C 41 33 59 33 59 45 Z" fill="#1e293b" />
                </g>
              </svg>
            </div>
          </div>

          {/* Guest L6 (Seat 6 - Front Right) */}
          <div className="absolute bottom-0 left-[66%] z-30 dinner-guest-L6 pointer-events-auto">
            <div className="relative w-14 sm:w-16 md:w-18 h-36 sm:h-42 md:h-48">
              <svg viewBox="0 0 100 200" className="w-full h-full drop-shadow-md">
                <ellipse cx="50" cy="192" rx="18" ry="3.5" fill="#0f172a" opacity="0.22" />
                <g className="guest-walking-legs-L6">
                  <g className="guest-legs-stride-front">
                    <path d="M 46 125 L 42 165 L 38 188" stroke="#1e3a8a" strokeWidth="10.5" strokeLinecap="round" />
                    <path d="M 38 188 L 26 191 L 39 193 Z" fill="#172554" />
                  </g>
                  <g className="guest-legs-stride-back">
                    <path d="M 54 125 L 58 165 L 62 188" stroke="#1d4ed8" strokeWidth="10.5" strokeLinecap="round" />
                    <path d="M 62 188 L 74 191 L 61 193 Z" fill="#172554" />
                  </g>
                </g>
                <g className="guest-seated-legs-L6">
                  <path d="M 46 128 L 46 155 L 41 180" stroke="#1e3a8a" strokeWidth="10" strokeLinecap="round" />
                  <path d="M 41 180 L 31 183 L 41 185 Z" fill="#172554" />
                  <path d="M 54 128 L 54 155 L 59 180" stroke="#1d4ed8" strokeWidth="10" strokeLinecap="round" />
                  <path d="M 59 180 L 69 183 L 59 185 Z" fill="#172554" />
                </g>
                <g className="guest-torso-1">
                  <path d="M 36 68 L 64 68 L 63 138 L 37 138 Z" fill="#b45309" />
                  <rect x="44" y="68" width="12" height="40" fill="#fef3c7" />
                  <g className="guest-arm-toast">
                    <path d="M 64 72 L 72 98 L 78 86" stroke="#b45309" strokeWidth="6.5" strokeLinecap="round" fill="none" />
                    <circle cx="79" cy="84" r="3.5" fill="#fcd34d" />
                    <polygon points="77,78 83,78 80,83 80,87" fill="#991b1b" stroke="#ffffff" strokeWidth="0.6" />
                  </g>
                  <rect x="47" y="56" width="6" height="12" fill="#fcd34d" />
                  <ellipse cx="50" cy="46" rx="9" ry="10.5" fill="#fcd34d" />
                  <path d="M 41 45 C 41 33 59 33 59 45 Z" fill="#451a03" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 
        ====================================================================
        TABLE 2: RIGHT SIDE DINING TABLE & 6 GUESTS
        Spawns after 3 seconds with golden aura, 6 guests walk in from left,
        sit down, and their legs stop moving completely!
        ====================================================================
      */}
      <div className="absolute bottom-1 sm:bottom-2 right-[2%] sm:right-[4%] md:right-[6%] w-72 sm:w-80 md:w-92 h-44 sm:h-52 pointer-events-none select-none z-20">
        <div className="table-spawn relative w-full h-full">
          {/* Golden Particle Spawn Pulse (active at 3s) */}
          <div className="table-spawn-burst absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-32 rounded-full border-2 border-[#c6a568] bg-[#c6a568]/15 blur-sm" />
          </div>


          {/* BACK ROW GUESTS (Behind Table Surface, z-10) */}
          {/* Guest R1 (Seat 1 - Back Left) */}
          <div className="absolute bottom-10 left-[6%] z-10 dinner-guest-R1 pointer-events-auto">
            <div className="relative w-14 sm:w-16 md:w-18 h-36 sm:h-42 md:h-48">
              <svg viewBox="0 0 100 200" className="w-full h-full drop-shadow-md">
                <ellipse cx="50" cy="192" rx="18" ry="3.5" fill="#0f172a" opacity="0.22" />
                <g className="guest-walking-legs-R1">
                  <g className="guest-legs-stride-front">
                    <path d="M 46 115 L 42 155 L 38 188" stroke="#f8fafc" strokeWidth="11" strokeLinecap="round" />
                    <path d="M 38 188 L 26 191 L 39 193 Z" fill="#78350f" />
                  </g>
                  <g className="guest-legs-stride-back">
                    <path d="M 54 115 L 58 155 L 62 188" stroke="#e2e8f0" strokeWidth="11" strokeLinecap="round" />
                    <path d="M 62 188 L 74 191 L 61 193 Z" fill="#78350f" />
                  </g>
                </g>
                <g className="guest-seated-legs-R1">
                  <path d="M 46 120 L 46 155 L 42 180" stroke="#f8fafc" strokeWidth="10.5" strokeLinecap="round" />
                  <path d="M 42 180 L 32 183 L 42 185 Z" fill="#78350f" />
                  <path d="M 54 120 L 54 155 L 58 180" stroke="#e2e8f0" strokeWidth="10.5" strokeLinecap="round" />
                  <path d="M 58 180 L 68 183 L 58 185 Z" fill="#78350f" />
                </g>
                <g className="guest-torso-1">
                  <path d="M 36 68 L 64 68 L 60 118 L 40 118 Z" fill="#691C35" />
                  <g className="guest-arm-toast">
                    <path d="M 62 72 L 74 95 L 82 80" stroke="#691C35" strokeWidth="7" strokeLinecap="round" fill="none" />
                    <circle cx="83" cy="78" r="4" fill="#fbcfe8" />
                    <polygon points="81,72 87,72 84,77 84,81" fill="#991b1b" stroke="#ffffff" strokeWidth="0.6" />
                  </g>
                  <rect x="47" y="56" width="6" height="12" fill="#fbcfe8" />
                  <ellipse cx="50" cy="46" rx="9" ry="11" fill="#fbcfe8" />
                  <path d="M 40 46 C 40 34 60 34 60 46 Z" fill="#0f172a" />
                </g>
              </svg>
            </div>
          </div>

          {/* Guest R2 (Seat 2 - Back Center) */}
          <div className="absolute bottom-10 left-[34%] z-10 dinner-guest-R2 pointer-events-auto">
            <div className="relative w-15 sm:w-17 md:w-19 h-38 sm:h-44 md:h-50">
              <svg viewBox="0 0 100 210" className="w-full h-full drop-shadow-md">
                <ellipse cx="50" cy="202" rx="20" ry="3.5" fill="#0f172a" opacity="0.22" />
                <g className="guest-walking-legs-R2">
                  <g className="guest-legs-stride-front">
                    <path d="M 44 125 L 40 165 L 36 198" stroke="#0f172a" strokeWidth="12" strokeLinecap="round" />
                    <path d="M 36 198 L 22 201 L 37 203 Z" fill="#020617" />
                  </g>
                  <g className="guest-legs-stride-back">
                    <path d="M 56 125 L 60 165 L 64 198" stroke="#1e293b" strokeWidth="12" strokeLinecap="round" />
                    <path d="M 64 198 L 78 201 L 63 203 Z" fill="#020617" />
                  </g>
                </g>
                <g className="guest-seated-legs-R2">
                  <path d="M 44 128 L 44 165 L 40 190" stroke="#0f172a" strokeWidth="11" strokeLinecap="round" />
                  <path d="M 40 190 L 28 193 L 40 195 Z" fill="#020617" />
                  <path d="M 56 128 L 56 165 L 60 190" stroke="#1e293b" strokeWidth="11" strokeLinecap="round" />
                  <path d="M 60 190 L 72 193 L 60 195 Z" fill="#020617" />
                </g>
                <g className="guest-torso-1">
                  <path d="M 32 70 L 68 70 L 65 130 L 35 130 Z" fill="#0f172a" />
                  <polygon points="50,70 45,95 55,95" fill="#ffffff" />
                  <polygon points="50,75 48,98 52,98" fill="#c6a568" />
                  <g className="guest-arm-gesturing">
                    <path d="M 66 74 L 75 105 L 85 96" stroke="#0f172a" strokeWidth="8" strokeLinecap="round" fill="none" />
                    <circle cx="86" cy="94" r="4" fill="#fed7aa" />
                  </g>
                  <circle cx="47" cy="46" r="3" fill="none" stroke="#0f172a" strokeWidth="1.2" />
                  <circle cx="53" cy="46" r="3" fill="none" stroke="#0f172a" strokeWidth="1.2" />
                  <rect x="47" y="58" width="6" height="12" fill="#fed7aa" />
                  <ellipse cx="50" cy="46" rx="9.5" ry="11" fill="#fed7aa" />
                  <path d="M 40 44 C 40 32 60 32 60 44 Z" fill="#334155" />
                </g>
              </svg>
            </div>
          </div>

          {/* Guest R3 (Seat 3 - Back Right) */}
          <div className="absolute bottom-10 left-[62%] z-10 dinner-guest-R3 pointer-events-auto">
            <div className="relative w-14 sm:w-16 md:w-18 h-36 sm:h-42 md:h-48">
              <svg viewBox="0 0 100 200" className="w-full h-full drop-shadow-md">
                <ellipse cx="50" cy="192" rx="17" ry="3.5" fill="#0f172a" opacity="0.22" />
                <g className="guest-walking-legs-R3">
                  <g className="guest-legs-stride-front">
                    <path d="M 47 135 L 44 165 L 42 188" stroke="#065f46" strokeWidth="8" strokeLinecap="round" />
                    <path d="M 42 188 L 32 191 L 43 192 Z" fill="#0f172a" />
                  </g>
                  <g className="guest-legs-stride-back">
                    <path d="M 53 135 L 56 165 L 58 188" stroke="#047857" strokeWidth="8" strokeLinecap="round" />
                    <path d="M 58 188 L 68 191 L 57 192 Z" fill="#0f172a" />
                  </g>
                </g>
                <g className="guest-seated-legs-R3">
                  <path d="M 47 138 L 47 165 L 43 185" stroke="#065f46" strokeWidth="8" strokeLinecap="round" />
                  <path d="M 43 185 L 34 187 L 43 188 Z" fill="#0f172a" />
                  <path d="M 53 138 L 53 165 L 57 185" stroke="#047857" strokeWidth="8" strokeLinecap="round" />
                  <path d="M 57 185 L 66 187 L 57 188 Z" fill="#0f172a" />
                </g>
                <g className="guest-torso-1">
                  <path d="M 38 68 L 62 68 L 70 142 L 30 142 Z" fill="#047857" />
                  <g className="guest-arm-toast">
                    <path d="M 64 72 L 70 102 L 78 88" stroke="#047857" strokeWidth="6.5" strokeLinecap="round" fill="none" />
                    <circle cx="79" cy="86" r="3.5" fill="#fcd34d" />
                    <polygon points="77,80 83,80 80,85 80,89" fill="#991b1b" stroke="#ffffff" strokeWidth="0.6" />
                  </g>
                  <rect x="47" y="56" width="6" height="12" fill="#fcd34d" />
                  <ellipse cx="50" cy="46" rx="9" ry="11" fill="#fcd34d" />
                  <path d="M 40 44 C 40 30 60 30 60 44 Z" fill="#1c1917" />
                </g>
              </svg>
            </div>
          </div>

          {/* TABLE BODY (Middle Layer, z-20) */}
          <DiningTableSVG tableId="rightTable" />

          {/* FRONT ROW GUESTS (In Front of Table, z-30) */}
          {/* Guest R4 (Seat 4 - Front Left) */}
          <div className="absolute bottom-0 left-[10%] z-30 dinner-guest-R4 pointer-events-auto">
            <div className="relative w-14 sm:w-16 md:w-18 h-36 sm:h-42 md:h-48">
              <svg viewBox="0 0 100 200" className="w-full h-full drop-shadow-md">
                <ellipse cx="50" cy="192" rx="18" ry="3.5" fill="#0f172a" opacity="0.22" />
                <g className="guest-walking-legs-R4">
                  <g className="guest-legs-stride-front">
                    <path d="M 45 120 L 40 160 L 36 190" stroke="#1f2937" strokeWidth="11" strokeLinecap="round" />
                    <path d="M 36 190 L 24 192 L 37 194 Z" fill="#b45309" />
                  </g>
                  <g className="guest-legs-stride-back">
                    <path d="M 55 120 L 60 160 L 64 190" stroke="#374151" strokeWidth="11" strokeLinecap="round" />
                    <path d="M 64 190 L 76 192 L 63 194 Z" fill="#b45309" />
                  </g>
                </g>
                <g className="guest-seated-legs-R4">
                  <path d="M 45 125 L 45 155 L 40 180" stroke="#1f2937" strokeWidth="10.5" strokeLinecap="round" />
                  <path d="M 40 180 L 30 183 L 40 185 Z" fill="#b45309" />
                  <path d="M 55 125 L 55 155 L 60 180" stroke="#374151" strokeWidth="10.5" strokeLinecap="round" />
                  <path d="M 60 180 L 70 183 L 60 185 Z" fill="#b45309" />
                </g>
                <g className="guest-torso-1">
                  <path d="M 36 70 L 64 70 L 58 122 L 42 122 Z" fill="#c2410c" />
                  <g className="guest-arm-gesturing">
                    <path d="M 38 74 L 28 98 L 22 90" stroke="#c2410c" strokeWidth="7" strokeLinecap="round" fill="none" />
                    <circle cx="21" cy="88" r="3.5" fill="#fed7aa" />
                  </g>
                  <rect x="47" y="58" width="6" height="12" fill="#fed7aa" />
                  <ellipse cx="50" cy="48" rx="9" ry="11" fill="#fed7aa" />
                  <path d="M 42 46 C 42 36 58 36 58 46 Z" fill="#451a03" />
                </g>
              </svg>
            </div>
          </div>

          {/* Guest R5 (Seat 5 - Front Center) */}
          <div className="absolute bottom-0 left-[38%] z-30 dinner-guest-R5 pointer-events-auto">
            <div className="relative w-14 sm:w-16 md:w-18 h-36 sm:h-42 md:h-48">
              <svg viewBox="0 0 100 200" className="w-full h-full drop-shadow-md">
                <ellipse cx="50" cy="192" rx="18" ry="3.5" fill="#0f172a" opacity="0.22" />
                <g className="guest-walking-legs-R5">
                  <g className="guest-legs-stride-front">
                    <path d="M 46 120 L 42 160 L 38 188" stroke="#374151" strokeWidth="10.5" strokeLinecap="round" />
                    <path d="M 38 188 L 26 191 L 39 193 Z" fill="#111827" />
                  </g>
                  <g className="guest-legs-stride-back">
                    <path d="M 54 120 L 58 160 L 62 188" stroke="#4b5563" strokeWidth="10.5" strokeLinecap="round" />
                    <path d="M 62 188 L 74 191 L 61 193 Z" fill="#111827" />
                  </g>
                </g>
                <g className="guest-seated-legs-R5">
                  <path d="M 46 125 L 46 155 L 41 180" stroke="#374151" strokeWidth="10" strokeLinecap="round" />
                  <path d="M 41 180 L 31 183 L 41 185 Z" fill="#111827" />
                  <path d="M 54 125 L 54 155 L 59 180" stroke="#4b5563" strokeWidth="10" strokeLinecap="round" />
                  <path d="M 59 180 L 69 183 L 59 185 Z" fill="#111827" />
                </g>
                <g className="guest-torso-1">
                  <path d="M 34 68 L 66 68 L 62 126 L 38 126 Z" fill="#4d7c0f" />
                  <g className="guest-arm-gesturing">
                    <path d="M 64 72 L 76 96 L 82 85" stroke="#4d7c0f" strokeWidth="7" strokeLinecap="round" fill="none" />
                    <circle cx="83" cy="83" r="3.5" fill="#fed7aa" />
                  </g>
                  <rect x="47" y="56" width="6" height="12" fill="#fed7aa" />
                  <ellipse cx="50" cy="46" rx="9" ry="10.5" fill="#fed7aa" />
                  <path d="M 41 45 C 41 33 59 33 59 45 Z" fill="#991b1b" />
                </g>
              </svg>
            </div>
          </div>

          {/* Guest R6 (Seat 6 - Front Right) */}
          <div className="absolute bottom-0 left-[66%] z-30 dinner-guest-R6 pointer-events-auto">
            <div className="relative w-14 sm:w-16 md:w-18 h-36 sm:h-42 md:h-48">
              <svg viewBox="0 0 100 200" className="w-full h-full drop-shadow-md">
                <ellipse cx="50" cy="192" rx="18" ry="3.5" fill="#0f172a" opacity="0.22" />
                <g className="guest-walking-legs-R6">
                  <g className="guest-legs-stride-front">
                    <path d="M 46 125 L 42 165 L 38 188" stroke="#f8fafc" strokeWidth="10.5" strokeLinecap="round" />
                    <path d="M 38 188 L 26 191 L 39 193 Z" fill="#78350f" />
                  </g>
                  <g className="guest-legs-stride-back">
                    <path d="M 54 125 L 58 165 L 62 188" stroke="#cbd5e1" strokeWidth="10.5" strokeLinecap="round" />
                    <path d="M 62 188 L 74 191 L 61 193 Z" fill="#78350f" />
                  </g>
                </g>
                <g className="guest-seated-legs-R6">
                  <path d="M 46 128 L 46 155 L 41 180" stroke="#f8fafc" strokeWidth="10" strokeLinecap="round" />
                  <path d="M 41 180 L 31 183 L 41 185 Z" fill="#78350f" />
                  <path d="M 54 128 L 54 155 L 59 180" stroke="#cbd5e1" strokeWidth="10" strokeLinecap="round" />
                  <path d="M 59 180 L 69 183 L 59 185 Z" fill="#78350f" />
                </g>
                <g className="guest-torso-1">
                  <path d="M 36 68 L 64 68 L 63 138 L 37 138 Z" fill="#a855f7" />
                  <g className="guest-arm-toast">
                    <path d="M 64 72 L 72 98 L 78 86" stroke="#a855f7" strokeWidth="6.5" strokeLinecap="round" fill="none" />
                    <circle cx="79" cy="84" r="3.5" fill="#fcd34d" />
                    <polygon points="77,78 83,78 80,83 80,87" fill="#991b1b" stroke="#ffffff" strokeWidth="0.6" />
                  </g>
                  <rect x="47" y="56" width="6" height="12" fill="#fcd34d" />
                  <ellipse cx="50" cy="46" rx="9" ry="10.5" fill="#fcd34d" />
                  <circle cx="50" cy="43" r="10" fill="#3b0764" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
