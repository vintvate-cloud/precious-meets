import React from "react";
import { SummitSky } from "./SummitSky";
import { SummitAttendees } from "./SummitAttendees";
import heroDelhiSkyline from "@/assets/hero-delhi-skyline.png";

export function AnimatedSummitHero() {
  return (
    <section
      data-summit-hero
      className="relative w-full h-[100dvh] max-h-[100dvh] flex flex-col justify-end overflow-hidden select-none bg-[#f5efe4]"
    >
      {/* 1. Delhi Skyline Illustrated Background Image */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        <img
          src={heroDelhiSkyline}
          alt="Delhi Skyline Hero Background"
          className="size-full object-cover object-bottom brightness-100 saturate-[1.05]"
        />
        {/* Soft bottom vignette for promenade depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* 2. Sky & Aerial Dynamic Layer (Existing Clouds, Birds, Moving Helicopter) */}
      <SummitSky />

      {/* 3. Volumetric Sweeping Stage Spotlights (Gentle ambient beams over Delhi skyline) */}
      <div className="absolute inset-x-0 bottom-0 h-full pointer-events-none z-10 opacity-60">
        <svg viewBox="0 0 1600 700" preserveAspectRatio="none" className="w-full h-full">
          <defs>
            <linearGradient id="delhiSpotBeam1" x1="0.5" y1="1" x2="0.3" y2="0">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
              <stop offset="60%" stopColor="#e0f2fe" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#bae6fd" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="delhiSpotBeam2" x1="0.5" y1="1" x2="0.7" y2="0">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
              <stop offset="60%" stopColor="#e0f2fe" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#bae6fd" stopOpacity="0" />
            </linearGradient>
          </defs>
          <g className="animate-[beamSweepLeft_9s_easeInOutSine_infinite]" style={{ transformOrigin: "520px 600px" }}>
            <polygon points="515,600 525,600 360,0 260,0" fill="url(#delhiSpotBeam1)" />
          </g>
          <g className="animate-[beamSweepRight_11s_easeInOutSine_infinite]" style={{ transformOrigin: "940px 600px" }}>
            <polygon points="935,600 945,600 1100,0 1220,0" fill="url(#delhiSpotBeam2)" />
          </g>
        </svg>
      </div>

      {/* 3.5. Minimal Center Brand Title & One-Liner */}
      <div className="absolute inset-x-0 top-[16%] sm:top-[18%] md:top-[20%] z-25 flex flex-col items-center text-center px-4 pointer-events-none select-none">

        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#171514] tracking-tight leading-[1.08]">
          Six strangers. <span className="italic font-normal text-[#691C35]">One table.</span>
        </h1>

        <p className="mt-2 sm:mt-2.5 text-xs sm:text-sm md:text-base text-[#171514]/75 max-w-md md:max-w-lg font-sans font-medium leading-relaxed">
          Curated dinners designed for meaningful human connections across Delhi NCR.
        </p>
      </div>
      <div className="relative z-30 w-full flex flex-col items-center">
        <SummitAttendees />
      </div>

      {/* Bottom ambient border */}
      <div className="w-full h-1 bg-gradient-to-r from-transparent via-slate-400/20 to-transparent" />
    </section>
  );
}
