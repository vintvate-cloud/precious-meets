import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CandleFlame } from "./CandleFlame";

interface QuizTableRightFlankProps {
  currentIndex: number;
  totalSteps: number;
  direction: 1 | -1;
  className?: string;
}

export const QuizTableRightFlank: React.FC<QuizTableRightFlankProps> = ({
  currentIndex,
  totalSteps,
  direction,
  className = "",
}) => {
  const shouldReduceMotion = useReducedMotion();
  const isFinalPhase = currentIndex >= totalSteps - 2;

  return (
    <motion.div
      initial={false}
      animate={{
        x: shouldReduceMotion ? 0 : [direction > 0 ? -6 : 6, 0],
      }}
      transition={{ type: "spring", stiffness: 220, damping: 24 }}
      className={`relative select-none pointer-events-none flex flex-col items-center justify-end ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 340 620"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-[300px] lg:max-w-[340px] h-auto overflow-visible text-ink drop-shadow-xs"
      >
        <defs>
          {/* Specular Cutlery Silverware Shimmer */}
          <linearGradient id="silverShimmer" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#fff" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0.1" />
          </linearGradient>

          {/* Table edge diagonal gradient */}
          <linearGradient id="tableEdgeGradRight" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
            <stop offset="85%" stopColor="currentColor" stopOpacity="0.08" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>

          {/* Warm Candlelight Bloom */}
          <radialGradient id="votiveGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.6" />
            <stop offset="60%" stopColor="#c6a568" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#691c35" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ------------------------------------------------------------- */}
        {/* 1. TALL TAPER CANDLESTICK (Right Background)                 */}
        {/* ------------------------------------------------------------- */}
        <g id="tall-candle-right" transform="translate(160, 40)">
          {/* Reactive CandleFlame */}
          <foreignObject x="-20" y="-36" width="40" height="64">
            <CandleFlame
              size={22}
              direction={direction}
              triggerKey={`right-${currentIndex}`}
              isLit={true}
            />
          </foreignObject>

          {/* Candle Shaft */}
          <path
            d="M-4 16 L-4 195 C-4 197 4 197 4 195 L4 16 Z"
            fill="#fffaf1"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />

          {/* Holder Bobeche & Stem */}
          <ellipse cx="0" cy="196" rx="12" ry="3.5" stroke="currentColor" strokeWidth="1.4" fill="#f8f2e7" />
          <path d="M-3 200 L-3 230 C-3 236 3 236 3 230 L3 200" stroke="currentColor" strokeWidth="1.4" fill="none" />
          <ellipse cx="0" cy="234" rx="18" ry="5" stroke="currentColor" strokeWidth="1.4" fill="#f8f2e7" />
          <path d="M-14 235 C-14 243 14 243 14 235" stroke="currentColor" strokeWidth="1.3" />
        </g>

        {/* ------------------------------------------------------------- */}
        {/* 2. BACKGROUND FLOWER BUD & VASE (Right)                      */}
        {/* ------------------------------------------------------------- */}
        <g id="flower-bud-right" transform="translate(200, 110)">
          <path d="M5 125 C8 90 2 60 12 30" stroke="#5f7045" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M12 30 Q24 20 22 35 Q10 40 12 30 Z" fill="#e8ecd8" stroke="#5f7045" strokeWidth="1.2" />
          <path d="M5 65 Q-8 55 -4 70 Q2 75 5 65 Z" fill="#e8ecd8" stroke="#5f7045" strokeWidth="1.2" />

          {/* Small slender bottle */}
          <path
            d="M0 125 C-3 125 -6 130 -6 142 L-6 160 C-6 164 16 164 16 160 L16 142 C16 130 13 125 10 125 Z"
            stroke="currentColor"
            strokeWidth="1.3"
            fill="#fffaf1"
            fillOpacity="0.35"
          />
        </g>

        {/* ------------------------------------------------------------- */}
        {/* 3. WINE CHALICE & GOBLET (Right Midground)                    */}
        {/* ------------------------------------------------------------- */}
        <g id="glass-midground-right" transform="translate(225, 230)">
          <path
            d="M6 15 C6 55 14 80 34 84 C54 80 62 55 62 15 C62 10 6 10 6 15 Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            fill="#fffaf1"
            fillOpacity="0.2"
          />
          <ellipse cx="34" cy="14" rx="28" ry="5.5" stroke="currentColor" strokeWidth="1.3" fill="none" />
          <line x1="33" y1="84" x2="33" y2="140" stroke="currentColor" strokeWidth="1.2" />
          <line x1="35" y1="84" x2="35" y2="140" stroke="currentColor" strokeWidth="1.2" />
          <ellipse cx="34" cy="142" rx="22" ry="5" stroke="currentColor" strokeWidth="1.4" fill="#fffaf1" fillOpacity="0.4" />
        </g>

        {/* ------------------------------------------------------------- */}
        {/* 4. TEA LIGHT CANDLE VOTIVE (Right Mid-Front)                 */}
        {/* ------------------------------------------------------------- */}
        <g id="tea-light-votive" transform="translate(110, 275)">
          {/* Warm Votive Glow Circle */}
          <circle cx="16" cy="12" r="22" fill="url(#votiveGlow)" />

          {/* Tiny Votive Flame */}
          <motion.path
            d="M16 2 C16 2 11 10 11 15 C11 18 13.5 21 16 21 C18.5 21 21 18 21 15 C21 10 16 2 16 2 Z"
            fill="#f59e0b"
            animate={
              shouldReduceMotion
                ? {}
                : {
                    scaleY: [1, 1.15, 0.95, 1.08, 1],
                    scaleX: [1, 0.92, 1.06, 0.96, 1],
                  }
            }
            transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
            className="origin-bottom"
          />
          <circle cx="16" cy="16" r="2.5" fill="#fef08a" />

          {/* Votive Glass Cup */}
          <path
            d="M6 18 L8 38 C9 43 23 43 24 38 L26 18"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            fill="#fffaf1"
            fillOpacity="0.3"
          />
          <ellipse cx="16" cy="18" rx="10" ry="3.5" stroke="currentColor" strokeWidth="1.1" fill="none" />
          {/* Vertical glass facets */}
          <line x1="12" y1="22" x2="12" y2="35" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.45" />
          <line x1="20" y1="22" x2="20" y2="35" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.45" />
        </g>

        {/* ------------------------------------------------------------- */}
        {/* 5. GUEST PLACE SETTING: PLATES, NAPKIN & BOTANICAL SPRIG      */}
        {/* ------------------------------------------------------------- */}
        <g id="place-setting-right" transform="translate(40, 360)">
          {/* Charger Plate (Large outer rim) */}
          <ellipse
            cx="130"
            cy="110"
            rx="110"
            ry="48"
            stroke="currentColor"
            strokeWidth="1.6"
            fill="#fffaf1"
            fillOpacity="0.55"
          />
          {/* Inner Plate Rim */}
          <ellipse
            cx="130"
            cy="110"
            rx="92"
            ry="38"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeDasharray="4 3"
            strokeOpacity="0.5"
            fill="none"
          />

          {/* Folded Linen Napkin (Angled perspective rectangle) */}
          <path
            d="M65 80 L185 45 C190 44 195 48 193 54 L170 145 C168 150 162 153 158 151 L48 110 C44 108 42 102 44 98 L65 80 Z"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="#f8f2e7"
          />
          {/* Napkin hemstitching / fold line */}
          <path
            d="M60 84 L176 50 M56 94 L168 62"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeOpacity="0.35"
          />

          {/* Fresh Rosemary / Olive Sprig on Napkin (Sways gently) */}
          <motion.g
            id="botanical-sprig"
            animate={{
              rotate: shouldReduceMotion ? 0 : [direction * 1.5, 0],
            }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            transform="translate(100, 75) rotate(-18)"
          >
            {/* Main stem */}
            <path d="M0 0 C15 15 35 30 50 55" stroke="#5f7045" strokeWidth="1.6" strokeLinecap="round" />
            {/* Leaves pairs */}
            <path d="M12 12 Q20 8 22 16 Q14 18 12 12 Z" fill="#5f7045" stroke="#5f7045" strokeWidth="0.8" />
            <path d="M14 14 Q6 20 8 26 Q16 22 14 14 Z" fill="#5f7045" stroke="#5f7045" strokeWidth="0.8" />
            <path d="M26 24 Q36 20 38 30 Q28 32 26 24 Z" fill="#5f7045" stroke="#5f7045" strokeWidth="0.8" />
            <path d="M28 27 Q20 35 22 42 Q30 38 28 27 Z" fill="#5f7045" stroke="#5f7045" strokeWidth="0.8" />
            <path d="M40 40 Q48 36 52 46 Q42 48 40 40 Z" fill="#5f7045" stroke="#5f7045" strokeWidth="0.8" />
          </motion.g>

          {/* Specular light sweep on Plate / Ready Indicator */}
          {isFinalPhase && (
            <motion.ellipse
              cx="130"
              cy="110"
              rx="96"
              ry="40"
              stroke="#c6a568"
              strokeWidth="1.5"
              fill="none"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: [0.3, 0.7, 0.3], scale: 1 }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </g>

        {/* ------------------------------------------------------------- */}
        {/* 6. FINE DINING CUTLERY (Forks, Knives, Spoons)                */}
        {/* ------------------------------------------------------------- */}
        {/* Left Cutlery: Dinner Fork & Salad Fork */}
        <g id="cutlery-forks" transform="translate(12, 450)">
          {/* Dinner Fork */}
          <path
            d="M32 0 L32 75 C32 82 28 88 28 105 L30 110 C31 110 35 105 35 88 L35 0"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            fill="#fffaf1"
          />
          {/* 4 Tines */}
          <path d="M26 -30 L26 -2 M30 -32 L30 -2 M34 -32 L34 -2 M38 -30 L38 -2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M26 -2 C26 10 38 10 38 -2" stroke="currentColor" strokeWidth="1.3" fill="none" />

          {/* Salad Fork (Angled alongside) */}
          <g transform="translate(-18, 15) rotate(-6)">
            <path d="M28 -22 L28 -2 M31 -24 L31 -2 M34 -24 L34 -2 M37 -22 L37 -2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
            <path d="M28 -2 C28 8 37 8 37 -2" stroke="currentColor" strokeWidth="1.2" fill="none" />
            <path d="M32.5 8 L32.5 85" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </g>
        </g>

        {/* Right Cutlery: Dinner Knife with Curved Blade */}
        <g id="cutlery-knife" transform="translate(245, 430)">
          {/* Blade */}
          <path
            d="M8 -30 C15 -10 16 20 12 50 L8 50 C4 20 5 -10 8 -30 Z"
            stroke="currentColor"
            strokeWidth="1.3"
            fill="#fffaf1"
            fillOpacity="0.75"
          />
          {/* Blade cutting bevel */}
          <path d="M12 -20 C15 0 14 30 11 48" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.5" />
          {/* Knife Handle */}
          <path
            d="M8 50 L6 110 C6 116 14 116 14 110 L12 50 Z"
            stroke="currentColor"
            strokeWidth="1.4"
            fill="#f8f2e7"
          />
        </g>

        {/* ------------------------------------------------------------- */}
        {/* 7. TABLE RUNNER PERSPECTIVE LINE                             */}
        {/* ------------------------------------------------------------- */}
        <path
          d="M0 480 L340 550"
          stroke="url(#tableEdgeGradRight)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M20 496 L340 558"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.15"
          strokeDasharray="4 6"
        />
      </svg>
    </motion.div>
  );
};
