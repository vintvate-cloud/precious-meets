import { useState, useRef, useEffect, useCallback } from "react";
import jsQR from "jsqr";
import {
  AdminEvent,
  AdminAttendee,
  EventsService,
} from "@/lib/events-service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ScanLine,
  Camera,
  Upload,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Utensils,
  Volume2,
  VolumeX,
  FlipHorizontal,
  ChevronRight,
  ArrowRight,
  UserX,
  Search,
} from "lucide-react";
import { toast } from "sonner";

interface EventQrScannerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: AdminEvent;
  attendees: AdminAttendee[];
  onEventUpdated: (updated: AdminEvent) => void;
}

// Web Audio API Synthesizers for zero-dependency sound feedback
function playSuccessChime() {
  try {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(587.33, now); // D5
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.28);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(880, now + 0.12); // A5
    gain2.gain.setValueAtTime(0.25, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.48);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.48);
  } catch (e) {
    console.debug("[Audio] Could not play success tone:", e);
  }
}

function playErrorBuzzer() {
  try {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    [0, 0.16].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(140, now + offset);
      gain.gain.setValueAtTime(0.22, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.14);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.14);
    });
  } catch (e) {
    console.debug("[Audio] Could not play buzzer tone:", e);
  }
}

export function EventQrScannerModal({
  open,
  onOpenChange,
  event,
  attendees,
  onEventUpdated,
}: EventQrScannerModalProps) {
  const [activeTab, setActiveTab] = useState<"camera" | "upload" | "simulate">("camera");
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Scan Result State
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    reason: "admitted" | "already_checked_in" | "not_in_table" | "unrecognized";
    message: string;
    attendee?: AdminAttendee;
    seatNumber?: number;
    alreadyCheckedIn?: boolean;
    checkedInAt?: string;
    assignedOtherEvent?: AdminEvent;
    rawPayload?: string;
  } | null>(null);

  // Manual input field
  const [manualInput, setManualInput] = useState("");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Calculate table metrics
  const seatedAttendees = event.seats
    .map((id) => (id ? attendees.find((a) => a.id === id) : null))
    .filter((a): a is AdminAttendee => Boolean(a));
  const checkIns = event.checkIns || {};
  const admittedCount = Object.keys(checkIns).length;

  // Process a decoded QR string through table verification
  const processQrCode = useCallback(
    (codeText: string) => {
      if (!codeText) return;

      const result = EventsService.verifyScanPayload(event.id, codeText);
      const enrichedResult = { ...result, rawPayload: codeText };
      setScanResult(enrichedResult);

      if (result.success) {
        if (soundEnabled) playSuccessChime();
        if (typeof navigator !== "undefined" && navigator.vibrate) {
          navigator.vibrate([40, 60, 40]);
        }
        toast.success(result.message);
        const updated = EventsService.getEventById(event.id);
        if (updated) onEventUpdated(updated);
      } else {
        if (soundEnabled) playErrorBuzzer();
        if (typeof navigator !== "undefined" && navigator.vibrate) {
          navigator.vibrate([200, 100, 200]);
        }
        toast.error(result.message);
      }
    },
    [event.id, soundEnabled, onEventUpdated]
  );

  // Start Camera Stream
  const startCamera = useCallback(async () => {
    setCameraError(null);
    setCameraActive(false);

    // Stop existing stream if any
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API is not supported on this browser.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        await videoRef.current.play();
        setCameraActive(true);
        setIsScanning(true);
      }
    } catch (err: unknown) {
      console.warn("[Scanner] Camera activation failed:", err);
      const errMsg = err instanceof Error ? err.message : String(err);
      if (errMsg.includes("Permission denied") || errMsg.includes("NotAllowedError")) {
        setCameraError("Camera permission denied. Please grant camera permission or use the Image Upload / Simulation tab.");
      } else {
        setCameraError("Could not access camera. Please use Image Upload or Manual Code verification.");
      }
      setCameraActive(false);
      setIsScanning(false);
    }
  }, [facingMode]);

  // Stop Camera Stream
  const stopCamera = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setIsScanning(false);
  }, []);

  // Frame Scanning Loop using jsQR
  useEffect(() => {
    if (!open || activeTab !== "camera" || !cameraActive || !isScanning) {
      return;
    }

    let lastScanTime = 0;
    const scanInterval = 180; // ms

    const scanFrame = (timestamp: number) => {
      if (!videoRef.current || !canvasRef.current || !isScanning) {
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        if (timestamp - lastScanTime > scanInterval) {
          lastScanTime = timestamp;

          const ctx = canvas.getContext("2d", { willReadFrequently: true });
          if (ctx) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const qrCode = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: "dontInvert",
            });

            if (qrCode && qrCode.data) {
              // Pause scanning immediately on detection to prevent duplicate triggering
              setIsScanning(false);
              processQrCode(qrCode.data);
              return;
            }
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(scanFrame);
    };

    animationFrameRef.current = requestAnimationFrame(scanFrame);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [open, activeTab, cameraActive, isScanning, processQrCode]);

  // Manage Camera on Modal Open/Close or Tab Switch
  useEffect(() => {
    if (open && activeTab === "camera") {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [open, activeTab, startCamera, stopCamera]);

  // Handle Image Upload Scan
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const qrCode = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "attemptBoth",
        });

        if (qrCode && qrCode.data) {
          processQrCode(qrCode.data);
        } else {
          if (soundEnabled) playErrorBuzzer();
          toast.error("No valid QR code could be detected in this image. Please try a clearer screenshot.");
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Handle Manual Admit / Undo from Table Roster
  const handleManualCheckIn = (attendee: AdminAttendee, seatNumber: number) => {
    try {
      EventsService.checkInAttendee(event.id, attendee.id, seatNumber);
      if (soundEnabled) playSuccessChime();
      toast.success(`${attendee.name} admitted manually for Seat #${seatNumber}.`);
      const updated = EventsService.getEventById(event.id);
      if (updated) onEventUpdated(updated);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to admit attendee";
      toast.error(msg);
    }
  };

  const handleUndoCheckIn = (attendeeId: string, name: string) => {
    try {
      EventsService.undoCheckIn(event.id, attendeeId);
      toast.info(`Admission for ${name} has been reset.`);
      const updated = EventsService.getEventById(event.id);
      if (updated) onEventUpdated(updated);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to reset admission";
      toast.error(msg);
    }
  };

  const resetForNextScan = () => {
    setScanResult(null);
    setIsScanning(true);
  };

  // Find all unseated attendees or attendees from other events for testing
  const allEvents = EventsService.getEvents();
  const unseatedMembers = attendees.filter(
    (a) => !event.seats.includes(a.id)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto p-0 rounded-3xl border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="bg-foreground text-background p-6 rounded-t-3xl relative overflow-hidden">
          <div className="absolute -right-8 -top-8 size-36 rounded-full bg-burgundy/30 blur-2xl pointer-events-none" />
          
          <div className="relative z-10 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="label-mono text-[10px] uppercase font-bold text-forest bg-forest/20 px-2 py-0.5 rounded-full">
                  Gate Operations
                </span>
                <span className="text-[11px] font-mono text-muted-foreground">
                  Ref: <strong className="text-background">{event.secretAccessCode}</strong>
                </span>
              </div>
              <DialogTitle className="font-display text-2xl sm:text-3xl text-background mt-2">
                Table Entry QR Scanner
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                {event.title} · {event.neighborhood}, {event.city}
              </DialogDescription>
            </div>

            {/* Live Admission Tally */}
            <div className="rounded-2xl border border-white/10 bg-white/5 px-3.5 py-2 text-right shrink-0">
              <span className="text-[9px] uppercase tracking-wider font-mono text-muted-foreground block">
                Table Occupancy
              </span>
              <span className="font-mono text-base font-bold text-background">
                {admittedCount} / {seatedAttendees.length}
                <span className="text-xs text-forest ml-1 font-normal">Admitted</span>
              </span>
            </div>
          </div>

          {/* Scanner Mode Selector & Audio Toggle */}
          <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
            <div className="flex items-center gap-1.5 bg-white/10 p-1 rounded-full text-xs">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("camera");
                  setScanResult(null);
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-medium transition-all ${
                  activeTab === "camera"
                    ? "bg-burgundy text-white shadow-xs"
                    : "text-white/70 hover:text-white"
                }`}
              >
                <Camera className="size-3.5" />
                <span>Camera</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("upload");
                  setScanResult(null);
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-medium transition-all ${
                  activeTab === "upload"
                    ? "bg-burgundy text-white shadow-xs"
                    : "text-white/70 hover:text-white"
                }`}
              >
                <Upload className="size-3.5" />
                <span>Upload Pass</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("simulate");
                  setScanResult(null);
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-medium transition-all ${
                  activeTab === "simulate"
                    ? "bg-burgundy text-white shadow-xs"
                    : "text-white/70 hover:text-white"
                }`}
              >
                <Sparkles className="size-3.5" />
                <span>Simulate & Test</span>
              </button>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSoundEnabled((prev) => !prev)}
                title={soundEnabled ? "Mute audio feedback" : "Enable audio feedback"}
                className="flex size-7 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all text-xs"
              >
                {soundEnabled ? <Volume2 className="size-3.5" /> : <VolumeX className="size-3.5 text-muted-foreground" />}
              </button>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* ================= SCAN RESULT PRESENTATION ================= */}
          {scanResult && (
            <div
              className={`rounded-3xl border-2 p-5 sm:p-6 transition-all duration-300 animate-in fade-in zoom-in-95 ${
                scanResult.success
                  ? "border-forest/50 bg-forest/5 text-forest-foreground"
                  : "border-destructive/50 bg-destructive/5 text-destructive"
              }`}
            >
              {scanResult.success ? (
                // SUCCESS: ENTRY GRANTED ACCORDING TO TABLE SEAT
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex size-11 items-center justify-center rounded-2xl bg-forest text-ivory shadow-md">
                        <CheckCircle2 className="size-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-forest block">
                          {scanResult.alreadyCheckedIn ? "Re-verified Pass" : "Verified Entry Granted"}
                        </span>
                        <h3 className="font-display text-xl sm:text-2xl text-foreground font-semibold">
                          Seat #{scanResult.seatNumber}: {scanResult.attendee?.name}
                        </h3>
                      </div>
                    </div>

                    <span className="rounded-full bg-forest text-ivory px-3 py-1 text-xs font-mono font-bold shrink-0">
                      Seat #{scanResult.seatNumber}
                    </span>
                  </div>

                  {/* Attendee Profile Dossier */}
                  {scanResult.attendee && (
                    <div className="flex items-center gap-4 rounded-2xl bg-card border border-border/80 p-3.5 shadow-xs">
                      <img
                        src={scanResult.attendee.avatar}
                        alt={scanResult.attendee.name}
                        className="size-14 rounded-full object-cover border-2 border-forest ring-2 ring-forest/20 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-foreground">
                            {scanResult.attendee.name}
                          </span>
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {scanResult.attendee.memberId}
                          </span>
                          <span className="flex items-center gap-1 text-[9px] font-bold text-forest bg-forest/10 px-2 py-0.2 rounded-full">
                            <ShieldCheck className="size-3" /> DigiLocker Verified
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                          {scanResult.attendee.archetype.title} · {scanResult.attendee.memberTier}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px]">
                          <span className="flex items-center gap-1 text-foreground font-medium">
                            <Utensils className="size-3 text-muted-foreground" />
                            {scanResult.attendee.dietary}
                          </span>
                          {scanResult.attendee.allergies.length > 0 && (
                            <span className="rounded-full bg-destructive/15 text-destructive font-semibold px-2 py-0.2 text-[10px]">
                              Allergies: {scanResult.attendee.allergies.join(", ")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-forest font-medium">
                      ✓ Admitted at{" "}
                      {new Date(scanResult.checkedInAt || Date.now()).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>

                    <button
                      type="button"
                      onClick={resetForNextScan}
                      className="flex items-center gap-1.5 rounded-full bg-forest text-ivory px-4 py-1.5 text-xs font-semibold hover:bg-forest/90 transition-all cursor-pointer"
                    >
                      <ScanLine className="size-3.5" />
                      <span>Scan Next Guest</span>
                    </button>
                  </div>
                </div>
              ) : (
                // FAILURE: NOT IN TABLE / REJECTED
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-destructive text-white shadow-md shrink-0">
                      <XCircle className="size-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-destructive block">
                        Strict Table Protocol Enforced
                      </span>
                      <h3 className="font-display text-xl sm:text-2xl text-destructive font-semibold">
                        Entry Denied — Not Seated at This Table
                      </h3>
                      <p className="text-xs text-destructive/90 mt-1 leading-relaxed">
                        {scanResult.message}
                      </p>
                    </div>
                  </div>

                  {scanResult.attendee && (
                    <div className="rounded-2xl border border-destructive/20 bg-background/80 p-3.5 space-y-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={scanResult.attendee.avatar}
                          alt={scanResult.attendee.name}
                          className="size-10 rounded-full object-cover border border-destructive/30 grayscale"
                        />
                        <div>
                          <p className="text-xs font-bold text-foreground">
                            {scanResult.attendee.name} ({scanResult.attendee.memberId})
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            Registered Member of Precious Meets
                          </p>
                        </div>
                      </div>

                      {scanResult.assignedOtherEvent ? (
                        <div className="rounded-xl bg-ochre/15 border border-ochre/30 p-2.5 text-xs text-ochre-foreground flex items-center gap-2">
                          <AlertTriangle className="size-4 text-ochre shrink-0" />
                          <span>
                            <strong>Notice:</strong> This guest is seated for a different meet:{" "}
                            <strong>{scanResult.assignedOtherEvent.title}</strong> ({scanResult.assignedOtherEvent.dateDisplay}).
                          </span>
                        </div>
                      ) : (
                        <p className="text-[11px] text-muted-foreground italic">
                          This member has not been assigned a chair at this 6-person table.
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-destructive font-medium">
                      ✕ Entry cannot be granted for this meet.
                    </span>

                    <button
                      type="button"
                      onClick={resetForNextScan}
                      className="flex items-center gap-1.5 rounded-full bg-destructive text-white px-4 py-1.5 text-xs font-semibold hover:bg-destructive/90 transition-all cursor-pointer"
                    >
                      <RefreshCw className="size-3.5" />
                      <span>Try Another Pass</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 1: LIVE CAMERA VIEW ================= */}
          {activeTab === "camera" && (
            <div className="space-y-4">
              <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-neutral-950 border border-border shadow-inner flex items-center justify-center">
                {/* Real Video Element */}
                <video
                  ref={videoRef}
                  className="size-full object-cover"
                  autoPlay
                  playsInline
                  muted
                />
                <canvas ref={canvasRef} className="hidden" />

                {/* Viewfinder Target Overlays */}
                {cameraActive && isScanning && (
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    {/* Darkened vignette around scanning square */}
                    <div className="relative size-56 sm:size-64 border-2 border-burgundy/80 rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]">
                      {/* Laser scanning line */}
                      <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-burgundy to-transparent shadow-[0_0_8px_#691c35] animate-bounce" />

                      {/* Corner Accents */}
                      <div className="absolute -top-1 -left-1 size-4 border-t-2 border-l-2 border-ivory rounded-tl" />
                      <div className="absolute -top-1 -right-1 size-4 border-t-2 border-r-2 border-ivory rounded-tr" />
                      <div className="absolute -bottom-1 -left-1 size-4 border-b-2 border-l-2 border-ivory rounded-bl" />
                      <div className="absolute -bottom-1 -right-1 size-4 border-b-2 border-r-2 border-ivory rounded-br" />
                    </div>

                    <p className="mt-4 text-[11px] font-mono text-ivory/80 bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm">
                      Align guest's Universal Member Pass QR inside the frame
                    </p>
                  </div>
                )}

                {/* Camera Inactive / Error Overlay */}
                {(!cameraActive || cameraError) && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-card/95 text-foreground">
                    <Camera className="size-12 text-muted-foreground/40 mb-3" />
                    <h4 className="font-display text-lg font-medium">Camera Inactive</h4>
                    <p className="text-xs text-muted-foreground max-w-sm mt-1">
                      {cameraError || "Click below to activate live gate camera or switch to the Image Upload / Simulation tab."}
                    </p>
                    <button
                      type="button"
                      onClick={startCamera}
                      className="mt-4 flex items-center gap-2 rounded-full bg-burgundy px-5 py-2 text-xs font-semibold text-ivory shadow-sm hover:bg-burgundy/90 transition-all cursor-pointer"
                    >
                      <Camera className="size-4" />
                      <span>{cameraError ? "Retry Camera" : "Launch Camera"}</span>
                    </button>
                  </div>
                )}

                {/* Flip camera control */}
                {cameraActive && (
                  <button
                    type="button"
                    onClick={() => {
                      setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
                    }}
                    title="Flip camera"
                    className="absolute bottom-3 right-3 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 backdrop-blur-xs transition-all cursor-pointer"
                  >
                    <FlipHorizontal className="size-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ================= TAB 2: IMAGE UPLOAD ================= */}
          {activeTab === "upload" && (
            <div className="space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="group flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border p-10 text-center hover:border-burgundy hover:bg-burgundy/[0.02] transition-all cursor-pointer"
              >
                <div className="flex size-14 items-center justify-center rounded-2xl bg-sage/40 text-muted-foreground group-hover:bg-burgundy group-hover:text-ivory group-hover:scale-110 transition-all duration-300">
                  <Upload className="size-6" />
                </div>
                <h4 className="font-display text-lg font-medium mt-3 text-foreground group-hover:text-burgundy transition-colors">
                  Upload Guest Pass Screenshot or QR Image
                </h4>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                  Select a photo of the member's QR pass from your device or gallery. It will be decoded and verified instantly against this table roster.
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-burgundy/10 px-4 py-1.5 text-xs font-semibold text-burgundy group-hover:bg-burgundy group-hover:text-ivory transition-all">
                  Browse Image File
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>
          )}

          {/* ================= TAB 3: SIMULATE & TEST ================= */}
          {activeTab === "simulate" && (
            <div className="space-y-4">
              <div className="rounded-2xl bg-sage/20 border border-forest/20 p-4">
                <div className="flex items-center gap-2 text-forest">
                  <Sparkles className="size-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Instant Gate Simulator
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Test the scanner verification logic directly with one click to see how confirmed table guests are granted entry and unseated guests are strictly rejected.
                </p>
              </div>

              {/* Seated Guests Test Buttons */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase font-mono text-muted-foreground block">
                  1. Test Seated Guests (Expected Result: ✓ Entry Granted)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {seatedAttendees.length === 0 ? (
                    <div className="text-xs text-muted-foreground p-3 border rounded-xl">
                      No guests assigned to table yet. Assign guests in the Interactive Table room first.
                    </div>
                  ) : (
                    seatedAttendees.map((att, idx) => {
                      const isAdmitted = Boolean(checkIns[att.id]);
                      return (
                        <button
                          key={att.id}
                          type="button"
                          onClick={() => {
                            const url = `https://preciousmeets.com/verify-identity?memberId=${encodeURIComponent(
                              att.memberId
                            )}&user=${encodeURIComponent(att.name)}&type=universal_key&valid=365`;
                            processQrCode(url);
                          }}
                          className={`flex items-center justify-between rounded-xl border p-2.5 text-left transition-all hover:scale-[1.01] active:scale-95 cursor-pointer ${
                            isAdmitted
                              ? "border-forest/40 bg-forest/5"
                              : "border-border/80 bg-card hover:border-burgundy/40 hover:bg-sage/10"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={att.avatar}
                              alt={att.name}
                              className="size-8 rounded-full object-cover shrink-0"
                            />
                            <div className="truncate">
                              <span className="text-xs font-bold text-foreground block truncate">
                                {att.name}
                              </span>
                              <span className="text-[10px] font-mono text-muted-foreground">
                                Seat #{idx + 1} · {att.memberId}
                              </span>
                            </div>
                          </div>

                          <span
                            className={`rounded-full px-2 py-0.5 text-[9px] font-mono font-bold shrink-0 ${
                              isAdmitted
                                ? "bg-forest/15 text-forest"
                                : "bg-burgundy/15 text-burgundy"
                            }`}
                          >
                            {isAdmitted ? "Admitted" : "Test Scan"}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Unseated Members Test Buttons */}
              <div className="space-y-2 pt-2 border-t border-border/60">
                <span className="text-[11px] font-bold uppercase font-mono text-destructive block">
                  2. Test Unseated Guests (Expected Result: ⛔ Entry Denied)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {unseatedMembers.slice(0, 4).map((att) => {
                    // Check if they are seated in another event
                    const otherEvt = allEvents.find(
                      (e) => e.id !== event.id && e.seats.includes(att.id)
                    );
                    return (
                      <button
                        key={att.id}
                        type="button"
                        onClick={() => {
                          const url = `https://preciousmeets.com/verify-identity?memberId=${encodeURIComponent(
                            att.memberId
                          )}&user=${encodeURIComponent(att.name)}&type=universal_key&valid=365`;
                          processQrCode(url);
                        }}
                        className="flex items-center justify-between rounded-xl border border-destructive/20 bg-destructive/[0.02] p-2.5 text-left hover:border-destructive/50 hover:bg-destructive/10 transition-all hover:scale-[1.01] active:scale-95 cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={att.avatar}
                            alt={att.name}
                            className="size-8 rounded-full object-cover shrink-0 grayscale"
                          />
                          <div className="truncate">
                            <span className="text-xs font-bold text-foreground block truncate">
                              {att.name}
                            </span>
                            <span className="text-[10px] text-muted-foreground block truncate">
                              {otherEvt ? `Seated at: ${otherEvt.title.slice(0, 16)}...` : "Not on Table"}
                            </span>
                          </div>
                        </div>

                        <span className="rounded-full bg-destructive/15 text-destructive px-2 py-0.5 text-[9px] font-mono font-bold shrink-0">
                          Test Reject
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Manual URL / Member ID input */}
              <div className="pt-2 border-t border-border/60">
                <span className="text-[11px] font-bold uppercase font-mono text-muted-foreground block mb-1.5">
                  3. Enter Pass URL or Member ID Manually
                </span>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                    <input
                      type="text"
                      value={manualInput}
                      onChange={(e) => setManualInput(e.target.value)}
                      placeholder="e.g. PM-FOUNDER-8841 or https://preciousmeets.com/verify-identity..."
                      className="w-full rounded-full border border-border bg-background pl-9 pr-3 py-2 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-burgundy"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!manualInput.trim()) return;
                      processQrCode(manualInput.trim());
                    }}
                    className="rounded-full bg-burgundy px-4 py-2 text-xs font-semibold text-ivory hover:bg-burgundy/90 transition-all cursor-pointer shrink-0"
                  >
                    Verify Pass
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= CURRENT TABLE ROSTER LIST ================= */}
          <div className="border-t border-border/80 pt-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="label-mono text-xs font-bold text-foreground uppercase tracking-wider">
                This Table's 6 Seats ({admittedCount} / {seatedAttendees.length} Checked In)
              </span>
              <span className="text-[10px] text-muted-foreground">
                Only these 6 confirmed guests may enter
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[0, 1, 2, 3, 4, 5].map((seatIdx) => {
                const attendeeId = event.seats[seatIdx];
                const attendee = attendeeId
                  ? attendees.find((a) => a.id === attendeeId)
                  : null;
                const isCheckedIn = Boolean(attendee && checkIns[attendee.id]);
                const checkInDetails = attendee ? checkIns[attendee.id] : null;

                return (
                  <div
                    key={seatIdx}
                    className={`flex items-center justify-between rounded-2xl border p-3 transition-all ${
                      attendee
                        ? isCheckedIn
                          ? "border-forest/40 bg-forest/[0.04]"
                          : "border-border/80 bg-card"
                        : "border-dashed border-border/60 bg-muted/20"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative shrink-0">
                        {attendee ? (
                          <img
                            src={attendee.avatar}
                            alt={attendee.name}
                            className={`size-9 rounded-full object-cover border ${
                              isCheckedIn ? "border-forest ring-1 ring-forest/30" : "border-border"
                            }`}
                          />
                        ) : (
                          <div className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground text-xs font-mono font-bold">
                            {seatIdx + 1}
                          </div>
                        )}
                        <span
                          className={`absolute -bottom-1 -right-1 flex size-4 items-center justify-center rounded-full text-[9px] font-bold text-ivory ${
                            isCheckedIn ? "bg-forest" : "bg-burgundy"
                          }`}
                        >
                          {seatIdx + 1}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold text-foreground block truncate">
                          {attendee ? attendee.name : `Seat #${seatIdx + 1} (Empty)`}
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground block truncate">
                          {attendee ? (
                            isCheckedIn ? (
                              <span className="text-forest font-semibold">
                                ✓ Admitted{" "}
                                {new Date(checkInDetails?.checkedInAt || Date.now()).toLocaleTimeString(
                                  [],
                                  { hour: "2-digit", minute: "2-digit" }
                                )}
                              </span>
                            ) : (
                              <span>Awaiting Arrival · {attendee.memberId}</span>
                            )
                          ) : (
                            "Unassigned slot"
                          )}
                        </span>
                      </div>
                    </div>

                    {attendee && (
                      <div className="shrink-0 ml-2">
                        {isCheckedIn ? (
                          <button
                            type="button"
                            onClick={() => handleUndoCheckIn(attendee.id, attendee.name)}
                            title="Reset admission"
                            className="rounded-full px-2.5 py-1 text-[10px] font-mono text-muted-foreground hover:bg-destructive/15 hover:text-destructive transition-all"
                          >
                            Undo
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleManualCheckIn(attendee, seatIdx + 1)}
                            title="Manual Check In"
                            className="rounded-full bg-forest/15 text-forest px-2.5 py-1 text-[10px] font-semibold hover:bg-forest hover:text-ivory transition-all cursor-pointer"
                          >
                            Admit
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
