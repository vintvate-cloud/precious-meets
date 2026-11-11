import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import heroLuxuryDinner from "@/assets/hero-luxury-dinner.jpg";

/**
 * Luxury editorial close-up hero showcasing six real guests sharing a
 * candlelit fine-dining dinner in the Precious Meets palette.
 * (Original `AnimatedSummitHero` component is preserved separately.)
 */
export function LuxuryTableHero() {
  return (
    <section
      data-luxury-hero
      className="relative w-full h-[100dvh] min-h-[620px] max-h-[1080px] flex flex-col justify-start overflow-hidden select-none bg-[#261019]"
    >
      {/* Full-bleed intimate fine-dining close-up photograph */}
      <img
        src={heroLuxuryDinner}
        alt="Six strangers laughing and clinking wine glasses around a candlelit fine-dining table"
        loading="eager"
        decoding="async"
        draggable={false}
        className="absolute inset-0 size-full object-cover object-[50%_54%] sm:object-[50%_50%] pointer-events-none"
      />

      {/* Smooth architectural headroom scrim so typography reads crisply above guests */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(38,16,25,0.86)_0%,rgba(38,16,25,0.55)_26%,rgba(38,16,25,0.14)_46%,transparent_62%)]"
      />

      {/* Subtle warm radial vignette framing the outer edges */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_55%,rgba(38,16,25,0.42)_100%)]"
      />

      {/* Editorial Hero Typography anchored cleanly in upper archway headroom */}
      <div className="relative z-20 mx-auto w-full max-w-4xl px-5 sm:px-8 pt-24 sm:pt-28 md:pt-[11.5vh] flex flex-col items-center text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#C6A568]/45 bg-[#261019]/55 backdrop-blur-xs px-3.5 py-1 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#C6A568] shadow-sm">
          <span className="size-1.5 rounded-full bg-[#C6A568]" />
          Six Guests · 100% Aadhaar Verified · Delhi NCR
        </span>

        <h1 className="mt-3 sm:mt-4 font-display text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] tracking-tight leading-[1.03] text-[#F8F2E7] drop-shadow-[0_4px_20px_rgba(20,8,12,0.9)]">
          Six strangers.{" "}
          <em className="font-serif italic font-normal text-[#C6A568]">One table.</em>
        </h1>

        <p className="mt-2.5 max-w-xl text-xs sm:text-sm md:text-[15px] font-sans font-normal leading-relaxed text-[#F8F2E7]/90 drop-shadow-[0_2px_10px_rgba(20,8,12,0.95)]">
          Curated candlelit dinners designed for unhurried conversation and genuine human
          connection.
        </p>

        <div className="mt-4 sm:mt-5">
          <Link
            to="/quiz"
            className="group inline-flex items-center gap-2.5 rounded-full bg-[#691C35] hover:bg-[#5F7045] text-[#F8F2E7] ring-1 ring-[#C6A568]/70 hover:ring-[#E8ECD8]/65 px-6 sm:px-7 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold tracking-wide shadow-xl shadow-[#261019]/70 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <span>Take the Quiz</span>
            <ArrowRight className="size-3.5 sm:size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
