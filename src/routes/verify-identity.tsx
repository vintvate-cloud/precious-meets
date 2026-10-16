import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/lib/auth-context";
import { IdentityVerificationService } from "@/lib/identity-verification";
import { ShieldCheck, Lock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/verify-identity")({
  head: () => ({
    meta: [
      { title: "Identity Verification — Precious Meets" },
      { name: "description", content: "Consent-based offline identity verification for table safety." },
    ],
  }),
  component: VerifyIdentityPage,
});

function VerifyIdentityPage() {
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifyingMock, setVerifyingMock] = useState(false);

  const handleInitiate = async () => {
    if (!user) {
      toast.error("Please sign in first to initiate verification.");
      return;
    }

    if (!consent) {
      toast.error("Explicit consent is required by UIDAI guidelines.");
      return;
    }

    setLoading(true);

    try {
      const session = await IdentityVerificationService.createVerificationSession({
        userId: user.id,
        userEmail: user.email || "guest@preciousmeets.com",
        fullName: profile?.full_name || profile?.display_name || "Guest Attendee",
        consentGiven: true,
        consentTimestamp: new Date().toISOString(),
        returnUrl: window.location.href,
      });

      if (session.isMock) {
        setVerifyingMock(true);
      } else {
        window.location.href = session.providerUrl;
      }
    } catch (err: any) {
      toast.error(err.message || "Could not initialize verification session.");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteMock = async (status: "success" | "failure" | "manual_review") => {
    setLoading(true);
    try {
      await IdentityVerificationService.processProviderCallback(
        "mock_session_123",
        status,
        status === "failure" ? "Simulated mismatch" : undefined,
      );

      await refreshProfile();

      if (status === "success") {
        toast.success("Identity verified successfully!");
      } else {
        toast.info("Verification status updated.");
      }
      setVerifyingMock(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to update status.");
    } finally {
      setLoading(false);
    }
  };

  const isVerified = profile?.identity_verified || profile?.identity_status === "verified";

  return (
    <div className="flex min-h-screen flex-col bg-ivory text-foreground">
      <Navbar />

      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-6 py-24">
        <div className="rounded-3xl border border-border/80 bg-card p-8 shadow-sm">
          <div className="flex items-center gap-2 text-forest">
            <ShieldCheck className="size-5" />
            <span className="label-mono text-xs">Trust & Safety Protocol</span>
          </div>

          <h1 className="font-display mt-3 text-3xl md:text-4xl">
            Aadhaar <em className="italic text-burgundy">Identity Verification</em>
          </h1>

          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            To ensure genuine, respectful human tables, Precious Meets requires attendees to verify their identity via authorized DigiLocker offline XML verification.
          </p>

          {isVerified ? (
            <div className="mt-8 rounded-2xl border border-forest/30 bg-sage/40 p-6 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-forest text-ivory">
                <CheckCircle2 className="size-6" />
              </div>
              <h3 className="font-display mt-3 text-xl font-semibold text-foreground">
                Verified Member Status
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Your profile holds a verified status. You can join any curated table in Mumbai, Bengaluru, or Delhi.
              </p>
              <Button
                onClick={() => navigate({ to: "/dashboard" })}
                className="mt-6 rounded-full bg-forest px-6 text-xs font-semibold text-white hover:bg-forest/90"
              >
                Go to Dashboard
              </Button>
            </div>
          ) : verifyingMock ? (
            <div className="mt-8 space-y-4 rounded-2xl border border-border bg-sage/30 p-6 text-center">
              <h3 className="font-display text-xl font-semibold">Sandbox Identity Gateway</h3>
              <p className="text-xs text-muted-foreground">
                Simulate provider response from DigiLocker partner API.
              </p>
              <div className="grid grid-cols-3 gap-2 pt-2">
                <Button
                  onClick={() => handleCompleteMock("success")}
                  disabled={loading}
                  className="rounded-lg bg-forest text-xs text-white hover:bg-forest/90"
                >
                  Verify Success
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleCompleteMock("manual_review")}
                  disabled={loading}
                  className="rounded-lg text-xs"
                >
                  Manual Review
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleCompleteMock("failure")}
                  disabled={loading}
                  className="rounded-lg text-xs"
                >
                  Simulate Fail
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-8 space-y-6">
              {/* Privacy Notice */}
              <div className="rounded-xl border border-border/80 bg-background p-4 text-[11px] leading-relaxed text-muted-foreground space-y-2">
                <div className="flex items-center gap-1.5 font-semibold text-foreground">
                  <Lock className="size-3.5 text-forest" /> Zero Raw Aadhaar Storage Guarantee
                </div>
                <p>
                  In compliance with UIDAI regulations and the Indian DPDP Act: we never collect, see, or store your 12-digit Aadhaar number, biometrics, or unmasked documents.
                </p>
                <p>
                  We receive only a cryptographic verification confirmation from our authorized offline verification partner.
                </p>
              </div>

              {/* Explicit Consent Box */}
              <div className="flex items-start gap-3 rounded-xl border border-border/80 bg-card/60 p-4">
                <input
                  type="checkbox"
                  id="aadhaar_consent"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 size-4 accent-burgundy"
                />
                <label htmlFor="aadhaar_consent" className="text-xs leading-relaxed text-foreground">
                  I hereby provide voluntary, informed consent to verify my identity via an authorized DigiLocker offline XML verification service for the sole purpose of safety matching on Precious Meets.
                </label>
              </div>

              <Button
                onClick={handleInitiate}
                disabled={loading || !consent}
                className="w-full rounded-full bg-burgundy py-5 font-semibold text-ivory hover:bg-burgundy/90 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <ShieldCheck className="size-4" />
                )}
                Initiate Secure Verification
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
