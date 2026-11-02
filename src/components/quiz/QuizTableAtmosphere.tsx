import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { QuizTableLeftFlank } from "./QuizTableLeftFlank";
import { QuizTableRightFlank } from "./QuizTableRightFlank";

interface QuizTableAtmosphereProps {
  currentIndex: number;
  totalSteps: number;
  direction: 1 | -1;
  children: React.ReactNode;
}

export const QuizTableAtmosphere: React.FC<QuizTableAtmosphereProps> = ({
  currentIndex,
  totalSteps,
  direction,
  children,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const progressRatio = (currentIndex + 1) / totalSteps;

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden bg-ivory text-foreground selection:bg-burgundy/20">
      {/* ------------------------------------------------------------- */}
      {/* AMBIENT BACKGROUND GLOW (Simulates Warm Candlelit Room)       */}
      {/* ------------------------------------------------------------- */}
      <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        aria-hidden="true"
      >
        {/* Central Candlelight Hearth Glow */}
        <motion.div
          animate={{
            opacity: [0.65, 0.85, 0.7, 0.8, 0.65],
            scale: [1, 1.04, 0.98, 1.02, 1],
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{
            width: "min(90vw, 850px)",
            height: "min(70vh, 600px)",
            background:
              "radial-gradient(circle at center, rgba(198, 165, 104, 0.16) 0%, rgba(245, 158, 11, 0.08) 40%, rgba(105, 28, 53, 0.04) 70%, transparent 85%)",
          }}
        />

        {/* Ambient Warm Golden Floating Embers (4 Subtle Micro-Specks) */}
        {!shouldReduceMotion && (
          <>
            <motion.div
              animate={{
                y: [-20, -120, -20],
                x: [0, 15, -10, 0],
                opacity: [0, 0.65, 0],
              }}
              transition={{ duration: 7.2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-[18%] bottom-[25%] size-1.5 rounded-full bg-ochre/40 blur-[0.5px]"
            />
            <motion.div
              animate={{
                y: [-10, -90, -10],
                x: [0, -12, 8, 0],
                opacity: [0, 0.55, 0],
              }}
              transition={{ duration: 6.4, repeat: Infinity, ease: "easeInOut", delay: 2.1 }}
              className="absolute right-[22%] bottom-[30%] size-1.5 rounded-full bg-ochre/40 blur-[0.5px]"
            />
            <motion.div
              animate={{
                y: [-30, -110, -30],
                x: [0, 10, -8, 0],
                opacity: [0, 0.45, 0],
              }}
              transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut", delay: 4.0 }}
              className="absolute left-[26%] bottom-[40%] size-1 rounded-full bg-amber-400/40 blur-[0.5px]"
            />
          </>
        )}

        {/* Table Runner Floor Glow (Deep warm perspective line at bottom) */}
        <div
          className="absolute -bottom-10 left-0 right-0 h-40 opacity-40 blur-2xl"
          style={{
            background:
              "linear-gradient(to top, rgba(105, 28, 53, 0.08), rgba(198, 165, 104, 0.05), transparent)",
          }}
        />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* LEFT FLANK: CANDELABRA, WINE GLASS, BUD VASE                  */}
      {/* ------------------------------------------------------------- */}
      <div className="pointer-events-none fixed inset-y-0 left-0 z-10 hidden xl:flex items-center justify-start pl-2 2xl:pl-8">
        <QuizTableLeftFlank
          currentIndex={currentIndex}
          totalSteps={totalSteps}
          direction={direction}
          className="w-[240px] 2xl:w-[320px] transition-opacity duration-500 opacity-90 hover:opacity-100"
        />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* RIGHT FLANK: PLACE SETTING, CUTLERY, CANDLE, NAPKIN           */}
      {/* ------------------------------------------------------------- */}
      <div className="pointer-events-none fixed inset-y-0 right-0 z-10 hidden xl:flex items-center justify-end pr-2 2xl:pr-8">
        <QuizTableRightFlank
          currentIndex={currentIndex}
          totalSteps={totalSteps}
          direction={direction}
          className="w-[260px] 2xl:w-[340px] transition-opacity duration-500 opacity-90 hover:opacity-100"
        />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TABLET WATERMARK ACCENTS (For 768px - 1279px screens)         */}
      {/* ------------------------------------------------------------- */}
      <div className="pointer-events-none fixed inset-y-0 left-0 z-10 hidden md:flex xl:hidden items-center opacity-25">
        <div className="scale-75 -translate-x-12 origin-left">
          <QuizTableLeftFlank
            currentIndex={currentIndex}
            totalSteps={totalSteps}
            direction={direction}
          />
        </div>
      </div>
      <div className="pointer-events-none fixed inset-y-0 right-0 z-10 hidden md:flex xl:hidden items-center opacity-25">
        <div className="scale-75 translate-x-12 origin-right">
          <QuizTableRightFlank
            currentIndex={currentIndex}
            totalSteps={totalSteps}
            direction={direction}
          />
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MAIN CONTENT / QUIZ PASS-THROUGH (Centered & High-Z)          */}
      {/* ------------------------------------------------------------- */}
      <div className="relative z-20 flex min-h-screen w-full flex-col justify-between">
        {children}
      </div>
    </div>
  );
};
