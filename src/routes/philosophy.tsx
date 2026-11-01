import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SosModal } from "@/components/SosModal";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Users,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  ArrowRight,
  Shield,
  HeartHandshake,
  MapPin,
  PhoneCall,
  KeyRound,
  UserCheck,
  Compass,
} from "lucide-react";

import { DoodleAadhaarVault } from "@/components/philosophy/doodles/DoodleAadhaarVault";
import { DoodleTableSanctuary } from "@/components/philosophy/doodles/DoodleTableSanctuary";
import { DoodleGuardianShield } from "@/components/philosophy/doodles/DoodleGuardianShield";
import { DoodleSosBeacon } from "@/components/philosophy/doodles/DoodleSosBeacon";
import { DoodleDelhiChaosToCalm } from "@/components/philosophy/doodles/DoodleDelhiChaosToCalm";
import {
  VerifiedStampDoodle,
  WaxSealDoodle,
  SketchArrowDoodle,
} from "@/components/philosophy/doodles/EditorialAnnotations";

export const Route = createFileRoute("/philosophy")({
  head: () => ({
    meta: [
      { title: "The Philosophy — Women's Safety & Aadhaar Verification | Precious Meets" },
      {
        name: "description",
        content:
          "Why Precious Meets was built: Uncompromising women-first security, 100% Offline Aadhaar verification, and intimate dinner tables for Delhi NCR.",
      },
    ],
  }),
  component: PhilosophyPage,
});

