import React from "react";
import { PreciousTableGathering } from "./PreciousTableGathering";

export function SummitAttendees() {
  return (
    <div className="relative w-full h-[210px] sm:h-[240px] md:h-[270px] lg:h-[290px] overflow-hidden select-none pointer-events-auto">
      {/* Soft ground shadow blend for characters on the Delhi promenade */}
      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />

      {/* 
        ================================================================
        LAYER 1: BACKGROUND ATTENDEES (Scale: 0.76, 5 Walking People)
        ================================================================
      */}
      <div className="absolute inset-0 pointer-events-none">
        {/* BG 1: Coffee Commuter in Terracotta Knit */}
        <div className="absolute bottom-9 left-[4%] z-10 scale-[0.76] track-bg-1">
          <div className="relative w-16 sm:w-20 h-36 sm:h-44">
            <svg viewBox="0 0 100 200" className="w-full h-full opacity-90">
              <ellipse cx="50" cy="192" rx="18" ry="3.5" fill="#0f172a" opacity="0.2" />
              <g className="leg-stride-front">
                <path d="M 46 120 L 42 160 L 38 188" stroke="#cbd5e1" strokeWidth="10" strokeLinecap="round" />
                <path d="M 38 188 L 26 191 L 39 193 Z" fill="#1e293b" />
              </g>
              <g className="leg-stride-back">
                <path d="M 54 120 L 58 160 L 62 188" stroke="#94a3b8" strokeWidth="10" strokeLinecap="round" />
                <path d="M 62 188 L 74 191 L 61 193 Z" fill="#1e293b" />
              </g>
              <g className="torso-bob">
                <path d="M 36 70 L 64 70 L 60 122 L 40 122 Z" fill="#c2410c" />
                <path d="M 38 74 L 32 105 L 44 112" stroke="#c2410c" strokeWidth="6.5" strokeLinecap="round" fill="none" />
                <polygon points="43,108 48,108 47,117 44,117" fill="#ffffff" />
                <polygon points="43.5,111 47.5,111 47,115 44,115" fill="#15803d" />
                <rect x="47" y="58" width="6" height="12" fill="#fed7aa" />
                <ellipse cx="50" cy="48" rx="8.5" ry="10" fill="#fed7aa" />
                <path d="M 42 46 C 42 36 58 36 58 46 Z" fill="#451a03" />
              </g>
            </svg>
          </div>
        </div>

        {/* BG 2: Product Lead with Camel Vest & Tablet */}
        <div className="absolute bottom-9 left-[22%] z-10 scale-[0.76] track-bg-2">
          <div className="relative w-16 sm:w-20 h-36 sm:h-44">
            <svg viewBox="0 0 100 200" className="w-full h-full opacity-90">
              <ellipse cx="50" cy="192" rx="18" ry="3.5" fill="#0f172a" opacity="0.2" />
              <g className="leg-stride-back">
                <path d="M 46 125 L 42 165 L 38 188" stroke="#1e293b" strokeWidth="9.5" strokeLinecap="round" />
                <path d="M 38 188 L 26 191 L 39 193 Z" fill="#020617" />
              </g>
              <g className="leg-stride-front">
                <path d="M 54 125 L 58 165 L 62 188" stroke="#334155" strokeWidth="9.5" strokeLinecap="round" />
                <path d="M 62 188 L 74 191 L 61 193 Z" fill="#020617" />
              </g>
              <g className="torso-bob">
                <path d="M 38 68 L 62 68 L 64 135 L 36 135 Z" fill="#b45309" />
                <rect x="44" y="68" width="12" height="40" fill="#f8fafc" />
                <rect x="58" y="105" width="16" height="12" rx="1.5" fill="#0284c7" transform="rotate(15 58 105)" />
                <rect x="47" y="56" width="6" height="12" fill="#fcd34d" />
                <ellipse cx="50" cy="46" rx="8.5" ry="10" fill="#fcd34d" />
                <path d="M 42 45 C 42 32 58 32 58 45 C 60 55 58 65 57 70 L 54 68 C 53 55 47 55 46 68 L 43 70 Z" fill="#1c1917" />
              </g>
            </svg>
          </div>
        </div>

        {/* BG 3: Data Scientist in Denim Jacket */}
        <div className="absolute bottom-9 left-[42%] z-10 scale-[0.76] track-bg-3">
          <div className="relative w-16 sm:w-20 h-36 sm:h-44">
            <svg viewBox="0 0 100 200" className="w-full h-full opacity-90">
              <ellipse cx="50" cy="192" rx="18" ry="3.5" fill="#0f172a" opacity="0.2" />
              <g className="leg-stride-front">
                <path d="M 46 120 L 41 160 L 37 188" stroke="#1e3a8a" strokeWidth="10" strokeLinecap="round" />
                <path d="M 37 188 L 27 191 L 38 193 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
              </g>
              <g className="leg-stride-back">
                <path d="M 54 120 L 59 160 L 63 188" stroke="#1d4ed8" strokeWidth="10" strokeLinecap="round" />
                <path d="M 63 188 L 73 191 L 62 193 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
              </g>
              <g className="torso-bob">
                <path d="M 35 68 L 65 68 L 61 122 L 39 122 Z" fill="#0284c7" />
                <polygon points="50,68 45,98 55,98" fill="#fb7185" />
                <g className="arm-swing">
                  <path d="M 65 72 L 72 105 L 68 126" stroke="#0284c7" strokeWidth="6.5" strokeLinecap="round" />
                </g>
                <rect x="47" y="56" width="6" height="12" fill="#fed7aa" />
                <ellipse cx="50" cy="46" rx="8.5" ry="10" fill="#fed7aa" />
                <circle cx="47" cy="46" r="3" fill="none" stroke="#0f172a" strokeWidth="1" />
                <circle cx="53" cy="46" r="3" fill="none" stroke="#0f172a" strokeWidth="1" />
                <path d="M 42 44 C 42 34 58 34 58 44 Z" fill="#713f12" />
              </g>
            </svg>
          </div>
        </div>

        {/* BG 4: Architect in All-Black Minimalist Turtleneck */}
        <div className="absolute bottom-9 left-[64%] z-10 scale-[0.76] track-bg-4">
          <div className="relative w-16 sm:w-20 h-36 sm:h-44">
            <svg viewBox="0 0 100 200" className="w-full h-full opacity-90">
              <ellipse cx="50" cy="192" rx="18" ry="3.5" fill="#0f172a" opacity="0.2" />
              <g className="leg-stride-back">
                <path d="M 46 120 L 42 160 L 38 188" stroke="#18181b" strokeWidth="10" strokeLinecap="round" />
                <path d="M 38 188 L 26 191 L 39 193 Z" fill="#09090b" />
              </g>
              <g className="leg-stride-front">
                <path d="M 54 120 L 58 160 L 62 188" stroke="#27272a" strokeWidth="10" strokeLinecap="round" />
                <path d="M 62 188 L 74 191 L 61 193 Z" fill="#09090b" />
              </g>
              <g className="torso-bob">
                <path d="M 36 66 L 64 66 L 60 120 L 40 120 Z" fill="#09090b" />
                <rect x="47" y="56" width="6" height="12" fill="#09090b" />
                <ellipse cx="50" cy="46" rx="8.5" ry="10" fill="#fcd34d" />
                <path d="M 42 44 C 42 34 58 34 58 44 Z" fill="#09090b" />
              </g>
            </svg>
          </div>
        </div>

        {/* BG 5: Mobile Reporter with Camera Gimbal */}
        <div className="absolute bottom-9 left-[82%] z-10 scale-[0.76] track-bg-5">
          <div className="relative w-16 sm:w-20 h-36 sm:h-44">
            <svg viewBox="0 0 100 200" className="w-full h-full opacity-90">
              <ellipse cx="50" cy="192" rx="18" ry="3.5" fill="#0f172a" opacity="0.2" />
              <g className="leg-stride-front">
                <path d="M 46 120 L 42 160 L 38 188" stroke="#374151" strokeWidth="10" strokeLinecap="round" />
                <path d="M 38 188 L 26 191 L 39 193 Z" fill="#111827" />
              </g>
              <g className="leg-stride-back">
                <path d="M 54 120 L 58 160 L 62 188" stroke="#4b5563" strokeWidth="10" strokeLinecap="round" />
                <path d="M 62 188 L 74 191 L 61 193 Z" fill="#111827" />
              </g>
              <g className="torso-bob">
                <path d="M 35 68 L 65 68 L 61 120 L 39 120 Z" fill="#4d7c0f" />
                <path d="M 38 72 L 28 92 L 24 82" stroke="#4d7c0f" strokeWidth="6.5" strokeLinecap="round" fill="none" />
                <line x1="24" y1="82" x2="20" y2="65" stroke="#0f172a" strokeWidth="2.5" />
                <rect x="17" y="60" width="8" height="6" rx="1" fill="#0284c7" />
                <rect x="47" y="56" width="6" height="12" fill="#fed7aa" />
                <ellipse cx="50" cy="46" rx="8.5" ry="10" fill="#fed7aa" />
                <path d="M 42 44 C 42 34 58 34 58 44 Z" fill="#991b1b" />
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* 
        ================================================================
        LAYER 2: MIDGROUND ATTENDEES (Scale: 0.88, 4 Walking People)
        ================================================================
      */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Mid 1: Conference Host with Green Blazer & Badge */}
        <div className="absolute bottom-5 left-[10%] z-15 scale-[0.88] track-mid-1">
          <div className="relative w-16 sm:w-20 md:w-22 h-38 sm:h-46">
            <svg viewBox="0 0 100 200" className="w-full h-full">
              <ellipse cx="50" cy="192" rx="20" ry="4" fill="#0f172a" opacity="0.22" />
              <g className="leg-stride-back">
                <path d="M 46 120 L 42 160 L 38 188" stroke="#1e293b" strokeWidth="10.5" strokeLinecap="round" />
                <path d="M 38 188 L 26 191 L 39 193 Z" fill="#020617" />
              </g>
              <g className="leg-stride-front">
                <path d="M 54 120 L 58 160 L 62 188" stroke="#334155" strokeWidth="10.5" strokeLinecap="round" />
                <path d="M 62 188 L 74 191 L 61 193 Z" fill="#020617" />
              </g>
              <g className="torso-bob">
                <path d="M 34 68 L 66 68 L 62 126 L 38 126 Z" fill="#047857" />
                <path d="M 46 68 L 50 92 L 54 68" stroke="#38bdf8" strokeWidth="2" fill="none" />
                <rect x="47" y="92" width="6" height="8" rx="1" fill="#ffffff" stroke="#047857" strokeWidth="0.8" />
                <g className="arm-wave">
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

        {/* Mid 2: Developer with Maroon Jacket & Backpack */}
        <div className="absolute bottom-5 left-[28%] z-15 scale-[0.88] track-mid-2">
          <div className="relative w-16 sm:w-20 md:w-22 h-38 sm:h-46">
            <svg viewBox="0 0 100 200" className="w-full h-full">
              <ellipse cx="50" cy="192" rx="20" ry="4" fill="#0f172a" opacity="0.22" />
              <g className="leg-stride-front">
                <path d="M 46 120 L 42 160 L 38 188" stroke="#1f2937" strokeWidth="10.5" strokeLinecap="round" />
                <path d="M 38 188 L 26 191 L 39 193 Z" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
              </g>
              <g className="leg-stride-back">
                <path d="M 54 120 L 58 160 L 62 188" stroke="#374151" strokeWidth="10.5" strokeLinecap="round" />
                <path d="M 62 188 L 74 191 L 61 193 Z" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
              </g>
              <g className="torso-bob">
                <rect x="30" y="74" width="8" height="26" rx="3" fill="#1e293b" />
                <path d="M 36 68 L 64 68 L 60 122 L 40 122 Z" fill="#991b1b" />
                <line x1="42" y1="68" x2="42" y2="105" stroke="#1e293b" strokeWidth="3" />
                <line x1="58" y1="68" x2="58" y2="105" stroke="#1e293b" strokeWidth="3" />
                <rect x="47" y="56" width="6" height="12" fill="#fcd34d" />
                <ellipse cx="50" cy="46" rx="9" ry="10.5" fill="#fcd34d" />
                <path d="M 41 45 C 41 33 59 33 59 45 Z" fill="#451a03" />
              </g>
            </svg>
          </div>
        </div>

        {/* Mid 3: Global Partner in Linen Kurta & Tailored Blazer */}
        <div className="absolute bottom-5 left-[54%] z-15 scale-[0.88] track-mid-3">
          <div className="relative w-16 sm:w-20 md:w-22 h-38 sm:h-46">
            <svg viewBox="0 0 100 200" className="w-full h-full">
              <ellipse cx="50" cy="192" rx="20" ry="4" fill="#0f172a" opacity="0.22" />
              <g className="leg-stride-back">
                <path d="M 46 125 L 42 165 L 38 188" stroke="#f8fafc" strokeWidth="10.5" strokeLinecap="round" />
                <path d="M 38 188 L 26 191 L 39 193 Z" fill="#78350f" />
              </g>
              <g className="leg-stride-front">
                <path d="M 54 125 L 58 165 L 62 188" stroke="#e2e8f0" strokeWidth="10.5" strokeLinecap="round" />
                <path d="M 62 188 L 74 191 L 61 193 Z" fill="#78350f" />
              </g>
              <g className="torso-bob">
                <path d="M 36 68 L 64 68 L 63 138 L 37 138 Z" fill="#38bdf8" />
                <path d="M 34 68 L 44 68 L 44 130 L 34 130 Z" fill="#1e3a8a" />
                <path d="M 66 68 L 56 68 L 56 130 L 66 130 Z" fill="#1e3a8a" />
                <rect x="47" y="56" width="6" height="12" fill="#fed7aa" />
                <ellipse cx="50" cy="46" rx="9" ry="10.5" fill="#fed7aa" />
                <path d="M 41 45 C 41 33 59 33 59 45 Z" fill="#1e293b" />
              </g>
            </svg>
          </div>
        </div>

        {/* Mid 4: Senior Mentor in Cardigan */}
        <div className="absolute bottom-5 left-[74%] z-15 scale-[0.88] track-mid-4">
          <div className="relative w-16 sm:w-20 md:w-22 h-38 sm:h-46">
            <svg viewBox="0 0 100 200" className="w-full h-full">
              <ellipse cx="50" cy="192" rx="20" ry="4" fill="#0f172a" opacity="0.22" />
              <g className="leg-stride-front">
                <path d="M 46 120 L 42 160 L 38 188" stroke="#475569" strokeWidth="10.5" strokeLinecap="round" />
                <path d="M 38 188 L 26 191 L 39 193 Z" fill="#0f172a" />
              </g>
              <g className="leg-stride-back">
                <path d="M 54 120 L 58 160 L 62 188" stroke="#64748b" strokeWidth="10.5" strokeLinecap="round" />
                <path d="M 62 188 L 74 191 L 61 193 Z" fill="#0f172a" />
              </g>
              <g className="torso-bob">
                <path d="M 35 68 L 65 68 L 61 124 L 39 124 Z" fill="#d6d3d1" />
                <rect x="47" y="56" width="6" height="12" fill="#fed7aa" />
                <ellipse cx="50" cy="46" rx="9" ry="10.5" fill="#fed7aa" />
                <path d="M 41 45 C 41 33 59 33 59 45 Z" fill="#94a3b8" />
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* 
        ================================================================
        LAYER 3: FOREGROUND HERO STROLLERS & THE DINING GATHERING
        Foreground pedestrians continue moving on the left and center promenade,
        while the 6 guests stroll, meet/connect, and sit down at the dining table
        ================================================================
      */}
      <div className="absolute inset-0">

        {/* Foreground Stroller 2: Attendee in Snowflake Blue Hoodie (Center Promenade) */}
        <div className="absolute bottom-1 left-[24%] z-20 track-hero-6">
          <div className="relative w-15 sm:w-18 md:w-22 h-36 sm:h-44 md:h-50">
            <svg viewBox="0 0 100 205" className="w-full h-full">
              <ellipse cx="50" cy="196" rx="22" ry="4" fill="#0f172a" opacity="0.25" />
              <g className="leg-stride-back">
                <path d="M 46 125 L 42 165 L 38 194" stroke="#d97706" strokeWidth="11" strokeLinecap="round" />
                <path d="M 38 194 L 26 197 L 39 198 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
              </g>
              <g className="leg-stride-front">
                <path d="M 54 125 L 58 165 L 62 194" stroke="#f59e0b" strokeWidth="11" strokeLinecap="round" />
                <path d="M 62 194 L 74 197 L 61 198 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
              </g>
              <g className="torso-bob">
                <path d="M 34 70 L 66 70 L 60 126 L 40 126 Z" fill="#38bdf8" />
                <g stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" transform="translate(50, 95)">
                  <line x1="0" y1="-7" x2="0" y2="7" />
                  <line x1="-7" y1="0" x2="7" y2="0" />
                  <line x1="-5" y1="-5" x2="5" y2="5" />
                  <line x1="-5" y1="5" x2="5" y2="-5" />
                </g>
                <path d="M 36 74 L 28 106 L 42 118" stroke="#38bdf8" strokeWidth="7" strokeLinecap="round" fill="none" />
                <rect x="36" y="112" width="20" height="12" rx="1.5" fill="#0f172a" transform="rotate(-10 40 115)" />
                <rect x="38" y="114" width="16" height="8" rx="1" fill="#38bdf8" opacity="0.8" transform="rotate(-10 40 115)" />
                <g className="arm-swing-reverse">
                  <path d="M 64 74 L 72 108 L 66 128" stroke="#38bdf8" strokeWidth="7" strokeLinecap="round" />
                  <circle cx="66" cy="130" r="3.5" fill="#fed7aa" />
                </g>
                <rect x="47" y="58" width="6" height="12" fill="#fed7aa" />
                <ellipse cx="50" cy="48" rx="9" ry="11" fill="#fed7aa" />
                <path d="M 41 46 C 41 34 59 34 59 46 Z" fill="#78350f" />
              </g>
            </svg>
          </div>
        </div>

        {/* 
          ==============================================================
          THE GEOMETRY OF SIX: 6 GUESTS & CURATED DINING TABLE
          6 guests stroll, connect at the promenade, walk to the table,
          and sit down to eat, toast wine, and converse!
          ==============================================================
        */}
        <PreciousTableGathering />
      </div>
    </div>
  );
}
