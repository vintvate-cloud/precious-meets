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
import heroSketchBg from "@/assets/hero-sketch-bg.jpg";
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

// Curated gatherings across Delhi NCR heritage enclaves
const meets = [
  { name: "The Sunder Nursery Supper", when: "Thursdays · 8 PM", where: "Mehrauli, Delhi NCR", img: tableLaugh, desc: "Six strangers, four courses, one candlelit table in a secluded heritage enclave." },
  { name: "Slow Pour Sundays", when: "Sundays · 10 AM", where: "Sunder Nursery Pavilion, Delhi NCR", img: conversation, desc: "Unhurried conversations over single-origin pour-overs beneath the garden trees." },
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
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0.55) 100%)",
            backdropFilter: "blur(28px) saturate(190%) contrast(95%)",
            WebkitBackdropFilter: "blur(28px) saturate(190%) contrast(95%)",
          }}
          className="pointer-events-auto flex w-full items-center justify-between rounded-full border border-black/5 py-2 pl-3.5 sm:pl-5 pr-2 text-[#171514] shadow-[0_12px_32px_-10px_rgba(23,21,20,0.08),_0_2px_8px_-2px_rgba(23,21,20,0.03)] transition-all duration-300"
        >
          {/* Left: Brand Monogram + Logo */}
          <div className="flex items-center gap-3">
            <a href="#top" className="flex items-center gap-2.5 group">
              <span className="grid size-8 place-items-center rounded-full bg-white border border-black/5 text-[#691C35] transition-transform duration-300 group-hover:scale-105">
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
            <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-[11px] font-mono tracking-wider text-[#171514]/75 border border-black/5">
              <span className="size-1.5 rounded-full bg-[#5F7045] animate-pulse" />
              <span>Delhi NCR</span>
            </div>

            {/* Solid Pill CTA Button -> routes to /quiz */}
            <a
              href="/quiz"
              className="rounded-full bg-white text-[#171514] border border-black/10 px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold tracking-tight shadow-xs transition-all duration-300 hover:bg-[#691C35] hover:text-white hover:scale-105 active:scale-95"
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
                  className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${item.highlight
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

const heroSlides = [
  {
    id: "gathering",
    src: tableBurgundy,
    alt: "Curated long dinner table set with wine and burgundy floral arrangements",
    kicker: "The Geometry of Six",
    leftLine1: "Six strangers.",
    leftLine2: "One table.",
    leftDesc: "No resumes. No social performance. Handcrafted seating balancing energy and intellect in private heritage courtyards.",
    rightTitle: "Every meet matters.",
    rightSubtitle: "Delhi NCR · 6 Guests Only",
    rightStat: "100% Aadhaar Verified",
    rightLocation: "Mehrauli & Sunder Nursery",
  },
  {
    id: "laughter",
    src: tableLaugh,
    alt: "Friends laughing together around a dinner table",
    kicker: "The Unscripted Salon",
    leftLine1: "Real laughter.",
    leftLine2: "Unhurried tempo.",
    leftDesc: "Leave the city's frantic pace at the heavy wooden doors. Four seasonal courses, warm candlelight, and stories that linger.",
    rightTitle: "Chemistry by design.",
    rightSubtitle: "Curated Psychometrics",
    rightStat: "Zero Anonymous Predators",
    rightLocation: "Hauz Khas Lofts & Secret Terraces",
  },
  {
    id: "connection",
    src: hands,
    alt: "Hands passing a shared plate across a candlelit table",
    kicker: "Deliberate Gathering",
    leftLine1: "Breaking bread.",
    leftLine2: "True presence.",
    leftDesc: "Every friend in your life was once a complete stranger. We simply make the introduction effortless and safe.",
    rightTitle: "A seat held for you.",
    rightSubtitle: "Weekly Curated Evenings",
    rightStat: "24/7 Safety SOS Architecture",
    rightLocation: "Civil Lines & Chanakyapuri",
  },
  {
    id: "stillness",
    src: tableStill,
    alt: "Curated dinner table set with wine and calla lily",
    kicker: "Sanctuary from the Rush",
    leftLine1: "Quiet spaces.",
    leftLine2: "Deep listening.",
    leftDesc: "Intimate dining rooms secluded from Delhi's noise, designed for voices to be heard without shouting.",
    rightTitle: "Space to breathe.",
    rightSubtitle: "Sound-Vetted Enclaves",
    rightStat: "50:50 Balanced Ratios",
    rightLocation: "Lutyens' Verandas & Lodhi Enclaves",
  },
  {
    id: "dialogue",
    src: conversation,
    alt: "Two people smiling over a conversation",
    kicker: "Beyond Small Talk",
    leftLine1: "Curious minds.",
    leftLine2: "Unexpected spark.",
    leftDesc: "Where poets converse with engineers, and entrepreneurs swap travel memoirs with artists over a shared dessert.",
    rightTitle: "Perspectives aligned.",
    rightSubtitle: "Archetype Chemistry",
    rightStat: "UIDAI DigiLocker Pre-Checked",
    rightLocation: "Connaught Place Heritage Vaults",
  },
  {
    id: "twilight",
    src: dusk,
    alt: "New friends sharing drinks at dusk",
    kicker: "The Golden Hour",
    leftLine1: "Sundown walks.",
    leftLine2: "New beginnings.",
    leftDesc: "Twilight walks through ancient stone ruins, opening smoothly into an intimate supper table with five new friends.",
    rightTitle: "Evenings that linger.",
    rightSubtitle: "After-Dark Salons",
    rightStat: "Dedicated Guardian Hosts",
    rightLocation: "Qutub Arches & Jahanpanah Woods",
  },
];

function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const centerTrackRef = useRef<HTMLDivElement>(null);
  const centerTileSlotRef = useRef<HTMLDivElement>(null);
  const expandFrameRef = useRef<HTMLDivElement>(null);
  const expandImgRef = useRef<HTMLImageElement>(null);
  const isScrollingRef = useRef(false);

  // Smooth continuous infinite vertical marquee
  useEffect(() => {
    const track = centerTrackRef.current;
    if (!track) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const slot = centerTileSlotRef.current;
    let yPos = 0;
    const speed = 1.15;
    let animationFrameId: number;
    let singleLoopHeight = 0;
    let tileStep = 0;
    let tileHeight = 0;
    let slotCenter = 0;

    const measure = () => {
      if (!track || track.children.length < 2) return;
      const first = track.children[0] as HTMLElement;
      const second = track.children[1] as HTMLElement;
      if (first && second) {
        tileStep = second.offsetTop - first.offsetTop;
        tileHeight = first.offsetHeight;
        if (tileStep > 0) {
          singleLoopHeight = tileStep * heroSlides.length;
        }
      }
      if (slot) {
        slotCenter = slot.offsetTop + slot.offsetHeight / 2;
      }
    };

    measure();
    window.addEventListener("resize", measure);
    document.fonts?.ready?.then(measure);

    const step = () => {
      if (!isScrollingRef.current) {
        if (singleLoopHeight > 0) {
          yPos += speed;
          if (yPos >= singleLoopHeight) {
            yPos -= singleLoopHeight;
          }
          track.style.transform = `translate3d(0, -${yPos}px, 0)`;

          // Continuous distance-based scaling: ONLY the card in the middle scales smoothly!
          if (tileStep > 0) {
            const children = track.children;
            for (let i = 0; i < children.length; i++) {
              const child = children[i] as HTMLElement;
              const childCenter = child.offsetTop - yPos + tileHeight / 2;
              const diff = Math.abs(childCenter - slotCenter);

              // Proximity curve: 1 when dead center, 0 when approaching/leaving
              const proximity = Math.max(0, 1 - diff / (tileStep * 0.95));
              const smoothEase = proximity * proximity * (3 - 2 * proximity);
              const scale = 0.85 + 0.15 * smoothEase; // 0.85 unexpanded, 1.0 fully focused in slot

              child.style.transform = `scale(${scale})`;
            }
          }
        } else {
          measure();
        }
      }
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", measure);
    };
  }, []);

  // GSAP ScrollTrigger: Center tile slot expands to full screen on scroll down
  useEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    const slot = centerTileSlotRef.current;
    const frame = expandFrameRef.current;
    const track = centerTrackRef.current;
    if (!section || !sticky || !slot || !frame || !track) return;

    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const syncBounds = () => {
      const sRect = slot.getBoundingClientRect();
      const stickyRect = sticky.getBoundingClientRect();
      return {
        top: sRect.top - stickyRect.top,
        left: sRect.left - stickyRect.left,
        width: sRect.width,
        height: sRect.height,
      };
    };

    const initial = syncBounds();
    gsap.set(frame, {
      top: initial.top,
      left: initial.left,
      width: initial.width,
      height: initial.height,
      borderRadius: "28px",
      opacity: 0,
      pointerEvents: "none",
    });

    if (reduce) return;

    // Helper to find the card in the reel that is physically closest to the middle
    const getCenteredCard = () => {
      const slotRect = slot.getBoundingClientRect();
      const slotCenterY = slotRect.top + slotRect.height / 2;
      let closestChild: HTMLElement | null = null;
      let minDiff = Infinity;
      const children = track.children;
      for (let i = 0; i < children.length; i++) {
        const child = children[i] as HTMLElement;
        const rect = child.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        const diff = Math.abs(centerY - slotCenterY);
        if (diff < minDiff) {
          minDiff = diff;
          closestChild = child;
        }
      }
      return closestChild;
    };

    const tl = gsap.timeline({
      paused: true,
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.8,
        onUpdate: (self) => {
          const scrolling = self.progress > 0.005;

          if (scrolling && !isScrollingRef.current) {
            // Scroll just started: Freeze the continuous marquee and lock onto the EXACT middle card
            isScrollingRef.current = true;
            const centered = getCenteredCard();
            if (centered) {
              const img = centered.querySelector("img");
              if (img && expandImgRef.current) {
                expandImgRef.current.src = img.src;
                expandImgRef.current.alt = img.alt || "Curated dinner table";
              }
            }
          } else if (!scrolling && isScrollingRef.current) {
            // Returned to top: Resume continuous scrolling
            isScrollingRef.current = false;
          }

          if (self.progress === 0) {
            gsap.set(frame, { opacity: 0, pointerEvents: "none" });
            gsap.set("[data-hero-reel-mask]", { opacity: 1 });
            isScrollingRef.current = false;
          }
        },
      },
    });

    // Phase 1 (0.0 -> 0.20): Left & right words fade/glide out, background sketch fades out,
    // and expand frame seamlessly takes over the middle card with identical position
    tl.to("[data-hero-flank-left]", {
      x: -60,
      opacity: 0,
      duration: 0.2,
      ease: "power2.in",
    }, 0.02)
      .to("[data-hero-flank-right]", {
        x: 60,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
      }, 0.02)
      .to("[data-hero-sketch]", {
        opacity: 0,
        scale: 1.04,
        duration: 0.25,
        ease: "power2.inOut",
      }, 0)
      .to("[data-hero-reel-mask]", {
        opacity: 0,
        duration: 0.08,
        ease: "power1.out",
      }, 0)
      .fromTo(frame, { opacity: 0 }, { opacity: 1, duration: 0.08, ease: "power1.out" }, 0)
      // Step 1: Ensure frame is positioned at slot bounds at 0.20 progress
      .to(frame, {
        top: initial.top,
        left: initial.left,
        width: initial.width,
        height: initial.height,
        duration: 0.2,
        ease: "power2.out",
      }, 0)
      // Step 2: ONLY the middle image expands to full screen from 0.20 to 0.82
      .to(frame, {
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: "0px",
        ease: "power2.inOut",
        duration: 0.62,
      }, 0.2)
      .fromTo("[data-expand-img]", { scale: 1.12 }, { scale: 1, ease: "power2.inOut", duration: 0.62 }, 0.2)
      // Phase 3 (0.75 -> 1.0): Fullscreen luxury text overlay
      .fromTo(
        "[data-expand-overlay]",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
        0.75,
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

  // Infinite array tripled (18 items) to ensure 100% seamless looping with zero wrap jumps
  const infiniteTiles = [...heroSlides, ...heroSlides, ...heroSlides];

  return (
    <section ref={sectionRef} id="top" className="relative h-[280vh] bg-ivory">
      <div ref={stickyRef} className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden px-[2vw] lg:px-[3vw]">

        {/* Hand-drawn artisanal dinner table sketch in the background */}
        <div
          data-hero-sketch
          className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden"
        >
          <img
            src={heroSketchBg}
            alt="Hand-drawn dinner table illustration"
            className="size-full object-cover object-center opacity-30 mix-blend-multiply contrast-105"
          />
        </div>

        {/* Full-width 3-Column Hero Stage filling the viewport height */}
        <div className="relative z-10 flex h-full w-full max-w-[1520px] flex-col md:flex-row items-center justify-between gap-4 md:gap-6 lg:gap-8 px-3 sm:px-6 lg:px-8">

          {/* LEFT FLANK: Monumental Brand Statement "every" in Forest Green */}
          <div
            data-hero-flank-left
            className="order-1 flex-1 flex items-center justify-center md:justify-end select-none pr-0 md:pr-4 lg:pr-8 xl:pr-10"
          >
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[7.5rem] 2xl:text-[8.5rem] leading-none tracking-tight text-forest select-none text-center md:text-right">
              every
            </h1>
          </div>

          {/* CENTER COLUMN: Continuous Infinite Reel spanning FULL HEIGHT of the Hero */}
          <div className="order-2 shrink-0 relative flex items-center justify-center h-screen w-full md:w-[380px] lg:w-[420px] xl:w-[450px] 2xl:w-[480px] overflow-hidden">

            {/* The Invisible Anchor Slot defining the exact center viewport position */}
            <div
              ref={centerTileSlotRef}
              className="absolute z-10 w-[84%] sm:w-[86%] md:w-[92%] aspect-[4/5] max-h-[460px] md:max-h-[520px] rounded-3xl pointer-events-none opacity-0"
            />

            {/* Continuous Vertical Conveyor - Clean, crisp, NO upper or below shadow */}
            <div
              data-hero-reel-mask
              className="relative h-full w-full flex items-center justify-center overflow-hidden"
            >
              <div
                ref={centerTrackRef}
                className="w-full flex flex-col items-center gap-6 py-6"
                style={{ willChange: "transform" }}
              >
                {infiniteTiles.map((tile, idx) => (
                  <div
                    key={tile.id + "-" + idx}
                    style={{ transformOrigin: "center center" }}
                    className="relative w-[84%] sm:w-[86%] md:w-[92%] aspect-[4/5] max-h-[460px] md:max-h-[520px] rounded-3xl overflow-hidden border border-ink/15 shadow-none select-none shrink-0 opacity-100"
                  >
                    <img
                      src={tile.src}
                      alt={tile.alt}
                      className="size-full object-cover"
                      loading={idx < 4 ? "eager" : "lazy"}
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT FLANK: Monumental Brand Statement "matters" in Burgundy */}
          <div
            data-hero-flank-right
            className="order-3 flex-1 flex items-center justify-center md:justify-start select-none pl-0 md:pl-4 lg:pl-8 xl:pl-10"
          >
            <h2 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[7.5rem] 2xl:text-[8.5rem] leading-none tracking-tight text-burgundy select-none text-center md:text-left">
              matters
            </h2>
          </div>

        </div>

        {/* The Expanding Center Image Tile: Perfectly locked onto the active center image and expanding fullscreen on scroll */}
        <div
          ref={expandFrameRef}
          data-hero="center-tile"
          className="absolute z-30 overflow-hidden border border-ink/15 shadow-none opacity-0 pointer-events-none"
          style={{ borderRadius: "28px" }}
        >
          <img
            ref={expandImgRef}
            data-expand-img
            src={heroSlides[0].src}
            alt="Precious Meets curated table"
            className="absolute inset-0 size-full object-cover"
          />

          {/* Fullscreen expanded overlay unveiled on scroll */}
          <div
            data-expand-overlay
            className="absolute inset-0 flex flex-col justify-end p-[6vw] text-ivory opacity-0 pointer-events-none bg-gradient-to-t from-ink/90 via-ink/40 to-transparent"
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

      </div>
    </section>
  );
}

const manifestoLines = [
  { text: "In a city that moves too fast,", isBurgundyItalic: false },
  { text: "We make room for unhurried conversations.", isBurgundyItalic: false },
  { text: "No resumes. No social performance.", isBurgundyItalic: false },
  { text: "Just six strangers, one candlelit table.", isBurgundyItalic: false },
  { text: "Because every meet matters.", isBurgundyItalic: true },
];

function Statement() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const words = section.querySelectorAll<HTMLElement>("[data-reveal-word]");
    const cta = section.querySelector<HTMLElement>("[data-statement-cta]");

    if (reduce) {
      gsap.set(words, { opacity: 1 });
      if (cta) gsap.set(cta, { opacity: 1, y: 0 });
      return;
    }

    // Initial dimmed state: subtle low-contrast silhouettes
    gsap.set(words, { opacity: 0.16 });
    if (cta) gsap.set(cta, { opacity: 0, y: 30, scale: 0.96 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
      },
    });

    // Reveal words sequentially as the user scrolls
    tl.to(words, {
      opacity: 1,
      stagger: {
        each: 0.04,
        from: "start",
      },
      duration: 0.85,
      ease: "power1.inOut",
    });

    if (cta) {
      tl.to(
        cta,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.2,
          ease: "power2.out",
        },
        "-=0.1",
      );
    }

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
      className="relative h-[220vh] bg-ivory select-none"
    >
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center px-2 sm:px-4 md:px-6 lg:px-8 overflow-hidden">
        {/* Subtle Warm Atmospheric Glow */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="w-[70vw] h-[70vw] max-w-[850px] max-h-[850px] rounded-full bg-[#C6A568]/12 blur-[150px] pointer-events-none select-none" />
        </div>

        <div className="relative z-10 w-full max-w-[98vw] lg:max-w-[96vw] xl:max-w-[94vw] 2xl:max-w-[92vw] mx-auto flex flex-col items-center text-center px-1 sm:px-2 pt-12 sm:pt-8">

          <h2 className="w-full font-display text-[9vw] sm:text-[7vw] md:text-[5.6vw] lg:text-[5vw] xl:text-[5.4vw] 2xl:text-[5.8vw] leading-[1.08] sm:leading-[1.1] tracking-tight select-none">
            {manifestoLines.map((line, lIdx) => {
              const words = line.text.split(" ");
              return (
                <span
                  key={lIdx}
                  className={`block w-full ${line.isBurgundyItalic
                      ? "italic font-serif text-burgundy pt-1 sm:pt-2"
                      : "text-ink"
                    }`}
                >
                  {words.map((word, wIdx) => (
                    <span
                      key={wIdx}
                      data-reveal-word
                      className="inline-block mr-[0.2em] will-change-[opacity]"
                    >
                      {word}
                    </span>
                  ))}
                </span>
              );
            })}
          </h2>

          {/* Clean Luxury CTA Button */}
          <div data-statement-cta className="relative mt-8 sm:mt-12 flex flex-col items-center">
            <CtaButton tone="burgundy" href="/quiz">Find your table</CtaButton>
          </div>
        </div>
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


function DoodlePin({
  color = "#691C35",
  tilt = 0,
}: {
  color?: string;
  tilt?: number;
}) {
  return (
    <div
      className="relative flex items-center justify-center filter drop-shadow-[0_4px_7px_rgba(23,21,20,0.35)]"
      style={{ transform: `rotate(${tilt}deg)` }}
      aria-hidden="true"
    >
      <svg
        width="36"
        height="40"
        viewBox="0 0 36 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        {/* Soft puncture shadow hole on the card paper */}
        <ellipse cx="18" cy="36" rx="3.5" ry="1.8" fill="#171514" opacity="0.4" />

        {/* Pin metallic stem */}
        <path
          d="M18 20 L18 35.5"
          stroke="#3B3836"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M17.4 22 L17.4 34"
          stroke="#EDE8DF"
          strokeWidth="0.9"
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* Pin base collar ring */}
        <ellipse
          cx="18"
          cy="20"
          rx="6.5"
          ry="2.6"
          fill={color}
          stroke="#171514"
          strokeWidth="1.5"
        />

        {/* Pin body (doodle tapered waist) */}
        <path
          d="M13.5 20 C13.5 15.5, 14.5 13, 14 10.5 C13.6 8.5, 12.5 8, 11.5 7.5 C11.5 5.5, 24.5 5.5, 24.5 7.5 C23.5 8, 22.4 8.5, 22 10.5 C21.5 13, 22.5 15.5, 22.5 20 Z"
          fill={color}
          stroke="#171514"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Pin top rounded dome */}
        <path
          d="M11.5 7.5 C11.5 3.8, 14.2 2, 18 2 C21.8 2, 24.5 3.8, 24.5 7.5 Z"
          fill={color}
          stroke="#171514"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Hand-sketched doodle gloss & reflections */}
        <path
          d="M14.5 5 C16 3.8, 19 3.8, 21 4.6"
          stroke="#FFFFFF"
          strokeWidth="1.3"
          strokeLinecap="round"
          opacity="0.8"
        />
        <path
          d="M15 11.5 C15.2 13.5, 15.6 17, 15.8 18.5"
          stroke="#FFFFFF"
          strokeWidth="1.1"
          strokeLinecap="round"
          opacity="0.65"
        />
      </svg>
    </div>
  );
}

