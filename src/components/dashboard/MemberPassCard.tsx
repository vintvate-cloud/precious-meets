import { useState, useEffect } from "react";
import QRCode from "qrcode";
import {
  ShieldCheck,
  Sparkles,
  Ticket,
  QrCode,
  Calendar,
  Compass,
  Mail,
} from "lucide-react";
import {
  UniversalMemberPassModal,
  SeatedEvent,
} from "@/components/dashboard/UniversalMemberPassModal";

interface MemberPassCardProps {
  displayName: string;
  memberId: string;
  userArchetype: string;
  city: string;
  nextEvent?: {
    title: string;
    dateDisplay: string;
    neighborhood: string;
    venueName: string;
    gateCode: string;
  } | null;
  onExploreMeets: () => void;
  onViewInvitations: () => void;
  pendingInvitationsCount: number;
  seatedEvents: SeatedEvent[];
}

export function MemberPassCard({
  displayName,
  memberId,
  userArchetype,
  city,
  nextEvent,
  onExploreMeets,
  onViewInvitations,
  pendingInvitationsCount,
  seatedEvents,
}: MemberPassCardProps) {
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrThumbnail, setQrThumbnail] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 14,
    minutes: 32,
    seconds: 45,
  });

  // Generate unique scannable QR thumbnail for this specific registered member
  useEffect(() => {
    const origin =
      typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : "https://preciousmeets.com";

    const payload = `${origin}/verify-identity?memberId=${encodeURIComponent(
      memberId
    )}&user=${encodeURIComponent(displayName)}&type=universal_key&valid=365`;

    QRCode.toDataURL(payload, {
      width: 160,
      margin: 1,
      errorCorrectionLevel: "H",
      color: {
        dark: "#1c0d12",
        light: "#ffffff",
      },
    })
      .then((url) => setQrThumbnail(url))
      .catch((e) => console.error("Error creating QR thumbnail:", e));
  }, [displayName, memberId]);

  // Simple countdown timer tick
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------- */}
      {/* 1. LUXURY FOUNDING MEMBER PASSCARD (The Showstopper) */}
      {/* ------------------------------------------------------------- */}
      <div className="relative overflow-hidden rounded-3xl border border-ochre/40 bg-gradient-to-br from-[#1c0d12] via-[#2a131a] to-[#12080c] p-6 sm:p-8 text-ivory shadow-2xl ring-1 ring-white/10">
        {/* Subtle decorative shimmer ambient background */}
        <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-ochre/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 size-72 rounded-full bg-burgundy/30 blur-3xl" />

        {/* Card Header & Brand Watermark */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-2xl bg-gradient-to-tr from-ochre/30 to-burgundy border border-ochre/50 text-ochre shadow-inner">
              <Ticket className="size-5" />
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-ochre/90 font-semibold block">
                Official Digital Member Pass
              </span>
              <span className="font-display text-xl tracking-tight text-ivory">
                Precious<em className="text-ochre not-italic font-normal">meets</em>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/20 px-3 py-1 text-[11px] font-medium text-emerald-300 border border-emerald-500/30 backdrop-blur-sm">
              <ShieldCheck className="size-3.5 text-emerald-400" /> Aadhaar Verified
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 font-mono text-[11px] text-white/80 border border-white/10">
              Founding Circle
            </span>
          </div>
        </div>

        {/* Member Details & Pass ID */}
        <div className="relative z-10 mt-6 grid gap-6 sm:grid-cols-12 sm:items-end">
          <div className="sm:col-span-7">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/60">
              Honored Member
            </span>
            <h2 className="font-display mt-1 text-3xl sm:text-4xl text-ivory">
              {displayName}
            </h2>

            <div className="mt-3 flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-white/70">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1 border border-white/10">
                <Sparkles className="size-3.5 text-ochre" /> {userArchetype}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1 border border-white/10">
                <Compass className="size-3.5 text-ochre" /> {city} Member Circle
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-950/40 px-2.5 py-1 text-emerald-300 border border-emerald-800/40">
                Active · 365 Days Pass
              </span>
            </div>
          </div>

          {/* Quick Universal QR Gate Code Launcher */}
          <div className="sm:col-span-5 flex flex-col sm:items-end justify-end">
            <button
              onClick={() => setShowQrModal(true)}
              className="group flex items-center gap-3.5 rounded-2xl bg-white/10 p-3 sm:p-3.5 border border-white/20 hover:bg-white/15 transition-all text-left sm:text-right cursor-pointer shadow-lg hover:border-ochre/50"
            >
              {/* Dynamic QR Thumbnail */}
              <div className="relative size-14 shrink-0 rounded-xl bg-white p-1 shadow-md group-hover:scale-105 transition-transform overflow-hidden grid place-items-center">
                {qrThumbnail ? (
                  <img src={qrThumbnail} alt="Member QR" className="size-full object-contain" />
                ) : (
                  <QrCode className="size-8 text-neutral-800" />
                )}
                <div className="absolute inset-0 grid place-items-center pointer-events-none">
                  <span className="bg-burgundy text-[7px] text-white font-mono px-1 rounded-sm font-bold">
                    PM
                  </span>
                </div>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase text-ochre tracking-wider font-bold block flex items-center gap-1">
                  Universal Gate Pass <span className="text-white/60">✦</span>
                </span>
                <span className="font-mono text-xs font-bold text-ivory tracking-wider block">
                  {memberId}
                </span>
                <span className="text-[10px] text-emerald-300 font-medium block mt-0.5">
                  1 QR for all {seatedEvents.length} seated meet{seatedEvents.length !== 1 ? "s" : ""}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Live Invitation Notification Alert (if admin sent requests) */}
        {pendingInvitationsCount > 0 && (
          <div className="relative z-10 mt-6 flex items-center justify-between rounded-2xl bg-gradient-to-r from-ochre/25 via-burgundy/40 to-ochre/15 p-4 border border-ochre/40 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="relative flex size-3">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-ochre opacity-75" />
                <span className="relative inline-flex size-3 rounded-full bg-ochre" />
              </span>
              <div>
                <p className="text-xs font-semibold text-ivory">
                  You have {pendingInvitationsCount} personal seat invitation from our curators!
                </p>
                <p className="text-[11px] text-white/70">
                  A curated 6-person table is waiting for your confirmation.
                </p>
              </div>
            </div>

            <Button
              size="sm"
              onClick={onViewInvitations}
              className="rounded-full bg-ochre text-ink font-semibold text-xs hover:bg-ochre/90 shrink-0 shadow-md cursor-pointer"
            >
              Review Seat Invite
            </Button>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. NEXT CONFIRMED MEET (Clean, minimal)                       */}
      {/* ------------------------------------------------------------- */}
      {nextEvent && (
        <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-forest animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-wider text-forest font-bold">
                Next Table Gathering
              </span>
            </div>
            <span className="rounded-full bg-burgundy/10 px-2.5 py-0.5 text-[10px] font-semibold text-burgundy">
              Seat Confirmed
            </span>
          </div>

          <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-2xl text-foreground">
                {nextEvent.title}
              </h3>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1 font-medium text-foreground">
                  <Calendar className="size-3.5 text-burgundy" /> {nextEvent.dateDisplay}
                </span>
                <span>•</span>
                <span>{nextEvent.neighborhood}</span>
              </div>
            </div>

            {/* Countdown Ticker Pills */}
            <div className="grid grid-cols-4 gap-2 text-center shrink-0">
              {[
                { label: "Days", val: timeLeft.days },
                { label: "Hours", val: timeLeft.hours },
                { label: "Mins", val: timeLeft.minutes },
                { label: "Secs", val: timeLeft.seconds },
              ].map((item, i) => (
                <div key={i} className="rounded-2xl bg-sage/30 border border-border/60 px-3 py-2">
                  <span className="font-mono text-xl font-bold text-burgundy">
                    {String(item.val).padStart(2, "0")}
                  </span>
                  <span className="block text-[9px] uppercase tracking-wider text-muted-foreground font-mono">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between rounded-2xl bg-sage/20 border border-border/60 p-3 text-xs">
            <div>
              <span className="text-[10px] uppercase text-muted-foreground block font-mono">
                Universal QR Gate Key
              </span>
              <button
                onClick={() => setShowQrModal(true)}
                className="font-mono text-sm font-bold text-burgundy hover:underline flex items-center gap-1 cursor-pointer"
              >
                <QrCode className="size-3.5" /> Tap to Open Pass
              </button>
            </div>
            <span className="text-[11px] text-muted-foreground text-right font-mono">
              Gate: {nextEvent.gateCode}
            </span>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* UNIVERSAL MASTER QR PASS MODAL */}
      {/* ------------------------------------------------------------- */}
      <UniversalMemberPassModal
        open={showQrModal}
        onOpenChange={setShowQrModal}
        displayName={displayName}
        memberId={memberId}
        city={city}
        userArchetype={userArchetype}
        seatedEvents={seatedEvents}
      />
    </div>
  );
}
