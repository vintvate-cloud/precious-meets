import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { CtaButton } from "@/components/CtaButton";
import { ScrollExpand } from "@/components/ScrollExpand";
import tableLaugh from "@/assets/table-laugh.jpg";
import hands from "@/assets/hands.jpg";
import conversation from "@/assets/conversation.jpg";
import dusk from "@/assets/dusk.jpg";

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
        <nav className="flex w-full max-w-3xl items-center justify-between rounded-full border bg-ivory/85 py-1.5 pl-6 pr-1.5 backdrop-blur-md">
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

function Hero() {
  return (
    <section id="top" className="relative flex min-h-screen flex-col justify-end px-[4vw] pb-16 pt-32">
      <p data-hero="label" className="label-mono mb-8 text-forest">A different kind of connection</p>
      <h1 className="font-display text-[15vw] leading-[0.86] md:text-[11.5vw]">
        <span className="line-mask"><span data-hero="line" className="block">Strangers</span></span>
        <span className="line-mask">
          <span data-hero="line" className="flex items-center gap-[2vw]">
            today.
            <span data-hero="pill" className="inline-block h-[0.62em] w-[1.6em] overflow-hidden rounded-full align-middle">
              <img src={hands} alt="Hands passing a shared plate across a candlelit table" className="size-full object-cover" />
            </span>
          </span>
        </span>
        <span className="line-mask"><span data-hero="line" className="block pl-[12vw] italic text-burgundy">Stories</span></span>
        <span className="line-mask"><span data-hero="line" className="block pl-[12vw]">tomorrow.</span></span>
      </h1>
      <div className="mt-12 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
        <div data-hero="copy" className="max-w-sm">
          <p className="font-display mb-3 text-3xl italic text-forest">Every meet matters.</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Meet people beyond your usual circle. Share a table, discover unexpected perspectives, and make room for connections that matter.
          </p>
        </div>
        <div data-hero="cta"><CtaButton href="/quiz">Discover your next meet</CtaButton></div>
      </div>
    </section>
  );
}

function Statement() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-[4vw] py-32 text-center">
      <h2 className="font-display text-[9vw] leading-[0.95] md:text-[6.5vw]">
        {["Life gets busy.", "Circles get smaller.", "There's always room", "for one more connection."].map((l, i) => (
          <span key={l} className="line-mask">
            <span data-reveal className={`block ${i === 3 ? "italic text-burgundy" : ""}`}>{l}</span>
          </span>
        ))}
      </h2>
      <div className="mt-16"><CtaButton href="/quiz" tone="ink">Find your people</CtaButton></div>
    </section>
  );
}

function Geometry() {
  const frames = ["You, somewhere in your city.", "Five others, just as new here.", "One table. A thousand possibilities."];
  const dots = [
    [-260, -120], [240, -160], [300, 110], [-200, 170], [40, 230],
  ];
  return (
    <section data-geo className="relative h-[300vh] bg-sage">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <svg viewBox="-400 -300 800 600" className="absolute h-[80vh] w-[80vw]" aria-hidden>
          <circle data-ring cx="0" cy="0" r="120" fill="none" stroke="var(--ink)" strokeWidth="1.2" />
          <circle data-you cx="0" cy="0" r="14" fill="var(--burgundy)" />
          {dots.map(([x, y], i) => (
            <circle key={i} data-dot data-x={x} data-y={y} cx="0" cy="0" r="10" fill="var(--ink)" opacity="0" />
          ))}
          <path data-stroke d="M-330 220 C -180 120, -60 280, 80 200 S 300 140, 340 230" fill="none" stroke="var(--forest)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        {frames.map((f, i) => (
          <p key={f} data-frame-text={i} className="absolute bottom-[12vh] font-display text-4xl opacity-0 md:text-6xl">{f}</p>
        ))}
      </div>
    </section>
  );
}

