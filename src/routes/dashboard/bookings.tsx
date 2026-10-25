import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/lib/auth-context";
import { SosModal } from "@/components/SosModal";
import { Calendar, MapPin, Users, Ticket, CheckCircle2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/bookings")({
  head: () => ({
    meta: [
      { title: "My Bookings — Precious Meets" },
      { name: "description", content: "Your upcoming and past curated table reservations." },
    ],
  }),
  component: DashboardBookingsPage,
});

import { useState, useEffect } from "react";
import { EventsService, UserSeatInvitation } from "@/lib/events-service";

function DashboardBookingsPage() {
  const { user } = useAuth();
  const [invitations, setInvitations] = useState<UserSeatInvitation[]>([]);

  useEffect(() => {
    const allInvitations = EventsService.getUserInvitations();
    // Show accepted seat reservations or pending passes
    setInvitations(allInvitations.filter((inv) => inv.status === "accepted" || inv.status === "pending"));
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-ivory text-foreground">
      <Navbar />

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 pb-24 pt-28">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <span className="label-mono text-xs text-forest">Reservation Tickets</span>
            <h1 className="font-display mt-1 text-3xl md:text-4xl">
              My <em className="italic text-burgundy">Meets & Tables</em>
            </h1>
          </div>

          <Link
            to="/experiences"
            className="inline-flex items-center gap-1.5 rounded-full bg-burgundy px-5 py-2 text-xs font-semibold text-ivory hover:bg-burgundy/90"
          >
            Discover More Meets
          </Link>
        </div>

        <div className="mt-8 space-y-6">
          {invitations.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border/80 bg-card p-12 text-center">
              <Ticket className="size-12 mx-auto text-muted-foreground/40 mb-3" />
              <h3 className="font-display text-2xl">No Active Meets Reserved</h3>
              <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
                You haven't reserved or been seated at any upcoming gathers yet. Explore upcoming gatherings in Delhi NCR.
              </p>
              <div className="mt-6">
                <Link
                  to="/experiences"
                  className="inline-flex items-center gap-1.5 rounded-full bg-burgundy px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-ivory hover:bg-burgundy/90 transition-transform active:scale-95"
                >
                  Discover Experiences
                </Link>
              </div>
            </div>
          ) : (
            invitations.map((booking) => (
              <div
                key={booking.id}
                className="overflow-hidden rounded-3xl border border-border/80 bg-card shadow-sm"
              >
                <div className="border-b border-border/60 bg-sage/20 p-6 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="label-mono text-xs font-bold text-burgundy">
                        SEAT #{booking.seatNumber}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-forest/20 px-2 py-0.5 text-[10px] font-semibold text-forest">
                        <CheckCircle2 className="size-3" /> {booking.status === "accepted" ? "Confirmed Pass" : "Pending Confirmation"}
                      </span>
                    </div>
                    <h2 className="font-display mt-2 text-2xl md:text-3xl">{booking.eventTitle}</h2>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase text-muted-foreground">Gate Pass Code</span>
                    <p className="font-mono text-xl font-bold tracking-widest text-foreground">
                      {booking.secretAccessCode}
                    </p>
                  </div>
                </div>

                <div className="grid gap-6 p-6 sm:grid-cols-2">
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="size-4 text-burgundy" />
                      <span className="text-foreground font-medium">{booking.dateDisplay}</span>
                    </div>

                    <div className="flex items-start gap-2 text-muted-foreground">
                      <MapPin className="size-4 text-burgundy shrink-0 mt-0.5" />
                      <div>
                        <span className="text-foreground font-medium">{booking.venueName}</span>
                        <p className="text-muted-foreground text-[11px] mt-0.5">{booking.venueAddress}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="size-4 text-burgundy" />
                      <span>Host: <strong className="text-foreground">{booking.hostName}</strong></span>
                    </div>
                  </div>

                  {/* Safety & SOS Area */}
                  <div className="flex flex-col justify-between rounded-2xl border border-destructive/20 bg-destructive/5 p-4">
                    <div>
                      <div className="flex items-center gap-1.5 font-semibold text-xs text-destructive">
                        <ShieldAlert className="size-4" /> Real-World Safety SOS Shield
                      </div>
                      <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                        In the unlikely event of discomfort, harassment, or an emergency at the table, trigger our priority dispatch beacon.
                      </p>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                      <SosModal
                        bookingId={booking.id}
                        bookingReference={`MEET-${booking.secretAccessCode}`}
                        triggerButton={
                          <Button
                            variant="destructive"
                            className="w-full text-xs font-semibold rounded-full bg-red-700 hover:bg-red-800"
                          >
                            <ShieldAlert className="size-3.5" /> Activate SOS Beacon
                          </Button>
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
