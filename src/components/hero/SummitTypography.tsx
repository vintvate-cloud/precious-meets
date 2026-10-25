import React from "react";
import { Sun, Moon, Sparkles } from "lucide-react";

interface SummitTypographyProps {
  isNight: boolean;
  onToggleNight: () => void;
  onRegisterClick?: () => void;
}

export function SummitTypography({
  isNight,
  onToggleNight,
  onRegisterClick,
}: SummitTypographyProps) {
  return (
    <div className="relative z-30 flex flex-col items-center w-full max-w-7xl mx-auto px-3 sm:px-6 pt-2 sm:pt-3 pb-0">
      {/* Top Header Navbar Navigation (Exact to reference image) */}
      <header className="w-full flex items-center justify-between py-1 sm:py-1.5 mb-1 sm:mb-2 text-xs sm:text-sm font-semibold tracking-wide">
        {/* Left: Snowflake Logo + Hashtag */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1.5 font-bold tracking-tight text-sm sm:text-lg text-slate-900 transition-colors">
            {/* Snowflake Icon */}
            <svg viewBox="0 0 40 40" className="size-5 sm:size-6 text-[#0284c7] shrink-0" fill="currentColor">
              <path d="M 20 4 C 21.1 4 22 4.9 22 6 L 22 12.3 L 26.5 7.8 C 27.3 7 28.5 7 29.3 7.8 C 30.1 8.6 30.1 9.8 29.3 10.6 L 24.8 15.1 L 31.1 15.1 C 32.2 15.1 33.1 16 33.1 17.1 C 33.1 18.2 32.2 19.1 31.1 19.1 L 24.8 19.1 L 29.3 23.6 C 30.1 24.4 30.1 25.6 29.3 26.4 C 28.5 27.2 27.3 27.2 26.5 26.4 L 22 21.9 L 22 28.2 C 22 29.3 21.1 30.2 20 30.2 C 18.9 30.2 18 29.3 18 28.2 L 18 21.9 L 13.5 26.4 C 12.7 27.2 11.5 27.2 10.7 26.4 C 9.9 25.6 9.9 24.4 10.7 23.6 L 15.2 19.1 L 8.9 19.1 C 7.8 19.1 6.9 18.2 6.9 17.1 C 6.9 16 7.8 15.1 8.9 15.1 L 15.2 15.1 L 10.7 10.6 C 9.9 9.8 9.9 8.6 10.7 7.8 C 11.5 7 12.7 7 13.5 7.8 L 18 12.3 L 18 6 C 18 4.9 18.9 4 20 4 Z" />
            </svg>
            <span className={isNight ? "text-white" : "text-slate-900"}>snowflake</span>
          </div>

          <span className="hidden sm:inline-block font-mono text-[11px] uppercase tracking-wider text-slate-500 font-medium">
            #SNOWFLAKESUMMIT
          </span>
        </div>

        {/* Right Navigation Links & Registration Button */}
        <nav className="flex items-center gap-2 sm:gap-5">
          <div className={`hidden md:flex items-center gap-4 text-[11px] font-bold tracking-wider uppercase ${isNight ? "text-slate-200" : "text-slate-700"}`}>
            <span className="cursor-pointer hover:text-sky-500 transition-colors">HOME</span>
            <span className="cursor-pointer hover:text-sky-500 transition-colors">PARTNERS</span>
            <span className="cursor-pointer hover:text-sky-500 transition-colors">CALL FOR PAPERS</span>
            <span className="cursor-pointer hover:text-sky-500 transition-colors">FAQ</span>
          </div>

          {/* Interactive Day/Night Mode Switch */}
          <button
            onClick={onToggleNight}
            type="button"
            title="Toggle Day/Night Vegas Mode"
            className={`p-1.5 rounded-full border transition-all ${
              isNight
                ? "bg-slate-800 border-slate-600 text-amber-300 hover:bg-slate-700"
                : "bg-white/80 backdrop-blur border-slate-300 text-slate-700 hover:bg-white"
            } shadow-sm cursor-pointer`}
          >
            {isNight ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
          </button>

          {/* Primary Navbar Pill Button */}
          <button
            onClick={onRegisterClick}
            type="button"
            className="rounded-full bg-slate-950 hover:bg-slate-800 text-white px-3.5 sm:px-5 py-1.5 sm:py-2 text-[11px] font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer border border-slate-800"
          >
            REGISTER NOW
          </button>
        </nav>
      </header>

      {/* Mini Brand Kicker */}
      <div className="flex items-center gap-1 text-sky-500/90 text-xs font-semibold tracking-wide mb-0.5 animate-fade-in">
        <svg viewBox="0 0 24 24" className="size-3.5 text-sky-500 fill-current">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="tracking-widest uppercase font-bold text-[11px] text-sky-600">snowflake®</span>
      </div>

      {/* Monumental 3D Block Isometric "SUMMIT 2022" Artwork */}
      <div className="relative w-full max-w-3xl mx-auto py-1 flex justify-center items-center">
        <svg
          viewBox="0 0 920 280"
          className="w-full h-auto max-h-[100px] sm:max-h-[135px] md:max-h-[160px] lg:max-h-[185px] drop-shadow-lg select-none"
        >
          <defs>
            {/* Gradients for 3D faces */}
            <linearGradient id="extrusionGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="faceGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#f0f9ff" />
            </linearGradient>
            <linearGradient id="shadowGrad" x1="0" y1="0" x2="0.8" y2="0.8">
              <stop offset="0%" stopColor="#0369a1" />
              <stop offset="100%" stopColor="#075985" />
            </linearGradient>
            <filter id="softGlow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="18" stdDeviation="14" floodColor="#0284c7" floodOpacity="0.25" />
            </filter>
          </defs>

          <g filter="url(#softGlow)">
            {/* LETTER S */}
            <g transform="translate(40, 10)">
              {/* 3D Extrusion Depth Layer (Offset +18px, +26px) */}
              <path
                d="M 98 62 L 98 88 L 48 88 L 48 116 L 98 136 L 98 198 L 18 198 L 18 172 L 68 172 L 68 144 L 18 124 L 18 62 Z"
                transform="translate(18, 26)"
                fill="url(#shadowGrad)"
              />
              <path
                d="M 98 62 L 116 88 L 116 114 L 98 88 Z"
                fill="url(#extrusionGrad)"
              />
              {/* Front Face of S */}
              <path
                d="M 98 62 L 98 88 L 48 88 L 48 116 L 98 136 L 98 198 L 18 198 L 18 172 L 68 172 L 68 144 L 18 124 L 18 62 Z"
                fill="url(#faceGrad)"
                stroke="#bae6fd"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
            </g>

            {/* LETTER U */}
            <g transform="translate(160, 10)">
              <path
                d="M 18 62 L 48 62 L 48 168 L 78 168 L 78 62 L 108 62 L 108 198 L 18 198 Z"
                transform="translate(18, 26)"
                fill="url(#shadowGrad)"
              />
              <path
                d="M 18 62 L 48 62 L 48 168 L 78 168 L 78 62 L 108 62 L 108 198 L 18 198 Z"
                fill="url(#faceGrad)"
                stroke="#bae6fd"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
            </g>

            {/* MONUMENTAL CENTER M/W (The Iconic Snowflake Diamond Icon in 3D) */}
            <g transform="translate(300, 5)">
              {/* 3D Drop Extrusion */}
              <g transform="translate(20, 28)" fill="url(#shadowGrad)">
                {/* Upper Chevron */}
                <polygon points="120,40 220,120 180,150 120,105 60,150 20,120" />
                {/* Lower Inverted Chevron */}
                <polygon points="120,210 20,130 60,100 120,145 180,100 220,130" />
              </g>

              {/* 3D Side Extrusion Bevels */}
              <polygon points="220,120 240,148 200,178 180,150" fill="url(#extrusionGrad)" />
              <polygon points="120,210 140,238 40,158 20,130" fill="url(#extrusionGrad)" />

              {/* Front Faces: Stylized Hexagonal Double-Chevron Diamond */}
              <g stroke="#38bdf8" strokeWidth="3" strokeLinejoin="round">
                {/* Upper Diamond Wing */}
                <polygon
                  points="120,40 220,120 180,150 120,105 60,150 20,120"
                  fill="url(#faceGrad)"
                />
                {/* Lower Diamond Wing */}
                <polygon
                  points="120,210 20,130 60,100 120,145 180,100 220,130"
                  fill="url(#faceGrad)"
                />
              </g>

              {/* Inner Cutout Accent Lines */}
              <line x1="120" y1="55" x2="120" y2="95" stroke="#0284c7" strokeWidth="2.5" />
              <line x1="120" y1="155" x2="120" y2="195" stroke="#0284c7" strokeWidth="2.5" />
            </g>

            {/* LETTER I */}
            <g transform="translate(560, 10)">
              <rect x="18" y="62" width="30" height="136" rx="2" transform="translate(18, 26)" fill="url(#shadowGrad)" />
              <rect x="18" y="62" width="30" height="136" rx="2" fill="url(#faceGrad)" stroke="#bae6fd" strokeWidth="2.5" />
            </g>

            {/* LETTER T */}
            <g transform="translate(630, 10)">
              <polygon
                points="18,62 108,62 108,92 78,92 78,198 48,198 48,92 18,92"
                transform="translate(18, 26)"
                fill="url(#shadowGrad)"
              />
              <polygon
                points="18,62 108,62 108,92 78,92 78,198 48,198 48,92 18,92"
                fill="url(#faceGrad)"
                stroke="#bae6fd"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
            </g>

            {/* VERTICAL "2022" on the right side of SUMMIT */}
            <g transform="translate(765, 75)">
              <rect x="0" y="0" width="36" height="125" rx="6" fill="#0284c7" opacity="0.15" />
              <text
                x="18"
                y="110"
                fill="#0284c7"
                fontSize="32"
                fontWeight="900"
                fontFamily="sans-serif"
                transform="rotate(-90 18 110)"
                letterSpacing="4"
              >
                2022
              </text>
            </g>
          </g>
        </svg>
      </div>

      {/* Subtitle & Date Banner: LIVE IN VEGAS | JUNE 13-16, 2022 */}
      <div className="flex flex-col items-center mt-0.5 sm:mt-1">
        <h2 className="text-xs sm:text-sm md:text-base font-black uppercase tracking-widest text-[#0f284e] flex items-center gap-2">
          <span>LIVE IN VEGAS</span>
          <span className="text-sky-500 font-normal">|</span>
          <span>JUNE 13-16, 2022</span>
        </h2>

        {/* Primary Center CTA Pill Button */}
        <button
          onClick={onRegisterClick}
          type="button"
          className="mt-1 sm:mt-2 group relative inline-flex items-center gap-1.5 rounded-full bg-slate-950 px-5 sm:px-6 py-1.5 sm:py-2 text-[10px] sm:text-xs font-black uppercase tracking-wider text-white shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border border-slate-700/60"
        >
          <span className="relative z-10 flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-sky-400 animate-spin" style={{ animationDuration: "6s" }} />
            <span>REGISTER FOR SUMMIT</span>
          </span>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-500/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>
    </div>
  );
}
