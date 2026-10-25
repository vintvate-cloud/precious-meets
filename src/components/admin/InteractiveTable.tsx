import { useState } from "react";
import { AdminEvent, AdminAttendee, EventsService } from "@/lib/events-service";
import { AttendeePickerModal } from "@/components/admin/AttendeePickerModal";
import { EventQrScannerModal } from "@/components/admin/EventQrScannerModal";
import {
  Users,
  ShieldCheck,
  Mail,
  Send,
  Sparkles,
  MapPin,
  Utensils,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Clock,
  KeyRound,
  UserPlus,
  RefreshCw,
  ScanLine,
  QrCode,
} from "lucide-react";
import { toast } from "sonner";

interface InteractiveTableProps {
  event: AdminEvent;
  attendees: AdminAttendee[];
  onEventUpdated: (updated: AdminEvent) => void;
  onOpenScanner?: () => void;
}

// 6 Seat positions in the circular layout (angles around 200, 200 in a 400x400 SVG)
const SEATS_GEOMETRY = [
  { id: 0, deg: -90, label: "Seat 1" },  // Top center
  { id: 1, deg: -30, label: "Seat 2" },  // Top right
  { id: 2, deg: 30,  label: "Seat 3" },  // Bottom right
  { id: 3, deg: 90,  label: "Seat 4" },  // Bottom center
  { id: 4, deg: 150, label: "Seat 5" },  // Bottom left
  { id: 5, deg: 210, label: "Seat 6" },  // Top left
].map((s) => {
  const rad = (s.deg * Math.PI) / 180;
  return {
    ...s,
    chairX: 200 + 138 * Math.cos(rad),
    chairY: 200 + 138 * Math.sin(rad),
    plateX: 200 + 72 * Math.cos(rad),
    plateY: 200 + 72 * Math.sin(rad),
  };
});