function Collage() {
  const photos = [
    { src: conversation, alt: "Two people smiling over coffee", cls: "left-[2%] top-10 -rotate-6 w-[42%] md:w-[30%]" },
    { src: tableLaugh, alt: "A group laughing around a dinner table", cls: "left-[28%] top-40 rotate-2 w-[50%] md:w-[38%] z-10" },
    { src: dusk, alt: "Friends walking and laughing at dusk", cls: "right-[2%] top-4 rotate-6 w-[40%] md:w-[26%]" },
  ];
  return (
    <section id="stories" className="px-[4vw] py-32">
      <div className="grid gap-10 md:grid-cols-[1fr_1.4fr] md:items-end">
        <h2 className="font-display text-6xl leading-[0.95] md:text-8xl">
          Different lives.<br /><em className="text-forest">One shared table.</em>
        </h2>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground md:justify-self-end">
          Meet people with different stories, unexpected interests, and something new to bring to the conversation.
        </p>
      </div>
      <div className="relative mt-16 h-[70vw] md:h-[46vw]">
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
    ["Tell us about yourself", "Share your interests, preferences, and the kind of people you would enjoy meeting."],
    ["Discover your table", "Explore curated gatherings designed to bring compatible people together."],
    ["Show up and connect", "Meet in person, share a conversation, and leave room for something unexpected."],
  ];
  return (
    <section id="how" className="bg-forest px-[4vw] py-32 text-ivory">
      <h2 className="font-display max-w-4xl text-6xl leading-[0.95] md:text-8xl">
        Making new connections <em className="text-ochre">should feel natural.</em>
      </h2>
      <ol className="mt-20 border-t border-ivory/25">
        {steps.map(([t, d], i) => (
          <li key={t} data-reveal-row className="group grid gap-4 border-b border-ivory/25 py-10 md:grid-cols-[120px_1fr_1fr] md:items-baseline">
            <span className="label-mono text-ochre">0{i + 1}</span>
            <h3 className="font-display text-4xl transition-transform duration-500 group-hover:translate-x-3 md:text-5xl">{t}</h3>
            <p className="max-w-sm text-sm leading-relaxed opacity-80">{d}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Meets() {
  return (
    <section id="meets" className="px-[4vw] py-32">
      <p className="label-mono mb-6 text-muted-foreground">Sample gatherings · illustrative only</p>
      <h2 className="font-display text-6xl leading-[0.95] md:text-8xl">
        Your next favourite<br /><em className="text-burgundy">conversation starts here.</em>
      </h2>
      <div className="mt-20 flex flex-col gap-24">
        {meets.map((m, i) => (
          <article key={m.name} data-reveal-row className={`grid items-center gap-8 md:grid-cols-2 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
            <a href="#join" className="group block overflow-hidden rounded-[2rem]">
              <img src={m.img} alt={m.name} loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-1000 group-hover:scale-105" />
            </a>
            <div className="md:px-12">
              <p className="label-mono text-forest">{m.when} — {m.where}</p>
              <h3 className="font-display mt-4 text-5xl md:text-6xl">{m.name}</h3>
              <p className="mt-4 max-w-sm text-sm text-muted-foreground">{m.desc}</p>
              <a href="#join" className="group label-mono mt-8 inline-flex items-center gap-3 border-b border-ink pb-1">
                Explore this meet <span className="transition-transform duration-500 group-hover:translate-x-2">→</span>
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="join" className="rounded-t-[2.5rem] bg-ink px-[4vw] pb-10 pt-32 text-ivory">
      <p className="label-mono text-ochre">Join Precious Meets</p>
      <h2 className="font-display mt-6 text-[14vw] leading-[0.85] md:text-[10vw]">
        Save me <em className="text-ochre">a seat.</em>
      </h2>
      <div className="mt-12"><CtaButton tone="ivory" href="#meets">Discover your next meet</CtaButton></div>
      <div className="mt-32 flex flex-col justify-between gap-6 border-t border-ivory/20 pt-8 label-mono opacity-70 md:flex-row">
        <span>© 2026 Precious Meets</span>
        <span>Every meet matters.</span>
      </div>
    </footer>
  );
}

function Index() {
  const root = useRef<HTMLDivElement>(null);

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
      if (reduce) return;
      const ease = "expo.out";
      gsap.timeline({ defaults: { ease } })
        .from("[data-nav]", { y: -30, opacity: 0, duration: 1 })
        .from("[data-hero=label]", { y: 16, opacity: 0, duration: 0.8 }, "-=0.6")
        .from("[data-hero=line]", { yPercent: 110, duration: 1.3, stagger: 0.09 }, "-=0.5")
        .from("[data-hero=pill]", { clipPath: "inset(0 50% 0 50% round 999px)", scale: 0.8, duration: 1.2 }, "-=0.9")
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

      // Geometry storytelling
      const stroke = document.querySelector<SVGPathElement>("[data-stroke]");
      const len = stroke?.getTotalLength() ?? 0;
      gsap.set(stroke, { strokeDasharray: len, strokeDashoffset: len });
      const g = gsap.timeline({ scrollTrigger: { trigger: "[data-geo]", start: "top top", end: "bottom bottom", scrub: 1 } });
      g.to("[data-frame-text='0']", { opacity: 1, duration: 0.3 })
        .to("[data-ring]", { attr: { cx: -150 }, duration: 1 }, 0)
        .to("[data-you]", { attr: { cx: -150 }, duration: 1 }, 0)
        .to("[data-frame-text='0']", { opacity: 0, duration: 0.2 }, 1)
        .to("[data-frame-text='1']", { opacity: 1, duration: 0.3 }, 1.1);
      document.querySelectorAll<SVGCircleElement>("[data-dot]").forEach((d, i) => {
        g.to(d, { attr: { cx: Number(d.dataset["x"]), cy: Number(d.dataset["y"]) }, opacity: 1, duration: 0.8 }, 1 + i * 0.08);
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
        g.to(d, { attr: { cx: Math.cos(a) * 120, cy: Math.sin(a) * 120 }, fill: i % 2 ? "var(--ink)" : "var(--burgundy)", duration: 0.8 }, 2.2 + i * 0.05);
      });
      g.to("[data-ring]", { attr: { cx: 0 }, duration: 0.8 }, 2.2)
        .to("[data-you]", { attr: { cx: 0, r: 40 }, duration: 0.8 }, 2.2)
        .to("[data-frame-text='1']", { opacity: 0, duration: 0.2 }, 2.1)
        .to("[data-frame-text='2']", { opacity: 1, duration: 0.3 }, 2.4)
        .to(stroke, { strokeDashoffset: 0, duration: 0.9 }, 2.3);
    }, root);

    return () => {
      ctx.revert();
      if (lenis) gsap.ticker.remove(raf);
      lenis?.destroy();
    };
  }, []);

  return (
    <div ref={root}>
      <Nav />
      <main>
        <Hero />
        <ScrollExpand />
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
