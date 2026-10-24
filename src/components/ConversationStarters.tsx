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
    colorClass: "bg-[#EBF1E5] text-[#3B542E] border-[#DCE6D2] hover:bg-[#DEE8D4]",
    insight: "The eternal ritual debate. Unlocks morning routines, favorite neighborhood nooks, and quiet comfort habits.",
  },
  {
    text: "Favourite Delhi winter thing?",
    category: "delhi",
    tag: "Dilli Ki Sardi",
    colorClass: "bg-[#F7E7EC] text-[#691C35] border-[#EED0DA] hover:bg-[#F2D7E0]",
    insight: "From afternoon picnics under Lodhi Garden arches to steaming hot daulat ki chaat in the narrow lanes of Dariba Kalan.",
  },
  {
    text: "Best chaat in the city?",
    category: "delhi",
    tag: "Culinary Loyalties",
    colorClass: "bg-[#FAF0DE] text-[#7A5422] border-[#F2DEBA] hover:bg-[#F4E6C9]",
    insight: "Sparks fierce, passionate loyalties across Bengali Market, UPSC lane, and Chandni Chowk street stalls.",
  },
  {
    text: "Mountains or the sea?",
    category: "lifestyle",
    tag: "Escape Route",
    colorClass: "bg-[#E8F0E4] text-[#35512B] border-[#D7E5D1] hover:bg-[#DAE7D3]",
    insight: "Reveals how you recharge—whether you crave cool solitude and pine mist or rhythmic open waves and horizon.",
  },
  {
    text: "Last trip you loved?",
    category: "soul",
    tag: "Wanderlust",
    colorClass: "bg-[#F9E9EF] text-[#691C35] border-[#EED4DF] hover:bg-[#F3D7E3]",
    insight: "Takes people away from their everyday resume into memories of discovery, wanderlust, and unplanned journeys.",
  },
  {
    text: "What makes someone memorable to you?",
    category: "soul",
    tag: "Human Resonance",
    colorClass: "bg-[#F3ECE4] text-[#4B3F35] border-[#E7DDD1] hover:bg-[#EAE0D3]",
    insight: "Cuts through surface banter and illuminates what you genuinely value in real human connection.",
  },
];

