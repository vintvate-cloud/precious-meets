import { useState } from "react";
import { UserSeatInvitation, EventsService } from "@/lib/events-service";
import {
  Mail,
  Sparkles,
  Calendar,
  MapPin,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Utensils,
  ChevronRight,
  AlertCircle,
  CornerDownRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface SeatInvitationsSectionProps {
  invitations: UserSeatInvitation[];
  onInvitationUpdated: () => void;
  onViewAcceptedMeets?: () => void;
}

export function SeatInvitationsSection({
  invitations,
  onInvitationUpdated,
  onViewAcceptedMeets,
}: SeatInvitationsSectionProps) {
  const [filter, setFilter] = useState<"pending" | "accepted" | "all">("pending");
  const [declineTarget, setDeclineTarget] = useState<UserSeatInvitation | null>(null);
  const [declineReason, setDeclineReason] = useState<string>("Date conflict");

  const safeInvitations = Array.isArray(invitations) ? invitations.filter(Boolean) : [];
  const pendingCount = safeInvitations.filter((i) => i.status === "pending").length;

  const filteredInvitations = safeInvitations.filter((inv) => {
    if (filter === "pending") return inv.status === "pending";
    if (filter === "accepted") return inv.status === "accepted";
    return true;
  });

  const handleAccept = (invitation: UserSeatInvitation) => {
    try {
      EventsService.respondToInvitation(invitation.id, "accepted");
      toast.success(
        `Seat #${invitation.seatNumber} confirmed for "${invitation.eventTitle}"! Door PIN unlocked.`
      );
      onInvitationUpdated();
    } catch (err: any) {
      toast.error(err.message || "Failed to accept invitation");
    }
  };

  const handleConfirmDecline = () => {
    if (!declineTarget) return;
    try {
      EventsService.respondToInvitation(declineTarget.id, "declined", declineReason);
      toast.info(
        `Invitation for "${declineTarget.eventTitle}" politely passed. Your membership seat credits remain 100% intact.`
      );
      setDeclineTarget(null);
      onInvitationUpdated();
    } catch (err: any) {
      toast.error(err.message || "Failed to decline invitation");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-ochre font-bold">
              Personal Matchmaking
            </span>
            {pendingCount > 0 && (
              <span className="rounded-full bg-ochre/20 px-2 py-0.5 font-mono text-[10px] font-bold text-ochre">
                {pendingCount} Awaiting Response
              </span>
            )}
          </div>
          <h2 className="font-display mt-1 text-2xl sm:text-3xl text-foreground">
            Seat Invitations
          </h2>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {[
            { id: "pending", label: `Pending (${pendingCount})` },
            { id: "accepted", label: "Accepted Seats" },
            { id: "all", label: "History" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                filter === f.id
                  ? "bg-burgundy text-ivory shadow-sm"
                  : "bg-sage/40 text-muted-foreground hover:bg-sage/60 hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Invitations List */}
      {filteredInvitations.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border/80 p-12 text-center bg-card/50">
          <Mail className="size-10 text-muted-foreground/40 mx-auto" />
          <h3 className="font-display text-lg mt-3">
            {filter === "pending"
              ? "No pending seat invitations at this moment"
              : "No invitations match this view"}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            When our curation team pairs you with an upcoming 6-person dinner circle, your seat offer will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredInvitations.map((inv) => {
            const isPending = inv.status === "pending";
            const isAccepted = inv.status === "accepted";
            const isDeclined = inv.status === "declined";

            return (
              <div
                key={inv.id}
                className={`overflow-hidden rounded-3xl border transition-all duration-300 ${
                  isPending
                    ? "border-ochre/50 bg-card shadow-lg ring-1 ring-ochre/20"
                    : isAccepted
                    ? "border-forest/50 bg-card shadow-sm"
                    : "border-border/60 bg-card/60 opacity-80"
                }`}
              >
                {/* Invitation Banner */}
                <div
                  className={`p-4 border-b text-xs flex flex-wrap items-center justify-between gap-2 ${
                    isPending
                      ? "bg-gradient-to-r from-ochre/20 to-burgundy/10 border-ochre/30 text-foreground"
                      : isAccepted
                      ? "bg-forest/15 border-forest/20 text-forest"
                      : "bg-muted/40 border-border/40 text-muted-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2 font-medium">
                    <Sparkles className="size-4 text-ochre" />
                    <span>
                      {isPending
                        ? "Curator Invitation: Seat Reserved for Your Response"
                        : isAccepted
                        ? "Invitation Accepted · Your Seat is Confirmed"
                        : `Invitation Declined (${inv.declineReason || "Passed"})`}
                    </span>
                  </div>

                  <span className="font-mono text-[10px] text-muted-foreground">
                    Seat #{inv.seatNumber} of 6
                  </span>
                </div>

                {/* Content Body */}
                <div className="grid gap-6 p-5 sm:p-7 md:grid-cols-12 md:items-center">
                  {/* Thumbnail */}
                  <div className="relative overflow-hidden rounded-2xl aspect-[16/10] md:col-span-4 bg-muted">
                    <img
                      src={inv.coverImage}
                      alt={inv.eventTitle}
                      className="size-full object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5 rounded-full bg-black/60 px-2.5 py-0.5 text-[10px] font-mono text-ivory backdrop-blur-md">
                      {inv.city} · {inv.neighborhood}
                    </div>
                  </div>

                  {/* Text Details */}
                  <div className="md:col-span-8 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-mono text-xs text-burgundy font-bold">
                        {inv.dateDisplay}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-ochre/15 px-2.5 py-0.5 text-[10px] font-bold text-ochre">
                        {inv.vibeMatch}% Archetype Match
                      </span>
                    </div>

                    <h3 className="font-display text-2xl text-foreground">
                      {inv.eventTitle}
                    </h3>

                    {/* Curator Note */}
                    <div className="rounded-2xl bg-sage/25 p-3.5 border border-border/60">
                      <div className="flex items-start gap-2 text-xs">
                        <CornerDownRight className="size-4 text-burgundy shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-foreground">Why you were selected: </strong>
                          <span className="text-muted-foreground">{inv.curatorNote}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-[11px] text-muted-foreground pt-1">
                      <span>
                        <strong>Host:</strong> {inv.hostName} ({inv.hostRole})
                      </span>
                      <span>•</span>
                      <span>
                        <strong>Venue Area:</strong> {inv.neighborhood}
                      </span>
                    </div>

                    {/* Actions / Status Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-4">
                      {isPending ? (
                        <>
                          <span className="text-xs text-muted-foreground">
                            Decision requested within 48h to finalize table chemistry
                          </span>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDeclineTarget(inv)}
                              className="rounded-full border-border/80 text-xs px-4 text-muted-foreground hover:text-foreground cursor-pointer"
                            >
                              Politely Decline
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleAccept(inv)}
                              className="rounded-full bg-burgundy text-ivory text-xs px-5 hover:bg-burgundy/90 shadow-sm font-semibold cursor-pointer"
                            >
                              Accept Seat (Confirmed)
                            </Button>
                          </div>
                        </>
                      ) : isAccepted ? (
                        <div className="flex flex-wrap items-center justify-between w-full gap-2">
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest">
                            <CheckCircle2 className="size-4" /> Secret Door Gate PIN:{" "}
                            <strong className="font-mono text-foreground font-bold ml-1">
                              {inv.secretAccessCode}
                            </strong>
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-muted-foreground hidden sm:inline">
                              Booked & Confirmed
                            </span>
                            {onViewAcceptedMeets && (
                              <Button
                                size="sm"
                                onClick={onViewAcceptedMeets}
                                className="rounded-full bg-forest text-ivory text-xs px-3.5 hover:bg-forest/90 font-semibold cursor-pointer"
                              >
                                View in My Meets →
                              </Button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
                          <span>Invitation declined on your behalf.</span>
                          <span className="font-medium text-forest">Credits Intact</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Decline Confirmation Modal */}
      <Dialog open={Boolean(declineTarget)} onOpenChange={() => setDeclineTarget(null)}>
        <DialogContent className="sm:max-w-md bg-card text-card-foreground rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              Decline Seat Invitation?
            </DialogTitle>
            <DialogDescription className="text-xs">
              Declining will release this seat back to the table pool so another compatible member can attend. Your membership seat credit will not be used.
            </DialogDescription>
          </DialogHeader>

          <div className="my-4 space-y-3">
            <label className="text-xs font-medium text-foreground block">
              Reason for passing (optional):
            </label>
            <div className="grid grid-cols-1 gap-2 text-xs">
              {[
                "Date conflict / Busy schedule",
                "Traveling / Out of town",
                "Prefer a different format (e.g. coffee rather than dinner)",
                "Already booked another gathering",
              ].map((reason) => (
                <button
                  key={reason}
                  type="button"
                  onClick={() => setDeclineReason(reason)}
                  className={`rounded-xl p-3 text-left border transition-all cursor-pointer ${
                    declineReason === reason
                      ? "border-burgundy bg-burgundy/10 text-foreground font-semibold"
                      : "border-border/80 bg-background text-muted-foreground hover:bg-sage/20"
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>
          </div>

          <DialogFooter className="flex flex-row justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeclineTarget(null)}
              className="rounded-full text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleConfirmDecline}
              className="rounded-full bg-destructive text-destructive-foreground text-xs hover:bg-destructive/90"
            >
              Confirm Decline
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
