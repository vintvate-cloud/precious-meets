import React, { useId } from "react";

interface FemaleAttendeeFigureProps {
  headRef?: React.RefObject<SVGGElement | null>;
  torsoRef?: React.RefObject<SVGGElement | null>;
  className?: string;
  glowColor?: string;
}

/**
 * FEMALE ATTENDEE FIGURE (Frontal / Seated View)
 * Matches Reference Image 1:
 * - 3D vinyl / smooth clay aesthetic
 * - Faceless warm peach head with soft radial shading
 * - Sleek black round-frame spectacles
 * - Matte dark over-ear studio headphones
 * - Voluminous brunette wavy hair cascading over shoulders
 * - Dark charcoal oversized streetwear hoodie with white drawstrings & front pocket
 */
export function FemaleAttendeeFigure({
  headRef,
  torsoRef,
  className = "w-full h-full",
  glowColor = "#f472b6",
}: FemaleAttendeeFigureProps) {
  const uniqueId = useId();

  return (
    <div className={`relative select-none pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 120 140"
        className="w-full h-full overflow-visible drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Faceless Head 3D Radial Clay Shading */}
          <radialGradient
            id={`${uniqueId}-skinGrad`}
            cx="44%"
            cy="36%"
            r="60%"
            fx="38%"
            fy="30%"
          >
            <stop offset="0%" stopColor="#ffdfc9" />
            <stop offset="55%" stopColor="#f4be9b" />
            <stop offset="90%" stopColor="#dc9b75" />
            <stop offset="100%" stopColor="#be7b55" />
          </radialGradient>

          {/* Long Brunette Wavy Hair Gradient */}
          <linearGradient
            id={`${uniqueId}-hairGrad`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#533325" />
            <stop offset="45%" stopColor="#3d2216" />
            <stop offset="85%" stopColor="#2c170d" />
            <stop offset="100%" stopColor="#1a0c06" />
          </linearGradient>

          {/* Dark Charcoal Oversized Hoodie Shading */}
          <linearGradient
            id={`${uniqueId}-hoodieGrad`}
            x1="50%"
            y1="0%"
            x2="50%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#35373d" />
            <stop offset="25%" stopColor="#282a2f" />
            <stop offset="70%" stopColor="#1e2024" />
            <stop offset="100%" stopColor="#151619" />
          </linearGradient>

          {/* Over-ear Headphones Gradient */}
          <linearGradient
            id={`${uniqueId}-hpGrad`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#3a3c42" />
            <stop offset="50%" stopColor="#212226" />
            <stop offset="100%" stopColor="#111214" />
          </linearGradient>

          {/* Soft Ground Contact Shadow */}
          <radialGradient id={`${uniqueId}-shadow`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0a0c10" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#0a0c10" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Contact Shadow */}
        <ellipse
          cx="60"
          cy="134"
          rx="36"
          ry="6"
          fill={`url(#${uniqueId}-shadow)`}
        />

        {/* ============================================================== */}
        {/* GROUP 1: TORSO, HOODIE & ARMS (Articulated for respiration)     */}
        {/* ============================================================== */}
        <g ref={torsoRef} id="female-torso-group">
          {/* Main Hoodie Torso Body */}
          <path
            d="M 32 82 
               C 30 76, 40 70, 60 70 
               C 80 70, 90 76, 88 82 
               L 92 120 
               C 92 124, 88 128, 60 128 
               C 32 128, 28 124, 28 120 
               Z"
            fill={`url(#${uniqueId}-hoodieGrad)`}
          />

          {/* Shoulders & Sleeves Droop (Relaxed streetwear posture) */}
          {/* Left Shoulder / Arm */}
          <path
            d="M 33 79 
               C 22 84, 18 96, 21 114 
               C 23 122, 29 122, 33 118 
               L 35 94 Z"
            fill="#232428"
          />
          {/* Right Shoulder / Arm */}
          <path
            d="M 87 79 
               C 98 84, 102 96, 99 114 
               C 97 122, 91 122, 87 118 
               L 85 94 Z"
            fill="#202125"
          />

          {/* Front Kangaroo Pocket */}
          <path
            d="M 40 102 
               L 80 102 
               L 83 122 
               C 83 124, 76 125, 60 125 
               C 44 125, 37 124, 37 122 
               Z"
            fill="#1c1d21"
            stroke="#121316"
            strokeWidth="0.8"
          />
          {/* Kangaroo Pocket Hand Inset Slits */}
          <path
            d="M 37 107 C 39 113, 41 117, 44 120"
            stroke="#2d2f34"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M 83 107 C 81 113, 79 117, 76 120"
            stroke="#2d2f34"
            strokeWidth="1.2"
            strokeLinecap="round"
          />

          {/* Hoodie Collar Fold & Neck Crease */}
          <path
            d="M 44 72 C 52 79, 68 79, 76 72 C 78 78, 72 84, 60 84 C 48 84, 42 78, 44 72 Z"
            fill="#18191c"
          />

          {/* White Drawstrings with Cylindrical Aglets */}
          {/* Left Drawstring */}
          <path
            d="M 52 77 Q 51 88 52 98"
            stroke="#f8fafc"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle cx="52" cy="99" r="1.4" fill="#e2e8f0" />

          {/* Right Drawstring */}
          <path
            d="M 68 77 Q 69 88 68 98"
            stroke="#f8fafc"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle cx="68" cy="99" r="1.4" fill="#e2e8f0" />

          {/* Soft ambient table rim highlight on chest (candle reflection) */}
          <ellipse
            cx="60"
            cy="90"
            rx="14"
            ry="4"
            fill="#facc15"
            opacity="0.08"
          />
        </g>

        {/* ============================================================== */}
        {/* GROUP 2: HEAD, HAIR, GLASSES & HEADPHONES (Articulated tilts) */}
        {/* ============================================================== */}
        <g ref={headRef} id="female-head-group">
          {/* 1. Back Layer of Wavy Hair (Silhouette behind head/neck) */}
          <path
            d="M 38 40 
               C 28 48, 22 64, 25 84 
               C 27 96, 32 104, 38 108 
               C 35 98, 36 84, 40 76 
               L 42 60 Z"
            fill={`url(#${uniqueId}-hairGrad)`}
          />
          <path
            d="M 82 40 
               C 92 48, 98 64, 95 84 
               C 93 96, 88 104, 82 108 
               C 85 98, 84 84, 80 76 
               L 78 60 Z"
            fill={`url(#${uniqueId}-hairGrad)`}
          />

          {/* 2. Over-Ear Headphones Headband (Arching over head) */}
          <path
            d="M 33 42 C 33 22, 87 22, 87 42"
            stroke={`url(#${uniqueId}-hpGrad)`}
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M 36 39 C 36 24, 84 24, 84 39"
            stroke="#45474e"
            strokeWidth="1"
            fill="none"
            opacity="0.7"
          />

          {/* 3. Smooth Faceless Peach Head (Warm 3D Clay Aesthetic) */}
          {/* Neck */}
          <path
            d="M 53 62 L 53 74 C 55 76, 65 76, 67 74 L 67 62 Z"
            fill="#c98762"
          />
          {/* Head Oval */}
          <ellipse
            cx="60"
            cy="48"
            rx="20"
            ry="24"
            fill={`url(#${uniqueId}-skinGrad)`}
          />

          {/* 4. Over-Ear Headphone Earcups (Matte Charcoal + Soft Rim) */}
          {/* Left Earcup */}
          <g transform="translate(30, 39)">
            <rect
              x="0"
              y="0"
              width="8"
              height="20"
              rx="4"
              fill={`url(#${uniqueId}-hpGrad)`}
              stroke="#18191c"
              strokeWidth="0.8"
            />
            <rect
              x="1.5"
              y="2"
              width="5"
              height="16"
              rx="2.5"
              fill="#2c2d32"
            />
          </g>
          {/* Right Earcup */}
          <g transform="translate(82, 39)">
            <rect
              x="0"
              y="0"
              width="8"
              height="20"
              rx="4"
              fill={`url(#${uniqueId}-hpGrad)`}
              stroke="#18191c"
              strokeWidth="0.8"
            />
            <rect
              x="1.5"
              y="2"
              width="5"
              height="16"
              rx="2.5"
              fill="#2c2d32"
            />
          </g>

          {/* 5. Sleek Black Round Spectacles (Matching Reference 1) */}
          <g transform="translate(42, 42)">
            {/* Left Lens Frame */}
            <circle
              cx="10"
              cy="9"
              r="7.5"
              stroke="#111214"
              strokeWidth="2.4"
              fill="rgba(255,255,255,0.05)"
            />
            {/* Right Lens Frame */}
            <circle
              cx="26"
              cy="9"
              r="7.5"
              stroke="#111214"
              strokeWidth="2.4"
              fill="rgba(255,255,255,0.05)"
            />
            {/* Spectacle Bridge */}
            <path
              d="M 17.5 7.5 Q 18 6.5 18.5 7.5"
              stroke="#111214"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
            />
            {/* Side Temples going toward headphones */}
            <line
              x1="2.5"
              y1="8"
              x2="-4"
              y2="7"
              stroke="#111214"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="33.5"
              y1="8"
              x2="40"
              y2="7"
              stroke="#111214"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>

          {/* 6. Front Wavy Hair Strands (Flowing down over front chest) */}
          <path
            d="M 42 32 
               C 36 36, 32 46, 34 58 
               C 35 66, 32 76, 34 86 
               C 36 94, 40 98, 43 96 
               C 39 88, 38 78, 40 70 
               C 42 62, 44 54, 46 44 
               Z"
            fill={`url(#${uniqueId}-hairGrad)`}
          />
          <path
            d="M 78 32 
               C 84 36, 88 46, 86 58 
               C 85 66, 88 76, 86 86 
               C 84 94, 80 98, 77 96 
               C 81 88, 82 78, 80 70 
               C 78 62, 76 54, 74 44 
               Z"
            fill={`url(#${uniqueId}-hairGrad)`}
          />
          {/* Top Hair Volume & Center Part */}
          <path
            d="M 42 34 
               C 48 26, 72 26, 78 34 
               C 72 31, 64 30, 60 33 
               C 56 30, 48 31, 42 34 Z"
            fill="#3a1e12"
          />
        </g>
      </svg>
    </div>
  );
}