export function InteractiveTable({
  event,
  attendees,
  onEventUpdated,
  onOpenScanner,
}: InteractiveTableProps) {
  const [activeSeatIndex, setActiveSeatIndex] = useState<number | null>(null);
  const [sendingEmails, setSendingEmails] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);

  const metrics = EventsService.calculateTableMetrics(event, attendees);
  const checkIns = event.checkIns || {};
  const admittedCount = Object.keys(checkIns).length;
  const seatAcceptances = event.seatAcceptances || {};

  // Seated guest acceptance status calculation
  const seatedAttendeeIds = event.seats.filter(Boolean) as string[];
  const acceptedCount = seatedAttendeeIds.filter(
    (id) => seatAcceptances[id]?.status === "accepted"
  ).length;
  const pendingCount = seatedAttendeeIds.filter(
    (id) => seatAcceptances[id]?.status === "pending" || (!seatAcceptances[id] && Boolean(event.emailsSentAt))
  ).length;
  const declinedCount = seatedAttendeeIds.filter(
    (id) => seatAcceptances[id]?.status === "declined"
  ).length;

  const handleSeatSelect = (attendeeId: string) => {
    if (activeSeatIndex === null) return;
    try {
      const updated = EventsService.assignSeat(event.id, activeSeatIndex, attendeeId);
      onEventUpdated(updated);
      const attendee = attendees.find((a) => a.id === attendeeId);
      toast.success(`${attendee?.name || "Guest"} assigned to Seat #${activeSeatIndex + 1}!`);
    } catch (err: any) {
      toast.error(err.message || "Failed to assign seat.");
    }
  };

  const handleUnseat = (seatIdx: number) => {
    try {
      const updated = EventsService.unassignSeat(event.id, seatIdx);
      onEventUpdated(updated);
      toast.info(`Seat #${seatIdx + 1} has been opened.`);
    } catch (err: any) {
      toast.error(err.message || "Failed to unseat guest.");
    }
  };

  const handleSendEmails = async () => {
    if (metrics.seatedCount === 0) {
      toast.error("Please seat at least one attendee before dispatching secret passes.");
      return;
    }

    setSendingEmails(true);
    try {
      const res = await EventsService.sendEventInvitations(event.id);
      const updated = EventsService.getEventById(event.id);
      if (updated) onEventUpdated(updated);
      toast.success(
        `Secret table invitations & gate PINs successfully dispatched to ${res.dispatchedCount} guests via email!`,
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to send emails.");
    } finally {
      setSendingEmails(false);
    }
  };

  return (
    <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm">
      {/* Event Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider font-bold ${
                event.status === "published"
                  ? "bg-forest/15 text-forest"
                  : event.status === "completed"
                  ? "bg-muted text-muted-foreground"
                  : "bg-ochre/15 text-ochre"
              }`}
            >
              {event.status}
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              Ref: <strong className="text-foreground">{event.secretAccessCode}</strong>
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-forest font-medium">
              {event.city} · {event.neighborhood}
            </span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl mt-1.5">{event.title}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{event.theme}</p>

          {/* Seat Acceptance Status Tracker */}
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300/80 px-2.5 py-0.5 text-[11px] font-bold shadow-2xs">
              <CheckCircle2 className="size-3 text-emerald-600" />
              <span>{acceptedCount}/{metrics.seatedCount} Seats Accepted & Booked</span>
            </span>
            {pendingCount > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-ochre/15 text-ochre border border-ochre/30 px-2.5 py-0.5 text-[11px] font-medium">
                <Clock className="size-3" />
                <span>{pendingCount} Awaiting Acceptance</span>
              </span>
            )}
            {declinedCount > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 text-destructive border border-destructive/20 px-2.5 py-0.5 text-[11px] font-medium">
                <span>{declinedCount} Declined</span>
              </span>
            )}
          </div>
        </div>

        {/* Quick Action Buttons: Scan Entry QR & Email Dispatch */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              if (onOpenScanner) {
                onOpenScanner();
              } else {
                setScannerOpen(true);
              }
            }}
            className="group flex items-center gap-2 rounded-full bg-forest px-4 sm:px-5 py-2.5 text-xs font-semibold text-ivory shadow-md transition-all duration-300 hover:bg-forest/90 hover:scale-105 hover:shadow-lg active:scale-95 cursor-pointer"
          >
            <ScanLine className="size-4 text-ivory transition-transform duration-300 group-hover:scale-110" />
            <span>Scan Entry QR</span>
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-mono font-bold">
              {admittedCount}/{metrics.seatedCount}
            </span>
          </button>

          <button
            type="button"
            disabled={sendingEmails || metrics.seatedCount === 0}
            onClick={handleSendEmails}
            className="group flex items-center gap-2 rounded-full bg-burgundy px-4 sm:px-5 py-2.5 text-xs font-semibold text-ivory shadow-md transition-all duration-300 hover:bg-burgundy/90 hover:scale-105 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {sendingEmails ? (
              <RefreshCw className="size-4 animate-spin text-ivory" />
            ) : (
              <Send className="size-4 text-ivory transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            )}
            <span>Dispatch Passes ({metrics.seatedCount}/6)</span>
          </button>
        </div>
      </div>

      {/* Table Dynamics & Safety Parity Bar with Microinteractions */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Parity */}
        <div className="flex items-center gap-3 rounded-2xl bg-sage/20 border border-forest/20 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm hover:border-forest/40 cursor-default">
          <div
            className={`flex size-10 items-center justify-center rounded-xl transition-transform duration-200 hover:scale-105 ${
              metrics.isParityOptimal
                ? "bg-forest/20 text-forest ring-1 ring-forest/30"
                : "bg-ochre/20 text-ochre ring-1 ring-ochre/30"
            }`}
          >
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
              Gender Parity Protocol
            </span>
            <span className="text-xs font-semibold text-foreground flex items-center gap-1 mt-0.5">
              {metrics.isParityOptimal && <span className="size-1.5 rounded-full bg-forest animate-pulse" />}
              {metrics.parityLabel}
            </span>
          </div>
        </div>

        {/* Vibe & Harmony Score */}
        <div className="flex items-center gap-3 rounded-2xl bg-sage/20 border border-forest/20 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm hover:border-burgundy/40 cursor-default">
          <div className="flex size-10 items-center justify-center rounded-xl bg-burgundy/15 text-burgundy ring-1 ring-burgundy/25 transition-transform duration-200 hover:scale-105">
            <Sparkles className="size-5 text-burgundy" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
              Psychometric Harmony
            </span>
            <span className="text-xs font-semibold text-foreground mt-0.5 block">
              {metrics.harmonyScore}% Collective Vibe Match
            </span>
          </div>
        </div>

        {/* Dietary Harmony */}
        <div className="flex items-center gap-3 rounded-2xl bg-sage/20 border border-forest/20 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm hover:border-ochre/40 cursor-default">
          <div className="flex size-10 items-center justify-center rounded-xl bg-ochre/20 text-ochre ring-1 ring-ochre/30 transition-transform duration-200 hover:scale-105">
            <Utensils className="size-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
              Dietary Matrix
            </span>
            <span className="text-xs font-semibold text-foreground mt-0.5 block truncate max-w-[180px]">
              {metrics.dietarySummary.veg} Veg · {metrics.dietarySummary.nonVeg} Non-Veg
              {metrics.dietarySummary.jain > 0 ? ` · ${metrics.dietarySummary.jain} Jain` : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Dispatch Status Notice */}
      {event.emailsSentAt && (
        <div className="mt-3 flex items-center justify-between rounded-xl bg-forest/10 border border-forest/20 px-4 py-2 text-xs text-forest">
          <span className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="size-4" />
            Official Table Passes & Secret Gate PINs dispatched to all seated attendees.
          </span>
          <span className="text-[11px] font-mono text-muted-foreground">
            Sent: {new Date(event.emailsSentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      )}

      {/* Architectural Dining Table Visual Canvas */}
      <div className="mt-8 flex flex-col items-center justify-center">
        <div className="relative size-[340px] sm:size-[420px] md:size-[460px]">
          {/* SVG Diagram Canvas */}
          <svg
            viewBox="0 0 400 400"
            className="size-full overflow-visible"
            aria-hidden
          >
            {/* Guide Circles */}
            <circle cx="200" cy="200" r="184" fill="none" stroke="#E4D7CA" strokeWidth="1" strokeDasharray="4 6" />
            <circle cx="200" cy="200" r="138" fill="none" stroke="#DCCBB9" strokeWidth="0.9" strokeDasharray="8 6" />
            <circle cx="200" cy="200" r="104" fill="none" stroke="#E0D1C2" strokeWidth="0.8" />

            {/* Central Wooden Dining Table Disc */}
            <circle
              cx="200"
              cy="200"
              r="92"
              fill="#DFCAAC"
              stroke="#3E2C20"
              strokeWidth="1.2"
              style={{ filter: "drop-shadow(0 8px 24px rgba(62,44,32,0.12))" }}
            />
            <circle cx="200" cy="200" r="90" fill="#DEC7A8" stroke="#3E2C20" strokeWidth="0.8" />

            {/* Inscription in Table Center */}
            <text
              x="200"
              y="188"
              textAnchor="middle"
              fill="#3E2C20"
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic",
                fontSize: "16px",
              }}
            >
              The Long Table
            </text>
            <text
              x="200"
              y="206"
              textAnchor="middle"
              fill="#5A4535"
              style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: "10.5px",
                letterSpacing: "0.08em",
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              {metrics.seatedCount} of 6 Seats Filled
            </text>
            <line x1="184" y1="216" x2="216" y2="216" stroke="#962838" strokeWidth="1.2" strokeLinecap="round" />
            <text
              x="200"
              y="228"
              textAnchor="middle"
              fill="#5A4535"
              style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: "9px",
                color: "#691C35",
              }}
            >
              PIN: {event.secretAccessCode}
            </text>
          </svg>

          {/* 6 Reactive HTML Seat Overlays (Absolute positioning around the 400x400 center) */}
          {SEATS_GEOMETRY.map((seat) => {
            const attendeeId = event.seats[seat.id];
            const attendee = attendeeId ? attendees.find((a) => a.id === attendeeId) : null;

            // Percentage coordinates in the container (0..100%)
            const leftPct = (seat.chairX / 400) * 100;
            const topPct = (seat.chairY / 400) * 100;

            return (
              <div
                key={seat.id}
                style={{
                  left: `${leftPct}%`,
                  top: `${topPct}%`,
                  transform: "translate(-50%, -50%)",
                }}
                className="absolute z-20"
              >
                {attendee ? (
                  // OCCUPIED SEAT CARD
                  (() => {
                    const isCheckedIn = Boolean(checkIns[attendee.id]);
                    const acceptance = seatAcceptances[attendee.id];
                    const isAccepted = acceptance?.status === "accepted";
                    const isPending = acceptance?.status === "pending" || (!acceptance && Boolean(event.emailsSentAt));
                    const isDeclined = acceptance?.status === "declined";

                    return (
                      <div
                        onClick={() => setActiveSeatIndex(seat.id)}
                        className="group relative flex flex-col items-center cursor-pointer transition-all duration-300 hover:-translate-y-1"
                      >
                        <div className="relative">
                          <img
                            src={attendee.avatar}
                            alt={attendee.name}
                            className={`size-12 sm:size-14 rounded-full object-cover border-2 shadow-md transition-all duration-300 group-hover:scale-110 ${
                              isCheckedIn
                                ? "border-forest ring-2 ring-forest/60"
                                : isAccepted
                                ? "border-emerald-600 ring-2 ring-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.35)]"
                                : isPending
                                ? "border-ochre ring-2 ring-ochre/40"
                                : attendee.gender === "female"
                                ? "border-forest ring-2 ring-forest/30"
                                : "border-burgundy ring-2 ring-burgundy/30"
                            }`}
                          />
                          <span
                            className={`absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full text-ivory text-[10px] font-bold shadow-xs transition-transform duration-200 group-hover:scale-110 ${
                              isAccepted ? "bg-emerald-700" : "bg-forest"
                            }`}
                          >
                            {seat.id + 1}
                          </span>

                          {/* Checked In badge */}
                          {isCheckedIn && (
                            <span
                              title={`Admitted at ${new Date(checkIns[attendee.id]?.checkedInAt || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
                              className="absolute -top-1 -left-1 flex size-5 items-center justify-center rounded-full bg-forest text-ivory shadow-sm ring-2 ring-background animate-in zoom-in"
                            >
                              <CheckCircle2 className="size-3.5" />
                            </span>
                          )}

                          {/* Accepted & Booked badge (if not checked in) */}
                          {!isCheckedIn && isAccepted && (
                            <span
                              title={`Seat #${seat.id + 1} Accepted & Booked by member`}
                              className="absolute -top-1 -left-1 flex size-5 items-center justify-center rounded-full bg-emerald-600 text-ivory shadow-sm ring-2 ring-background animate-in zoom-in"
                            >
                              <CheckCircle2 className="size-3.5" />
                            </span>
                          )}

                          {/* Pending Awaiting Acceptance badge */}
                          {!isCheckedIn && !isAccepted && isPending && (
                            <span
                              title={`Pass sent · Awaiting member acceptance`}
                              className="absolute -top-1 -left-1 flex size-5 items-center justify-center rounded-full bg-ochre text-ink shadow-sm ring-2 ring-background animate-in zoom-in"
                            >
                              <Clock className="size-3" />
                            </span>
                          )}
                        </div>

                        <div className="mt-1.5 flex flex-col items-center text-center">
                          <span className="text-xs font-bold text-foreground max-w-[85px] sm:max-w-[100px] truncate group-hover:text-burgundy transition-colors">
                            {attendee.name.split(" ")[0]}
                          </span>
                          {isCheckedIn ? (
                            <span className="text-[9px] text-forest font-bold bg-forest/20 px-1.5 py-0.2 rounded-full mt-0.5 flex items-center gap-0.5 shadow-xs">
                              <CheckCircle2 className="size-2.5" /> Admitted
                            </span>
                          ) : isAccepted ? (
                            <span className="text-[9px] text-emerald-800 font-bold bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 px-1.5 py-0.2 rounded-full mt-0.5 flex items-center gap-0.5 shadow-xs border border-emerald-300/80">
                              <CheckCircle2 className="size-2.5 text-emerald-600" /> Accepted & Booked
                            </span>
                          ) : isPending ? (
                            <span className="text-[9px] text-ochre font-semibold bg-ochre/15 px-1.5 py-0.2 rounded-full mt-0.5 flex items-center gap-0.5">
                              <Clock className="size-2.5" /> Awaiting Accept
                            </span>
                          ) : isDeclined ? (
                            <span className="text-[9px] text-destructive font-semibold bg-destructive/15 px-1.5 py-0.2 rounded-full mt-0.5">
                              Declined
                            </span>
                          ) : (
                            <span className="text-[10px] text-forest font-medium bg-forest/10 px-1.5 py-0.2 rounded-full mt-0.5">
                              {attendee.archetype.title.replace("The ", "")}
                            </span>
                          )}
                        </div>

                        {/* Quick Unseat button on hover with microinteraction */}
                        <button
                          type="button"
                          title="Unseat attendee"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUnseat(seat.id);
                          }}
                          className="absolute -top-2 -right-2 hidden size-5 items-center justify-center rounded-full bg-destructive text-white text-[10px] font-bold group-hover:flex shadow-md transition-all duration-200 hover:scale-125 hover:rotate-90 active:scale-90"
                        >
                          &times;
                        </button>
                      </div>
                    );
                  })()
                ) : (
                  // EMPTY SEAT BUTTON
                  <button
                    type="button"
                    onClick={() => setActiveSeatIndex(seat.id)}
                    className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/90 bg-background/95 p-2 sm:p-2.5 shadow-xs transition-all duration-300 hover:border-burgundy hover:bg-burgundy/[0.04] hover:-translate-y-1 hover:shadow-md active:scale-95 cursor-pointer"
                  >
                    <div className="flex size-9 sm:size-10 items-center justify-center rounded-full bg-sage/40 text-muted-foreground group-hover:bg-burgundy group-hover:text-ivory group-hover:scale-110 group-hover:shadow-sm transition-all duration-300">
                      <UserPlus className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
                    </div>
                    <span className="mt-1 text-[11px] font-bold text-foreground group-hover:text-burgundy transition-colors">
                      Seat #{seat.id + 1}
                    </span>
                    <span className="text-[9px] text-muted-foreground font-mono group-hover:text-burgundy/80 transition-colors">
                      + Assign
                    </span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Venue Secrets & Logistics Bar */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border/60 pt-6 text-xs text-muted-foreground">
        <div className="space-y-1.5">
          <span className="font-bold text-foreground flex items-center gap-1.5">
            <MapPin className="size-3.5 text-forest" />
            Secret Venue Coordinates
          </span>
          <p className="leading-relaxed">
            <strong className="text-foreground">{event.venueName}</strong> — {event.venueAddress}
          </p>
          <p className="text-[11px] font-mono text-forest">
            Gate Access Code: <strong>{event.secretAccessCode}</strong>
          </p>
        </div>

        <div className="space-y-1.5 md:text-right">
          <span className="font-bold text-foreground flex items-center md:justify-end gap-1.5">
            <Users className="size-3.5 text-burgundy" />
            Vetted Table Host & Custodian
          </span>
          <p className="leading-relaxed">
            <strong className="text-foreground">{event.hostName}</strong> ({event.hostRole})
          </p>
          <p className="text-[11px] text-muted-foreground">
            Strict 50:50 gender parity protocol & host supervision enforced.
          </p>
        </div>
      </div>

      {/* Attendee Picker Modal */}
      {activeSeatIndex !== null && (
        <AttendeePickerModal
          open={activeSeatIndex !== null}
          onClose={() => setActiveSeatIndex(null)}
          seatIndex={activeSeatIndex}
          currentAttendeeId={event.seats[activeSeatIndex] ?? null}
          onSelectAttendee={handleSeatSelect}
          onUnseatAttendee={() => handleUnseat(activeSeatIndex)}
          alreadySeatedIds={event.seats}
          attendees={attendees}
          seatAcceptance={
            event.seats[activeSeatIndex]
              ? event.seatAcceptances?.[event.seats[activeSeatIndex]!]
              : undefined
          }
          onToggleAcceptance={(status) => {
            const attId = event.seats[activeSeatIndex];
            if (attId) {
              const updated = EventsService.adminSetSeatAcceptance(event.id, attId, status);
              onEventUpdated(updated);
              toast.success(
                status === "accepted"
                  ? "Seat marked as Accepted & Booked!"
                  : "Seat reverted to Pending acceptance."
              );
            }
          }}
        />
      )}

      {/* Event Gate QR Scanner Modal */}
      {scannerOpen && (
        <EventQrScannerModal
          open={scannerOpen}
          onOpenChange={setScannerOpen}
          event={event}
          attendees={attendees}
          onEventUpdated={onEventUpdated}
        />
      )}
    </div>
  );
}
