import React, { useState, useEffect, useRef, useCallback } from "react";
import type { HeroSectionProps, HeroSlide } from "./types";
import { ArrowRight, ChevronLeft, ChevronRight, MapPin } from "lucide-react";

// Turnkey default high-res photographs
import tableBurgundy from "@/assets/table-burgundy.jpg";
import tableLaugh from "@/assets/table-laugh.jpg";
import hands from "@/assets/hands.jpg";
import tableStill from "@/assets/table-still.jpg";
import conversation from "@/assets/conversation.jpg";
import dusk from "@/assets/dusk.jpg";

export const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: "table-1",
    src: tableBurgundy,
    alt: "Candlelit curated table with burgundy florals in heritage courtyard",
    caption: "The Geometry of Six",
    location: "Mehrauli Courtyards",
  },
  {
    id: "table-2",
    src: tableLaugh,
    alt: "New friends sharing unforced laughter over a seasonal meal",
    caption: "Unscripted Connection",
    location: "Hauz Khas Terraces",
  },
  {
    id: "table-3",
    src: hands,
    alt: "Breaking sourdough and sharing wine across a warm table",
    caption: "Deliberate Gathering",
    location: "Sunder Nursery Enclaves",
  },
  {
    id: "table-4",
    src: conversation,
    alt: "Curious minds deep in meaningful conversation",
    caption: "Beyond Small Talk",
    location: "Civil Lines Verandas",
  },
  {
    id: "table-5",
    src: tableStill,
    alt: "A tranquil dining sanctuary away from the city's frantic pace",
    caption: "Space to Breathe",
    location: "Lodhi Historic Vaults",
  },
  {
    id: "table-6",
    src: dusk,
    alt: "Twilight gathering under ancient arches",
    caption: "Evenings That Linger",
    location: "Qutub Forest Lofts",
  },
];

/**
 * HeroSection: A refined, minimalist editorial hero section.
 * - Replaces jarring infinite conveyor tickers with a tranquil, breathing archival photograph
 * - Monumental serif flank typography ("every" | "matters.")
 * - Silky smooth cross-dissolve with subtle Ken-Burns ambient expansion
 * - Interactive 3D mouse parallax tilt
 * - Ultra-minimal text, zero gradients, pure quiet luxury
 */