export function PhilosophyPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const lenis = new Lenis({
      lerp: 0.1,
      duration: 1.2,
      smoothWheel: true,
    });

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const proofMetrics = [
    {
      metric: "100%",
      label: "Aadhaar ID Vetted",
      sub: "Government ID & Face Match",
      icon: <Lock className="size-4 text-burgundy" />,
    },
    {
      metric: "50:50",
      label: "Guaranteed Gender Parity",
      sub: "No Woman Left Isolated",
      icon: <Users className="size-4 text-forest" />,
    },
    {
      metric: "0",
      label: "Public Profile Exposure",
      sub: "Private & Encrypted Vetting",
      icon: <ShieldCheck className="size-4 text-ochre" />,
    },
    {
      metric: "< 180s",
      label: "Guardian Host Response",
      sub: "Live 24/7 Safety Beacon",
      icon: <ShieldAlert className="size-4 text-red-600" />,
    },
  ];

  const comparisonRows = [
    {
      feature: "Identity Verification Rigor",
      nightlife: "None (Entry by ticket or cover charge)",
      apps: "Easily faked selfies / burner phone OTP",
      precious: "100% Aadhaar Card & Face-Match Audit",
      highlight: true,
    },
    {
      feature: "Security & Comfort for Women",
      nightlife: "Chaotic crowds, persistent unsolicited approaches",
      apps: "Unpredictable 1-on-1 private risk with strangers",
      precious: "Guaranteed 50:50 balance & present guardian host",
      highlight: true,
    },
    {
      feature: "Misconduct Accountability",
      nightlife: "Total anonymity; zero legal recourse",
      apps: "Banned profiles easily remade in 2 minutes",
      precious: "Permanent Aadhaar-linked lifetime ban",
      highlight: true,
    },
    {
      feature: "Emergency Escalation",
      nightlife: "Busy bouncers at outer club gate only",
      apps: "Support ticket / delayed automated email",
      precious: "Discreet one-tap SOS beacon with on-site host",
      highlight: true,
    },
    {
      feature: "Atmosphere & Acoustics",
      nightlife: "Ear-splitting music, corporate posturing",
      apps: "Surface-level transactional interrogation",
      precious: "Candlelight, unhurried wine, intellectual depth",
      highlight: false,
    },
    {
      feature: "Venue Exclusivity",
      nightlife: "Open public chaos with zero screening",
      apps: "Arbitrary public cafes or private lounges",
      precious: "Vetted heritage bistros (Mehrauli, HKV, Khan Mkt)",
      highlight: false,
    },
  ];

  const faqs = [
    {
      q: "How does Precious Meets verify and protect my uploaded Aadhaar card?",
      a: "Every attendee uploads a clear photo or document of their official Aadhaar card alongside a matching recent personal portrait photo. Our internal curation team reviews both to verify legal full name, age, and Delhi NCR residence while confirming that the face matches the ID. Your documents are stored in secure encrypted storage, used exclusively for safety vetting, and are NEVER shown publicly to other guests or sold to third parties.",
    },
    {
      q: "Can someone catfish or use someone else's Aadhaar card?",
      a: "Strictly impossible. We mandate dual verification: the attendee must upload their official Aadhaar card AND a current selfie/portrait. If the face in the personal portrait does not match the photo on the government ID, the application is immediately declined. There are zero anonymous profiles and zero fake personas at our tables.",
    },
    {
      q: "Can someone bring an unverified plus-one to the table?",
      a: "Never. Every single person sitting at a Precious Meets table must independently complete our Social Discovery Quiz and pass our Aadhaar ID and face-match verification. There are zero exceptions, zero uninvited drop-ins, and zero walk-ins. This absolute screening is why our tables are Delhi's safest spaces.",
    },
    {
      q: "How are Guardian Table Hosts chosen and trained?",
      a: "Our hosts are experienced cultural ambassadors and hospitality veterans thoroughly background-checked and trained in active conversational moderation and conflict de-escalation. They coordinate smooth arrivals, foster natural introductions, and immediately enforce our zero-tolerance safety code.",
    },
    {
      q: "What happens if someone makes an attendee feel uncomfortable?",
      a: "We maintain an uncompromising Zero-Tolerance Code. If any attendee exhibits predatory behavior, non-consensual contact, harassment, or invasive interrogation, our host immediately intervenes and escorts them out. That person receives an irreversible, Aadhaar-linked lifetime ban from all future tables.",
    },
    {
      q: "How does the 24/7 Safety SOS Beacon work during the dinner?",
      a: "From the moment your table begins until you safely reach home, a discreet SOS button is live on your private member dashboard. Tapping it instantly pings your on-site Guardian Host, alerts our emergency concierge, and can notify your designated emergency contacts with live venue coordinates.",
    },
  ];

  return (
    <div ref={containerRef} className="flex min-h-screen w-full flex-col bg-ivory text-foreground selection:bg-burgundy/20">
      <Navbar />

      {/* ========================================================================= */}
      {/* 1. HERO MANIFESTO (Full-Width High-Impact Statement)                      */}
      {/* ========================================================================= */}
      <section className="relative w-full border-b border-border/70 bg-gradient-to-b from-card/80 via-ivory to-ivory pt-32 pb-20 px-6 sm:px-12 lg:px-20 overflow-hidden">
        {/* Subtle decorative background watermarks */}
        <div className="absolute top-12 right-12 opacity-5 pointer-events-none select-none">
          <Shield className="size-96 text-burgundy" />
        </div>

        <div className="mx-auto max-w-7xl">
          {/* Pre-title Badge Pill */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-burgundy/25 bg-burgundy/5 px-4 py-1.5 text-xs font-mono uppercase tracking-widest text-burgundy">
              <span className="size-2 rounded-full bg-burgundy animate-pulse" />
              THE PRECIOUS MEETS SAFETY CODE · DELHI NCR
            </span>
            <VerifiedStampDoodle className="hidden sm:block w-32 h-auto shrink-0 -my-3" />
          </div>

          {/* Majestic Hero Headline */}
          <h1 className="font-display mt-8 text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.02] tracking-tight text-foreground max-w-5xl">
            Connection demands courage.
            <br />
            In Delhi, it demands{" "}
            <em className="italic text-burgundy font-serif font-normal underline decoration-burgundy/30 underline-offset-8">
              uncompromising safety
            </em>
            .
          </h1>

          {/* Subtitle with High Readability */}
          <p className="mt-8 text-base sm:text-xl lg:text-2xl text-muted-foreground font-light leading-relaxed max-w-3xl">
            Delhi is an electric metropolis of 33 million stories, yet finding safe, authentic connection often feels exhausting—especially for women. Precious Meets was built to dismantle that exhaustion with real-world architectural safety.
          </p>

          {/* 4-Metric Proof Ribbon (Full-Width Responsive Grid) */}
          <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-6 border-t border-border/80">
            {proofMetrics.map((item, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl border border-border/80 bg-card/90 p-5 sm:p-6 shadow-xs hover:border-burgundy/40 hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground group-hover:text-burgundy transition-colors">
                    {item.metric}
                  </span>
                  <div className="grid size-9 place-items-center rounded-xl bg-sage/30">
                    {item.icon}
                  </div>
                </div>
                <h4 className="mt-3 text-xs sm:text-sm font-semibold text-foreground">
                  {item.label}
                </h4>
                <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
                  {item.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. THE URBAN REALITY VS. THE SANCTUARY (Full-Width Split Showcase)        */}
      {/* ========================================================================= */}
      <section className="w-full bg-card/60 py-20 px-6 sm:px-12 lg:px-20 border-b border-border/70">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div>
              <span className="label-mono text-xs uppercase tracking-widest text-forest font-bold">
                THE CONTRAST · URBAN EXHAUSTION TO PEACE
              </span>
              <h2 className="font-display mt-2 text-3xl sm:text-5xl text-foreground max-w-2xl leading-tight">
                Why Delhi needs an intentional sanctuary for dinner
              </h2>
            </div>
            <p className="max-w-md text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Every woman living in Delhi NCR understands the mental calculus of an evening out. Here is how our table removes that defensive burden forever.
            </p>
          </div>

          {/* Panoramic Transformation Doodle Art */}
          <div className="rounded-3xl border border-border/90 bg-ivory/80 p-4 sm:p-8 shadow-xs">
            <DoodleDelhiChaosToCalm className="w-full h-auto" />
          </div>

          {/* The 3 Sacred Guarantees */}
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-border/80 bg-background p-6 shadow-xs">
              <div className="grid size-10 place-items-center rounded-xl bg-burgundy/10 text-burgundy font-mono text-sm font-bold">
                01
              </div>
              <h3 className="font-display mt-4 text-xl text-foreground">
                Physical Sanctuary
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                No loud decibels, no rowdy public bar crowds, and no unvetted outsiders. Dinners take place in reserved private enclaves in Mehrauli, Hauz Khas, and Central Delhi.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-background p-6 shadow-xs">
              <div className="grid size-10 place-items-center rounded-xl bg-forest/10 text-forest font-mono text-sm font-bold">
                02
              </div>
              <h3 className="font-display mt-4 text-xl text-foreground">
                Social Sanctuary
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Strict 50:50 gender balance means women never feel outnumbered or trapped in male-dominated banter. Conversation is moderated with warmth, emotional intelligence, and equal airtime.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-background p-6 shadow-xs">
              <div className="grid size-10 place-items-center rounded-xl bg-ochre/15 text-ochre font-mono text-sm font-bold">
                03
              </div>
              <h3 className="font-display mt-4 text-xl text-foreground">
                Legal & Real-World Recourse
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Because every attendee is verified with their official Aadhaar Card and matching face photo, zero predatory anonymity exists. Any breach of consent triggers an irreversible lifetime ban.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. THE 4 PILLARS OF ARCHITECTURAL SAFETY (Full-Width Bento Grid)          */}
      {/* ========================================================================= */}
      <section className="w-full py-24 px-6 sm:px-12 lg:px-20 border-b border-border/70">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="label-mono text-xs uppercase tracking-widest text-burgundy font-bold">
              THE FOUR SACRED PILLARS
            </span>
            <h2 className="font-display mt-3 text-3xl sm:text-5xl lg:text-6xl text-foreground leading-tight">
              Architectural Safety in Every Detail
            </h2>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
              Real safety is not a marketing promise; it is an engineering protocol enforced before, during, and after every curated dinner.
            </p>
          </div>

          {/* 2x2 Full-Width Bento Grid with Bespoke Doodle Arts */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Pillar 1: 100% Aadhaar Card & Face-Match Verification */}
            <div className="group rounded-3xl border border-border/80 bg-card p-6 sm:p-8 lg:p-10 shadow-xs hover:border-burgundy/40 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-burgundy/10 px-3 py-1 text-xs font-mono font-semibold text-burgundy">
                    <KeyRound className="size-3.5" /> PILLAR 01 · IDENTITY
                  </span>
                  <span className="text-[11px] font-mono text-muted-foreground uppercase">
                    Govt ID & Face Match
                  </span>
                </div>

                <h3 className="font-display mt-5 text-2xl sm:text-3xl text-foreground">
                  Aadhaar ID & Face-Match Vetting
                </h3>
                <p className="mt-1 text-xs sm:text-sm font-medium text-burgundy">
                  The Complete End of Predatory Anonymity
                </p>

                <p className="mt-4 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  Every attendee uploads their official government Aadhaar card alongside a matching recent personal portrait photo. Our curation team manually audits and cross-matches both to confirm legal name, age, and Delhi NCR residence before any table seat is confirmed.
                </p>

                <ul className="mt-4 space-y-2 text-xs sm:text-sm text-foreground/90 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-forest shrink-0" />
                    <span>Dual verification: Official Aadhaar Card + matching selfie photo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-forest shrink-0" />
                    <span>Documents stored in private encrypted storage—never shared or made public</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-forest shrink-0" />
                    <span>Cross-checked against Delhi NCR residence and legal age</span>
                  </li>
                </ul>
              </div>

              {/* Doodle Illustration */}
              <div className="mt-8 rounded-2xl bg-ivory/60 border border-border/60 p-4 flex items-center justify-center">
                <DoodleAadhaarVault className="w-full max-w-sm h-auto" />
              </div>
            </div>

            {/* Pillar 2: 50:50 Gender Parity */}
            <div className="group rounded-3xl border border-border/80 bg-card p-6 sm:p-8 lg:p-10 shadow-xs hover:border-forest/40 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-3 py-1 text-xs font-mono font-semibold text-forest">
                    <Users className="size-3.5" /> PILLAR 02 · SOCIAL BALANCE
                  </span>
                  <span className="text-[11px] font-mono text-muted-foreground uppercase">
                    Strict 50:50 Parity
                  </span>
                </div>

                <h3 className="font-display mt-5 text-2xl sm:text-3xl text-foreground">
                  Women-First Seating Parity
                </h3>
                <p className="mt-1 text-xs sm:text-sm font-medium text-forest">
                  Equal Voices, Mutual Respect, Zero Isolation
                </p>

                <p className="mt-4 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  Delhi's nightlife often leaves women on high alert in male-dominated rooms. At Precious Meets, every 6-person dinner table is curated with exact 50:50 gender parity.
                </p>

                <ul className="mt-4 space-y-2 text-xs sm:text-sm text-foreground/90 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-forest shrink-0" />
                    <span>Strict 3 women and 3 men seating configuration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-forest shrink-0" />
                    <span>No single woman is ever left isolated at a table</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-forest shrink-0" />
                    <span>Screened for emotional intelligence and conversational warmth</span>
                  </li>
                </ul>
              </div>

              {/* Doodle Illustration */}
              <div className="mt-8 rounded-2xl bg-ivory/60 border border-border/60 p-4 flex items-center justify-center">
                <DoodleTableSanctuary className="w-full max-w-sm h-auto" />
              </div>
            </div>

            {/* Pillar 3: Vetted Enclaves & Guardian Hosts */}
            <div className="group rounded-3xl border border-border/80 bg-card p-6 sm:p-8 lg:p-10 shadow-xs hover:border-ochre/40 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-ochre/15 px-3 py-1 text-xs font-mono font-semibold text-ochre">
                    <Shield className="size-3.5" /> PILLAR 03 · CUSTODIANSHIP
                  </span>
                  <span className="text-[11px] font-mono text-muted-foreground uppercase">
                    Dedicated Host on Site
                  </span>
                </div>

                <h3 className="font-display mt-5 text-2xl sm:text-3xl text-foreground">
                  Vetted Enclaves & Guardian Hosts
                </h3>
                <p className="mt-1 text-xs sm:text-sm font-medium text-ochre">
                  Protected Spaces, Dedicated Presence
                </p>

                <p className="mt-4 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  No public commotion. Dinners take place in private dining rooms of reputable heritage restaurants in Mehrauli, Hauz Khas Village, and Central Delhi. Dedicated hosts preside throughout the evening.
                </p>

                <ul className="mt-4 space-y-2 text-xs sm:text-sm text-foreground/90 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-forest shrink-0" />
                    <span>Host coordinates smooth arrival, introductions, and seating</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-forest shrink-0" />
                    <span>Private, well-lit spaces with verified transit access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-forest shrink-0" />
                    <span>Discreet intervention if boundaries or comfort are challenged</span>
                  </li>
                </ul>
              </div>

              {/* Doodle Illustration */}
              <div className="mt-8 rounded-2xl bg-ivory/60 border border-border/60 p-4 flex items-center justify-center">
                <DoodleGuardianShield className="w-full max-w-sm h-auto" />
              </div>
            </div>

            {/* Pillar 4: 24/7 Safety SOS Beacon */}
            <div className="group rounded-3xl border border-border/80 bg-card p-6 sm:p-8 lg:p-10 shadow-xs hover:border-red-500/40 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 dark:bg-red-950/40 px-3 py-1 text-xs font-mono font-semibold text-red-600">
                    <PhoneCall className="size-3.5" /> PILLAR 04 · EMERGENCY ESCALATION
                  </span>
                  <span className="text-[11px] font-mono text-muted-foreground uppercase">
                    24/7 Live Helpline
                  </span>
                </div>

                <h3 className="font-display mt-5 text-2xl sm:text-3xl text-foreground">
                  Discreet Live SOS Beacon
                </h3>
                <p className="mt-1 text-xs sm:text-sm font-medium text-red-600">
                  One-Tap Immediate On-Site & Helpline Trigger
                </p>

                <p className="mt-4 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  Every attendee possesses an active safety beacon in their web dashboard. If you ever feel uneasy, one discreet tap immediately alerts your on-site host and our emergency response concierge.
                </p>

                <ul className="mt-4 space-y-2 text-xs sm:text-sm text-foreground/90 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-forest shrink-0" />
                    <span>Instant silent notification sent directly to host's device</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-forest shrink-0" />
                    <span>Live venue coordinate link dispatch to personal emergency contacts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-forest shrink-0" />
                    <span>Pre-arranged dignified exit protocol without social awkwardness</span>
                  </li>
                </ul>
              </div>

              {/* Doodle Illustration & Test SOS Button */}
              <div className="mt-8 rounded-2xl bg-ivory/60 border border-border/60 p-4 flex flex-col items-center justify-center">
                <DoodleSosBeacon className="w-full max-w-sm h-auto" />
                <div className="mt-4">
                  <SosModal
                    triggerButton={
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full border-red-500/40 text-xs font-semibold text-red-600 hover:bg-red-50 cursor-pointer"
                      >
                        <ShieldAlert className="size-3.5 text-red-600" /> Test Live Safety Beacon Demo
                      </Button>
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. THE ATTENDEE SAFETY LIFECYCLE (Visual 4-Step Horizontal Roadmap)       */}
      {/* ========================================================================= */}
      <section className="w-full bg-card/60 py-20 px-6 sm:px-12 lg:px-20 border-b border-border/70">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="label-mono text-xs uppercase tracking-widest text-forest font-bold">
              ATTENDEE VERIFICATION LIFECYCLE
            </span>
            <h2 className="font-display mt-2 text-3xl sm:text-4xl lg:text-5xl text-foreground">
              How You Are Protected from RSVP to Midnight
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              A transparent, step-by-step roadmap demonstrating how every dinner guest is vetted and supported.
            </p>
          </div>

          {/* 4-Step Cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Step 1 */}
            <div className="rounded-2xl border border-border/80 bg-background p-6 shadow-xs relative">
              <span className="font-mono text-3xl font-extrabold text-burgundy/30">01</span>
              <h4 className="font-display mt-2 text-lg text-foreground">
                Social Discovery Quiz
              </h4>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                9 questions evaluating your conversational archetype, dietary requirements, and intellectual passions for balanced table chemistry.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl border border-border/80 bg-background p-6 shadow-xs relative">
              <span className="font-mono text-3xl font-extrabold text-forest/30">02</span>
              <h4 className="font-display mt-2 text-lg text-foreground">
                Aadhaar & Photo Audit
              </h4>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                Uploaded Aadhaar Card and matching personal selfie photo are audited by our curation team to confirm real identity. Zero fake accounts, zero catfishing.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl border border-border/80 bg-background p-6 shadow-xs relative">
              <span className="font-mono text-3xl font-extrabold text-ochre/30">03</span>
              <h4 className="font-display mt-2 text-lg text-foreground">
                Secret Enclave Reveal
              </h4>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                Table balance is locked at 50:50. Verified venue coordinates and host details are released 24 hours prior to prevent uninvited outsiders.
              </p>
            </div>

            {/* Step 4 */}
            <div className="rounded-2xl border border-border/80 bg-background p-6 shadow-xs relative">
              <span className="font-mono text-3xl font-extrabold text-red-600/30">04</span>
              <h4 className="font-display mt-2 text-lg text-foreground">
                Guardian Dinner Evening
              </h4>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                Warm host welcome, 3-hour unhurried dinner, equal voices, and active discreet 24/7 SOS safety beacon until you safely reach home.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. CONFIDENT COMPARISON BOARD (Full-Width Editorial Matrix)               */}
      {/* ========================================================================= */}
      <section className="w-full py-24 px-6 sm:px-12 lg:px-20 border-b border-border/70">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="label-mono text-xs uppercase tracking-widest text-burgundy font-bold">
              DEFINITIVE CONTRAST
            </span>
            <h2 className="font-display mt-2 text-3xl sm:text-5xl text-foreground">
              How Precious Meets Compares in Delhi
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              An uncompromising, honest comparison between standard Delhi social nightlife, dating apps, and the Precious Meets sanctuary.
            </p>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-3xl border border-border/80 bg-card shadow-sm">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border/80 bg-sage/20 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                  <th className="p-4 sm:p-6 font-semibold">Safety Dimension</th>
                  <th className="p-4 sm:p-6 font-semibold">Public Bars & Clubs</th>
                  <th className="p-4 sm:p-6 font-semibold">Dating & Social Apps</th>
                  <th className="p-4 sm:p-6 font-bold bg-burgundy/10 text-burgundy">
                    ★ Precious Meets Table
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className="transition-colors hover:bg-sage/10">
                    <td className="p-4 sm:p-6 font-semibold text-foreground">
                      {row.feature}
                    </td>
                    <td className="p-4 sm:p-6 text-muted-foreground">
                      <span className="inline-block text-red-500 mr-1.5 font-bold">✕</span>
                      {row.nightlife}
                    </td>
                    <td className="p-4 sm:p-6 text-muted-foreground">
                      <span className="inline-block text-amber-500 mr-1.5 font-bold">△</span>
                      {row.apps}
                    </td>
                    <td className="p-4 sm:p-6 font-medium text-forest bg-burgundy/5">
                      <span className="inline-block text-forest mr-1.5 font-bold">✓</span>
                      {row.precious}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. THE CODE OF THE TABLE & BLACKLIST CHARTER                              */}
      {/* ========================================================================= */}
      <section className="w-full bg-card/60 py-24 px-6 sm:px-12 lg:px-20 border-b border-border/70">
        <div className="mx-auto max-w-7xl">
          {/* Official Signed Charter Container */}
          <div className="relative rounded-3xl border-2 border-border/90 bg-ivory p-8 sm:p-12 lg:p-16 shadow-md overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-border/70">
              <div>
                <span className="label-mono text-xs uppercase tracking-widest text-burgundy font-bold">
                  COMMUNITY CONSTITUTION
                </span>
                <h2 className="font-display mt-2 text-3xl sm:text-5xl text-foreground">
                  The Four Sacred Table Agreements
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-xl">
                  Every attendee signs off on these non-negotiable principles before their first dinner.
                </p>
              </div>

              {/* Wax Seal Graphic */}
              <div className="shrink-0 flex items-center gap-3">
                <WaxSealDoodle className="w-16 sm:w-20 h-auto" />
                <div className="text-right hidden sm:block">
                  <p className="font-mono text-xs font-bold text-burgundy uppercase">Aadhaar Verified</p>
                  <p className="font-mono text-[10px] text-muted-foreground">Strictly Enforced</p>
                </div>
              </div>
            </div>

            {/* 4 Core Agreements Grid */}
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-burgundy">01</span>
                  <h4 className="font-display text-xl text-foreground">Total Respect & Discretion</h4>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pl-6">
                  Personal stories, vulnerabilities, and viewpoints shared at the table stay at the table. Zero uninvited touch, zero invasive interrogation, and zero non-consensual contact.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-burgundy">02</span>
                  <h4 className="font-display text-xl text-foreground">Zero Commercial Pitching</h4>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pl-6">
                  Leave investor pitch decks, real estate brochures, and corporate networking business cards at home. We gather to discover who you are as a human, not your sales quota.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-burgundy">03</span>
                  <h4 className="font-display text-xl text-foreground">Generous & Equal Listening</h4>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pl-6">
                  Nobody dominates the airtime. Everyone is given space to speak, question, and ponder in an unhurried, warm conversational cadence moderated by our host.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-red-600">04</span>
                  <h4 className="font-display text-xl text-red-600">Permanent Lifetime Blacklist</h4>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pl-6">
                  Any breach of consent, safety, or misconduct results in immediate, permanent Aadhaar-linked expulsion from all future tables across all cities. There is zero second chance for safety violations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. COMMUNITY SAFETY FAQS (Interactive Accordion)                          */}
      {/* ========================================================================= */}
      <section className="w-full py-24 px-6 sm:px-12 lg:px-20 border-b border-border/70">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <span className="label-mono text-xs uppercase tracking-widest text-forest font-bold">
              TRANSPARENCY FIRST
            </span>
            <h2 className="font-display mt-2 text-3xl sm:text-5xl text-foreground">
              Frequently Asked Safety Questions
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Clear, transparent answers to how we protect your legal identity, data privacy, and physical peace of mind.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="flex w-full items-center justify-between p-5 sm:p-6 text-left cursor-pointer hover:bg-sage/10 transition-colors"
                  >
                    <span className="font-display text-base sm:text-lg text-foreground pr-4">
                      {faq.q}
                    </span>
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-sage/30 text-muted-foreground">
                      {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm leading-relaxed text-muted-foreground border-t border-border/60">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. MAJESTIC CALL TO ACTION (Full-Bleed Luxury Banner)                     */}
      {/* ========================================================================= */}
      <section className="w-full bg-gradient-to-br from-[#2D0D17] via-[#1F070F] to-[#120308] py-24 px-6 sm:px-12 lg:px-20 text-ivory text-center">
        <div className="mx-auto max-w-4xl">
          <span className="label-mono text-xs uppercase tracking-widest text-[#C8963E] font-bold">
            CURATED DELHI NCR DINNER TABLES
          </span>
          <h2 className="font-display mt-4 text-3xl sm:text-5xl lg:text-6xl text-ivory leading-tight">
            Your seat is protected.
            <br />
            Your evening is sacred.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-sm sm:text-base text-ivory/80 leading-relaxed font-light">
            Take our 9-question Social Discovery Quiz today. Complete basic contact details to unlock your verified seat in Delhi NCR.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/quiz"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#C8963E] to-[#E5C17D] px-8 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#171514] shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              Take the Discovery Quiz <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/experiences"
              className="inline-flex items-center gap-2 rounded-full border border-ivory/30 bg-ivory/10 px-7 py-4 text-xs sm:text-sm font-semibold uppercase tracking-wider text-ivory hover:bg-ivory/20 transition-all cursor-pointer"
            >
              Explore Upcoming Meets
            </Link>
          </div>

          <div className="mt-10 flex items-center justify-center gap-2 text-xs text-ivory/60">
            <ShieldCheck className="size-4 text-[#C8963E]" />
            <span>Aadhaar ID & Face-Match Verification · Encrypted & Never Shared</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
