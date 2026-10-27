import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SosModal } from "@/components/SosModal";
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Users,
  CheckCircle2,
  Sparkles,
  MapPin,
  HeartHandshake,
  EyeOff,
  Flame,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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

  useEffect(() => {
    const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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

  const pillars = [
    {
      num: "01",
      icon: <Lock className="size-6 text-[#C6A568]" />,
      title: "100% Offline Aadhaar Verification",
      subtitle: "The End of Predatory Anonymity",
      desc: "Every single attendee verifies their legal identity via DigiLocker Offline Aadhaar XML before their first table invitation is issued. In accordance with UIDAI privacy regulations, we never store biometric data or raw 12-digit numbers. Cryptographic verification guarantees zero fake profiles, zero catfishing, and total real-world accountability.",
      badge: "UIDAI / DigiLocker Standard",
    },
    {
      num: "02",
      icon: <Users className="size-6 text-[#5F7045]" />,
      title: "Women-First Seating Balance",
      subtitle: "No Isolation, Equal Voices",
      desc: "Delhi's nightlife often leaves women on guard in chaotic, male-dominated rooms. At Precious Meets, every 6-person table is curated with strict 50:50 gender parity. We screen for conversational warmth and emotional intelligence so women can lean back, speak freely, and share stories without defensive barriers.",
      badge: "50:50 Gender Parity",
    },
    {
      num: "03",
      icon: <ShieldCheck className="size-6 text-[#691C35]" />,
      title: "Vetted Enclaves & Guardian Hosts",
      subtitle: "Safe Spaces, Present Custodians",
      desc: "No public chaos. Our dinners take place in reputable restaurants and cafes in Mehrauli, Hauz Khas, and Central Delhi. Dedicated table hosts remain present throughout the evening to guide conversational tempo and immediately enforce our zero-tolerance code.",
      badge: "Dedicated Host on Site",
    },
  ];

  const comparisonRows = [
    {
      feature: "Identity Verification",
      nightlife: "None (Entry by cover charge)",
      apps: "Unverified selfie / phone OTP",
      precious: "100% DigiLocker Offline Aadhaar XML",
    },
    {
      feature: "Security for Women",
      nightlife: "Crowded clubs, unwanted advances",
      apps: "Unpredictable 1-on-1 private risk",
      precious: "Safe 6-person dinner table with verified host",
    },
    {
      feature: "Attendee Accountability",
      nightlife: "Total anonymity; zero recourse",
      apps: "Easily discarded burner profiles",
      precious: "Permanent Aadhaar-linked lifetime ban for misconduct",
    },
    {
      feature: "Emergency Escalation",
      nightlife: "Bouncers at main gate only",
      apps: "In-app support ticket / delayed email",
      precious: "Instant 24/7 Safety SOS beacon with live host response",
    },
    {
      feature: "Conversational Atmosphere",
      nightlife: "Blaring decibels, corporate flexing",
      apps: "Awkward surface small talk",
      precious: "Candlelight, unhurried wine, genuine depth",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-ivory text-foreground">
      <Navbar />

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 pb-28 pt-28">
        {/* Breadcrumb Pill */}
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-burgundy/20 bg-burgundy/5 px-4 py-1.5 text-xs font-mono uppercase tracking-widest text-burgundy">
            <ShieldCheck className="size-3.5 text-burgundy" /> The Precious Meets Manifesto & Safety Code
          </span>

          <h1 className="font-display mt-6 text-4xl sm:text-6xl md:text-7xl leading-[1.05] tracking-tight">
            Connection demands courage.<br />
            In Delhi, it demands <em className="italic text-burgundy font-serif">uncompromising safety</em>.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-muted-foreground">
            Delhi is an electric metropolis of 33 million stories, yet finding safe, authentic human connection often feels exhausting, especially for women. Here is why Precious Meets was born, and the sacred safety architecture that protects every seat.
          </p>
        </div>

        {/* The Delhi Context Section */}
        <div className="mt-16 overflow-hidden rounded-3xl border border-border/80 bg-card p-8 sm:p-12 shadow-sm">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <span className="label-mono text-xs uppercase text-forest font-semibold">
                The Urban Reality
              </span>
              <h2 className="font-display mt-2 text-3xl sm:text-4xl text-foreground">
                Why Delhi Needs an Unconditional Safe Space for Women
              </h2>
              <div className="mt-4 space-y-3.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                <p>
                  Every woman living in Delhi NCR understands the invisible mental calculus of an evening out: calculating travel routes before dark, checking exit doors, enduring unsolicited glances, and having to stay constantly guarded.
                </p>
                <p>
                  Dating apps and public nightlife have amplified this exhaustion. Anonymous profiles allow bad actors to hide behind false identities, while crowded bars make meaningful dialogue impossible.
                </p>
                <p className="font-bold text-foreground text-sm sm:text-base leading-relaxed">
                  Precious Meets replaces that exhaustion with architectural safety. We believe you shouldn't have to sacrifice your peace of mind simply to share an inspiring dinner with interesting people.
                </p>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl border-2 border-burgundy/20 bg-burgundy/5 p-6 text-center">
                <div className="mx-auto grid size-16 place-items-center rounded-full bg-burgundy/15 text-burgundy">
                  <ShieldCheck className="size-9" />
                </div>
                <h3 className="font-display mt-4 text-2xl text-foreground">
                  Zero Anonymous Guests
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Every attendee at our table is legally verified via DigiLocker Offline Aadhaar XML. No fake names. No burner numbers. Total accountability.
                </p>
                <div className="mt-6 flex justify-center">
                  <SosModal
                    triggerButton={
                      <Button
                        variant="outline"
                        className="rounded-full border-burgundy/40 text-xs font-semibold text-burgundy hover:bg-burgundy/10"
                      >
                        <ShieldAlert className="size-3.5" /> Test Our Live Safety Beacon
                      </Button>
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Three Safety Pillars */}
        <div className="mt-20">
          <div className="text-center max-w-xl mx-auto">
            <span className="label-mono text-xs uppercase text-forest font-semibold">
              The Security Architecture
            </span>
            <h2 className="font-display mt-2 text-3xl sm:text-5xl text-foreground">
              Three Pillars of Protection
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Every meet in Delhi NCR operates under strict real-world protocols enforced from the moment you RSVP through the curated evening.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {pillars.map((pillar) => (
              <div
                key={pillar.num}
                className="group relative flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-8 shadow-sm transition-all duration-300 hover:border-burgundy/50 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="grid size-12 place-items-center rounded-2xl bg-sage/30">
                      {pillar.icon}
                    </div>
                    <span className="label-mono text-xs font-bold text-muted-foreground/60">
                      PILLAR {pillar.num}
                    </span>
                  </div>

                  <span className="mt-6 inline-block rounded-full bg-sage/50 px-3 py-1 text-[10px] font-mono font-semibold text-forest">
                    {pillar.badge}
                  </span>

                  <h3 className="font-display mt-3 text-2xl text-foreground">
                    {pillar.title}
                  </h3>
                  <p className="text-xs font-medium text-burgundy">
                    {pillar.subtitle}
                  </p>

                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rigorous Comparison Table */}
        <div className="mt-24">
          <div className="text-center max-w-xl mx-auto">
            <span className="label-mono text-xs uppercase text-forest font-semibold">
              Clear Differentiation
            </span>
            <h2 className="font-display mt-2 text-3xl sm:text-4xl text-foreground">
              How Precious Meets Compares in Delhi
            </h2>
            <p className="mt-2 text-xs text-muted-foreground">
              An objective contrast between standard Delhi social venues, dating apps, and our table.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto rounded-3xl border border-border/80 bg-card shadow-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border/80 bg-sage/20 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                  <th className="p-4 sm:p-5">Dimension</th>
                  <th className="p-4 sm:p-5">Public Bars & Clubs</th>
                  <th className="p-4 sm:p-5">Social / Dating Apps</th>
                  <th className="p-4 sm:p-5 bg-burgundy/10 text-burgundy font-bold">
                    Precious Meets
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className="transition-colors hover:bg-sage/10">
                    <td className="p-4 sm:p-5 font-semibold text-foreground">
                      {row.feature}
                    </td>
                    <td className="p-4 sm:p-5 text-muted-foreground">
                      {row.nightlife}
                    </td>
                    <td className="p-4 sm:p-5 text-muted-foreground">
                      {row.apps}
                    </td>
                    <td className="p-4 sm:p-5 font-medium text-forest bg-burgundy/5">
                      ✓ {row.precious}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sacred Table Agreements */}
        <div className="mt-20 rounded-3xl border border-border/80 bg-card p-8 sm:p-10 shadow-sm">
          <div className="text-center max-w-lg mx-auto">
            <span className="label-mono text-xs uppercase text-burgundy font-semibold">
              Community Standards
            </span>
            <h2 className="font-display mt-1 text-3xl sm:text-4xl text-foreground">
              The Code of the Table
            </h2>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Every member agrees to these four non-negotiable principles before sitting down.
            </p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-background p-5">
              <span className="font-mono text-sm font-bold text-burgundy">01</span>
              <h4 className="font-display text-lg mt-1 text-foreground">Total Respect & Discretion</h4>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Personal stories, vulnerabilities, and viewpoints shared at the table stay at the table. Zero uninvited touch, zero invasive interrogation.
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-background p-5">
              <span className="font-mono text-sm font-bold text-burgundy">02</span>
              <h4 className="font-display text-lg mt-1 text-foreground">Zero Commercial Pitching</h4>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Leave investor decks, real estate pitches, and business cards outside. We gather to discover who you are as a human, not your sales quota.
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-background p-5">
              <span className="font-mono text-sm font-bold text-burgundy">03</span>
              <h4 className="font-display text-lg mt-1 text-foreground">Generous & Equal Listening</h4>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Nobody dominates the conversation. Everyone is given space to speak, question, and ponder in an unhurried rhythm.
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-background p-5">
              <span className="font-mono text-sm font-bold text-burgundy">04</span>
              <h4 className="font-display text-lg mt-1 text-foreground">Permanent Lifetime Blacklist</h4>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Any breach of guest safety, non-consensual contact, or misconduct results in an immediate, permanent Aadhaar-linked expulsion from all future tables.
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA Banner */}
        <div className="mt-20 rounded-3xl border border-[#C6A568]/40 bg-gradient-to-br from-[#2D0D17] to-[#120308] p-8 sm:p-12 text-center text-ivory shadow-xl">
          <span className="label-mono text-xs uppercase tracking-widest text-[#C6A568]">
            Curated Delhi NCR Tables
          </span>
          <h2 className="font-display mt-3 text-3xl sm:text-5xl text-ivory">
            Ready to experience an unhurried, safe table?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-xs sm:text-sm text-ivory/80 leading-relaxed">
            Take our 9-question social discovery quiz. Complete basic contact details to unlock your verified seat in Delhi NCR.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/quiz"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#C6A568] to-[#E5C17D] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-[#171514] shadow-md hover:scale-105 active:scale-95 transition-all"
            >
              Take the Discovery Quiz <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/experiences"
              className="inline-flex items-center gap-2 rounded-full border border-ivory/30 bg-ivory/10 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-ivory hover:bg-ivory/20 transition-all"
            >
              Explore Upcoming Meets
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
