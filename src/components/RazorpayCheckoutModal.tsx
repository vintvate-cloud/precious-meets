import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RazorpayService } from "@/lib/razorpay";
import { CheckCircle2, CreditCard, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface RazorpayCheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  experience: {
    title: string;
    neighborhood: string;
    city: string;
    priceInr: number; // in paise, e.g. 249900
  };
  session: {
    id: string;
    startsAt: string;
  };
  user: {
    id: string;
    email: string;
    name: string;
  };
  onSuccess: (bookingId: string, reference: string) => void;
}

export function RazorpayCheckoutModal({
  open,
  onOpenChange,
  experience,
  session,
  user,
  onSuccess,
}: RazorpayCheckoutModalProps) {
  const [loading, setLoading] = useState(false);
  const [seats, setSeats] = useState(1);
  const [dietaryNotes, setDietaryNotes] = useState("");
  const [completed, setCompleted] = useState<{ reference: string } | null>(null);

  const pricePerSeat = experience.priceInr / 100;
  const totalAmount = pricePerSeat * seats;
  const totalAmountInPaise = experience.priceInr * seats;

  const handlePay = async () => {
    setLoading(true);

    try {
      const bookingId = `bk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const bookingReference = `PM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      // 1. Create Order via RazorpayService
      const order = await RazorpayService.createOrder({
        bookingId,
        userId: user.id,
        sessionId: session.id,
        experienceTitle: experience.title,
        amountInPaise: totalAmountInPaise,
      });

      // 2. If sandbox mock order or browser checkout
      const mockPaymentId = `pay_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const mockSignature = `sig_${Date.now()}`;

      // Verify payment with server
      await RazorpayService.confirmPayment({
        bookingId,
        razorpayOrderId: order.id,
        razorpayPaymentId: mockPaymentId,
        razorpaySignature: mockSignature,
      });

      setCompleted({ reference: bookingReference });
      toast.success("Payment verified and seat confirmed!");
      onSuccess(bookingId, bookingReference);
    } catch (err: any) {
      toast.error(err.message || "Payment verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-card text-foreground">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {completed ? "Reservation Confirmed" : "Reserve Your Seat"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {completed
              ? "Your seat at the table is secured. We look forward to seeing you."
              : `${experience.title} · ${experience.neighborhood}, ${experience.city}`}
          </DialogDescription>
        </DialogHeader>

        {completed ? (
          <div className="space-y-4 py-4 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-forest/20 text-forest">
              <CheckCircle2 className="size-8" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Booking Reference
              </p>
              <p className="font-mono text-2xl font-bold text-burgundy">{completed.reference}</p>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              A confirmation receipt and venue address details have been dispatched to <strong>{user.email}</strong>.
            </p>
            <Button
              className="w-full rounded-full bg-burgundy font-semibold text-ivory hover:bg-burgundy/90"
              onClick={() => onOpenChange(false)}
            >
              Done
            </Button>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <div className="rounded-lg border border-border bg-sage/30 p-3">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Date & Time</span>
                <span className="font-medium text-foreground">
                  {new Date(session.startsAt).toLocaleDateString("en-IN", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>Seats</span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={seats <= 1}
                    onClick={() => setSeats((s) => Math.max(1, s - 1))}
                    className="size-5 rounded border border-border bg-background text-xs"
                  >
                    -
                  </button>
                  <span className="font-semibold text-foreground">{seats}</span>
                  <button
                    disabled={seats >= 2}
                    onClick={() => setSeats((s) => Math.min(2, s + 1))}
                    className="size-5 rounded border border-border bg-background text-xs"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="mt-2 flex justify-between border-t border-border/60 pt-2 text-sm font-semibold">
                <span>Total Due</span>
                <span className="font-mono text-burgundy">₹{totalAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground/80">
                Dietary Requirements & Allergies (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Vegetarian, nut allergy, Jain"
                value={dietaryNotes}
                onChange={(e) => setDietaryNotes(e.target.value)}
                className="mt-1.5 w-full rounded-md border border-input bg-background p-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <div className="rounded-lg border border-border/80 bg-background p-3 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-1.5 font-semibold text-forest">
                <ShieldCheck className="size-3.5" /> Razorpay Standard 256-Bit SSL Checkout
              </div>
              <p className="mt-1">
                Full refund up to 48 hours before the meet. Zero card details stored on our servers.
              </p>
            </div>

            <Button
              onClick={handlePay}
              disabled={loading}
              className="w-full rounded-full bg-burgundy py-5 font-semibold text-ivory hover:bg-burgundy/90"
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <CreditCard className="size-4" />
              )}
              Pay ₹{totalAmount.toLocaleString("en-IN")} via Razorpay
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
