import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface FloatingGreeting {
  id: string;
  word: string;
  side: "left" | "right";
  desktop: { top: string; offset: string; rotate: number; size: string };
  mobile: { top: string; offset: string; rotate: number; size: string };
  tone: "burgundy" | "ink" | "forest" | "ochre";
}

// Ordered in visual pairs from top to bottom so they spawn sequentially as you scroll
const floatingGreetings: FloatingGreeting[] = [
  // Pair 1: Top
  {
    id: "hi",
    word: "Hi",
    side: "left",
    desktop: { top: "14%", offset: "8%", rotate: -3, size: "text-5xl lg:text-6xl" },
    mobile: { top: "12%", offset: "5%", rotate: -3, size: "text-3xl" },
    tone: "ochre",
  },
  {
    id: "namaste",
    word: "Namaste",
    side: "right",
    desktop: { top: "14%", offset: "8%", rotate: 2, size: "text-5xl lg:text-7xl" },
    mobile: { top: "12%", offset: "5%", rotate: 2, size: "text-3xl" },
    tone: "burgundy",
  },

  // Pair 2: Upper Mid
  {
    id: "adaab",
    word: "Adaab",
    side: "left",
    desktop: { top: "32%", offset: "6%", rotate: 3, size: "text-5xl lg:text-7xl" },
    mobile: { top: "29%", offset: "5%", rotate: 3, size: "text-3xl" },
    tone: "forest",
  },
  {
    id: "hello",
    word: "Hello",
    side: "right",
    desktop: { top: "32%", offset: "8%", rotate: -2, size: "text-5xl lg:text-6xl" },
    mobile: { top: "29%", offset: "5%", rotate: -2, size: "text-3xl" },
    tone: "ink",
  },

  // Pair 3: Mid
  {
    id: "sat-sri-akal",
    word: "Sat Sri Akal",
    side: "left",
    desktop: { top: "50%", offset: "6%", rotate: -2, size: "text-3xl lg:text-5xl" },
    mobile: { top: "47%", offset: "5%", rotate: -2, size: "text-2xl" },
    tone: "burgundy",
  },
  {
    id: "khamma-ghani",
    word: "Khamma Ghani",
    side: "right",
    desktop: { top: "50%", offset: "6%", rotate: 3, size: "text-3xl lg:text-5xl" },
    mobile: { top: "47%", offset: "5%", rotate: 2, size: "text-2xl" },
    tone: "ochre",
  },

  // Pair 4: Lower Mid
  {
    id: "vanakkam",
    word: "Vanakkam",
    side: "left",
    desktop: { top: "68%", offset: "8%", rotate: 2, size: "text-4xl lg:text-5xl" },
    mobile: { top: "65%", offset: "5%", rotate: 2, size: "text-2xl" },
    tone: "forest",
  },
  {
    id: "bonjour",
    word: "Bonjour",
    side: "right",
    desktop: { top: "68%", offset: "8%", rotate: -3, size: "text-4xl lg:text-5xl" },
    mobile: { top: "65%", offset: "5%", rotate: -3, size: "text-2xl" },
    tone: "burgundy",
  },

  // Pair 5: Bottom
  {
    id: "nomoshkar",
    word: "Nomoshkar",
    side: "left",
    desktop: { top: "84%", offset: "8%", rotate: -2, size: "text-3xl lg:text-4xl" },
    mobile: { top: "82%", offset: "5%", rotate: -2, size: "text-xl" },
    tone: "ink",
  },
  {
    id: "ciao",
    word: "Ciao",
    side: "right",
    desktop: { top: "84%", offset: "8%", rotate: 2, size: "text-3xl lg:text-5xl" },
    mobile: { top: "82%", offset: "5%", rotate: 2, size: "text-2xl" },
    tone: "ochre",
  },
];

const toneClasses: Record<string, { main: string }> = {
  burgundy: { main: "text-[#691C35]" },
  forest: { main: "text-[#5F7045]" },
  ochre: { main: "text-[#B8860B]" },
  ink: { main: "text-[#171514]" },
};

