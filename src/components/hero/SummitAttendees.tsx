import React from "react";
import { PreciousTableGathering } from "./PreciousTableGathering";
import { PromenadeHumanFigure } from "./characters/PromenadeHumanFigure";

export function SummitAttendees() {
  return (
    <div className="relative w-full h-[210px] sm:h-[240px] md:h-[270px] lg:h-[290px] overflow-hidden select-none pointer-events-auto">
      {/* Soft ground shadow blend for characters on the Delhi promenade */}
      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />

      {/* 
        ================================================================
        LAYER 1: BACKGROUND STROLLING FIGURES (Scale: 0.76, Promenade Walkers)
        ================================================================
      */}
      <div className="absolute inset-0 pointer-events-none">
        {/* BG 1: Woman */}
        <div className="absolute bottom-12 left-[4%] z-10 scale-[0.76] track-bg-1">
          <div className="relative w-8 h-16 sm:w-9 sm:h-18 md:w-10 md:h-20 opacity-80">
            <PromenadeHumanFigure gender="woman" glowColor="#f472b6" />
          </div>
        </div>

        {/* BG 2: Man */}
        <div className="absolute bottom-12 left-[22%] z-10 scale-[0.76] track-bg-2">
          <div className="relative w-8 h-16 sm:w-9 sm:h-18 md:w-10 md:h-20 opacity-80">
            <PromenadeHumanFigure gender="man" glowColor="#fbbf24" />
          </div>
        </div>

        {/* BG 3: Woman */}
        <div className="absolute bottom-12 left-[42%] z-10 scale-[0.76] track-bg-3">
          <div className="relative w-8 h-16 sm:w-9 sm:h-18 md:w-10 md:h-20 opacity-80">
            <PromenadeHumanFigure gender="woman" glowColor="#86efac" />
          </div>
        </div>

        {/* BG 4: Man */}
        <div className="absolute bottom-12 left-[64%] z-10 scale-[0.76] track-bg-4">
          <div className="relative w-8 h-16 sm:w-9 sm:h-18 md:w-10 md:h-20 opacity-80">
            <PromenadeHumanFigure gender="man" glowColor="#f8fafc" />
          </div>
        </div>

        {/* BG 5: Woman */}
        <div className="absolute bottom-12 left-[82%] z-10 scale-[0.76] track-bg-5">
          <div className="relative w-8 h-16 sm:w-9 sm:h-18 md:w-10 md:h-20 opacity-80">
            <PromenadeHumanFigure gender="woman" glowColor="#f472b6" />
          </div>
        </div>
      </div>

      {/* 
        ================================================================
        LAYER 2: MIDGROUND STROLLING FIGURES (Scale: 0.88, Promenade Walkers)
        ================================================================
      */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Mid 1: Man */}
        <div className="absolute bottom-8 left-[10%] z-15 scale-[0.88] track-mid-1">
          <div className="relative w-9 h-18 sm:w-10 sm:h-20 md:w-11 md:h-22 opacity-90">
            <PromenadeHumanFigure gender="man" glowColor="#fbbf24" />
          </div>
        </div>

        {/* Mid 2: Woman */}
        <div className="absolute bottom-8 left-[28%] z-15 scale-[0.88] track-mid-2">
          <div className="relative w-9 h-18 sm:w-10 sm:h-20 md:w-11 md:h-22 opacity-90">
            <PromenadeHumanFigure gender="woman" glowColor="#f472b6" />
          </div>
        </div>

        {/* Mid 3: Man */}
        <div className="absolute bottom-8 left-[54%] z-15 scale-[0.88] track-mid-3">
          <div className="relative w-9 h-18 sm:w-10 sm:h-20 md:w-11 md:h-22 opacity-90">
            <PromenadeHumanFigure gender="man" glowColor="#86efac" />
          </div>
        </div>

        {/* Mid 4: Woman */}
        <div className="absolute bottom-8 left-[74%] z-15 scale-[0.88] track-mid-4">
          <div className="relative w-9 h-18 sm:w-10 sm:h-20 md:w-11 md:h-22 opacity-90">
            <PromenadeHumanFigure gender="woman" glowColor="#f8fafc" />
          </div>
        </div>
      </div>

      {/* 
        ================================================================
        LAYER 3: FOREGROUND HERO STROLLER & THE DINING GATHERING
        ================================================================
      */}
      <div className="absolute inset-0">
        {/* Foreground Stroller: Stylish 3D Man moving along promenade */}
        <div className="absolute bottom-4 left-[24%] z-20 track-hero-6">
          <div className="relative w-10 h-20 sm:w-11 sm:h-22 md:w-12 md:h-24 opacity-95">
            <PromenadeHumanFigure gender="man" glowColor="#fbbf24" />
          </div>
        </div>

        {/* 
          ==============================================================
          THE GEOMETRY OF SIX: DUAL DINING TABLES & 12 SEATED ATTENDEES
          (Table 1: 3 Men, 3 Women | Table 2: 3 Men, 3 Women)
          ==============================================================
        */}
        <PreciousTableGathering />
      </div>
    </div>
  );
}
