import React from "react";

interface DoodleProps {
  className?: string;
}

/**
 * DoodleGuardianShield
 * Heraldic luxury shield doodle with vigilance eye, cloche, and dedicated
 * guardian table host custodian insignia.
 */
export function DoodleGuardianShield({ className = "w-full h-auto" }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 340 230"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`overflow-visible select-none ${className}`}
    >
      <defs>
        <filter id="shieldShadow" x="-10%" y="-10%" width="125%" height="125%">
          <feDropShadow dx="3" dy="6" stdDeviation="6" floodColor="#2D0D17" floodOpacity="0.12" />
        </filter>
        <linearGradient id="shieldBg" x1="170" y1="20" x2="170" y2="190" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFDF9" />
          <stop offset="1" stopColor="#F5EFE6" />
        </linearGradient>
      </defs>

      {/* Decorative Protective Radiance Rings */}
      <circle cx="170" cy="115" r="95" stroke="#C8963E" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
      <circle cx="170" cy="115" r="105" stroke="#722F37" strokeWidth="0.75" strokeDasharray="5 5" opacity="0.2" />

      {/* Main Heraldic Shield Contour (Hand-drawn organic curve) */}
      <g filter="url(#shieldShadow)">
        <path
          d="M 170 24 C 220 24 265 34 265 60 C 265 130 205 178 170 196 C 135 178 75 130 75 60 C 75 34 120 24 170 24 Z"
          fill="url(#shieldBg)"
          stroke="#722F37"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Inner concentric gold contour */}
        <path
          d="M 170 34 C 212 34 250 43 250 64 C 250 123 198 166 170 182 C 142 166 90 123 90 64 C 90 43 128 34 170 34 Z"
          stroke="#C8963E"
          strokeWidth="1.2"
          strokeDasharray="4 3"
          opacity="0.8"
        />
      </g>

      {/* Shield Crest Top: Eye of Vigilance & Protection */}
      <g transform="translate(170, 68)">
        {/* Eye contour */}
        <path
          d="M -26 0 C -14 -14 14 -14 26 0 C 14 14 -14 14 -26 0 Z"
          fill="#FFFDF9"
          stroke="#722F37"
          strokeWidth="1.8"
        />
        {/* Iris & Pupil */}
        <circle cx="0" cy="0" r="8" fill="#C8963E" />
        <circle cx="0" cy="0" r="4.5" fill="#722F37" />
        <circle cx="-1.5" cy="-1.5" r="1.5" fill="#FFFDF9" />
        {/* Eyelash micro rays */}
        <line x1="0" y1="-14" x2="0" y2="-19" stroke="#722F37" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="-12" y1="-12" x2="-15" y2="-16" stroke="#722F37" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="12" y1="-12" x2="15" y2="-16" stroke="#722F37" strokeWidth="1.2" strokeLinecap="round" />
      </g>

      {/* Central Dining Cloche & Wine Glasses (Sanctuary symbols) */}
      <g transform="translate(170, 118)">
        {/* Cloche handle */}
        <circle cx="0" cy="-22" r="3" fill="#C8963E" stroke="#722F37" strokeWidth="1.2" />
        {/* Dome */}
        <path
          d="M -28 0 C -28 -18 28 -18 28 0 Z"
          fill="#FDE68A"
          opacity="0.4"
          stroke="#722F37"
          strokeWidth="1.8"
        />
        {/* Plate line */}
        <line x1="-34" y1="2" x2="34" y2="2" stroke="#722F37" strokeWidth="2" strokeLinecap="round" />
        {/* Warm culinary sparkle */}
        <circle cx="-12" cy="-6" r="1.5" fill="#722F37" />
        <circle cx="10" cy="-8" r="1.5" fill="#722F37" />
      </g>

      {/* Guardian Host Insignia Ribbon at bottom of shield */}
      <g transform="translate(170, 155)">
        <rect
          x="-65"
          y="0"
          width="130"
          height="22"
          rx="11"
          fill="#722F37"
          stroke="#FFFDF9"
          strokeWidth="1.5"
        />
        <text
          x="0"
          y="15"
          textAnchor="middle"
          fill="#FFFDF9"
          fontFamily="monospace"
          fontWeight="700"
          fontSize="9"
          letterSpacing="0.8"
        >
          ★ GUARDIAN HOST ON SITE
        </text>
      </g>

      {/* Left Laurel Branch (Hand-drawn) */}
      <g stroke="#2D5A43" strokeWidth="1.5" strokeLinecap="round" fill="none">
        <path d="M 52 140 C 42 100 52 60 70 35" />
        <path d="M 48 115 C 40 114 38 120 48 123" fill="#2D5A43" opacity="0.3" />
        <path d="M 45 90 C 37 89 36 96 46 98" fill="#2D5A43" opacity="0.3" />
        <path d="M 49 66 C 42 63 42 71 51 73" fill="#2D5A43" opacity="0.3" />
        <path d="M 58 45 C 52 41 53 49 61 51" fill="#2D5A43" opacity="0.3" />
      </g>

      {/* Right Laurel Branch (Hand-drawn) */}
      <g stroke="#2D5A43" strokeWidth="1.5" strokeLinecap="round" fill="none">
        <path d="M 288 140 C 298 100 288 60 270 35" />
        <path d="M 292 115 C 300 114 302 120 292 123" fill="#2D5A43" opacity="0.3" />
        <path d="M 295 90 C 303 89 304 96 294 98" fill="#2D5A43" opacity="0.3" />
        <path d="M 291 66 C 298 63 298 71 289 73" fill="#2D5A43" opacity="0.3" />
        <path d="M 282 45 C 288 41 287 49 279 51" fill="#2D5A43" opacity="0.3" />
      </g>

      {/* Hand-drawn annotation stamp */}
      <g transform="translate(245, 175) rotate(6)">
        <rect x="0" y="0" width="82" height="20" rx="6" fill="#F0FDF4" stroke="#16A34A" strokeWidth="1.2" strokeDasharray="3 2" />
        <text x="41" y="14" textAnchor="middle" fill="#16A34A" fontFamily="monospace" fontSize="8" fontWeight="700">
          VETTED ENCLAVE
        </text>
      </g>
    </svg>
  );
}