export function DoorGreetings() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const words = section.querySelectorAll<HTMLElement>("[data-random-word]");
    const centerInfo = section.querySelector<HTMLElement>("[data-center-info]");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      gsap.set(words, { opacity: 1, scale: 1, y: 0, filter: "none" });
      if (centerInfo) gsap.set(centerInfo, { opacity: 1, y: 0 });
      return;
    }

    // Initial state: hidden, scaled down with subtle blur
    gsap.set(words, {
      opacity: 0,
      scale: 0.65,
      y: 35,
      filter: "blur(6px)",
    });

    if (centerInfo) {
      gsap.set(centerInfo, { opacity: 0, scale: 0.96, y: 20 });
    }

    // Scroll-scrub timeline: spawns as you scroll down, vanishes as you scroll back!
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.7,
      },
    });

    // 1. Center title appears first as you scroll into the section
    if (centerInfo) {
      tl.to(centerInfo, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.35,
        ease: "power2.out",
      });
    }

    // 2. Greetings spawn sequentially down the left and right flanks
    tl.to(
      words,
      {
        opacity: 1,
        scale: 1,
        y: 0,
        filter: "blur(0px)",
        stagger: 0.1,
        duration: 0.9,
        ease: "power2.out",
      },
      "-=0.1",
    );

    // Subtle breathing hold at full reveal
    tl.to({}, { duration: 0.25 });

    const onResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);

    return () => {
      tl.kill();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[230vh] bg-[#FAF7F2] text-ink select-none"
    >
      {/* Sticky Fullscreen Stage */}
      <div className="sticky top-0 flex h-screen w-full flex-col justify-between overflow-hidden py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
        {/* Ambient Lighting Atmosphere */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="w-[75vw] h-[75vw] max-w-[850px] max-h-[850px] rounded-full bg-[#C6A568]/[0.08] blur-[150px]" />
          <div className="w-[50vw] h-[50vw] max-w-[550px] max-h-[550px] rounded-full bg-[#691C35]/[0.05] blur-[140px]" />
        </div>

        {/* Subtle Classical Arch Line in Background */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-30">
          <svg viewBox="0 0 1000 800" className="w-full h-full stroke-ink/[0.07] fill-none">
            <circle cx="500" cy="400" r="320" strokeDasharray="3 6" strokeWidth="1" />
            <circle cx="500" cy="400" r="190" strokeWidth="0.8" />
          </svg>
        </div>

        {/* Top Spacer */}
        <div className="relative z-10 w-full" />

        {/* Floating Canvas: Balanced Left & Right Flanks */}
        <div className="relative z-10 w-full h-[75vh] sm:h-[82vh] max-w-7xl mx-auto px-4">
          {/* CENTER ANCHOR: Pure Editorial Whisper (Clear of all text) */}
          <div
            data-center-info
            className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-6 z-0"
          >
            <div className="max-w-md mx-auto flex flex-col items-center">
              <span className="inline-block px-3.5 py-1 rounded-full bg-burgundy/[0.06] border border-burgundy/15 text-burgundy text-[11px] sm:text-xs font-mono tracking-[0.24em] uppercase mb-3">
                At The Door
              </span>
              <h3 className="font-display text-3xl sm:text-4xl md:text-5xl text-ink tracking-tight leading-[1.1]">
                Welcomed in <em className="italic font-serif text-burgundy">every tongue.</em>
              </h3>
            </div>
          </div>

          {/* SCATTERED GREETINGS TEXT (Balanced Left and Right flanking columns) */}
          {floatingGreetings.map((item) => {
            const t = toneClasses[item.tone];
            const isLeft = item.side === "left";

            return (
              <div
                key={item.id}
                data-random-word
                style={
                  {
                    "--top-d": item.desktop.top,
                    "--top-m": item.mobile.top,
                    "--offset-d": item.desktop.offset,
                    "--offset-m": item.mobile.offset,
                    "--rot": `${item.desktop.rotate}deg`,
                    top: "var(--top-m)",
                    ...(isLeft
                      ? { left: "var(--offset-m)" }
                      : { right: "var(--offset-m)" }),
                    transform: "rotate(var(--rot))",
                  } as React.CSSProperties
                }
                className={`absolute z-20 pointer-events-none select-none sm:[top:var(--top-d)] ${
                  isLeft
                    ? "sm:[left:var(--offset-d)] text-left"
                    : "sm:[right:var(--offset-d)] text-right"
                }`}
              >
                <span
                  className={`font-display font-normal ${item.desktop.size} ${t.main} tracking-tight drop-shadow-xs whitespace-nowrap`}
                >
                  {item.word}
                </span>
              </div>
            );
          })}
        </div>

        {/* Bottom Footnote */}
        <div className="relative z-10 w-full text-center px-4 pt-4 border-t border-ink/[0.06]">
          <p className="font-mono text-[11px] sm:text-xs text-ink/40 tracking-[0.2em] uppercase">
            Aadhaar Verified Guests · No Resumes · Just Warmth
          </p>
        </div>
      </div>
    </section>
  );
}
