import React from "react";
import { motion } from "framer-motion";
import { useAttendeeLifeEngine } from "./useAttendeeLifeEngine";
import { FemaleAttendeeFigure } from "./FemaleAttendeeFigure";
import { MaleAttendeeFigure } from "./MaleAttendeeFigure";
import { AttendeeRearFigure } from "./AttendeeRearFigure";

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
 * Combines Framer Motion interactive responsiveness with GSAP-driven
 * real-life biomechanics (asynchronous breathing, listening tilts, nods).
 */
export function SeatedAttendee({
  seatIndex,
  gender,
  isFrontRow = false,
  className = "w-14 h-16 sm:w-16 sm:h-18 md:w-18 md:h-20",
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
      initial={{ opacity: 0, scale: 0.9, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.8,
        delay: 0.2 + (seatIndex * 0.1),
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{
        scale: 1.04,
        y: -2,
        transition: { type: "spring", stiffness: 260, damping: 20 },
      }}
      className={`relative inline-block cursor-pointer ${className}`}
      title={`${gender === "woman" ? "Female" : "Male"} Dinner Guest · Seat ${seatIndex + 1}`}
    >
      {/* Subtle constellation glow node matching the social network lines */}
      {badgeHalo && (
        <div
          className="absolute inset-0 -m-1 rounded-full pointer-events-none blur-sm opacity-25"
          style={{ backgroundColor: badgeHalo }}
        />
      )}

      {/* GSAP Managed Life Rig Container */}
      <div ref={containerRef} className="relative w-full h-full">
        {isFrontRow ? (
          <AttendeeRearFigure
            gender={gender}
            headRef={headRef}
            torsoRef={torsoRef}
            className="w-full h-full"
            glowColor={glowColor}
          />
        ) : gender === "woman" ? (
          <FemaleAttendeeFigure
            headRef={headRef}
            torsoRef={torsoRef}
            className="w-full h-full"
            glowColor={glowColor}
          />
        ) : (
          <MaleAttendeeFigure
            headRef={headRef}
            torsoRef={torsoRef}
            className="w-full h-full"
            glowColor={glowColor}
          />
        )}
      </div>
    </motion.div>
  );
}