const galleryPostcards = [
  {
    id: "laugh",
    src: tableLaugh,
    alt: "Friends laughing around a dinner table",
    title: "Unscripted Laughter",
    location: "Mehrauli Enclave",
    time: "8:42 PM",
    pinColor: "#691C35", // Deep Burgundy
    pinTilt: -7,
    desktop: { top: "7%", left: "4%", rotate: -4 },
    mobile: { top: "12%", left: "6%", rotate: -4, width: "260px" },
  },
  {
    id: "conversation",
    src: conversation,
    alt: "Two people smiling over conversation",
    title: "Poets & Engineers",
    location: "Civil Lines Courtyard",
    time: "9:15 PM",
    pinColor: "#C6A568", // Antique Brass Ochre
    pinTilt: 6,
    desktop: { top: "5%", left: "36%", rotate: 3 },
    mobile: { top: "24%", left: "20%", rotate: 4, width: "260px" },
  },
  {
    id: "burgundy",
    src: tableBurgundy,
    alt: "Curated long dinner table set with wine and burgundy floral arrangements",
    title: "The Geometry of Six",
    location: "Sunder Nursery Pavilion",
    time: "7:30 PM",
    pinColor: "#2D3E28", // Forest Green
    pinTilt: -5,
    desktop: { top: "8%", left: "68%", rotate: -3 },
    mobile: { top: "36%", left: "8%", rotate: -3, width: "260px" },
  },
  {
    id: "hands",
    src: hands,
    alt: "Hands sharing a plate across a candlelit table",
    title: "Breaking Bread",
    location: "Hauz Khas Terraces",
    time: "8:58 PM",
    pinColor: "#B85A3B", // Warm Terracotta
    pinTilt: 8,
    desktop: { top: "51%", left: "5%", rotate: 4 },
    mobile: { top: "48%", left: "22%", rotate: 5, width: "260px" },
  },
  {
    id: "still",
    src: tableStill,
    alt: "Curated dinner table set with wine and calla lily",
    title: "Sanctuary from the Rush",
    location: "Lodhi Verandas",
    time: "10:10 PM",
    pinColor: "#1E2A38", // Deep Ink Navy
    pinTilt: -6,
    desktop: { top: "49%", left: "37%", rotate: -2 },
    mobile: { top: "60%", left: "6%", rotate: -2, width: "260px" },
  },
  {
    id: "dusk",
    src: dusk,
    alt: "Friends sharing drinks and laughter at dusk",
    title: "Twilight Supper",
    location: "Jahanpanah Vaults",
    time: "7:05 PM",
    pinColor: "#691C35", // Deep Burgundy
    pinTilt: 7,
    desktop: { top: "53%", left: "69%", rotate: 5 },
    mobile: { top: "72%", left: "18%", rotate: 4, width: "260px" },
  },
];

