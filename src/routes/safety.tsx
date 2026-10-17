import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SosModal } from "@/components/SosModal";
import { ShieldCheck, ShieldAlert, Lock, UserCheck, Heart, AlertOctagon } from "lucide-react";

export const Route = createFileRoute("/safety")({
  head: () => ({
    meta: [
      { title: "Safety Protocol & Trust — Precious Meets" },
      { name: "description", content: "Real-world safety, emergency SOS beacons, and identity verification standards." },
    ],
  }),
  component: SafetyProtocolPage,
});

function SafetyProtocolPage() {
  return (
    <div className="flex min-h-screen flex-col bg-ivory text-foreground">
      <Navbar />

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 pb-24 pt-28">
        <div className="max-w-2xl">
          <span className="label-mono text-xs text-forest">Trust & Human Security</span>
          <h1 className="font-display mt-2 text-4xl leading-tight md:text-5xl">
            Our Uncompromising <em className="italic text-burgundy">Safety Standard</em>
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Meeting new people should never compromise personal dignity, security, or physical boundaries. Here is how we engineer real-world safety from invitation to dessert.
          </p>
        </div>

        {/* SOS Action Highlight */}
        <div className="mt-12 rounded-3xl border border-destructive/20 bg-destructive/5 p-8 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2 text-destructive">
              <ShieldAlert className="size-5" />
              <span className="font-semibold text-sm">24/7 Real-Time Emergency SOS</span>
            </div>
            <h3 className="font-display mt-1 text-2xl text-foreground">Immediate Assistance on Every Meet</h3>
            <p className="mt-1 text-xs text-muted-foreground max-w-lg leading-relaxed">
              Every confirmed ticket includes an active SOS Beacon with GPS sharing consent, direct dispatch to safety administrators, and one-tap dials to National Emergency Helpline (112).
            </p>
          </div>
          <div className="shrink-0">
            <SosModal />
          </div>
        </div>

        {/* 4 Pillars of Safety */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
            <UserCheck className="size-6 text-forest" />
            <h3 className="font-display mt-4 text-xl">100% Verified Members</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Anonymous profiles are strictly prohibited. Every attendee verifies identity through authorized DigiLocker offline XML verification without storing raw numbers.
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
            <Lock className="size-6 text-burgundy" />
            <h3 className="font-display mt-4 text-xl">Vetted Venues & Hosts</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Every supper club loft, courtyard roastery, and rooftop is physically inspected, equipped with clear exits, and run by background-verified hosts.
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
            <AlertOctagon className="size-6 text-destructive" />
            <h3 className="font-display mt-4 text-xl">Zero Tolerance Policy</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Harassment, non-consensual contact, aggressive corporate prospecting, or discrimination triggers an immediate ban across our platform and police referral where necessary.
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
            <Heart className="size-6 text-ochre" />
            <h3 className="font-display mt-4 text-xl">Table Agreements</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Every attendee agrees to active listening, respect for dietary and personal boundaries, and freedom to step away without awkwardness or pressure.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
