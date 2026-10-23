import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/lib/auth-context";
import { RazorpayCheckoutModal } from "@/components/RazorpayCheckoutModal";
import { SosModal } from "@/components/SosModal";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ShieldCheck,
  Utensils,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/experiences/$slug")({
  head: () => ({
    meta: [
      { title: "Experience Details — Precious Meets" },
      { name: "description", content: "Curated supper club and table experience details." },
    ],
  }),
  component: ExperienceDetailPage,
});

const DELHI_SUPPER = {
  id: "exp_1",
  slug: "the-long-table-supper-delhi",
  title: "The Long Table Supper",
  tagline: "Six strangers, four courses, one candlelit table in Mehrauli.",
  city: "Delhi NCR",
  neighborhood: "Mehrauli",
  venueName: "The Banyan Courtyard at Mehrauli",
  venueAddress: "Kalka Das Marg, Near Qutub Complex, Mehrauli, New Delhi 110030",
  coverImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
  priceInr: 249900, // paise
  maxCapacity: 6,
  bookedSeats: 2,
  host: {
    name: "Chef Tara Sen",
    role: "Culinary Anthropologist & Supper Host",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    bio: "Tara spent seven years documenting heritage recipes across North India and Old Delhi before founding this intimate salon table.",
  },
  menu: [
    "Amuse-bouche: Smoked jackfruit tartlets with kokum glaze",
    "First course: Spiced burrata or charred heirloom pumpkin",
    "Main course: Slow-cooked black cardamom lamb shank or wild mushroom saffron pulao",
    "Dessert: Fig leaf panna cotta with roasted pistachio crisp",
  ],
  dietary: ["Vegetarian", "Non-Vegetarian", "Jain Options Available"],
  session: {
    id: "sess_001",
    startsAt: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString(),
    endsAt: new Date(Date.now() + 3 * 24 * 3600 * 1000 + 3 * 3600 * 1000).toISOString(),
  },
};

const EXPERIENCES_MAP: Record<string, any> = {
  "the-long-table-supper-delhi": DELHI_SUPPER,
  "the-long-table-supper-mumbai": DELHI_SUPPER, // backwards compatibility alias
  "slow-coffee-sunder-nursery-delhi": {
    id: "exp_2",
    slug: "slow-coffee-sunder-nursery-delhi",
    title: "Slow Pour & Vinyl Sunday",
    tagline: "Unhurried conversations over single-origin pours under garden arches.",
    city: "Delhi NCR",
    neighborhood: "Sunder Nursery",
    venueName: "The Heritage Pavilion at Sunder Nursery",
    venueAddress: "Bharat Scouts and Guides Marg, Nizamuddin, New Delhi 110013",
    coverImage: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1200&q=80",
    priceInr: 119900,
    maxCapacity: 6,
    bookedSeats: 4,
    host: {
      name: "Arjun Varma",
      role: "Q-Grader & Vinyl Collector",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
      bio: "Arjun curates rare jazz vinyls alongside micro-lot coffees sourced directly from smallholder farms.",
    },
    menu: [
      "Welcome: Cold brew tonic with orange blossom extract",
      "Cupping Flight: 3 distinct anaerobic fermentation Arabicas",
      "Artisanal Pairing: Sourdough tartines with whipped almond butter & preserves",
    ],
  },
  "after-dark-walk-and-wine-delhi": {
    id: "exp_3",
    slug: "after-dark-walk-and-wine-delhi",
    title: "After-Dark Walk & Wine",
    tagline: "A twilight stroll, ancient ruins, and a quiet rooftop.",
    city: "Delhi",
    neighborhood: "Hauz Khas",
    venueName: "The Reservoir Terrace",
    venueAddress: "Hauz Khas Village, New Delhi 110016",
    coverImage: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80",
    priceInr: 189900,
    maxCapacity: 6,
    bookedSeats: 1,
    host: {
      name: "Kabir Mehta",
      role: "Architectural Storyteller",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
      bio: "Historian and writer passionate about the layered mythologies of Delhi’s nocturnal ruins.",
    },
    menu: [
      "Monuments: 45-minute twilight architectural walk around Hauz Khas reservoir",
      "Rooftop Salon: Reserved communal terrace with artisan wine pairings and regional tapas",
    ],
    dietary: ["Vegetarian", "Non-Vegetarian"],
    session: {
      id: "sess_003",
      startsAt: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
      endsAt: new Date(Date.now() + 7 * 24 * 3600 * 1000 + 3 * 3600 * 1000).toISOString(),
    },
  },
};

function ExperienceDetailPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const { user, profile, signInWithGoogle } = useAuth();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const exp = EXPERIENCES_MAP[slug] || EXPERIENCES_MAP["the-long-table-supper-delhi"];
  const seatsAvailable = exp.maxCapacity - exp.bookedSeats;

  const handleBookClick = () => {
    if (!user) {
      signInWithGoogle(`/experiences/${slug}`);
      return;
    }
    setCheckoutOpen(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-ivory text-foreground">
      <Navbar />

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 pb-24 pt-28">
        <Link
          to="/experiences"
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-burgundy"
        >
          <ArrowLeft className="size-3.5" /> Back to all meets
        </Link>

        {/* Hero Banner */}
        <div className="mt-6 overflow-hidden rounded-3xl border border-border/80 bg-card">
          <div className="relative aspect-[21/9] w-full overflow-hidden bg-sage/30">
            <img src={exp.coverImage} alt={exp.title} className="size-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex flex-col justify-between gap-4 text-ivory md:flex-row md:items-end">
              <div>
                <span className="label-mono rounded-full bg-ivory/20 px-3 py-1 text-xs backdrop-blur-md">
                  {exp.city} · {exp.neighborhood}
                </span>
                <h1 className="font-display mt-2 text-3xl md:text-5xl">{exp.title}</h1>
              </div>
              <div className="text-right">
                <span className="text-xs text-ivory/80 uppercase">Per Guest</span>
                <p className="font-mono text-3xl font-bold">
                  ₹{(exp.priceInr / 100).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Info Bar */}
          <div className="grid grid-cols-2 divide-x divide-border/60 border-t border-border/60 bg-card p-4 text-xs md:grid-cols-4">
            <div className="flex items-center gap-2 p-2">
              <Calendar className="size-4 text-burgundy" />
              <div>
                <p className="text-[10px] uppercase text-muted-foreground">Date</p>
                <p className="font-medium text-foreground">
                  {new Date(exp.session.startsAt).toLocaleDateString("en-IN", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2">
              <Clock className="size-4 text-burgundy" />
              <div>
                <p className="text-[10px] uppercase text-muted-foreground">Time</p>
                <p className="font-medium text-foreground">
                  {new Date(exp.session.startsAt).toLocaleTimeString("en-IN", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2">
              <Users className="size-4 text-burgundy" />
              <div>
                <p className="text-[10px] uppercase text-muted-foreground">Table Size</p>
                <p className="font-medium text-forest font-semibold">{seatsAvailable} seats remaining</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2">
              <ShieldCheck className="size-4 text-burgundy" />
              <div>
                <p className="text-[10px] uppercase text-muted-foreground">Trust & Safety</p>
                <p className="font-medium text-foreground">ID Verified Hosts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="mt-12 grid gap-12 md:grid-cols-3">
          {/* Main Details */}
          <div className="space-y-10 md:col-span-2">
            <div>
              <h2 className="font-display text-2xl">The Experience</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {exp.tagline} Designed for conversation to flow naturally without the need for stiff introductions. Our table hosts curate both the flavours and the rhythm of the evening.
              </p>
            </div>

            {/* Menu Courses */}
            <div>
              <h2 className="font-display text-2xl">Tasting Notes & Menu</h2>
              <div className="mt-4 space-y-3">
                {exp.menu.map((item: string, i: number) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-xl border border-border/80 bg-card/60 p-3.5 text-xs"
                  >
                    <span className="font-mono text-xs font-bold text-burgundy">0{i + 1}</span>
                    <p className="text-foreground leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Meet Your Host */}
            <div className="rounded-2xl border border-border/80 bg-card p-6">
              <h2 className="font-display text-xl">Your Table Host</h2>
              <div className="mt-4 flex items-center gap-4">
                <img
                  src={exp.host.avatar}
                  alt={exp.host.name}
                  className="size-14 rounded-full object-cover border border-border"
                />
                <div>
                  <h3 className="font-medium text-foreground">{exp.host.name}</h3>
                  <p className="text-xs text-forest">{exp.host.role}</p>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                {exp.host.bio}
              </p>
            </div>

            {/* Venue & Guidelines */}
            <div>
              <h2 className="font-display text-2xl">Venue & Etiquette</h2>
              <div className="mt-4 rounded-xl border border-border/80 bg-sage/30 p-5 text-xs space-y-2">
                <p className="flex items-center gap-2 font-medium text-foreground">
                  <MapPin className="size-4 text-burgundy" /> {exp.venueName}
                </p>
                <p className="text-muted-foreground">{exp.venueAddress}</p>
                <p className="pt-2 text-[11px] text-muted-foreground">
                  Exact access instructions & entry gate pass will be provided in your confirmation receipt after booking.
                </p>
              </div>
            </div>
          </div>

          {/* Sticky Booking Sidebar */}
          <div className="space-y-6">
            <div className="sticky top-24 rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
              <span className="label-mono text-xs text-forest">Ready to connect</span>
              <p className="font-mono text-2xl font-bold text-foreground mt-1">
                ₹{(exp.priceInr / 100).toLocaleString("en-IN")}{" "}
                <span className="text-xs font-normal text-muted-foreground">/ person</span>
              </p>

              <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-forest" /> 4-course curated feast
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-forest" /> Paired drinks included
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-forest" /> Compatibility matched seating
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-forest" /> 48-hr full refund guarantee
                </div>
              </div>

              <Button
                onClick={handleBookClick}
                className="mt-6 w-full rounded-full bg-burgundy py-5 font-semibold text-ivory hover:bg-burgundy/90"
              >
                {user ? "Reserve Seat via Razorpay" : "Sign In to Reserve"}
              </Button>

              <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
                <ShieldCheck className="size-3 text-forest" /> Verified 256-Bit SSL Checkout
              </div>

              {/* Safety SOS Preview */}
              <div className="mt-6 border-t border-border/60 pt-4">
                <p className="text-[11px] text-muted-foreground mb-2">
                  Precious Meets Safety Shield is active on every booking.
                </p>
                <SosModal bookingId="preview" bookingReference="PREVIEW" />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Razorpay Modal */}
      {user && (
        <RazorpayCheckoutModal
          open={checkoutOpen}
          onOpenChange={setCheckoutOpen}
          experience={{
            title: exp.title,
            neighborhood: exp.neighborhood,
            city: exp.city,
            priceInr: exp.priceInr,
          }}
          session={{
            id: exp.session.id,
            startsAt: exp.session.startsAt,
          }}
          user={{
            id: user.id,
            email: user.email || "attendee@preciousmeets.com",
            name: profile?.full_name || profile?.display_name || "Guest Attendee",
          }}
          onSuccess={(bkId) => {
            navigate({ to: "/dashboard/bookings" });
          }}
        />
      )}

      <Footer />
    </div>
  );
}
