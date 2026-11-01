import React from "react";

interface DoodleProps {
  className?: string;
}

/**
 * DoodleTableSanctuary
 * Architectural overhead doodle of an intimate 6-person dinner table with
 * strict 50:50 gender balance, protective aura, candlelight, and zero isolation.
 */
export function DoodleTableSanctuary({ className = "w-full h-auto" }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 340 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`overflow-visible select-none ${className}`}
    >
      <defs>
        <radialGradient id="candleAura" cx="170" cy="120" r="85" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDE68A" stopOpacity="0.45" />
          <stop offset="0.6" stopColor="#C8963E" stopOpacity="0.15" />
          <stop offset="1" stopColor="#FFFDF9" stopOpacity="0" />
        </radialGradient>
        <filter id="tableShadow" x="-10%" y="-10%" width="125%" height="125%">
          <feDropShadow dx="2" dy="5" stdDeviation="5" floodColor="#2D0D17" floodOpacity="0.1" />
        </filter>
      </defs>

      {/* Protective Golden Sanctuary Perimeter Aura */}
      <circle cx="170" cy="120" r="110" stroke="#C8963E" strokeWidth="1.2" strokeDasharray="5 5" opacity="0.35" />
      <circle cx="170" cy="120" r="102" stroke="#2D5A43" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.25" />

      {/* Candlelight Ambient Warmth */}
      <circle cx="170" cy="120" r="85" fill="url(#candleAura)" />

      {/* Main Dining Table (Hand-drawn organic circular contour) */}
      <g filter="url(#tableShadow)">
        <circle
          cx="170"
          cy="120"
          r="62"
          fill="#FFFDF9"
          stroke="#722F37"
          strokeWidth="2.5"
        />
        {/* Inner concentric wood grain / tablecloth ring */}
        <circle
          cx="170"
          cy="120"
          r="54"
          stroke="#C8963E"
          strokeWidth="1"
          strokeDasharray="4 3"
          opacity="0.6"
        />
      </g>

      {/* Table Centerpiece: Candle + Botanical Vase */}
      <circle cx="170" cy="120" r="11" fill="#FDF4DC" stroke="#C8963E" strokeWidth="1.5" />
      {/* Candle Flame with micro-flicker lines */}
      <path
        d="M 170 111 C 166 116 166 122 170 124 C 174 122 174 116 170 111 Z"
        fill="#E07A5F"
      />
      <circle cx="170" cy="119" r="3" fill="#FBBF24" />
      <line x1="170" y1="104" x2="170" y2="108" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="162" y1="107" x2="165" y2="110" stroke="#FBBF24" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="178" y1="107" x2="175" y2="110" stroke="#FBBF24" strokeWidth="1.2" strokeLinecap="round" />

      {/* Plates and Wine Glasses at Each of the 6 Seats */}
      {/* Angle step: 60 degrees. Radians: 0, pi/3, 2pi/3, pi, 4pi/3, 5pi/3 */}
      {/* Seat 1: Top (90 deg -> x=170, y=82) */}
      <circle cx="170" cy="82" r="8" fill="#F4EFE6" stroke="#722F37" strokeWidth="1" />
      <circle cx="182" cy="78" r="3" fill="#722F37" opacity="0.3" stroke="#722F37" strokeWidth="0.8" />

      {/* Seat 2: Top-Right (30 deg -> x=204, y=100) */}
      <circle cx="204" cy="100" r="8" fill="#F4EFE6" stroke="#722F37" strokeWidth="1" />
      <circle cx="215" cy="108" r="3" fill="#722F37" opacity="0.3" stroke="#722F37" strokeWidth="0.8" />

      {/* Seat 3: Bottom-Right (330 deg -> x=204, y=140) */}
      <circle cx="204" cy="140" r="8" fill="#F4EFE6" stroke="#722F37" strokeWidth="1" />
      <circle cx="214" cy="149" r="3" fill="#722F37" opacity="0.3" stroke="#722F37" strokeWidth="0.8" />

      {/* Seat 4: Bottom (270 deg -> x=170, y=158) */}
      <circle cx="170" cy="158" r="8" fill="#F4EFE6" stroke="#722F37" strokeWidth="1" />
      <circle cx="158" cy="162" r="3" fill="#722F37" opacity="0.3" stroke="#722F37" strokeWidth="0.8" />

      {/* Seat 5: Bottom-Left (210 deg -> x=136, y=140) */}
      <circle cx="136" cy="140" r="8" fill="#F4EFE6" stroke="#722F37" strokeWidth="1" />
      <circle cx="126" cy="149" r="3" fill="#722F37" opacity="0.3" stroke="#722F37" strokeWidth="0.8" />

      {/* Seat 6: Top-Left (150 deg -> x=136, y=100) */}
      <circle cx="136" cy="100" r="8" fill="#F4EFE6" stroke="#722F37" strokeWidth="1" />
      <circle cx="125" cy="108" r="3" fill="#722F37" opacity="0.3" stroke="#722F37" strokeWidth="0.8" />

      {/* -------------------------------------------------------- */}
      {/* The 6 Attendees Seated (3 Women, 3 Men Alternating: 50:50) */}
      {/* -------------------------------------------------------- */}

      {/* Seat 1: Woman Attendee (Top - x=170, y=36) */}
      <g transform="translate(170, 36)">
        <circle cx="0" cy="0" r="16" fill="#FCE7F3" stroke="#BE185D" strokeWidth="2" />
        {/* Woman Icon Badge */}
        <circle cx="0" cy="-3" r="5" fill="#BE185D" />
        <path d="M -7 11 C -7 5 7 5 7 11" fill="#BE185D" />
        <rect x="-14" y="18" width="28" height="12" rx="6" fill="#BE185D" />
        <text x="0" y="27" textAnchor="middle" fill="#FFFDF9" fontSize="7.5" fontWeight="700">HER</text>
      </g>

      {/* Seat 2: Man Attendee (Top-Right - x=242, y=78) */}
      <g transform="translate(242, 78)">
        <circle cx="0" cy="0" r="16" fill="#E0E7FF" stroke="#3730A3" strokeWidth="2" />
        <circle cx="0" cy="-3" r="5" fill="#3730A3" />
        <path d="M -7 11 C -7 5 7 5 7 11" fill="#3730A3" />
        <rect x="-14" y="18" width="28" height="12" rx="6" fill="#3730A3" />
        <text x="0" y="27" textAnchor="middle" fill="#FFFDF9" fontSize="7.5" fontWeight="700">HIM</text>
      </g>

      {/* Seat 3: Woman Attendee (Bottom-Right - x=242, y=162) */}
      <g transform="translate(242, 162)">
        <circle cx="0" cy="0" r="16" fill="#FCE7F3" stroke="#BE185D" strokeWidth="2" />
        <circle cx="0" cy="-3" r="5" fill="#BE185D" />
        <path d="M -7 11 C -7 5 7 5 7 11" fill="#BE185D" />
        <rect x="-14" y="18" width="28" height="12" rx="6" fill="#BE185D" />
        <text x="0" y="27" textAnchor="middle" fill="#FFFDF9" fontSize="7.5" fontWeight="700">HER</text>
      </g>

      {/* Seat 4: Man Attendee (Bottom - x=170, y=204) */}
      <g transform="translate(170, 204)">
        <circle cx="0" cy="0" r="16" fill="#E0E7FF" stroke="#3730A3" strokeWidth="2" />
        <circle cx="0" cy="-3" r="5" fill="#3730A3" />
        <path d="M -7 11 C -7 5 7 5 7 11" fill="#3730A3" />
        <rect x="-14" y="18" width="28" height="12" rx="6" fill="#3730A3" />
        <text x="0" y="27" textAnchor="middle" fill="#FFFDF9" fontSize="7.5" fontWeight="700">HIM</text>
      </g>

      {/* Seat 5: Woman Attendee (Bottom-Left - x=98, y=162) */}
      <g transform="translate(98, 162)">
        <circle cx="0" cy="0" r="16" fill="#FCE7F3" stroke="#BE185D" strokeWidth="2" />
        <circle cx="0" cy="-3" r="5" fill="#BE185D" />
        <path d="M -7 11 C -7 5 7 5 7 11" fill="#BE185D" />
        <rect x="-14" y="18" width="28" height="12" rx="6" fill="#BE185D" />
        <text x="0" y="27" textAnchor="middle" fill="#FFFDF9" fontSize="7.5" fontWeight="700">HER</text>
      </g>

      {/* Seat 6: Man Attendee (Top-Left - x=98, y=78) */}
      <g transform="translate(98, 78)">
        <circle cx="0" cy="0" r="16" fill="#E0E7FF" stroke="#3730A3" strokeWidth="2" />
        <circle cx="0" cy="-3" r="5" fill="#3730A3" />
        <path d="M -7 11 C -7 5 7 5 7 11" fill="#3730A3" />
        <rect x="-14" y="18" width="28" height="12" rx="6" fill="#3730A3" />
        <text x="0" y="27" textAnchor="middle" fill="#FFFDF9" fontSize="7.5" fontWeight="700">HIM</text>
      </g>

      {/* Balance Stamp Pill Callout in Bottom Corner */}
      <g transform="translate(20, 20)">
        <rect x="0" y="0" width="108" height="24" rx="12" fill="#2D5A43" stroke="#FFFDF9" strokeWidth="1.5" />
        <text x="54" y="16" textAnchor="middle" fill="#FFFDF9" fontFamily="monospace" fontSize="9.5" fontWeight="700">
          50:50 PARITY
        </text>
      </g>

      {/* Zero Isolation Hand-Drawn Annotation */}
      <path
        d="M 68 185 C 45 195 35 210 50 220"
        stroke="#722F37"
        strokeWidth="1.5"
        strokeDasharray="3 3"
        fill="none"
      />
      <text x="55" y="228" fill="#722F37" fontFamily="serif" fontStyle="italic" fontSize="10">
        No woman left isolated
      </text>
    </svg>
  );
}
