import { useState, useEffect } from "react";
import QRCode from "qrcode";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ShieldCheck,
  QrCode,
  Download,
  Calendar,
  CheckCircle2,
  Sparkles,
  Lock,
  Eye,
  Check,
  Utensils,
  Smartphone,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export interface SeatedEvent {
  id: string;
  title: string;
  dateDisplay: string;
  neighborhood: string;
  venueName: string;
  seatNumber?: number;
  gateCode?: string;
}

interface UniversalMemberPassModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  displayName: string;
  memberId: string;
  city: string;
  userArchetype: string;
  seatedEvents: SeatedEvent[];
}

export function UniversalMemberPassModal({
  open,
  onOpenChange,
  displayName,
  memberId,
  city,
  userArchetype,
  seatedEvents,
}: UniversalMemberPassModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [showHostView, setShowHostView] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Generate unique scannable payload bound to this user
  useEffect(() => {
    const origin =
      typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : "https://preciousmeets.com";

    // Encoded universal pass verification payload
    const verificationUrl = `${origin}/verify-identity?memberId=${encodeURIComponent(
      memberId
    )}&user=${encodeURIComponent(displayName)}&type=universal_key&valid=365`;

    QRCode.toDataURL(verificationUrl, {
      width: 480,
      margin: 2,
      errorCorrectionLevel: "H",
      color: {
        dark: "#1c0d12", // Deep velvet burgundy/carbon ink
        light: "#ffffff",
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("Error generating QR code:", err));
  }, [displayName, memberId]);

  const handleDownloadPass = () => {
    if (!qrDataUrl) return;
    setDownloading(true);
    try {
      const link = document.createElement("a");
      link.href = qrDataUrl;
      link.download = `PreciousMeets-Universal-Pass-${memberId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Universal Member Gate Pass downloaded to your device!");
    } catch (e) {
      toast.error("Failed to download QR pass");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-card text-card-foreground rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto border border-ochre/30 shadow-2xl">
        <DialogHeader className="text-center">
          <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-burgundy/15 text-burgundy border border-burgundy/30 mb-2">
            <QrCode className="size-6" />
          </div>
          <DialogTitle className="font-display text-2xl sm:text-3xl text-foreground">
            Universal Member Gate Key
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground max-w-sm mx-auto">
            Your permanent, personal digital access pass. <strong className="text-foreground">One master QR code</strong> unlocks entry into <strong className="text-burgundy">all your seated meets</strong>.
          </DialogDescription>
        </DialogHeader>

        {/* View Toggle: Member View vs Host Verification View */}
        <div className="flex justify-center my-3">
          <div className="flex items-center gap-1 bg-sage/30 p-1 rounded-full border border-border/80 text-xs">
            <button
              onClick={() => setShowHostView(false)}
              className={`rounded-full px-4 py-1 font-semibold transition-all cursor-pointer ${
                !showHostView
                  ? "bg-burgundy text-ivory shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Member QR Pass
            </button>
            <button
              onClick={() => setShowHostView(true)}
              className={`rounded-full px-4 py-1 font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                showHostView
                  ? "bg-forest text-ivory shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Eye className="size-3.5" /> Door Host Scanner View
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* VIEW 1: MEMBER PASS & REAL SCANNABLE QR CODE */}
        {/* ------------------------------------------------------------- */}
        {!showHostView ? (
          <div className="space-y-6">
            {/* Scannable Pass Box */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-ivory to-neutral-50 p-6 text-center border-2 border-border shadow-inner text-ink">
              {/* Security Header */}
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3 mb-4 text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                <span className="flex items-center gap-1 text-forest font-semibold">
                  <ShieldCheck className="size-3.5 text-forest" /> Aadhaar Verified
                </span>
                <span>Universal Entry Token</span>
              </div>

              {/* Real Rendered High-Resolution QR Code */}
              <div className="relative mx-auto size-56 sm:size-64 rounded-2xl bg-white p-3 shadow-md border border-neutral-200 grid place-items-center">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Universal Member Entry QR"
                    className="size-full object-contain"
                  />
                ) : (
                  <div className="grid place-items-center text-muted-foreground text-xs animate-pulse">
                    Generating secure QR key...
                  </div>
                )}

                {/* Center Brand Watermark Badge */}
                <div className="absolute inset-0 grid place-items-center pointer-events-none">
                  <span className="bg-burgundy text-ivory text-[9px] font-mono px-2 py-0.5 rounded-full font-bold shadow-lg border border-ochre/40">
                    PM-PASS
                  </span>
                </div>
              </div>

              {/* Pass Identifier */}
              <div className="mt-4">
                <span className="font-mono text-xl font-bold tracking-widest text-burgundy block">
                  {memberId}
                </span>
                <span className="font-display text-base text-neutral-800 font-semibold block mt-0.5">
                  {displayName}
                </span>
                <span className="text-xs text-neutral-500">
                  {city} Circle · {userArchetype}
                </span>
              </div>

              {/* Dynamic Live Counter */}
              <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-forest/15 px-3 py-1 text-[11px] font-medium text-forest border border-forest/30">
                <CheckCircle2 className="size-3.5" />
                Active for {seatedEvents.length} Seated Meet{seatedEvents.length !== 1 ? "s" : ""}
              </div>
            </div>

            {/* List of Seated Events Covered by this Single QR Code */}
            <div className="rounded-2xl border border-border/80 bg-card p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Events Unlocked by This Single QR
                </span>
                <span className="font-mono text-[10px] text-forest font-bold">
                  {seatedEvents.length} Pre-Approved
                </span>
              </div>

              {seatedEvents.length === 0 ? (
                <p className="text-xs text-muted-foreground py-2 text-center">
                  No confirmed meets yet. Reserve any meet in the Meets tab, and your universal pass will automatically unlock it!
                </p>
              ) : (
                <div className="space-y-2">
                  {seatedEvents.map((evt, idx) => (
                    <div
                      key={evt.id || idx}
                      className="flex items-start justify-between gap-3 rounded-xl bg-sage/20 p-2.5 text-xs border border-border/40"
                    >
                      <div className="space-y-0.5">
                        <span className="font-semibold text-foreground block">
                          {evt.title}
                        </span>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                          <Calendar className="size-3 text-burgundy" />
                          <span>{evt.dateDisplay}</span>
                          <span>•</span>
                          <span>{evt.neighborhood}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="inline-flex items-center gap-1 rounded-full bg-forest/20 px-2 py-0.5 text-[10px] font-semibold text-forest">
                          <Check className="size-3" /> Valid Entry
                        </span>
                        {evt.gateCode && (
                          <span className="block font-mono text-[10px] text-muted-foreground mt-0.5">
                            PIN: {evt.gateCode}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={handleDownloadPass}
                disabled={downloading}
                variant="outline"
                className="flex-1 rounded-full border-border/80 text-xs py-2.5 gap-2 cursor-pointer"
              >
                <Download className="size-3.5" />
                {downloading ? "Saving..." : "Save QR to Photos / Wallet"}
              </Button>

              <Button
                onClick={() => onOpenChange(false)}
                className="flex-1 rounded-full bg-burgundy text-ivory text-xs py-2.5 hover:bg-burgundy/90 shadow-sm font-semibold cursor-pointer"
              >
                Done
              </Button>
            </div>
          </div>
        ) : (
          /* ------------------------------------------------------------- */
          /* VIEW 2: DOOR HOST SCANNER SIMULATION (Shows what scanning sees) */
          /* ------------------------------------------------------------- */
          <div className="space-y-5 animate-in fade-in duration-300">
            <div className="rounded-3xl border border-emerald-500/40 bg-gradient-to-b from-emerald-950/30 to-emerald-950/10 p-6 text-center shadow-lg">
              <div className="size-16 rounded-full bg-emerald-500/20 text-emerald-400 grid place-items-center mx-auto border border-emerald-500/40 mb-3 animate-pulse">
                <CheckCircle2 className="size-9" />
              </div>

              <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-bold block">
                Access Granted · Verified Member
              </span>
              <h3 className="font-display text-2xl text-foreground mt-1">
                {displayName}
              </h3>
              <p className="font-mono text-xs text-muted-foreground mt-0.5">
                Pass ID: {memberId}
              </p>

              <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
                <span className="rounded-full bg-forest/20 px-3 py-1 text-forest font-medium border border-forest/30">
                  ✓ Aadhaar 100% Offline Verified
                </span>
                <span className="rounded-full bg-ochre/20 px-3 py-1 text-ochre font-medium border border-ochre/30">
                  Annual Founding Member
                </span>
              </div>
            </div>

            {/* Host Seating Manifest Verification */}
            <div className="rounded-2xl border border-border/80 bg-card p-4 space-y-3">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block">
                Table Seating Authorization (Tonight's Meet)
              </span>

              {seatedEvents.length > 0 ? (
                <div className="rounded-xl bg-sage/30 p-3 text-xs space-y-2 border border-forest/30">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-foreground text-sm">
                      {seatedEvents[0].title}
                    </span>
                    <span className="rounded-full bg-forest text-ivory text-[10px] font-mono px-2 py-0.5 font-bold">
                      SEAT CONFIRMED
                    </span>
                  </div>
                  <p className="text-muted-foreground text-[11px]">
                    Venue: {seatedEvents[0].venueName} ({seatedEvents[0].neighborhood})
                  </p>
                  <div className="flex justify-between items-center pt-1 border-t border-border/60 text-[11px]">
                    <span className="text-muted-foreground">Door PIN Auth:</span>
                    <strong className="font-mono text-burgundy">{seatedEvents[0].gateCode || "GATE-402"}</strong>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  No active reservation registered for tonight.
                </p>
              )}

              {/* Host Safety & Dietary Alert */}
              <div className="rounded-xl bg-amber-500/10 p-3 border border-amber-500/20 text-[11px] text-amber-300/90 space-y-1">
                <span className="font-bold text-amber-200 block">
                  Host Dietary & Safety Protocol:
                </span>
                <p>
                  • Dietary: Vegetarian (Gluten Sensitivity)
                  <br />
                  • Escort protocol active for safe departure coordination.
                </p>
              </div>
            </div>

            <Button
              onClick={() => setShowHostView(false)}
              className="w-full rounded-full bg-card border border-border/80 text-foreground text-xs py-2.5 hover:bg-sage/40"
            >
              ← Back to Member Pass
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
