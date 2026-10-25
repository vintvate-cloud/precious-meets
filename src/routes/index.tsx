import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { CtaButton } from "@/components/CtaButton";
import { Preloader } from "@/components/Preloader";
import { Navbar } from "@/components/Navbar";
import { HeroMarquee } from "@/components/HeroMarquee";
import { ConversationStarters } from "@/components/ConversationStarters";
import { FaqSection } from "@/components/FaqSection";
import { DoorGreetings } from "@/components/DoorGreetings";
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
import { HowPhoneMockup } from "@/components/HowPhoneMockup";
import { HeroSection } from "@/components/HeroSection";
import { AnimatedSummitHero } from "@/components/hero/AnimatedSummitHero";

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



function Hero() {
  return <HeroSection />;
}

const manifestoLines = [
  { text: "Somewhere, an AI is trying to work out who you should meet.", isBurgundyItalic: false },
  { text: "We'd rather ask you.", isBurgundyItalic: false },
  { text: "A person reads your answers,", isBurgundyItalic: false },
  { text: "a person checks your ID,", isBurgundyItalic: false },
  { text: "and a person meets you at the door.", isBurgundyItalic: true },
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

        <div className="relative z-10 w-full max-w-[98vw] lg:max-w-[96vw] mx-auto flex flex-col items-center text-center px-1 sm:px-2 pt-16 sm:pt-12">

          <h2 className="w-full font-display text-[6.5vw] sm:text-[4.8vw] md:text-[3.9vw] lg:text-[3.3vw] xl:text-[3.5vw] 2xl:text-[3.7vw] leading-[1.16] sm:leading-[1.2] tracking-tight select-none">
            {manifestoLines.map((line, lIdx) => {
              const words = line.text.split(" ");
              return (
                <span
                  key={lIdx}
                  className={`block w-full ${
                    line.isBurgundyItalic
                      ? "italic font-serif text-burgundy pt-1 sm:pt-2"
                      : "text-ink"
                  } ${lIdx === 0 ? "sm:whitespace-nowrap" : ""}`}
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
    <section data-geo className="relative h-[340vh] bg-[#FAF7F2] text-ink select-none">
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
            href="/quiz"
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
        scrub: 1.1,
      },
    });

    // Phase 0: Slow, premium atmospheric transition into brand forest green (#5F7045)
    // Runs across an unhurried 1.6s timeline interval so the user experiences a velvety, cinematic color wash
    tl.to(
      stage,
      {
        backgroundColor: "#5F7045",
        duration: 1.6,
        ease: "sine.inOut",
      },
      0,
    )
      .to(
        "[data-stories-glow]",
        {
          opacity: 1,
          scale: 1.15,
          duration: 1.6,
          ease: "sine.inOut",
        },
        0,
      )
      .to(
        "[data-stories-vignette]",
        {
          opacity: 0.9,
          duration: 1.6,
          ease: "sine.inOut",
        },
        0,
      )
      .to(
        "[data-stories-watermark-sub]",
        {
          color: "rgba(248, 242, 231, 0.65)",
          duration: 1.4,
          ease: "power2.inOut",
        },
        0.1,
      )
      .to(
        "[data-stories-watermark-title]",
        {
          color: "rgba(248, 242, 231, 0.32)",
          duration: 1.4,
          ease: "power2.inOut",
        },
        0.1,
      )
      .to(
        "[data-stories-watermark-em]",
        {
          color: "rgba(198, 165, 104, 0.7)",
          duration: 1.4,
          ease: "power2.inOut",
        },
        0.1,
      );

    // Phase 0.5: Serene breath on the fully transformed forest green canvas
    tl.to({}, { duration: 0.5 });

    // Step 1 to 6: Sequential two-beat choreography:
    // Beat A: Picture slides down from the top into its postcard place on the board
    // Beat B: Doodle pin strikes down into the card with paper impact rebound
    cards.forEach((card) => {
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
          duration: 0.85,
          ease: "power2.out",
        },
        "+=0.25",
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
    tl.to({}, { duration: 0.6 });

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
      className="relative h-[560vh] bg-[#5F7045] select-none"
    >
      {/* Sticky Fullscreen Pinboard Stage */}
      <div
        ref={stageRef}
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-[#FAF7F2] px-3 sm:px-6"
      >
        {/* Soft Vignette Overlay for rich photographic moodboard depth */}
        <div
          data-stories-vignette
          className="pointer-events-none absolute inset-0 opacity-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(15,22,12,0.45)_100%)]"
        />

        {/* Atmospheric Candlelight Glow in Center */}
        <div
          data-stories-glow
          className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-60"
        >
          <div className="w-[70vw] h-[70vw] max-w-[850px] max-h-[850px] rounded-full bg-[#C6A568]/20 blur-[160px] pointer-events-none" />
          <div className="w-[45vw] h-[45vw] max-w-[550px] max-h-[550px] rounded-full bg-[#691C35]/16 blur-[140px] pointer-events-none" />
        </div>

        {/* Ambient Pinboard Watermark Title (Visible on blank canvas before cards land) */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center px-4 select-none">
          <span
            data-stories-watermark-sub
            className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.28em] text-[#171514]/40 mb-3"
          >
            Moments From The Table · Delhi NCR
          </span>
          <h2
            data-stories-watermark-title
            className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-[#171514]/20 tracking-tight leading-none"
          >
            Six strangers.<br />
            <em
              data-stories-watermark-em
              className="font-serif italic text-burgundy/25"
            >
              Stories that linger.
            </em>
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
  return <HowPhoneMockup />;
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

      // Ambient Green Transition into #5F7045 (Forest Green) happens slowly and luxuriously as user scrolls into the stories section
      gsap.fromTo(
        root.current,
        {
          backgroundColor: "#FAF7F2",
          color: "#171514",
        },
        {
          backgroundColor: "#5F7045", // Pure Brand Forest Green
          color: "#F8F2E7", // Luminous Ivory
          ease: "sine.inOut",
          scrollTrigger: {
            trigger: "#stories",
            start: "top top",
            end: "+=1400",
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        }
      );

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
      <Navbar />
      <main>
        <AnimatedSummitHero />
        <HeroMarquee />
        <Statement />
        <DoorGreetings />
        <Geometry />
        <ConversationStarters />
        <Collage />
        <How />
        <CuratedGallerySection />
        <FaqSection />
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
