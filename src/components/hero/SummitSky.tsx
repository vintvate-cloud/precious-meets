import React, { useMemo } from "react";

interface SummitSkyProps {
  isNight?: boolean;
}

// 40 deterministic stars scattered across the upper night sky
const STAR_FIELD = [
  { top: "5%", left: "8%", size: 1.5, delay: "0s", duration: "3s" },
  { top: "8%", left: "22%", size: 2.2, delay: "1.2s", duration: "4s" },
  { top: "12%", left: "35%", size: 1.2, delay: "0.5s", duration: "2.5s" },
  { top: "6%", left: "48%", size: 2, delay: "2.1s", duration: "3.5s" },
  { top: "10%", left: "62%", size: 1.8, delay: "1.7s", duration: "4.2s" },
  { top: "4%", left: "76%", size: 2.4, delay: "0.8s", duration: "3.2s" },
  { top: "15%", left: "88%", size: 1.5, delay: "2.5s", duration: "2.8s" },
  { top: "18%", left: "14%", size: 2, delay: "1.9s", duration: "3.8s" },
  { top: "22%", left: "28%", size: 1.2, delay: "0.3s", duration: "4.5s" },
  { top: "16%", left: "42%", size: 2.2, delay: "2.7s", duration: "3.1s" },
  { top: "20%", left: "55%", size: 1.6, delay: "1.1s", duration: "3.6s" },
  { top: "14%", left: "69%", size: 2, delay: "0.9s", duration: "4s" },
  { top: "24%", left: "82%", size: 1.4, delay: "2.3s", duration: "2.9s" },
  { top: "7%", left: "94%", size: 2.5, delay: "1.4s", duration: "3.7s" },
  { top: "28%", left: "6%", size: 1.8, delay: "0.6s", duration: "4.1s" },
  { top: "30%", left: "19%", size: 1.3, delay: "2s", duration: "3.3s" },
  { top: "26%", left: "38%", size: 2, delay: "1.5s", duration: "3.9s" },
  { top: "32%", left: "51%", size: 1.5, delay: "0.2s", duration: "4.3s" },
  { top: "25%", left: "65%", size: 2.2, delay: "2.8s", duration: "3.4s" },
  { top: "34%", left: "78%", size: 1.6, delay: "1.3s", duration: "3s" },
  { top: "29%", left: "91%", size: 2.3, delay: "0.7s", duration: "4.6s" },
  { top: "11%", left: "4%", size: 1.2, delay: "2.4s", duration: "3.5s" },
  { top: "3%", left: "31%", size: 2, delay: "1s", duration: "4s" },
  { top: "9%", left: "45%", size: 1.7, delay: "1.8s", duration: "3.2s" },
  { top: "17%", left: "58%", size: 2.5, delay: "0.4s", duration: "4.4s" },
  { top: "2%", left: "71%", size: 1.4, delay: "2.2s", duration: "3.6s" },
  { top: "13%", left: "84%", size: 2.1, delay: "1.6s", duration: "3.8s" },
  { top: "21%", left: "97%", size: 1.5, delay: "0.1s", duration: "2.7s" },
];

