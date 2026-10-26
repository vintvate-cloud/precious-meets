import React from "react";

interface PromenadeHumanFigureProps {
  gender?: "man" | "woman";
  className?: string;
  glowColor?: string;
}

/**
 * PROMENADE HUMAN FIGURE
 * Exact match to user-provided SVG specification:
 * - Solid circular head
 * - Semicircular dome bust/torso
 * - Identical viewBox (0 0 640 640) and size as seated table attendees
 */
export function PromenadeHumanFigure({
  className = "w-full h-full",
  glowColor,
}: PromenadeHumanFigureProps) {
  return (
    <div className={`relative select-none pointer-events-none flex flex-col items-center justify-end ${className}`}>
      {/* Soft ground reflection shadow */}
      <div className="absolute -bottom-1 w-[80%] h-1.5 rounded-full bg-black/30 blur-[1px] pointer-events-none" />

      <svg
        viewBox="0 0 640 640"
        className="w-full h-full overflow-visible drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          style={
            glowColor
              ? { filter: `drop-shadow(0 0 6px ${glowColor}33)` }
              : undefined
          }
        >
          {/* Head: Solid Circle */}
          <circle cx="320" cy="204" r="117.5" fill="#000000" />

          {/* Shoulders / Bust: Semicircular Arc Dome */}
          <path d="M 106 550 A 214 214 0 0 1 534 550 Z" fill="#000000" />
        </g>
      </svg>
    </div>
  );
}
