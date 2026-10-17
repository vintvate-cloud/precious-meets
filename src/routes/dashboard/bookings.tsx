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

function DashboardBookingsPage() {
  const { user } = useAuth();

  const MOCK_BOOKINGS = [
    {
      id: "bk_001",
      reference: "PM-X92F8A",
      title: "The Long Table Supper",
      neighborhood: "Bandra West, Mumbai",
      venueAddress: "The Loft at Chapel Road, Ranwar Village, Bandra West, Mumbai 400050",
      date: "Thursday · 8:00 PM",
      seats: 1,
      totalAmount: 2499,
      status: "confirmed",
      host: "Chef Tara Sen",
      accessCode: "GATE-402",
    },
  ];

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
          {MOCK_BOOKINGS.map((booking) => (
            <div
              key={booking.id}
              className="overflow-hidden rounded-3xl border border-border/80 bg-card shadow-sm"
            >
              <div className="border-b border-border/60 bg-sage/20 p-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="label-mono text-xs font-bold text-burgundy">
                      {booking.reference}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-forest/20 px-2 py-0.5 text-[10px] font-semibold text-forest">
                      <CheckCircle2 className="size-3" /> Confirmed
                    </span>
                  </div>
                  <h2 className="font-display mt-2 text-2xl md:text-3xl">{booking.title}</h2>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase text-muted-foreground">Gate Pass Code</span>
                  <p className="font-mono text-xl font-bold tracking-widest text-foreground">
                    {booking.accessCode}
                  </p>
                </div>
              </div>

              <div className="grid gap-6 p-6 sm:grid-cols-2">
                <div className="space-y-3 text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="size-4 text-burgundy" />
                    <span className="text-foreground font-medium">{booking.date}</span>
                  </div>

                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="size-4 text-burgundy shrink-0 mt-0.5" />
                    <div>
                      <span className="text-foreground font-medium">{booking.neighborhood}</span>
                      <p className="text-muted-foreground text-[11px] mt-0.5">{booking.venueAddress}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="size-4 text-burgundy" />
                    <span>Host: <strong className="text-foreground">{booking.host}</strong> ({booking.seats} seat reserved)</span>
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
                      bookingReference={booking.reference}
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
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