export function HeroSection({
  slides = DEFAULT_SLIDES,
  leftFlankText = "every",
  rightFlankText = "matters.",
  kicker = "DELHI NCR · 6 GUESTS ONLY",
  subtitle = "Curated experiences designed for meaningful human connections across Delhi NCR.",
  autoPlayInterval = 6500,
  ctaText = "Take the Quiz",
  ctaHref = "/quiz",
  className = "",
}: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const total = slides.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Gentle auto-advance timer (pauses on hover)
  useEffect(() => {
    if (autoPlayInterval <= 0 || isHovered) return;
    const timer = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(timer);
  }, [autoPlayInterval, isHovered, nextSlide]);

  // Subtle 3D mouse parallax tilt on the hero frame
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMouseOffset({ x: 0, y: 0 });
  };

  const currentSlide = slides[currentIndex] || slides[0];

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative min-h-[92vh] sm:min-h-screen w-full flex flex-col justify-between overflow-hidden bg-[#F8F2E7] text-[#171514] select-none ${className}`}
    >
      {/* 1. TOP CLEARANCE FOR FLOATING NAVBAR & MINIMAL KICKER */}
      <div className="pt-24 sm:pt-28 md:pt-32 flex flex-col items-center px-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#171514]/12 bg-[#FFFDF9] px-4 py-1.5 shadow-2xs transition-all duration-300 hover:border-[#171514]/25">
          <MapPin className="size-3 text-[#691C35]" />
          <span className="font-mono text-[0.68rem] tracking-[0.24em] uppercase text-[#171514]/75 font-medium">
            {kicker}
          </span>
        </div>
      </div>

      {/* 2. MAIN EDITORIAL TRIPTYCH STAGE */}
      <div className="relative z-10 w-full max-w-[1520px] mx-auto px-4 sm:px-6 md:px-10 flex-1 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 my-auto py-6">

        {/* LEFT FLANK: Monumental Serif Text */}
        <div className="order-1 flex-1 flex items-center justify-center md:justify-end select-none pr-0 md:pr-4 lg:pr-8 xl:pr-12">
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[7.5rem] 2xl:text-[8.5rem] leading-none tracking-tight text-[#5F7045] select-none text-center md:text-right transition-transform duration-500">
            {leftFlankText}
          </h1>
        </div>

        {/* CENTER ARCHIVAL SHOWCASE: Single Breathing Photo Card */}
        <div className="order-2 shrink-0 relative flex flex-col items-center">
          <div
            style={{
              transform: `perspective(1000px) rotateY(${mouseOffset.x * 6}deg) rotateX(${-mouseOffset.y * 6}deg)`,
              transition: isHovered ? "transform 0.15s ease-out" : "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            className="relative w-[280px] sm:w-[330px] md:w-[360px] lg:w-[410px] xl:w-[440px] aspect-[4/5] rounded-[24px] sm:rounded-[28px] overflow-hidden border border-[#171514]/14 bg-[#FFFDF9] shadow-[0_24px_50px_-20px_rgba(23,21,20,0.18)]"
          >
            {/* The Breathing Photographic Slides */}
            {slides.map((slide, idx) => {
              const isActive = idx === currentIndex;
              return (
                <div
                  key={slide.id}
                  className={`absolute inset-0 size-full transition-opacity duration-1000 ease-in-out ${
                    isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                  }`}
                >
                  <img
                    src={slide.src}
                    alt={slide.alt}
                    className={`size-full object-cover transition-transform duration-[7000ms] ease-out select-none ${
                      isActive ? "scale-105" : "scale-100"
                    }`}
                    loading={idx === 0 ? "eager" : "lazy"}
                    draggable={false}
                  />
                </div>
              );
            })}

            {/* Subtle Slide Caption Bar (Bottom Inside Frame) */}
            <div className="absolute inset-x-0 bottom-0 z-20 p-4 sm:p-5 flex items-end justify-between text-[#F8F2E7] bg-gradient-to-t from-[#171514]/75 via-[#171514]/30 to-transparent">
              <div>
                <p className="font-mono text-[0.64rem] tracking-[0.18em] uppercase text-[#C6A568]">
                  {currentSlide.location || "Delhi NCR"}
                </p>
                <p className="font-display text-lg sm:text-xl leading-tight text-[#F8F2E7] mt-0.5">
                  {currentSlide.caption || "Curated Gathering"}
                </p>
              </div>

              {/* Minimal Pagination Dots */}
              <div className="flex items-center gap-1.5 pb-1">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-1 rounded-full transition-all duration-500 cursor-pointer ${
                      i === currentIndex ? "w-6 bg-[#C6A568]" : "w-1.5 bg-[#F8F2E7]/40 hover:bg-[#F8F2E7]/70"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Gentle Previous / Next Arrow Controls */}
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 size-8 rounded-full bg-[#171514]/35 hover:bg-[#171514]/65 text-[#F8F2E7] flex items-center justify-center opacity-0 group-hover:opacity-100 sm:opacity-0 hover:!opacity-100 transition-opacity backdrop-blur-xs cursor-pointer"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 size-8 rounded-full bg-[#171514]/35 hover:bg-[#171514]/65 text-[#F8F2E7] flex items-center justify-center opacity-0 group-hover:opacity-100 sm:opacity-0 hover:!opacity-100 transition-opacity backdrop-blur-xs cursor-pointer"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          {/* Minimal Slide Index Counter Below Frame */}
          <div className="mt-3 flex items-center gap-2 font-mono text-[0.7rem] text-[#171514]/50 tracking-[0.2em]">
            <span>0{currentIndex + 1}</span>
            <span className="w-8 h-[1px] bg-[#171514]/20" />
            <span>0{total}</span>
          </div>
        </div>

        {/* RIGHT FLANK: Monumental Serif Text */}
        <div className="order-3 flex-1 flex items-center justify-center md:justify-start select-none pl-0 md:pr-0 lg:pl-8 xl:pl-12">
          <h2 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[7.5rem] 2xl:text-[8.5rem] leading-none tracking-tight text-[#691C35] select-none text-center md:text-left transition-transform duration-500">
            {rightFlankText}
          </h2>
        </div>

      </div>

      {/* 3. RESTRAINED MINIMAL BOTTOM ROW (SUBTITLE + SINGLE CLEAN CTA) */}
      <div className="relative z-10 pb-8 sm:pb-12 pt-2 flex flex-col items-center justify-center gap-4 text-center px-6 max-w-xl mx-auto">
        <p className="font-sans text-sm sm:text-base text-[#171514]/75 font-normal leading-relaxed">
          {subtitle}
        </p>

        <a
          href={ctaHref}
          className="inline-flex items-center gap-2.5 rounded-full bg-[#691C35] text-[#F8F2E7] px-6 py-3 text-xs font-semibold tracking-wider uppercase transition-all duration-300 hover:bg-[#521528] hover:scale-105 active:scale-95 shadow-md shadow-[#691C35]/20 cursor-pointer"
        >
          <span>{ctaText}</span>
          <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
        </a>
      </div>
    </section>
  );
}
