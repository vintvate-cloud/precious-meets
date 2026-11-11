import { useState, useEffect } from "react";
import { Sparkles, X, ArrowRight, Quote } from "lucide-react";

interface PromptItem {
  text: string;
  category: "delhi" | "lifestyle" | "soul" | "playful";
  colorClass: string;
  insight: string;
  tag: string;
}

const rowOnePrompts: PromptItem[] = [
  {
    text: "Tea or coffee person?",
    category: "playful",
    tag: "The Morning Ritual",
    colorClass: "bg-[#5F7045] text-[#F8F2E7] border-[#C6A568]/50 hover:bg-[#4F5E39]",
    insight: "The eternal ritual debate. Unlocks morning routines, favorite neighborhood nooks, and quiet comfort habits.",
  },
  {
    text: "Favourite Delhi winter thing?",
    category: "delhi",
    tag: "Dilli Ki Sardi",
    colorClass: "bg-[#691C35] text-[#F8F2E7] border-[#C6A568]/60 hover:bg-[#541529]",
    insight: "From afternoon picnics under Lodhi Garden arches to steaming hot daulat ki chaat in the narrow lanes of Dariba Kalan.",
  },
  {
    text: "Best chaat in the city?",
    category: "delhi",
    tag: "Culinary Loyalties",
    colorClass: "bg-[#C6A568] text-[#35392C] border-[#691C35]/25 hover:bg-[#B89556]",
    insight: "Sparks fierce, passionate loyalties across Bengali Market, UPSC lane, and Chandni Chowk street stalls.",
  },
  {
    text: "Mountains or the sea?",
    category: "lifestyle",
    tag: "Escape Route",
    colorClass: "bg-[#E8ECD8] text-[#35392C] border-[#5F7045]/40 hover:bg-[#DCE2C6]",
    insight: "Reveals how you recharge—whether you crave cool solitude and pine mist or rhythmic open waves and horizon.",
  },
  {
    text: "Last trip you loved?",
    category: "soul",
    tag: "Wanderlust",
    colorClass: "bg-[#691C35] text-[#F8F2E7] border-[#C6A568]/60 hover:bg-[#541529]",
    insight: "Takes people away from their everyday resume into memories of discovery, wanderlust, and unplanned journeys.",
  },
  {
    text: "What makes someone memorable to you?",
    category: "soul",
    tag: "Human Resonance",
    colorClass: "bg-[#5F7045] text-[#F8F2E7] border-[#C6A568]/50 hover:bg-[#4F5E39]",
    insight: "Cuts through surface banter and illuminates what you genuinely value in real human connection.",
  },
];

const rowTwoPrompts: PromptItem[] = [
  {
    text: "Your go-to Sunday plan?",
    category: "lifestyle",
    tag: "The Slow Cadence",
    colorClass: "bg-[#C6A568] text-[#35392C] border-[#691C35]/25 hover:bg-[#B89556]",
    insight: "Sourdough bakes, long dog walks through Jahanpanah forest, or unhurried books with the phone turned off.",
  },
  {
    text: "What did you want to be at ten?",
    category: "soul",
    tag: "Childhood Spark",
    colorClass: "bg-[#691C35] text-[#F8F2E7] border-[#C6A568]/60 hover:bg-[#541529]",
    insight: "Astronaut, palaeontologist, or train conductor—brings out the purest childhood spark and unscripted wonder.",
  },
  {
    text: "A book you keep recommending?",
    category: "soul",
    tag: "Quiet Influences",
    colorClass: "bg-[#E8ECD8] text-[#35392C] border-[#5F7045]/40 hover:bg-[#DCE2C6]",
    insight: "The stories that quietly shaped our worldviews and the pages we still fold corners and write notes on.",
  },
  {
    text: "Filter coffee in Lodhi or cutting chai at CP?",
    category: "delhi",
    tag: "Delhi Debates",
    colorClass: "bg-[#5F7045] text-[#F8F2E7] border-[#C6A568]/50 hover:bg-[#4F5E39]",
    insight: "Two sacred Delhi cadences. A classic question that immediately gets everyone at the table smiling.",
  },
  {
    text: "The song you secretly never skip?",
    category: "playful",
    tag: "Private Soundtracks",
    colorClass: "bg-[#691C35] text-[#F8F2E7] border-[#C6A568]/60 hover:bg-[#541529]",
    insight: "The soundtrack to late-night drives down Shanti Path when the city lights reflect in the asphalt.",
  },
];

