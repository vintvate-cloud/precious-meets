import React from "react";

interface DoodleProps {
  className?: string;
}

/**
 * DoodleSosBeacon
 * Hand-drawn smartphone screen broadcasting a discreet 24/7 SOS safety beacon
 * with cellular waves connected to on-site hosts and emergency response.
 */
export function DoodleSosBeacon({ className = "w-full h-auto" }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 340 230"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`overflow-visible select-none ${className}`}
    >
      <defs>
        <filter id="phoneShadow" x="-10%" y="-10%" width="125%" height="125%">
          <feDropShadow dx="3" dy="6" stdDeviation="6" floodColor="#2D0D17" floodOpacity="0.12" />
        </filter>
        <radialGradient id="beaconGlow" cx="170" cy="95" r="90" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F87171" stopOpacity="0.35" />
          <stop offset="0.6" stopColor="#EF4444" stopOpacity="0.1" />
          <stop offset="1" stopColor="#FFFDF9" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Radiating Beacon Pulses */}
      <circle cx="170" cy="95" r="95" fill="url(#beaconGlow)" />
      <circle cx="170" cy="95" r="82" stroke="#DC2626" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
      <circle cx="170" cy="95" r="66" stroke="#DC2626" strokeWidth="1.2" strokeDasharray="5 3" opacity="0.6" />
      <circle cx="170" cy="95" r="50" stroke="#DC2626" strokeWidth="1.5" opacity="0.8" />

      {/* Hand-sketched Smartphone Frame */}
      <g filter="url(#phoneShadow)">
        <rect
          x="125"
          y="28"
          width="90"
          height="164"
          rx="18"
          fill="#FFFDF9"
          stroke="#722F37"
          strokeWidth="2.5"
        />
        {/* Phone Speaker Notch */}
        <line x1="155" y1="38" x2="185" y2="38" stroke="#722F37" strokeWidth="2.5" strokeLinecap="round" />
        {/* Screen Bezel */}
        <rect
          x="132"
          y="46"
          width="76"
          height="132"
          rx="10"
          fill="#FEF2F2"
          stroke="#FCA5A5"
          strokeWidth="1"
        />
      </g>

      {/* Central Pulsing Red SOS Shield Button on Screen */}
      <g transform="translate(170, 95)">
        <circle cx="0" cy="0" r="24" fill="#DC2626" stroke="#B91C1C" strokeWidth="2" />
        {/* Inner white ring */}
        <circle cx="0" cy="0" r="19" stroke="#FEE2E2" strokeWidth="1" strokeDasharray="3 2" />
        {/* SOS Text */}
        <text
          x="0"
          y="5.5"
          textAnchor="middle"
          fill="#FFFDF9"
          fontFamily="monospace"
          fontWeight="900"
          fontSize="14"
          letterSpacing="1"
        >
          SOS
        </text>
      </g>

      {/* Status Bar on Screen */}
      <g transform="translate(136, 134)">
        <rect x="0" y="0" width="68" height="18" rx="6" fill="#FFFDF9" stroke="#E2E8F0" strokeWidth="1" />
        <circle cx="8" cy="9" r="3" fill="#16A34A" />
        <text x="16" y="12" fill="#1E293B" fontFamily="monospace" fontSize="7.5" fontWeight="700">
          BEACON ARMED
        </text>
      </g>

      {/* Host Response Card on Left (Hand-drawn floating card) */}
      <g transform="translate(24, 75)">
        <rect x="0" y="0" width="85" height="48" rx="10" fill="#FFFDF9" stroke="#722F37" strokeWidth="1.5" />
        <circle cx="16" cy="18" r="7" fill="#722F37" />
        <path d="M 12 18 L 15 21 L 20 15" stroke="#FFFDF9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <text x="28" y="16" fill="#722F37" fontFamily="sans-serif" fontSize="7.5" fontWeight="800">TABLE HOST</text>
        <text x="28" y="24" fill="#16A34A" fontFamily="monospace" fontSize="6.5" fontWeight="700">● LIVE ON SITE</text>
        <text x="8" y="38" fill="#64748B" fontFamily="sans-serif" fontSize="7">Instant assistance</text>
        {/* Signal connecting line to phone */}
        <path d="M 85 24 C 105 24 105 75 125 75" stroke="#722F37" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
      </g>

      {/* Emergency Concierge Card on Right */}
      <g transform="translate(230, 75)">
        <rect x="0" y="0" width="88" height="48" rx="10" fill="#FFFDF9" stroke="#2D5A43" strokeWidth="1.5" />
        <circle cx="16" cy="18" r="7" fill="#2D5A43" />
        <path d="M 16 14 V 20 M 13 17 H 19" stroke="#FFFDF9" strokeWidth="1.5" strokeLinecap="round" />
        <text x="28" y="16" fill="#2D5A43" fontFamily="sans-serif" fontSize="7.5" fontWeight="800">24/7 HELPLINE</text>
        <text x="28" y="24" fill="#16A34A" fontFamily="monospace" fontSize="6.5" fontWeight="700">● DISCREET SMS</text>
        <text x="8" y="38" fill="#64748B" fontFamily="sans-serif" fontSize="7">Direct escalation</text>
        {/* Signal connecting line to phone */}
        <path d="M 0 24 C -20 24 -20 75 -15 75" stroke="#2D5A43" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
      </g>

      {/* Floating Stamped Banner */}
      <g transform="translate(95, 202)">
        <rect x="0" y="0" width="150" height="22" rx="11" fill="#DC2626" stroke="#FFFDF9" strokeWidth="1.5" />
        <text x="75" y="15" textAnchor="middle" fill="#FFFDF9" fontFamily="monospace" fontSize="9" fontWeight="700">
          DISCREET ONE-TAP SIGNAL
        </text>
      </g>
    </svg>
  );
}
