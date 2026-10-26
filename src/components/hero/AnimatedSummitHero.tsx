import React, { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sun, Moon } from "lucide-react";
import { SummitSky } from "./SummitSky";
import { SummitAttendees } from "./SummitAttendees";
import heroDelhiSkyline from "@/assets/hero-delhi-skyline.png";
import heroDelhiSkylineNight from "@/assets/hero-delhi-skyline-night.png";

type TimeMode = "auto" | "day" | "night";

export function AnimatedSummitHero() {
  const [timeMode, setTimeMode] = useState<TimeMode>("auto");
  const [currentTimeStr, setCurrentTimeStr] = useState<string>("");
  const [isNightComputed, setIsNightComputed] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      // Evening/Night begins at 18:00 (6:00 PM) until 05:59 AM
      const isEveningOrNight = hours >= 18 || hours < 6;
      setIsNightComputed(isEveningOrNight);

      const timeFormatted = now.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      });
      setCurrentTimeStr(timeFormatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 30000); // Re-check every 30s
    return () => clearInterval(interval);
  }, []);

  const isNight = timeMode === "auto" ? isNightComputed : timeMode === "night";

  return (
    <section
      data-summit-hero
      className={`relative w-full h-[100dvh] max-h-[100dvh] flex flex-col justify-end overflow-hidden select-none transition-colors duration-1000 ${
        isNight ? "bg-[#060e1d]" : "bg-[#f5efe4]"
      }`}
    >
      {/* ========================================================================= */}
      {/* 1. DUAL BACKGROUND SKYLINE (Day & Night Cross-Dissolve)                   */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        {/* 5px Right Shift Wrapper with horizontal bleed to avoid edge gaps */}
        <div className="absolute -inset-x-3 inset-y-0 translate-x-[5px]">
          {/* Day / Light Background */}
          <img
            src={heroDelhiSkyline}
            alt="Delhi Skyline Hero Background — Day"
            className={`absolute inset-0 size-full object-cover object-bottom brightness-100 saturate-[1.05] transition-opacity duration-1000 ease-in-out ${
              isNight ? "opacity-0" : "opacity-100"
            }`}
          />

          {/* Night Background (Illuminated Monuments, Streetlights & Water Reflections) */}
          <img
            src={heroDelhiSkylineNight}
            alt="Delhi Skyline Hero Background — Night"
            className={`absolute -top-8 -bottom-8 inset-x-0 w-full h-[calc(100%+64px)] object-cover object-bottom translate-y-1.5 sm:translate-y-3 md:translate-y-4 brightness-105 saturate-[1.1] transition-all duration-1000 ease-in-out ${
              isNight ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        {/* Bottom vignette for promenade & water depth */}
        <div
          className={`absolute inset-0 transition-all duration-1000 pointer-events-none ${
            isNight
              ? "bg-gradient-to-t from-black/50 via-transparent to-transparent"
              : "bg-gradient-to-t from-black/20 via-transparent to-transparent"
          }`}
        />
      </div>

      {/* ========================================================================= */}
      {/* 2. DYNAMIC SKY LAYER (Day Sun vs Night Moon, Stars, Helicopter, Clouds)   */}
      {/* ========================================================================= */}
      <SummitSky isNight={isNight} />

      {/* ========================================================================= */}
      {/* 3. VOLUMETRIC SWEEPING SEARCHLIGHTS (Cyan Morning Beams vs Golden Night)  */}
      {/* ========================================================================= */}
      <div
        className={`absolute inset-x-0 bottom-0 h-full pointer-events-none z-10 transition-opacity duration-1000 ${
          isNight ? "opacity-75" : "opacity-50"
        }`}
      >
        <svg viewBox="0 0 1600 700" preserveAspectRatio="none" className="w-full h-full">
          <defs>
            {/* Day Beams: Soft Morning Cyan */}
            <linearGradient id="delhiSpotBeamDay1" x1="0.5" y1="1" x2="0.3" y2="0">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
              <stop offset="60%" stopColor="#e0f2fe" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#bae6fd" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="delhiSpotBeamDay2" x1="0.5" y1="1" x2="0.7" y2="0">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
              <stop offset="60%" stopColor="#e0f2fe" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#bae6fd" stopOpacity="0" />
            </linearGradient>

            {/* Night Beams: Warm Golden Searchlight Rays */}
            <linearGradient id="delhiSpotBeamNight1" x1="0.5" y1="1" x2="0.3" y2="0">
              <stop offset="0%" stopColor="#fffbeb" stopOpacity="0.3" />
              <stop offset="40%" stopColor="#fef08a" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="delhiSpotBeamNight2" x1="0.5" y1="1" x2="0.7" y2="0">
              <stop offset="0%" stopColor="#fffbeb" stopOpacity="0.3" />
              <stop offset="40%" stopColor="#fde047" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
            </linearGradient>
          </defs>

          <g className="animate-[beamSweepLeft_9s_easeInOutSine_infinite]" style={{ transformOrigin: "520px 600px" }}>
            <polygon
              points="515,600 525,600 360,0 260,0"
              fill={isNight ? "url(#delhiSpotBeamNight1)" : "url(#delhiSpotBeamDay1)"}
            />
          </g>
          <g className="animate-[beamSweepRight_11s_easeInOutSine_infinite]" style={{ transformOrigin: "940px 600px" }}>
            <polygon
              points="935,600 945,600 1100,0 1220,0"
              fill={isNight ? "url(#delhiSpotBeamNight2)" : "url(#delhiSpotBeamDay2)"}
            />
          </g>
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* 4. REAL-TIME AMBIENT MODE INDICATOR & MANUAL TEST TOGGLE                  */}
      {/* ========================================================================= */}
      <div className="absolute top-20 sm:top-24 right-4 sm:right-8 z-30 pointer-events-auto">
        <button
          type="button"
          onClick={() => {
            setTimeMode((prev) => (prev === "auto" ? "night" : prev === "night" ? "day" : "auto"));
          }}
          title="Click to toggle between Auto (Real-Time), Day, and Night mode"
          className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-mono font-medium backdrop-blur-md transition-all duration-500 shadow-sm cursor-pointer border ${
            isNight
              ? "bg-[#0c1a30]/75 text-[#E2E8F0] border-white/20 hover:bg-[#0c1a30]/95 hover:border-[#E5C17D]/50 shadow-black/40"
              : "bg-white/80 text-[#171514]/80 border-black/10 hover:bg-white hover:border-black/20"
          }`}
        >
          {isNight ? (
            <Moon className="size-3 text-[#E5C17D] animate-pulse" />
          ) : (
            <Sun className="size-3 text-amber-500 animate-[spin_12s_linear_infinite]" />
          )}
          <span>
            {timeMode === "auto"
              ? isNight
                ? `Evening · ${currentTimeStr || "Night"}`
                : `Day · ${currentTimeStr || "Day"}`
              : timeMode === "night"
              ? "Forced: Night 🌙"
              : "Forced: Day ☀️"}
          </span>
          <span className="opacity-50 text-[9px]">
            {timeMode === "auto" ? "(Live)" : "(Preview)"}
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 5. CENTER BRAND TITLE, SUBTITLE & TAKE THE QUIZ CTA                       */}
      {/* ========================================================================= */}
      <div className="absolute inset-x-0 top-[16%] sm:top-[18%] md:top-[20%] z-25 flex flex-col items-center text-center px-4 pointer-events-none select-none">
        <h1
          className={`font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.08] transition-colors duration-1000 ${
            isNight
              ? "text-[#FDFBF7] drop-shadow-[0_2px_14px_rgba(0,0,0,0.85)]"
              : "text-[#171514]"
          }`}
        >
          Six strangers.{" "}
          <span
            className={`italic font-normal transition-colors duration-1000 ${
              isNight
                ? "text-[#E5C17D] drop-shadow-[0_2px_14px_rgba(0,0,0,0.85)]"
                : "text-[#691C35]"
            }`}
          >
            One table.
          </span>
        </h1>

        <p
          className={`mt-2 sm:mt-2.5 text-xs sm:text-sm md:text-base max-w-md md:max-w-lg font-sans font-medium leading-relaxed transition-colors duration-1000 ${
            isNight
              ? "text-[#E2E8F0]/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]"
              : "text-[#171514]/75"
          }`}
        >
          Curated dinners designed for meaningful human connections across Delhi NCR.
        </p>

        {/* Take the Quiz CTA Button */}
        <Link
          to="/quiz"
          className={`pointer-events-auto mt-4 sm:mt-5 group inline-flex items-center gap-2.5 rounded-full px-6 sm:px-7 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
            isNight
              ? "bg-gradient-to-r from-[#691C35] to-[#832644] text-[#FDFBF7] ring-1 ring-[#E5C17D]/40 shadow-xl shadow-black/50 hover:bg-[#832644] hover:shadow-black/70"
              : "bg-[#691C35] text-[#F8F2E7] shadow-lg shadow-[#691C35]/25 hover:bg-[#521528] hover:shadow-xl hover:shadow-[#691C35]/35"
          }`}
        >
          <span>Take the Quiz</span>
          <ArrowRight className="size-3.5 sm:size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>

      {/* ========================================================================= */}
      {/* 6. PROMENADE DINNER TABLE & SEATED GUESTS                                  */}
      {/* ========================================================================= */}
      <div className="relative z-30 w-full flex flex-col items-center">
        <SummitAttendees isNight={isNight} />
      </div>

      {/* Bottom ambient border */}
      <div
        className={`w-full h-1 transition-colors duration-1000 ${
          isNight
            ? "bg-gradient-to-r from-transparent via-[#E5C17D]/30 to-transparent"
            : "bg-gradient-to-r from-transparent via-slate-400/20 to-transparent"
        }`}
      />
    </section>
  );
}
