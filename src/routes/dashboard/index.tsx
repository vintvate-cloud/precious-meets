import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/lib/auth-context";
import {
  Calendar,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  User,
  MapPin,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({
    meta: [
      { title: "My Dashboard — Precious Meets" },
      { name: "description", content: "Manage your upcoming meets and social discovery profile." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-ivory text-foreground">
      <Navbar />

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 pb-24 pt-28">
        {/* Welcome Banner */}
        <div className="flex flex-col justify-between gap-6 rounded-3xl border border-border/80 bg-card p-8 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="label-mono text-xs text-forest">Attendee Dashboard</span>
              {profile?.identity_verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-forest/15 px-2.5 py-0.5 text-[10px] font-semibold text-forest">
                  <ShieldCheck className="size-3" /> ID Verified
                </span>
              )}
            </div>
            <h1 className="font-display mt-2 text-3xl md:text-4xl">
              Hello, <em className="italic text-burgundy">{profile?.display_name || "Guest"}</em>
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              {profile?.city || "Mumbai"} · {profile?.email}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/quiz"
              className="flex items-center gap-1.5 rounded-full border border-border/80 bg-background px-4 py-2 text-xs font-semibold text-foreground hover:bg-sage/40"
            >
              <Sparkles className="size-3.5 text-ochre" /> Retake Quiz
            </Link>
            <Link
              to="/verify-identity"
              className="flex items-center gap-1.5 rounded-full bg-burgundy px-4 py-2 text-xs font-semibold text-ivory hover:bg-burgundy/90"
            >
              <ShieldCheck className="size-3.5" /> Verify ID
            </Link>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {/* Upcoming Reservations */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl">Upcoming Meets</h2>
              <Link to="/dashboard/bookings" className="text-xs font-semibold text-burgundy hover:underline">
                View All &rarr;
              </Link>
            </div>

            {/* Active Meet Card */}
            <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-6 transition-all hover:shadow-md sm:flex-row sm:items-center">
              <div>
                <span className="label-mono rounded-full bg-sage/60 px-3 py-1 text-[10px] text-forest">
                  Confirmed Reservation · Seat #3
                </span>
                <h3 className="font-display mt-2 text-2xl">The Long Table Supper</h3>
                <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3.5 text-burgundy" /> Thursday, 8:00 PM
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3.5 text-forest" /> Bandra West, Mumbai
                  </span>
                </div>
              </div>

              <div className="mt-4 sm:mt-0">
                <Link
                  to="/dashboard/bookings"
                  className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-ivory hover:bg-burgundy"
                >
                  Pass & Venue Details <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>

            {/* Recommended Discovery */}
            <div className="mt-8 rounded-2xl border border-border/80 bg-sage/20 p-6">
              <h3 className="font-display text-xl">Curated Next Meets</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Matched to your social energy and curiosity score.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Link
                  to="/experiences/$slug"
                  params={{ slug: "slow-coffee-vinyl-bengaluru" }}
                  className="rounded-xl border border-border/80 bg-card p-4 transition-colors hover:border-burgundy"
                >
                  <p className="text-xs font-semibold text-forest">Bengaluru · Indiranagar</p>
                  <h4 className="font-display mt-1 text-lg">Slow Coffee & Vinyl Sunday</h4>
                  <p className="font-mono mt-2 text-xs font-bold text-burgundy">₹1,199 / seat</p>
                </Link>
                <Link
                  to="/experiences/$slug"
                  params={{ slug: "after-dark-walk-and-wine-delhi" }}
                  className="rounded-xl border border-border/80 bg-card p-4 transition-colors hover:border-burgundy"
                >
                  <p className="text-xs font-semibold text-forest">Delhi · Hauz Khas</p>
                  <h4 className="font-display mt-1 text-lg">After-Dark Walk & Wine</h4>
                  <p className="font-mono mt-2 text-xs font-bold text-burgundy">₹1,899 / seat</p>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Actions & Safety Shield */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-border/80 bg-card p-6">
              <h3 className="font-display text-xl">Social Discovery</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Your answers to the 21 questions define your dining compatibility and table seating.
              </p>
              <Link
                to="/quiz/results"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-border bg-background py-2 text-xs font-semibold text-foreground hover:bg-sage/40"
              >
                <Sparkles className="size-3.5 text-ochre" /> View Archetype Profile
              </Link>
            </div>

            {/* Safety SOS Quick Action */}
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
              <div className="flex items-center gap-2 text-destructive">
                <ShieldAlert className="size-5" />
                <h3 className="font-display text-xl text-destructive">Emergency SOS</h3>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Need urgent assistance during any active meet? Access our 24/7 safety dispatch or call national emergency numbers.
              </p>
              <Link
                to="/dashboard/safety"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-destructive py-2 text-xs font-semibold text-destructive-foreground hover:bg-destructive/90"
              >
                Safety & Emergency Hub
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
