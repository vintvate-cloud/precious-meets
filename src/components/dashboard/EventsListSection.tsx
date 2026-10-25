import { useState, useEffect } from "react";
import { AdminEvent, UserSeatInvitation } from "@/lib/events-service";
import {
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  Users,
  Utensils,
  CheckCircle2,
  Wine,
  Coffee,
  Moon,
  Compass,
  KeyRound,
  QrCode,
  ShieldCheck,
  Mail,
  ArrowRight,
  Copy,
  Check,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import QRCode from "qrcode";
import { toast } from "sonner";

interface EventsListSectionProps {
  events: AdminEvent[];
  acceptedInvitations: UserSeatInvitation[];
  pendingInvitationsCount?: number;
  onViewRequests?: () => void;
  userCity?: string;
  displayName?: string;
  memberId?: string;
  // Backward compatibility
  reservedEventIds?: string[];
  onToggleRsvp?: (event: AdminEvent) => void;
}

export function EventsListSection({
  events,
  acceptedInvitations,
  pendingInvitationsCount = 0,
  onViewRequests,
  userCity = "Delhi NCR",
  displayName = "Member",
  memberId = "PM-8841",
}: EventsListSectionProps) {
  const [selectedPass, setSelectedPass] = useState<UserSeatInvitation | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Generate QR pass when a pass is selected
  useEffect(() => {
    if (!selectedPass) {
      setQrCodeUrl("");
      return;
    }

    const payload = JSON.stringify({
      type: "precious_meets_pass",
      eventId: selectedPass.eventId,
      title: selectedPass.eventTitle,
      seatNumber: selectedPass.seatNumber,
      gateCode: selectedPass.secretAccessCode,
      attendeeName: displayName,
      memberId: memberId,
      timestamp: Date.now(),
    });

    QRCode.toDataURL(payload, {
      width: 260,
      margin: 1.5,
      errorCorrectionLevel: "H",
      color: {
        dark: "#1c0d12",
        light: "#ffffff",
      },
    })
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error("Error generating QR code:", err));
  }, [selectedPass, displayName, memberId]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Secret Gate PIN "${code}" copied to clipboard!`);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-forest font-bold">
              Confirmed Table Reservations
            </span>
            {acceptedInvitations.length > 0 && (
              <span className="rounded-full bg-forest/20 px-2.5 py-0.5 font-mono text-[10px] font-bold text-forest">
                {acceptedInvitations.length} Active {acceptedInvitations.length === 1 ? "Meet" : "Meets"}
              </span>
            )}
          </div>
          <h2 className="font-display mt-1 text-2xl sm:text-3xl text-foreground">
            Confirmed Meets
          </h2>
        </div>

        {/* Quick status pill */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sage/30 px-3.5 py-1.5 text-xs font-semibold text-foreground border border-border/60">
            <ShieldCheck className="size-3.5 text-forest" />
            Verified Tables
          </span>
        </div>
      </div>

      {/* Accepted Meets List or Invite-Only Explanatory State */}
      {acceptedInvitations.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border/80 p-8 sm:p-12 text-center bg-card/60 relative overflow-hidden">
          <div className="relative mx-auto size-14 rounded-full bg-burgundy/10 flex items-center justify-center text-burgundy mb-3 shadow-sm">
            <Wine className="size-6 text-burgundy" />
          </div>

          <h3 className="font-display text-xl sm:text-2xl text-foreground">
            No Confirmed Meets
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Your accepted tables will appear here with gate PINs and seat allocations.
          </p>

          {/* Pending Invitations Prompt or Explanatory Flow */}
          {pendingInvitationsCount > 0 ? (
            <div className="mt-6 max-w-md mx-auto rounded-2xl border border-ochre/40 bg-ochre/10 p-4 text-left">
              <div className="flex items-start gap-3">
                <Mail className="size-5 text-ochre shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-foreground">
                    You have {pendingInvitationsCount} table {pendingInvitationsCount === 1 ? "invitation" : "invitations"} awaiting response!
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Our curators have reserved a seat for you. Review and accept in the Requests tab to attend.
                  </p>
                  {onViewRequests && (
                    <Button
                      size="sm"
                      onClick={onViewRequests}
                      className="mt-3 rounded-full bg-burgundy text-ivory text-xs px-4 font-semibold hover:bg-burgundy/90 shadow-sm"
                    >
                      <span>Review Seat Invitations</span>
                      <ArrowRight className="size-3.5 ml-1.5" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-8 grid gap-3 max-w-xl mx-auto sm:grid-cols-3 text-left">
              <div className="rounded-2xl border border-border/70 bg-card p-3.5">
                <span className="font-mono text-[10px] font-bold text-forest uppercase">Step 1</span>
                <h5 className="font-display text-xs font-semibold text-foreground mt-1">Curator Match</h5>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">
                  Curators balance archetypes and dispatch an invitation email.
                </p>
              </div>

              <div className="rounded-2xl border border-border/70 bg-card p-3.5">
                <span className="font-mono text-[10px] font-bold text-burgundy uppercase">Step 2</span>
                <h5 className="font-display text-xs font-semibold text-foreground mt-1">Accept in Dashboard</h5>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">
                  Review the table theme and click "Accept Seat" in Requests.
                </p>
              </div>

              <div className="rounded-2xl border border-border/70 bg-card p-3.5">
                <span className="font-mono text-[10px] font-bold text-ochre uppercase">Step 3</span>
                <h5 className="font-display text-xs font-semibold text-foreground mt-1">Attend & Unlock</h5>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">
                  Your confirmed seat, gate code, and entry QR appear here.
                </p>
              </div>
            </div>
          )}

          {onViewRequests && pendingInvitationsCount === 0 && (
            <div className="mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={onViewRequests}
                className="rounded-full text-xs px-4 border-border/80"
              >
                <Mail className="size-3.5 mr-1.5 text-ochre" />
                <span>Check Requests & Invitations</span>
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {acceptedInvitations.map((inv) => {
            // Find live event for updated details if available
            const liveEvent = events.find((e) => e.id === inv.eventId);
            const gateCode = inv.secretAccessCode || liveEvent?.secretAccessCode || "GATE-402";
            const coverImage = inv.coverImage || liveEvent?.coverImage || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80";
            const venueName = inv.venueName || liveEvent?.venueName || "Secret Dinner Venue";
            const venueAddress = inv.venueAddress || liveEvent?.venueAddress || "Disclosed upon confirmation";
            const hostName = inv.hostName || liveEvent?.hostName || "Table Facilitator";
            const hostRole = inv.hostRole || liveEvent?.hostRole || "Sommelier & Curator";
            const dateDisplay = inv.dateDisplay || liveEvent?.dateDisplay || "Upcoming Saturday · 7:30 PM";
            const theme = inv.theme || liveEvent?.theme || "Curated Dinner Table";
            const neighborhood = inv.neighborhood || liveEvent?.neighborhood || "South Delhi";
            const city = inv.city || liveEvent?.city || userCity;

            return (
              <div
                key={inv.id}
                className="overflow-hidden rounded-3xl border border-forest/50 bg-card shadow-lg ring-1 ring-forest/20 transition-all duration-300"
              >
                {/* Top Confirmed Banner */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 bg-forest/10 px-5 sm:px-7 py-3">
                  <div className="flex items-center gap-2">
                    <span className="flex size-5 items-center justify-center rounded-full bg-forest text-ivory">
                      <CheckCircle2 className="size-3.5" />
                    </span>
                    <span className="font-mono text-xs font-bold text-forest uppercase tracking-wider">
                      Seat #{inv.seatNumber} Confirmed & Booked
                    </span>
                    <span className="rounded-full bg-forest/20 px-2 py-0.5 text-[10px] font-bold text-forest">
                      Attending
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-muted-foreground">
                      Admin Synced · Booked Guest
                    </span>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-12 md:items-center p-5 sm:p-7">
                  {/* Event Visual */}
                  <div className="relative overflow-hidden rounded-2xl aspect-[16/10] md:col-span-4 bg-muted">
                    <img
                      src={coverImage}
                      alt={inv.eventTitle}
                      className="size-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 rounded-full bg-black/60 px-3 py-1 text-[11px] font-mono text-ivory backdrop-blur-md">
                      {city} · {neighborhood}
                    </div>
                    <div className="absolute bottom-3 right-3 rounded-full bg-burgundy px-3 py-1 text-[10px] font-bold text-ivory shadow-sm">
                      {inv.vibeMatch || 96}% Vibe Match
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="md:col-span-8 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-mono text-xs text-burgundy font-bold flex items-center gap-1.5">
                          <Calendar className="size-3.5" />
                          {dateDisplay}
                        </span>
                        <span className="font-mono text-[11px] text-forest font-semibold bg-forest/15 px-2.5 py-0.5 rounded-full">
                          Table of 6 Guests
                        </span>
                      </div>

                      <h3 className="font-display mt-2 text-2xl sm:text-3xl text-foreground">
                        {inv.eventTitle}
                      </h3>

                      <p className="mt-1 text-xs font-medium text-forest">
                        {theme}
                      </p>

                      {/* Secret Venue & Gate Access Box */}
                      <div className="mt-3 grid gap-3 sm:grid-cols-2 rounded-2xl bg-sage/20 border border-border/80 p-3.5 text-xs">
                        <div>
                          <span className="text-[10px] uppercase font-mono font-bold text-muted-foreground tracking-wider flex items-center gap-1">
                            <MapPin className="size-3 text-forest" />
                            Secret Venue Coordinates
                          </span>
                          <p className="mt-1 font-semibold text-foreground">{venueName}</p>
                          <p className="text-[11px] text-muted-foreground">{venueAddress}</p>
                        </div>

                        <div className="sm:border-l sm:border-border/60 sm:pl-3.5 flex flex-col justify-between">
                          <span className="text-[10px] uppercase font-mono font-bold text-burgundy tracking-wider flex items-center gap-1">
                            <KeyRound className="size-3" />
                            Gate Access PIN
                          </span>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="font-mono text-base font-bold text-foreground bg-card px-2.5 py-0.5 rounded-md border border-border/80">
                              {gateCode}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyCode(gateCode)}
                              className="rounded-full p-1.5 text-muted-foreground hover:bg-card hover:text-foreground transition-all cursor-pointer"
                              title="Copy Gate PIN"
                            >
                              {copiedCode === gateCode ? (
                                <Check className="size-3.5 text-forest" />
                              ) : (
                                <Copy className="size-3.5" />
                              )}
                            </button>
                          </div>
                          <span className="text-[10px] text-muted-foreground">Present to host at door buzzer</span>
                        </div>
                      </div>

                      {/* Host & Table Details */}
                      <div className="mt-3 flex flex-wrap gap-4 text-[11px] text-muted-foreground border-t border-border/60 pt-3">
                        <span>
                          <strong>Host & Curator:</strong> {hostName} ({hostRole})
                        </span>
                        <span>•</span>
                        <span>
                          <strong>Your Seat:</strong> #{inv.seatNumber}
                        </span>
                        <span>•</span>
                        <span>
                          <strong>Atmosphere:</strong> Strictly vetted 50:50 parity
                        </span>
                      </div>
                    </div>

                    {/* Actions Footer */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-4">
                      <div className="flex items-center gap-2 text-xs text-forest">
                        <CheckCircle2 className="size-4" />
                        <span>Attendance Confirmed · Seat Booked in Admin Console</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => setSelectedPass(inv)}
                          className="rounded-full bg-forest text-ivory hover:bg-forest/90 text-xs px-4 font-semibold shadow-sm cursor-pointer"
                        >
                          <QrCode className="size-3.5 mr-1.5" />
                          <span>View Digital Pass</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Digital Pass / QR Code Modal */}
      {selectedPass && (
        <Dialog open={Boolean(selectedPass)} onOpenChange={(open) => !open && setSelectedPass(null)}>
          <DialogContent className="max-w-md bg-card text-foreground border border-border/80 shadow-2xl p-6 sm:rounded-3xl">
            <DialogHeader className="text-center">
              <span className="rounded-full bg-forest/15 px-3 py-1 font-mono text-[10px] font-bold text-forest uppercase tracking-wider mx-auto w-fit">
                Precious Meets Official Pass
              </span>
              <DialogTitle className="font-display text-2xl mt-2 text-foreground">
                {selectedPass.eventTitle}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Present this digital gate pass to your table host upon arrival.
              </DialogDescription>
            </DialogHeader>

            <div className="my-4 flex flex-col items-center justify-center p-4 rounded-2xl bg-ivory border border-border/60 text-center">
              {qrCodeUrl ? (
                <img
                  src={qrCodeUrl}
                  alt="Entry QR Pass"
                  className="size-48 rounded-xl shadow-inner border border-border/40"
                />
              ) : (
                <div className="size-48 rounded-xl bg-muted animate-pulse flex items-center justify-center">
                  <QrCode className="size-10 text-muted-foreground" />
                </div>
              )}

              <div className="mt-3 w-full border-t border-border/60 pt-3 flex items-center justify-between text-xs px-2">
                <span className="text-muted-foreground">Attendee:</span>
                <strong className="text-foreground">{displayName}</strong>
              </div>

              <div className="w-full flex items-center justify-between text-xs px-2 mt-1">
                <span className="text-muted-foreground">Seat Number:</span>
                <span className="font-mono font-bold text-forest">Seat #{selectedPass.seatNumber}</span>
              </div>

              <div className="w-full flex items-center justify-between text-xs px-2 mt-1">
                <span className="text-muted-foreground">Gate PIN:</span>
                <span className="font-mono font-bold text-burgundy">{selectedPass.secretAccessCode}</span>
              </div>
            </div>

            <div className="rounded-xl bg-sage/20 p-3 text-[11px] text-muted-foreground text-center">
              <p>
                Venue: <strong>{selectedPass.venueName}</strong> — {selectedPass.venueAddress}
              </p>
              <p className="mt-0.5 text-[10px]">Strict arrival window: 10 minutes prior to table seating.</p>
            </div>

            <Button
              onClick={() => setSelectedPass(null)}
              className="mt-2 w-full rounded-full bg-foreground text-background text-xs font-semibold"
            >
              Close Pass
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
