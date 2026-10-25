import React from "react";
import { PreciousTableGathering } from "./PreciousTableGathering";
import { AvatarFigureSVG } from "./AvatarFigureSVG";

export function SummitAttendees() {
  return (
    <div className="relative w-full h-[210px] sm:h-[240px] md:h-[270px] lg:h-[290px] overflow-hidden select-none pointer-events-auto">
      {/* Soft ground shadow blend for characters on the Delhi promenade */}
      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />

      {/* 
        ================================================================
        LAYER 1: BACKGROUND GLOWING AVATARS (Scale: 0.76, 5 Floating Promenade Badges)
        ================================================================
      */}
      <div className="absolute inset-0 pointer-events-none">
        {/* BG 1 */}
        <div className="absolute bottom-14 left-[4%] z-10 scale-[0.76] track-bg-1">
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12">
            <AvatarFigureSVG variant="pink" opacity={0.88} showGroundShadow />
          </div>
        </div>

        {/* BG 2 */}
        <div className="absolute bottom-14 left-[22%] z-10 scale-[0.76] track-bg-2">
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12">
            <AvatarFigureSVG variant="gold" opacity={0.88} showGroundShadow />
          </div>
        </div>

        {/* BG 3 */}
        <div className="absolute bottom-14 left-[42%] z-10 scale-[0.76] track-bg-3">
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12">
            <AvatarFigureSVG variant="mint" opacity={0.88} showGroundShadow />
          </div>
        </div>

        {/* BG 4 */}
        <div className="absolute bottom-14 left-[64%] z-10 scale-[0.76] track-bg-4">
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12">
            <AvatarFigureSVG variant="ivory" opacity={0.88} showGroundShadow />
          </div>
        </div>

        {/* BG 5 */}
        <div className="absolute bottom-14 left-[82%] z-10 scale-[0.76] track-bg-5">
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12">
            <AvatarFigureSVG variant="pink" opacity={0.88} showGroundShadow />
          </div>
        </div>
      </div>

      {/* 
        ================================================================
        LAYER 2: MIDGROUND GLOWING AVATARS (Scale: 0.88, 4 Floating Promenade Badges)
        ================================================================
      */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Mid 1 */}
        <div className="absolute bottom-9 left-[10%] z-15 scale-[0.88] track-mid-1">
          <div className="relative w-11 h-11 sm:w-12 sm:h-12 md:w-13 md:h-13">
            <AvatarFigureSVG variant="gold" opacity={0.92} showGroundShadow />
          </div>
        </div>

        {/* Mid 2 */}
        <div className="absolute bottom-9 left-[28%] z-15 scale-[0.88] track-mid-2">
          <div className="relative w-11 h-11 sm:w-12 sm:h-12 md:w-13 md:h-13">
            <AvatarFigureSVG variant="pink" opacity={0.92} showGroundShadow />
          </div>
        </div>

        {/* Mid 3 */}
        <div className="absolute bottom-9 left-[54%] z-15 scale-[0.88] track-mid-3">
          <div className="relative w-11 h-11 sm:w-12 sm:h-12 md:w-13 md:h-13">
            <AvatarFigureSVG variant="mint" opacity={0.92} showGroundShadow />
          </div>
        </div>

        {/* Mid 4 */}
        <div className="absolute bottom-9 left-[74%] z-15 scale-[0.88] track-mid-4">
          <div className="relative w-11 h-11 sm:w-12 sm:h-12 md:w-13 md:h-13">
            <AvatarFigureSVG variant="ivory" opacity={0.92} showGroundShadow />
          </div>
        </div>
      </div>

      {/* 
        ================================================================
        LAYER 3: FOREGROUND HERO STROLLER & THE DINING GATHERING
        ================================================================
      */}
      <div className="absolute inset-0">
        {/* Foreground Stroller: Glowing Hero Badge moving along promenade */}
        <div className="absolute bottom-5 left-[24%] z-20 track-hero-6">
          <div className="relative w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14">
            <AvatarFigureSVG variant="gold" opacity={0.96} showGroundShadow />
          </div>
        </div>

        {/* 
          ==============================================================
          THE GEOMETRY OF SIX: DUAL DINING TABLES & 12 GLOWING BADGES
          ==============================================================
        */}
        <PreciousTableGathering />
      </div>
    </div>
  );
}