function Collage() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cards = stage.querySelectorAll<HTMLElement>("[data-postcard]");

    if (reduce) {
      cards.forEach((card) => {
        gsap.set(card, { y: 0, opacity: 1 });
        const pin = card.querySelector<HTMLElement>("[data-pin]");
        if (pin) gsap.set(pin, { y: 0, opacity: 1, scale: 1 });
      });
      return;
    }

    // Set initial state: cards positioned far above the screen (blank stage initially)
    // and doodle pins suspended above ready to strike
    cards.forEach((card) => {
      gsap.set(card, {
        y: -window.innerHeight * 1.4,
        opacity: 0,
        scale: 1.08,
      });

      const pin = card.querySelector<HTMLElement>("[data-pin]");
      if (pin) {
        gsap.set(pin, {
          y: -55,
          opacity: 0,
          scale: 2.2,
          rotation: -15,
        });
      }
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.9,
      },
    });

    // Step 0: Blank canvas hold (user enters, sees an unblemished stage with quiet ambient watermark)
    tl.to({}, { duration: 0.2 });

    // Step 1 to 6: Sequential two-beat choreography:
    // Beat A: Picture slides down from the top into its postcard place on the board
    // Beat B: Doodle pin strikes down into the card with paper impact rebound
    cards.forEach((card, i) => {
      const targetRotate = parseFloat(card.getAttribute("data-target-rotate") || "0");
      const pin = card.querySelector<HTMLElement>("[data-pin]");

      // Beat A: Picture slides in smoothly from the top
      tl.to(
        card,
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotation: targetRotate,
          duration: 0.8,
          ease: "power2.out",
        },
        i === 0 ? "+=0.1" : "+=0.3",
      );

      // Beat B: Pin punctures into the card
      if (pin) {
        tl.to(
          pin,
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.38,
            ease: "back.out(2.4)",
          },
          "-=0.1",
        );

        // Tactile micro-impact shake of the card as the pin punches in
        tl.to(
          card,
          {
            y: "+=4",
            duration: 0.08,
            yoyo: true,
            repeat: 1,
            ease: "power1.inOut",
          },
          "<0.12",
        );
      }
    });

    // Step 7: Final hold with all 6 pinned postcards resting proudly on the board before unpinning
    tl.to({}, { duration: 0.55 });

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      tl.kill();
      window.removeEventListener("resize", onResize);
    };
  }, [isMobile]);

  return (
    <section
      id="stories"
      ref={sectionRef}
      className="relative h-[520vh] bg-ivory select-none"
    >
      {/* Sticky Fullscreen Pinboard Stage */}
      <div
        ref={stageRef}
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-[#FAF7F2] px-3 sm:px-6"
      >
        {/* Subtle Warm Atmospheric Candlelight Glow in Center */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="w-[70vw] h-[70vw] max-w-[850px] max-h-[850px] rounded-full bg-[#C6A568]/12 blur-[160px] pointer-events-none" />
          <div className="w-[45vw] h-[45vw] max-w-[550px] max-h-[550px] rounded-full bg-[#691C35]/10 blur-[140px] pointer-events-none" />
        </div>

        {/* Ambient Pinboard Watermark Title (Visible on blank canvas before cards land) */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center px-4 select-none">
          <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.28em] text-[#171514]/40 mb-3">
            Moments From The Table · Delhi NCR
          </span>
          <h2 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-[#171514]/20 tracking-tight leading-none">
            Six strangers.<br />
            <em className="font-serif italic text-burgundy/25">Stories that linger.</em>
          </h2>
        </div>

        {/* 6 Postcards positioned across the stage */}
        <div className="relative size-full max-w-[1620px] mx-auto pointer-events-none">
          {galleryPostcards.map((card) => {
            const pos = isMobile ? card.mobile : card.desktop;
            return (
              <div
                key={card.id}
                data-postcard
                data-target-rotate={pos.rotate}
                style={{
                  top: pos.top,
                  left: pos.left,
                  width: isMobile ? card.mobile.width : undefined,
                  willChange: "transform, opacity",
                }}
                className="absolute pointer-events-auto rounded-2xl bg-[#FCFAF7] p-3 sm:p-3.5 pb-6 sm:pb-7 shadow-[0_22px_50px_-12px_rgba(23,21,20,0.24),_0_4px_16px_rgba(0,0,0,0.06)] border border-[#171514]/8 w-[250px] sm:w-[280px] md:w-[310px] lg:w-[340px] xl:w-[370px] transition-shadow duration-300 hover:shadow-[0_30px_70px_-14px_rgba(105,28,53,0.32)] hover:scale-[1.025] cursor-pointer"
              >
                {/* Handcrafted Doodle Pin on Top of Card */}
                <div
                  data-pin
                  className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
                  style={{ willChange: "transform, opacity" }}
                >
                  <DoodlePin color={card.pinColor} tilt={card.pinTilt} />
                </div>

                {/* Postcard Image Frame */}
                <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-ink/5 relative">
                  <img
                    src={card.src}
                    alt={card.alt}
                    className="size-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                  {/* Subtle inner shadow for tactile photograph print feel */}
                  <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10" />
                </div>

                {/* Postcard Handwritten / Editorial Caption */}
                <div className="mt-3 px-1.5 flex items-baseline justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-display text-base sm:text-lg text-ink leading-tight truncate">
                      {card.title}
                    </p>
                    <p className="font-mono text-[9px] sm:text-[10px] text-ink/60 uppercase tracking-wider truncate mt-0.5">
                      {card.location}
                    </p>
                  </div>
                  <span className="shrink-0 font-mono text-[10px] sm:text-xs text-burgundy font-semibold">
                    {card.time}
                  </span>
                </div>
              </div>
            );
          })}
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
      {/* Pinned Viewport Container */}
      <div
        data-how-container
        className="min-h-screen w-full flex items-center justify-center px-[4vw] py-20 lg:py-0 overflow-hidden relative"
      >
        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Big typography, elegant subtitle & dynamic step progress indicator */}
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

            {/* Dynamic Step Progress Tracker */}
            <div className="mt-10 pt-8 border-t border-ivory/15 max-w-md hidden sm:block">
              {/* Progress Bar Rail */}
              <div className="relative w-full h-[3px] bg-ivory/15 rounded-full overflow-hidden mb-6">
                <div
                  data-how-progress-bar
                  className="absolute left-0 top-0 h-full w-[33%] bg-ochre shadow-[0_0_12px_rgba(217,119,6,0.6)] rounded-full transition-all duration-300"
                />
              </div>

              {/* Step Status Badges */}
              <div className="grid grid-cols-3 gap-2">
                {steps.map((s, idx) => (
                  <div
                    key={s.num}
                    data-how-nav-step={idx}
                    className={`transition-all duration-500 cursor-pointer ${idx === 0 ? "opacity-100" : "opacity-40"
                      }`}
                  >
                    <span className="label-mono text-[11px] block text-ochre font-medium tracking-wider">
                      {s.num}
                    </span>
                    <span className="text-xs text-ivory/90 truncate block font-sans font-medium tracking-tight mt-0.5">
                      {s.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Stage for Big Cards */}
          <div className="lg:col-span-7 relative w-full lg:h-[580px] min-h-[500px] flex items-center justify-center">
            {/* Ambient Background Glow behind active card */}
            <div className="pointer-events-none absolute -inset-10 bg-radial from-ochre/15 via-transparent to-transparent blur-3xl opacity-60" />

            {/* Cards Deck */}
            <div className="relative w-full lg:h-full max-w-[620px] mx-auto flex flex-col lg:block items-center justify-center space-y-6 lg:space-y-0">
              {steps.map((s, i) => (
                <div
                  key={s.num}
                  data-how-card={i}
                  className={`group relative lg:absolute lg:inset-0 w-full rounded-[2.5rem] border border-ivory/20 bg-[#3E4D2B]/85 p-8 sm:p-12 backdrop-blur-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col justify-between overflow-hidden transition-shadow hover:shadow-[0_30px_70px_-15px_rgba(217,119,6,0.25)] ${i === 0 ? "z-10" : i === 1 ? "z-20" : "z-30"
                    }`}
                  style={{
                    willChange: "transform, opacity",
                  }}
                >
                  {/* Subtle Corner Watermark Number */}
                  <span className="pointer-events-none absolute -bottom-6 -right-4 font-display text-[150px] sm:text-[200px] leading-none text-ivory/[0.04] font-normal select-none">
                    {s.num}
                  </span>

                  {/* Soft Corner Glow */}
                  <div className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full bg-ochre/10 blur-3xl" />

                  {/* Top: Large Numeral + Badge */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="overflow-hidden">
                        <span data-how-card-num className="font-display text-5xl sm:text-6xl text-ochre block font-normal">
                          {s.num}
                        </span>
                      </div>
                      <span
                        data-how-card-badge
                        className="label-mono text-xs px-4 py-1.5 rounded-full bg-ivory/10 text-ivory/90 border border-ivory/20 uppercase tracking-widest backdrop-blur-md font-medium"
                      >
                        {s.badge}
                      </span>
                    </div>

                    {/* Middle: Tag, Title, Desc */}
                    <div className="mt-8 space-y-3">
                      <p
                        data-how-card-tag
                        className="label-mono text-ochre text-xs uppercase tracking-widest font-medium"
                      >
                        {s.tag}
                      </p>
                      <h3
                        data-how-card-title
                        className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.05] text-ivory font-normal"
                      >
                        {s.title}
                      </h3>
                      <p
                        data-how-card-desc
                        className="mt-4 text-base sm:text-lg leading-relaxed text-ivory/80 font-normal"
                      >
                        {s.desc}
                      </p>
                    </div>
                  </div>

                  {/* Bottom: Step progress & interactive arrow */}
                  <div
                    data-how-card-footer
                    className="pt-6 border-t border-ivory/15 mt-8 flex items-center justify-between text-xs label-mono text-ochre"
                  >
                    <span className="tracking-wider font-medium">Step {i + 1} of 3</span>
                    <div className="w-10 h-10 rounded-full border border-ochre/40 flex items-center justify-center text-ochre text-base transition-all duration-300 group-hover:bg-ochre group-hover:text-[#3E4D2B] group-hover:translate-x-1 group-hover:border-ochre shadow-sm">
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

      const heroEase = "power3.out";
      const heroItemDuration = 1.1;
      const heroItemDelayGap = 0.32;
      const firstItemStart = 0.35;

      // Hero entrance sequence (paused until preloader curtain reveals)
      heroEntranceRef.current = gsap.timeline({
        paused: true,
        onComplete: () => {
          if (typeof window !== "undefined") {
            window.dispatchEvent(new Event("resize"));
            ScrollTrigger.refresh();
          }
        },
      })
        // Top navigation bar glides down first
        .from("[data-nav]", { y: -25, opacity: 0, duration: 0.85, ease: "power2.out" }, 0)
        // Background artisanal dinner sketch fades in softly
        .from("[data-hero-sketch]", { opacity: 0, duration: 1.2, ease: "power2.out" }, 0.1)
        // 1. Firstly: 'every' text comes in sliding from top
        .from(
          "[data-hero-flank-left]",
          {
            y: -90,
            opacity: 0,
            duration: heroItemDuration,
            ease: heroEase,
          },
          firstItemStart,
        )
        // 2. Then: the images reel comes in sliding from top with consistent speed & delay
        .from(
          "[data-hero-reel-mask]",
          {
            y: -90,
            opacity: 0,
            duration: heroItemDuration,
            ease: heroEase,
          },
          firstItemStart + heroItemDelayGap,
        )
        // 3. And then: 'matters' text comes in sliding from top with the exact same speed & delay
        .from(
          "[data-hero-flank-right]",
          {
            y: -90,
            opacity: 0,
            duration: heroItemDuration,
            ease: heroEase,
          },
          firstItemStart + heroItemDelayGap * 2,
        );

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

        // Desktop (>= 1024px): Pinned scrub animation with right-to-left card slide-in
        mm.add("(min-width: 1024px)", () => {
          const card0 = document.querySelector<HTMLElement>("[data-how-card='0']");
          const card1 = document.querySelector<HTMLElement>("[data-how-card='1']");
          const card2 = document.querySelector<HTMLElement>("[data-how-card='2']");
          const progressBar = document.querySelector<HTMLElement>("[data-how-progress-bar]");
          const navStep0 = document.querySelector<HTMLElement>("[data-how-nav-step='0']");
          const navStep1 = document.querySelector<HTMLElement>("[data-how-nav-step='1']");
          const navStep2 = document.querySelector<HTMLElement>("[data-how-nav-step='2']");

          if (!card0 || !card1 || !card2) return;

          // Initial positions
          gsap.set(card0, { xPercent: 0, opacity: 1, scale: 1, rotate: 0, filter: "brightness(1) blur(0px)" });
          gsap.set(card1, { xPercent: 125, opacity: 0, scale: 0.94, rotate: 3, filter: "brightness(0.7)" });
          gsap.set(card2, { xPercent: 250, opacity: 0, scale: 0.88, rotate: 6, filter: "brightness(0.5)" });

          if (progressBar) gsap.set(progressBar, { width: "33%" });

          const howTl = gsap.timeline({
            scrollTrigger: {
              trigger: "[data-how-section]",
              start: "top top",
              end: "+=2600",
              pin: true,
              scrub: 1.2,
              anticipatePin: 1,
            },
          });

          // Card 1 text elements
          const card1Num = card1.querySelector("[data-how-card-num]");
          const card1Badge = card1.querySelector("[data-how-card-badge]");
          const card1Tag = card1.querySelector("[data-how-card-tag]");
          const card1Title = card1.querySelector("[data-how-card-title]");
          const card1Desc = card1.querySelector("[data-how-card-desc]");

          // Card 2 text elements
          const card2Num = card2.querySelector("[data-how-card-num]");
          const card2Badge = card2.querySelector("[data-how-card-badge]");
          const card2Tag = card2.querySelector("[data-how-card-tag]");
          const card2Title = card2.querySelector("[data-how-card-title]");
          const card2Desc = card2.querySelector("[data-how-card-desc]");

          // Transition 1: Card 0 recedes, Card 1 slides in from right
          howTl
            .to(
              card0,
              {
                xPercent: -18,
                scale: 0.92,
                opacity: 0.25,
                filter: "brightness(0.35) blur(3px)",
                duration: 1.0,
                ease: "power2.inOut",
              },
              0.2,
            )
            .to(
              card1,
              {
                xPercent: 0,
                opacity: 1,
                scale: 1,
                rotate: 0,
                filter: "brightness(1) blur(0px)",
                duration: 1.0,
                ease: "power3.out",
              },
              0.2,
            )
            .from(card1Num, { y: 35, opacity: 0, duration: 0.6, ease: "power2.out" }, 0.5)
            .from(card1Badge, { x: 25, opacity: 0, duration: 0.5, ease: "power2.out" }, 0.5)
            .from(card1Tag, { y: 20, opacity: 0, duration: 0.5, ease: "power2.out" }, 0.6)
            .from(card1Title, { y: 25, opacity: 0, duration: 0.6, ease: "power2.out" }, 0.65)
            .from(card1Desc, { y: 20, opacity: 0, duration: 0.6, ease: "power2.out" }, 0.7);

          if (progressBar) {
            howTl.to(progressBar, { width: "66%", duration: 0.8, ease: "power1.inOut" }, 0.3);
          }
          if (navStep0 && navStep1) {
            howTl
              .to(navStep0, { opacity: 0.35, duration: 0.5 }, 0.3)
              .to(navStep1, { opacity: 1, duration: 0.5 }, 0.4);
          }

          // Transition 2: Card 1 recedes, Card 2 slides in from right
          howTl
            .to(
              card1,
              {
                xPercent: -18,
                scale: 0.92,
                opacity: 0.25,
                filter: "brightness(0.35) blur(3px)",
                duration: 1.0,
                ease: "power2.inOut",
              },
              1.6,
            )
            .to(
              card2,
              {
                xPercent: 0,
                opacity: 1,
                scale: 1,
                rotate: 0,
                filter: "brightness(1) blur(0px)",
                duration: 1.0,
                ease: "power3.out",
              },
              1.6,
            )
            .from(card2Num, { y: 35, opacity: 0, duration: 0.6, ease: "power2.out" }, 1.9)
            .from(card2Badge, { x: 25, opacity: 0, duration: 0.5, ease: "power2.out" }, 1.9)
            .from(card2Tag, { y: 20, opacity: 0, duration: 0.5, ease: "power2.out" }, 2.0)
            .from(card2Title, { y: 25, opacity: 0, duration: 0.6, ease: "power2.out" }, 2.05)
            .from(card2Desc, { y: 20, opacity: 0, duration: 0.6, ease: "power2.out" }, 2.1);

          if (progressBar) {
            howTl.to(progressBar, { width: "100%", duration: 0.8, ease: "power1.inOut" }, 1.7);
          }
          if (navStep1 && navStep2) {
            howTl
              .to(navStep1, { opacity: 0.35, duration: 0.5 }, 1.7)
              .to(navStep2, { opacity: 1, duration: 0.5 }, 1.8);
          }

          // Buffer at end
          howTl.to({}, { duration: 0.6 }, 2.6);
        });

        // Mobile / Tablet (< 1024px): Smooth entrance on scroll
        mm.add("(max-width: 1023px)", () => {
          const cards = gsap.utils.toArray<HTMLElement>("[data-how-card]");
          cards.forEach((card) => {
            gsap.from(card, {
              x: 60,
              opacity: 0,
              duration: 1.0,
              ease: "power3.out",
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