const rowThreePrompts: PromptItem[] = [
  {
    text: "Old Delhi or South Delhi?",
    category: "delhi",
    tag: "Heritage vs Solitude",
    colorClass: "bg-[#F3ECE4] text-[#4B3F35] border-[#E7DDD1] hover:bg-[#EAE0D3]",
    insight: "Centuries of Mughal poetry and food alleys versus leafy shaded colonies and indie courtyard cafes.",
  },
  {
    text: "What are you quietly working towards right now?",
    category: "soul",
    tag: "Unfinished Dreams",
    colorClass: "bg-[#F7E7EC] text-[#691C35] border-[#EED0DA] hover:bg-[#F2D7E0]",
    insight: "The dream you haven't posted on LinkedIn yet. Tender, real, and always met with wholehearted table encouragement.",
  },
  {
    text: "A meal that made you pause?",
    category: "lifestyle",
    tag: "Shared Tables",
    colorClass: "bg-[#FAF0DE] text-[#7A5422] border-[#F2DEBA] hover:bg-[#F4E6C9]",
    insight: "Slow meals etched in memory: home-cooked dal after travel, or midnight street food in cold winter rain.",
  },
  {
    text: "What's an opinion you rarely share out loud?",
    category: "soul",
    tag: "Safe Space",
    colorClass: "bg-[#EBF1E5] text-[#3B542E] border-[#DCE6D2] hover:bg-[#DEE8D4]",
    insight: "A safe sanctuary to explore contrarian curiosities without judgment or debate club posturing.",
  },
  {
    text: "Early sunrise walk or midnight city drive?",
    category: "playful",
    tag: "City Hours",
    colorClass: "bg-[#FAF0DE] text-[#7A5422] border-[#F2DEBA] hover:bg-[#F4E6C9]",
    insight: "Delhi is two completely different cities at 6 AM and 1 AM. Both have magic for the thoughtful explorer.",
  },
  {
    text: "The last time you felt truly present?",
    category: "soul",
    tag: "Stillness",
    colorClass: "bg-[#E8F0E4] text-[#35512B] border-[#D7E5D1] hover:bg-[#DAE7D3]",
    insight: "No notifications, no rushing. Just a candlelit table, good sourdough, and people who are right there with you.",
  },
];

