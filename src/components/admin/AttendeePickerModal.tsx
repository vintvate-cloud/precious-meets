import { useState, useMemo } from "react";
import { AdminAttendee, SeatAcceptance } from "@/lib/events-service";
import { isDeletedUser } from "@/lib/deleted-users";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Search,
  ShieldCheck,
  Sparkles,
  UserCheck,
  UserX,
  X,
  Check,
  Filter,
  CheckCircle2,
  Clock,
  Mail,
  Send,
} from "lucide-react";

interface AttendeePickerModalProps {
  open: boolean;
  onClose: () => void;
  seatIndex: number;
  currentAttendeeId: string | null;
  onSelectAttendee: (attendeeId: string) => void;
  onUnseatAttendee?: () => void;
  alreadySeatedIds: (string | null)[];
  attendees: AdminAttendee[];
  seatAcceptance?: SeatAcceptance;
  onToggleAcceptance?: (status: "pending" | "accepted") => void;
}

export function AttendeePickerModal({
  open,
  onClose,
  seatIndex,
  currentAttendeeId,
  onSelectAttendee,
  onUnseatAttendee,
  alreadySeatedIds,
  attendees = [],
  seatAcceptance,
  onToggleAcceptance,
}: AttendeePickerModalProps) {
  const [search, setSearch] = useState("");
  const [filterGender, setFilterGender] = useState<"all" | "female" | "male">("all");

  const filteredAttendees = useMemo(() => {
    return (attendees || []).filter((a) => {
      if (isDeletedUser(a.email, a.id)) return false;

      const matchSearch =
        (a.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (a.email?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (a.archetype?.title?.toLowerCase() || "").includes(search.toLowerCase());

      const matchGender = filterGender === "all" || a.gender === filterGender;

      return matchSearch && matchGender;
    });
  }, [attendees, search, filterGender]);

  const currentAttendee = attendees?.find((a) => a.id === currentAttendeeId);
  const isAccepted = seatAcceptance?.status === "accepted";
  const isEmailSent = Boolean(seatAcceptance?.emailSent);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-2xl bg-card text-foreground border border-border/80 shadow-2xl p-0 overflow-hidden sm:rounded-3xl">
        {/* Header */}
        <div className="bg-sage/20 border-b border-border/70 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex size-7 items-center justify-center rounded-full bg-burgundy text-ivory text-xs font-bold">
                {seatIndex + 1}
              </span>
              <div>
                <DialogTitle className="font-display text-2xl">
                  Curate Seat #{seatIndex + 1}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Select a verified subscriber to take this place at the table.
                </DialogDescription>
              </div>
            </div>

            {currentAttendee && onUnseatAttendee && (
              <button
                type="button"
                onClick={() => {
                  onUnseatAttendee();
                  onClose();
                }}
                className="flex items-center gap-1.5 rounded-full border border-destructive/40 bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive hover:text-white transition-colors"
              >
                <UserX className="size-3.5" />
                Unseat Guest
              </button>
            )}
          </div>

          {/* Seated Guest Acceptance Status Bar */}
          {currentAttendee && (
            <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-card border border-border/80 p-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div
                  className={`size-8 rounded-full flex items-center justify-center font-display text-xs font-semibold text-ivory border shadow-xs ${
                    currentAttendee.gender === "female"
                      ? "bg-forest border-forest/40"
                      : "bg-burgundy border-burgundy/40"
                  }`}
                >
                  {currentAttendee.name
                    .trim()
                    .split(/\s+/)
                    .filter(Boolean)
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </div>
                <div>
                  <span className="text-xs font-bold text-foreground block leading-tight">
                    {currentAttendee.name}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {isAccepted ? (
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full text-[10px]">
                        <CheckCircle2 className="size-3 text-emerald-600" /> Member Accepted & Booked
                      </span>
                    ) : isEmailSent ? (
                      <span className="inline-flex items-center gap-1 font-semibold text-amber-800 bg-amber-100 dark:bg-amber-950 dark:text-amber-300 border border-amber-300/60 px-2 py-0.5 rounded-full text-[10px]">
                        <Mail className="size-3 text-amber-600" /> Email Sent · Waiting for Acceptance
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-semibold text-blue-700 bg-blue-100 dark:bg-blue-950 dark:text-blue-300 border border-blue-300/60 px-2 py-0.5 rounded-full text-[10px]">
                        <Send className="size-3 text-blue-600" /> Pass Not Sent Yet
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {onToggleAcceptance && (
                <button
                  type="button"
                  onClick={() => onToggleAcceptance(isAccepted ? "pending" : "accepted")}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                    isAccepted
                      ? "border border-border/80 bg-background text-muted-foreground hover:bg-sage/40"
                      : "bg-forest text-ivory hover:bg-forest/90 shadow-sm"
                  }`}
                >
                  {isAccepted ? "Revert to Pending" : "Mark as Accepted (Manual Override)"}
                </button>
              )}
            </div>
          )}

          {/* Search & Gender Filter Chips */}
          <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, email, or vibe archetype..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-full border border-border bg-background py-2 pl-10 pr-4 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-burgundy"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setFilterGender("all")}
                className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-colors ${
                  filterGender === "all"
                    ? "bg-foreground text-background"
                    : "bg-background border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFilterGender("female")}
                className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-colors ${
                  filterGender === "female"
                    ? "bg-forest text-ivory"
                    : "bg-background border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                Women (Parity)
              </button>
              <button
                type="button"
                onClick={() => setFilterGender("male")}
                className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-colors ${
                  filterGender === "male"
                    ? "bg-burgundy text-ivory"
                    : "bg-background border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                Men
              </button>
            </div>
          </div>
        </div>

        {/* Candidate List with Independent Luxury Scroll & Microinteractions */}
        <div className="max-h-[380px] overflow-y-auto admin-scroll p-6 space-y-3">
          {filteredAttendees.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-xs">
              No matching verified members found.
            </div>
          ) : (
            filteredAttendees.map((attendee) => {
              const isSelectedForThisSeat = attendee.id === currentAttendeeId;
              const isSeatedElsewhere =
                alreadySeatedIds.includes(attendee.id) && !isSelectedForThisSeat;
              const seatedAtOtherSeat = alreadySeatedIds.indexOf(attendee.id);

              return (
                <div
                  key={attendee.id}
                  onClick={() => {
                    onSelectAttendee(attendee.id);
                    onClose();
                  }}
                  className={`group relative flex items-center justify-between rounded-2xl border p-3.5 transition-all duration-200 cursor-pointer hover:scale-[1.01] ${
                    isSelectedForThisSeat
                      ? "border-burgundy bg-burgundy/5 ring-1 ring-burgundy shadow-sm"
                      : "border-border/80 bg-background hover:border-burgundy/50 hover:bg-sage/20 hover:shadow-xs"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`size-11 rounded-full flex items-center justify-center font-display text-sm font-semibold border shadow-xs shrink-0 transition-transform duration-200 group-hover:scale-105 select-none ${
                        attendee.gender === "female"
                          ? "bg-forest/15 text-forest border-forest/30 group-hover:bg-forest group-hover:text-ivory"
                          : "bg-burgundy/15 text-burgundy border-burgundy/30 group-hover:bg-burgundy group-hover:text-ivory"
                      }`}
                    >
                      {attendee.name
                        .trim()
                        .split(/\s+/)
                        .filter(Boolean)
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-foreground">
                          {attendee.name}
                        </span>
                        {attendee.identityVerified && (
                          <span
                            title="100% Offline Aadhaar Verified via DigiLocker"
                            className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-forest bg-forest/10 px-1.5 py-0.2 rounded-full"
                          >
                            <ShieldCheck className="size-3" /> Verified
                          </span>
                        )}
                        <span
                          className={`text-[10px] px-2 py-0.2 rounded-full font-mono uppercase ${
                            attendee.gender === "female"
                              ? "bg-forest/15 text-forest"
                              : "bg-burgundy/15 text-burgundy"
                          }`}
                        >
                          {attendee.gender}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                        <span className="flex items-center gap-1 text-foreground/80 font-medium">
                          <Sparkles className="size-3 text-ochre" />
                          {attendee.archetype?.title || "Curated Member"}
                        </span>
                        <span>•</span>
                        <span>{attendee.email}</span>
                        <span>•</span>
                        <span className="text-forest font-mono">{attendee.dietary || "Vegetarian"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isSeatedElsewhere ? (
                      <span className="text-[10px] bg-amber-500/15 text-amber-700 dark:text-amber-300 font-mono px-2 py-1 rounded-full">
                        At Seat #{seatedAtOtherSeat + 1} (Will move)
                      </span>
                    ) : isSelectedForThisSeat ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-burgundy px-3 py-1 text-xs font-semibold text-ivory">
                        <Check className="size-3.5" /> Seated
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold text-foreground group-hover:bg-burgundy group-hover:text-ivory group-hover:border-burgundy transition-colors"
                      >
                        Seat Here &rarr;
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
