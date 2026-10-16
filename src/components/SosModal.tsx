import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { SosService } from "@/lib/sos-service";
import { ShieldAlert, PhoneCall, MapPin, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface SosModalProps {
  bookingId?: string;
  bookingReference?: string;
  triggerButton?: React.ReactNode;
}

export function SosModal({ bookingId, bookingReference, triggerButton }: SosModalProps) {
  const { user, profile } = useAuth();
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<"emergency" | "discomfort" | "harassment" | "medical" | "venue_safety">("emergency");
  const [notes, setNotes] = useState("");
  const [shareLocation, setShareLocation] = useState(true);
  const [loading, setLoading] = useState(false);
  const [incidentResult, setIncidentResult] = useState<{
    incidentReference: string;
    message: string;
  } | null>(null);

  const handleTrigger = async () => {
    if (!user) {
      toast.error("Please sign in to log a verified safety beacon.");
      return;
    }

    setLoading(true);

    let coords: { lat?: number; lng?: number } = {};

    if (shareLocation && navigator.geolocation) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 7000,
            enableHighAccuracy: true,
          });
        });
        coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
      } catch (err) {
        console.warn("[SOS] Geolocation permission denied or timed out.");
      }
    }

    try {
      const res = await SosService.triggerSosIncident({
        userId: user.id,
        userEmail: user.email || "attendee@preciousmeets.com",
        userName: profile?.full_name || profile?.display_name || "Guest Attendee",
        bookingId,
        bookingReference,
        category,
        userNotes: notes,
        latitude: coords.lat,
        longitude: coords.lng,
        locationShared: Boolean(coords.lat),
      });

      setIncidentResult({
        incidentReference: res.incidentReference,
        message: res.message,
      });
      toast.success("SOS Alert Registered. Safety team has been dispatched.");
    } catch (err: any) {
      toast.error("Failed to transmit SOS alert. Please dial 112 directly.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setIncidentResult(null);
    setNotes("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button
            variant="destructive"
            className="flex items-center gap-2 rounded-full bg-red-700 px-5 text-sm font-semibold text-white hover:bg-red-800"
          >
            <ShieldAlert className="size-4 animate-pulse" />
            Safety SOS
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md bg-card text-foreground">
        <DialogHeader>
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="size-5" />
            <DialogTitle className="font-display text-2xl text-destructive">
              Emergency Safety Assistance
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Your safety and dignity are paramount at every Precious Meet. In immediate danger, call 112.
          </DialogDescription>
        </DialogHeader>

        {incidentResult ? (
          <div className="space-y-4 py-3 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-green-100 text-green-700">
              <CheckCircle className="size-6" />
            </div>
            <h3 className="font-display text-xl font-bold">Beacon Transmitted</h3>
            <p className="text-xs text-muted-foreground">
              Incident Reference: <strong className="font-mono text-foreground">{incidentResult.incidentReference}</strong>
            </p>
            <p className="rounded-lg bg-sage/50 p-3 text-xs leading-relaxed text-forest">
              {incidentResult.message}
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <a
                href="tel:112"
                className="flex items-center justify-center gap-2 rounded-md bg-destructive p-2.5 text-xs font-bold text-destructive-foreground hover:bg-destructive/90"
              >
                <PhoneCall className="size-3.5" /> Call Police (112)
              </a>
              <a
                href="tel:1091"
                className="flex items-center justify-center gap-2 rounded-md bg-forest p-2.5 text-xs font-bold text-white hover:bg-forest/90"
              >
                <PhoneCall className="size-3.5" /> Women Helpline (1091)
              </a>
            </div>
            <Button variant="outline" className="w-full text-xs" onClick={handleReset}>
              Close & Dismiss
            </Button>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold text-foreground/80">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="mt-1.5 w-full rounded-md border border-input bg-background p-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="emergency">Immediate Safety Threat / Danger</option>
                <option value="harassment">Boundary Violation / Harassment</option>
                <option value="discomfort">General Unsettledness / Discomfort</option>
                <option value="medical">Medical Emergency or Allergy</option>
                <option value="venue_safety">Venue Insecurity or Host Unavailability</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground/80">Details (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe what is occurring, discreetly if necessary..."
                className="mt-1.5 w-full rounded-md border border-input bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                rows={3}
              />
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-border bg-sage/30 p-2.5">
              <input
                type="checkbox"
                id="share_location"
                checked={shareLocation}
                onChange={(e) => setShareLocation(e.target.checked)}
                className="size-4 accent-burgundy"
              />
              <label htmlFor="share_location" className="flex items-center gap-1.5 text-xs text-foreground">
                <MapPin className="size-3.5 text-forest" /> Share current device GPS coordinates with safety team
              </label>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <a
                href="tel:112"
                className="flex items-center justify-center gap-2 rounded-md border border-destructive bg-card p-2 text-xs font-bold text-destructive hover:bg-destructive/10"
              >
                <PhoneCall className="size-3.5" /> Direct Call 112
              </a>
              <Button
                variant="destructive"
                onClick={handleTrigger}
                disabled={loading}
                className="flex items-center justify-center gap-2 text-xs font-bold"
              >
                {loading ? <Loader2 className="size-3.5 animate-spin" /> : <ShieldAlert className="size-3.5" />}
                Transmit SOS Beacon
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
