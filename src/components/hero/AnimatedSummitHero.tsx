import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SummitSky } from "./SummitSky";
import { SummitAttendees } from "./SummitAttendees";
import heroDelhiSkylineNight from "@/assets/delhi-skyline-starry-purple.png";

export function AnimatedSummitHero() {
  const [headlineStage, setHeadlineStage] = useState<0 | 1 | 2>(0);

  return (
    <section
      data-summit-hero
      className="relative w-full h-[100dvh] max-h-[100dvh] flex flex-col justify-end overflow-hidden select-none bg-[#0b061b]"
    >
      {/* ========================================================================= */}
      {/* 1. BACKGROUND SKYLINE (Starry Purple Night Sky)                           */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        {/* 5px Right Shift Wrapper with horizontal bleed to avoid edge gaps */}
        <div className="absolute -inset-x-3 inset-y-0 translate-x-[5px]">
          <img
            src={heroDelhiSkylineNight}
            alt="Delhi Skyline Hero Background — Starry Purple Night"
            className="absolute -top-8 -bottom-8 inset-x-0 w-full h-[calc(100%+64px)] object-cover object-bottom translate-y-1.5 sm:translate-y-3 md:translate-y-4 brightness-105 saturate-[1.1]"
          />
        </div>

        {/* Bottom vignette for promenade & water depth */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>

      {/* ========================================================================= */}
      {/* 2. DYNAMIC SKY LAYER (Moon, Starfield, Helicopter, Clouds)                */}
      {/* ========================================================================= */}
      <SummitSky isNight={true} />

      {/* ========================================================================= */}
      {/* 3. VOLUMETRIC SWEEPING SEARCHLIGHTS (Golden Night Rays)                   */}
      {/* ========================================================================= */}
      <div className="absolute inset-x-0 bottom-0 h-full pointer-events-none z-10 opacity-75">
        <svg viewBox="0 0 1600 700" preserveAspectRatio="none" className="w-full h-full">
          <defs>
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
              fill="url(#delhiSpotBeamNight1)"
            />
          </g>
          <g className="animate-[beamSweepRight_11s_easeInOutSine_infinite]" style={{ transformOrigin: "940px 600px" }}>
            <polygon
              points="935,600 945,600 1100,0 1220,0"
              fill="url(#delhiSpotBeamNight2)"
            />
          </g>
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* 4. CENTER BRAND TITLE, SUBTITLE & TAKE THE QUIZ CTA                       */}
      {/* ========================================================================= */}
      <div className="absolute inset-x-0 top-[16%] sm:top-[18%] md:top-[20%] z-25 flex flex-col items-center text-center px-4 pointer-events-none select-none">
        {/* Animated Carousel Header (Slides Upwards) */}
        <div className="relative h-12 sm:h-14 md:h-18 lg:h-20 w-full overflow-hidden flex flex-col items-center justify-start">
          <div
            className={`w-full flex flex-col items-center ${
              headlineStage === 0
                ? "transition-none"
                : "transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
            }`}
            style={{
              transform: `translateY(${
                headlineStage === 0 ? "0%" : headlineStage === 1 ? "-33.333%" : "-66.666%"
              })`,
            }}
          >
            {/* Slide 0: Six strangers. One table. (Initial Wander) */}
            <div className="h-12 sm:h-14 md:h-18 lg:h-20 w-full flex items-center justify-center">
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.08] text-[#FDFBF7] drop-shadow-[0_2px_14px_rgba(0,0,0,0.85)]">
                Six strangers.{" "}
                <span className="italic font-normal text-[#E5C17D] drop-shadow-[0_2px_14px_rgba(0,0,0,0.85)]">
                  One table.
                </span>
              </h1>
            </div>

            {/* Slide 1: Everyone is verified here. (Olive Green Accent Text) */}
            <div className="h-12 sm:h-14 md:h-18 lg:h-20 w-full flex items-center justify-center">
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.08] text-[#FDFBF7] drop-shadow-[0_2px_14px_rgba(0,0,0,0.85)]">
                Everyone is{" "}
                <span className="italic font-normal text-[#8ea852] drop-shadow-[0_2px_14px_rgba(142,168,82,0.7)]">
                  verified here.
                </span>
              </h1>
            </div>

            {/* Slide 2: Six strangers. One table. (Grouping in 6s Assembled) */}
            <div className="h-12 sm:h-14 md:h-18 lg:h-20 w-full flex items-center justify-center">
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.08] text-[#FDFBF7] drop-shadow-[0_2px_14px_rgba(0,0,0,0.85)]">
                Six strangers.{" "}
                <span className="italic font-normal text-[#E5C17D] drop-shadow-[0_2px_14px_rgba(0,0,0,0.85)]">
                  One table.
                </span>
              </h1>
            </div>
          </div>
        </div>

        {/* Animated Carousel Subtitle (Slides Upwards in sync) */}
        <div className="relative h-10 sm:h-11 w-full max-w-md md:max-w-lg mt-2 sm:mt-2.5 overflow-hidden flex flex-col items-center justify-start">
          <div
            className={`w-full flex flex-col items-center ${
              headlineStage === 0
                ? "transition-none"
                : "transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
            }`}
            style={{
              transform: `translateY(${
                headlineStage === 0 ? "0%" : headlineStage === 1 ? "-33.333%" : "-66.666%"
              })`,
            }}
          >
            {/* Subtitle 0 */}
            <div className="h-10 sm:h-11 w-full flex items-center justify-center">
              <p className="text-xs sm:text-sm md:text-base font-sans font-medium leading-relaxed text-[#E2E8F0]/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                Curated experiences designed for meaningful human connections across Delhi NCR.
              </p>
            </div>

            {/* Subtitle 1 */}
            <div className="h-10 sm:h-11 w-full flex items-center justify-center">
              <p className="text-xs sm:text-sm md:text-base font-sans font-medium leading-relaxed text-[#E2E8F0]/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                Every member confirms their identity before they ever say hello.
              </p>
            </div>

            {/* Subtitle 2 */}
            <div className="h-10 sm:h-11 w-full flex items-center justify-center">
              <p className="text-xs sm:text-sm md:text-base font-sans font-medium leading-relaxed text-[#E2E8F0]/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                Curated experiences designed for meaningful human connections across Delhi NCR.
              </p>
            </div>
          </div>
        </div>

        {/* Take the Quiz CTA Button */}
        <Link
          to="/quiz"
          className="pointer-events-auto mt-4 sm:mt-5 group inline-flex items-center gap-2.5 rounded-full px-6 sm:px-7 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer bg-gradient-to-r from-[#691C35] to-[#832644] text-[#FDFBF7] ring-1 ring-[#E5C17D]/40 shadow-xl shadow-black/50 hover:bg-[#832644] hover:shadow-black/70"
        >
          <span>Take the Quiz</span>
          <ArrowRight className="size-3.5 sm:size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>

      {/* ========================================================================= */}
      {/* 5. PROMENADE DINNER TABLE & SEATED GUESTS                                  */}
      {/* ========================================================================= */}
      <div className="relative z-30 w-full flex flex-col items-center">
        <SummitAttendees isNight={true} onStageChange={setHeadlineStage} />
      </div>

      {/* Bottom ambient border */}
      <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#E5C17D]/30 to-transparent" />
    </section>
  );
}