export function SummitSky({ isNight = false }: SummitSkyProps) {
  // Cloud fill & shadow classes based on day/night
  const cloudFill = isNight ? "fill-slate-200/35 drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]" : "fill-white/90 drop-shadow-sm";
  const cloudFillDense = isNight ? "fill-slate-200/40 drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]" : "fill-white/95 drop-shadow-sm";

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-10 transition-colors duration-1000">

      {/* ========================================================================= */}
      {/* 1. TWINKLING STARFIELD (Only Active in Evening/Night)                     */}
      {/* ========================================================================= */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          isNight ? "opacity-100" : "opacity-0"
        }`}
      >
        {STAR_FIELD.map((star, idx) => (
          <span
            key={idx}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: star.delay,
              animationDuration: star.duration,
              boxShadow: star.size > 2 ? "0 0 6px 1px rgba(255,255,255,0.8)" : "0 0 3px rgba(255,255,255,0.6)",
            }}
          />
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 2. CELESTIAL BODIES (DAY SUN vs NIGHT MOON)                               */}
      {/* ========================================================================= */}
      {/* DAY: Radiant Warm Golden Sun */}
      <div
        className={`absolute top-5 right-6 sm:top-8 sm:right-14 z-10 flex items-center justify-center transition-all duration-1000 ${
          isNight ? "opacity-0 scale-75 translate-y-4 pointer-events-none" : "opacity-100 scale-100 translate-y-0"
        }`}
      >
        <div className="relative size-20 sm:size-28 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-amber-400/35 blur-2xl animate-pulse" />

          <svg viewBox="0 0 120 120" className="size-16 sm:size-24 drop-shadow-md">
            <defs>
              <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fffbeb" />
                <stop offset="55%" stopColor="#fef08a" />
                <stop offset="85%" stopColor="#facc15" />
                <stop offset="100%" stopColor="#f59e0b" />
              </radialGradient>
            </defs>

            {/* Rotating Subtle Sun Rays */}
            <g className="animate-[spin_70s_linear_infinite]" style={{ transformOrigin: "60px 60px" }} opacity="0.9">
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                <line
                  key={deg}
                  x1="60"
                  y1="14"
                  x2="60"
                  y2="26"
                  stroke="#fbbf24"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  transform={`rotate(${deg} 60 60)`}
                />
              ))}
            </g>

            <circle cx="60" cy="60" r="28" fill="url(#sunGlow)" />
            <circle cx="60" cy="60" r="32" fill="none" stroke="#fef08a" strokeWidth="2.5" opacity="0.6" />
          </svg>
        </div>
      </div>

      {/* NIGHT: Luminous Crescent / Full Pearl Moon with Atmospheric Corona */}
      <div
        className={`absolute top-5 right-6 sm:top-8 sm:right-16 z-10 flex items-center justify-center transition-all duration-1000 ${
          isNight ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-75 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="relative size-20 sm:size-28 flex items-center justify-center">
          {/* Multi-layered Soft Moonlight Corona Halo */}
          <div className="absolute inset-0 rounded-full bg-cyan-200/20 blur-2xl animate-pulse" />
          <div className="absolute inset-2 rounded-full bg-amber-100/30 blur-xl" />

          <svg viewBox="0 0 120 120" className="size-16 sm:size-24 drop-shadow-[0_0_20px_rgba(255,255,255,0.7)]">
            <defs>
              <radialGradient id="moonSurface" cx="42%" cy="42%" r="58%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="65%" stopColor="#f8fafc" />
                <stop offset="88%" stopColor="#e2e8f0" />
                <stop offset="100%" stopColor="#cbd5e1" />
              </radialGradient>
              <radialGradient id="moonGlowRing" cx="50%" cy="50%" r="50%">
                <stop offset="85%" stopColor="#f8fafc" stopOpacity="0" />
                <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.8" />
              </radialGradient>
            </defs>

            {/* Glowing Moon Base Orb */}
            <circle cx="60" cy="60" r="26" fill="url(#moonSurface)" />

            {/* Delicate Crater Shading Accents */}
            <circle cx="52" cy="52" r="4.5" fill="#cbd5e1" opacity="0.45" />
            <circle cx="66" cy="48" r="3.2" fill="#cbd5e1" opacity="0.4" />
            <circle cx="68" cy="64" r="5" fill="#cbd5e1" opacity="0.35" />
            <circle cx="55" cy="70" r="3.5" fill="#cbd5e1" opacity="0.38" />
            <circle cx="44" cy="62" r="2.5" fill="#cbd5e1" opacity="0.3" />

            {/* Ambient Pearlescent Rim Corona */}
            <circle cx="60" cy="60" r="26" fill="url(#moonGlowRing)" />
            <circle cx="60" cy="60" r="29" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.45" />
          </svg>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. FLOATING ANIMATED CLOUDS (Day: Puffy White | Night: Moonlit Translucent)*/}
      {/* ========================================================================= */}
      <div className="absolute inset-0">
        {/* Cloud 1: High slow drifting left-to-right */}
        <div
          className="absolute top-8 opacity-80 animate-[cloudDrift_75s_linear_infinite]"
          style={{ width: "240px", left: "-260px" }}
        >
          <svg viewBox="0 0 200 80" className={`w-full transition-colors duration-1000 ${cloudFill}`}>
            <path d="M 30 70 A 25 25 0 0 1 70 45 A 35 35 0 0 1 130 40 A 28 28 0 0 1 175 70 Z" />
          </svg>
        </div>

        {/* Cloud 2: Fluffy mid-level cloud */}
        <div
          className="absolute top-20 opacity-85 animate-[cloudDrift_55s_linear_infinite]"
          style={{ width: "320px", left: "-350px", animationDelay: "12s" }}
        >
          <svg viewBox="0 0 300 100" className={`w-full transition-colors duration-1000 ${cloudFillDense}`}>
            <path d="M 20 85 A 30 30 0 0 1 60 50 A 45 45 0 0 1 130 30 A 50 50 0 0 1 210 40 A 35 35 0 0 1 270 85 Z" />
          </svg>
        </div>

        {/* Cloud 3: Right cloud drifting smoothly */}
        <div
          className="absolute top-28 opacity-75 animate-[cloudDrift_65s_linear_infinite]"
          style={{ width: "220px", left: "-240px", animationDelay: "28s" }}
        >
          <svg viewBox="0 0 220 80" className={`w-full transition-colors duration-1000 ${cloudFill}`}>
            <path d="M 15 75 A 25 25 0 0 1 65 50 A 38 38 0 0 1 140 45 A 30 30 0 0 1 195 75 Z" />
          </svg>
        </div>

        {/* Cloud 4: Wide gentle high-altitude cloud */}
        <div
          className="absolute top-3 opacity-70 animate-[cloudDrift_80s_linear_infinite]"
          style={{ width: "280px", left: "-300px", animationDelay: "-22s" }}
        >
          <svg viewBox="0 0 280 85" className={`w-full transition-colors duration-1000 ${cloudFill}`}>
            <path d="M 25 75 A 24 24 0 0 1 65 52 A 38 38 0 0 1 140 38 A 42 42 0 0 1 215 45 A 28 28 0 0 1 260 75 Z" />
          </svg>
        </div>

        {/* Cloud 5: Puffy central cumulus cloud */}
        <div
          className="absolute top-14 opacity-90 animate-[cloudDrift_58s_linear_infinite]"
          style={{ width: "310px", left: "-330px", animationDelay: "-38s" }}
        >
          <svg viewBox="0 0 310 95" className={`w-full transition-colors duration-1000 ${cloudFillDense}`}>
            <path d="M 20 80 A 28 28 0 0 1 65 48 A 46 46 0 0 1 145 28 A 48 48 0 0 1 225 36 A 34 34 0 0 1 285 80 Z" />
          </svg>
        </div>

        {/* Cloud 6: Compact lower floating cloud */}
        <div
          className="absolute top-36 opacity-80 animate-[cloudDrift_68s_linear_infinite]"
          style={{ width: "230px", left: "-250px", animationDelay: "-14s" }}
        >
          <svg viewBox="0 0 230 80" className={`w-full transition-colors duration-1000 ${cloudFill}`}>
            <path d="M 18 72 A 22 22 0 0 1 60 48 A 36 36 0 0 1 135 40 A 30 30 0 0 1 195 50 A 22 22 0 0 1 215 72 Z" />
          </svg>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. FLYING HELICOPTER (Day + Night Flight with Active Strobe Beacons)        */}
      {/* ========================================================================= */}
      <div
        className="absolute z-20 animate-[helicopterFlight_32s_linear_infinite]"
        style={{ top: "14%", left: "105%" }}
      >
        <div className="relative w-20 h-10 -scale-x-100">
          <svg viewBox="0 0 120 60" className="w-full h-full">
            {/* Spinning Rotor Blades */}
            <g className="animate-[spin_0.08s_linear_infinite]" style={{ transformOrigin: "58px 12px" }}>
              <ellipse cx="58" cy="12" rx="42" ry="2.2" fill={isNight ? "#94a3b8" : "#64748b"} opacity="0.85" />
              <line x1="16" y1="12" x2="100" y2="12" stroke={isNight ? "#475569" : "#334155"} strokeWidth="2.5" />
            </g>

            {/* Rotor Mast */}
            <rect x="56" y="12" width="4" height="8" fill="#475569" />

            {/* Cockpit Bubble */}
            <path
              d="M 38 32 C 38 20 50 20 68 20 C 80 20 88 28 88 38 C 88 44 80 46 62 46 C 44 46 38 42 38 32 Z"
              fill={isNight ? "#334155" : "#94a3b8"}
            />
            <path
              d="M 64 22 C 75 22 84 27 84 35 C 84 41 78 43 64 43 Z"
              fill={isNight ? "#38bdf8" : "#38bdf8"}
              opacity={isNight ? 0.95 : 0.8}
            />

            {/* Tail Boom & Tail Rotor */}
            <polygon points="38,28 8,32 8,36 38,38" fill={isNight ? "#1e293b" : "#64748b"} />
            <rect x="6" y="24" width="3" height="18" fill="#475569" />
            <g className="animate-[spin_0.06s_linear_infinite]" style={{ transformOrigin: "7px 24px" }}>
              <ellipse cx="7" cy="24" rx="1.5" ry="12" fill={isNight ? "#e2e8f0" : "#94a3b8"} opacity="0.9" />
            </g>

            {/* Landing Skids */}
            <line x1="42" y1="46" x2="40" y2="52" stroke="#475569" strokeWidth="2.5" />
            <line x1="68" y1="46" x2="66" y2="52" stroke="#475569" strokeWidth="2.5" />
            <line x1="32" y1="52" x2="78" y2="52" stroke={isNight ? "#1e293b" : "#334155"} strokeWidth="3" strokeLinecap="round" />

            {/* NIGHT FLIGHT ACTIVE STROBE BEACONS & SPOTLIGHT */}
            {isNight && (
              <>
                {/* Red Blinking Tail Strobe Beacon */}
                <circle cx="8" cy="24" r="2.8" fill="#ef4444" className="animate-ping" style={{ animationDuration: "1s" }} />
                <circle cx="8" cy="24" r="2" fill="#ff4d4d" />

                {/* Green Cockpit Wingtip Navigation Strobe */}
                <circle cx="80" cy="38" r="2.2" fill="#22c55e" className="animate-pulse" style={{ animationDuration: "0.8s" }} />

                {/* White Belly Anti-collision Strobe */}
                <circle cx="58" cy="48" r="2.2" fill="#ffffff" className="animate-ping" style={{ animationDuration: "1.4s" }} />

                {/* Downward Angle Night Searchlight Beam */}
                <polygon
                  points="76,44 86,44 115,70 95,70"
                  fill="url(#heloSearchlight)"
                  opacity="0.35"
                />
                <defs>
                  <linearGradient id="heloSearchlight" x1="0" y1="0" x2="0.6" y2="1">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#bae6fd" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </>
            )}
          </svg>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. SILHOUETTE FLOCK OF BIRDS (Active in Day Mode)                         */}
      {/* ========================================================================= */}
      <div
        className={`absolute z-10 animate-[flockFly_45s_linear_infinite] transition-opacity duration-1000 ${
          isNight ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        style={{ top: "18%", left: "65%" }}
      >
        <svg viewBox="0 0 160 60" className="w-24 sm:w-32 fill-slate-700/80">
          <path d="M 12 18 Q 16 12 20 18 Q 24 12 28 18 Q 24 16 20 20 Q 16 16 12 18 Z" />
          <path d="M 38 12 Q 42 6 46 12 Q 50 6 54 12 Q 50 10 46 14 Q 42 10 38 12 Z" />
          <path d="M 64 22 Q 68 17 72 22 Q 76 17 80 22 Q 76 20 72 24 Q 68 20 64 22 Z" />
          <path d="M 94 14 Q 97 9 100 14 Q 103 9 106 14 Q 103 12 100 16 Q 97 12 94 14 Z" />
        </svg>
      </div>
    </div>
  );
}
