import { useState } from "react";
import { AdminEvent } from "@/lib/events-service";
import {
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  Users,
  Utensils,
  CheckCircle2,
  Filter,
  Wine,
  Coffee,
  Moon,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface EventsListSectionProps {
  events: AdminEvent[];
  reservedEventIds: string[];
  onToggleRsvp: (event: AdminEvent) => void;
  userCity: string;
}

export function EventsListSection({
  events,
  reservedEventIds,
  onToggleRsvp,
  userCity,
}: EventsListSectionProps) {
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filteredEvents = events.filter((e) => {
    if (e.status === "completed" || e.status === "cancelled") return false;
    if (cityFilter !== "all" && e.city !== cityFilter) return false;
    if (categoryFilter !== "all" && e.category !== categoryFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end border-b border-border/60 pb-5">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-forest font-bold">
            Curated 6-Person Tables
          </span>
          <h2 className="font-display mt-1 text-2xl sm:text-3xl text-foreground">
            Explore All Upcoming Meets
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Carefully curated dining salons matched with complementary conversational archetypes.
          </p>
        </div>

        {/* City Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
          {[
            { id: "all", label: "All Cities" },
            { id: "Delhi NCR", label: "Delhi NCR" },
            { id: "Bengaluru", label: "Bengaluru" },
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => setCityFilter(c.id)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                cityFilter === c.id
                  ? "bg-burgundy text-ivory shadow-sm"
                  : "bg-sage/40 text-muted-foreground hover:bg-sage/60 hover:text-foreground"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Pills (Supper, Coffee, After-Dark) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: "all", label: "All Formats", icon: Compass },
          { id: "supper_club", label: "Supper Club", icon: Wine },
          { id: "coffee_tasting", label: "Coffee Tasting", icon: Coffee },
          { id: "after_dark", label: "After-Dark Walk", icon: Moon },
          { id: "salon", label: "Cultural Salon", icon: Sparkles },
        ].map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                categoryFilter === cat.id
                  ? "bg-forest text-ivory shadow-sm font-semibold"
                  : "border border-border/80 bg-card text-muted-foreground hover:border-forest/40 hover:text-foreground"
              }`}
            >
              <Icon className="size-3.5" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Events Card Feed */}
      {filteredEvents.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border/80 p-12 text-center bg-card/50">
          <Utensils className="size-10 text-muted-foreground/40 mx-auto" />
          <h3 className="font-display text-lg mt-3">No tables match your selected filter</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Try switching city or format to view open curated tables.
          </p>
          <Button
            size="sm"
            onClick={() => {
              setCityFilter("all");
              setCategoryFilter("all");
            }}
            className="mt-4 rounded-full bg-burgundy text-ivory text-xs px-4"
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredEvents.map((event) => {
            const isReserved = reservedEventIds.includes(event.id);
            const seatedCount = event.seats.filter(Boolean).length;
            const remainingSeats = Math.max(0, 6 - seatedCount);
            const gateCode = event.secretAccessCode || "GATE-402";

            return (
              <div
                key={event.id}
                className={`overflow-hidden rounded-3xl border transition-all duration-300 ${
                  isReserved
                    ? "border-forest/60 bg-card shadow-lg ring-1 ring-forest/30"
                    : "border-border/80 bg-card hover:border-burgundy/40 hover:shadow-md"
                }`}
              >
                <div className="grid gap-6 md:grid-cols-12 md:items-center p-5 sm:p-7">
                  {/* Event Visual */}
                  <div className="relative overflow-hidden rounded-2xl aspect-[16/10] md:col-span-4 bg-muted">
                    <img
                      src={event.coverImage}
                      alt={event.title}
                      className="size-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 rounded-full bg-black/60 px-3 py-1 text-[11px] font-mono text-ivory backdrop-blur-md">
                      {event.city} · {event.neighborhood}
                    </div>
                    <div className="absolute bottom-3 right-3 rounded-full bg-burgundy px-3 py-1 text-[10px] font-bold text-ivory shadow-sm">
                      96% Vibe Match
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="md:col-span-8 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-mono text-xs text-burgundy font-bold">
                          {event.dateDisplay}
                        </span>
                        <span className="font-mono text-[11px] text-muted-foreground bg-sage/30 px-2 py-0.5 rounded-full">
                          {remainingSeats} of 6 seats open
                        </span>
                      </div>

                      <h3 className="font-display mt-2 text-2xl sm:text-3xl text-foreground">
                        {event.title}
                      </h3>

                      <p className="mt-1 text-xs font-medium text-forest">
                        {event.theme}
                      </p>

                      {/* Menu Highlights */}
                      {event.menuPreview && event.menuPreview.length > 0 && (
                        <div className="mt-3 rounded-xl bg-sage/20 p-3 text-[11px] text-muted-foreground space-y-1">
                          <span className="text-[10px] uppercase tracking-wider font-mono font-semibold text-foreground block">
                            Tasting Menu Highlights
                          </span>
                          <ul className="list-disc list-inside space-y-0.5">
                            {event.menuPreview.slice(0, 2).map((item, i) => (
                              <li key={i} className="truncate">{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="mt-3 flex flex-wrap gap-4 text-[11px] text-muted-foreground border-t border-border/60 pt-3">
                        <span>
                          <strong>Host:</strong> {event.hostName} ({event.hostRole})
                        </span>
                        <span>•</span>
                        <span>
                          <strong>Dietary:</strong> {event.dietaryOptions.join(", ")}
                        </span>
                      </div>
                    </div>

                    {/* RSVP & Pass Footer */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-4">
                      {isReserved ? (
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/15 px-3 py-1 text-xs font-semibold text-forest">
                            <CheckCircle2 className="size-4" /> Reserved Seat
                          </span>
                          <div className="text-xs">
                            <span className="text-muted-foreground">Door PIN: </span>
                            <strong className="font-mono text-burgundy">{gateCode}</strong>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Included with your Annual Pass (Zero Surcharge)
                        </span>
                      )}

                      <Button
                        onClick={() => onToggleRsvp(event)}
                        className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                          isReserved
                            ? "border border-destructive/40 bg-card text-destructive hover:bg-destructive/10"
                            : "bg-burgundy text-ivory hover:bg-burgundy/90 shadow-sm"
                        }`}
                      >
                        {isReserved ? "Cancel Reservation" : "RSVP Seat (Included)"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
