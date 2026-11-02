import React from "react";
import { motion, useReducedMotion } from "framer-motion";

interface CandleFlameProps {
  size?: number;
  direction?: 1 | -1;
  triggerKey?: number | string;
  isLit?: boolean;
  className?: string;
}

export const CandleFlame: React.FC<CandleFlameProps> = ({
  size = 28,
  direction = 1,
  triggerKey = 0,
  isLit = true,
  className = "",
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (!isLit) return null;

  return (
    <div
      className={`relative inline-flex items-center justify-center pointer-events-none ${className}`}
      style={{ width: size, height: size * 1.6 }}
      aria-hidden="true"
    >
      {/* Ambient Radial Halo / Warm Glow */}
      <motion.div
        animate={
          shouldReduceMotion
            ? { opacity: 0.55 }
            : {
                opacity: [0.5, 0.72, 0.55, 0.68, 0.5],
                scale: [0.95, 1.08, 0.98, 1.05, 0.95],
              }
        }
        transition={{
          duration: 2.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-3 rounded-full blur-md"
        style={{
          width: size * 2.2,
          height: size * 2.2,
          background:
            "radial-gradient(circle, rgba(245, 158, 11, 0.45) 0%, rgba(198, 165, 104, 0.22) 50%, rgba(105, 28, 53, 0) 80%)",
        }}
      />

      {/* Reactive Flame Body with Draft-Wind Tilt */}
      <motion.svg
        key={triggerKey}
        width={size}
        height={size * 1.6}
        viewBox="0 0 24 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial={
          shouldReduceMotion
            ? false
            : {
                rotate: direction > 0 ? -16 : 16,
                skewX: direction > 0 ? -8 : 8,
                scaleY: 0.88,
              }
        }
        animate={{
          rotate: 0,
          skewX: 0,
          scaleY: 1,
        }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 18,
          mass: 0.6,
        }}
        className="origin-bottom"
      >
        <defs>
          <linearGradient id="flameOuter" x1="12" y1="2" x2="12" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="25%" stopColor="#f59e0b" />
            <stop offset="70%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#691c35" stopOpacity="0.8" />
          </linearGradient>

          <linearGradient id="flameInner" x1="12" y1="12" x2="12" y2="34" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>

        {/* Ambient Outer Wick Flame */}
        <motion.path
          d="M12 2C12 2 4.5 14 4.5 22.5C4.5 27.5 7.8 33 12 33C16.2 33 19.5 27.5 19.5 22.5C19.5 14 12 2 12 2Z"
          fill="url(#flameOuter)"
          animate={
            shouldReduceMotion
              ? {}
              : {
                  d: [
                    "M12 2C12 2 4.5 14 4.5 22.5C4.5 27.5 7.8 33 12 33C16.2 33 19.5 27.5 19.5 22.5C19.5 14 12 2 12 2Z",
                    "M12 1.5C12 1.5 4 14.5 4 22.5C4 28 8 33.5 12 33.5C16 33.5 20 28 20 22.5C20 14.5 12 1.5 12 1.5Z",
                    "M12 2.5C12 2.5 5 13.5 5 22.5C5 27 7.5 32.5 12 32.5C16.5 32.5 19 27 19 22.5C19 13.5 12 2.5 12 2.5Z",
                    "M12 2C12 2 4.5 14 4.5 22.5C4.5 27.5 7.8 33 12 33C16.2 33 19.5 27.5 19.5 22.5C19.5 14 12 2 12 2Z",
                  ],
                  scaleY: [1, 1.05, 0.96, 1.03, 1],
                }
          }
          transition={{
            duration: 1.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Inner Brilliant Core */}
        <motion.path
          d="M12 12C12 12 7.5 19 7.5 24.5C7.5 27.5 9.5 31 12 31C14.5 31 16.5 27.5 16.5 24.5C16.5 19 12 12 12 12Z"
          fill="url(#flameInner)"
          animate={
            shouldReduceMotion
              ? {}
              : {
                  scaleY: [1, 1.08, 0.94, 1.04, 1],
                  scaleX: [1, 0.94, 1.05, 0.97, 1],
                }
          }
          transition={{
            duration: 0.9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Blue Base of flame */}
        <ellipse cx="12" cy="30.5" rx="3.5" ry="2" fill="#38bdf8" fillOpacity="0.45" />

        {/* Wick line */}
        <line x1="12" y1="31" x2="12" y2="37" stroke="#171514" strokeWidth="1.2" strokeLinecap="round" />
      </motion.svg>
    </div>
  );
};
