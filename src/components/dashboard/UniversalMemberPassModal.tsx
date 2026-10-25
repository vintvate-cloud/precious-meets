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
  CheckCircle2,
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
      <DialogContent className="max-w-[420px] bg-card text-card-foreground rounded-3xl p-5 sm:p-6 border border-ochre/30 shadow-2xl overflow-hidden">
        {/* Compact Header */}
        <DialogHeader className="text-center space-y-1">
          <div className="mx-auto grid size-10 place-items-center rounded-2xl bg-burgundy/15 text-burgundy border border-burgundy/30 mb-1">
            <QrCode className="size-5" />
          </div>
          <DialogTitle className="font-display text-xl sm:text-2xl text-foreground">
            Universal Member Gate Key
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground max-w-xs mx-auto">
            Your permanent digital pass unlocking entry into all your seated meets.
          </DialogDescription>
        </DialogHeader>

        {/* Scannable Pass Box */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-ivory to-neutral-50 p-4 text-center border border-border shadow-inner text-ink my-1">
          {/* Security Header */}
          <div className="flex items-center justify-between border-b border-neutral-200 pb-2 mb-3 text-[10px] font-mono uppercase tracking-wider text-neutral-500">
            <span className="flex items-center gap-1 text-forest font-semibold">
              <ShieldCheck className="size-3 text-forest" /> Aadhaar Verified
            </span>
            <span>Universal Entry Token</span>
          </div>

          {/* Rendered High-Resolution QR Code */}
          <div className="relative mx-auto size-44 sm:size-48 rounded-2xl bg-white p-2.5 shadow-md border border-neutral-200 grid place-items-center">
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
              <span className="bg-burgundy text-ivory text-[8px] font-mono px-2 py-0.5 rounded-full font-bold shadow-lg border border-ochre/40">
                PM-PASS
              </span>
            </div>
          </div>

          {/* Pass Identifier */}
          <div className="mt-3">
            <span className="font-mono text-base sm:text-lg font-bold tracking-widest text-burgundy block">
              {memberId}
            </span>
            <span className="font-display text-sm text-neutral-800 font-semibold block mt-0.5">
              {displayName}
            </span>
            <span className="text-[11px] text-neutral-500 block">
              {city} Circle · {userArchetype}
            </span>
          </div>

          {/* Dynamic Live Counter */}
          <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-forest/15 px-3 py-0.5 text-[10px] font-medium text-forest border border-forest/30">
            <CheckCircle2 className="size-3" />
            Active for {seatedEvents.length} Seated Meet{seatedEvents.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 pt-1">
          <Button
            onClick={handleDownloadPass}
            disabled={downloading}
            variant="outline"
            className="flex-1 rounded-full border-border/80 text-xs py-2 gap-1.5 cursor-pointer h-9"
          >
            <Download className="size-3.5" />
            {downloading ? "Saving..." : "Save to Wallet"}
          </Button>

          <Button
            onClick={() => onOpenChange(false)}
            className="flex-1 rounded-full bg-burgundy text-ivory text-xs py-2 hover:bg-burgundy/90 shadow-sm font-semibold cursor-pointer h-9"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