const rowTwoPrompts: PromptItem[] = [
  {
    text: "Your go-to Sunday plan?",
    category: "lifestyle",
    tag: "The Slow Cadence",
    colorClass: "bg-[#FAF0DE] text-[#7A5422] border-[#F2DEBA] hover:bg-[#F4E6C9]",
    insight: "Sourdough bakes, long dog walks through Jahanpanah forest, or unhurried books with the phone turned off.",
  },
  {
    text: "What did you want to be at ten?",
    category: "soul",
    tag: "Childhood Spark",
    colorClass: "bg-[#F7E7EC] text-[#691C35] border-[#EED0DA] hover:bg-[#F2D7E0]",
    insight: "Astronaut, palaeontologist, or train conductor—brings out the purest childhood spark and unscripted wonder.",
  },
  {
    text: "A book you keep recommending?",
    category: "soul",
    tag: "Quiet Influences",
    colorClass: "bg-[#FAF0DE] text-[#7A5422] border-[#F2DEBA] hover:bg-[#F4E6C9]",
    insight: "The stories that quietly shaped our worldviews and the pages we still fold corners and write notes on.",
  },
  {
    text: "Filter coffee in Lodhi or cutting chai at CP?",
    category: "delhi",
    tag: "Delhi Debates",
    colorClass: "bg-[#E8F0E4] text-[#35512B] border-[#D7E5D1] hover:bg-[#DAE7D3]",
    insight: "Two sacred Delhi cadences. A classic question that immediately gets everyone at the table smiling.",
  },
  {
    text: "The song you secretly never skip?",
    category: "playful",
    tag: "Private Soundtracks",
    colorClass: "bg-[#F9E9EF] text-[#691C35] border-[#EED4DF] hover:bg-[#F3D7E3]",
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
  const row3 = [...rowThreePrompts, ...rowThreePrompts, ...rowThreePrompts];

  return (
    <section className="relative w-full bg-[#FAF7F2] py-24 sm:py-32 overflow-hidden border-t border-black/5">
      {/* Editorial Header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center mb-14 sm:mb-20">
        <p className="text-xs sm:text-[13px] font-mono font-bold tracking-[0.25em] uppercase text-[#5F7045] mb-3">
          BIG CONVERSATIONS
        </p>

        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-[#171514] tracking-tight leading-[1.08] mb-5">
          Leave the resumes outside. <br className="hidden sm:inline" />
          <em className="text-[#691C35] font-serif not-italic">Start somewhere honest.</em>
        </h2>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#171514]/70 leading-relaxed font-sans">
          Every Precious Meets table comes with handcrafted conversation spark cards. No elevator
          pitches, no awkward pauses—just real questions that make room for laughter, unexpected stories,
          and genuine connection.
        </p>
      </div>

      {/* Infinite Horizontal Conveyor Belts (Slightly Bigger Pills) */}
      <div className="relative w-full space-y-4 sm:space-y-5">
        {/* Soft Edge Fade Gradient Masks */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 sm:w-40 md:w-56 bg-gradient-to-r from-[#FAF7F2] via-[#FAF7F2]/85 to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 sm:w-40 md:w-56 bg-gradient-to-l from-[#FAF7F2] via-[#FAF7F2]/85 to-transparent z-10" />

        {/* Row 1: Drifts Left */}
        <div className="flex w-max items-center animate-[scrollLeft_55s_linear_infinite] hover:[animation-play-state:paused] will-change-transform">
          {row1.map((item, idx) => (
            <button
              type="button"
              key={`row1-${item.text}-${idx}`}
              onClick={() => setSelectedPrompt(item)}
              className={`inline-flex items-center mx-2.5 sm:mx-3 px-5 sm:px-7 py-3.5 sm:py-4 rounded-full border text-sm sm:text-base md:text-[17px] font-semibold tracking-tight shadow-xs transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 cursor-pointer whitespace-nowrap ${item.colorClass}`}
            >
              <span>{item.text}</span>
            </button>
          ))}
        </div>

        {/* Row 2: Drifts Right */}
        <div className="flex w-max items-center animate-[scrollRight_50s_linear_infinite] hover:[animation-play-state:paused] will-change-transform">
          {row2.map((item, idx) => (
            <button
              type="button"
              key={`row2-${item.text}-${idx}`}
              onClick={() => setSelectedPrompt(item)}
              className={`inline-flex items-center mx-2.5 sm:mx-3 px-5 sm:px-7 py-3.5 sm:py-4 rounded-full border text-sm sm:text-base md:text-[17px] font-semibold tracking-tight shadow-xs transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 cursor-pointer whitespace-nowrap ${item.colorClass}`}
            >
              <span>{item.text}</span>
            </button>
          ))}
        </div>

        {/* Row 3: Drifts Left */}
        <div className="flex w-max items-center animate-[scrollLeft_60s_linear_infinite] hover:[animation-play-state:paused] will-change-transform">
          {row3.map((item, idx) => (
            <button
              type="button"
              key={`row3-${item.text}-${idx}`}
              onClick={() => setSelectedPrompt(item)}
              className={`inline-flex items-center mx-2.5 sm:mx-3 px-5 sm:px-7 py-3.5 sm:py-4 rounded-full border text-sm sm:text-base md:text-[17px] font-semibold tracking-tight shadow-xs transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 cursor-pointer whitespace-nowrap ${item.colorClass}`}
            >
              <span>{item.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Subtle Hint */}
      <div className="mt-12 sm:mt-14 text-center px-4">
        <p className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono text-[#171514]/50 tracking-wider">
          <span className="size-1.5 rounded-full bg-[#5F7045] animate-ping" />
          Click any card to open the table prompt
        </p>
      </div>

      {/* MODAL POPUP DIALOG */}
      {selectedPrompt && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedPrompt(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-3xl bg-[#FFFDF9] border border-black/10 p-7 sm:p-9 md:p-10 shadow-[0_25px_60px_-15px_rgba(23,21,20,0.35)] animate-in zoom-in-95 duration-200 text-[#171514]"
          >
            {/* Top Close Button */}
            <button
              type="button"
              onClick={() => setSelectedPrompt(null)}
              className="absolute top-5 right-5 size-8 sm:size-9 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-[#171514]/60 hover:text-[#171514] transition-colors cursor-pointer"
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
            <h3 className="font-display text-2xl sm:text-3xl md:text-4xl text-[#171514] tracking-tight leading-snug mb-5">
              "{selectedPrompt.text}"
            </h3>

            {/* Conversational Insight */}
            <div className="rounded-2xl bg-[#FAF7F2] border border-black/6 p-4 sm:p-5 mb-6">
              <p className="text-xs font-mono uppercase tracking-wider text-[#691C35] font-semibold mb-1 flex items-center gap-1.5">
                <Quote className="size-3" /> Why this works at dinner
              </p>
              <p className="text-sm sm:text-base text-[#171514]/75 leading-relaxed font-sans">
                {selectedPrompt.insight}
              </p>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-black/8">
              <span className="text-xs font-mono text-[#171514]/40">
                Delhi NCR · Table Prompt
              </span>
              <button
                type="button"
                onClick={() => setSelectedPrompt(null)}
                className="rounded-full bg-[#691C35] hover:bg-[#691C35]/90 text-white px-5 py-2 text-xs sm:text-sm font-semibold tracking-tight transition-all hover:scale-105 active:scale-95 cursor-pointer"
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
