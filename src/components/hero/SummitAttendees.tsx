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
        50/50 Gender Split: 3 Women (BG1, BG4, BG5), 2 Men (BG2, BG3)
        Every character has BOTH arms and BOTH articulated hands!
        ================================================================
      */}
      <div className="absolute inset-0 pointer-events-none">

        {/* BG 1: WOMAN - Coffee Commuter in Terracotta Knit with Messy Bun */}
        <div className="absolute bottom-9 left-[4%] z-10 scale-[0.76] track-bg-1">
          <div className="relative w-16 sm:w-20 h-36 sm:h-44">
            <svg viewBox="0 0 100 200" className="w-full h-full opacity-90">
              <ellipse cx="50" cy="192" rx="18" ry="3.5" fill="#0f172a" opacity="0.2" />

              {/* Articulated Front Leg */}
              <g className="leg-front-thigh">
                <path d="M 46 118 L 44 154" stroke="#cbd5e1" strokeWidth="9" strokeLinecap="round" />
                <g className="leg-front-calf" style={{ transformOrigin: "44px 154px" }}>
                  <path d="M 44 154 L 42 186" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" />
                  <path d="M 32 186 L 44 186 L 46 190 L 28 190 Z" fill="#1e293b" />
                  <rect x="27" y="190" width="20" height="2.5" rx="1" fill="#0f172a" />
                  <line x1="36" y1="187" x2="42" y2="187" stroke="#ffffff" strokeWidth="0.8" opacity="0.8" />
                </g>
              </g>

              {/* Articulated Back Leg */}
              <g className="leg-back-thigh">
                <path d="M 54 118 L 56 154" stroke="#94a3b8" strokeWidth="9" strokeLinecap="round" />
                <g className="leg-back-calf" style={{ transformOrigin: "56px 154px" }}>
                  <path d="M 56 154 L 58 186" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" />
                  <path d="M 46 186 L 58 186 L 60 190 L 42 190 Z" fill="#1e293b" />
                  <rect x="41" y="190" width="20" height="2.5" rx="1" fill="#0f172a" />
                  <line x1="50" y1="187" x2="56" y2="187" stroke="#ffffff" strokeWidth="0.8" opacity="0.8" />
                </g>
              </g>

              {/* Torso & BOTH Arms with Defined Hands */}
              <g className="torso-bob">
                <path d="M 36 70 L 64 70 L 59 122 L 41 122 Z" fill="#c2410c" />
                {/* Hand 1: Holding Coffee Cup with Fingers */}
                <path d="M 38 74 L 32 100 L 42 108" stroke="#c2410c" strokeWidth="6.5" strokeLinecap="round" fill="none" />
                <g transform="translate(40, 104)">
                  <polygon points="2,0 9,0 8,11 3,11" fill="#ffffff" />
                  <polygon points="2.5,4 8.5,4 8,8 3,8" fill="#15803d" />
                  {/* Fingers wrapped around cup */}
                  <path d="M 0 3 C 2 3 3 5 1 7" stroke="#fed7aa" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                  <ellipse cx="1" cy="4" rx="1.8" ry="2.5" fill="#fed7aa" />
                </g>

                {/* Hand 2: Back Arm with Natural Hand & Fingers */}
                <g className="arm-swing-front">
                  <path d="M 62 74 L 70 102 L 66 122" stroke="#c2410c" strokeWidth="6.5" strokeLinecap="round" fill="none" />
                  <ellipse cx="65" cy="125" rx="3.5" ry="4.5" fill="#fed7aa" />
                  <path d="M 63 126 L 67 126 M 63 128 L 66 128" stroke="#d97706" strokeWidth="0.6" />
                </g>

                {/* Head, Feminine Profile, Messy Bun with Gold Hoop */}
                <rect x="47" y="58" width="6" height="12" fill="#fed7aa" />
                <ellipse cx="50" cy="47" rx="8" ry="10" fill="#fed7aa" />
                <circle cx="43" cy="48" r="2.5" fill="none" stroke="#facc15" strokeWidth="0.8" />
                <path d="M 42 46 C 42 34 58 34 58 46 C 58 52 42 52 42 46 Z" fill="#451a03" />
                {/* Messy Top-Knot Bun */}
                <ellipse cx="50" cy="34" rx="6.5" ry="5.5" fill="#451a03" />
              </g>
            </svg>
          </div>
        </div>

        {/* BG 2: MAN - Product Lead with Camel Vest & Tablet */}
        <div className="absolute bottom-9 left-[22%] z-10 scale-[0.76] track-bg-2">
          <div className="relative w-16 sm:w-20 h-36 sm:h-44">
            <svg viewBox="0 0 100 200" className="w-full h-full opacity-90">
              <ellipse cx="50" cy="192" rx="18" ry="3.5" fill="#0f172a" opacity="0.2" />

              <g className="leg-front-thigh">
                <path d="M 46 125 L 44 160" stroke="#1e293b" strokeWidth="9.5" strokeLinecap="round" />
                <g className="leg-front-calf" style={{ transformOrigin: "44px 160px" }}>
                  <path d="M 44 160 L 42 188" stroke="#1e293b" strokeWidth="8.5" strokeLinecap="round" />
                  <path d="M 32 188 L 44 188 L 46 192 L 28 192 Z" fill="#020617" />
                  <rect x="27" y="192" width="20" height="2" fill="#78350f" />
                </g>
              </g>

              <g className="leg-back-thigh">
                <path d="M 54 125 L 56 160" stroke="#334155" strokeWidth="9.5" strokeLinecap="round" />
                <g className="leg-back-calf" style={{ transformOrigin: "56px 160px" }}>
                  <path d="M 56 160 L 58 188" stroke="#334155" strokeWidth="8.5" strokeLinecap="round" />
                  <path d="M 46 188 L 58 188 L 60 192 L 42 192 Z" fill="#020617" />
                  <rect x="41" y="192" width="20" height="2" fill="#78350f" />
                </g>
              </g>

              <g className="torso-bob">
                <path d="M 38 68 L 62 68 L 64 135 L 36 135 Z" fill="#b45309" />
                <rect x="44" y="68" width="12" height="40" fill="#f8fafc" />

                {/* Hand 1: Holding Slim Tablet with Fingers */}
                <path d="M 60 74 L 66 98 L 62 108" stroke="#b45309" strokeWidth="6.5" strokeLinecap="round" fill="none" />
                <rect x="58" y="102" width="16" height="12" rx="1.5" fill="#0284c7" transform="rotate(15 58 102)" />
                <ellipse cx="61" cy="110" rx="3" ry="3.5" fill="#fcd34d" />

                {/* Hand 2: Back Arm Swinging with Hand */}
                <g className="arm-swing-back">
                  <path d="M 38 74 L 32 100 L 36 118" stroke="#b45309" strokeWidth="6.5" strokeLinecap="round" fill="none" />
                  <ellipse cx="37" cy="120" rx="3" ry="4" fill="#fcd34d" />
                </g>

                <rect x="47" y="56" width="6" height="12" fill="#fcd34d" />
                <ellipse cx="50" cy="46" rx="8.5" ry="10" fill="#fcd34d" />
                <path d="M 42 45 C 42 32 58 32 58 45 L 56 50 L 44 50 Z" fill="#1c1917" />
              </g>
            </svg>
          </div>
        </div>

        {/* BG 3: MAN - Data Scientist with Cyan Shirt, Red Tie & BOTH Hands */}
        <div className="absolute bottom-9 left-[42%] z-10 scale-[0.76] track-bg-3">
          <div className="relative w-16 sm:w-20 h-36 sm:h-44">
            <svg viewBox="0 0 100 200" className="w-full h-full opacity-90">
              <ellipse cx="50" cy="192" rx="18" ry="3.5" fill="#0f172a" opacity="0.2" />

              <g className="leg-front-thigh">
                <path d="M 46 120 L 44 156" stroke="#1e3a8a" strokeWidth="9.5" strokeLinecap="round" />
                <g className="leg-front-calf" style={{ transformOrigin: "44px 156px" }}>
                  <path d="M 44 156 L 42 186" stroke="#1e3a8a" strokeWidth="8.5" strokeLinecap="round" />
                  <path d="M 32 186 L 44 186 L 46 190 L 28 190 Z" fill="#ffffff" />
                  <rect x="27" y="190" width="20" height="2.5" rx="1" fill="#0284c7" />
                  <line x1="36" y1="187" x2="42" y2="187" stroke="#1e3a8a" strokeWidth="0.8" />
                </g>
              </g>

              <g className="leg-back-thigh">
                <path d="M 54 120 L 56 156" stroke="#1d4ed8" strokeWidth="9.5" strokeLinecap="round" />
                <g className="leg-back-calf" style={{ transformOrigin: "56px 156px" }}>
                  <path d="M 56 156 L 58 186" stroke="#1d4ed8" strokeWidth="8.5" strokeLinecap="round" />
                  <path d="M 46 186 L 58 186 L 60 190 L 42 190 Z" fill="#ffffff" />
                  <rect x="41" y="190" width="20" height="2.5" rx="1" fill="#0284c7" />
                  <line x1="50" y1="187" x2="56" y2="187" stroke="#1e3a8a" strokeWidth="0.8" />
                </g>
              </g>

              <g className="torso-bob">
                <path d="M 35 68 L 65 68 L 61 122 L 39 122 Z" fill="#0284c7" />
                <polygon points="50,68 46,86 54,86" fill="#ffffff" />
                <polygon points="50,72 48,98 52,98" fill="#fb7185" />

                {/* Hand 1: Front Arm Swinging with Defined Hand & Fingers */}
                <g className="arm-swing-front">
                  <path d="M 64 72 L 72 102 L 68 122" stroke="#0284c7" strokeWidth="6.5" strokeLinecap="round" />
                  <ellipse cx="67" cy="125" rx="3.5" ry="4.5" fill="#fed7aa" />
                  <path d="M 65 126 L 69 126" stroke="#ca8a04" strokeWidth="0.6" />
                </g>

                {/* Hand 2: Back Arm Swinging with Defined Hand & Fingers */}
                <g className="arm-swing-back">
                  <path d="M 36 72 L 28 102 L 32 122" stroke="#0284c7" strokeWidth="6.5" strokeLinecap="round" />
                  <ellipse cx="33" cy="125" rx="3.5" ry="4.5" fill="#fed7aa" />
                  <path d="M 31 126 L 35 126" stroke="#ca8a04" strokeWidth="0.6" />
                </g>

                <rect x="47" y="56" width="6" height="12" fill="#fed7aa" />
                <ellipse cx="50" cy="46" rx="8.5" ry="10" fill="#fed7aa" />
                <circle cx="47" cy="46" r="3" fill="none" stroke="#0f172a" strokeWidth="1" />
                <circle cx="53" cy="46" r="3" fill="none" stroke="#0f172a" strokeWidth="1" />
                <line x1="50" y1="46" x2="50" y2="46" stroke="#0f172a" strokeWidth="1" />
                <path d="M 42 44 C 42 34 58 34 58 44 Z" fill="#713f12" />
              </g>
            </svg>
          </div>
        </div>

        {/* BG 4: WOMAN - Minimalist Architect with Ponytail & Portfolio Tote (Previously missing arms!) */}
        <div className="absolute bottom-9 left-[64%] z-10 scale-[0.76] track-bg-4">
          <div className="relative w-16 sm:w-20 h-36 sm:h-44">
            <svg viewBox="0 0 100 200" className="w-full h-full opacity-90">
              <ellipse cx="50" cy="192" rx="18" ry="3.5" fill="#0f172a" opacity="0.2" />

              <g className="leg-front-thigh">
                <path d="M 46 120 L 44 156" stroke="#18181b" strokeWidth="9.5" strokeLinecap="round" />
                <g className="leg-front-calf" style={{ transformOrigin: "44px 156px" }}>
                  <path d="M 44 156 L 42 186" stroke="#18181b" strokeWidth="8.5" strokeLinecap="round" />
                  <path d="M 32 186 L 44 186 L 46 190 L 28 190 Z" fill="#09090b" />
                  <rect x="27" y="190" width="20" height="2" fill="#27272a" />
                </g>
              </g>

              <g className="leg-back-thigh">
                <path d="M 54 120 L 56 156" stroke="#27272a" strokeWidth="9.5" strokeLinecap="round" />
                <g className="leg-back-calf" style={{ transformOrigin: "56px 156px" }}>
                  <path d="M 56 156 L 58 186" stroke="#27272a" strokeWidth="8.5" strokeLinecap="round" />
                  <path d="M 46 186 L 58 186 L 60 190 L 42 190 Z" fill="#09090b" />
                  <rect x="41" y="190" width="20" height="2" fill="#27272a" />
                </g>
              </g>

              {/* Torso & BOTH Arms with Defined Hands & Tote */}
              <g className="torso-bob">
                <path d="M 36 66 L 64 66 L 59 120 L 41 120 Z" fill="#09090b" />

                {/* Hand 1: Carrying Leather Architectural Portfolio Tote */}
                <path d="M 62 70 L 68 98 L 65 116" stroke="#09090b" strokeWidth="6.5" strokeLinecap="round" fill="none" />
                <g transform="translate(60, 112)">
                  {/* Tote Bag */}
                  <rect x="0" y="4" width="14" height="18" rx="2" fill="#451a03" />
                  <path d="M 4 4 L 4 0 C 4 -2 10 -2 10 0 L 10 4" stroke="#78350f" strokeWidth="1.5" fill="none" />
                  {/* Hand wrapped around handle */}
                  <ellipse cx="7" cy="2" rx="3.2" ry="2.5" fill="#fcd34d" />
                </g>

                {/* Hand 2: Back Arm Swinging with Defined Hand */}
                <g className="arm-swing-back">
                  <path d="M 37 70 L 30 98 L 34 116" stroke="#09090b" strokeWidth="6.5" strokeLinecap="round" fill="none" />
                  <ellipse cx="35" cy="118" rx="3.5" ry="4.5" fill="#fcd34d" />
                </g>

                <rect x="47" y="56" width="6" height="12" fill="#09090b" />
                <ellipse cx="50" cy="46" rx="8" ry="10" fill="#fcd34d" />
                {/* Sleek High Ponytail */}
                <path d="M 42 44 C 42 34 58 34 58 44 Z" fill="#09090b" />
                <ellipse cx="56" cy="40" rx="3.5" ry="3" fill="#09090b" />
                <path d="M 57 40 Q 64 48 62 60 Q 59 52 56 42 Z" fill="#09090b" />
              </g>
            </svg>
          </div>
        </div>

        {/* BG 5: WOMAN - Mobile Reporter with Camera Gimbal & BOTH Hands */}
        <div className="absolute bottom-9 left-[82%] z-10 scale-[0.76] track-bg-5">
          <div className="relative w-16 sm:w-20 h-36 sm:h-44">
            <svg viewBox="0 0 100 200" className="w-full h-full opacity-90">
              <ellipse cx="50" cy="192" rx="18" ry="3.5" fill="#0f172a" opacity="0.2" />

              <g className="leg-front-thigh">
                <path d="M 46 120 L 44 156" stroke="#374151" strokeWidth="9.5" strokeLinecap="round" />
                <g className="leg-front-calf" style={{ transformOrigin: "44px 156px" }}>
                  <path d="M 44 156 L 42 186" stroke="#374151" strokeWidth="8.5" strokeLinecap="round" />
                  <path d="M 32 186 L 44 186 L 46 190 L 28 190 Z" fill="#111827" />
                  <rect x="27" y="190" width="20" height="2" fill="#0f172a" />
                </g>
              </g>

              <g className="leg-back-thigh">
                <path d="M 54 120 L 56 156" stroke="#4b5563" strokeWidth="9.5" strokeLinecap="round" />
                <g className="leg-back-calf" style={{ transformOrigin: "56px 156px" }}>
                  <path d="M 56 156 L 58 186" stroke="#4b5563" strokeWidth="8.5" strokeLinecap="round" />
                  <path d="M 46 186 L 58 186 L 60 190 L 42 190 Z" fill="#111827" />
                  <rect x="41" y="190" width="20" height="2" fill="#0f172a" />
                </g>
              </g>

              <g className="torso-bob">
                <path d="M 35 68 L 65 68 L 60 120 L 40 120 Z" fill="#4d7c0f" />

                {/* Hand 1: Holding Camera Gimbal */}
                <path d="M 38 72 L 28 92 L 25 82" stroke="#4d7c0f" strokeWidth="6.5" strokeLinecap="round" fill="none" />
                <ellipse cx="25" cy="81" rx="3.5" ry="4" fill="#fed7aa" />
                <line x1="25" y1="81" x2="20" y2="65" stroke="#0f172a" strokeWidth="2.5" />
                <rect x="17" y="60" width="8" height="6" rx="1" fill="#0284c7" />

                {/* Hand 2: Supporting Gimbal Base with Defined Fingers */}
                <path d="M 62 72 L 50 90 L 30 84" stroke="#4d7c0f" strokeWidth="6.5" strokeLinecap="round" fill="none" />
                <ellipse cx="29" cy="84" rx="3" ry="3.5" fill="#fed7aa" />

                <rect x="47" y="56" width="6" height="12" fill="#fed7aa" />
                <ellipse cx="50" cy="46" rx="8" ry="10" fill="#fed7aa" />
                {/* Chic Cropped Bob */}
                <path d="M 41 45 C 41 33 59 33 59 45 C 59 52 41 52 41 45 Z" fill="#991b1b" />
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* 
        ================================================================
        LAYER 2: MIDGROUND ATTENDEES (Scale: 0.88, 4 Walking People)
        50/50 Gender Split: 2 Women (Mid 1, Mid 4), 2 Men (Mid 2, Mid 3)
        Every character has BOTH arms and BOTH articulated hands!
        ================================================================
      */}
      <div className="absolute inset-0 pointer-events-none">

        {/* Mid 1: WOMAN - Conference Host with Emerald Green Blazer & Waving Hand */}
        <div className="absolute bottom-5 left-[10%] z-15 scale-[0.88] track-mid-1">
          <div className="relative w-16 sm:w-20 md:w-22 h-38 sm:h-46">
            <svg viewBox="0 0 100 200" className="w-full h-full">
              <ellipse cx="50" cy="192" rx="20" ry="4" fill="#0f172a" opacity="0.22" />

              <g className="leg-front-thigh">
                <path d="M 46 120 L 44 158" stroke="#1e293b" strokeWidth="9.5" strokeLinecap="round" />
                <g className="leg-front-calf" style={{ transformOrigin: "44px 158px" }}>
                  <path d="M 44 158 L 42 188" stroke="#1e293b" strokeWidth="8.5" strokeLinecap="round" />
                  <path d="M 32 188 L 44 188 L 46 192 L 28 192 Z" fill="#020617" />
                  <rect x="27" y="192" width="20" height="2" fill="#78350f" />
                </g>
              </g>

              <g className="leg-back-thigh">
                <path d="M 54 120 L 56 158" stroke="#334155" strokeWidth="9.5" strokeLinecap="round" />
                <g className="leg-back-calf" style={{ transformOrigin: "56px 158px" }}>
                  <path d="M 56 158 L 58 188" stroke="#334155" strokeWidth="8.5" strokeLinecap="round" />
                  <path d="M 46 188 L 58 188 L 60 192 L 42 192 Z" fill="#020617" />
                  <rect x="41" y="192" width="20" height="2" fill="#78350f" />
                </g>
              </g>

              <g className="torso-bob">
                <path d="M 34 68 L 66 68 L 61 126 L 39 126 Z" fill="#047857" />
                <path d="M 46 68 L 50 92 L 54 68" stroke="#38bdf8" strokeWidth="2" fill="none" />
                <rect x="47" y="92" width="6" height="8" rx="1" fill="#ffffff" stroke="#047857" strokeWidth="0.8" />

                {/* Hand 1: Waving Arm with Defined Palm & Fingers */}
                <g className="arm-wave">
                  <path d="M 64 72 L 76 94 L 84 82" stroke="#047857" strokeWidth="7" strokeLinecap="round" fill="none" />
                  <ellipse cx="85" cy="80" rx="4" ry="5" fill="#fed7aa" />
                  <path d="M 83 78 L 87 78 M 82 80 L 88 80" stroke="#ca8a04" strokeWidth="0.8" />
                </g>

                {/* Hand 2: Resting on Badge Lanyard with Fingers */}
                <path d="M 36 72 L 44 94 L 46 98" stroke="#047857" strokeWidth="6.5" strokeLinecap="round" fill="none" />
                <ellipse cx="47" cy="99" rx="3.5" ry="3.5" fill="#fed7aa" />

                <rect x="47" y="56" width="6" height="12" fill="#fed7aa" />
                <ellipse cx="50" cy="46" rx="8.5" ry="10" fill="#fed7aa" />
                {/* Soft Shoulder-Length Waves */}
                <path d="M 40 44 C 40 32 60 32 60 44 C 62 55 60 62 58 66 L 42 66 C 40 62 38 55 40 44 Z" fill="#1e293b" />
              </g>
            </svg>
          </div>
        </div>

        {/* Mid 2: MAN - Developer in Maroon Jacket & Backpack (Promenade Center) */}
        <div className="absolute bottom-5 left-[28%] z-15 scale-[0.88] track-mid-2">
          <div className="relative w-16 sm:w-20 md:w-22 h-38 sm:h-46">
            <svg viewBox="0 0 100 200" className="w-full h-full">
              <ellipse cx="50" cy="192" rx="20" ry="4" fill="#0f172a" opacity="0.22" />

              <g className="leg-front-thigh">
                <path d="M 46 120 L 44 158" stroke="#1f2937" strokeWidth="9.5" strokeLinecap="round" />
                <g className="leg-front-calf" style={{ transformOrigin: "44px 158px" }}>
                  <path d="M 44 158 L 42 188" stroke="#1f2937" strokeWidth="8.5" strokeLinecap="round" />
                  <path d="M 32 188 L 44 188 L 46 192 L 28 192 Z" fill="#ef4444" />
                  <rect x="27" y="192" width="20" height="2.5" rx="1" fill="#ffffff" />
                  <line x1="36" y1="189" x2="42" y2="189" stroke="#ffffff" strokeWidth="0.8" />
                </g>
              </g>

              <g className="leg-back-thigh">
                <path d="M 54 120 L 56 158" stroke="#374151" strokeWidth="9.5" strokeLinecap="round" />
                <g className="leg-back-calf" style={{ transformOrigin: "56px 158px" }}>
                  <path d="M 56 158 L 58 188" stroke="#374151" strokeWidth="8.5" strokeLinecap="round" />
                  <path d="M 46 188 L 58 188 L 60 192 L 42 192 Z" fill="#ef4444" />
                  <rect x="41" y="192" width="20" height="2.5" rx="1" fill="#ffffff" />
                  <line x1="50" y1="189" x2="56" y2="189" stroke="#ffffff" strokeWidth="0.8" />
                </g>
              </g>

              <g className="torso-bob">
                <rect x="28" y="74" width="9" height="28" rx="3" fill="#1e293b" />
                <line x1="32" y1="80" x2="32" y2="96" stroke="#475569" strokeWidth="1.2" />
                <path d="M 36 68 L 64 68 L 60 122 L 40 122 Z" fill="#991b1b" />
                <line x1="42" y1="68" x2="42" y2="105" stroke="#1e293b" strokeWidth="2.5" />
                <line x1="58" y1="68" x2="58" y2="105" stroke="#1e293b" strokeWidth="2.5" />

                {/* Hand 1: Front Arm Swinging with Defined Hand & Fingers */}
                <g className="arm-swing-front">
                  <path d="M 62 72 L 70 102 L 66 122" stroke="#991b1b" strokeWidth="6.5" strokeLinecap="round" />
                  <ellipse cx="66" cy="125" rx="3.5" ry="4.5" fill="#fcd34d" />
                  <path d="M 64 126 L 68 126" stroke="#b45309" strokeWidth="0.6" />
                </g>

                {/* Hand 2: Back Arm Swinging with Defined Hand & Fingers */}
                <g className="arm-swing-back">
                  <path d="M 36 72 L 30 102 L 34 122" stroke="#991b1b" strokeWidth="6.5" strokeLinecap="round" />
                  <ellipse cx="35" cy="125" rx="3.5" ry="4.5" fill="#fcd34d" />
                  <path d="M 33 126 L 37 126" stroke="#b45309" strokeWidth="0.6" />
                </g>

                <rect x="47" y="56" width="6" height="12" fill="#fcd34d" />
                <ellipse cx="50" cy="46" rx="9" ry="10.5" fill="#fcd34d" />
                <path d="M 41 45 C 41 33 59 33 59 45 Z" fill="#451a03" />
              </g>
            </svg>
          </div>
        </div>

        {/* Mid 3: MAN - Global Partner in Sky Blue Kurta & Navy Blazer with BOTH Hands */}
        <div className="absolute bottom-5 left-[54%] z-15 scale-[0.88] track-mid-3">
          <div className="relative w-16 sm:w-20 md:w-22 h-38 sm:h-46">
            <svg viewBox="0 0 100 200" className="w-full h-full">
              <ellipse cx="50" cy="192" rx="20" ry="4" fill="#0f172a" opacity="0.22" />

              <g className="leg-front-thigh">
                <path d="M 46 125 L 44 162" stroke="#f8fafc" strokeWidth="9.5" strokeLinecap="round" />
                <g className="leg-front-calf" style={{ transformOrigin: "44px 162px" }}>
                  <path d="M 44 162 L 42 188" stroke="#f8fafc" strokeWidth="8.5" strokeLinecap="round" />
                  <path d="M 32 188 L 44 188 L 46 192 L 28 192 Z" fill="#78350f" />
                  <rect x="27" y="192" width="20" height="2" fill="#0f172a" />
                </g>
              </g>

              <g className="leg-back-thigh">
                <path d="M 54 125 L 56 162" stroke="#e2e8f0" strokeWidth="9.5" strokeLinecap="round" />
                <g className="leg-back-calf" style={{ transformOrigin: "56px 162px" }}>
                  <path d="M 56 162 L 58 188" stroke="#e2e8f0" strokeWidth="8.5" strokeLinecap="round" />
                  <path d="M 46 188 L 58 188 L 60 192 L 42 192 Z" fill="#78350f" />
                  <rect x="41" y="192" width="20" height="2" fill="#0f172a" />
                </g>
              </g>

              <g className="torso-bob">
                <path d="M 36 68 L 64 68 L 63 138 L 37 138 Z" fill="#38bdf8" />
                <path d="M 34 68 L 44 68 L 44 130 L 34 130 Z" fill="#1e3a8a" />
                <path d="M 66 68 L 56 68 L 56 130 L 66 130 Z" fill="#1e3a8a" />
                <line x1="50" y1="68" x2="50" y2="108" stroke="#0284c7" strokeWidth="1.5" />

                {/* Hand 1: Front Arm Swinging with Defined Hand & Fingers */}
                <g className="arm-swing-front">
                  <path d="M 64 72 L 72 100 L 68 120" stroke="#1e3a8a" strokeWidth="6.5" strokeLinecap="round" />
                  <ellipse cx="68" cy="123" rx="3.5" ry="4.5" fill="#fed7aa" />
                  <path d="M 66 124 L 70 124" stroke="#ca8a04" strokeWidth="0.6" />
                </g>

                {/* Hand 2: Back Arm Swinging with Defined Hand & Fingers */}
                <g className="arm-swing-back">
                  <path d="M 36 72 L 30 100 L 34 120" stroke="#1e3a8a" strokeWidth="6.5" strokeLinecap="round" />
                  <ellipse cx="34" cy="123" rx="3.5" ry="4.5" fill="#fed7aa" />
                  <path d="M 32 124 L 36 124" stroke="#ca8a04" strokeWidth="0.6" />
                </g>

                <rect x="47" y="56" width="6" height="12" fill="#fed7aa" />
                <ellipse cx="50" cy="46" rx="9" ry="10.5" fill="#fed7aa" />
                <path d="M 41 45 C 41 33 59 33 59 45 Z" fill="#1e293b" />
              </g>
            </svg>
          </div>
        </div>

        {/* Mid 4: WOMAN - Senior Creative Mentor in Warm Oatmeal Cardigan with Leather Clutch (Previously missing arms!) */}
        <div className="absolute bottom-5 left-[74%] z-15 scale-[0.88] track-mid-4">
          <div className="relative w-16 sm:w-20 md:w-22 h-38 sm:h-46">
            <svg viewBox="0 0 100 200" className="w-full h-full">
              <ellipse cx="50" cy="192" rx="20" ry="4" fill="#0f172a" opacity="0.22" />

              <g className="leg-front-thigh">
                <path d="M 46 120 L 44 158" stroke="#475569" strokeWidth="9.5" strokeLinecap="round" />
                <g className="leg-front-calf" style={{ transformOrigin: "44px 158px" }}>
                  <path d="M 44 158 L 42 188" stroke="#475569" strokeWidth="8.5" strokeLinecap="round" />
                  <path d="M 32 188 L 44 188 L 46 192 L 28 192 Z" fill="#0f172a" />
                  <rect x="27" y="192" width="20" height="2" fill="#334155" />
                </g>
              </g>

              <g className="leg-back-thigh">
                <path d="M 54 120 L 56 158" stroke="#64748b" strokeWidth="9.5" strokeLinecap="round" />
                <g className="leg-back-calf" style={{ transformOrigin: "56px 158px" }}>
                  <path d="M 56 158 L 58 188" stroke="#64748b" strokeWidth="8.5" strokeLinecap="round" />
                  <path d="M 46 188 L 58 188 L 60 192 L 42 192 Z" fill="#0f172a" />
                  <rect x="41" y="192" width="20" height="2" fill="#334155" />
                </g>
              </g>

              {/* Torso & BOTH Arms with Defined Hands */}
              <g className="torso-bob">
                <path d="M 35 68 L 65 68 L 60 124 L 40 124 Z" fill="#d6d3d1" />

                {/* Hand 1: Holding Leather Envelope Clutch under arm */}
                <path d="M 62 72 L 66 98 L 56 104" stroke="#d6d3d1" strokeWidth="6.5" strokeLinecap="round" fill="none" />
                <g transform="translate(52, 98)">
                  <polygon points="0,0 16,0 14,10 2,10" fill="#78350f" />
                  <polygon points="0,0 8,5 16,0" fill="#92400e" stroke="#582a0d" strokeWidth="0.5" />
                  <ellipse cx="8" cy="9" rx="3.5" ry="3" fill="#fed7aa" />
                </g>

                {/* Hand 2: Back Arm Swinging with Defined Hand */}
                <g className="arm-swing-back">
                  <path d="M 37 72 L 30 98 L 34 118" stroke="#d6d3d1" strokeWidth="6.5" strokeLinecap="round" fill="none" />
                  <ellipse cx="35" cy="121" rx="3.5" ry="4.5" fill="#fed7aa" />
                </g>

                <rect x="47" y="56" width="6" height="12" fill="#fed7aa" />
                <ellipse cx="50" cy="46" rx="8.5" ry="10" fill="#fed7aa" />
                {/* Distinguished Silver Bob */}
                <path d="M 41 45 C 41 33 59 33 59 45 C 60 54 58 58 56 62 L 43 62 C 41 58 40 54 41 45 Z" fill="#94a3b8" />
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* 
        ================================================================
        LAYER 3: FOREGROUND HERO STROLLERS & THE DINING GATHERING
        ================================================================
      */}
      <div className="absolute inset-0">
        {/* Foreground Stroller 2: MAN - Attendee in Snowflake Blue Hoodie with Takeaway Drink */}
        <div className="absolute bottom-1 left-[24%] z-20 track-hero-6">
          <div className="relative w-15 sm:w-18 md:w-22 h-36 sm:h-44 md:h-50">
            <svg viewBox="0 0 100 205" className="w-full h-full">
              <ellipse cx="50" cy="196" rx="22" ry="4" fill="#0f172a" opacity="0.25" />

              <g className="leg-front-thigh">
                <path d="M 46 125 L 44 162" stroke="#d97706" strokeWidth="10" strokeLinecap="round" />
                <g className="leg-front-calf" style={{ transformOrigin: "44px 162px" }}>
                  <path d="M 44 162 L 42 192" stroke="#d97706" strokeWidth="9" strokeLinecap="round" />
                  <path d="M 32 192 L 44 192 L 46 196 L 28 196 Z" fill="#ffffff" />
                  <rect x="27" y="196" width="20" height="2.5" rx="1" fill="#78350f" />
                </g>
              </g>

              <g className="leg-back-thigh">
                <path d="M 54 125 L 56 162" stroke="#f59e0b" strokeWidth="10" strokeLinecap="round" />
                <g className="leg-back-calf" style={{ transformOrigin: "56px 162px" }}>
                  <path d="M 56 162 L 58 192" stroke="#f59e0b" strokeWidth="9" strokeLinecap="round" />
                  <path d="M 46 192 L 58 192 L 60 196 L 42 196 Z" fill="#ffffff" />
                  <rect x="41" y="196" width="20" height="2.5" rx="1" fill="#78350f" />
                </g>
              </g>

              <g className="torso-bob">
                <path d="M 34 70 L 66 70 L 60 126 L 40 126 Z" fill="#38bdf8" />
                <g stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" transform="translate(50, 95)">
                  <line x1="0" y1="-7" x2="0" y2="7" />
                  <line x1="-7" y1="0" x2="7" y2="0" />
                  <line x1="-5" y1="-5" x2="5" y2="5" />
                  <line x1="-5" y1="5" x2="5" y2="-5" />
                </g>

                {/* Hand 1: Holding Takeaway Beverage */}
                <path d="M 36 74 L 28 102 L 40 110" stroke="#38bdf8" strokeWidth="7" strokeLinecap="round" fill="none" />
                <g transform="translate(38, 106)">
                  <polygon points="2,0 10,0 8,12 4,12" fill="#ffffff" />
                  <ellipse cx="6" cy="0" rx="4" ry="1.2" fill="#0f172a" />
                  <ellipse cx="3" cy="6" rx="2.5" ry="3.5" fill="#fed7aa" />
                </g>

                {/* Hand 2: Back Arm with Defined Hand & Fingers */}
                <g className="arm-swing-back">
                  <path d="M 64 74 L 72 108 L 66 128" stroke="#38bdf8" strokeWidth="7" strokeLinecap="round" />
                  <ellipse cx="66" cy="132" rx="4" ry="5" fill="#fed7aa" />
                  <path d="M 64 133 L 68 133 M 64 135 L 67 135" stroke="#ca8a04" strokeWidth="0.8" />
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
          THE GEOMETRY OF SIX: DUAL DINING TABLES & 12 GUESTS
          50% Girls & 50% Boys at both tables, with beautiful hands & drinks!
          ==============================================================
        */}
        <PreciousTableGathering />
      </div>
    </div>
  );
}
