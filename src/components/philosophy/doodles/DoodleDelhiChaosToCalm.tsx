import React from "react";

interface DoodleProps {
  className?: string;
}

/**
 * DoodleDelhiChaosToCalm
 * Panoramic editorial doodle illustrating the transformation from chaotic,
 * exhausting Delhi nightlife/anonymous apps into the safe, candlelit sanctuary table.
 */
export function DoodleDelhiChaosToCalm({ className = "w-full h-auto" }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 680 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`overflow-visible select-none ${className}`}
    >
      <defs>
        <linearGradient id="chaosBg" x1="0" y1="0" x2="280" y2="200" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FEE2E2" stopOpacity="0.7" />
          <stop offset="1" stopColor="#FEF2F2" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="calmBg" x1="400" y1="0" x2="680" y2="200" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ECFDF5" stopOpacity="0.8" />
          <stop offset="1" stopColor="#F0FDF4" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* ------------------------------------------------------------- */}
      {/* LEFT ZONE: The Urban Exhaustion (Noise, Anonymity, Uncertainty) */}
      {/* ------------------------------------------------------------- */}
      <g transform="translate(10, 10)">
        <rect x="0" y="0" width="280" height="195" rx="20" fill="url(#chaosBg)" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="4 3" />
        
        {/* Label */}
        <rect x="18" y="14" width="132" height="20" rx="10" fill="#EF4444" />
        <text x="84" y="27.5" textAnchor="middle" fill="#FFFDF9" fontFamily="monospace" fontSize="8" fontWeight="800">
          DELHI PUBLIC CHAOS
        </text>

        {/* Anonymous Catfish Mask (Crossed Out) */}
        <g transform="translate(45, 62)">
          <circle cx="20" cy="20" r="18" fill="#FFF" stroke="#94A3B8" strokeWidth="1.5" />
          {/* Mystery Mask */}
          <path d="M 10 18 Q 20 25 30 18 Q 28 30 20 30 Q 12 30 10 18 Z" fill="#64748B" />
          <circle cx="15" cy="20" r="2.5" fill="#FFF" />
          <circle cx="25" cy="20" r="2.5" fill="#FFF" />
          {/* Big Red Strike Line */}
          <line x1="4" y1="4" x2="36" y2="36" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
          <text x="20" y="52" textAnchor="middle" fill="#DC2626" fontFamily="sans-serif" fontSize="7.5" fontWeight="700">Fake / Catfish</text>
        </g>

        {/* Crowded Bar / Unwanted Advances Symbol */}
        <g transform="translate(125, 58)">
          <path d="M 12 10 L 28 10 L 22 28 L 22 38 M 16 38 H 28" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M 8 20 C 0 16 -2 30 8 32" stroke="#DC2626" strokeWidth="1.5" fill="none" />
          <path d="M 32 20 C 40 16 42 30 32 32" stroke="#DC2626" strokeWidth="1.5" fill="none" />
          {/* Loud Speaker horn blast */}
          <path d="M 38 12 L 44 8 V 22 L 38 18 Z" fill="#991B1B" />
          <path d="M 46 10 Q 50 15 46 20" stroke="#DC2626" strokeWidth="1.5" fill="none" />
          <text x="22" y="52" textAnchor="middle" fill="#991B1B" fontFamily="sans-serif" fontSize="7.5" fontWeight="700">Loud / On Guard</text>
        </g>

        {/* Delhi Traffic & Anxious Journey Doodle */}
        <g transform="translate(205, 62)">
          {/* Cab / Car sketch */}
          <rect x="0" y="14" width="36" height="16" rx="4" fill="#FDE047" stroke="#713F12" strokeWidth="1.2" />
          <path d="M 6 14 L 10 6 H 26 L 30 14 Z" fill="#FEF08A" stroke="#713F12" strokeWidth="1.2" />
          <circle cx="8" cy="30" r="4" fill="#1F2937" />
          <circle cx="28" cy="30" r="4" fill="#1F2937" />
          {/* Cab anxious thinking bubble */}
          <text x="18" y="52" textAnchor="middle" fill="#B45309" fontFamily="sans-serif" fontSize="7.5" fontWeight="700">Late Cab Stress</text>
        </g>

        {/* Bottom Reality Checklist Note */}
        <path d="M 25 140 H 255" stroke="#FCA5A5" strokeWidth="1" strokeDasharray="3 3" />
        <text x="140" y="162" textAnchor="middle" fill="#991B1B" fontFamily="serif" fontStyle="italic" fontSize="10">
          "Constantly calculating exits, travel routes & safety"
        </text>
      </g>

      {/* ------------------------------------------------------------- */}
      {/* CENTER ZONE: The Cryptographic Gate (Aadhaar Offline Filter)  */}
      {/* ------------------------------------------------------------- */}
      <g transform="translate(305, 30)">
        {/* Verification Gateway Portal */}
        <rect x="0" y="10" width="70" height="145" rx="14" fill="#FFFDF9" stroke="#722F37" strokeWidth="2.5" />
        {/* Glow arch */}
        <path d="M 10 40 C 10 20 60 20 60 40 V 140 H 10 Z" fill="#FDF4DC" opacity="0.6" stroke="#C8963E" strokeWidth="1.2" strokeDasharray="3 3" />
        
        {/* Shield in Portal */}
        <circle cx="35" cy="55" r="18" fill="#722F37" />
        <path d="M 30 55 L 34 59 L 41 51" stroke="#FFFDF9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        
        <text x="35" y="90" textAnchor="middle" fill="#722F37" fontFamily="monospace" fontSize="8" fontWeight="800">
          AADHAAR ID
        </text>
        <text x="35" y="102" textAnchor="middle" fill="#2D5A43" fontFamily="monospace" fontSize="7.5" fontWeight="700">
          FACE MATCH
        </text>
        <text x="35" y="114" textAnchor="middle" fill="#C8963E" fontFamily="monospace" fontSize="7.5" fontWeight="700">
          AUDITED
        </text>

        {/* Forward Arrow passing through */}
        <g stroke="#722F37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <line x1="-15" y1="80" x2="-2" y2="80" />
          <path d="M -8 74 L -2 80 L -8 86" />
          <line x1="72" y1="80" x2="85" y2="80" />
          <path d="M 79 74 L 85 80 L 79 86" />
        </g>
      </g>

      {/* ------------------------------------------------------------- */}
      {/* RIGHT ZONE: The Precious Meets Sanctuary Table (Calm, Real)    */}
      {/* ------------------------------------------------------------- */}
      <g transform="translate(390, 10)">
        <rect x="0" y="0" width="280" height="195" rx="20" fill="url(#calmBg)" stroke="#16A34A" strokeWidth="1.5" />
        
        {/* Label */}
        <rect x="18" y="14" width="138" height="20" rx="10" fill="#2D5A43" />
        <text x="87" y="27.5" textAnchor="middle" fill="#FFFDF9" fontFamily="monospace" fontSize="8" fontWeight="800">
          PRECIOUS MEETS SANCTUARY
        </text>

        {/* Verified Attendee Badges (HER & HIM) */}
        <g transform="translate(42, 60)">
          <circle cx="16" cy="16" r="14" fill="#FCE7F3" stroke="#BE185D" strokeWidth="1.8" />
          <circle cx="16" cy="13" r="4.5" fill="#BE185D" />
          <path d="M 10 25 C 10 20 22 20 22 25" fill="#BE185D" />
          <text x="16" y="44" textAnchor="middle" fill="#BE185D" fontFamily="sans-serif" fontSize="7.5" fontWeight="800">Verified Her</text>
        </g>

        {/* Intimate Candle Table in center */}
        <g transform="translate(108, 52)">
          <ellipse cx="32" cy="28" rx="28" ry="16" fill="#FFFDF9" stroke="#722F37" strokeWidth="1.5" />
          {/* Candle Flame */}
          <circle cx="32" cy="24" r="3" fill="#F59E0B" />
          <path d="M 32 18 C 30 21 30 24 32 25 C 34 24 34 21 32 18 Z" fill="#DC2626" />
          {/* Wine Glass */}
          <path d="M 22 20 L 26 26 M 24 26 H 28" stroke="#722F37" strokeWidth="1" />
          <path d="M 42 20 L 38 26 M 40 26 H 36" stroke="#722F37" strokeWidth="1" />
          <text x="32" y="52" textAnchor="middle" fill="#722F37" fontFamily="sans-serif" fontSize="7.5" fontWeight="800">Curated Table</text>
        </g>

        {/* Guardian Host Badge on right */}
        <g transform="translate(204, 60)">
          <circle cx="16" cy="16" r="14" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.8" />
          {/* Host Star */}
          <polygon points="16,8 18,13 24,13 19,17 21,22 16,19 11,22 13,17 8,13 14,13" fill="#D97706" />
          <text x="16" y="44" textAnchor="middle" fill="#D97706" fontFamily="sans-serif" fontSize="7.5" fontWeight="800">Guardian Host</text>
        </g>

        {/* Bottom Reassurance Note */}
        <path d="M 25 140 H 255" stroke="#86EFAC" strokeWidth="1" strokeDasharray="3 3" />
        <text x="140" y="162" textAnchor="middle" fill="#166534" fontFamily="serif" fontStyle="italic" fontSize="10">
          "Unwind completely · Equal voices · Zero defensive guard"
        </text>
      </g>
    </svg>
  );
}
