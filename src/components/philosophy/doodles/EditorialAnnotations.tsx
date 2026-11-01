import React from "react";

interface AnnotationProps {
  className?: string;
  text?: string;
}

/**
 * Hand-drawn stamped seal "100% OFFLINE AADHAAR VERIFIED"
 */
export function VerifiedStampDoodle({ className = "w-28 h-auto" }: AnnotationProps) {
  return (
    <svg viewBox="0 0 140 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <g transform="rotate(-6 70 30)">
        <rect
          x="4"
          y="4"
          width="132"
          height="52"
          rx="12"
          fill="#FEF2F2"
          stroke="#722F37"
          strokeWidth="2.5"
          strokeDasharray="4 2"
        />
        <rect x="8" y="8" width="124" height="44" rx="8" stroke="#C8963E" strokeWidth="1" />
        <text
          x="70"
          y="27"
          textAnchor="middle"
          fill="#722F37"
          fontFamily="monospace"
          fontWeight="900"
          fontSize="11"
          letterSpacing="1"
        >
          100% VERIFIED
        </text>
        <text
          x="70"
          y="42"
          textAnchor="middle"
          fill="#2D5A43"
          fontFamily="monospace"
          fontWeight="700"
          fontSize="8.5"
          letterSpacing="0.5"
        >
          ZERO ANONYMITY
        </text>
      </g>
    </svg>
  );
}

/**
 * Hand-drawn wax seal for The Table Constitution
 */
export function WaxSealDoodle({ className = "w-20 h-auto" }: AnnotationProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Organic wax ripples */}
      <path
        d="M 50 10 C 68 8 82 22 88 38 C 94 54 86 74 74 86 C 60 96 38 94 24 84 C 10 74 6 52 14 36 C 22 20 34 12 50 10 Z"
        fill="#722F37"
        stroke="#4A1521"
        strokeWidth="2"
      />
      <circle cx="50" cy="50" r="32" stroke="#C8963E" strokeWidth="1.5" strokeDasharray="3 3" />
      <circle cx="50" cy="50" r="26" fill="#581C26" stroke="#C8963E" strokeWidth="1" />
      {/* Monogram PM */}
      <text
        x="50"
        y="57"
        textAnchor="middle"
        fill="#FDFBF7"
        fontFamily="serif"
        fontStyle="italic"
        fontWeight="700"
        fontSize="18"
      >
        PM
      </text>
      {/* Outer seal highlights */}
      <circle cx="50" cy="22" r="1.5" fill="#C8963E" opacity="0.8" />
      <circle cx="78" cy="50" r="1.5" fill="#C8963E" opacity="0.8" />
      <circle cx="50" cy="78" r="1.5" fill="#C8963E" opacity="0.8" />
      <circle cx="22" cy="50" r="1.5" fill="#C8963E" opacity="0.8" />
    </svg>
  );
}

/**
 * Curved Hand-sketched editorial arrow
 */
export function SketchArrowDoodle({ className = "w-16 h-auto" }: AnnotationProps) {
  return (
    <svg viewBox="0 0 80 50" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M 10 38 C 25 10 55 12 68 28"
        stroke="#722F37"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="4 3"
        fill="none"
      />
      <path
        d="M 58 28 L 68 28 L 66 18"
        stroke="#722F37"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
