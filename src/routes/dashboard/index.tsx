import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/lib/auth-context";
import {
  Calendar,
  ShieldCheck,
  Sparkles,
  MapPin,
  Clock,
  Users,
  CheckCircle2,
  Ticket,
  Wine,
  Coffee,
  Compass,
  ArrowRight,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({
    meta: [
      { title: "Member Dashboard — Precious Meets" },
      { name: "description", content: "Exclusive member access to curated upcoming meets and table reservations." },
    ],
  }),
  component: DashboardPage,
});

interface MeetEvent {
  id: string;
  title: string;
  city: string;
  neighborhood: string;
  date: string;
  seatsTotal: number;
  seatsRemaining: number;
  vibeMatch: number;
  host: string;
  theme: string;
  desc: string;
  image: string;
  dressCode: string;
}

const UPCOMING_MEETS: MeetEvent[] = [
  {
    id: "meet_delhi_supper",
    title: "The Long Table Supper",
    city: "Delhi NCR",
    neighborhood: "Mehrauli",
    date: "This Thursday · 8:00 PM",
    seatsTotal: 6,
    seatsRemaining: 2,
    vibeMatch: 98,
    host: "Chef Tara Sen & Sommelier Kabir",
    theme: "Four seasonal courses, candlelight & natural wine",
    desc: "Six strangers gathered around an unhurried candlelit table in a secluded Mehrauli courtyard. Seasonal autumn plates paired with small-batch natural wines.",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    dressCode: "Smart Casual & Warm Tones",
  },
  {
    id: "meet_bengaluru_vinyl",
    title: "Slow Coffee & Vinyl Sunday",
    city: "Bengaluru",
    neighborhood: "Indiranagar",
    date: "This Sunday · 10:00 AM",
    seatsTotal: 6,
    seatsRemaining: 3,
    vibeMatch: 95,
    host: "Roaster Nikhil & Sound Curator Dev",
    theme: "Single-origin pour-overs, artisanal sourdough & rare jazz vinyl",
    desc: "Sunlit courtyard morning. We brew rare Indian micro-lot beans while spinning Japanese jazz and analog soul, sparking slow, unhurried Sunday conversations.",
    image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80",
    dressCode: "Relaxed Linen & Sunday Ease",
  },
  {
    id: "meet_delhi_afterdark",
    title: "After-Dark Walk & Wine Salon",
    city: "Delhi NCR",
    neighborhood: "Hauz Khas Village",
    date: "Next Saturday · 7:00 PM",
    seatsTotal: 6,
    seatsRemaining: 2,
    vibeMatch: 92,
    host: "Historian Ananya & Chef Rohan",
    theme: "Twilight monument stroll followed by private rooftop tapas & wine",
    desc: "A 30-minute twilight walk past historic lake ruins, moving into a secluded terrace table for Spanish tapas and conversations that stretch into the night.",
    image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=80",
    dressCode: "Evening Chic & Comfortable Walking Shoes",
  },
];

const LOCAL_STORAGE_RESERVATIONS_KEY = "precious_meets_member_rsvps";

