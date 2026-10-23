import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { CtaButton } from "@/components/CtaButton";
import { Preloader } from "@/components/Preloader";
import { SosModal } from "@/components/SosModal";
import { ShieldAlert, ShieldCheck, Sparkles, BookOpen, Utensils, User, ArrowRight, X } from "lucide-react";
import tableLaugh from "@/assets/table-laugh.jpg";
import hands from "@/assets/hands.jpg";
import conversation from "@/assets/conversation.jpg";
import dusk from "@/assets/dusk.jpg";
import tableStill from "@/assets/table-still.jpg";
import tableBurgundy from "@/assets/table-burgundy.jpg";
import footerBg from "@/assets/footer-bg.jpg";
import { ConcaveCarousel } from "@/components/ConcaveCarousel";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Precious Meets — Every meet matters | Safe Curated Tables in Delhi NCR" },
      { name: "description", content: "Curated real-world meetups, shared meals and meaningful conversations. 100% Offline Aadhaar verified with women-first safety in Delhi NCR." },
      { property: "og:title", content: "Precious Meets — Every meet matters" },
      { property: "og:description", content: "Share a table, discover unexpected perspectives, and make room for connections that matter." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const menuItems = [
  { label: "Take the Quiz", href: "/quiz", highlight: true, icon: <Sparkles className="size-4 text-ochre" /> },
  { label: "The Philosophy & Safety", href: "/philosophy", badge: "Women-First", icon: <ShieldCheck className="size-4 text-forest" /> },
  { label: "How It Works", href: "/how-it-works", icon: <BookOpen className="size-4 text-foreground/70" /> },
  { label: "Upcoming Meets", href: "/experiences", icon: <Utensils className="size-4 text-foreground/70" /> },
  { label: "24/7 Safety & SOS", href: "/safety", icon: <ShieldAlert className="size-4 text-red-600" /> },
  { label: "Member Sign In", href: "/login", icon: <User className="size-4 text-foreground/70" /> },
];

// Curated gatherings across cities (Delhi NCR & Bengaluru focus; Mumbai removed)
const meets = [
  { name: "The Sunder Nursery Supper", when: "Thursdays · 8 PM", where: "Mehrauli, Delhi NCR", img: tableLaugh, desc: "Six strangers, four courses, one candlelit table in a secluded heritage enclave." },
  { name: "Slow Coffee Sundays", when: "Sundays · 10 AM", where: "Indiranagar, Bengaluru", img: conversation, desc: "Unhurried conversations over a single pour." },
  { name: "After-Dark Walk & Wine", when: "Saturdays · 7 PM", where: "Hauz Khas, Delhi NCR", img: dusk, desc: "A twilight heritage walk, a private wine room, a few new friends." },
];

// React Bits Pro Concave Carousel 3D Testimonials
const testimonials = [
  {
    quote: "I went alone not knowing a soul, and left with three people I now meet every Sunday morning for coffee. Precious Meets is pure warmth.",
    author: "Aarav Mehta",
    role: "Architect",
    city: "Bengaluru",
    rating: 5,
  },
  {
    quote: "No forced icebreakers or networking pitches. Just six thoughtful strangers, candlelit sourdough, and conversations that lingered past midnight.",
    author: "Meera Sengupta",
    role: "Author & Journalist",
    city: "Delhi NCR",
    rating: 5,
  },
  {
    quote: "In a city of millions where everyone is busy and guarded, this was the first evening in years that felt slow, honest, and truly nourishing.",
    author: "Rohan Varma",
    role: "Product Designer",
    city: "Mumbai",
    rating: 5,
  },
  {
    quote: "The chemistry at our table was surreal. It felt like an intimate dinner party hosted by old friends who somehow found each other across the city.",
    author: "Ananya Joshi",
    role: "Art Curator",
    city: "Delhi NCR",
    rating: 5,
  },
  {
    quote: "Safe, Aadhaar-vetted, and exquisitely hosted. Every seat at that table was held with genuine intention and care. I cannot recommend it enough.",
    author: "Tara D'Souza",
    role: "Creative Director",
    city: "Mumbai",
    rating: 5,
  },
  {
    quote: "It completely redefined weekends for me. You arrive as hesitant strangers and leave having laughed so hard your ribs ache. Unforgettable.",
    author: "Kabir Nambiar",
    role: "Filmmaker",
    city: "Bengaluru",
    rating: 5,
  },
  {
    quote: "The screening and table curation is quietly genius. Everyone had distinct stories, yet our values and curiosities harmonized effortlessly.",
    author: "Dr. Rhea Sen",
    role: "Neuroscientist",
    city: "Delhi NCR",
    rating: 5,
  },
  {
    quote: "One shared meal, six entirely different lives, zero digital distractions. I haven’t felt this present in a dinner conversation since college.",
    author: "Devika Rao",
    role: "Botanist",
    city: "Bengaluru",
    rating: 5,
  },
];

function Nav() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, []);

  return (
    <header data-nav className="fixed inset-x-0 top-4 z-50 flex justify-center px-4 pointer-events-none">
      <div ref={menuRef} className="relative w-full max-w-4xl">
        <nav
          data-nav-bar
          style={{
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.72) 0%, rgba(255, 255, 255, 0.48) 100%)",
            backdropFilter: "blur(28px) saturate(190%) contrast(95%)",
            WebkitBackdropFilter: "blur(28px) saturate(190%) contrast(95%)",
          }}
          className="pointer-events-auto flex w-full items-center justify-between rounded-full border border-white/70 py-2 pl-3.5 sm:pl-5 pr-2 text-[#171514] shadow-[0_16px_40px_-10px_rgba(23,21,20,0.12),_0_4px_12px_-2px_rgba(23,21,20,0.04),_inset_0_1px_2px_0_rgba(255,255,255,0.95),_inset_0_-1px_1px_0_rgba(255,255,255,0.3)] transition-all duration-300"
        >
          {/* Left: Brand Monogram + Logo */}
          <div className="flex items-center gap-3">
            <a href="#top" className="flex items-center gap-2.5 group">
              <span className="grid size-8 place-items-center rounded-full bg-white/75 border border-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,1)] text-[#691C35] transition-transform duration-300 group-hover:scale-105">
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="8" stroke="#691C35" strokeWidth="2" />
                  <circle cx="12" cy="12" r="3" fill="#C6A568" />
                </svg>
              </span>
              <span className="font-display text-xl sm:text-2xl text-[#171514] tracking-tight">
                Precious<em className="text-[#691C35] not-italic font-serif"> meets</em>
              </span>
            </a>

          </div>

          {/* Right Controls: Ambient City Pill + CTA Button + Dropdown Toggle */}
          <div className="flex items-center gap-2">
            {/* Ambient City Pill */}
            <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-white/60 px-3 py-1.5 text-[11px] font-mono tracking-wider text-[#171514]/75 border border-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)]">
              <span className="size-1.5 rounded-full bg-[#5F7045] animate-pulse" />
              <span>Delhi NCR</span>
            </div>

            {/* Solid Pill CTA Button -> routes to /quiz */}
            <a
              href="/quiz"
              className="rounded-full bg-white text-[#171514] border border-white/80 px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold tracking-tight shadow-[0_2px_8px_rgba(0,0,0,0.06),_inset_0_1px_1px_rgba(255,255,255,1)] transition-all duration-300 hover:bg-[#691C35] hover:text-white hover:scale-105 active:scale-95"
            >
              Save a seat
            </a>

            {/* Compact Dropdown Menu Toggle Button */}
            <button
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className="relative grid size-9 sm:size-10 place-items-center rounded-full bg-[#171514] text-white shadow-sm transition-all duration-300 hover:bg-[#691C35] hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span className={`absolute h-px w-3.5 sm:w-4 bg-white transition-transform duration-500 ${open ? "rotate-45" : "-translate-y-1"}`} />
              <span className={`absolute h-px w-3.5 sm:w-4 bg-white transition-transform duration-500 ${open ? "-rotate-45" : "translate-y-1"}`} />
            </button>
          </div>
        </nav>

        {/* COMPACT DROPDOWN POPUP (Replaces full-page takeover) */}
        {open && (
          <div className="pointer-events-auto absolute top-full right-0 mt-2.5 w-72 sm:w-80 overflow-hidden rounded-2xl border border-white/80 bg-white/95 p-2.5 text-[#171514] shadow-[0_20px_50px_rgba(0,0,0,0.18)] backdrop-blur-2xl animate-in fade-in slide-in-from-top-3 duration-200">
            <div className="px-3 py-2 border-b border-[#171514]/10 mb-1 flex items-center justify-between">
              <span className="label-mono text-[10px] uppercase font-bold text-muted-foreground">
                Navigation
              </span>
              <span className="text-[10px] text-forest font-semibold flex items-center gap-1">
                <ShieldCheck className="size-3" /> 100% Aadhaar Verified
              </span>
            </div>

            <div className="space-y-1">
              {menuItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                    item.highlight
                      ? "bg-burgundy text-ivory hover:bg-burgundy/90 shadow-xs"
                      : "text-foreground hover:bg-sage/40"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-forest/15 text-forest">
                      {item.badge}
                    </span>
                  )}
                  {item.highlight && <ArrowRight className="size-3.5" />}
                </a>
              ))}
            </div>

            <div className="mt-2 border-t border-[#171514]/10 pt-2 px-3 text-[11px] text-muted-foreground flex items-center justify-between">
              <span>Delhi NCR · Active Circles</span>
              <span className="font-mono text-[10px] text-forest">Verified Tables</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