export function ConversationStarters() {
  const [selectedPrompt, setSelectedPrompt] = useState<PromptItem | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedPrompt(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Triple arrays for smooth infinite looping
  const row1 = [...rowOnePrompts, ...rowOnePrompts, ...rowOnePrompts];
  const row2 = [...rowTwoPrompts, ...rowTwoPrompts, ...rowTwoPrompts];

  return (
    <section className="relative w-full bg-[#F8F2E7] py-16 sm:py-24 overflow-hidden select-none">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center mb-8 sm:mb-10">
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#691C35] tracking-tight">
          BIG CONVERSATIONS
        </h2>
      </div>

      {/* Infinite Horizontal Conveyor Belts (2 Compact Rows Only) */}
      <div className="relative w-full space-y-3 sm:space-y-4 [contain:content]">
        {/* Row 1: Drifts Left (Small & Minimal) */}
        <div className="flex w-max items-center animate-[scrollLeft_55s_linear_infinite] hover:[animation-play-state:paused] transform-gpu will-change-transform">
          {row1.map((item, idx) => (
            <button
              type="button"
              key={`row1-${item.text}-${idx}`}
              onClick={() => setSelectedPrompt(item)}
              className={`inline-flex items-center mx-1.5 sm:mx-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full border text-xs sm:text-sm font-medium tracking-normal shadow-2xs transition-all duration-300 hover:scale-105 hover:shadow-xs active:scale-95 cursor-pointer whitespace-nowrap ${item.colorClass}`}
            >
              <span>{item.text}</span>
            </button>
          ))}
        </div>

        {/* Row 2: Drifts Right (Small & Minimal) */}
        <div className="flex w-max items-center animate-[scrollRight_50s_linear_infinite] hover:[animation-play-state:paused] transform-gpu will-change-transform">
          {row2.map((item, idx) => (
            <button
              type="button"
              key={`row2-${item.text}-${idx}`}
              onClick={() => setSelectedPrompt(item)}
              className={`inline-flex items-center mx-1.5 sm:mx-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full border text-xs sm:text-sm font-medium tracking-normal shadow-2xs transition-all duration-300 hover:scale-105 hover:shadow-xs active:scale-95 cursor-pointer whitespace-nowrap ${item.colorClass}`}
            >
              <span>{item.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Subtle Hint */}
      <div className="mt-8 sm:mt-10 text-center px-4">
        <p className="inline-flex items-center gap-2 text-xs font-mono text-[#5F7045] tracking-wider">
          <span className="size-1.5 rounded-full bg-[#691C35] animate-ping" />
          Click any card to open the table prompt
        </p>
      </div>

      {/* MODAL POPUP DIALOG */}
      {selectedPrompt && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedPrompt(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#261019]/75 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-3xl bg-[#FCF8EE] border border-[#C6A568]/55 p-7 sm:p-9 md:p-10 shadow-[0_25px_60px_-15px_rgba(38,16,25,0.45)] animate-in zoom-in-95 duration-200 text-[#35392C]"
          >
            {/* Top Close Button */}
            <button
              type="button"
              onClick={() => setSelectedPrompt(null)}
              className="absolute top-5 right-5 size-8 sm:size-9 rounded-full bg-[#E8ECD8] hover:bg-[#691C35] text-[#691C35] hover:text-[#F8F2E7] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close popup"
            >
              <X className="size-4 sm:size-5" />
            </button>

            {/* Prompt Tag & Icon */}
            <div className="flex items-center gap-2 mb-4">
              <span className="size-2 rounded-full bg-[#C6A568]" />
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#5F7045] font-bold">
                {selectedPrompt.tag}
              </span>
            </div>

            {/* Prompt Heading */}
            <h3 className="font-display text-2xl sm:text-3xl md:text-4xl text-[#691C35] tracking-tight leading-snug mb-5">
              "{selectedPrompt.text}"
            </h3>

            {/* Conversational Insight */}
            <div className="rounded-2xl bg-[#E8ECD8]/70 border border-[#C6A568]/35 p-4 sm:p-5 mb-6">
              <p className="text-xs font-mono uppercase tracking-wider text-[#691C35] font-semibold mb-1 flex items-center gap-1.5">
                <Quote className="size-3" /> Why this works at dinner
              </p>
              <p className="text-sm sm:text-base text-[#35392C]/85 leading-relaxed font-sans">
                {selectedPrompt.insight}
              </p>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-[#C6A568]/35">
              <span className="text-xs font-mono text-[#5F7045]">
                Delhi NCR · Table Prompt
              </span>
              <button
                type="button"
                onClick={() => setSelectedPrompt(null)}
                className="rounded-full bg-[#691C35] hover:bg-[#5F7045] text-[#F8F2E7] px-5 py-2 text-xs sm:text-sm font-semibold tracking-tight transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scrollLeft {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-33.333%, 0, 0);
          }
        }
        @keyframes scrollRight {
          0% {
            transform: translate3d(-33.333%, 0, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }
      `}</style>
    </section>
  );
}
