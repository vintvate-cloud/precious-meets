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

type MarqueeTone = "forest" | "burgundy" | "ochre";

interface MarqueeItem {
  text: string;
  tag: string;
  icon: typeof ShieldCheck;
  tone: MarqueeTone;
}

const marqueeItems: MarqueeItem[] = [
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

const toneStyles: Record<
  MarqueeTone,
  { icon: string; tag: string }
> = {
  forest: {
    icon: "bg-[#5F7045]/15 border-[#5F7045]/30 text-[#5F7045]",
    tag: "bg-[#5F7045] text-[#F8F2E7] border-[#5F7045]",
  },
  burgundy: {
    icon: "bg-[#691C35]/12 border-[#691C35]/28 text-[#691C35]",
    tag: "bg-[#691C35] text-[#F8F2E7] border-[#691C35]",
  },
  ochre: {
    icon: "bg-[#C6A568]/25 border-[#C6A568]/60 text-[#7A5922]",
    tag: "bg-[#C6A568] text-[#35392C] border-[#C6A568]",
  },
};

export function HeroMarquee() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Duplicate items 4 times to ensure seamless infinite looping on any screen width
  const loopItems = [...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems];

  return (
    <section
      ref={containerRef}
      aria-label="Precious Meets core pillars"
      className="relative w-full overflow-hidden bg-[#E8ECD8] text-[#35392C] py-4 sm:py-5 z-20 select-none"
    >
      {/* Subtle warm antique gold highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(198,165,104,0.14)_0%,_transparent_70%)] pointer-events-none" />

      {/* Subtle edge fade masks */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#E8ECD8] to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#E8ECD8] to-transparent z-10" />

      {/* Marquee Track */}
      <div className="flex w-max items-center animate-[marquee_45s_linear_infinite] hover:[animation-play-state:paused] will-change-transform">
        {loopItems.map((item, idx) => {
          const Icon = item.icon;
          const tone = toneStyles[item.tone];
          return (
            <div
              key={`${item.text}-${idx}`}
              className="inline-flex items-center gap-3 sm:gap-4 px-5 sm:px-8 group cursor-default"
            >
              {/* Badge Icon */}
              <span
                className={`flex size-7 sm:size-8 items-center justify-center rounded-full border shadow-2xs transition-transform duration-300 group-hover:scale-110 ${tone.icon}`}
              >
                <Icon className="size-3.5 sm:size-4" />
              </span>

              {/* Text Pill */}
              <span className="font-sans text-xs sm:text-sm font-semibold tracking-wide text-[#35392C] group-hover:text-[#691C35] transition-colors flex items-center gap-2">
                {item.text}
                <span
                  className={`hidden sm:inline-block rounded-full px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider border ${tone.tag}`}
                >
                  {item.tag}
                </span>
              </span>

              {/* Elegant Separator Glyph */}
              <span className="ml-3 sm:ml-5 text-[#691C35]/70 text-xs sm:text-sm font-serif select-none">
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
