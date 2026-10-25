import React from "react";

export function SummitSky({ isNight = false }: { isNight?: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-10">
      {/* Night Sky Overlay Tint (Day mode is transparent so Delhi background shows through) */}
      {isNight && (
        <div className="absolute inset-0 bg-[#071326]/75 transition-colors duration-1000" />
      )}

      {/* Radiant Warm Golden Sun (Upper Right Corner) */}
      <div className="absolute top-5 right-6 sm:top-8 sm:right-14 z-10 flex items-center justify-center pointer-events-none">
        <div className="relative size-20 sm:size-28 flex items-center justify-center">
          {/* Ambient Warm Golden Glow */}
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

            {/* Inner Sun Core */}
            <circle cx="60" cy="60" r="28" fill="url(#sunGlow)" />
            {/* Luminous Corona Ring */}
            <circle cx="60" cy="60" r="32" fill="none" stroke="#fef08a" strokeWidth="2.5" opacity="0.6" />
          </svg>
        </div>
      </div>

      {/* Floating Animated Clouds Layer (6 Layered Puffy Clouds) */}
      <div className="absolute inset-0">
        {/* Cloud 1: High slow drifting left-to-right */}
        <div
          className="absolute top-8 opacity-80 animate-[cloudDrift_75s_linear_infinite]"
          style={{ width: "240px", left: "-260px" }}
        >
          <svg viewBox="0 0 200 80" className="w-full fill-white drop-shadow-sm">
            <path d="M 30 70 A 25 25 0 0 1 70 45 A 35 35 0 0 1 130 40 A 28 28 0 0 1 175 70 Z" />
          </svg>
        </div>

        {/* Cloud 2: Fluffy mid-level cloud */}
        <div
          className="absolute top-20 opacity-85 animate-[cloudDrift_55s_linear_infinite]"
          style={{ width: "320px", left: "-350px", animationDelay: "12s" }}
        >
          <svg viewBox="0 0 300 100" className="w-full fill-white/90 drop-shadow-sm">
            <path d="M 20 85 A 30 30 0 0 1 60 50 A 45 45 0 0 1 130 30 A 50 50 0 0 1 210 40 A 35 35 0 0 1 270 85 Z" />
          </svg>
        </div>

        {/* Cloud 3: Right cloud drifting smoothly */}
        <div
          className="absolute top-28 opacity-75 animate-[cloudDrift_65s_linear_infinite]"
          style={{ width: "220px", left: "-240px", animationDelay: "28s" }}
        >
          <svg viewBox="0 0 220 80" className="w-full fill-white drop-shadow-sm">
            <path d="M 15 75 A 25 25 0 0 1 65 50 A 38 38 0 0 1 140 45 A 30 30 0 0 1 195 75 Z" />
          </svg>
        </div>

        {/* Cloud 4 (New): Wide gentle high-altitude cloud */}
        <div
          className="absolute top-3 opacity-70 animate-[cloudDrift_80s_linear_infinite]"
          style={{ width: "280px", left: "-300px", animationDelay: "-22s" }}
        >
          <svg viewBox="0 0 280 85" className="w-full fill-white/85 drop-shadow-sm">
            <path d="M 25 75 A 24 24 0 0 1 65 52 A 38 38 0 0 1 140 38 A 42 42 0 0 1 215 45 A 28 28 0 0 1 260 75 Z" />
          </svg>
        </div>

        {/* Cloud 5 (New): Puffy central cumulus cloud */}
        <div
          className="absolute top-14 opacity-90 animate-[cloudDrift_58s_linear_infinite]"
          style={{ width: "310px", left: "-330px", animationDelay: "-38s" }}
        >
          <svg viewBox="0 0 310 95" className="w-full fill-white/95 drop-shadow-sm">
            <path d="M 20 80 A 28 28 0 0 1 65 48 A 46 46 0 0 1 145 28 A 48 48 0 0 1 225 36 A 34 34 0 0 1 285 80 Z" />
          </svg>
        </div>

        {/* Cloud 6 (New): Compact lower floating cloud */}
        <div
          className="absolute top-36 opacity-80 animate-[cloudDrift_68s_linear_infinite]"
          style={{ width: "230px", left: "-250px", animationDelay: "-14s" }}
        >
          <svg viewBox="0 0 230 80" className="w-full fill-white/90 drop-shadow-sm">
            <path d="M 18 72 A 22 22 0 0 1 60 48 A 36 36 0 0 1 135 40 A 30 30 0 0 1 195 50 A 22 22 0 0 1 215 72 Z" />
          </svg>
        </div>
      </div>

      {/* Flying Animated Mini Helicopter across the sky */}
      <div
        className="absolute z-20 animate-[helicopterFlight_32s_linear_infinite]"
        style={{ top: "14%", left: "105%" }}
      >
        <div className="relative w-20 h-10 -scale-x-100">
          <svg viewBox="0 0 120 60" className="w-full h-full">
            {/* Spinning Rotor Blades */}
            <g className="animate-[spin_0.08s_linear_infinite]" style={{ transformOrigin: "58px 12px" }}>
              <ellipse cx="58" cy="12" rx="42" ry="2.2" fill="#64748b" opacity="0.8" />
              <line x1="16" y1="12" x2="100" y2="12" stroke="#334155" strokeWidth="2.5" />
            </g>
            {/* Rotor Mast */}
            <rect x="56" y="12" width="4" height="8" fill="#475569" />
            {/* Cockpit Bubble */}
            <path d="M 38 32 C 38 20 50 20 68 20 C 80 20 88 28 88 38 C 88 44 80 46 62 46 C 44 46 38 42 38 32 Z" fill="#94a3b8" />
            <path d="M 64 22 C 75 22 84 27 84 35 C 84 41 78 43 64 43 Z" fill="#38bdf8" opacity="0.8" />
            {/* Tail Boom & Tail Rotor */}
            <polygon points="38,28 8,32 8,36 38,38" fill="#64748b" />
            <rect x="6" y="24" width="3" height="18" fill="#475569" />
            <g className="animate-[spin_0.06s_linear_infinite]" style={{ transformOrigin: "7px 24px" }}>
              <ellipse cx="7" cy="24" rx="1.5" ry="12" fill="#94a3b8" opacity="0.9" />
            </g>
            {/* Landing Skids */}
            <line x1="42" y1="46" x2="40" y2="52" stroke="#475569" strokeWidth="2.5" />
            <line x1="68" y1="46" x2="66" y2="52" stroke="#475569" strokeWidth="2.5" />
            <line x1="32" y1="52" x2="78" y2="52" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Silhouette Flock of Birds Gliding in Sky */}
      <div
        className="absolute z-10 animate-[flockFly_45s_linear_infinite]"
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
