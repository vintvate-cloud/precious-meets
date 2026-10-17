import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MapPin, Calendar, Users, Utensils, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/experiences/")({
  head: () => ({
    meta: [
      { title: "Curated Meets & Shared Tables — Precious Meets" },
      { name: "description", content: "Discover upcoming supper clubs, slow coffee tastings, and evening salons in Mumbai, Bengaluru, and Delhi." },
    ],
  }),
  component: ExperiencesPage,
});

const CURATED_MEETS = [
  {
    id: "exp_1",
    slug: "the-long-table-supper-mumbai",
    title: "The Long Table Supper",
    city: "Mumbai",
    neighborhood: "Bandra West",
    category: "supper_club",
    date: "Thursday · 8:00 PM",
    coverImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    desc: "Six strangers, four courses, one candlelit table in a hidden Ranwar loft.",
    priceInr: 2499,
    seatsLeft: 4,
    dietary: "Vegetarian & Non-Veg Available",
    matchScore: 94,
  },
  {
    id: "exp_2",
    slug: "slow-coffee-vinyl-bengaluru",
    title: "Slow Coffee & Vinyl Sunday",
    city: "Bengaluru",
    neighborhood: "Indiranagar",
    category: "coffee_tasting",
    date: "Sunday · 10:00 AM",
    coverImage: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80",
    desc: "Unhurried conversations, single-origin pour-overs, and rare jazz records.",
    priceInr: 1199,
    seatsLeft: 2,
    dietary: "Artisanal Bakes & Vegan Milk",
    matchScore: 91,
  },
  {
    id: "exp_3",
    slug: "after-dark-walk-and-wine-delhi",
    title: "After-Dark Walk & Wine",
    city: "Delhi",
    neighborhood: "Hauz Khas",
    category: "after_dark",
    date: "Saturday · 7:00 PM",
    coverImage: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=80",
    desc: "A twilight heritage walk through monument shadows followed by tapas & wine.",
    priceInr: 1899,
    seatsLeft: 5,
    dietary: "Vegetarian Tapas Included",
    matchScore: 89,
  },
];

function ExperiencesPage() {
  const [selectedCity, setSelectedCity] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filtered = CURATED_MEETS.filter((m) => {
    const matchCity = selectedCity === "All" || m.city === selectedCity;
    const matchCat = selectedCategory === "All" || m.category === selectedCategory;
    return matchCity && matchCat;
  });

  return (
    <div className="flex min-h-screen flex-col bg-ivory text-foreground">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-24 pt-28">
        {/* Editorial Heading */}
        <div className="max-w-2xl">
          <span className="label-mono text-xs text-forest">Discover the Table</span>
          <h1 className="font-display mt-2 text-4xl leading-tight md:text-6xl">
            Curated Experiences for <em className="italic text-burgundy">Curious Minds</em>
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Every gathering is intentionally sized to 4–6 attendees, paired by compatibility, and hosted at authentic local culinary gems.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-b border-border/70 pb-6">
          {/* City Tabs */}
          <div className="flex items-center gap-2">
            {["All", "Mumbai", "Bengaluru", "Delhi"].map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  selectedCity === city
                    ? "bg-ink text-ivory"
                    : "border border-border/80 bg-card/60 text-muted-foreground hover:bg-card hover:text-foreground"
                }`}
              >
                {city}
              </button>
            ))}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2">
            {[
              { id: "All", label: "All Formats" },
              { id: "supper_club", label: "Supper Clubs" },
              { id: "coffee_tasting", label: "Slow Coffee" },
              { id: "after_dark", label: "After Dark" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? "text-burgundy underline underline-offset-4"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Experience Cards Grid */}
        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Image Frame */}
              <div className="relative aspect-[4/3] overflow-hidden bg-sage/30">
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-ivory/90 px-3 py-1 text-xs font-semibold text-burgundy backdrop-blur-md">
                  <span>✦ {item.matchScore}% Match</span>
                </div>
                <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-ink/80 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-ivory backdrop-blur-md">
                  <MapPin className="size-3" /> {item.neighborhood}, {item.city}
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3.5" /> {item.date}
                  </span>
                  <span className="flex items-center gap-1 text-forest font-medium">
                    <Users className="size-3.5" /> {item.seatsLeft} seats left
                  </span>
                </div>

                <h3 className="font-display mt-3 text-2xl font-normal leading-snug group-hover:text-burgundy">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>

                <div className="mt-4 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Utensils className="size-3 text-ochre" /> {item.dietary}
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
                  <div>
                    <span className="text-[10px] uppercase text-muted-foreground">Per Seat</span>
                    <p className="font-mono text-lg font-bold text-foreground">
                      ₹{item.priceInr.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <Link
                    to="/experiences/$slug"
                    params={{ slug: item.slug }}
                    className="flex items-center gap-1 rounded-full bg-burgundy px-4 py-2 text-xs font-semibold text-ivory hover:bg-burgundy/90"
                  >
                    View Table <ArrowUpRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
