import { useRef } from "react";
import {
  ShieldCheck,
  Sparkles,
  MapPin,
  UtensilsCrossed,
  HeartHandshake,
  Users,
  Compass,
  Smile,
} from "lucide-react";

const marqueeItems = [
  {
    text: "100% Offline Aadhaar Verified",
    tag: "Safety First",
    icon: ShieldCheck,
    tone: "forest",
  },
  {
    text: "Six Strangers. One Table.",
    tag: "The Geometry",
    icon: Users,
    tone: "burgundy",
  },
  {
    text: "Delhi NCR Heritage Courtyards",
    tag: "Secret Enclaves",
    icon: MapPin,
    tone: "ochre",
  },
  {
    text: "Women-First Seating & Guardian Hosts",
    tag: "Zero Predators",
    icon: HeartHandshake,
    tone: "forest",
  },
  {
    text: "Four Seasonal Courses & Warm Candlelight",
    tag: "Slow Dining",
    icon: UtensilsCrossed,
    tone: "burgundy",
  },
  {
    text: "Zero Resumes · Zero Social Performance",
    tag: "Pure Presence",
    icon: Sparkles,
    tone: "ochre",
  },
  {
    text: "Curated Psychometric Chemistry",
    tag: "Balanced Ratios",
    icon: Compass,
    tone: "forest",
  },
  {
    text: "Unhurried Conversations That Linger",
    tag: "Every Meet Matters",
    icon: Smile,
    tone: "burgundy",
  },
];

export function HeroMarquee() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Duplicate items 4 times to ensure seamless infinite looping on any screen width
  const loopItems = [...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems];

  return (
    <section
      ref={containerRef}
      aria-label="Precious Meets core pillars"
      className="relative w-full overflow-hidden border-y border-black/10 dark:border-white/10 bg-[#16060B] text-ivory py-4 sm:py-5 z-20 select-none shadow-[0_10px_30px_rgba(0,0,0,0.15)]"
    >
      {/* Background ambient glow effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-burgundy/25 via-transparent to-transparent pointer-events-none" />

      {/* Subtle edge fade masks */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#16060B] to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#16060B] to-transparent z-10" />

      {/* Marquee Track */}
      <div className="flex w-max items-center animate-[marquee_45s_linear_infinite] hover:[animation-play-state:paused] will-change-transform">
        {loopItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={`${item.text}-${idx}`}
              className="inline-flex items-center gap-3 sm:gap-4 px-5 sm:px-8 group cursor-default"
            >
              {/* Badge Icon */}
              <span className="flex size-7 sm:size-8 items-center justify-center rounded-full bg-white/10 border border-white/15 text-ochre shadow-xs transition-transform duration-300 group-hover:scale-110">
                <Icon className="size-3.5 sm:size-4" />
              </span>

              {/* Text Pill */}
              <span className="font-sans text-xs sm:text-sm font-semibold tracking-wide text-ivory/90 group-hover:text-white transition-colors flex items-center gap-2">
                {item.text}
                <span className="hidden sm:inline-block rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-ochre/85 border border-white/10">
                  {item.tag}
                </span>
              </span>

              {/* Elegant Separator Glyph */}
              <span className="ml-3 sm:ml-5 text-ochre/40 text-xs sm:text-sm font-serif select-none">
                ✦
              </span>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes marquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
      `}</style>
    </section>
  );
}
