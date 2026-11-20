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
      { title: "The Philosophy · Trust, Safety & Verification | Precious Meets" },
      {
        name: "description",
        content:
          "Why Precious Meets was built: Uncompromising identity verification, curated small-group dinners, and architectural safety for meaningful conversation.",
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
      label: "Curated Group Parity",
      sub: "Balanced Table Chemistry",
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
      label: "Guardian Host Presence",
      sub: "Dedicated On-Site Host",
      icon: <ShieldAlert className="size-4 text-burgundy" />,
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
      feature: "Venue Type & Policy",
      nightlife: "Noisy, crowded clubs and bars",
      apps: "Arbitrary public cafes or lounges",
      precious: "Curated private dining rooms (strictly no clubs)",
      highlight: true,
    },
    {
      feature: "Social Balance & Atmosphere",
      nightlife: "Chaotic crowds, unsolicited approaches",
      apps: "Unpredictable 1-on-1 private risk with strangers",
      precious: "Balanced group dynamic & dedicated table host",
      highlight: true,
    },
    {
      feature: "Atmosphere & Acoustics",
      nightlife: "Ear-splitting music, corporate posturing",
      apps: "Surface-level transactional interrogation",
      precious: "Candlelight, unhurried dining, deep conversation",
      highlight: false,
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
      nightlife: "Bouncers at outer gate only",
      apps: "Support ticket / delayed automated email",
      precious: "Discreet one-tap SOS beacon with on-site host",
      highlight: false,
    },
  ];

  const faqs = [
    {
      q: "How does Precious Meets verify and protect my uploaded Aadhaar card?",
      a: "Every attendee uploads a photo of their official Aadhaar card alongside a matching recent personal photo. Our internal curation team reviews both to verify legal identity and confirm the face match. Your documents are stored in secure encrypted vaults, used solely for safety vetting, and are never shared publicly.",
    },
    {
      q: "Can someone catfish or use someone else's Aadhaar card?",
      a: "Strictly impossible. We mandate dual verification: an official government ID and a matching personal photo. If they do not align, the application is declined immediately. There are zero anonymous guests at our tables.",
    },
    {
      q: "Can someone bring an unverified plus-one to the table?",
      a: "Never. Every attendee sitting at a Precious Meets table must independently pass our Discovery Quiz and ID verification. Zero uninvited drop-ins and zero walk-ins ensure a safe, trusted room.",
    },
    {
      q: "How are Guardian Table Hosts chosen and trained?",
      a: "Our hosts are experienced cultural ambassadors thoroughly background-checked and trained in active conversational moderation, hospitality, and conflict de-escalation.",
    },
    {
      q: "What happens if someone makes an attendee feel uncomfortable?",
      a: "We maintain an uncompromising Zero-Tolerance Code. If any attendee exhibits harassment, invasive questioning, or breaches consent, our host immediately intervenes and escorts them out. That person receives a permanent, Aadhaar-linked lifetime ban.",
    },
    {
      q: "How does the Safety SOS Beacon work during the dinner?",
      a: "From the moment your table begins until you conclude your evening, a discreet SOS button is accessible on your private dashboard to immediately notify your on-site Guardian Host and safety concierge if needed.",
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
              THE PRECIOUS MEETS SAFETY CODE
            </span>
            <VerifiedStampDoodle className="hidden sm:block w-32 h-auto shrink-0 -my-3" />
          </div>

          {/* Majestic Hero Headline */}
          <h1 className="font-display mt-8 text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.02] tracking-tight text-foreground max-w-5xl">
            Connection demands courage.
            <br />
            It starts with{" "}
            <em className="italic text-burgundy font-serif font-normal underline decoration-burgundy/30 underline-offset-8">
              uncompromising safety
            </em>
            .
          </h1>

          {/* Subtitle with High Readability */}
          <p className="mt-8 text-base sm:text-xl lg:text-2xl text-muted-foreground font-light leading-relaxed max-w-3xl">
            Finding authentic connection shouldn't feel exhausting or defensive. Precious Meets was built to create an intentional sanctuary with real-world architectural safety.
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
                THE CONTRAST · NOISE TO SANCTUARY
              </span>
              <h2 className="font-display mt-2 text-3xl sm:text-5xl text-foreground max-w-2xl leading-tight">
                An intentional sanctuary for conversation
              </h2>
            </div>
            <p className="max-w-md text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Meeting new people should never feel unpredictable or unsafe. Here is how our table removes the defensive burden so you can simply enjoy the evening.
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
                Strictly no clubs. Dinners take place in private dining rooms and quiet heritage bistros. Loud music and confined spaces are still to decide to ensure calm acoustics and open room flow.
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
                Balanced group chemistry with equal voices. Conversation is moderated with warmth, emotional curiosity, and mutual respect by our dedicated table host.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-background p-6 shadow-xs">
              <div className="grid size-10 place-items-center rounded-xl bg-ochre/15 text-ochre font-mono text-sm font-bold">
                03
              </div>
              <h3 className="font-display mt-4 text-xl text-foreground">
                Real-World Recourse
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Because every guest is verified with an official Aadhaar Card and matching face photo, zero predatory anonymity exists. Any breach of boundaries triggers a permanent lifetime ban.
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
                  Every attendee uploads their official government Aadhaar card alongside a matching recent personal portrait photo. Our curation team manually audits and cross-matches both to confirm legal name and age before any table seat is confirmed.
                </p>

                <ul className="mt-4 space-y-2 text-xs sm:text-sm text-foreground/90 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-forest shrink-0" />
                    <span>Dual verification: Official Aadhaar Card + matching selfie photo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-forest shrink-0" />
                    <span>Documents stored in private encrypted storage, never shared or made public</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-forest shrink-0" />
                    <span>Cross-checked for legal age and authenticated identity</span>
                  </li>
                </ul>
              </div>

              {/* Doodle Illustration */}
              <div className="mt-8 rounded-2xl bg-ivory/60 border border-border/60 p-4 flex items-center justify-center">
                <DoodleAadhaarVault className="w-full max-w-sm h-auto" />
              </div>
            </div>

            {/* Pillar 2: Balanced Parity & Chemistry */}
            <div className="group rounded-3xl border border-border/80 bg-card p-6 sm:p-8 lg:p-10 shadow-xs hover:border-forest/40 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-3 py-1 text-xs font-mono font-semibold text-forest">
                    <Users className="size-3.5" /> PILLAR 02 · SOCIAL BALANCE
                  </span>
                  <span className="text-[11px] font-mono text-muted-foreground uppercase">
                    Balanced Parity
                  </span>
                </div>

                <h3 className="font-display mt-5 text-2xl sm:text-3xl text-foreground">
                  Table Harmony & Balanced Parity
                </h3>
                <p className="mt-1 text-xs sm:text-sm font-medium text-forest">
                  Equal Voices, Mutual Respect, Zero Isolation
                </p>

                <p className="mt-4 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  Social dinners often suffer from unbalanced dynamics or dominating egos. At Precious Meets, each 6-person dinner table is curated with thoughtful group balance and mutual consideration.
                </p>

                <ul className="mt-4 space-y-2 text-xs sm:text-sm text-foreground/90 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-forest shrink-0" />
                    <span>Curated group balance so no guest ever feels isolated</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-forest shrink-0" />
                    <span>Screened for emotional intelligence and conversational warmth</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-forest shrink-0" />
                    <span>Strict moderation for generous listening and equal airtime</span>
                  </li>
                </ul>
              </div>

              {/* Doodle Illustration */}
              <div className="mt-8 rounded-2xl bg-ivory/60 border border-border/60 p-4 flex items-center justify-center">
                <DoodleTableSanctuary className="w-full max-w-sm h-auto" />
              </div>
            </div>

            {/* Pillar 3: Vetted Enclaves (Strictly No Clubs) */}
            <div className="group rounded-3xl border border-border/80 bg-card p-6 sm:p-8 lg:p-10 shadow-xs hover:border-ochre/40 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-ochre/15 px-3 py-1 text-xs font-mono font-semibold text-ochre">
                    <Shield className="size-3.5" /> PILLAR 03 · VENUES
                  </span>
                  <span className="text-[11px] font-mono text-muted-foreground uppercase">
                    Strictly No Clubs
                  </span>
                </div>

                <h3 className="font-display mt-5 text-2xl sm:text-3xl text-foreground">
                  Curated Private Dining Enclaves
                </h3>
                <p className="mt-1 text-xs sm:text-sm font-medium text-ochre">
                  Protected Spaces, Dedicated Host Presence
                </p>

                <p className="mt-4 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  Strictly no nightclubs, loud bars, or unvetted public chaos. Dinners take place in private dining rooms of vetted heritage bistros. Loud music and confined spaces are actively evaluated to guarantee comfort.
                </p>

                <ul className="mt-4 space-y-2 text-xs sm:text-sm text-foreground/90 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-forest shrink-0" />
                    <span>Venues policy: Strictly no clubs; quiet private dining rooms only</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-forest shrink-0" />
                    <span>Acoustics & layout: Loud music and confined spaces under evaluation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-forest shrink-0" />
                    <span>Dedicated on-site host coordinates smooth arrivals and seating</span>
                  </li>
                </ul>
              </div>

              {/* Doodle Illustration */}
              <div className="mt-8 rounded-2xl bg-ivory/60 border border-border/60 p-4 flex items-center justify-center">
                <DoodleGuardianShield className="w-full max-w-sm h-auto" />
              </div>
            </div>

            {/* Pillar 4: Discreet Safety SOS (Positioned as quiet backstop) */}
            <div className="group rounded-3xl border border-border/80 bg-card p-6 sm:p-8 lg:p-10 shadow-xs hover:border-burgundy/40 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-burgundy/10 px-3 py-1 text-xs font-mono font-semibold text-burgundy">
                    <PhoneCall className="size-3.5" /> PILLAR 04 · QUIET ESCALATION
                  </span>
                  <span className="text-[11px] font-mono text-muted-foreground uppercase">
                    Discreet SOS
                  </span>
                </div>

                <h3 className="font-display mt-5 text-2xl sm:text-3xl text-foreground">
                  Discreet Live Safety Beacon
                </h3>
                <p className="mt-1 text-xs sm:text-sm font-medium text-burgundy">
                  Immediate On-Site Host Alert & Concierge Backstop
                </p>

                <p className="mt-4 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  Attendees have access to a discreet safety beacon on their web dashboard. If at any moment you feel uneasy, one silent tap notifies your on-site Guardian Host without causing public awkwardness.
                </p>

                <ul className="mt-4 space-y-2 text-xs sm:text-sm text-foreground/90 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-forest shrink-0" />
                    <span>Silent, instant notification sent directly to host's device</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-forest shrink-0" />
                    <span>Pre-arranged dignified exit protocol without social friction</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-forest shrink-0" />
                    <span>Live emergency concierge standby throughout the evening</span>
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
                        className="rounded-full border-burgundy/30 text-xs font-semibold text-burgundy hover:bg-burgundy/5 cursor-pointer"
                      >
                        <ShieldAlert className="size-3.5 text-burgundy" /> Safety Beacon Demo
                      </Button>
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Table Architecture & Active Discussion Points */}
          <div className="mt-14 rounded-3xl border border-ochre/35 bg-ochre/5 p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-ochre/20">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-ochre font-bold">
                  POLICY & OPERATIONAL ARCHITECTURE
                </span>
                <h3 className="font-display mt-1 text-2xl sm:text-3xl text-foreground">
                  Standards & Active Discussion Topics
                </h3>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-ochre/15 px-3 py-1 text-xs font-mono font-medium text-ochre">
                <span className="size-2 rounded-full bg-ochre animate-pulse" />
                Under Evaluation
              </span>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              <div className="rounded-2xl border border-ochre/20 bg-background/80 p-5 shadow-xs">
                <span className="font-mono text-xs font-bold text-burgundy uppercase tracking-wider">
                  Table Ratio
                </span>
                <h4 className="font-display mt-2 text-lg text-foreground">
                  Strict 3 Women + 3 Men
                </h4>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  Currently under discussion: Enforcing a strict 3 women and 3 men seating configuration for every 6-person dinner table to maintain absolute gender parity.
                </p>
              </div>

              <div className="rounded-2xl border border-ochre/20 bg-background/80 p-5 shadow-xs">
                <span className="font-mono text-xs font-bold text-forest uppercase tracking-wider">
                  Table Duration
                </span>
                <h4 className="font-display mt-2 text-lg text-foreground">
                  3-Hour Unhurried Dinner
                </h4>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  Currently under discussion: Setting a protected 3-hour dinner window ensuring slow dining, ample pauses, and relaxed, deep conversation without feeling rushed.
                </p>
              </div>

              <div className="rounded-2xl border border-ochre/20 bg-background/80 p-5 shadow-xs">
                <span className="font-mono text-xs font-bold text-ochre uppercase tracking-wider">
                  Venue Selection
                </span>
                <h4 className="font-display mt-2 text-lg text-foreground">
                  Transit Access & Atmosphere
                </h4>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  Strictly no clubs. Loud music and confined spaces are still to decide. Venue criteria prioritizing well-lit, direct transit access for safe arrivals and departures.
                </p>
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
              How Precious Meets Compares
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              An honest comparison between noisy public nightlife, dating apps, and our curated dinner tables.
            </p>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-3xl border border-border/80 bg-card shadow-sm">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border/80 bg-sage/20 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                  <th className="p-4 sm:p-6 font-semibold">Dimension</th>
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
            CURATED DINNER TABLES
          </span>
          <h2 className="font-display mt-4 text-3xl sm:text-5xl lg:text-6xl text-ivory leading-tight">
            Your seat is protected.
            <br />
            Your evening is sacred.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-sm sm:text-base text-ivory/80 leading-relaxed font-light">
            Take our 9-question Social Discovery Quiz today. Complete basic contact details to unlock your verified seat at our next table.
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
