import React from "react";

interface DiningTableSVGProps {
  tableId: string;
}

/**
 * BACK CHAIRS SVG (z-5)
 * Rendered behind back-row guests so guests sit IN the chairs,
 * with chair backs naturally supporting their shoulders and heads.
 */
function BackChairsSVG({ tableId }: DiningTableSVGProps) {
  return (
    <div className="absolute inset-0 w-full h-full z-5 pointer-events-none">
      <svg viewBox="0 0 320 160" preserveAspectRatio="none" className="w-full h-full drop-shadow-sm">
        {/* Chair 1 Back (Seat 1 - Center x=76) */}
        <g transform="translate(56, 44)">
          <rect x="7" y="0" width="4" height="44" rx="1.5" fill="#3f1e09" />
          <rect x="29" y="0" width="4" height="44" rx="1.5" fill="#3f1e09" />
          <path d="M 4 4 C 4 -1 36 -1 36 4 L 34 24 C 34 26 6 26 6 24 Z" fill="#582a0d" stroke="#8d4013" strokeWidth="0.8" />
          <rect x="18" y="10" width="4" height="28" rx="1" fill="#4a220a" />
        </g>

        {/* Chair 2 Back (Seat 2 - Center x=160) */}
        <g transform="translate(140, 44)">
          <rect x="7" y="0" width="4" height="44" rx="1.5" fill="#3f1e09" />
          <rect x="29" y="0" width="4" height="44" rx="1.5" fill="#3f1e09" />
          <path d="M 4 4 C 4 -1 36 -1 36 4 L 34 24 C 34 26 6 26 6 24 Z" fill="#582a0d" stroke="#8d4013" strokeWidth="0.8" />
          <rect x="18" y="10" width="4" height="28" rx="1" fill="#4a220a" />
        </g>

        {/* Chair 3 Back (Seat 3 - Center x=244) */}
        <g transform="translate(224, 44)">
          <rect x="7" y="0" width="4" height="44" rx="1.5" fill="#3f1e09" />
          <rect x="29" y="0" width="4" height="44" rx="1.5" fill="#3f1e09" />
          <path d="M 4 4 C 4 -1 36 -1 36 4 L 34 24 C 34 26 6 26 6 24 Z" fill="#582a0d" stroke="#8d4013" strokeWidth="0.8" />
          <rect x="18" y="10" width="4" height="28" rx="1" fill="#4a220a" />
        </g>
      </svg>
    </div>
  );
}

/**
 * DINING TABLE BODY SVG (z-20)
 * Rendered between back guests (z-10) and front guests (z-30).
 */
