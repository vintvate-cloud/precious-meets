import React from "react";
import { AvatarFigureSVG } from "./AvatarFigureSVG";

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
 * CONSTELLATION NETWORK LINES (z-15)
 * Delicate connecting lines between seated guest badges at the dining table
 * matching the social graph constellation aesthetic in reference image.
 */
function ConstellationNetworkSVG() {
  return (
    <div className="absolute inset-0 w-full h-full z-15 pointer-events-none opacity-40">
      <svg viewBox="0 0 320 160" preserveAspectRatio="none" className="w-full h-full">
        {/* Back row horizontal links */}
        <line x1="76" y1="62" x2="160" y2="62" stroke="#fbbf24" strokeWidth="0.75" strokeDasharray="3 3" />
        <line x1="160" y1="62" x2="244" y2="62" stroke="#fbbf24" strokeWidth="0.75" strokeDasharray="3 3" />

        {/* Cross-table links between attendees */}
        <line x1="76" y1="62" x2="82" y2="122" stroke="#f472b6" strokeWidth="0.6" strokeDasharray="2 2" />
        <line x1="160" y1="62" x2="160" y2="122" stroke="#86efac" strokeWidth="0.6" strokeDasharray="2 2" />
        <line x1="244" y1="62" x2="238" y2="122" stroke="#fbbf24" strokeWidth="0.6" strokeDasharray="2 2" />

        {/* Diagonal conversational connections */}
        <line x1="76" y1="62" x2="160" y2="122" stroke="#fbbf24" strokeWidth="0.5" opacity="0.7" />
        <line x1="160" y1="62" x2="82" y2="122" stroke="#f472b6" strokeWidth="0.5" opacity="0.7" />
        <line x1="160" y1="62" x2="238" y2="122" stroke="#86efac" strokeWidth="0.5" opacity="0.7" />
        <line x1="244" y1="62" x2="160" y2="122" stroke="#fbbf24" strokeWidth="0.5" opacity="0.7" />

        {/* Front row horizontal links */}
        <line x1="82" y1="122" x2="160" y2="122" stroke="#fbbf24" strokeWidth="0.75" strokeDasharray="3 3" />
        <line x1="160" y1="122" x2="238" y2="122" stroke="#fbbf24" strokeWidth="0.75" strokeDasharray="3 3" />
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
        TABLE 1: LEFT SIDE DINING TABLE & 6 GLOWING AVATAR BADGES
        ====================================================================
      */}
      <div className="absolute bottom-1 sm:bottom-2 left-[2%] sm:left-[4%] md:left-[6%] w-72 sm:w-80 md:w-92 h-36 sm:h-40 md:h-46 pointer-events-none select-none z-20">
        <div className="table-spawn relative w-full h-full">
          <div className="table-spawn-burst absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-32 rounded-full border-2 border-[#c6a568] bg-[#c6a568]/15 blur-sm" />
          </div>

          {/* LAYER 1: BACK ROW CHAIR BACKRESTS (z-5) */}
          <BackChairsSVG tableId="leftTable" />

          {/* LAYER 2: BACK ROW GUESTS (z-10) - Glowing Circular Badges resting in chairs */}

          {/* Guest L1 (Seat 1 - Back Left, x=23.75%) */}
          <div className="absolute bottom-[48%] left-[23.75%] -translate-x-1/2 z-10 dinner-guest-L1 pointer-events-auto">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12">
              <AvatarFigureSVG variant="pink" />
            </div>
          </div>

          {/* Guest L2 (Seat 2 - Back Center, x=50.0%) */}
          <div className="absolute bottom-[48%] left-[50%] -translate-x-1/2 z-10 dinner-guest-L2 pointer-events-auto">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12">
              <AvatarFigureSVG variant="gold" />
            </div>
          </div>

          {/* Guest L3 (Seat 3 - Back Right, x=76.25%) */}
          <div className="absolute bottom-[48%] left-[76.25%] -translate-x-1/2 z-10 dinner-guest-L3 pointer-events-auto">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12">
              <AvatarFigureSVG variant="mint" />
            </div>
          </div>

          {/* CONSTELLATION NETWORK LINES (z-15) */}
          <ConstellationNetworkSVG />

          {/* LAYER 3: DINING TABLE SURFACE & FRONT STOOL FRAMES (z-20) */}
          <DiningTableSVG tableId="leftTable" />

          {/* LAYER 4: FRONT ROW GUESTS (z-30) - Glowing Circular Badges resting on stools */}

          {/* Guest L4 (Seat 4 - Front Left, x=25.6%) */}
          <div className="absolute bottom-[18%] left-[25.6%] -translate-x-1/2 z-30 dinner-guest-L4 pointer-events-auto">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12">
              <AvatarFigureSVG variant="ivory" />
            </div>
          </div>

          {/* Guest L5 (Seat 5 - Front Center, x=50.0%) */}
          <div className="absolute bottom-[18%] left-[50%] -translate-x-1/2 z-30 dinner-guest-L5 pointer-events-auto">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12">
              <AvatarFigureSVG variant="pink" />
            </div>
          </div>

          {/* Guest L6 (Seat 6 - Front Right, x=74.4%) */}
          <div className="absolute bottom-[18%] left-[74.4%] -translate-x-1/2 z-30 dinner-guest-L6 pointer-events-auto">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12">
              <AvatarFigureSVG variant="mint" />
            </div>
          </div>
        </div>
      </div>

      {/* 
        ====================================================================
        TABLE 2: RIGHT SIDE DINING TABLE & 6 GLOWING AVATAR BADGES
        ====================================================================
      */}
      <div className="absolute bottom-1 sm:bottom-2 right-[2%] sm:right-[4%] md:right-[6%] w-72 sm:w-80 md:w-92 h-36 sm:h-40 md:h-46 pointer-events-none select-none z-20">
        <div className="table-spawn relative w-full h-full">
          <div className="table-spawn-burst absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-32 rounded-full border-2 border-[#c6a568] bg-[#c6a568]/15 blur-sm" />
          </div>

          {/* LAYER 1: BACK ROW CHAIR BACKRESTS (z-5) */}
          <BackChairsSVG tableId="rightTable" />

          {/* LAYER 2: BACK ROW GUESTS (z-10) - Glowing Circular Badges resting in chairs */}

          {/* Guest R1 (Seat 1 - Back Left, x=23.75%) */}
          <div className="absolute bottom-[48%] left-[23.75%] -translate-x-1/2 z-10 dinner-guest-R1 pointer-events-auto">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12">
              <AvatarFigureSVG variant="gold" />
            </div>
          </div>

          {/* Guest R2 (Seat 2 - Back Center, x=50.0%) */}
          <div className="absolute bottom-[48%] left-[50%] -translate-x-1/2 z-10 dinner-guest-R2 pointer-events-auto">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12">
              <AvatarFigureSVG variant="mint" />
            </div>
          </div>

          {/* Guest R3 (Seat 3 - Back Right, x=76.25%) */}
          <div className="absolute bottom-[48%] left-[76.25%] -translate-x-1/2 z-10 dinner-guest-R3 pointer-events-auto">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12">
              <AvatarFigureSVG variant="pink" />
            </div>
          </div>

          {/* CONSTELLATION NETWORK LINES (z-15) */}
          <ConstellationNetworkSVG />

          {/* LAYER 3: DINING TABLE SURFACE & FRONT STOOL FRAMES (z-20) */}
          <DiningTableSVG tableId="rightTable" />

          {/* LAYER 4: FRONT ROW GUESTS (z-30) - Glowing Circular Badges resting on stools */}

          {/* Guest R4 (Seat 4 - Front Left, x=25.6%) */}
          <div className="absolute bottom-[18%] left-[25.6%] -translate-x-1/2 z-30 dinner-guest-R4 pointer-events-auto">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12">
              <AvatarFigureSVG variant="mint" />
            </div>
          </div>

          {/* Guest R5 (Seat 5 - Front Center, x=50.0%) */}
          <div className="absolute bottom-[18%] left-[50%] -translate-x-1/2 z-30 dinner-guest-R5 pointer-events-auto">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12">
              <AvatarFigureSVG variant="ivory" />
            </div>
          </div>

          {/* Guest R6 (Seat 6 - Front Right, x=74.4%) */}
          <div className="absolute bottom-[18%] left-[74.4%] -translate-x-1/2 z-30 dinner-guest-R6 pointer-events-auto">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12">
              <AvatarFigureSVG variant="gold" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
