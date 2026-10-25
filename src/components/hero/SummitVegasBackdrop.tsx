import React from "react";

export function SummitVegasBackdrop({ isNight = false }: { isNight?: boolean }) {
  return (
    <div className="absolute inset-x-0 bottom-0 top-[35%] overflow-hidden pointer-events-none select-none">
      {/* Distant Desert Hills & Mountains Horizon */}
      <div className="absolute inset-x-0 bottom-[14%] h-[60%]">
        <svg
          viewBox="0 0 1600 450"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          {/* Layer 1: Distant Pale Blue / Lavender Mountains */}
          <path
            d="M 0 350 L 140 280 L 290 320 L 460 270 L 680 340 L 920 290 L 1150 330 L 1380 220 L 1600 310 L 1600 450 L 0 450 Z"
            fill={isNight ? "#132b52" : "#b8d9f7"}
            opacity={isNight ? "0.85" : "0.7"}
          />

          {/* Layer 2: Mid-distance Rolling Ridge */}
          <path
            d="M 0 380 L 220 330 L 450 370 L 640 320 L 880 370 L 1100 310 L 1350 360 L 1600 290 L 1600 450 L 0 450 Z"
            fill={isNight ? "#193664" : "#cce4fb"}
            opacity={isNight ? "0.9" : "0.85"}
          />

          {/* Large Snow-Capped Mountain on the Right (Distinct signature feature of the image) */}
          <polygon
            points="1280,450 1480,140 1600,450"
            fill={isNight ? "#1c3c6f" : "#a1cbfa"}
          />
          {/* Snow Peak Cap (White triangular chevron) */}
          <polygon
            points="1430,220 1480,140 1530,220 1495,205 1480,225 1465,210"
            fill="#ffffff"
          />
          {/* Mountain Shadow Facet */}
          <polygon
            points="1480,140 1530,220 1600,450 1480,450"
            fill={isNight ? "#142d54" : "#7fb5f0"}
            opacity="0.4"
          />
        </svg>
      </div>

      {/* Volumetric Stage Spotlights (Beams radiating upwards from ground) */}
      <div className="absolute inset-x-0 bottom-[14%] h-full pointer-events-none">
        <svg viewBox="0 0 1600 700" preserveAspectRatio="none" className="w-full h-full">
          <defs>
            <linearGradient id="spotBeam1" x1="0.5" y1="1" x2="0.3" y2="0">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#e0f2fe" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#bae6fd" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="spotBeam2" x1="0.5" y1="1" x2="0.7" y2="0">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#e0f2fe" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#bae6fd" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="spotBeamWide" x1="0.5" y1="1" x2="0.5" y2="0">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
              <stop offset="60%" stopColor="#e0f2fe" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#bae6fd" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Sweeping Light 1 (Left-Center) */}
          <g className="animate-[beamSweepLeft_9s_easeInOutSine_infinite]" style={{ transformOrigin: "520px 600px" }}>
            <polygon points="515,600 525,600 360,0 260,0" fill="url(#spotBeam1)" />
          </g>

          {/* Sweeping Light 2 (Right-Center) */}
          <g className="animate-[beamSweepRight_11s_easeInOutSine_infinite]" style={{ transformOrigin: "940px 600px" }}>
            <polygon points="935,600 945,600 1100,0 1220,0" fill="url(#spotBeam2)" />
          </g>

          {/* Center Vertical Ambience Beam */}
          <polygon points="730,600 750,600 860,20 620,20" fill="url(#spotBeamWide)" />
        </svg>
      </div>

      {/* Las Vegas City Skyline & Landmarks Strip */}
      <div className="absolute inset-x-0 bottom-[14%] h-[32%] flex items-end">
        <svg viewBox="0 0 1600 240" preserveAspectRatio="none" className="w-full h-full">
          {/* Welcome to Las Vegas Sign (Left side landmark) */}
          <g transform="translate(65, 80)">
            {/* Supporting Posts */}
            <line x1="28" y1="50" x2="16" y2="150" stroke="#475569" strokeWidth="3" />
            <line x1="42" y1="50" x2="54" y2="150" stroke="#475569" strokeWidth="3" />
            <line x1="22" y1="100" x2="48" y2="100" stroke="#475569" strokeWidth="2" />
            {/* Yellow Neon Star on Top */}
            <polygon points="35,16 38,24 46,25 40,31 42,39 35,34 28,39 30,31 24,25 32,24" fill="#facc15" className="animate-pulse" />
            {/* Diamond Signboard */}
            <polygon points="35,28 72,56 35,84 -2,56" fill="#f8fafc" stroke="#0284c7" strokeWidth="2.5" />
            <polygon points="35,32 67,56 35,80 3,56" fill="#0369a1" />
            {/* Text simulation */}
            <text x="35" y="47" textAnchor="middle" fill="#fef08a" fontSize="7" fontWeight="bold" fontFamily="sans-serif">WELCOME</text>
            <text x="35" y="55" textAnchor="middle" fill="#ffffff" fontSize="5.5" fontWeight="bold" fontFamily="sans-serif">TO FABULOUS</text>
            <text x="35" y="66" textAnchor="middle" fill="#f87171" fontSize="9" fontWeight="900" fontFamily="sans-serif">LAS VEGAS</text>
            <text x="35" y="74" textAnchor="middle" fill="#38bdf8" fontSize="4.5" fontWeight="bold" fontFamily="sans-serif">NEVADA</text>
          </g>

          {/* Casino Resort Buildings & Glass Architecture */}
          {/* Strip Hotel 1: Golden Mandalay Bay block */}
          <rect x="120" y="110" width="55" height="110" fill={isNight ? "#ca8a04" : "#fef08a"} opacity={isNight ? "0.9" : "0.75"} rx="2" />
          <g fill={isNight ? "#fef08a" : "#ca8a04"} opacity="0.6">
            {[0, 1, 2, 3, 4, 5].map((row) => (
              <g key={row} transform={`translate(0, ${row * 15})`}>
                <rect x="125" y="120" width="6" height="8" />
                <rect x="135" y="120" width="6" height="8" />
                <rect x="145" y="120" width="6" height="8" />
                <rect x="155" y="120" width="6" height="8" />
              </g>
            ))}
          </g>

          {/* Strip Hotel 2: Luxor Pyramid (Purple/Amethyst) */}
          <polygon points="190,220 225,120 260,220" fill={isNight ? "#6b21a8" : "#a855f7"} opacity="0.85" />
          <polygon points="225,120 260,220 230,220" fill={isNight ? "#4a044e" : "#7e22ce"} opacity="0.5" />
          {/* Pyramid Sky Beam */}
          <polygon points="224,120 226,120 232,0 218,0" fill="#fef08a" opacity={isNight ? "0.45" : "0.15"} />

          {/* Strip Hotel 3: Modern Aqua Glass Resort */}
          <rect x="255" y="130" width="65" height="90" fill={isNight ? "#0369a1" : "#7dd3fc"} opacity="0.8" rx="2" />
          <rect x="315" y="120" width="40" height="100" fill={isNight ? "#0f766e" : "#5eead4"} opacity="0.75" rx="1" />

          {/* Strip Center Backdrop Architecture */}
          <rect x="440" y="135" width="45" height="85" fill={isNight ? "#1e293b" : "#cbd5e1"} opacity="0.7" />
          <rect x="495" y="125" width="60" height="95" fill={isNight ? "#334155" : "#e2e8f0"} opacity="0.8" />
          <rect x="565" y="140" width="55" height="80" fill={isNight ? "#1e293b" : "#cbd5e1"} opacity="0.75" />

          {/* Center-Right Strip Skyline */}
          <rect x="880" y="130" width="50" height="90" fill={isNight ? "#334155" : "#e2e8f0"} opacity="0.7" />
          <rect x="940" y="120" width="40" height="100" fill={isNight ? "#1e293b" : "#94a3b8"} opacity="0.65" />
          <rect x="990" y="135" width="55" height="85" fill={isNight ? "#0284c7" : "#bae6fd"} opacity="0.8" />

          {/* Stratosphere Observation Tower (Signature Vegas Needle) */}
          <g transform="translate(1085, 45)">
            {/* Tower Legs */}
            <line x1="12" y1="175" x2="22" y2="70" stroke="#64748b" strokeWidth="3" />
            <line x1="32" y1="175" x2="22" y2="70" stroke="#64748b" strokeWidth="3" />
            <rect x="20" y="55" width="4" height="120" fill="#475569" />
            {/* Observation Pod */}
            <ellipse cx="22" cy="55" rx="14" ry="7" fill={isNight ? "#0284c7" : "#e2e8f0"} stroke="#334155" strokeWidth="1.5" />
            <ellipse cx="22" cy="51" rx="9" ry="4" fill={isNight ? "#f59e0b" : "#64748b"} />
            {/* Spire Antenna */}
            <line x1="22" y1="47" x2="22" y2="15" stroke="#ef4444" strokeWidth="2" />
            <circle cx="22" cy="15" r="2.5" fill="#ef4444" className="animate-ping" />
          </g>

          {/* High Roller Observation Wheel (Ferris Wheel Outline) */}
          <g transform="translate(970, 75)" opacity="0.55">
            <circle cx="50" cy="55" r="42" fill="none" stroke="#64748b" strokeWidth="2.5" />
            <circle cx="50" cy="55" r="32" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="50" y1="55" x2="35" y2="145" stroke="#475569" strokeWidth="3" />
            <line x1="50" y1="55" x2="65" y2="145" stroke="#475569" strokeWidth="3" />
          </g>

          {/* Animated Wind Turbine Park (Continuous spinning 3-blade rotors) */}
          {/* Turbine 1 */}
          <g transform="translate(1160, 110)">
            <rect x="18" y="20" width="3" height="90" fill="#94a3b8" />
            <circle cx="19.5" cy="20" r="3.5" fill="#475569" />
            <g className="animate-[spin_4s_linear_infinite]" style={{ transformOrigin: "19.5px 20px" }}>
              <path d="M 19.5 20 L 17 0 L 22 0 Z" fill="#cbd5e1" stroke="#64748b" strokeWidth="0.5" />
              <path d="M 19.5 20 L 37 29 L 34 34 Z" fill="#cbd5e1" stroke="#64748b" strokeWidth="0.5" />
              <path d="M 19.5 20 L 5 31 L 2 26 Z" fill="#cbd5e1" stroke="#64748b" strokeWidth="0.5" />
            </g>
          </g>

          {/* Turbine 2 */}
          <g transform="translate(1205, 120)">
            <rect x="18" y="20" width="2.5" height="80" fill="#94a3b8" />
            <circle cx="19" cy="20" r="3" fill="#475569" />
            <g className="animate-[spin_3.5s_linear_infinite]" style={{ transformOrigin: "19px 20px" }}>
              <path d="M 19 20 L 17 2 L 21 2 Z" fill="#cbd5e1" />
              <path d="M 19 20 L 35 28 L 33 32 Z" fill="#cbd5e1" />
              <path d="M 19 20 L 5 30 L 3 26 Z" fill="#cbd5e1" />
            </g>
          </g>

          {/* Turbine 3 */}
          <g transform="translate(1245, 128)">
            <rect x="18" y="20" width="2.2" height="72" fill="#94a3b8" />
            <circle cx="19" cy="20" r="2.8" fill="#475569" />
            <g className="animate-[spin_4.2s_linear_infinite]" style={{ transformOrigin: "19px 20px" }}>
              <path d="M 19 20 L 17 4 L 21 4 Z" fill="#cbd5e1" />
              <path d="M 19 20 L 33 27 L 31 31 Z" fill="#cbd5e1" />
              <path d="M 19 20 L 7 29 L 5 25 Z" fill="#cbd5e1" />
            </g>
          </g>

          {/* Turbine 4 */}
          <g transform="translate(1280, 134)">
            <rect x="18" y="20" width="2" height="66" fill="#94a3b8" />
            <circle cx="19" cy="20" r="2.5" fill="#475569" />
            <g className="animate-[spin_3.8s_linear_infinite]" style={{ transformOrigin: "19px 20px" }}>
              <path d="M 19 20 L 17 5 L 21 5 Z" fill="#cbd5e1" />
              <path d="M 19 20 L 31 27 L 29 31 Z" fill="#cbd5e1" />
              <path d="M 19 20 L 8 28 L 6 24 Z" fill="#cbd5e1" />
            </g>
          </g>

          {/* Tiny Yellow Mountain Patrol Helicopter (Right side) */}
          <g className="animate-[patrolHover_6s_easeInOutSine_infinite]" transform="translate(1360, 65)">
            <line x1="0" y1="4" x2="36" y2="4" stroke="#475569" strokeWidth="1.5" className="animate-[spin_0.1s_linear_infinite]" style={{ transformOrigin: "18px 4px" }} />
            <rect x="17" y="4" width="2" height="4" fill="#334155" />
            <path d="M 8 13 C 8 8 14 8 24 8 C 28 8 32 11 32 16 C 32 18 28 19 20 19 C 14 19 8 17 8 13 Z" fill="#eab308" />
            <polygon points="8,11 0,13 0,15 8,14" fill="#ca8a04" />
            <line x1="8" y1="21" x2="28" y2="21" stroke="#334155" strokeWidth="1.5" />
          </g>

          {/* Desert Highway Border with Guardrail & Transmission Poles */}
          <line x1="0" y1="220" x2="1600" y2="220" stroke={isNight ? "#0f172a" : "#94a3b8"} strokeWidth="4" />
          <line x1="0" y1="222" x2="1600" y2="222" stroke={isNight ? "#38bdf8" : "#38bdf8"} strokeWidth="1" opacity="0.6" />
        </svg>
      </div>

      {/* Foreground Stylized Frosted Pine Trees (Framing Left & Right) */}
      <div className="absolute inset-x-0 bottom-0 h-[22%] pointer-events-none">
        <svg viewBox="0 0 1600 180" preserveAspectRatio="none" className="w-full h-full">
          {/* Left Tree Grove (Geometric layered chevrons with snow caps) */}
          {/* Tree 1 */}
          <g transform="translate(10, 30)">
            <rect x="22" y="100" width="6" height="40" fill="#334155" />
            <polygon points="25,40 5,80 45,80" fill={isNight ? "#14532d" : "#7dd3fc"} opacity="0.8" />
            <polygon points="25,40 12,65 38,65" fill="#ffffff" />
            <polygon points="25,20 8,55 42,55" fill={isNight ? "#166534" : "#93c5fd"} opacity="0.9" />
            <polygon points="25,20 14,40 36,40" fill="#ffffff" />
            <polygon points="25,5 12,32 38,32" fill="#ffffff" />
          </g>

          {/* Tree 2 */}
          <g transform="translate(45, 10)">
            <rect x="22" y="110" width="6" height="45" fill="#334155" />
            <polygon points="25,45 2,90 48,90" fill={isNight ? "#14532d" : "#60a5fa"} opacity="0.85" />
            <polygon points="25,45 10,72 40,72" fill="#ffffff" />
            <polygon points="25,22 6,60 44,60" fill={isNight ? "#15803d" : "#93c5fd"} opacity="0.9" />
            <polygon points="25,22 13,44 37,44" fill="#ffffff" />
            <polygon points="25,5 10,35 40,35" fill="#ffffff" />
          </g>

          {/* Tree 3 */}
          <g transform="translate(90, 45)">
            <rect x="20" y="85" width="5" height="35" fill="#334155" />
            <polygon points="22,35 4,70 40,70" fill={isNight ? "#166534" : "#7dd3fc"} opacity="0.8" />
            <polygon points="22,35 11,55 33,55" fill="#ffffff" />
            <polygon points="22,18 7,45 37,45" fill="#ffffff" />
          </g>

          {/* Right Tree Grove (Near mountain) */}
          {/* Tree 4 */}
          <g transform="translate(1480, 20)">
            <rect x="22" y="105" width="6" height="40" fill="#334155" />
            <polygon points="25,45 3,90 47,90" fill={isNight ? "#14532d" : "#60a5fa"} opacity="0.85" />
            <polygon points="25,45 11,70 39,70" fill="#ffffff" />
            <polygon points="25,20 7,60 43,60" fill="#ffffff" />
          </g>

          {/* Tree 5 */}
          <g transform="translate(1530, 40)">
            <rect x="20" y="90" width="5" height="35" fill="#334155" />
            <polygon points="22,38 4,75 40,75" fill={isNight ? "#166534" : "#93c5fd"} opacity="0.8" />
            <polygon points="22,38 11,60 33,60" fill="#ffffff" />
            <polygon points="22,15 8,42 36,42" fill="#ffffff" />
          </g>
        </svg>
      </div>
    </div>
  );
}