function DiningTableSVG({ tableId }: DiningTableSVGProps) {
  return (
    <div className="absolute inset-0 w-full h-full z-20 pointer-events-none">
      <svg viewBox="0 0 320 160" preserveAspectRatio="none" className="w-full h-full drop-shadow-xl">
        <defs>
          <linearGradient id={`${tableId}-woodGrad`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9a5b1c" />
            <stop offset="45%" stopColor="#633110" />
            <stop offset="100%" stopColor="#381a08" />
          </linearGradient>
          <linearGradient id={`${tableId}-runnerBurgundy`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4a0f21" />
            <stop offset="50%" stopColor="#691C35" />
            <stop offset="100%" stopColor="#4a0f21" />
          </linearGradient>
          <radialGradient id={`${tableId}-candleGlow`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.95" />
            <stop offset="35%" stopColor="#f59e0b" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Table Ground Shadow */}
        <ellipse cx="160" cy="148" rx="146" ry="9" fill="#0f172a" opacity="0.35" />

        {/* Table Legs & Turned Timber Bracing */}
        <rect x="44" y="96" width="7.5" height="50" rx="2" fill="#2d1306" />
        <rect x="54" y="96" width="6.5" height="46" rx="2" fill="#3f1e09" />
        <rect x="269" y="96" width="7.5" height="50" rx="2" fill="#2d1306" />
        <rect x="259" y="96" width="6.5" height="46" rx="2" fill="#3f1e09" />
        <line x1="45" y1="134" x2="275" y2="134" stroke="#2d1306" strokeWidth="4.5" />

        {/* Table Surface Oval */}
        <ellipse cx="160" cy="94" rx="138" ry="19" fill={`url(#${tableId}-woodGrad)`} stroke="#b45309" strokeWidth="1" />
        <ellipse cx="160" cy="92" rx="135" ry="16.5" fill="#582a0d" />

        {/* Burgundy Runner Cloth (#691C35) */}
        <path
          d="M 48 93 C 48 83 272 83 272 93 C 272 97 48 97 48 93 Z"
          fill={`url(#${tableId}-runnerBurgundy)`}
        />
        <polygon points="48,93 44,112 52,112 48,93" fill="#691C35" />
        <line x1="44" y1="112" x2="52" y2="112" stroke="#c6a568" strokeWidth="2" />
        <polygon points="272,93 268,112 276,112 272,93" fill="#691C35" />
        <line x1="268" y1="112" x2="276" y2="112" stroke="#c6a568" strokeWidth="2" />

        {/* Brass Candelabra & Warm Ambient Glow */}
        <g transform="translate(148, 60)">
          <circle cx="12" cy="12" r="30" fill={`url(#${tableId}-candleGlow)`} opacity="0.75" className="animate-pulse" />
          <rect x="10.5" y="18" width="3.5" height="14" fill="#facc15" />
          <ellipse cx="12" cy="32" rx="9" ry="3" fill="#ca8a04" />
          <path d="M 3 22 Q 12 28 21 22" stroke="#facc15" strokeWidth="2.5" fill="none" />
          <rect x="2" y="14" width="2.5" height="8" fill="#fef08a" />
          <rect x="10.8" y="9" width="2.5" height="11" fill="#fef08a" />
          <rect x="19.5" y="14" width="2.5" height="8" fill="#fef08a" />
          <ellipse cx="3.2" cy="11" rx="1.6" ry="3.8" fill="#f97316" className="animate-pulse" />
          <ellipse cx="12" cy="6" rx="2" ry="4.2" fill="#f97316" className="animate-pulse" />
          <ellipse cx="20.7" cy="11" rx="1.6" ry="3.8" fill="#f97316" className="animate-pulse" />
        </g>

        {/* Porcelain Dishes */}
        <ellipse cx="76" cy="92" rx="9" ry="4" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.8" />
        <ellipse cx="76" cy="92" rx="7.5" ry="3" fill="#fafafa" stroke="#c6a568" strokeWidth="0.5" />
        <ellipse cx="112" cy="94" rx="9" ry="4" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.8" />
        <ellipse cx="112" cy="94" rx="7.5" ry="3" fill="#fafafa" stroke="#c6a568" strokeWidth="0.5" />
        <ellipse cx="208" cy="94" rx="9" ry="4" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.8" />
        <ellipse cx="208" cy="94" rx="7.5" ry="3" fill="#fafafa" stroke="#c6a568" strokeWidth="0.5" />
        <ellipse cx="244" cy="92" rx="9" ry="4" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.8" />
        <ellipse cx="244" cy="92" rx="7.5" ry="3" fill="#fafafa" stroke="#c6a568" strokeWidth="0.5" />

        <ellipse cx="128" cy="91" rx="10" ry="4" fill="#92400e" />
        <ellipse cx="128" cy="89" rx="8" ry="3" fill="#fef3c7" />

        {/* Wine Glasses */}
        <g transform="translate(90, 82)">
          <polygon points="2,0 6,0 4,6 4,11 6,11 2,11 4,11 4,6" stroke="#ffffff" strokeWidth="0.8" fill="none" opacity="0.9" />
          <polygon points="2.5,2 5.5,2 4,5" fill="#991b1b" />
        </g>
        <g transform="translate(227, 82)">
          <polygon points="2,0 6,0 4,6 4,11 6,11 2,11 4,11 4,6" stroke="#ffffff" strokeWidth="0.8" fill="none" opacity="0.9" />
          <polygon points="2.5,2 5.5,2 4,5" fill="#991b1b" />
        </g>

        {/* FRONT ROW STOOL FRAMES */}
        <g transform="translate(64, 102)">
          <ellipse cx="18" cy="16" rx="15" ry="5.5" fill="#582a0d" stroke="#8d4013" strokeWidth="0.8" />
          <ellipse cx="18" cy="15" rx="13" ry="4.5" fill="#78350f" />
          <line x1="7" y1="18" x2="5" y2="46" stroke="#2d1306" strokeWidth="3.5" />
          <line x1="29" y1="18" x2="31" y2="46" stroke="#2d1306" strokeWidth="3.5" />
        </g>
        <g transform="translate(142, 104)">
          <ellipse cx="18" cy="16" rx="15" ry="5.5" fill="#582a0d" stroke="#8d4013" strokeWidth="0.8" />
          <ellipse cx="18" cy="15" rx="13" ry="4.5" fill="#78350f" />
          <line x1="7" y1="18" x2="5" y2="46" stroke="#2d1306" strokeWidth="3.5" />
          <line x1="29" y1="18" x2="31" y2="46" stroke="#2d1306" strokeWidth="3.5" />
        </g>
        <g transform="translate(220, 102)">
          <ellipse cx="18" cy="16" rx="15" ry="5.5" fill="#582a0d" stroke="#8d4013" strokeWidth="0.8" />
          <ellipse cx="18" cy="15" rx="13" ry="4.5" fill="#78350f" />
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
        50% Girls & 50% Boys:
        - Seat 1 (L1): GIRL (Tech Founder in Sapphire Blazer & Gold Earrings)
        - Seat 2 (L2): BOY  (Senior Architect in Charcoal Tweed & Silver Hair)
        - Seat 3 (L3): GIRL (Design Strategist in Mustard Gold Silk Kurta & High Bun)
        - Seat 4 (L4): GIRL (Venture Partner in Slate Cashmere & Silk Ribbon Ponytail)
        - Seat 5 (L5): BOY  (Community Host in Forest Emerald Jacket)
        - Seat 6 (L6): BOY  (Brand Curator in Camel Overcoat & Navy Trousers)
        EVERY GUEST HAS BOTH ARMS AND BOTH DETAILED HANDS!
        ====================================================================
      */}
      <div className="absolute bottom-1 sm:bottom-2 left-[2%] sm:left-[4%] md:left-[6%] w-72 sm:w-80 md:w-92 h-36 sm:h-40 md:h-46 pointer-events-none select-none z-20">
        <div className="table-spawn relative w-full h-full">
          <div className="table-spawn-burst absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-32 rounded-full border-2 border-[#c6a568] bg-[#c6a568]/15 blur-sm" />
          </div>

          {/* LAYER 1: BACK ROW CHAIR BACKRESTS (z-5) */}
          <BackChairsSVG tableId="leftTable" />

          {/* LAYER 2: BACK ROW GUESTS (z-10) */}

          {/* Guest L1 (Seat 1 - Back Left, x=23.75%): GIRL */}
          <div className="absolute bottom-[7.5%] left-[23.75%] -translate-x-1/2 z-10 dinner-guest-L1 pointer-events-auto">
            <div className="relative w-16 sm:w-18 md:w-20 h-36 sm:h-40 md:h-46">
              <svg viewBox="0 0 100 200" className="w-full h-full drop-shadow-md">
                <ellipse cx="50" cy="192" rx="18" ry="3.5" fill="#0f172a" opacity="0.22" />

                <g className="guest-walking-legs-L1">
                  <g className="leg-front-thigh">
                    <path d="M 46 118 L 44 154" stroke="#1e3a8a" strokeWidth="9" strokeLinecap="round" />
                    <g className="leg-front-calf" style={{ transformOrigin: "44px 154px" }}>
                      <path d="M 44 154 L 42 186" stroke="#1e3a8a" strokeWidth="8" strokeLinecap="round" />
                      <path d="M 32 186 L 44 186 L 46 190 L 28 190 Z" fill="#0f172a" />
                      <rect x="27" y="190" width="20" height="2" fill="#78350f" />
                    </g>
                  </g>
                  <g className="leg-back-thigh">
                    <path d="M 54 118 L 56 154" stroke="#2563eb" strokeWidth="9" strokeLinecap="round" />
                    <g className="leg-back-calf" style={{ transformOrigin: "56px 154px" }}>
                      <path d="M 56 154 L 58 186" stroke="#2563eb" strokeWidth="8" strokeLinecap="round" />
                      <path d="M 46 186 L 58 186 L 60 190 L 42 190 Z" fill="#0f172a" />
                      <rect x="41" y="190" width="20" height="2" fill="#78350f" />
                    </g>
                  </g>
                </g>

                <g className="guest-seated-legs-L1">
                  <path d="M 46 126 L 46 168 L 44 188" stroke="#1e3a8a" strokeWidth="9" strokeLinecap="round" />
                  <path d="M 34 188 L 46 188 L 48 191 L 30 191 Z" fill="#0f172a" />
                  <path d="M 54 126 L 54 168 L 56 188" stroke="#2563eb" strokeWidth="9" strokeLinecap="round" />
                  <path d="M 46 188 L 58 188 L 60 191 L 42 191 Z" fill="#0f172a" />
                </g>

                {/* GIRL: Sapphire Tailored Blazer over Ivory Silk Camisole, Gold Hoops, BOTH Hands */}
                <g className="guest-torso-1">
                  <path d="M 36 68 L 64 68 L 60 126 L 40 126 Z" fill="#1e3a8a" />
                  {/* Ivory Silk Camisole with V-Neckline */}
                  <polygon points="50,68 44,88 56,88" fill="#f8fafc" />
                  <circle cx="50" cy="85" r="1.5" fill="#facc15" />

                  {/* Hand 1: Raising Wine Glass with Fingers Wrapped Around Stem */}
                  <g className="guest-arm-toast">
                    <path d="M 62 72 L 72 94 L 80 82" stroke="#1e3a8a" strokeWidth="6.5" strokeLinecap="round" fill="none" />
                    <polygon points="78,74 85,74 82,79 82,84 85,84 78,84 82,84 82,79" fill="none" stroke="#ffffff" strokeWidth="0.7" />
                    <polygon points="79,75 84,75 82,78" fill="#991b1b" />
                    {/* Articulated Hand & Fingers on Stem */}
                    <ellipse cx="82" cy="82" rx="3.5" ry="3" fill="#fed7aa" />
                    <path d="M 80 81 L 84 81 M 80 83 L 83 83" stroke="#ca8a04" strokeWidth="0.6" />
                  </g>

                  {/* Hand 2: Left Arm Resting on Table Runner with Defined Fingers */}
                  <path d="M 37 72 L 28 96 L 38 104" stroke="#1e3a8a" strokeWidth="6.5" strokeLinecap="round" fill="none" />
                  <ellipse cx="39" cy="104" rx="4" ry="3" fill="#fed7aa" />
                  <path d="M 37 105 L 42 105 M 37 106 L 41 106" stroke="#ca8a04" strokeWidth="0.6" />

                  <rect x="47" y="56" width="6" height="12" fill="#fed7aa" />
                  <ellipse cx="50" cy="46" rx="8" ry="10" fill="#fed7aa" />
                  {/* Gold Hoop Earring */}
                  <circle cx="43" cy="47" r="2.5" fill="none" stroke="#facc15" strokeWidth="0.9" />
                  {/* Chic Textured Bob */}
                  <path d="M 41 45 C 41 31 59 31 59 45 C 60 55 58 58 56 62 L 43 62 C 41 58 40 55 41 45 Z" fill="#0f172a" />
                </g>
              </svg>
            </div>
          </div>

          {/* Guest L2 (Seat 2 - Back Center, x=50.0%): BOY */}
          <div className="absolute bottom-[7.5%] left-[50%] -translate-x-1/2 z-10 dinner-guest-L2 pointer-events-auto">
            <div className="relative w-16 sm:w-18 md:w-20 h-38 sm:h-42 md:h-48">
              <svg viewBox="0 0 100 210" className="w-full h-full drop-shadow-md">
                <ellipse cx="50" cy="202" rx="20" ry="3.5" fill="#0f172a" opacity="0.22" />

                <g className="guest-walking-legs-L2">
                  <g className="leg-front-thigh">
                    <path d="M 45 125 L 43 162" stroke="#1e293b" strokeWidth="9.5" strokeLinecap="round" />
                    <g className="leg-front-calf" style={{ transformOrigin: "43px 162px" }}>
                      <path d="M 43 162 L 41 195" stroke="#1e293b" strokeWidth="8.5" strokeLinecap="round" />
                      <path d="M 31 195 L 43 195 L 45 199 L 27 199 Z" fill="#020617" />
                      <rect x="26" y="199" width="20" height="2.5" rx="1" fill="#78350f" />
                    </g>
                  </g>
                  <g className="leg-back-thigh">
                    <path d="M 55 125 L 57 162" stroke="#334155" strokeWidth="9.5" strokeLinecap="round" />
                    <g className="leg-back-calf" style={{ transformOrigin: "57px 162px" }}>
                      <path d="M 57 162 L 59 195" stroke="#334155" strokeWidth="8.5" strokeLinecap="round" />
                      <path d="M 47 195 L 59 195 L 61 199 L 43 199 Z" fill="#020617" />
                      <rect x="42" y="199" width="20" height="2.5" rx="1" fill="#78350f" />
                    </g>
                  </g>
                </g>

                <g className="guest-seated-legs-L2">
                  <path d="M 46 130 L 46 174 L 44 196" stroke="#1e293b" strokeWidth="9.5" strokeLinecap="round" />
                  <path d="M 34 196 L 46 196 L 48 200 L 30 200 Z" fill="#020617" />
                  <path d="M 54 130 L 54 174 L 56 196" stroke="#334155" strokeWidth="9.5" strokeLinecap="round" />
                  <path d="M 46 196 L 58 196 L 60 200 L 42 200 Z" fill="#020617" />
                </g>

                {/* BOY: Charcoal Tweed Jacket & BOTH Animated Gesturing Hands */}
                <g className="guest-torso-1">
                  <path d="M 33 70 L 67 70 L 63 132 L 37 132 Z" fill="#1e293b" />
                  <polygon points="50,70 44,98 56,98" fill="#f8fafc" />
                  <polygon points="50,75 48,102 52,102" fill="#c6a568" />

                  {/* Hand 1: Conversational Open Palm & Articulated Fingers */}
                  <g className="guest-arm-gesturing">
                    <path d="M 65 74 L 75 98 L 84 90" stroke="#1e293b" strokeWidth="7.5" strokeLinecap="round" fill="none" />
                    <ellipse cx="85" cy="88" rx="4" ry="4.5" fill="#fed7aa" />
                    <path d="M 86 86 L 90 84 M 86 88 L 91 88 M 86 90 L 89 91" stroke="#ca8a04" strokeWidth="0.8" />
                  </g>

                  {/* Hand 2: Conversational Left Palm & Articulated Fingers */}
                  <path d="M 35 74 L 26 98 L 34 104" stroke="#1e293b" strokeWidth="7.5" strokeLinecap="round" fill="none" />
                  <ellipse cx="36" cy="105" rx="4" ry="4.5" fill="#fed7aa" />
                  <path d="M 34 104 L 30 102 M 35 106 L 31 106 M 36 108 L 33 109" stroke="#ca8a04" strokeWidth="0.8" />

                  <rect x="47" y="58" width="6" height="12" fill="#fed7aa" />
                  <ellipse cx="50" cy="46" rx="9.5" ry="11" fill="#fed7aa" />
                  {/* Silver Distinguished Hair */}
                  <path d="M 39 44 C 39 30 61 30 61 44 C 62 48 60 52 58 54 L 42 54 C 40 52 38 48 39 44 Z" fill="#e2e8f0" />
                </g>
              </svg>
            </div>
          </div>

          {/* Guest L3 (Seat 3 - Back Right, x=76.25%): GIRL */}
          <div className="absolute bottom-[7.5%] left-[76.25%] -translate-x-1/2 z-10 dinner-guest-L3 pointer-events-auto">
            <div className="relative w-16 sm:w-18 md:w-20 h-36 sm:h-40 md:h-46">
              <svg viewBox="0 0 100 200" className="w-full h-full drop-shadow-md">
                <ellipse cx="50" cy="192" rx="17" ry="3.5" fill="#0f172a" opacity="0.22" />

                <g className="guest-walking-legs-L3">
                  <g className="leg-front-thigh">
                    <path d="M 47 135 L 45 162" stroke="#ca8a04" strokeWidth="8.5" strokeLinecap="round" />
                    <g className="leg-front-calf" style={{ transformOrigin: "45px 162px" }}>
                      <path d="M 45 162 L 43 188" stroke="#ca8a04" strokeWidth="7.5" strokeLinecap="round" />
                      <path d="M 33 188 L 45 188 L 47 192 L 29 192 Z" fill="#0f172a" />
                      <rect x="28" y="192" width="20" height="2" fill="#b45309" />
                    </g>
                  </g>
                  <g className="leg-back-thigh">
                    <path d="M 53 135 L 55 162" stroke="#eab308" strokeWidth="8.5" strokeLinecap="round" />
                    <g className="leg-back-calf" style={{ transformOrigin: "55px 162px" }}>
                      <path d="M 55 162 L 57 188" stroke="#eab308" strokeWidth="7.5" strokeLinecap="round" />
                      <path d="M 47 188 L 59 188 L 61 192 L 43 192 Z" fill="#0f172a" />
                      <rect x="42" y="192" width="20" height="2" fill="#b45309" />
                    </g>
                  </g>
                </g>

                <g className="guest-seated-legs-L3">
                  <path d="M 46 135 L 46 172 L 44 190" stroke="#ca8a04" strokeWidth="8.5" strokeLinecap="round" />
                  <path d="M 34 190 L 46 190 L 48 193 L 30 193 Z" fill="#0f172a" />
                  <path d="M 54 135 L 54 172 L 56 190" stroke="#eab308" strokeWidth="8.5" strokeLinecap="round" />
                  <path d="M 46 190 L 58 190 L 60 193 L 42 193 Z" fill="#0f172a" />
                </g>

                {/* GIRL: Mustard Gold Raw Silk Kurta with Gold Hairpins & BOTH Hands */}
                <g className="guest-torso-1">
                  <path d="M 37 68 L 63 68 L 68 138 L 32 138 Z" fill="#eab308" />
                  <line x1="50" y1="68" x2="50" y2="108" stroke="#ca8a04" strokeWidth="2.5" />
                  <circle cx="50" cy="74" r="1.2" fill="#ffffff" />
                  <circle cx="50" cy="84" r="1.2" fill="#ffffff" />
                  <circle cx="50" cy="94" r="1.2" fill="#ffffff" />

                  {/* Hand 1: Raising Champagne Flute with Wrapped Fingers */}
                  <g className="guest-arm-toast">
                    <path d="M 63 72 L 72 96 L 79 84" stroke="#eab308" strokeWidth="6.5" strokeLinecap="round" fill="none" />
                    <polygon points="77,76 83,76 81,81 81,85 83,85 77,85 81,85 81,81" fill="none" stroke="#ffffff" strokeWidth="0.7" />
                    <polygon points="78,77 82,77 81,80" fill="#991b1b" />
                    <ellipse cx="81" cy="83" rx="3.5" ry="3" fill="#78350f" />
                    <path d="M 79 83 L 83 83" stroke="#facc15" strokeWidth="0.6" />
                  </g>

                  {/* Hand 2: Resting Gracefully Near Dinner Plate with Defined Fingers */}
                  <path d="M 37 72 L 30 96 L 39 104" stroke="#eab308" strokeWidth="6.5" strokeLinecap="round" fill="none" />
                  <ellipse cx="40" cy="105" rx="4" ry="3" fill="#78350f" />
                  <path d="M 38 106 L 43 106 M 38 107 L 42 107" stroke="#facc15" strokeWidth="0.6" />

                  <rect x="47" y="56" width="6" height="12" fill="#78350f" />
                  <ellipse cx="50" cy="46" rx="8" ry="10" fill="#78350f" />
                  {/* Elegant Bun with Dual Gold Hairpins */}
                  <path d="M 40 44 C 40 30 60 30 60 44 Z" fill="#1c1917" />
                  <circle cx="50" cy="30" r="6" fill="#1c1917" />
                  <line x1="42" y1="28" x2="58" y2="32" stroke="#facc15" strokeWidth="1.8" />
                  <line x1="44" y1="34" x2="56" y2="26" stroke="#facc15" strokeWidth="1.8" />
                </g>
              </svg>
            </div>
          </div>

          {/* LAYER 3: DINING TABLE SURFACE & FRONT STOOL FRAMES (z-20) */}
          <DiningTableSVG tableId="leftTable" />

          {/* LAYER 4: FRONT ROW GUESTS (z-30) */}

          {/* Guest L4 (Seat 4 - Front Left, x=25.6%): GIRL */}
          <div className="absolute bottom-[7.5%] left-[25.6%] -translate-x-1/2 z-30 dinner-guest-L4 pointer-events-auto">
            <div className="relative w-16 sm:w-18 md:w-20 h-36 sm:h-40 md:h-46">
              <svg viewBox="0 0 100 200" className="w-full h-full drop-shadow-md">
                <ellipse cx="50" cy="192" rx="18" ry="3.5" fill="#0f172a" opacity="0.22" />

                <g className="guest-walking-legs-L4">
                  <g className="leg-front-thigh">
                    <path d="M 45 120 L 43 158" stroke="#581c87" strokeWidth="9.5" strokeLinecap="round" />
                    <g className="leg-front-calf" style={{ transformOrigin: "43px 158px" }}>
                      <path d="M 43 158 L 41 188" stroke="#581c87" strokeWidth="8.5" strokeLinecap="round" />
                      <path d="M 31 188 L 43 188 L 45 192 L 27 192 Z" fill="#0f172a" />
                      <rect x="26" y="192" width="20" height="2" fill="#78350f" />
                    </g>
                  </g>
                  <g className="leg-back-thigh">
                    <path d="M 55 120 L 57 158" stroke="#7e22ce" strokeWidth="9.5" strokeLinecap="round" />
                    <g className="leg-back-calf" style={{ transformOrigin: "57px 158px" }}>
                      <path d="M 57 158 L 59 188" stroke="#7e22ce" strokeWidth="8.5" strokeLinecap="round" />
                      <path d="M 47 188 L 59 188 L 61 192 L 43 192 Z" fill="#0f172a" />
                      <rect x="42" y="192" width="20" height="2" fill="#78350f" />
                    </g>
                  </g>
                </g>

                <g className="guest-seated-legs-L4">
                  <path d="M 44 128 L 58 134 L 56 186" stroke="#581c87" strokeWidth="9.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <path d="M 48 186 L 60 186 L 62 190 L 44 190 Z" fill="#0f172a" />
                  <rect x="43" y="190" width="20" height="2.5" rx="1" fill="#78350f" />

                  <path d="M 52 128 L 68 134 L 66 186" stroke="#7e22ce" strokeWidth="9.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <path d="M 58 186 L 70 186 L 72 190 L 54 190 Z" fill="#0f172a" />
                  <rect x="53" y="190" width="20" height="2.5" rx="1" fill="#78350f" />
                </g>

                {/* GIRL: Slate Cashmere Knit, High Ponytail with Ribbon & BOTH Hands */}
                <g className="guest-torso-1">
                  <path d="M 36 70 L 64 70 L 58 126 L 42 126 Z" fill="#94a3b8" />
                  <polygon points="50,70 46,80 54,80" fill="#ffffff" />

                  {/* Hand 1: Holding Ceramic Espresso Cup with Defined Fingers */}
                  <path d="M 38 74 L 28 98 L 38 106" stroke="#94a3b8" strokeWidth="7" strokeLinecap="round" fill="none" />
                  <g transform="translate(36, 102)">
                    <ellipse cx="6" cy="5" rx="4.5" ry="3.5" fill="#f8fafc" stroke="#64748b" strokeWidth="0.6" />
                    <path d="M 10 3 C 12 3 12 7 10 7" stroke="#64748b" strokeWidth="1" fill="none" />
                    <ellipse cx="3" cy="5" rx="3.5" ry="3" fill="#fed7aa" />
                  </g>

                  {/* Hand 2: Resting on Knee with Articulated Fingers */}
                  <path d="M 62 74 L 68 100 L 64 116" stroke="#94a3b8" strokeWidth="7" strokeLinecap="round" fill="none" />
                  <ellipse cx="63" cy="118" rx="4" ry="4.5" fill="#fed7aa" />
                  <path d="M 61 119 L 65 119 M 61 121 L 65 121" stroke="#ca8a04" strokeWidth="0.8" />

                  <rect x="47" y="58" width="6" height="12" fill="#fed7aa" />
                  <ellipse cx="50" cy="48" rx="8" ry="10" fill="#fed7aa" />
                  {/* High Ponytail with Silk Ribbon */}
                  <circle cx="50" cy="44" r="10" fill="#18181b" />
                  <ellipse cx="58" cy="38" rx="3.5" ry="3" fill="#18181b" />
                  <path d="M 59 38 Q 68 46 66 58 Q 63 50 58 40 Z" fill="#18181b" />
                  <rect x="56" y="37" width="3" height="4" rx="1" fill="#691C35" />
                </g>
              </svg>
            </div>
          </div>

          {/* Guest L5 (Seat 5 - Front Center, x=50.0%): BOY */}
          <div className="absolute bottom-[7.5%] left-[50%] -translate-x-1/2 z-30 dinner-guest-L5 pointer-events-auto">
            <div className="relative w-16 sm:w-18 md:w-20 h-36 sm:h-40 md:h-46">
              <svg viewBox="0 0 100 200" className="w-full h-full drop-shadow-md">
                <ellipse cx="50" cy="192" rx="18" ry="3.5" fill="#0f172a" opacity="0.22" />

                <g className="guest-walking-legs-L5">
                  <g className="leg-front-thigh">
                    <path d="M 46 120 L 44 158" stroke="#1e293b" strokeWidth="9.5" strokeLinecap="round" />
                    <g className="leg-front-calf" style={{ transformOrigin: "44px 158px" }}>
                      <path d="M 44 158 L 42 188" stroke="#1e293b" strokeWidth="8.5" strokeLinecap="round" />
                      <path d="M 32 188 L 44 188 L 46 192 L 28 192 Z" fill="#ffffff" />
                      <rect x="27" y="192" width="20" height="2" fill="#020617" />
                    </g>
                  </g>
                  <g className="leg-back-thigh">
                    <path d="M 54 120 L 56 158" stroke="#334155" strokeWidth="9.5" strokeLinecap="round" />
                    <g className="leg-back-calf" style={{ transformOrigin: "56px 158px" }}>
                      <path d="M 56 158 L 58 188" stroke="#334155" strokeWidth="8.5" strokeLinecap="round" />
                      <path d="M 46 188 L 58 188 L 60 192 L 42 192 Z" fill="#ffffff" />
                      <rect x="41" y="192" width="20" height="2" fill="#020617" />
                    </g>
                  </g>
                </g>

                <g className="guest-seated-legs-L5">
                  <path d="M 42 128 L 38 142 L 36 186" stroke="#1e293b" strokeWidth="9.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <path d="M 28 186 L 40 186 L 42 190 L 24 190 Z" fill="#ffffff" />
                  <rect x="23" y="190" width="20" height="2.5" rx="1" fill="#b45309" />

                  <path d="M 58 128 L 62 142 L 64 186" stroke="#334155" strokeWidth="9.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <path d="M 56 186 L 68 186 L 70 190 L 52 190 Z" fill="#ffffff" />
                  <rect x="51" y="190" width="20" height="2.5" rx="1" fill="#b45309" />
                </g>

                {/* BOY: Emerald Jacket & BOTH Hands Relaxed on Table */}
                <g className="guest-torso-1">
                  <path d="M 34 68 L 66 68 L 62 128 L 38 128 Z" fill="#047857" />
                  <circle cx="50" cy="80" r="1.5" fill="#facc15" />
                  <circle cx="50" cy="94" r="1.5" fill="#facc15" />
                  <circle cx="50" cy="108" r="1.5" fill="#facc15" />

                  {/* Hand 1: Resting on Table Runner */}
                  <g className="guest-arm-gesturing">
                    <path d="M 64 72 L 74 96 L 70 106" stroke="#047857" strokeWidth="7" strokeLinecap="round" fill="none" />
                    <ellipse cx="69" cy="108" rx="4" ry="4" fill="#fed7aa" />
                    <path d="M 67 109 L 71 109 M 67 111 L 70 111" stroke="#ca8a04" strokeWidth="0.8" />
                  </g>

                  {/* Hand 2: Resting on Table Runner */}
                  <path d="M 36 72 L 28 96 L 34 106" stroke="#047857" strokeWidth="7" strokeLinecap="round" fill="none" />
                  <ellipse cx="35" cy="108" rx="4" ry="4" fill="#fed7aa" />
                  <path d="M 33 109 L 37 109 M 34 111 L 37 111" stroke="#ca8a04" strokeWidth="0.8" />

                  <rect x="47" y="56" width="6" height="12" fill="#fed7aa" />
                  <ellipse cx="50" cy="46" rx="9" ry="10.5" fill="#fed7aa" />
                  <path d="M 41 45 C 41 33 59 33 59 45 Z" fill="#1e293b" />
                </g>
              </svg>
            </div>
          </div>

          {/* Guest L6 (Seat 6 - Front Right, x=74.4%): BOY */}
          <div className="absolute bottom-[7.5%] left-[74.4%] -translate-x-1/2 z-30 dinner-guest-L6 pointer-events-auto">
            <div className="relative w-16 sm:w-18 md:w-20 h-36 sm:h-40 md:h-46">
              <svg viewBox="0 0 100 200" className="w-full h-full drop-shadow-md">
                <ellipse cx="50" cy="192" rx="18" ry="3.5" fill="#0f172a" opacity="0.22" />

                <g className="guest-walking-legs-L6">
                  <g className="leg-front-thigh">
                    <path d="M 46 125 L 44 162" stroke="#1e3a8a" strokeWidth="9.5" strokeLinecap="round" />
                    <g className="leg-front-calf" style={{ transformOrigin: "44px 162px" }}>
                      <path d="M 44 162 L 42 188" stroke="#1e3a8a" strokeWidth="8.5" strokeLinecap="round" />
                      <path d="M 32 188 L 44 188 L 46 192 L 28 192 Z" fill="#172554" />
                      <rect x="27" y="192" width="20" height="2" fill="#0f172a" />
                    </g>
                  </g>
                  <g className="leg-back-thigh">
                    <path d="M 54 125 L 56 162" stroke="#1d4ed8" strokeWidth="9.5" strokeLinecap="round" />
                    <g className="leg-back-calf" style={{ transformOrigin: "56px 162px" }}>
                      <path d="M 56 162 L 58 188" stroke="#1d4ed8" strokeWidth="8.5" strokeLinecap="round" />
                      <path d="M 46 188 L 58 188 L 60 192 L 42 192 Z" fill="#172554" />
                      <rect x="41" y="192" width="20" height="2" fill="#0f172a" />
                    </g>
                  </g>
                </g>

                <g className="guest-seated-legs-L6">
                  <path d="M 52 128 L 38 134 L 36 186" stroke="#1e3a8a" strokeWidth="9.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <path d="M 26 186 L 38 186 L 40 190 L 22 190 Z" fill="#172554" />
                  <rect x="21" y="190" width="20" height="2.5" rx="1" fill="#0f172a" />

                  <path d="M 58 128 L 46 134 L 44 186" stroke="#1d4ed8" strokeWidth="9.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <path d="M 34 186 L 46 186 L 48 190 L 30 190 Z" fill="#172554" />
                  <rect x="29" y="190" width="20" height="2.5" rx="1" fill="#0f172a" />
                </g>

                {/* BOY: Camel Overcoat & BOTH Hands (Raising Toast & Resting on Table) */}
                <g className="guest-torso-1">
                  <path d="M 36 68 L 64 68 L 63 138 L 37 138 Z" fill="#b45309" />
                  <rect x="44" y="68" width="12" height="40" fill="#fef3c7" />

                  {/* Hand 1: Raising Wine Glass with Fingers Wrapped Around Stem */}
                  <g className="guest-arm-toast">
                    <path d="M 40 72 L 30 96 L 24 86" stroke="#b45309" strokeWidth="6.5" strokeLinecap="round" fill="none" />
                    <polygon points="21,78 27,78 24,83 24,87 27,87 21,87 24,87 24,83" fill="none" stroke="#ffffff" strokeWidth="0.7" />
                    <polygon points="22,79 26,79 24,82" fill="#991b1b" />
                    <ellipse cx="25" cy="85" rx="3.5" ry="3" fill="#fcd34d" />
                    <path d="M 23 85 L 27 85" stroke="#78350f" strokeWidth="0.6" />
                  </g>

                  {/* Hand 2: Right Arm Resting on Table Runner */}
                  <path d="M 64 72 L 72 98 L 64 106" stroke="#b45309" strokeWidth="6.5" strokeLinecap="round" fill="none" />
                  <ellipse cx="63" cy="108" rx="4" ry="4" fill="#fcd34d" />
                  <path d="M 61 109 L 65 109 M 61 111 L 64 111" stroke="#78350f" strokeWidth="0.8" />

                  <rect x="47" y="56" width="6" height="12" fill="#fcd34d" />
                  <ellipse cx="50" cy="46" rx="9" ry="10.5" fill="#fcd34d" />
                  {/* Textured Wavy Hair */}
                  <path d="M 41 45 C 41 33 59 33 59 45 L 58 49 L 42 49 Z" fill="#451a03" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 
        ====================================================================
        TABLE 2: RIGHT SIDE DINING TABLE & 6 GUESTS
        50% Girls & 50% Boys:
        - Seat 1 (R1): BOY  (Fashion Director in Burgundy Velvet Tuxedo)
        - Seat 2 (R2): GIRL (Global Partner in Midnight Blue Blazer & Caramel Waves)
        - Seat 3 (R3): GIRL (Environmental Architect in Pine Green Kurti & Chignon)
        - Seat 4 (R4): GIRL (Media Producer in Terracotta Cardigan & Layered Lob)
        - Seat 5 (R5): BOY  (AI Researcher in Olive Chore Coat & Ochre Chinos)
        - Seat 6 (R6): BOY  (Creative Strategist in Royal Violet Pullover)
        EVERY GUEST HAS BOTH ARMS AND BOTH DETAILED HANDS!
        ====================================================================
      */}
      <div className="absolute bottom-1 sm:bottom-2 right-[2%] sm:right-[4%] md:right-[6%] w-72 sm:w-80 md:w-92 h-36 sm:h-40 md:h-46 pointer-events-none select-none z-20">
        <div className="table-spawn relative w-full h-full">
          <div className="table-spawn-burst absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-32 rounded-full border-2 border-[#c6a568] bg-[#c6a568]/15 blur-sm" />
          </div>

          {/* LAYER 1: BACK ROW CHAIR BACKRESTS (z-5) */}
          <BackChairsSVG tableId="rightTable" />

          {/* LAYER 2: BACK ROW GUESTS (z-10) */}

          {/* Guest R1 (Seat 1 - Back Left, x=23.75%): BOY */}
          <div className="absolute bottom-[7.5%] left-[23.75%] -translate-x-1/2 z-10 dinner-guest-R1 pointer-events-auto">
            <div className="relative w-16 sm:w-18 md:w-20 h-36 sm:h-40 md:h-46">
              <svg viewBox="0 0 100 200" className="w-full h-full drop-shadow-md">
                <ellipse cx="50" cy="192" rx="18" ry="3.5" fill="#0f172a" opacity="0.22" />

                <g className="guest-walking-legs-R1">
                  <g className="leg-front-thigh">
                    <path d="M 46 115 L 44 154" stroke="#f8fafc" strokeWidth="9.5" strokeLinecap="round" />
                    <g className="leg-front-calf" style={{ transformOrigin: "44px 154px" }}>
                      <path d="M 44 154 L 42 186" stroke="#f8fafc" strokeWidth="8.5" strokeLinecap="round" />
                      <path d="M 32 186 L 44 186 L 46 190 L 28 190 Z" fill="#78350f" />
                      <rect x="27" y="190" width="20" height="2" fill="#0f172a" />
                    </g>
                  </g>
                  <g className="leg-back-thigh">
                    <path d="M 54 115 L 56 154" stroke="#e2e8f0" strokeWidth="9.5" strokeLinecap="round" />
                    <g className="leg-back-calf" style={{ transformOrigin: "56px 154px" }}>
                      <path d="M 56 154 L 58 186" stroke="#e2e8f0" strokeWidth="8.5" strokeLinecap="round" />
                      <path d="M 46 186 L 58 186 L 60 190 L 42 190 Z" fill="#78350f" />
                      <rect x="41" y="190" width="20" height="2" fill="#0f172a" />
                    </g>
                  </g>
                </g>

                <g className="guest-seated-legs-R1">
                  <path d="M 46 126 L 46 168 L 44 188" stroke="#f8fafc" strokeWidth="9.5" strokeLinecap="round" />
                  <path d="M 34 188 L 46 188 L 48 191 L 30 191 Z" fill="#78350f" />
                  <path d="M 54 126 L 54 168 L 56 188" stroke="#e2e8f0" strokeWidth="9.5" strokeLinecap="round" />
                  <path d="M 46 188 L 58 188 L 60 191 L 42 191 Z" fill="#78350f" />
                </g>

                {/* BOY: Burgundy Velvet Tuxedo & BOTH Hands */}
                <g className="guest-torso-1">
                  <path d="M 36 68 L 64 68 L 60 126 L 40 126 Z" fill="#691C35" />
                  <polygon points="50,68 45,92 55,92" fill="#ffffff" />
                  <polygon points="50,72 48,76 52,76" fill="#0f172a" />

                  {/* Hand 1: Raising Wine Glass with Fingers */}
                  <g className="guest-arm-toast">
                    <path d="M 62 72 L 72 94 L 80 82" stroke="#691C35" strokeWidth="7" strokeLinecap="round" fill="none" />
                    <polygon points="78,74 85,74 82,79 82,84 85,84 78,84 82,84 82,79" fill="none" stroke="#ffffff" strokeWidth="0.7" />
                    <polygon points="79,75 84,75 82,78" fill="#991b1b" />
                    <ellipse cx="82" cy="82" rx="3.5" ry="3" fill="#fbcfe8" />
                    <path d="M 80 81 L 84 81" stroke="#991b1b" strokeWidth="0.6" />
                  </g>

                  {/* Hand 2: Resting on Table Runner with White Cuff & Fingers */}
                  <path d="M 38 72 L 30 96 L 38 104" stroke="#691C35" strokeWidth="7" strokeLinecap="round" fill="none" />
                  <rect x="36" y="101" width="5" height="3" fill="#ffffff" />
                  <ellipse cx="39" cy="105" rx="4" ry="3" fill="#fbcfe8" />
                  <path d="M 37 106 L 41 106" stroke="#991b1b" strokeWidth="0.6" />

                  <rect x="47" y="56" width="6" height="12" fill="#fbcfe8" />
                  <ellipse cx="50" cy="46" rx="9" ry="11" fill="#fbcfe8" />
                  <path d="M 40 46 C 40 34 60 34 60 46 Z" fill="#0f172a" />
                </g>
              </svg>
            </div>
          </div>

          {/* Guest R2 (Seat 2 - Back Center, x=50.0%): GIRL */}
          <div className="absolute bottom-[7.5%] left-[50%] -translate-x-1/2 z-10 dinner-guest-R2 pointer-events-auto">
            <div className="relative w-16 sm:w-18 md:w-20 h-38 sm:h-42 md:h-48">
              <svg viewBox="0 0 100 210" className="w-full h-full drop-shadow-md">
                <ellipse cx="50" cy="202" rx="20" ry="3.5" fill="#0f172a" opacity="0.22" />

                <g className="guest-walking-legs-R2">
                  <g className="leg-front-thigh">
                    <path d="M 44 125 L 42 162" stroke="#0f172a" strokeWidth="9.5" strokeLinecap="round" />
                    <g className="leg-front-calf" style={{ transformOrigin: "42px 162px" }}>
                      <path d="M 42 162 L 40 195" stroke="#0f172a" strokeWidth="8.5" strokeLinecap="round" />
                      <path d="M 30 195 L 42 195 L 44 199 L 26 199 Z" fill="#020617" />
                      <rect x="25" y="199" width="20" height="2" fill="#78350f" />
                    </g>
                  </g>
                  <g className="leg-back-thigh">
                    <path d="M 56 125 L 58 162" stroke="#1e293b" strokeWidth="9.5" strokeLinecap="round" />
                    <g className="leg-back-calf" style={{ transformOrigin: "58px 162px" }}>
                      <path d="M 58 162 L 60 195" stroke="#1e293b" strokeWidth="8.5" strokeLinecap="round" />
                      <path d="M 48 195 L 60 195 L 62 199 L 44 199 Z" fill="#020617" />
                      <rect x="43" y="199" width="20" height="2" fill="#78350f" />
                    </g>
                  </g>
                </g>

                <g className="guest-seated-legs-R2">
                  <path d="M 46 130 L 46 174 L 44 196" stroke="#334155" strokeWidth="9.5" strokeLinecap="round" />
                  <path d="M 34 196 L 46 196 L 48 200 L 30 200 Z" fill="#020617" />
                  <path d="M 54 130 L 54 174 L 56 196" stroke="#475569" strokeWidth="9.5" strokeLinecap="round" />
                  <path d="M 46 196 L 58 196 L 60 200 L 42 200 Z" fill="#020617" />
                </g>

                {/* GIRL: Midnight Blue Blazer, Gold Pendant, Caramel Wavy Hair & BOTH Hands */}
                <g className="guest-torso-1">
                  <path d="M 34 70 L 66 70 L 62 130 L 38 130 Z" fill="#0f172a" />
                  {/* Cream Silk Blouse & Gold Drop Pendant */}
                  <polygon points="50,70 45,90 55,90" fill="#fef3c7" />
                  <circle cx="50" cy="88" r="2" fill="#facc15" />

                  {/* Hand 1: Conversational Gesturing Hand with Articulated Fingers */}
                  <g className="guest-arm-gesturing">
                    <path d="M 65 74 L 75 100 L 84 92" stroke="#0f172a" strokeWidth="7" strokeLinecap="round" fill="none" />
                    <ellipse cx="85" cy="90" rx="4" ry="4.5" fill="#fed7aa" />
                    <path d="M 85 88 L 89 86 M 85 90 L 90 90 M 85 92 L 88 93" stroke="#ca8a04" strokeWidth="0.8" />
                  </g>

                  {/* Hand 2: Left Conversational Hand */}
                  <path d="M 35 74 L 26 98 L 34 104" stroke="#0f172a" strokeWidth="7" strokeLinecap="round" fill="none" />
                  <ellipse cx="35" cy="105" rx="4" ry="4.5" fill="#fed7aa" />
                  <path d="M 33 104 L 29 102 M 34 106 L 30 106" stroke="#ca8a04" strokeWidth="0.8" />

                  <circle cx="43" cy="46" r="2" fill="none" stroke="#facc15" strokeWidth="0.8" />
                  <rect x="47" y="58" width="6" height="12" fill="#fed7aa" />
                  <ellipse cx="50" cy="46" rx="8" ry="10" fill="#fed7aa" />
                  {/* Flowing Caramel Highlighted Waves */}
                  <path d="M 40 44 C 40 30 60 30 60 44 C 62 55 60 64 57 68 L 43 68 C 40 64 38 55 40 44 Z" fill="#78350f" />
                </g>
              </svg>
            </div>
          </div>

          {/* Guest R3 (Seat 3 - Back Right, x=76.25%): GIRL */}
          <div className="absolute bottom-[7.5%] left-[76.25%] -translate-x-1/2 z-10 dinner-guest-R3 pointer-events-auto">
            <div className="relative w-16 sm:w-18 md:w-20 h-36 sm:h-40 md:h-46">
              <svg viewBox="0 0 100 200" className="w-full h-full drop-shadow-md">
                <ellipse cx="50" cy="192" rx="17" ry="3.5" fill="#0f172a" opacity="0.22" />

                <g className="guest-walking-legs-R3">
                  <g className="leg-front-thigh">
                    <path d="M 47 135 L 45 162" stroke="#065f46" strokeWidth="8.5" strokeLinecap="round" />
                    <g className="leg-front-calf" style={{ transformOrigin: "45px 162px" }}>
                      <path d="M 45 162 L 43 188" stroke="#065f46" strokeWidth="7.5" strokeLinecap="round" />
                      <path d="M 33 188 L 45 188 L 47 192 L 29 192 Z" fill="#0f172a" />
                      <rect x="28" y="192" width="20" height="2" fill="#064e3b" />
                    </g>
                  </g>
                  <g className="leg-back-thigh">
                    <path d="M 53 135 L 55 162" stroke="#047857" strokeWidth="8.5" strokeLinecap="round" />
                    <g className="leg-back-calf" style={{ transformOrigin: "55px 162px" }}>
                      <path d="M 55 162 L 57 188" stroke="#047857" strokeWidth="7.5" strokeLinecap="round" />
                      <path d="M 47 188 L 59 188 L 61 192 L 43 192 Z" fill="#0f172a" />
                      <rect x="42" y="192" width="20" height="2" fill="#064e3b" />
                    </g>
                  </g>
                </g>

                <g className="guest-seated-legs-R3">
                  <path d="M 46 135 L 46 172 L 44 190" stroke="#059669" strokeWidth="8.5" strokeLinecap="round" />
                  <path d="M 34 190 L 46 190 L 48 193 L 30 193 Z" fill="#064e3b" />
                  <path d="M 54 135 L 54 172 L 56 190" stroke="#10b981" strokeWidth="8.5" strokeLinecap="round" />
                  <path d="M 46 190 L 58 190 L 60 193 L 42 193 Z" fill="#064e3b" />
                </g>

                {/* GIRL: Pine Silk Kurti with Gold Embroidery, Chignon Bun & BOTH Hands */}
                <g className="guest-torso-1">
                  <path d="M 38 68 L 62 68 L 68 138 L 32 138 Z" fill="#047857" />
                  <line x1="50" y1="68" x2="50" y2="108" stroke="#facc15" strokeWidth="1.5" />

                  {/* Hand 1: Raising Champagne Glass */}
                  <g className="guest-arm-toast">
                    <path d="M 64 72 L 72 96 L 79 84" stroke="#047857" strokeWidth="6.5" strokeLinecap="round" fill="none" />
                    <polygon points="77,76 83,76 81,81 81,85 83,85 77,85 81,85 81,81" fill="none" stroke="#ffffff" strokeWidth="0.7" />
                    <polygon points="78,77 82,77 81,80" fill="#991b1b" />
                    <ellipse cx="81" cy="83" rx="3.5" ry="3" fill="#fcd34d" />
                    <path d="M 79 83 L 83 83" stroke="#b45309" strokeWidth="0.6" />
                  </g>

                  {/* Hand 2: Left Arm Resting on Table Runner with Defined Fingers */}
                  <path d="M 36 72 L 30 96 L 38 104" stroke="#047857" strokeWidth="6.5" strokeLinecap="round" fill="none" />
                  <ellipse cx="39" cy="105" rx="4" ry="3" fill="#fcd34d" />
                  <path d="M 37 106 L 41 106" stroke="#b45309" strokeWidth="0.6" />

                  <rect x="47" y="56" width="6" height="12" fill="#fcd34d" />
                  <ellipse cx="50" cy="46" rx="8" ry="10" fill="#fcd34d" />
                  {/* Sculptural Chignon Bun with Gold Clip */}
                  <path d="M 40 44 C 40 30 60 30 60 44 Z" fill="#1c1917" />
                  <circle cx="50" cy="30" r="6" fill="#1c1917" />
                  <rect x="46" y="28" width="8" height="3" rx="1" fill="#facc15" />
                </g>
              </svg>
            </div>
          </div>

          {/* LAYER 3: DINING TABLE SURFACE & FRONT STOOL FRAMES (z-20) */}
          <DiningTableSVG tableId="rightTable" />

          {/* LAYER 4: FRONT ROW GUESTS (z-30) */}

          {/* Guest R4 (Seat 4 - Front Left, x=25.6%): GIRL */}
          <div className="absolute bottom-[7.5%] left-[25.6%] -translate-x-1/2 z-30 dinner-guest-R4 pointer-events-auto">
            <div className="relative w-16 sm:w-18 md:w-20 h-36 sm:h-40 md:h-46">
              <svg viewBox="0 0 100 200" className="w-full h-full drop-shadow-md">
                <ellipse cx="50" cy="192" rx="18" ry="3.5" fill="#0f172a" opacity="0.22" />

                <g className="guest-walking-legs-R4">
                  <g className="leg-front-thigh">
                    <path d="M 45 120 L 43 158" stroke="#db2777" strokeWidth="9.5" strokeLinecap="round" />
                    <g className="leg-front-calf" style={{ transformOrigin: "43px 158px" }}>
                      <path d="M 43 158 L 41 188" stroke="#db2777" strokeWidth="8.5" strokeLinecap="round" />
                      <path d="M 31 188 L 43 188 L 45 192 L 27 192 Z" fill="#881337" />
                      <rect x="26" y="192" width="20" height="2" fill="#0f172a" />
                    </g>
                  </g>
                  <g className="leg-back-thigh">
                    <path d="M 55 120 L 57 158" stroke="#f43f5e" strokeWidth="9.5" strokeLinecap="round" />
                    <g className="leg-back-calf" style={{ transformOrigin: "57px 158px" }}>
                      <path d="M 57 158 L 59 188" stroke="#f43f5e" strokeWidth="8.5" strokeLinecap="round" />
                      <path d="M 47 188 L 59 188 L 61 192 L 43 192 Z" fill="#881337" />
                      <rect x="42" y="192" width="20" height="2" fill="#0f172a" />
                    </g>
                  </g>
                </g>

                <g className="guest-seated-legs-R4">
                  <path d="M 44 128 L 58 134 L 56 186" stroke="#db2777" strokeWidth="9.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <path d="M 48 186 L 60 186 L 62 190 L 44 190 Z" fill="#881337" />
                  <rect x="43" y="190" width="20" height="2.5" rx="1" fill="#0f172a" />

                  <path d="M 52 128 L 68 134 L 66 186" stroke="#f43f5e" strokeWidth="9.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <path d="M 58 186 L 70 186 L 72 190 L 54 190 Z" fill="#881337" />
                  <rect x="53" y="190" width="20" height="2.5" rx="1" fill="#0f172a" />
                </g>

                {/* GIRL: Terracotta Ribbed Cardigan, Layered Lob & BOTH Hands */}
                <g className="guest-torso-1">
                  <path d="M 36 70 L 64 70 L 58 126 L 42 126 Z" fill="#c2410c" />
                  <polygon points="50,70 46,82 54,82" fill="#fbcfe8" />

                  {/* Hand 1: Leaning on Table Runner */}
                  <g className="guest-arm-gesturing">
                    <path d="M 38 74 L 28 98 L 38 106" stroke="#c2410c" strokeWidth="7" strokeLinecap="round" fill="none" />
                    <ellipse cx="39" cy="108" rx="4" ry="4" fill="#fed7aa" />
                    <path d="M 37 109 L 41 109 M 38 111 L 41 111" stroke="#d97706" strokeWidth="0.8" />
                  </g>

                  {/* Hand 2: Right Arm with Tasting Glass */}
                  <path d="M 62 74 L 68 98 L 64 108" stroke="#c2410c" strokeWidth="7" strokeLinecap="round" fill="none" />
                  <ellipse cx="64" cy="110" rx="4" ry="4" fill="#fed7aa" />
                  <polygon points="62,104 66,104 65,108 63,108" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.5" />

                  <rect x="47" y="58" width="6" height="12" fill="#fed7aa" />
                  <ellipse cx="50" cy="48" rx="8" ry="10" fill="#fed7aa" />
                  {/* Layered Textured Lob */}
                  <path d="M 41 46 C 41 34 59 34 59 46 C 60 56 58 64 56 66 L 43 66 C 41 64 39 56 41 46 Z" fill="#451a03" />
                </g>
              </svg>
            </div>
          </div>

          {/* Guest R5 (Seat 5 - Front Center, x=50.0%): BOY */}
          <div className="absolute bottom-[7.5%] left-[50%] -translate-x-1/2 z-30 dinner-guest-R5 pointer-events-auto">
            <div className="relative w-16 sm:w-18 md:w-20 h-36 sm:h-40 md:h-46">
              <svg viewBox="0 0 100 200" className="w-full h-full drop-shadow-md">
                <ellipse cx="50" cy="192" rx="18" ry="3.5" fill="#0f172a" opacity="0.22" />

                <g className="guest-walking-legs-R5">
                  <g className="leg-front-thigh">
                    <path d="M 46 120 L 44 158" stroke="#d97706" strokeWidth="9.5" strokeLinecap="round" />
                    <g className="leg-front-calf" style={{ transformOrigin: "44px 158px" }}>
                      <path d="M 44 158 L 42 188" stroke="#d97706" strokeWidth="8.5" strokeLinecap="round" />
                      <path d="M 32 188 L 44 188 L 46 192 L 28 192 Z" fill="#ffffff" />
                      <rect x="27" y="192" width="20" height="2" fill="#78350f" />
                    </g>
                  </g>
                  <g className="leg-back-thigh">
                    <path d="M 54 120 L 56 158" stroke="#f59e0b" strokeWidth="9.5" strokeLinecap="round" />
                    <g className="leg-back-calf" style={{ transformOrigin: "56px 158px" }}>
                      <path d="M 56 158 L 58 188" stroke="#f59e0b" strokeWidth="8.5" strokeLinecap="round" />
                      <path d="M 46 188 L 58 188 L 60 192 L 42 192 Z" fill="#ffffff" />
                      <rect x="41" y="192" width="20" height="2" fill="#78350f" />
                    </g>
                  </g>
                </g>

                <g className="guest-seated-legs-R5">
                  <path d="M 42 128 L 38 142 L 36 186" stroke="#d97706" strokeWidth="9.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <path d="M 28 186 L 40 186 L 42 190 L 24 190 Z" fill="#ffffff" />
                  <rect x="23" y="190" width="20" height="2.5" rx="1" fill="#78350f" />

                  <path d="M 58 128 L 62 142 L 64 186" stroke="#f59e0b" strokeWidth="9.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <path d="M 56 186 L 68 186 L 70 190 L 52 190 Z" fill="#ffffff" />
                  <rect x="51" y="190" width="20" height="2.5" rx="1" fill="#78350f" />
                </g>

                {/* BOY: Olive Chore Coat, Ochre Chinos & BOTH Hands */}
                <g className="guest-torso-1">
                  <path d="M 34 68 L 66 68 L 62 128 L 38 128 Z" fill="#4d7c0f" />

                  {/* Hand 1: Resting on Table Runner */}
                  <g className="guest-arm-gesturing">
                    <path d="M 64 72 L 74 96 L 70 106" stroke="#4d7c0f" strokeWidth="7" strokeLinecap="round" fill="none" />
                    <ellipse cx="69" cy="108" rx="4" ry="4" fill="#fed7aa" />
                    <path d="M 67 109 L 71 109 M 67 111 L 70 111" stroke="#d97706" strokeWidth="0.8" />
                  </g>

                  {/* Hand 2: Resting on Table Runner */}
                  <path d="M 36 72 L 28 96 L 34 106" stroke="#4d7c0f" strokeWidth="7" strokeLinecap="round" fill="none" />
                  <ellipse cx="35" cy="108" rx="4" ry="4" fill="#fed7aa" />
                  <path d="M 33 109 L 37 109 M 34 111 L 37 111" stroke="#d97706" strokeWidth="0.8" />

                  <rect x="47" y="56" width="6" height="12" fill="#fed7aa" />
                  <ellipse cx="50" cy="46" rx="9" ry="10.5" fill="#fed7aa" />
                  <path d="M 41 45 C 41 33 59 33 59 45 Z" fill="#991b1b" />
                </g>
              </svg>
            </div>
          </div>

          {/* Guest R6 (Seat 6 - Front Right, x=74.4%): BOY */}
          <div className="absolute bottom-[7.5%] left-[74.4%] -translate-x-1/2 z-30 dinner-guest-R6 pointer-events-auto">
            <div className="relative w-16 sm:w-18 md:w-20 h-36 sm:h-40 md:h-46">
              <svg viewBox="0 0 100 200" className="w-full h-full drop-shadow-md">
                <ellipse cx="50" cy="192" rx="18" ry="3.5" fill="#0f172a" opacity="0.22" />

                <g className="guest-walking-legs-R6">
                  <g className="leg-front-thigh">
                    <path d="M 46 125 L 44 162" stroke="#2563eb" strokeWidth="9.5" strokeLinecap="round" />
                    <g className="leg-front-calf" style={{ transformOrigin: "44px 162px" }}>
                      <path d="M 44 162 L 42 188" stroke="#2563eb" strokeWidth="8.5" strokeLinecap="round" />
                      <path d="M 32 188 L 44 188 L 46 192 L 28 192 Z" fill="#1e3a8a" />
                      <rect x="27" y="192" width="20" height="2" fill="#0f172a" />
                    </g>
                  </g>
                  <g className="leg-back-thigh">
                    <path d="M 54 125 L 56 162" stroke="#3b82f6" strokeWidth="9.5" strokeLinecap="round" />
                    <g className="leg-back-calf" style={{ transformOrigin: "56px 162px" }}>
                      <path d="M 56 162 L 58 188" stroke="#3b82f6" strokeWidth="8.5" strokeLinecap="round" />
                      <path d="M 46 188 L 58 188 L 60 192 L 42 192 Z" fill="#1e3a8a" />
                      <rect x="41" y="192" width="20" height="2" fill="#0f172a" />
                    </g>
                  </g>
                </g>

                <g className="guest-seated-legs-R6">
                  <path d="M 52 128 L 38 134 L 36 186" stroke="#2563eb" strokeWidth="9.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <path d="M 26 186 L 38 186 L 40 190 L 22 190 Z" fill="#1e3a8a" />
                  <rect x="21" y="190" width="20" height="2.5" rx="1" fill="#0f172a" />

                  <path d="M 58 128 L 46 134 L 44 186" stroke="#3b82f6" strokeWidth="9.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <path d="M 34 186 L 46 186 L 48 190 L 30 190 Z" fill="#1e3a8a" />
                  <rect x="29" y="190" width="20" height="2.5" rx="1" fill="#0f172a" />
                </g>

                {/* BOY: Royal Violet Knit Pullover & BOTH Hands (Raising Toast & Resting on Table) */}
                <g className="guest-torso-1">
                  <path d="M 36 68 L 64 68 L 63 138 L 37 138 Z" fill="#a855f7" />

                  {/* Hand 1: Raising Wine Glass with Fingers */}
                  <g className="guest-arm-toast">
                    <path d="M 40 72 L 30 96 L 24 86" stroke="#a855f7" strokeWidth="6.5" strokeLinecap="round" fill="none" />
                    <polygon points="21,78 27,78 24,83 24,87 27,87 21,87 24,87 24,83" fill="none" stroke="#ffffff" strokeWidth="0.7" />
                    <polygon points="22,79 26,79 24,82" fill="#991b1b" />
                    <ellipse cx="25" cy="85" rx="3.5" ry="3" fill="#fcd34d" />
                    <path d="M 23 85 L 27 85" stroke="#7e22ce" strokeWidth="0.6" />
                  </g>

                  {/* Hand 2: Resting on Table Runner */}
                  <path d="M 64 72 L 72 98 L 64 106" stroke="#a855f7" strokeWidth="6.5" strokeLinecap="round" fill="none" />
                  <ellipse cx="63" cy="108" rx="4" ry="4" fill="#fcd34d" />
                  <path d="M 61 109 L 65 109 M 61 111 L 64 111" stroke="#7e22ce" strokeWidth="0.8" />

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