export function DashboardPage() {
  const { user, profile, subscription, isSubscribed, signOut } = useAuth();
  const navigate = useNavigate();

  const [reservedMeetIds, setReservedMeetIds] = useState<string[]>([]);

  // Load existing RSVPs
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_RESERVATIONS_KEY);
    if (saved) {
      try {
        setReservedMeetIds(JSON.parse(saved));
      } catch (e) {
        // Ignore
      }
    } else {
      // Default to having reserved the first meet for founding members
      setReservedMeetIds(["meet_delhi_supper"]);
      localStorage.setItem(LOCAL_STORAGE_RESERVATIONS_KEY, JSON.stringify(["meet_delhi_supper"]));
    }
  }, []);

  const handleToggleRsvp = (meet: MeetEvent) => {
    let updated: string[];
    if (reservedMeetIds.includes(meet.id)) {
      updated = reservedMeetIds.filter((id) => id !== meet.id);
      toast.info(`Reservation for ${meet.title} cancelled. Your seat credit remains active.`);
    } else {
      updated = [...reservedMeetIds, meet.id];
      toast.success(`Seat reserved for ${meet.title}! Secret venue access pass code generated.`);
    }
    setReservedMeetIds(updated);
    localStorage.setItem(LOCAL_STORAGE_RESERVATIONS_KEY, JSON.stringify(updated));
  };

  const displayName = profile?.display_name || user?.user_metadata?.full_name || "Founding Member";
  const memberId = subscription?.memberId || "PM-FOUNDER-8841";

  // Read archetype from localStorage if available
  let userArchetype = "The Curious Flâneur";
  try {
    const raw = localStorage.getItem("precious_meets_latest_profile");
    if (raw) {
      const p = JSON.parse(raw);
      if (p?.archetype?.title) userArchetype = p.archetype.title;
    }
  } catch (e) {
    // Ignore
  }

  return (
    <div className="flex min-h-screen flex-col bg-ivory text-foreground">
      <Navbar />

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 pb-24 pt-28">
        {/* Member Header Card */}
        <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-8 sm:p-10 shadow-sm">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="label-mono rounded-full bg-burgundy/10 px-3 py-1 text-xs font-bold text-burgundy">
                  Founding Member Pass
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-forest/15 px-3 py-1 text-xs font-semibold text-forest">
                  <ShieldCheck className="size-3.5" /> ID Verified Member
                </span>
                <span className="label-mono text-xs text-muted-foreground">
                  Pass ID: <strong className="text-foreground">{memberId}</strong>
                </span>
              </div>

              <h1 className="font-display mt-3 text-3xl sm:text-4xl md:text-5xl">
                Welcome, <em className="italic text-burgundy font-serif">{displayName}</em>
              </h1>

              <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <Sparkles className="size-3.5 text-ochre" /> Archetype: {userArchetype}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5 text-forest" /> {profile?.city || "Delhi NCR"} Member Circle
                </span>
                <span>•</span>
                <span className="text-forest font-semibold">Active Access (Annual Subscription)</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/quiz"
                className="flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-sage/40 transition-colors"
              >
                <Sparkles className="size-3.5 text-ochre" /> Retake 9-Q Quiz
              </Link>
              <Link
                to="/quiz/results"
                className="flex items-center gap-1.5 rounded-full bg-burgundy px-4 py-2.5 text-xs font-semibold text-ivory hover:bg-burgundy/90 transition-colors"
              >
                View Vibe Card
              </Link>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* UPCOMING MEETS SECTION (The Primary Core of the Dashboard) */}
        {/* ------------------------------------------------------------- */}
        <div className="mt-12">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-baseline">
            <div>
              <span className="label-mono text-xs uppercase text-forest font-semibold">
                Curated Table Gatherings
              </span>
              <h2 className="font-display text-2xl sm:text-3xl text-foreground">
                Upcoming Meets Matched to Your Vibe
              </h2>
            </div>
            <p className="text-xs text-muted-foreground">
              Exclusively sized to 6 people · Zero corporate pitching · Strict dietary safety
            </p>
          </div>

          <div className="mt-6 space-y-6">
            {UPCOMING_MEETS.map((meet) => {
              const isRsvpd = reservedMeetIds.includes(meet.id);
              const gateCode = `GATE-${meet.id.slice(-3).toUpperCase()}4`;

              return (
                <div
                  key={meet.id}
                  className={`overflow-hidden rounded-3xl border transition-all ${
                    isRsvpd
                      ? "border-forest/50 bg-card shadow-md ring-1 ring-forest/30"
                      : "border-border/80 bg-card hover:border-burgundy/40"
                  }`}
                >
                  <div className="grid gap-6 md:grid-cols-12 md:items-center p-6 sm:p-8">
                    {/* Meet Cover Image */}
                    <div className="relative overflow-hidden rounded-2xl aspect-[16/10] md:col-span-4 bg-muted">
                      <img
                        src={meet.image}
                        alt={meet.title}
                        className="size-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 rounded-full bg-black/60 px-3 py-1 text-[11px] font-mono text-ivory backdrop-blur-md">
                        {meet.city} · {meet.neighborhood}
                      </div>
                      <div className="absolute bottom-3 right-3 rounded-full bg-burgundy px-3 py-1 text-[10px] font-bold text-ivory">
                        {meet.vibeMatch}% Vibe Match
                      </div>
                    </div>

                    {/* Meet Information */}
                    <div className="md:col-span-8 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="label-mono text-xs text-burgundy font-semibold">
                            {meet.date}
                          </span>
                          <span className="label-mono text-[11px] text-muted-foreground">
                            {meet.seatsRemaining} of {meet.seatsTotal} seats open
                          </span>
                        </div>

                        <h3 className="font-display mt-2 text-2xl sm:text-3xl text-foreground">
                          {meet.title}
                        </h3>

                        <p className="mt-1 text-xs font-medium text-forest">
                          {meet.theme}
                        </p>

                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                          {meet.desc}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-4 text-[11px] text-muted-foreground border-t border-border/60 pt-3">
                          <span>
                            <strong>Host:</strong> {meet.host}
                          </span>
                          <span>•</span>
                          <span>
                            <strong>Dress Code:</strong> {meet.dressCode}
                          </span>
                        </div>
                      </div>

                      {/* RSVP & Gate Code Section */}
                      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-4">
                        {isRsvpd ? (
                          <div className="flex items-center gap-3">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/15 px-3.5 py-1.5 text-xs font-semibold text-forest">
                              <CheckCircle2 className="size-4" /> Seat Confirmed
                            </span>
                            <div className="text-xs">
                              <span className="text-muted-foreground">Gate Pass: </span>
                              <strong className="font-mono text-burgundy">{gateCode}</strong>
                              <span className="text-muted-foreground text-[10px] ml-1.5">(Secret venue SMS 24h prior)</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            Free RSVP included with your Annual Founding Pass
                          </span>
                        )}

                        <Button
                          onClick={() => handleToggleRsvp(meet)}
                          className={`rounded-full px-6 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                            isRsvpd
                              ? "border border-destructive/40 bg-background text-destructive hover:bg-destructive/10"
                              : "bg-burgundy text-ivory hover:bg-burgundy/90 shadow-sm"
                          }`}
                        >
                          {isRsvpd ? "Cancel RSVP" : "RSVP Your Seat (Included)"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* DIGITAL MEMBER PASS & TABLE GUIDELINES */}
        {/* ------------------------------------------------------------- */}
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {/* Digital Member Boarding Pass */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div>
                <span className="label-mono text-[10px] uppercase text-forest">Digital Pass</span>
                <h3 className="font-display text-xl">Founding Member Card</h3>
              </div>
              <Ticket className="size-6 text-burgundy" />
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Member Name</span>
                <span className="font-semibold text-foreground">{displayName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pass Code</span>
                <span className="font-mono font-bold text-burgundy">{memberId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Membership Tier</span>
                <span className="font-semibold text-foreground">Annual Founding Member</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Validity</span>
                <span className="font-semibold text-forest">Active (365 Days)</span>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-sage/30 p-3 text-[11px] leading-relaxed text-muted-foreground text-center">
              Present this pass ID upon arrival at the secret dining venue. Every seat includes welcome pours and tasting courses.
            </div>
          </div>

          {/* Table Agreements */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm">
            <span className="label-mono text-[10px] uppercase text-burgundy">The Table Code</span>
            <h3 className="font-display text-xl mt-1">Four Sacred Agreements</h3>

            <ul className="mt-4 space-y-2.5 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-burgundy font-bold">1.</span>
                <span><strong>No Sales or Pitching:</strong> We gather as curious humans, not networking leads.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-burgundy font-bold">2.</span>
                <span><strong>Generous Listening:</strong> Ask questions that unlock real stories rather than polite formalities.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-burgundy font-bold">3.</span>
                <span><strong>Table Discretion:</strong> Stories shared at dinner remain warmly at the table.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-burgundy font-bold">4.</span>
                <span><strong>Safe Departure:</strong> Verified hosts ensure comfortable transport coordination for all guests.</span>
              </li>
            </ul>

            <div className="mt-6 flex justify-between items-center border-t border-border/60 pt-4 text-xs">
              <span className="text-muted-foreground">Need host assistance?</span>
              <a
                href="mailto:concierge@preciousmeets.com"
                className="font-semibold text-burgundy hover:underline"
              >
                concierge@preciousmeets.com
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
