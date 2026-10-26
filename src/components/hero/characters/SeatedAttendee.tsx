import React from "react";
import { motion } from "framer-motion";
import { useAttendeeLifeEngine } from "./useAttendeeLifeEngine";

export interface SeatedAttendeeProps {
  seatIndex: number;
  gender: "man" | "woman";
  isFrontRow?: boolean;
  className?: string;
  glowColor?: string;
  badgeHalo?: string;
}

/**
 * SEATED ATTENDEE COMPONENT
 *
 * Renders the clean user avatar silhouette matching the user-provided SVG specification.
 * Head and torso are linked to the life engine for subtle breathing & nodding animations.
 */
export function SeatedAttendee({
  seatIndex,
  gender,
  isFrontRow = false,
  className = "w-10 h-10",
  glowColor = "#fbbf24",
  badgeHalo,
}: SeatedAttendeeProps) {
  const { containerRef, headRef, torsoRef } = useAttendeeLifeEngine({
    seatIndex,
    gender,
    isFrontRow,
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.8,
        delay: 0.2 + seatIndex * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{
        scale: 1.08,
        y: -3,
        transition: { type: "spring", stiffness: 260, damping: 20 },
      }}
      className={`relative inline-block cursor-pointer ${className}`}
      title={`${gender === "woman" ? "Female" : "Male"} Dinner Guest · Seat ${seatIndex + 1}`}
    >
      {/* Subtle constellation glow node matching the social network lines */}
      {badgeHalo && (
        <div
          className="absolute inset-0 -m-1 rounded-full pointer-events-none blur-sm opacity-30"
          style={{ backgroundColor: badgeHalo }}
        />
      )}

      {/* GSAP Managed Life Rig Container */}
      <div ref={containerRef} className="relative w-full h-full">
        <svg
          viewBox="0 0 640 640"
          className="w-full h-full overflow-visible drop-shadow-md select-none pointer-events-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle colored glow ring rim */}
          {glowColor && (
            <g opacity="0.4" style={{ filter: `drop-shadow(0 0 5px ${glowColor})` }}>
              <circle cx="320" cy="204" r="118" stroke={glowColor} strokeWidth="6" />
              <path
                d="M 106 550 A 214 214 0 0 1 534 550 Z"
                stroke={glowColor}
                strokeWidth="6"
              />
            </g>
          )}

          {/* Head: Solid Circle linked to subtle head nod/tilt */}
          <g ref={headRef}>
            <circle cx="320" cy="204" r="117.5" fill="#000000" />
          </g>

          {/* Shoulders / Bust: Semicircular Dome linked to breathing */}
          <g ref={torsoRef}>
            <path d="M 106 550 A 214 214 0 0 1 534 550 Z" fill="#000000" />
          </g>
        </svg>
      </div>
    </motion.div>
  );
}
