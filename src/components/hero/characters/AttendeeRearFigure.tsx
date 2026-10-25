import React, { useId } from "react";

interface AttendeeRearFigureProps {
  gender?: "man" | "woman";
  headRef?: React.RefObject<SVGGElement | null>;
  torsoRef?: React.RefObject<SVGGElement | null>;
  className?: string;
  glowColor?: string;
}

/**
 * ATTENDEE REAR FIGURE (Over-the-Shoulder / Front Row View)
 * Rendered at z-30 in front of the dining table, facing into the table.
 * Matches Reference Images 1 & 2 from the back/three-quarters:
 * - Dark charcoal streetwear hoodie with gathered hood on shoulders
 * - Matte dark over-ear headphones headband and rear earcups
 * - Female: Cascading wavy brunette hair
 * - Male: Clean tapered neckline and textured hair
 * - Subtle candlelight rim illumination reflecting on shoulders
 */
export function AttendeeRearFigure({
  gender = "man",
  headRef,
  torsoRef,
  className = "w-full h-full",
  glowColor = "#fbbf24",
}: AttendeeRearFigureProps) {
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
          {/* Hair Gradient */}
          <linearGradient
            id={`${uniqueId}-rearHair`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#533325" />
            <stop offset="50%" stopColor="#3d2216" />
            <stop offset="100%" stopColor="#1a0c06" />
          </linearGradient>

          {/* Hoodie Back Gradient */}
          <linearGradient
            id={`${uniqueId}-rearHoodie`}
            x1="50%"
            y1="0%"
            x2="50%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#383a41" />
            <stop offset="30%" stopColor="#282a2f" />
            <stop offset="70%" stopColor="#1c1d21" />
            <stop offset="100%" stopColor="#141517" />
          </linearGradient>

          {/* Headphones Gradient */}
          <linearGradient
            id={`${uniqueId}-rearHp`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#3c3e44" />
            <stop offset="100%" stopColor="#131416" />
          </linearGradient>

          {/* Contact Shadow on Stool */}
          <radialGradient id={`${uniqueId}-rearShadow`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0a0c10" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#0a0c10" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Stool Contact Shadow */}
        <ellipse
          cx="60"
          cy="134"
          rx="34"
          ry="6"
          fill={`url(#${uniqueId}-rearShadow)`}
        />

        {/* ============================================================== */}
        {/* GROUP 1: REAR TORSO & HOODIE BACK (Articulated respiration)    */}
        {/* ============================================================== */}
        <g ref={torsoRef} id="rear-torso-group">
          {/* Main Back Panel of Hoodie */}
          <path
            d="M 32 78 
               C 30 72, 40 66, 60 66 
               C 80 66, 90 72, 88 78 
               L 92 122 
               C 92 126, 88 128, 60 128 
               C 32 128, 28 126, 28 122 
               Z"
            fill={`url(#${uniqueId}-rearHoodie)`}
          />

          {/* Left Shoulder & Arm Curve */}
          <path
            d="M 33 76 
               C 21 81, 16 94, 19 116 
               C 21 122, 27 122, 31 118 
               L 34 92 Z"
            fill="#212226"
          />
          {/* Right Shoulder & Arm Curve */}
          <path
            d="M 87 76 
               C 99 81, 104 94, 101 116 
               C 99 122, 93 122, 89 118 
               L 86 92 Z"
            fill="#1f2023"
          />

          {/* Gathered Hoodie Hood resting on Upper Back */}
          <path
            d="M 40 68 
               C 36 78, 48 88, 60 88 
               C 72 88, 84 78, 80 68 
               C 75 74, 67 76, 60 76 
               C 53 76, 45 74, 40 68 Z"
            fill="#17181b"
            stroke="#101113"
            strokeWidth="0.8"
          />
          <path
            d="M 46 72 C 52 79, 68 79, 74 72"
            stroke="#2e3036"
            strokeWidth="1.2"
            strokeLinecap="round"
          />

          {/* Candlelight warm rim reflection from table in front */}
          <path
            d="M 36 68 C 48 64, 72 64, 84 68"
            stroke="#facc15"
            strokeWidth="0.75"
            opacity="0.15"
          />
        </g>

        {/* ============================================================== */}
        {/* GROUP 2: REAR HEAD, HAIR & HEADPHONES (Articulated tilts)       */}
        {/* ============================================================== */}
        <g ref={headRef} id="rear-head-group">
          {/* Female: Cascading Wavy Hair Behind */}
          {gender === "woman" ? (
            <g id="female-rear-hair">
              {/* Main Wavy Hair Mass */}
              <path
                d="M 40 34 
                   C 32 44, 25 60, 27 82 
                   C 29 96, 36 106, 42 108 
                   C 40 98, 42 86, 45 78 
                   L 46 62 Z"
                fill={`url(#${uniqueId}-rearHair)`}
              />
              <path
                d="M 80 34 
                   C 88 44, 95 60, 93 82 
                   C 91 96, 84 106, 78 108 
                   C 80 98, 78 86, 75 78 
                   L 74 62 Z"
                fill={`url(#${uniqueId}-rearHair)`}
              />
              {/* Central Hair Volume Over Hood */}
              <path
                d="M 42 34 
                   C 38 48, 46 80, 52 94 
                   C 56 102, 64 102, 68 94 
                   C 74 80, 82 48, 78 34 
                   C 72 26, 48 26, 42 34 Z"
                fill="#341b10"
              />
              {/* Subtle Hair Wave Highlights */}
              <path
                d="M 48 44 C 44 56, 46 72, 49 84"
                stroke="#533325"
                strokeWidth="1.2"
                strokeLinecap="round"
                opacity="0.6"
              />
              <path
                d="M 72 44 C 76 56, 74 72, 71 84"
                stroke="#533325"
                strokeWidth="1.2"
                strokeLinecap="round"
                opacity="0.6"
              />
            </g>
          ) : (
            /* Male: Clean Tapered Neck Hair */
            <g id="male-rear-hair">
              {/* Head / Neck Base */}
              <path
                d="M 46 48 L 46 68 C 50 72, 70 72, 74 68 L 74 48 Z"
                fill="#2c170d"
              />
              {/* Textured Hair Mass */}
              <ellipse
                cx="60"
                cy="44"
                rx="20"
                ry="22"
                fill={`url(#${uniqueId}-rearHair)`}
              />
              {/* Clean Tapered Neckline Cut */}
              <path
                d="M 50 64 C 54 67, 66 67, 70 64 L 70 68 C 66 71, 54 71, 50 68 Z"
                fill="#1a0c06"
              />
            </g>
          )}

          {/* Over-Ear Headphones Headband across Top / Back of Head */}
          <path
            d="M 33 42 C 33 22, 87 22, 87 42"
            stroke={`url(#${uniqueId}-rearHp)`}
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

          {/* Rear Angle of Earcups */}
          <rect
            x="30"
            y="39"
            width="7"
            height="18"
            rx="3.5"
            fill="#18191c"
            stroke="#101113"
            strokeWidth="0.8"
          />
          <rect
            x="83"
            y="39"
            width="7"
            height="18"
            rx="3.5"
            fill="#18191c"
            stroke="#101113"
            strokeWidth="0.8"
          />
        </g>
      </svg>
    </div>
  );
}
