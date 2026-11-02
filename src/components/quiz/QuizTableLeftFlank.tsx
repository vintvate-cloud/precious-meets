import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CandleFlame } from "./CandleFlame";

interface QuizTableLeftFlankProps {
  currentIndex: number;
  totalSteps: number;
  direction: 1 | -1;
  className?: string;
}

export const QuizTableLeftFlank: React.FC<QuizTableLeftFlankProps> = ({
  currentIndex,
  totalSteps,
  direction,
  className = "",
}) => {
  const shouldReduceMotion = useReducedMotion();
  const progressRatio = Math.min(1, Math.max(0.15, (currentIndex + 1) / totalSteps));

  return (
    <motion.div
      initial={false}
      animate={{
        x: shouldReduceMotion ? 0 : [direction > 0 ? 6 : -6, 0],
      }}
      transition={{ type: "spring", stiffness: 220, damping: 24 }}
      className={`relative select-none pointer-events-none flex flex-col items-center justify-end ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 320 620"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-[280px] lg:max-w-[320px] h-auto overflow-visible text-ink drop-shadow-xs"
      >
        <defs>
          {/* Glassware Specular Sweep Filter on Question Jump */}
          <linearGradient id="leftGlassSweep" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.05" />
            <stop offset="50%" stopColor="#c6a568" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0.05" />
          </linearGradient>

          {/* Wine liquid gradient with brand burgundy */}
          <linearGradient id="wineFillGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8d2646" stopOpacity="0.82" />
            <stop offset="100%" stopColor="#4f1224" stopOpacity="0.95" />
          </linearGradient>

          {/* Soft table surface vignette */}
          <linearGradient id="tableEdgeGradLeft" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
            <stop offset="85%" stopColor="currentColor" stopOpacity="0.08" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* ------------------------------------------------------------- */}
        {/* 1. TALL TAPER CANDLESTICK & FLAME (Left Center-Back)          */}
        {/* ------------------------------------------------------------- */}
        <g id="tall-candle-left" className="origin-bottom">
          {/* ForeignObject to place our reactive physics CandleFlame */}
          <foreignObject x="84" y="24" width="40" height="64">
            <CandleFlame
              size={24}
              direction={direction}
              triggerKey={currentIndex}
              isLit={true}
            />
          </foreignObject>

          {/* Candle Body: Long slender ivory taper */}
          <path
            d="M99 74 L99 285 C99 287 107 287 107 285 L107 74 C107 72 99 72 99 74 Z"
            fill="#fffaf1"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          {/* Candle drip lines */}
          <path
            d="M99 92 Q96 104 99 116"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeOpacity="0.6"
          />
          <path
            d="M107 84 Q109 95 107 105"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeOpacity="0.5"
          />

          {/* Candle Holder Bobeche & Brass Stem */}
          <ellipse cx="103" cy="286" rx="14" ry="4" stroke="currentColor" strokeWidth="1.5" fill="#f8f2e7" />
          <path
            d="M98 290 L98 320 C98 328 108 328 108 320 L108 290"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
          {/* Base of candlestick */}
          <ellipse cx="103" cy="324" rx="22" ry="6" stroke="currentColor" strokeWidth="1.5" fill="#f8f2e7" />
          <path
            d="M84 325 C84 336 122 336 122 325"
            stroke="currentColor"
            strokeWidth="1.4"
          />
        </g>

        {/* ------------------------------------------------------------- */}
        {/* 2. WILDFLOWER BUD VASE WITH DELICATE BOTANICAL STEMS          */}
        {/* ------------------------------------------------------------- */}
        <motion.g
          id="bud-vase-left"
          animate={{
            rotate: shouldReduceMotion ? 0 : [direction * -1.2, 0],
          }}
          transition={{ type: "spring", stiffness: 180, damping: 20 }}
          className="origin-bottom"
        >
          {/* Stems */}
          <path
            d="M136 290 C140 240 160 210 178 190"
            stroke="#5f7045"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M134 290 C125 250 115 220 120 185"
            stroke="#5f7045"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M148 230 C162 234 174 230 184 220"
            stroke="#5f7045"
            strokeWidth="1.2"
            strokeLinecap="round"
          />

          {/* Petite Leaves */}
          <path
            d="M160 210 Q170 205 174 214 Q164 218 160 210 Z"
            fill="#e8ecd8"
            stroke="#5f7045"
            strokeWidth="1.2"
          />
          <path
            d="M128 238 Q118 232 116 242 Q124 245 128 238 Z"
            fill="#e8ecd8"
            stroke="#5f7045"
            strokeWidth="1.2"
          />

          {/* Delicate Blossom Petals (Botanical Sketch) */}
          <g transform="translate(178, 188) scale(0.9)">
            <ellipse cx="0" cy="-6" rx="4" ry="6" stroke="currentColor" strokeWidth="1.2" fill="#fffaf1" />
            <ellipse cx="6" cy="0" rx="6" ry="4" stroke="currentColor" strokeWidth="1.2" fill="#fffaf1" />
            <ellipse cx="0" cy="6" rx="4" ry="6" stroke="currentColor" strokeWidth="1.2" fill="#fffaf1" />
            <ellipse cx="-6" cy="0" rx="6" ry="4" stroke="currentColor" strokeWidth="1.2" fill="#fffaf1" />
            <circle cx="0" cy="0" r="2.5" fill="#c6a568" />
          </g>

          {/* Glass Bud Vase Bottle */}
          <path
            d="M128 280 C128 274 133 272 133 268 L133 260 L141 260 L141 268 C141 272 146 274 146 280 C148 296 148 316 145 324 C142 328 132 328 129 324 C126 316 126 296 128 280 Z"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="#fffaf1"
            fillOpacity="0.4"
          />
          {/* Water level inside bud vase */}
          <ellipse cx="137" cy="298" rx="8" ry="2" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" />
        </motion.g>

        {/* ------------------------------------------------------------- */}
        {/* 3. CRYSTAL WINE GLASS (Fills as quiz progresses)             */}
        {/* ------------------------------------------------------------- */}
        <g id="wine-glass-primary" transform="translate(110, 310)">
          {/* Glass Bowl Outline */}
          <path
            d="M10 20 C10 80 20 115 50 120 C80 115 90 80 90 20 C90 12 10 12 10 20 Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="#fffaf1"
            fillOpacity="0.25"
          />
          <ellipse cx="50" cy="18" rx="40" ry="7" stroke="currentColor" strokeWidth="1.4" fill="none" />

          {/* Dynamic Wine Liquid Fill based on quiz progress */}
          <g clipPath="url(#wineClipLeft)">
            <clipPath id="wineClipLeft">
              <path d="M12 25 C12 78 22 112 50 118 C78 112 88 78 88 25 Z" />
            </clipPath>
            {/* The liquid rect slides up as progress increases */}
            <motion.rect
              x="10"
              width="80"
              fill="url(#wineFillGrad)"
              initial={false}
              animate={{
                y: 120 - 75 * progressRatio,
                height: 75 * progressRatio + 10,
              }}
              transition={{
                type: "spring",
                stiffness: 140,
                damping: 20,
              }}
            />
            {/* Liquid Surface Ellipse */}
            <motion.ellipse
              cx="50"
              rx="34"
              ry="5"
              fill="#c6a568"
              fillOpacity="0.45"
              initial={false}
              animate={{
                cy: 120 - 75 * progressRatio,
              }}
              transition={{
                type: "spring",
                stiffness: 140,
                damping: 20,
              }}
            />
          </g>

          {/* Specular Highlight / Glass Reflections (Classic hand-drawn lines) */}
          <path
            d="M20 30 C18 55 24 85 36 100"
            stroke="#fff"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeOpacity="0.8"
          />
          <path
            d="M26 34 C24 50 28 75 35 90"
            stroke="currentColor"
            strokeWidth="0.9"
            strokeLinecap="round"
            strokeOpacity="0.5"
          />
          <path
            d="M80 30 C82 55 76 85 64 100"
            stroke="#fff"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeOpacity="0.6"
          />

          {/* Glass Stem */}
          <path
            d="M48 120 L48 190 M52 120 L52 190"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />

          {/* Pedestal Foot Base */}
          <ellipse cx="50" cy="192" rx="34" ry="7" stroke="currentColor" strokeWidth="1.6" fill="#fffaf1" fillOpacity="0.4" />
          <ellipse cx="50" cy="192" rx="26" ry="5" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" fill="none" />
        </g>

        {/* ------------------------------------------------------------- */}
        {/* 4. WATER GOBLET / CHALICE (Far Left)                          */}
        {/* ------------------------------------------------------------- */}
        <g id="water-goblet-left" transform="translate(10, 340)">
          {/* Ornate chalice cup */}
          <path
            d="M8 20 C8 65 18 95 40 98 C62 95 72 65 72 20 C72 14 8 14 8 20 Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="#fffaf1"
            fillOpacity="0.2"
          />
          <ellipse cx="40" cy="18" rx="32" ry="6" stroke="currentColor" strokeWidth="1.4" fill="none" />

          {/* Faceted glass reflection lines */}
          <path d="M22 28 L30 84" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.45" />
          <path d="M40 26 L40 94" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.45" />
          <path d="M58 28 L50 84" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.45" />

          {/* Baluster Stem with Knop (Decorative Node) */}
          <path d="M38 98 L38 120 M42 98 L42 120" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="40" cy="122" r="5" stroke="currentColor" strokeWidth="1.3" fill="#fffaf1" />
          <path d="M38 126 L38 152 M42 126 L42 152" stroke="currentColor" strokeWidth="1.2" />

          {/* Base */}
          <ellipse cx="40" cy="154" rx="28" ry="6" stroke="currentColor" strokeWidth="1.5" fill="#fffaf1" fillOpacity="0.4" />
        </g>

        {/* ------------------------------------------------------------- */}
        {/* 5. SMALL TUMBLER / VOTIVE GLASS (Foreground Left)             */}
        {/* ------------------------------------------------------------- */}
        <g id="small-tumbler" transform="translate(5, 500)">
          <path
            d="M8 8 L13 52 C14 58 36 58 37 52 L42 8 Z"
            stroke="currentColor"
            strokeWidth="1.4"
            fill="#fffaf1"
            fillOpacity="0.3"
          />
          <ellipse cx="25" cy="8" rx="17" ry="4" stroke="currentColor" strokeWidth="1.2" fill="none" />
          {/* Vertical fluted cuts */}
          <line x1="16" y1="18" x2="18" y2="46" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.5" />
          <line x1="25" y1="18" x2="25" y2="48" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.5" />
          <line x1="34" y1="18" x2="32" y2="46" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.5" />
        </g>

        {/* ------------------------------------------------------------- */}
        {/* 6. TABLE RUNNER PERSPECTIVE LINE                             */}
        {/* ------------------------------------------------------------- */}
        <path
          d="M0 550 L320 480"
          stroke="url(#tableEdgeGradLeft)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M0 558 L280 496"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.15"
          strokeDasharray="4 6"
        />
      </svg>
    </motion.div>
  );
};
