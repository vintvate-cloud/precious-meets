import React from "react";

interface DoodleProps {
  className?: string;
}

/**
 * DoodleAadhaarVault
 * Hand-drawn luxury vector illustration of an Aadhaar ID card locked within
 * a DigiLocker cryptographic vault, featuring zero-biometrics stamps and security seals.
 */
export function DoodleAadhaarVault({ className = "w-full h-auto" }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 340 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`overflow-visible select-none ${className}`}
    >
      <defs>
        {/* Soft paper drop shadow */}
        <filter id="vaultShadow" x="-10%" y="-10%" width="125%" height="125%">
          <feDropShadow dx="3" dy="6" stdDeviation="6" floodColor="#2D0D17" floodOpacity="0.12" />
        </filter>
        <linearGradient id="cardGrad" x1="0" y1="0" x2="300" y2="180" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFDF9" />
          <stop offset="1" stopColor="#F5EFE6" />
        </linearGradient>
        <linearGradient id="shieldGrad" x1="150" y1="20" x2="190" y2="90" gradientUnits="userSpaceOnUse">
          <stop stopColor="#722F37" />
          <stop offset="1" stopColor="#4A1521" />
        </linearGradient>
      </defs>

      {/* Decorative Hand-drawn Background Halo */}
      <circle cx="170" cy="110" r="95" stroke="#C8963E" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
      <circle cx="170" cy="110" r="105" stroke="#2D5A43" strokeWidth="0.75" strokeDasharray="6 6" opacity="0.2" />

      {/* Main Aadhaar Card Silhouette (Hand-drawn jittered border) */}
      <g filter="url(#vaultShadow)">
        <rect
          x="35"
          y="35"
          width="270"
          height="150"
          rx="16"
          fill="url(#cardGrad)"
          stroke="#722F37"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Subtle Ashoka / Tricolor top accent bar */}
        <path
          d="M 37 49 Q 170 47 303 49"
          stroke="#E07A5F"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d="M 37 53 Q 170 51 303 53"
          stroke="#F4F1DE"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.9"
        />
        <path
          d="M 37 56 Q 170 54 303 56"
          stroke="#2D5A43"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.85"
        />
      </g>

      {/* Card Details: Photo Box Placeholder (Hand-sketched) */}
      <rect
        x="55"
        y="75"
        width="54"
        height="64"
        rx="8"
        fill="#EFEAE1"
        stroke="#722F37"
        strokeWidth="1.5"
        strokeDasharray="2 2"
      />
      {/* Hand-drawn verified silhouette inside photo */}
      <circle cx="82" cy="95" r="12" fill="#C8963E" opacity="0.3" stroke="#722F37" strokeWidth="1.2" />
      <path
        d="M 66 128 C 66 112 98 112 98 128"
        fill="#722F37"
        opacity="0.4"
        stroke="#722F37"
        strokeWidth="1.2"
      />
      {/* Tiny verified tick on photo */}
      <circle cx="98" cy="128" r="8" fill="#2D5A43" />
      <path d="M 94 128 L 97 131 L 102 125" stroke="#FFFDF9" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />

      {/* Masked Aadhaar Lines (•••• •••• 100% Offline XML) */}
      <g stroke="#722F37" strokeWidth="1.5" strokeLinecap="round" opacity="0.75">
        <line x1="125" y1="82" x2="260" y2="82" strokeWidth="3" stroke="#722F37" opacity="0.9" />
        <line x1="125" y1="96" x2="220" y2="96" strokeWidth="2" strokeDasharray="6 4" />
        <line x1="125" y1="108" x2="245" y2="108" strokeWidth="2" strokeDasharray="8 4" />
      </g>

      {/* Stamped Masked Number (•••• •••• XXXX) */}
      <g transform="translate(125, 126)">
        <text
          x="0"
          y="12"
          fill="#722F37"
          fontFamily="monospace"
          fontWeight="700"
          fontSize="11.5"
          letterSpacing="1.5"
        >
          AADHAAR VERIFIED
        </text>
      </g>

      {/* Private & Safe Stamp */}
      <g transform="translate(230, 115) rotate(-12)">
        <rect
          x="0"
          y="0"
          width="74"
          height="32"
          rx="6"
          fill="#FFF7ED"
          stroke="#EA580C"
          strokeWidth="1.5"
          strokeDasharray="3 2"
        />
        <text
          x="37"
          y="14"
          textAnchor="middle"
          fill="#EA580C"
          fontFamily="system-ui"
          fontWeight="800"
          fontSize="7.5"
          letterSpacing="0.5"
        >
          INTERNAL ONLY
        </text>
        <text
          x="37"
          y="24"
          textAnchor="middle"
          fill="#C2410C"
          fontFamily="system-ui"
          fontWeight="600"
          fontSize="7"
        >
          NEVER PUBLIC
        </text>
      </g>

      {/* Large Floating Central Padlock / Cryptographic Seal */}
      <g transform="translate(145, 12)">
        {/* Shackle */}
        <path
          d="M 12 28 V 16 C 12 7.5 38 7.5 38 16 V 28"
          stroke="#C8963E"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        {/* Lock Body */}
        <rect
          x="4"
          y="26"
          width="42"
          height="36"
          rx="10"
          fill="url(#shieldGrad)"
          stroke="#C8963E"
          strokeWidth="2"
        />
        {/* Keyhole */}
        <circle cx="25" cy="40" r="4" fill="#C8963E" />
        <path d="M 23.5 42 L 21 52 H 29 L 26.5 42 Z" fill="#C8963E" />
        {/* Cryptographic twinkle sparks */}
        <path d="M -4 18 L 0 22 L -4 26 L -8 22 Z" fill="#C8963E" opacity="0.8" />
        <path d="M 52 38 L 55 41 L 52 44 L 49 41 Z" fill="#2D5A43" opacity="0.9" />
      </g>

      {/* Official Government ID Verification Ribbon Stamp */}
      <g transform="translate(42, 162)">
        <rect
          x="0"
          y="0"
          width="145"
          height="22"
          rx="11"
          fill="#2D5A43"
          stroke="#FFFDF9"
          strokeWidth="1.5"
        />
        <circle cx="12" cy="11" r="5" fill="#FFFDF9" />
        <path d="M 9.5 11 L 11.5 13 L 15 9" stroke="#2D5A43" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <text
          x="24"
          y="15"
          fill="#FFFDF9"
          fontFamily="monospace"
          fontWeight="700"
          fontSize="9"
          letterSpacing="0.8"
        >
          GOVT AADHAAR AUDITED
        </text>
      </g>

      {/* Decorative hand-drawn arrow pointing to verification */}
      <path
        d="M 285 45 C 310 50 315 85 290 100"
        stroke="#722F37"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="3 3"
        fill="none"
      />
      <path d="M 292 94 L 290 100 L 297 101" stroke="#722F37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <text x="250" y="32" fill="#722F37" fontFamily="serif" fontStyle="italic" fontSize="10">
        Photo Matched
      </text>
    </svg>
  );
}
