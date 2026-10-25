import React, { useId } from "react";

interface MaleAttendeeFigureProps {
  headRef?: React.RefObject<SVGGElement | null>;
  torsoRef?: React.RefObject<SVGGElement | null>;
  className?: string;
  glowColor?: string;
}

/**
 * MALE ATTENDEE FIGURE (Frontal / Seated View)
 * Matches Reference Image 2:
 * - 3D vinyl / smooth clay aesthetic
 * - Faceless warm peach head with soft radial shading
 * - Sleek black spectacles (square-rounded modern frame)
 * - Matte dark over-ear studio headphones
 * - Clean side-parted textured brown hair
 * - Dark charcoal streetwear hoodie with white drawstrings & front pocket
 */
export function MaleAttendeeFigure({
  headRef,
  torsoRef,
  className = "w-full h-full",
  glowColor = "#fbbf24",
}: MaleAttendeeFigureProps) {
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

          {/* Side-Parted Textured Brown Hair Gradient */}
          <linearGradient
            id={`${uniqueId}-maleHairGrad`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#5a3828" />
            <stop offset="45%" stopColor="#43261a" />
            <stop offset="85%" stopColor="#2c170d" />
            <stop offset="100%" stopColor="#1a0c06" />
          </linearGradient>

          {/* Dark Charcoal Streetwear Hoodie Shading */}
          <linearGradient
            id={`${uniqueId}-maleHoodieGrad`}
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
            id={`${uniqueId}-maleHpGrad`}
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
          <radialGradient id={`${uniqueId}-maleShadow`} cx="50%" cy="50%" r="50%">
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
          fill={`url(#${uniqueId}-maleShadow)`}
        />

        {/* ============================================================== */}
        {/* GROUP 1: TORSO, HOODIE & ARMS (Articulated for respiration)     */}
        {/* ============================================================== */}
        <g ref={torsoRef} id="male-torso-group">
          {/* Main Hoodie Body */}
          <path
            d="M 32 80 
               C 30 74, 40 68, 60 68 
               C 80 68, 90 74, 88 80 
               L 92 120 
               C 92 124, 88 128, 60 128 
               C 32 128, 28 124, 28 120 
               Z"
            fill={`url(#${uniqueId}-maleHoodieGrad)`}
          />

          {/* Athletic Shoulders & Sleeves Droop */}
          {/* Left Arm / Shoulder */}
          <path
            d="M 33 77 
               C 21 82, 17 95, 20 114 
               C 22 122, 28 122, 32 118 
               L 35 92 Z"
            fill="#232428"
          />
          {/* Right Arm / Shoulder */}
          <path
            d="M 87 77 
               C 99 82, 103 95, 100 114 
               C 98 122, 92 122, 88 118 
               L 85 92 Z"
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
          {/* Inset Slits */}
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
            d="M 44 70 C 52 77, 68 77, 76 70 C 78 76, 72 82, 60 82 C 48 82, 42 76, 44 70 Z"
            fill="#18191c"
          />

          {/* White Drawstrings with Cylindrical Aglets */}
          {/* Left Drawstring */}
          <path
            d="M 52 75 Q 51 86 52 96"
            stroke="#f8fafc"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle cx="52" cy="97" r="1.4" fill="#e2e8f0" />

          {/* Right Drawstring */}
          <path
            d="M 68 75 Q 69 86 68 96"
            stroke="#f8fafc"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle cx="68" cy="97" r="1.4" fill="#e2e8f0" />

          {/* Ambient Candlelight Warm Reflection */}
          <ellipse
            cx="60"
            cy="88"
            rx="14"
            ry="4"
            fill="#facc15"
            opacity="0.08"
          />
        </g>

        {/* ============================================================== */}
        {/* GROUP 2: HEAD, HAIR, GLASSES & HEADPHONES (Articulated tilts) */}
        {/* ============================================================== */}
        <g ref={headRef} id="male-head-group">
          {/* 1. Over-Ear Headphones Headband (Arching over head) */}
          <path
            d="M 33 40 C 33 20, 87 20, 87 40"
            stroke={`url(#${uniqueId}-maleHpGrad)`}
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M 36 37 C 36 22, 84 22, 84 37"
            stroke="#45474e"
            strokeWidth="1"
            fill="none"
            opacity="0.7"
          />

          {/* 2. Neck */}
          <path
            d="M 53 60 L 53 72 C 55 74, 65 74, 67 72 L 67 60 Z"
            fill="#c98762"
          />

          {/* 3. Smooth Faceless Peach Head (Warm 3D Clay Aesthetic) */}
          <ellipse
            cx="60"
            cy="47"
            rx="19.5"
            ry="23.5"
            fill={`url(#${uniqueId}-skinGrad)`}
          />

          {/* 4. Side-Parted Textured Hair (Matching Reference Image 2) */}
          {/* Hair Base */}
          <path
            d="M 40 40 
               C 39 30, 46 22, 60 22 
               C 74 22, 81 30, 80 40 
               C 80 34, 73 31, 62 31 
               C 51 31, 44 33, 40 40 Z"
            fill={`url(#${uniqueId}-maleHairGrad)`}
          />
          {/* Side-Part Swoop & Textured Volume */}
          <path
            d="M 41 38 
               C 44 28, 54 24, 68 25 
               C 78 26, 80 32, 79 38 
               C 75 33, 68 31, 58 32 
               C 50 33, 44 35, 41 38 Z"
            fill="#3a1e12"
          />
          {/* Left Temple Taper */}
          <path
            d="M 40 38 C 39 42, 40 46, 42 49 C 43 45, 42 41, 41 38 Z"
            fill="#2c170d"
          />

          {/* 5. Over-Ear Headphone Earcups (Matte Charcoal) */}
          {/* Left Earcup */}
          <g transform="translate(30, 37)">
            <rect
              x="0"
              y="0"
              width="8"
              height="20"
              rx="4"
              fill={`url(#${uniqueId}-maleHpGrad)`}
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
          <g transform="translate(82, 37)">
            <rect
              x="0"
              y="0"
              width="8"
              height="20"
              rx="4"
              fill={`url(#${uniqueId}-maleHpGrad)`}
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

          {/* 6. Sleek Black Spectacles (Square-Rounded Matching Reference 2) */}
          <g transform="translate(42, 41)">
            {/* Left Lens Frame (Square-Rounded) */}
            <rect
              x="2"
              y="2"
              width="15"
              height="14"
              rx="4.5"
              stroke="#111214"
              strokeWidth="2.4"
              fill="rgba(255,255,255,0.05)"
            />
            {/* Right Lens Frame (Square-Rounded) */}
            <rect
              x="19"
              y="2"
              width="15"
              height="14"
              rx="4.5"
              stroke="#111214"
              strokeWidth="2.4"
              fill="rgba(255,255,255,0.05)"
            />
            {/* Spectacle Bridge */}
            <path
              d="M 17 8 L 19 8"
              stroke="#111214"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            {/* Side Temples going toward headphones */}
            <line
              x1="2"
              y1="8"
              x2="-4"
              y2="7.5"
              stroke="#111214"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="34"
              y1="8"
              x2="40"
              y2="7.5"
              stroke="#111214"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}
