import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { CtaButton } from "@/components/CtaButton";
import { Preloader } from "@/components/Preloader";
import tableLaugh from "@/assets/table-laugh.jpg";
import hands from "@/assets/hands.jpg";
import conversation from "@/assets/conversation.jpg";
import dusk from "@/assets/dusk.jpg";
import tableStill from "@/assets/table-still.jpg";
import footerBg from "@/assets/footer-bg.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Precious Meets — Every meet matters" },
      { name: "description", content: "Curated real-world meetups, shared meals and meaningful conversations with people beyond your usual circle." },
      { property: "og:title", content: "Precious Meets — Every meet matters" },
      { property: "og:description", content: "Share a table, discover unexpected perspectives, and make room for connections that matter." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const links = [
  ["Take the Quiz", "/quiz"],
  ["Upcoming Meets", "/experiences"],
  ["How It Works", "/how-it-works"],
  ["Safety & SOS", "/safety"],
  ["Member Sign In", "/login"],
] as const;

// Illustrative sample meets — not real events.
const meets = [
  { name: "The Long Table Supper", when: "Thursdays · 8 PM", where: "Bandra, Mumbai", img: tableLaugh, desc: "Six strangers, four courses, one candlelit table." },
  { name: "Slow Coffee Sundays", when: "Sundays · 10 AM", where: "Indiranagar, Bengaluru", img: conversation, desc: "Unhurried conversations over a single pour." },
  { name: "After-Dark Walk & Wine", when: "Saturdays · 7 PM", where: "Hauz Khas, Delhi", img: dusk, desc: "A short walk, a small bar, a few new friends." },
];

function Nav() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header data-nav className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
        <nav data-nav-bar className="flex w-full max-w-3xl items-center justify-between rounded-full border bg-ivory/85 py-1.5 pl-6 pr-1.5 backdrop-blur-md transition-colors duration-500">
          <a href="#top" className="font-display text-2xl">Precious<em className="text-burgundy">meets</em></a>
          <span className="label-mono hidden text-muted-foreground sm:block">Mumbai · Bengaluru · Delhi</span>
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="relative grid size-11 place-items-center rounded-full bg-ink text-ivory transition-colors hover:bg-burgundy"
          >
            <span className={`absolute h-px w-4 bg-ivory transition-transform duration-500 ${open ? "rotate-45" : "-translate-y-1"}`} />
            <span className={`absolute h-px w-4 bg-ivory transition-transform duration-500 ${open ? "-rotate-45" : "translate-y-1"}`} />
          </button>
        </nav>
      </header>
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-burgundy text-ivory transition-[clip-path] duration-700 [transition-timing-function:var(--ease-out-expo)] ${open ? "[clip-path:inset(0_0_0_0)]" : "pointer-events-none [clip-path:inset(0_0_100%_0)]"}`}
      >
        <ul className="flex h-full flex-col justify-center gap-2 px-[8vw]">
          {links.map(([label, href], i) => (
            <li key={href} className="line-mask">
              <a
                href={href}
                onClick={() => setOpen(false)}
                style={{ transitionDelay: open ? `${150 + i * 70}ms` : "0ms" }}
                className={`block font-display text-6xl transition-all duration-700 hover:translate-x-4 hover:italic hover:text-ochre md:text-8xl ${open ? "translate-y-0" : "translate-y-full"}`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const heroPillImages = [
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

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const syncBounds = () => {
      const a = anchor.getBoundingClientRect();
      const s = sticky.getBoundingClientRect();
      return {
        top: a.top - s.top,
        left: a.left - s.left,
        width: a.width,
        height: a.height,
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
              className={`absolute inset-0 size-full object-cover transition-opacity duration-1000 ease-in-out ${
                i === activeIdx ? "opacity-100" : "opacity-0 pointer-events-none"
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
                    className="inline-block h-[0.72em] w-[2.2em] md:h-[0.78em] md:w-[2.4em] mx-[0.18em] align-middle opacity-0 pointer-events-none"
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



function Statement() {
  const lines = [
    "Life gets busy.",
    "Circles get smaller.",
    "There is always room at the table.",
    "Every meet counts.",
  ];
  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-[4vw] py-32 text-center">
      <h2 className="font-display text-[9vw] leading-[0.98] md:text-[6vw]">
        {lines.map((l, i) => (
          <span key={l} className="line-mask">
            <span
              data-reveal
              className={`block ${i === 3 ? "italic text-burgundy font-serif" : ""}`}
            >
              {l}
            </span>
          </span>
        ))}
      </h2>
      <div className="mt-16"><CtaButton tone="burgundy" href="#meets">Find your table</CtaButton></div>
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
    <section data-geo className="relative h-[340vh] bg-ivory">
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

                {/* 6 Porcelain Dinner Plates */}
                {tableSeats.map((s) => (
                  <g key={`plate-${s.id}`} data-plate={s.id}>
                    <circle
                      cx={s.plateX}
                      cy={s.plateY}
                      r="17"
                      fill="#FFFFFF"
                      stroke="#D2C1AC"
                      strokeWidth="1.2"
                      style={{ filter: "drop-shadow(0 2px 3px rgba(60,40,20,0.08))" }}
                    />
                    <circle
                      cx={s.plateX}
                      cy={s.plateY}
                      r="11"
                      fill="#FAF6EF"
                      stroke="#DFCFC0"
                      strokeWidth="0.8"
                    />
                    <circle
                      cx={s.plateX}
                      cy={s.plateY}
                      r="7"
                      fill="#FFFFFF"
                      opacity="0.5"
                    />
                  </g>
                ))}

                {/* 6 Dining Chairs as per reference image */}
                {tableSeats.map((s) => (
                  <g
                    key={`chair-${s.id}`}
                    transform={`translate(${s.chairX}, ${s.chairY}) rotate(${s.deg + 90})`}
                  >
                    <g data-chair={s.id}>
                      {/* Chair Cushion Pill */}
                      <rect
                        x="-27"
                        y="-13"
                        width="54"
                        height="26"
                        rx="8"
                        fill="#FFFDF8"
                        stroke="#8A735A"
                        strokeWidth="1.2"
                        style={{ filter: "drop-shadow(0 2px 4px rgba(60,40,20,0.06))" }}
                      />
                      {/* Burgundy Backrest Top Cap along outer edge */}
                      <path
                        d="M -23 -13 L 23 -13"
                        stroke="#691C35"
                        strokeWidth="6"
                        strokeLinecap="round"
                      />
                      {/* Inner cushion contour seam */}
                      <rect
                        x="-21"
                        y="-8"
                        width="42"
                        height="16"
                        rx="5"
                        fill="none"
                        stroke="#EADECA"
                        strokeWidth="0.8"
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
  const photos = [
    { src: conversation, alt: "Two people smiling over coffee", cls: "left-[2%] top-10 -rotate-6 w-[42%] md:w-[30%]" },
    { src: tableLaugh, alt: "A group laughing around a dinner table", cls: "left-[28%] top-24 rotate-2 w-[50%] md:w-[38%] z-10" },
    { src: dusk, alt: "Friends walking and laughing at dusk", cls: "right-[2%] top-4 rotate-6 w-[40%] md:w-[26%]" },
  ];
  return (
    <section id="stories" className="relative px-[4vw] pt-32 pb-36 overflow-visible text-ivory">
      <div className="grid gap-10 md:grid-cols-[1fr_1.4fr] md:items-end">
        <h2 className="font-display text-6xl leading-[0.95] md:text-8xl text-ivory">
          Different lives.<br /><em className="text-ochre">One shared table.</em>
        </h2>
        <p className="max-w-sm text-sm leading-relaxed text-ivory/80 md:justify-self-end">
          Meet people with different stories, unexpected interests, and something new to bring to the conversation.
        </p>
      </div>
      <div className="relative mt-16 h-[68vw] md:h-[46vw]">
        {photos.map((p) => (
          <figure key={p.alt} data-photo className={`photo-frame absolute transition-transform duration-700 hover:-translate-y-2 hover:rotate-0 ${p.cls}`}>
            <img src={p.src} alt={p.alt} loading="lazy" className="aspect-[4/5] w-full object-cover" />
          </figure>
        ))}
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
    <section id="how" className="relative px-[4vw] py-36 text-ivory">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-ivory/20">
          <div>
            <p className="label-mono text-ochre uppercase tracking-widest font-semibold mb-3">
              How It Works · Three Simple Steps
            </p>
            <h2 className="font-display max-w-2xl text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95]">
              Making new connections <em className="text-ochre">should feel natural.</em>
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed opacity-80 text-ivory/80">
            No endless swiping or awkward networking. Just thoughtful dinners where real stories unfold.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {steps.map((s, i) => (
            <div
              key={s.num}
              data-reveal-row
              className="group relative rounded-3xl border border-ivory/20 bg-[#4F5E39]/80 p-8 sm:p-10 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-ochre/60 flex flex-col justify-between min-h-[360px]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-display text-5xl text-ochre">{s.num}</span>
                  <span className="label-mono text-[10px] px-3 py-1 rounded-full bg-ivory/10 text-ivory/90 uppercase tracking-widest">
                    {s.badge}
                  </span>
                </div>
                <p className="label-mono text-ochre/80 text-xs mt-6 uppercase tracking-wider">{s.tag}</p>
                <h3 className="font-display text-3xl sm:text-4xl mt-2 text-ivory">{s.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-ivory/75">{s.desc}</p>
              </div>
              <div className="pt-6 border-t border-ivory/15 mt-8 flex items-center justify-between text-xs label-mono text-ochre">
                <span>Step {i + 1} of 3</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Meets() {
  return (
    <section id="meets" className="relative px-[4vw] py-32 text-ivory">
      <div className="max-w-5xl mx-auto mb-16 text-center md:text-left">
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
                  <CtaButton tone="burgundy" href="#join">Request your seat</CtaButton>
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

function Footer() {
  return (
    <footer id="join" className="relative bg-[#150409] px-[4vw] pb-12 pt-32 text-ivory overflow-hidden border-t border-ivory/15">
      {/* Background Image Layer: Pure high-visibility velvet dinner table */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          data-footer-bg
          src={footerBg}
          alt="Precious Meets Table"
          className="w-full h-full object-cover object-center scale-105"
        />
        {/* Crisp subtle dark vignette with ZERO green tinting so the velvet tabletop, wine glass, marble coaster and floral details remain brilliantly visible */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/35" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center text-center">
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
          <CtaButton tone="burgundy" href="#top">Back to top</CtaButton>
          <CtaButton tone="ivory" href="#meets">Explore upcoming meets</CtaButton>
        </div>

        <div className="mt-28 w-full flex flex-col justify-between items-center gap-4 border-t border-ivory/20 pt-8 label-mono text-xs text-ivory/70 sm:flex-row">
          <span>Mumbai · Bengaluru · Delhi</span>
          <span>© 2026 Precious Meets · Every meet counts.</span>
        </div>
      </div>
    </footer>
  );
}

function Index() {
  const root = useRef<HTMLDivElement>(null);
  const heroEntranceRef = useRef<gsap.core.Timeline | null>(null);

  const handlePreloaderComplete = () => {
    heroEntranceRef.current?.play();
  };

  useEffect(() => {
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
      heroEntranceRef.current = gsap.timeline({ paused: true, defaults: { ease } })
        .from("[data-nav]", { y: -30, opacity: 0, duration: 1 })
        .from("[data-hero=line]", { yPercent: 110, duration: 1.2, stagger: 0.1 }, "-=0.5")
        .from("[data-hero=pill]", { clipPath: "inset(0 50% 0 50% round 999px)", scale: 0.8, duration: 1.1 }, "-=0.9")
        .from("[data-hero=annotation]", { y: -12, opacity: 0, duration: 0.8, ease: "back.out(1.7)" }, "-=0.7")
        .to("[data-hero=underline-path]", { strokeDashoffset: 0, duration: 1.3, ease: "power2.inOut" }, "-=0.4")
        .from("[data-hero=copy]", { y: 20, opacity: 0, duration: 0.9 }, "-=0.7")
        .from("[data-hero=cta]", { y: 20, opacity: 0, duration: 0.9 }, "-=0.7");

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el, i) =>
        gsap.from(el, { yPercent: 110, duration: 1.2, ease, delay: (i % 4) * 0.08, scrollTrigger: { trigger: el, start: "top 88%" } }),
      );
      gsap.utils.toArray<HTMLElement>("[data-reveal-row]").forEach((el) =>
        gsap.from(el, { y: 60, opacity: 0, duration: 1.2, ease, scrollTrigger: { trigger: el, start: "top 85%" } }),
      );
      gsap.from("[data-photo]", {
        y: 120, rotate: 0, opacity: 0, duration: 1.4, ease, stagger: 0.15,
        scrollTrigger: { trigger: "#stories", start: "top 60%" },
      });

      // Geometry storytelling (Architectural dinner table based on reference image)
      gsap.set("[data-geo-text='0']", { opacity: 1, y: 0 });
      gsap.set("[data-geo-text='1']", { opacity: 0, y: 30 });
      gsap.set("[data-geo-text='2']", { opacity: 0, y: 30 });

      // Initial state of chairs and plates
      // Seat 0 (YOU): starts slightly pulled back, opacity 1
      gsap.set("[data-chair='0']", { y: -35 });
      gsap.set("[data-you-badge]", { opacity: 1, scale: 1 });
      gsap.set("[data-plate='0']", { opacity: 1, scale: 1 });

      // Seats 1 to 5: start retracted outward, faint opacity
      [1, 2, 3, 4, 5].forEach((id) => {
        gsap.set(`[data-chair='${id}']`, { y: -50, opacity: 0.15 });
        gsap.set(`[data-plate='${id}']`, { opacity: 0, scale: 0.4, transformOrigin: "center center" });
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
        .to("[data-table-center]", { opacity: 1, duration: 0.6 }, 2.2)
        .to("[data-table-caption]", { opacity: 1, duration: 0.6 }, 2.3);

      // Day-to-Night Ambient Transition (Collage / "Different lives. One shared table")
      // Transitions into #5F7045 (Forest Green) at "Different lives. One shared table" (#stories)
      gsap.timeline({
        scrollTrigger: {
          trigger: "#stories",
          start: "top 80%",
          end: "top 25%",
          scrub: 1,
        },
      })
        .to(root.current, {
          backgroundColor: "#5F7045", // Pure Brand Forest Green
          color: "#F8F2E7", // Luminous Ivory
          ease: "none",
        })
        .to("[data-nav-bar]", {
          backgroundColor: "rgba(95, 112, 69, 0.85)", // Forest Green glass
          borderColor: "rgba(248, 242, 231, 0.2)",
          color: "#F8F2E7",
          ease: "none",
        }, 0);

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
    <div ref={root} className="transition-colors duration-700">
      <Preloader onComplete={handlePreloaderComplete} />
      <Nav />
      <main>
        <Hero />
        <Statement />
        <Geometry />
        <Collage />
        <How />
        <Meets />
      </main>
      <Footer />
    </div>
  );
}