const heroPillImages = [
  { src: tableBurgundy, alt: "Curated long dinner table set with wine and burgundy floral arrangements" },
  { src: tableLaugh, alt: "Friends laughing together around a dinner table" },
  { src: hands, alt: "Hands passing a shared plate across a candlelit table" },
  { src: tableStill, alt: "Curated dinner table set with wine and calla lily" },
  { src: conversation, alt: "Two people smiling over a conversation" },
  { src: dusk, alt: "New friends sharing drinks at dusk" },
];

function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const expandFrameRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const isScrollingRef = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isScrollingRef.current) {
        setActiveIdx((prev) => (prev + 1) % heroPillImages.length);
      }
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    const anchor = anchorRef.current;
    const frame = expandFrameRef.current;
    if (!section || !sticky || !anchor || !frame) return;

    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const syncBounds = () => {
      const line = anchor.closest<HTMLElement>("[data-hero=line]");
      let transformY = 0;
      if (line) {
        const curY = (gsap.getProperty(line, "y") as number) || 0;
        const curYPercent = (gsap.getProperty(line, "yPercent") as number) || 0;
        transformY = curY + (line.offsetHeight * curYPercent) / 100;
      }
      const a = anchor.getBoundingClientRect();
      const s = sticky.getBoundingClientRect();
      return {
        top: a.top - transformY - s.top,
        left: a.left - s.left,
        width: a.width > 0 ? a.width : 140,
        height: a.height > 0 ? a.height : 60,
      };
    };

    const initial = syncBounds();
    gsap.set(frame, {
      top: initial.top,
      left: initial.left,
      width: initial.width,
      height: initial.height,
      borderRadius: "999px",
    });

    if (reduce) return;

    const tl = gsap.timeline({
      paused: true,
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.8,
        onUpdate: (self) => {
          isScrollingRef.current = self.progress > 0.05;
        },
      },
    });

    tl.to("[data-hero-content]", {
      opacity: 0,
      y: -40,
      scale: 0.96,
      ease: "power2.in",
      duration: 0.35,
    }, 0)
      .to(frame, {
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: "0px",
        ease: "power2.inOut",
        duration: 1,
      }, 0)
      .fromTo("[data-expand-img]", { scale: 1.2 }, { scale: 1, ease: "power2.inOut", duration: 1 }, 0)
      .fromTo(
        "[data-expand-overlay]",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" },
        0.55,
      );

    const onResize = () => {
      ScrollTrigger.refresh();
      if (ScrollTrigger.isInViewport(section)) {
        const b = syncBounds();
        if (tl.progress() === 0) {
          gsap.set(frame, {
            top: b.top,
            left: b.left,
            width: b.width,
            height: b.height,
          });
        }
      }
    };

    window.addEventListener("resize", onResize);
    document.fonts?.ready?.then(onResize);

    return () => {
      tl.kill();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section ref={sectionRef} id="top" className="relative h-[260vh] bg-ivory">
      <div ref={stickyRef} className="sticky top-0 flex h-screen w-full flex-col justify-end overflow-hidden px-[4vw] pb-16 pt-32">
        {/* The expanding capsule frame: starts at anchor in headline, expands to full screen on scroll */}
        <div
          ref={expandFrameRef}
          data-hero="pill"
          className="absolute z-20 overflow-hidden border border-ink/10 shadow-sm"
          style={{ borderRadius: 999 }}
        >
          {heroPillImages.map((img, i) => (
            <img
              key={img.src}
              data-expand-img
              src={img.src}
              alt={img.alt}
              className={`absolute inset-0 size-full object-cover transition-opacity duration-1000 ease-in-out ${i === activeIdx ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
            />
          ))}

          {/* Fullscreen expanded overlay */}
          <div
            data-expand-overlay
            className="absolute inset-0 flex flex-col justify-end p-[6vw] text-ivory opacity-0 pointer-events-none bg-gradient-to-t from-ink/90 via-ink/35 to-transparent"
          >
            <div className="max-w-3xl">
              <p className="label-mono mb-4 text-ochre">The Precious Meets promise</p>
              <h2 className="font-display text-5xl leading-[0.95] sm:text-6xl md:text-8xl">
                Every meet <em className="text-ochre">matters.</em>
              </h2>
              <p className="mt-6 max-w-lg text-sm sm:text-base leading-relaxed opacity-85">
                A table laid with care, a seat held for you, and an evening that might change who you know.
              </p>
            </div>
          </div>
        </div>

        {/* Hero headline & copy layer */}
        <div data-hero-content className="relative z-10 flex w-full flex-col justify-end">
          <h1 className="font-display text-[13vw] sm:text-[10.5vw] md:text-[8vw] lg:text-[7.5vw] leading-[0.92] tracking-tight">
            {/* Line 1: Six [pill] strangers. */}
            <div className="line-mask overflow-visible pt-10 -mt-10">
              <div data-hero="line" className="flex items-center flex-wrap gap-x-[1.2vw]">
                <span>Six</span>
                <div className="relative inline-flex items-center">
                  {/* Handwritten style doodle arrow + annotation above pill */}
                  <div
                    data-hero="annotation"
                    className="absolute -top-9 sm:-top-11 left-1/2 -translate-x-1/2 flex items-center gap-1.5 whitespace-nowrap pointer-events-none select-none z-30"
                  >
                    <span className="label-mono text-[10px] md:text-xs tracking-wider uppercase font-semibold text-ochre">
                      You + five others
                    </span>
                    <svg
                      className="w-5 h-5 text-ochre -rotate-12 translate-y-1"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#C6A568"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M 4 5 C 9 5, 14 9, 16 16" />
                      <path d="M 11 14 l 5 3 3 -4" />
                    </svg>
                  </div>

                  {/* Anchor that reserves the exact space for the capsule in the text flow */}
                  <span
                    ref={anchorRef}
                    className="inline-block h-[0.72em] w-[2.2em] md:h-[0.78em] md:w-[2.4em] mx-[0.18em] -translate-y-[0.06em] align-middle opacity-0 pointer-events-none"
                  />
                </div>
                <span>strangers.</span>
              </div>
            </div>

            {/* Line 2: One table. */}
            <div className="line-mask">
              <div data-hero="line" className="block">
                One table.
              </div>
            </div>

            {/* Line 3: Every meet matters. with animated doodle underline */}
            <div className="relative inline-block w-fit">
              <div className="line-mask">
                <div data-hero="line" className="block">
                  <span>Every meet </span>
                  <span className="italic text-burgundy">matters.</span>
                </div>
              </div>
              {/* Animated Brand Deep Burgundy Underline */}
              <svg
                className="absolute -bottom-2 md:-bottom-4 left-0 w-[104%] -left-[2%] h-4 md:h-7 overflow-visible pointer-events-none"
                viewBox="0 0 640 32"
                fill="none"
              >
                <path
                  data-hero="underline-path"
                  d="M 6 22 C 140 10, 280 26, 440 14 C 520 8, 590 18, 634 12"
                  stroke="#691C35"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </h1>

          <div className="mt-12 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <div data-hero="copy" className="max-w-md">
              <p className="text-base sm:text-lg leading-relaxed text-muted-foreground">
                Take a short quiz. Every week, we curate a table of five people worth meeting in your city.
              </p>
            </div>
            <div data-hero="cta"><CtaButton href="/quiz" tone="burgundy">Discover your next meet</CtaButton></div>
          </div>
        </div>
      </div>
    </section>
  );
}



const statementStaticLines = [
  "Life gets busy.",
  "Circles get smaller.",
  "There is always room at the table.",
];

const statementRotatingLines = [
  "Every meet counts.",
  "Every meet matters.",
  "Every stranger is a story.",
  "Every seat has a story.",
  "Every dinner leaves a mark.",
  "Every connection is precious.",
];

function Statement() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % statementRotatingLines.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-[4vw] py-32 text-center overflow-hidden">
      <h2 className="font-display text-[9vw] leading-[0.98] md:text-[6vw]">
        {/* Line 1: Life gets busy. (Pure typography, zero doodles) */}
        <span className="line-mask overflow-visible">
          <span data-reveal className="relative inline-block">
            <span>Life gets busy.</span>
          </span>
        </span>

        {/* Line 2: Circles get smaller. (Pure typography, zero doodles) */}
        <span className="line-mask overflow-visible">
          <span data-reveal className="relative inline-block">
            <span>Circles get smaller.</span>
          </span>
        </span>

        {/* Line 3: There is always room at the table. (Pure typography, zero doodles) */}
        <span className="line-mask overflow-visible">
          <span data-reveal className="relative inline-block">
            <span>There is always room at the table.</span>
          </span>
        </span>

        {/* Line 4: Automatically rotating line with smooth typography transition */}
        <span className="line-mask overflow-visible pt-1">
          <span data-reveal className="relative inline-block">
            <span className="relative inline-flex items-center justify-center overflow-hidden h-[1.15em] align-baseline px-2">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={activeIdx}
                  initial={{ y: "115%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "-115%", opacity: 0 }}
                  transition={{
                    duration: 0.65,
                    ease: [0.19, 1, 0.22, 1],
                  }}
                  className="inline-block italic text-burgundy font-serif whitespace-nowrap"
                >
                  {statementRotatingLines[activeIdx]}
                </motion.span>
              </AnimatePresence>
            </span>
          </span>
        </span>
      </h2>

      {/* Clean CTA Button */}
      <div className="relative mt-16 flex flex-col items-center">
        <CtaButton tone="burgundy" href="/quiz">Find your table</CtaButton>
      </div>
    </section>
  );
}

const tableSeats = [
  { id: 0, deg: -90, isYou: true, plateX: 300, plateY: 205, chairX: 300, chairY: 98 },
  { id: 1, deg: -30, isYou: false, plateX: 382.3, plateY: 252.5, chairX: 474.9, chairY: 199 },
  { id: 2, deg: 30, isYou: false, plateX: 382.3, plateY: 347.5, chairX: 474.9, chairY: 401 },
  { id: 3, deg: 90, isYou: false, plateX: 300, plateY: 395, chairX: 300, chairY: 502 },
  { id: 4, deg: 150, isYou: false, plateX: 217.7, plateY: 347.5, chairX: 125.1, chairY: 401 },
  { id: 5, deg: 210, isYou: false, plateX: 217.7, plateY: 252.5, chairX: 125.1, chairY: 199 },
];

function Geometry() {
  return (
    <section data-geo className="relative h-[340vh]">
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden px-[4vw]">
        <div className="grid h-full w-full max-w-6xl grid-cols-1 items-center gap-8 lg:grid-cols-2">
          {/* Left Column: Architectural Dinner Table Diagram based on reference image */}
          <div className="relative flex flex-col items-center justify-center h-[52vh] lg:h-full w-full">
            <div className="relative w-full max-w-[430px] sm:max-w-[480px] aspect-square flex items-center justify-center">
              <svg
                viewBox="0 0 600 600"
                className="w-full h-full overflow-visible"
                aria-hidden
              >
                {/* Outer Concentric Architectural Guide Rings */}
                <g data-rings>
                  <circle cx="300" cy="300" r="275" fill="none" stroke="#E6DBCC" strokeWidth="1" />
                  <circle cx="300" cy="300" r="236" fill="none" stroke="#E1D4C3" strokeWidth="0.8" strokeDasharray="3 4" />
                  <circle cx="300" cy="300" r="182" fill="none" stroke="#D7C8B4" strokeWidth="1" />
                </g>

                {/* Central Table Disc */}
                <circle
                  data-table-disc
                  cx="300"
                  cy="300"
                  r="132"
                  fill="#E6D5BF"
                  stroke="#7D674E"
                  strokeWidth="1.5"
                  style={{ filter: "drop-shadow(0 6px 16px rgba(80,60,30,0.08))" }}
                />

                {/* Center Table Inscription Quote from Reference Image */}
                <g data-table-center className="select-none pointer-events-none">
                  <text
                    x="300"
                    y="288"
                    textAnchor="middle"
                    fill="#3B281B"
                    style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontSize: "23px", letterSpacing: "0.01em" }}
                  >
                    Every friend was
                  </text>
                  <text
                    x="300"
                    y="315"
                    textAnchor="middle"
                    fill="#3B281B"
                    style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontSize: "23px", letterSpacing: "0.01em" }}
                  >
                    once a stranger.
                  </text>
                  <line
                    x1="284"
                    y1="329"
                    x2="316"
                    y2="329"
                    stroke="#691C35"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </g>

                {/* 6 Place Settings: Porcelain Dinner Plates & Cutlery (Fork + Spoon) */}
                {tableSeats.map((s) => (
                  <g
                    key={`setting-${s.id}`}
                    transform={`translate(${s.plateX}, ${s.plateY}) rotate(${s.deg + 90})`}
                  >
                    {/* Cutlery beside plate: Fork on left (-X), Spoon on right (+X) */}
                    <g data-cutlery={s.id}>
                      {/* Left: Fork (Delicate, reduced size) */}
                      <g data-cutlery-fork transform="translate(-22, 0)">
                        {/* Fork handle */}
                        <line x1="0" y1="-1" x2="0" y2="11" stroke="#7D674E" strokeWidth="0.9" strokeLinecap="round" />
                        {/* Fork shoulder curve */}
                        <path d="M -2.4 -2.8 Q 0 -0.8 2.4 -2.8" fill="none" stroke="#7D674E" strokeWidth="0.85" strokeLinecap="round" />
                        {/* 3 Fork tines */}
                        <line x1="-2.4" y1="-10" x2="-2.4" y2="-2.8" stroke="#7D674E" strokeWidth="0.75" strokeLinecap="round" />
                        <line x1="0" y1="-10" x2="0" y2="-1.2" stroke="#7D674E" strokeWidth="0.75" strokeLinecap="round" />
                        <line x1="2.4" y1="-10" x2="2.4" y2="-2.8" stroke="#7D674E" strokeWidth="0.75" strokeLinecap="round" />
                      </g>

                      {/* Right: Spoon (Delicate, reduced size) */}
                      <g data-cutlery-spoon transform="translate(22, 0)">
                        {/* Spoon handle */}
                        <line x1="0" y1="-1" x2="0" y2="11" stroke="#7D674E" strokeWidth="0.9" strokeLinecap="round" />
                        {/* Spoon bowl */}
                        <ellipse cx="0" cy="-5.5" rx="3.2" ry="5.2" fill="#FAF6EF" stroke="#7D674E" strokeWidth="0.85" />
                        {/* Inner reflection accent */}
                        <path d="M -1.4 -7.5 Q -2 -5.5 -1 -3.5" fill="none" stroke="#D2C1AC" strokeWidth="0.6" strokeLinecap="round" />
                      </g>
                    </g>

                    {/* Porcelain Dinner Plate */}
                    <g data-plate={s.id}>
                      <circle
                        cx="0"
                        cy="0"
                        r="17"
                        fill="#FFFFFF"
                        stroke="#D2C1AC"
                        strokeWidth="1.2"
                        style={{ filter: "drop-shadow(0 2px 3px rgba(60,40,20,0.08))" }}
                      />
                      <circle
                        cx="0"
                        cy="0"
                        r="11"
                        fill="#FAF6EF"
                        stroke="#DFCFC0"
                        strokeWidth="0.8"
                      />
                      <circle
                        cx="0"
                        cy="0"
                        r="7"
                        fill="#FFFFFF"
                        opacity="0.5"
                      />
                    </g>
                  </g>
                ))}

                {/* 6 Dining Chairs as per reference image */}
                {tableSeats.map((s) => (
                  <g
                    key={`chair-${s.id}`}
                    transform={`translate(${s.chairX}, ${s.chairY}) rotate(${s.deg + 90})`}
                  >
                    <g data-chair={s.id}>
                      {/* Full Chair Outline Base */}
                      <rect
                        x="-28"
                        y="-13"
                        width="56"
                        height="26"
                        rx="8"
                        fill="#FFFFFF"
                        stroke="#3E2C20"
                        strokeWidth="1.5"
                        style={{ filter: "drop-shadow(0 3px 8px rgba(62,44,32,0.1))" }}
                      />
                      {/* Burgundy Backrest: Outer half of the chair facing outward */}
                      <path
                        d="M -28 -4 L -28 -5 C -28 -9.4 -23.4 -13 -19 -13 L 19 -13 C 23.4 -13 28 -9.4 28 -5 L 28 -4 Z"
                        fill="#962838"
                        stroke="#3E2C20"
                        strokeWidth="1.5"
                      />
                      {/* Seat Cushion Divider Line */}
                      <line
                        x1="-27.5"
                        y1="-4"
                        x2="27.5"
                        y2="-4"
                        stroke="#3E2C20"
                        strokeWidth="1.2"
                      />
                      {/* Special YOU pill badge on Seat 0 */}
                      {s.isYou && (
                        <g data-you-badge transform="translate(0, -22)">
                          <rect
                            x="-16"
                            y="-8"
                            width="32"
                            height="14"
                            rx="7"
                            fill="#691C35"
                          />
                          <text
                            x="0"
                            y="2"
                            textAnchor="middle"
                            fill="#F8F2E7"
                            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "8.5px", fontWeight: "700", letterSpacing: "1px" }}
                          >
                            YOU
                          </text>
                        </g>
                      )}
                    </g>
                  </g>
                ))}
              </svg>
            </div>
            {/* Architectural caption */}
            <p data-table-caption className="mt-4 label-mono text-[11px] text-muted-foreground tracking-widest text-center">
              Six seats. One table. Pulled up for people who haven't met — yet.
            </p>
          </div>

          {/* Right Column: Storytelling Text */}
          <div className="relative flex h-[35vh] w-full items-center justify-start pl-0 lg:h-full lg:pl-10">
            {/* Frame 1 */}
            <div data-geo-text="0" className="absolute w-full">
              <h3 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[5.2vw] leading-[1.06] text-ink">
                You,<br />
                somewhere in<br />
                Delhi.
              </h3>
            </div>
            {/* Frame 2 */}
            <div data-geo-text="1" className="absolute w-full opacity-0">
              <h3 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[5.2vw] leading-[1.06] text-ink">
                Five others, just<br />
                as new here.
              </h3>
            </div>
            {/* Frame 3 */}
            <div data-geo-text="2" className="absolute w-full opacity-0">
              <h3 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[5.2vw] leading-[1.06] text-ink">
                One table. One<br />
                empty chair.<br />
                <span className="italic text-burgundy">Sunday, 7 PM.</span>
              </h3>
            </div>
          </div>
        </div>

        {/* Bottom Pinned Quiz Button in Burgundy */}
        <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
          <a
            href="#meets"
            className="group flex items-center gap-3 rounded-full bg-burgundy py-2.5 pl-6 pr-2 text-xs font-mono uppercase tracking-widest text-ivory shadow-lg transition-all hover:bg-ink hover:scale-105"
          >
            <span>Take the quiz</span>
            <span className="grid size-7 place-items-center rounded-full bg-ivory text-burgundy transition-transform group-hover:translate-x-0.5">
              <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}


function Collage() {
  return (
    <section id="stories" className="relative px-[4vw] pt-24 md:pt-32 pb-32 md:pb-40 overflow-hidden text-ivory">
      <div className="max-w-7xl mx-auto">
        {/* Header Grid */}
        <div className="grid gap-8 md:grid-cols-[1fr_1.4fr] md:items-end mb-12 md:mb-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-ivory/20 bg-ivory/10 px-3.5 py-1 text-xs font-mono uppercase tracking-widest text-ochre backdrop-blur-md mb-4">
              Our Stories
            </div>
            <h2 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] text-ivory">
              Different lives.<br /><em className="text-ochre">One shared table.</em>
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base leading-relaxed text-ivory/80 md:justify-self-end">
            Meet people with different stories, unexpected interests, and something new to bring to the conversation.
          </p>
        </div>

        {/* Bento Grid layout matching reference 2nd image */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-4 md:gap-5">
          {/* Row 1 - Left: Wide Landscape (7 cols) */}
          <div
            data-photo
            className="md:col-span-7 h-[260px] sm:h-[340px] md:h-[400px] lg:h-[450px] rounded-2xl md:rounded-3xl overflow-hidden bg-black/20 group relative shadow-md"
          >
            <img
              src={tableBurgundy}
              alt="Curated dinner table set with wine and burgundy floral arrangements"
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>

          {/* Row 1 - Right: Taller / Square-ish (5 cols) */}
          <div
            data-photo
            className="md:col-span-5 h-[260px] sm:h-[340px] md:h-[400px] lg:h-[450px] rounded-2xl md:rounded-3xl overflow-hidden bg-black/20 group relative shadow-md"
          >
            <img
              src={conversation}
              alt="Two people smiling over conversation"
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>

          {/* Row 2 - Left: 1/3 (4 cols) */}
          <div
            data-photo
            className="md:col-span-4 h-[250px] sm:h-[320px] md:h-[370px] lg:h-[410px] rounded-2xl md:rounded-3xl overflow-hidden bg-black/20 group relative shadow-md"
          >
            <img
              src={tableLaugh}
              alt="Friends laughing around a dinner table"
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>

          {/* Row 2 - Center: 1/3 (4 cols) */}
          <div
            data-photo
            className="md:col-span-4 h-[250px] sm:h-[320px] md:h-[370px] lg:h-[410px] rounded-2xl md:rounded-3xl overflow-hidden bg-black/20 group relative shadow-md"
          >
            <img
              src={hands}
              alt="Hands sharing a plate across a candlelit table"
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>

          {/* Row 2 - Right: 1/3 (4 cols) */}
          <div
            data-photo
            className="md:col-span-4 h-[250px] sm:h-[320px] md:h-[370px] lg:h-[410px] rounded-2xl md:rounded-3xl overflow-hidden bg-black/20 group relative shadow-md"
          >
            <img
              src={dusk}
              alt="Friends sharing drinks and laughter at dusk"
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>

          {/* Row 3 - Left: 1/3 (4 cols) */}
          <div
            data-photo
            className="md:col-span-4 h-[180px] sm:h-[220px] md:h-[260px] lg:h-[290px] rounded-2xl md:rounded-3xl overflow-hidden bg-black/20 group relative shadow-md"
          >
            <img
              src={tableStill}
              alt="Curated dinner table set with wine and calla lily"
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>

          {/* Row 3 - Right: 2/3 Wide Landscape (8 cols) */}
          <div
            data-photo
            className="md:col-span-8 h-[180px] sm:h-[220px] md:h-[260px] lg:h-[290px] rounded-2xl md:rounded-3xl overflow-hidden bg-black/20 group relative shadow-md"
          >
            <img
              src={footerBg}
              alt="Atmospheric dinner gathering table ambiance"
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function How() {
  const steps = [
    {
      num: "01",
      tag: "The Taste & City",
      title: "Share your preferences",
      desc: "Take a 3-minute quiz. Tell us your city, your culinary moods, and the conversations that make you feel alive.",
      badge: "Curated Matching",
    },
    {
      num: "02",
      tag: "The Gathering",
      title: "Discover your table",
      desc: "We introduce six compatible strangers over a single candlelit dinner at a vetted neighborhood restaurant.",
      badge: "Six Guests Only",
    },
    {
      num: "03",
      tag: "The Evening",
      title: "Show up & connect",
      desc: "Your seat is held. Break bread, share unscripted laughter, and leave with friends who linger long after dessert.",
      badge: "Unforgettable Evenings",
    },
  ];

  return (
    <section id="how" data-how-section className="relative text-ivory">
      {/* Pinned Viewport Container with safe navbar top clearance */}
      <div
        data-how-container
        className="min-h-screen w-full flex items-center justify-center px-[4vw] pt-28 pb-16 overflow-hidden relative"
      >
        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Big typography, elegant subtitle */}
          <div className="lg:col-span-5 flex flex-col justify-center select-none lg:pr-6">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-ochre animate-pulse" />
              <p className="label-mono text-ochre uppercase tracking-widest text-xs font-semibold">
                Three Simple Steps
              </p>
            </div>

            {/* Huge Display Text */}
            <h2 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-[6.5rem] xl:text-[7.5rem] leading-[0.88] tracking-tight text-ivory">
              <span className="block" data-how-title-line>
                HOW
              </span>
              <span className="block italic text-ochre font-display" data-how-title-line>
                IT
              </span>
              <span className="block" data-how-title-line>
                WORKS.
              </span>
            </h2>

            <p className="mt-6 max-w-sm text-sm sm:text-base leading-relaxed text-ivory/80 font-normal">
              Making new connections <em className="text-ochre not-italic font-medium">should feel natural</em>. No
              endless swiping or awkward networking. Just thoughtful dinners where real stories unfold.
            </p>
          </div>

          {/* Right Column: Stage for Stacked Cards (Moved slightly down, clear of navbar) */}
          <div className="lg:col-span-7 relative w-full flex items-center justify-center pt-2 sm:pt-4">
            {/* Ambient Background Glow behind active card */}
            <div className="pointer-events-none absolute -inset-10 bg-radial from-ochre/15 via-transparent to-transparent blur-3xl opacity-60" />

            {/* Cards Deck - Vertical Stack */}
            <div className="relative w-full max-w-[620px] mx-auto flex flex-col gap-3.5 sm:gap-4">
              {steps.map((s, i) => (
                <div
                  key={s.title}
                  data-how-card={i}
                  className="group relative w-full rounded-2xl border border-ivory/25 bg-[#2F3D1F]/95 px-5 py-4 sm:px-6 sm:py-4.5 backdrop-blur-2xl shadow-[0_16px_40px_-10px_rgba(0,0,0,0.5)] flex flex-col justify-between overflow-hidden transition-all duration-300 hover:border-ochre/50 hover:shadow-[0_20px_50px_-10px_rgba(217,119,6,0.25)]"
                  style={{
                    willChange: "transform, opacity",
                  }}
                >
                  {/* Soft Corner Glow */}
                  <div className="pointer-events-none absolute -top-12 -right-12 w-36 h-36 rounded-full bg-ochre/15 blur-xl" />

                  {/* Top: Tag + Badge */}
                  <div className="flex items-center justify-between gap-4">
                    <p
                      data-how-card-tag
                      className="label-mono text-ochre text-[11px] uppercase tracking-widest font-semibold"
                    >
                      {s.tag}
                    </p>
                    <span
                      data-how-card-badge
                      className="label-mono text-[10px] px-3 py-0.5 rounded-full bg-ivory/15 text-ivory border border-ivory/30 uppercase tracking-widest backdrop-blur-md font-medium"
                    >
                      {s.badge}
                    </span>
                  </div>

                  {/* Middle: Title & Desc */}
                  <div className="mt-2.5 space-y-1">
                    <h3
                      data-how-card-title
                      className="font-display text-xl sm:text-2xl text-ivory font-medium leading-snug"
                    >
                      {s.title}
                    </h3>
                    <p
                      data-how-card-desc
                      className="text-xs sm:text-[13px] leading-relaxed text-ivory/90 font-normal line-clamp-2"
                    >
                      {s.desc}
                    </p>
                  </div>

                  {/* Bottom: Interactive arrow */}
                  <div
                    data-how-card-footer
                    className="pt-2 border-t border-ivory/20 mt-2.5 flex items-center justify-end"
                  >
                    <div className="w-6 h-6 rounded-full border border-ochre/50 flex items-center justify-center text-ochre text-xs transition-all duration-300 group-hover:bg-ochre group-hover:text-[#2F3D1F] group-hover:translate-x-0.5 shadow-xs">
                      →
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Meets() {
  return (
    <section id="meets" className="relative px-[4vw] py-32 text-ivory">
      <div className="max-w-5xl mx-auto mb-12 text-center md:text-left">
        <p className="label-mono mb-4 text-ochre font-semibold uppercase tracking-widest">
          Upcoming Curated Gatherings
        </p>
        <h2 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95]">
          Your next favourite<br /><em className="text-ochre">conversation starts here.</em>
        </h2>
      </div>

      {/* Stacking Cards Container */}
      <div className="relative mx-auto max-w-5xl flex flex-col gap-12 pb-16">
        {meets.map((m, i) => (
          <div
            key={m.name}
            data-stack-card
            className="sticky top-28 md:top-36 rounded-[2.5rem] border border-ivory/25 bg-[#4B5935] shadow-2xl p-6 sm:p-10 md:p-12 overflow-hidden transition-all"
            style={{ zIndex: i + 1 }}
          >
            <div className="grid items-center gap-8 md:grid-cols-2">
              <div className="overflow-hidden rounded-2xl aspect-[4/3] bg-ink/20">
                <img
                  src={m.img}
                  alt={m.name}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="flex flex-col justify-between h-full">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-ivory/15 px-4 py-1.5 label-mono text-xs text-ochre">
                    <span>{m.when}</span>
                    <span>•</span>
                    <span>{m.where}</span>
                  </div>
                  <h3 className="font-display text-4xl sm:text-5xl md:text-6xl mt-4 text-ivory">
                    {m.name}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-ivory/80">
                    {m.desc}
                  </p>
                </div>
                <div className="mt-8 pt-6 border-t border-ivory/15 flex items-center justify-between">
                  <CtaButton tone="burgundy" href="/quiz">Request your seat</CtaButton>
                  <span className="label-mono text-xs text-ochre font-semibold">6 seats only</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CuratedGallerySection() {
  return (
    <section className="relative w-full pt-14 pb-8 bg-black text-white overflow-hidden">
      {/* Testimonial Section Header */}
      <div className="max-w-4xl mx-auto text-center mb-6 px-4">
        <p className="label-mono mb-2 text-ochre font-semibold uppercase tracking-widest text-xs">
          Voices from the Table
        </p>
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-ivory leading-tight">
          What happens when <em className="text-ochre">strangers break bread.</em>
        </h2>
      </div>

      <div className="w-full">
        <ConcaveCarousel
          items={testimonials}
          aspect={1.38}
          size={0.50}
          curvature={0.72}
          distance={4}
          tilt={0}
          gap={20}
          radius={16}
          reflection={0}
          dim={0.35}
          autoplay="drift"
          speed={0.15}
          interval={4}
          snap={false}
          inertia={0.5}
          pauseOnHover={false}
          draggable={true}
          wheel={false}
          captions={false}
          controls={false}
          backgroundColor="transparent"
          className="w-full"
        />
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer
      id="join"
      className="relative min-h-screen w-full flex flex-col justify-center items-center bg-[#150409] px-[4vw] py-20 text-ivory overflow-hidden -mt-1"
    >
      {/* Background Image Layer: Pure high-visibility velvet dinner table */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          data-footer-bg
          src={footerBg}
          alt="Precious Meets Table"
          className="w-full h-full object-cover object-center scale-110"
        />
        {/* Crisp subtle dark vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/45" />
      </div>

      <div className="relative z-10 max-w-6xl w-full mx-auto flex flex-col items-center justify-center text-center my-auto">
        <p className="label-mono text-ochre uppercase tracking-widest font-semibold mb-6">
          Every meet matters. Every seat is held.
        </p>

        {/* Monumental Playful "Precious Meets" Reveal */}
        <div className="overflow-hidden py-4 w-full flex justify-center">
          <div className="relative inline-block">
            <h2
              data-footer-wordmark
              className="font-display text-[14vw] sm:text-[13vw] md:text-[11vw] leading-[0.9] tracking-tight text-ivory select-none"
            >
              Precious <em className="text-ochre not-italic">Meets</em>
            </h2>

            {/* Playful Animated SVG Underline */}
            <svg
              className="absolute -bottom-2 md:-bottom-4 left-0 w-[104%] -left-[2%] h-4 md:h-8 overflow-visible pointer-events-none"
              viewBox="0 0 640 32"
              fill="none"
            >
              <path
                data-footer-underline
                d="M 6 22 C 140 10, 280 26, 440 14 C 520 8, 590 18, 634 12"
                stroke="#C6A568"
                strokeWidth="5.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <CtaButton tone="burgundy" href="/quiz">Take the Quiz</CtaButton>
          <CtaButton tone="ivory" href="/philosophy">Our Safety Philosophy</CtaButton>
        </div>
      </div>
    </footer>
  );
}

function Index() {
  const root = useRef<HTMLDivElement>(null);
  const heroEntranceRef = useRef<gsap.core.Timeline | null>(null);
  const preloaderDoneRef = useRef(false);

  const handlePreloaderComplete = () => {
    preloaderDoneRef.current = true;
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
      ScrollTrigger.refresh();
    }
    if (heroEntranceRef.current) {
      heroEntranceRef.current.play();
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);
    }

    gsap.registerPlugin(ScrollTrigger);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = reduce ? null : new Lenis({ lerp: 0.1 });
    const raf = (t: number) => lenis?.raf(t * 1000);
    if (lenis) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
    }

    const ctx = gsap.context(() => {
      if (reduce) {
        const underline = document.querySelector<SVGPathElement>("[data-hero=underline-path]");
        if (underline) gsap.set(underline, { strokeDashoffset: 0 });
        gsap.set("[data-geo-text='0']", { opacity: 0 });
        gsap.set("[data-geo-text='2']", { opacity: 1, y: 0 });
        tableSeats.forEach((s) => {
          gsap.set(`[data-chair='${s.id}']`, { y: 0, opacity: 1 });
          gsap.set(`[data-plate='${s.id}']`, { opacity: 1, scale: 1 });
        });
        gsap.set("[data-table-center]", { opacity: 1 });
        gsap.set("[data-table-caption]", { opacity: 1 });
        const footerUnderline = document.querySelector<SVGPathElement>("[data-footer-underline]");
        if (footerUnderline) gsap.set(footerUnderline, { strokeDashoffset: 0 });
        return;
      }
      const ease = "expo.out";

      const underline = document.querySelector<SVGPathElement>("[data-hero=underline-path]");
      if (underline) {
        const len = underline.getTotalLength() || 640;
        gsap.set(underline, { strokeDasharray: len, strokeDashoffset: len });
      }

      // Hero entrance sequence (paused until preloader curtain reveals)
      heroEntranceRef.current = gsap.timeline({
        paused: true,
        defaults: { ease },
        onComplete: () => {
          if (typeof window !== "undefined") {
            window.dispatchEvent(new Event("resize"));
          }
        },
      })
        .from("[data-nav]", { y: -30, opacity: 0, duration: 1 })
        .from("[data-hero=line]", { yPercent: 110, duration: 1.2, stagger: 0.1 }, "-=0.5")
        .from("[data-hero=pill]", { yPercent: 110, scale: 0.8, opacity: 0, duration: 1.1 }, "-=1.1")
        .from("[data-hero=annotation]", { y: -12, opacity: 0, duration: 0.8, ease: "back.out(1.7)" }, "-=0.7")
        .to("[data-hero=underline-path]", { strokeDashoffset: 0, duration: 1.3, ease: "power2.inOut" }, "-=0.4")
        .from("[data-hero=copy]", { y: 20, opacity: 0, duration: 0.9 }, "-=0.7")
        .from("[data-hero=cta]", { y: 20, opacity: 0, duration: 0.9 }, "-=0.7");

      if (preloaderDoneRef.current) {
        heroEntranceRef.current.play();
      }

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el, i) =>
        gsap.from(el, { yPercent: 110, duration: 1.2, ease, delay: (i % 4) * 0.08, scrollTrigger: { trigger: el, start: "top 88%" } }),
      );
      gsap.utils.toArray<HTMLElement>("[data-reveal-row]").forEach((el) =>
        gsap.from(el, { y: 60, opacity: 0, duration: 1.2, ease, scrollTrigger: { trigger: el, start: "top 85%" } }),
      );
      gsap.from("[data-photo]", {
        y: 50,
        opacity: 0,
        duration: 1.0,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: "#stories", start: "top 75%" },
      });

      // Geometry storytelling (Architectural dinner table based on reference image)
      gsap.set("[data-geo-text='0']", { opacity: 1, y: 0 });
      gsap.set("[data-geo-text='1']", { opacity: 0, y: 30 });
      gsap.set("[data-geo-text='2']", { opacity: 0, y: 30 });

      // Initial state of chairs, plates, and cutlery
      // Seat 0 (YOU): starts slightly pulled back, opacity 1
      gsap.set("[data-chair='0']", { y: -35 });
      gsap.set("[data-you-badge]", { opacity: 1, scale: 1 });
      gsap.set("[data-plate='0']", { opacity: 1, scale: 1 });
      gsap.set("[data-cutlery='0']", { opacity: 1, scale: 1, transformOrigin: "center center" });

      // Seats 1 to 5: start retracted outward, faint opacity
      [1, 2, 3, 4, 5].forEach((id) => {
        gsap.set(`[data-chair='${id}']`, { y: -50, opacity: 0.15 });
        gsap.set(`[data-plate='${id}']`, { opacity: 0, scale: 0.4, transformOrigin: "center center" });
        gsap.set(`[data-cutlery='${id}']`, { opacity: 0, scale: 0.4, transformOrigin: "center center" });
      });

      gsap.set("[data-table-center]", { opacity: 0.4 });
      gsap.set("[data-table-caption]", { opacity: 0.4 });

      const g = gsap.timeline({
        scrollTrigger: {
          trigger: "[data-geo]",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
        },
      });

      // Phase 1 (0 -> 1): "You, somewhere in Delhi."
      // Seat 0 (YOU) slides smoothly in to table, quote gains presence
      g.to("[data-chair='0']", { y: 0, duration: 1.0, ease: "power2.out" }, 0.1)
        .to("[data-table-center]", { opacity: 0.75, duration: 0.8 }, 0.2);

      // Phase 2 (1 -> 2): "Five others, just as new here."
      // Frame 0 -> Frame 1. Other chairs slide in radially from perimeter into place.
      g.to("[data-geo-text='0']", { opacity: 0, y: -26, duration: 0.3 }, 0.95)
        .to("[data-geo-text='1']", { opacity: 1, y: 0, duration: 0.35 }, 1.25);

      [1, 2, 4, 5].forEach((id, idx) => {
        g.to(`[data-chair='${id}']`, {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power2.out",
        }, 1.1 + idx * 0.08);

        g.to(`[data-plate='${id}']`, {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.5)",
        }, 1.3 + idx * 0.08);

        g.to(`[data-cutlery='${id}']`, {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.5)",
        }, 1.34 + idx * 0.08);
      });

      // Outer guide rings rotate slightly with precision
      g.to("[data-rings]", { rotation: 15, transformOrigin: "300px 300px", duration: 1.6, ease: "power1.inOut" }, 1.0);

      // Phase 3 (2 -> 3): "One table. One empty chair. Sunday, 7 PM."
      // Frame 1 -> Frame 2. Seat 3 (the empty chair) slides into place.
      g.to("[data-geo-text='1']", { opacity: 0, y: -26, duration: 0.3 }, 2.05)
        .to("[data-geo-text='2']", { opacity: 1, y: 0, duration: 0.35 }, 2.3)
        .to("[data-chair='3']", {
          y: 0,
          opacity: 1,
          duration: 0.95,
          ease: "power2.out",
        }, 2.15)
        .to("[data-plate='3']", {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.5)",
        }, 2.35)
        .to("[data-cutlery='3']", {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.5)",
        }, 2.38)
        .to("[data-table-center]", { opacity: 1, duration: 0.6 }, 2.2)
        .to("[data-table-caption]", { opacity: 1, duration: 0.6 }, 2.3);

      // Day-to-Night Ambient Transition (Collage / "Different lives. One shared table")
      // Transitions into #5F7045 (Forest Green) at "Different lives. One shared table" (#stories)
      gsap.fromTo(
        root.current,
        {
          backgroundColor: "#F8F2E7",
          color: "#171514",
        },
        {
          backgroundColor: "#5F7045", // Pure Brand Forest Green
          color: "#F8F2E7", // Luminous Ivory
          ease: "none",
          scrollTrigger: {
            trigger: "#stories",
            start: "top 85%",
            end: "top 20%",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        }
      );

      // How It Works — Interactive Sliding Cards & Pinned Experience
      const howSection = document.querySelector<HTMLElement>("[data-how-section]");
      if (howSection) {
        const mm = gsap.matchMedia();

        // Reveal the big title lines as section approaches
        gsap.from("[data-how-title-line]", {
          yPercent: 100,
          opacity: 0,
          stagger: 0.12,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-how-section]",
            start: "top 75%",
          },
        });

        // Desktop (>= 1024px): Pinned scrub animation revealing cards vertically (Card 0 top, Card 1 below, Card 2 bottom)
        mm.add("(min-width: 1024px)", () => {
          const card0 = document.querySelector<HTMLElement>("[data-how-card='0']");
          const card1 = document.querySelector<HTMLElement>("[data-how-card='1']");
          const card2 = document.querySelector<HTMLElement>("[data-how-card='2']");

          if (!card0 || !card1 || !card2) return;

          // Clear any leftover filters/brightness and ensure all cards stay 100% visible and bright
          gsap.set([card0, card1, card2], {
            clearProps: "filter,backdropFilter",
            filter: "none",
          });

          // Card 0 starts visible at the top; Card 1 & Card 2 start hidden below
          gsap.set(card0, { opacity: 1, y: 0, scale: 1 });
          gsap.set(card1, { opacity: 0, y: 40, scale: 1 });
          gsap.set(card2, { opacity: 0, y: 40, scale: 1 });

          const howTl = gsap.timeline({
            scrollTrigger: {
              trigger: "[data-how-section]",
              start: "top top",
              end: "+=1200",
              pin: true,
              scrub: 0.5,
            },
          });

          // 1st scroll step: Card 1 begins gliding in immediately with smooth scroll feedback
          howTl.to(
            card1,
            {
              opacity: 1,
              y: 0,
              duration: 0.85,
              ease: "power2.out",
            },
            0.08,
          );

          // 2nd scroll step: Card 2 glides in seamlessly directly below Card 1
          howTl.to(
            card2,
            {
              opacity: 1,
              y: 0,
              duration: 0.85,
              ease: "power2.out",
            },
            0.95,
          );

          // 3rd scroll step: Brief comfortable buffer with all 3 cards visible before smooth unpin
          howTl.to({}, { duration: 0.45 }, 1.8);
        });

        // Mobile / Tablet (< 1024px): Smooth entrance on scroll
        mm.add("(max-width: 1023px)", () => {
          const cards = gsap.utils.toArray<HTMLElement>("[data-how-card]");
          cards.forEach((card) => {
            gsap.from(card, {
              y: 35,
              opacity: 0,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
              },
            });
          });
        });
      }

      // Stacking Cards animation for Meets
      const stackCards = gsap.utils.toArray<HTMLElement>("[data-stack-card]");
      stackCards.forEach((card, index) => {
        const nextCard = stackCards[index + 1];
        if (nextCard) {
          gsap.to(card, {
            scale: 0.94 - index * 0.02,
            opacity: 0.8,
            ease: "none",
            scrollTrigger: {
              trigger: nextCard,
              start: "top 80%",
              end: "top 20%",
              scrub: true,
            },
          });
        }
      });

      // Footer Parallax Background
      gsap.to("[data-footer-bg]", {
        yPercent: -12,
        ease: "none",
        scrollTrigger: {
          trigger: "#join",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // Footer Playful Wordmark & Underline Animation
      const footerWordmark = document.querySelector<HTMLElement>("[data-footer-wordmark]");
      const footerUnderline = document.querySelector<SVGPathElement>("[data-footer-underline]");

      if (footerUnderline) {
        const len = footerUnderline.getTotalLength() || 640;
        gsap.set(footerUnderline, { strokeDasharray: len, strokeDashoffset: len });
      }

      if (footerWordmark && footerUnderline) {
        gsap.timeline({
          scrollTrigger: {
            trigger: "#join",
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        })
          .from(footerWordmark, {
            yPercent: 120,
            opacity: 0,
            duration: 1.2,
            ease: "back.out(1.6)",
          })
          .to(footerUnderline, {
            strokeDashoffset: 0,
            duration: 1.1,
            ease: "power2.out",
          }, "-=0.3");
      }

    }, root);

    return () => {
      ctx.revert();
      if (lenis) gsap.ticker.remove(raf);
      lenis?.destroy();
    };
  }, []);

  return (
    <div ref={root} className="min-h-screen">
      <Preloader onComplete={handlePreloaderComplete} />
      <Nav />
      <main>
        <Hero />
        <Statement />
        <Geometry />
        <Collage />
        <How />
        <Meets />
        <CuratedGallerySection />
      </main>
      <Footer />

      {/* Persistent On-Page Floating Safety SOS Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <SosModal
          triggerButton={
            <button
              type="button"
              aria-label="24/7 Safety SOS & Host Escort"
              className="flex items-center gap-2 rounded-full bg-red-700 hover:bg-red-800 text-white px-4 py-3 text-xs font-bold shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer border border-red-500/50"
            >
              <ShieldAlert className="size-4 animate-pulse text-white" />
              <span>24/7 Safety SOS</span>
            </button>
          }
        />
      </div>
    </div>
  );
}
