import React, { useId } from "react";

interface PromenadeHumanFigureProps {
  gender?: "man" | "woman";
  className?: string;
  glowColor?: string;
}

/**
 * PROMENADE HUMAN FIGURE (Full Body Strolling Character)
 * Exact full-body match to Reference Images 1 & 2:
 * - Female: Wavy brown hair, glasses, headphones, charcoal hoodie, loose cargo joggers, cream sneakers
 * - Male: Neat parted brown hair, glasses, headphones, charcoal hoodie, tapered joggers, dark sneakers
 * - Strolling along the Delhi promenade in background and midground layers
 */
export function PromenadeHumanFigure({
  gender = "woman",
  className = "w-full h-full",
  glowColor = "#fbbf24",
}: PromenadeHumanFigureProps) {
  const uniqueId = useId();

  return (
    <div className={`relative select-none pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 100 200"
        className="w-full h-full overflow-visible drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Peach 3D Radial Skin Gradient */}
          <radialGradient
            id={`${uniqueId}-promSkin`}
            cx="44%"
            cy="36%"
            r="60%"
            fx="38%"
            fy="30%"
          >
            <stop offset="0%" stopColor="#ffdfc9" />
            <stop offset="55%" stopColor="#f4be9b" />
            <stop offset="100%" stopColor="#be7b55" />
          </radialGradient>

          {/* Hair Gradient */}
          <linearGradient
            id={`${uniqueId}-promHair`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#533325" />
            <stop offset="50%" stopColor="#3d2216" />
            <stop offset="100%" stopColor="#1a0c06" />
          </linearGradient>

          {/* Charcoal Streetwear Fabric Gradient */}
          <linearGradient
            id={`${uniqueId}-promCharcoal`}
            x1="50%"
            y1="0%"
            x2="50%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#35373d" />
            <stop offset="30%" stopColor="#27292e" />
            <stop offset="80%" stopColor="#1c1d21" />
            <stop offset="100%" stopColor="#141518" />
          </linearGradient>

          {/* Promenade Ground Shadow */}
          <radialGradient id={`${uniqueId}-promShadow`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#08090d" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#08090d" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Ground Shadow on Delhi promenade */}
        <ellipse
          cx="50"
          cy="194"
          rx="32"
          ry="6"
          fill={`url(#${uniqueId}-promShadow)`}
        />

        {/* ============================================================== */}
        {/* LEGS & SNEAKERS (Matching Reference Streetwear)                */}
        {/* ============================================================== */}
        {gender === "woman" ? (
          /* Female: Loose Baggy Cargo Joggers + Light Retro Sneakers */
          <g id="female-prom-legs">
            {/* Left Cargo Leg */}
            <path
              d="M 37 106 
                 L 33 168 
                 C 33 174, 45 174, 47 168 
                 L 49 116 Z"
              fill={`url(#${uniqueId}-promCharcoal)`}
            />
            {/* Left Side Cargo Flap Pocket */}
            <rect
              x="28"
              y="126"
              width="8"
              height="18"
              rx="2"
              fill="#202125"
              stroke="#131416"
              strokeWidth="0.8"
            />
            <path d="M 28 130 L 36 130" stroke="#2d2f34" strokeWidth="1" />

            {/* Right Cargo Leg */}
            <path
              d="M 51 116 
                 L 53 168 
                 C 55 174, 67 174, 67 168 
                 L 63 106 Z"
              fill={`url(#${uniqueId}-promCharcoal)`}
            />
            {/* Right Side Cargo Flap Pocket */}
            <rect
              x="64"
              y="126"
              width="8"
              height="18"
              rx="2"
              fill="#202125"
              stroke="#131416"
              strokeWidth="0.8"
            />
            <path d="M 64 130 L 72 130" stroke="#2d2f34" strokeWidth="1" />

            {/* Retro Off-White / Cream Sneakers (Matching Reference 1) */}
            {/* Left Sneaker */}
            <g transform="translate(29, 166)">
              <ellipse cx="10" cy="18" rx="10" ry="4" fill="#0f1013" opacity="0.3" />
              <path
                d="M 2 12 C 2 6, 7 3, 11 3 L 17 5 C 20 8, 20 14, 18 16 L 2 16 Z"
                fill="#f1f0ea"
                stroke="#d6d3cb"
                strokeWidth="0.8"
              />
              <rect x="1" y="14" width="19" height="4" rx="1.5" fill="#e8e6dc" />
              <path d="M 7 8 Q 11 9 14 7" stroke="#b8b5ac" strokeWidth="0.9" />
            </g>
            {/* Right Sneaker */}
            <g transform="translate(53, 168)">
              <ellipse cx="10" cy="18" rx="10" ry="4" fill="#0f1013" opacity="0.3" />
              <path
                d="M 2 12 C 2 6, 7 3, 11 3 L 17 5 C 20 8, 20 14, 18 16 L 2 16 Z"
                fill="#f1f0ea"
                stroke="#d6d3cb"
                strokeWidth="0.8"
              />
              <rect x="1" y="14" width="19" height="4" rx="1.5" fill="#e8e6dc" />
              <path d="M 7 8 Q 11 9 14 7" stroke="#b8b5ac" strokeWidth="0.9" />
            </g>
          </g>
        ) : (
          /* Male: Tapered Sweatpants with Ankle Cuffs + All-Black Sneakers */
          <g id="male-prom-legs">
            {/* Left Tapered Leg */}
            <path
              d="M 37 106 
                 L 35 166 
                 C 35 170, 45 170, 46 166 
                 L 49 114 Z"
              fill={`url(#${uniqueId}-promCharcoal)`}
            />
            {/* Left Ankle Ribbed Cuff */}
            <rect x="35" y="164" width="10" height="4" rx="1" fill="#1b1c1f" />

            {/* Right Tapered Leg */}
            <path
              d="M 51 114 
                 L 54 166 
                 C 55 170, 65 170, 65 166 
                 L 63 106 Z"
              fill={`url(#${uniqueId}-promCharcoal)`}
            />
            {/* Right Ankle Ribbed Cuff */}
            <rect x="55" y="164" width="10" height="4" rx="1" fill="#1b1c1f" />

            {/* All-Black Low Sneakers (Matching Reference 2) */}
            {/* Left Sneaker */}
            <g transform="translate(32, 166)">
              <ellipse cx="9" cy="18" rx="9" ry="3.5" fill="#0f1013" opacity="0.4" />
              <path
                d="M 2 12 C 2 7, 6 4, 10 4 L 16 6 C 18 8, 18 14, 16 16 L 2 16 Z"
                fill="#1f2024"
                stroke="#121316"
                strokeWidth="0.8"
              />
              <rect x="1" y="14" width="17" height="4" rx="1.5" fill="#151619" />
              <path d="M 6 8 Q 10 9 13 7" stroke="#37393f" strokeWidth="1" />
            </g>
            {/* Right Sneaker */}
            <g transform="translate(53, 166)">
              <ellipse cx="9" cy="18" rx="9" ry="3.5" fill="#0f1013" opacity="0.4" />
              <path
                d="M 2 12 C 2 7, 6 4, 10 4 L 16 6 C 18 8, 18 14, 16 16 L 2 16 Z"
                fill="#1f2024"
                stroke="#121316"
                strokeWidth="0.8"
              />
              <rect x="1" y="14" width="17" height="4" rx="1.5" fill="#151619" />
              <path d="M 6 8 Q 10 9 13 7" stroke="#37393f" strokeWidth="1" />
            </g>
          </g>
        )}

        {/* ============================================================== */}
        {/* HOODIE TORSO & ARMS (Hands tucked in pockets)                  */}
        {/* ============================================================== */}
        <g id="prom-torso">
          {/* Main Torso */}
          <path
            d="M 32 60 
               C 30 54, 40 48, 50 48 
               C 60 48, 70 54, 68 60 
               L 71 106 
               C 71 110, 68 112, 50 112 
               C 32 112, 29 110, 29 106 
               Z"
            fill={`url(#${uniqueId}-promCharcoal)`}
          />

          {/* Left Dropped Sleeve / Arm into pocket */}
          <path
            d="M 32 58 
               C 23 62, 20 74, 23 94 
               C 25 102, 31 102, 35 98 
               L 35 72 Z"
            fill="#222327"
          />
          {/* Right Dropped Sleeve / Arm into pocket */}
          <path
            d="M 68 58 
               C 77 62, 80 74, 77 94 
               C 75 102, 69 102, 65 98 
               L 65 72 Z"
            fill="#202125"
          />

          {/* Kangaroo Pocket with Hand Insets */}
          <path
            d="M 36 84 L 64 84 L 67 106 C 67 108, 60 109, 50 109 C 40 109, 33 108, 33 106 Z"
            fill="#1b1c20"
          />
          <path d="M 33 88 C 35 94, 37 98, 40 102" stroke="#2d2f34" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M 67 88 C 65 94, 63 98, 60 102" stroke="#2d2f34" strokeWidth="1.2" strokeLinecap="round" />

          {/* Ribbed Bottom Waistband */}
          <rect x="29" y="106" width="42" height="6" rx="2" fill="#18191c" />

          {/* White Drawstrings with Cylindrical Aglets */}
          <path d="M 46 54 Q 45 64 46 74" stroke="#f8fafc" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="46" cy="75" r="1.3" fill="#e2e8f0" />
          <path d="M 54 54 Q 55 64 54 74" stroke="#f8fafc" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="54" cy="75" r="1.3" fill="#e2e8f0" />
        </g>

        {/* ============================================================== */}
        {/* HEAD, HAIR, GLASSES & HEADPHONES                               */}
        {/* ============================================================== */}
        <g id="prom-head">
          {/* Headphones Headband */}
          <path d="M 32 30 C 32 14, 68 14, 68 30" stroke="#212226" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M 34 28 C 34 16, 66 16, 66 28" stroke="#45474e" strokeWidth="0.8" fill="none" opacity="0.7" />

          {/* Neck */}
          <path d="M 45 44 L 45 52 C 47 54, 53 54, 55 52 L 55 44 Z" fill="#c98762" />

          {/* Faceless Peach Head (Clay Aesthetic) */}
          <ellipse cx="50" cy="34" rx="14" ry="17" fill={`url(#${uniqueId}-promSkin)`} />

          {/* Hair */}
          {gender === "woman" ? (
            /* Female Long Wavy Hair */
            <g id="female-hair">
              <path
                d="M 37 24 
                   C 30 30, 26 42, 28 58 
                   C 29 68, 34 76, 38 78 
                   C 35 70, 36 60, 39 52 
                   L 40 40 Z"
                fill={`url(#${uniqueId}-promHair)`}
              />
              <path
                d="M 63 24 
                   C 70 30, 74 42, 72 58 
                   C 71 68, 66 76, 62 78 
                   C 65 70, 64 60, 61 52 
                   L 60 40 Z"
                fill={`url(#${uniqueId}-promHair)`}
              />
              {/* Crown Volume */}
              <path
                d="M 37 24 C 42 18, 58 18, 63 24 C 58 22, 52 21, 50 23 C 48 21, 42 22, 37 24 Z"
                fill="#3a1e12"
              />
            </g>
          ) : (
            /* Male Side-Parted Hair */
            <g id="male-hair">
              <path
                d="M 36 28 
                   C 36 20, 42 16, 50 16 
                   C 58 16, 64 20, 64 28 
                   C 62 23, 56 22, 50 23 
                   C 44 22, 38 23, 36 28 Z"
                fill={`url(#${uniqueId}-promHair)`}
              />
              <path
                d="M 37 26 C 40 19, 47 17, 56 18 C 62 19, 64 23, 63 28 C 60 24, 55 22, 49 23 C 44 24, 39 25, 37 26 Z"
                fill="#3a1e12"
              />
            </g>
          )}

          {/* Over-Ear Headphones Earcups */}
          <rect x="29" y="27" width="6" height="15" rx="3" fill="#1c1d21" stroke="#121316" strokeWidth="0.6" />
          <rect x="65" y="27" width="6" height="15" rx="3" fill="#1c1d21" stroke="#121316" strokeWidth="0.6" />

          {/* Spectacles */}
          <g transform="translate(38, 29)">
            {gender === "woman" ? (
              /* Round Frames */
              <>
                <circle cx="6" cy="6" r="5" stroke="#111214" strokeWidth="1.8" fill="rgba(255,255,255,0.05)" />
                <circle cx="18" cy="6" r="5" stroke="#111214" strokeWidth="1.8" fill="rgba(255,255,255,0.05)" />
                <path d="M 11 5 Q 12 4.5 13 5" stroke="#111214" strokeWidth="1.6" />
              </>
            ) : (
              /* Square-Rounded Frames */
              <>
                <rect x="1" y="1" width="10" height="9" rx="3" stroke="#111214" strokeWidth="1.8" fill="rgba(255,255,255,0.05)" />
                <rect x="13" y="1" width="10" height="9" rx="3" stroke="#111214" strokeWidth="1.8" fill="rgba(255,255,255,0.05)" />
                <path d="M 11 5 L 13 5" stroke="#111214" strokeWidth="1.6" />
              </>
            )}
          </g>
        </g>
      </svg>
    </div>
  );
}
