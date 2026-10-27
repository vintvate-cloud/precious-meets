import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/lib/auth-context";
import { IdentityVerificationService } from "@/lib/identity-verification";
import {
  ApplicationsService,
  MemberApplication,
} from "@/lib/applications-service";
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  UploadCloud,
  FileText,
  AlertTriangle,
  ArrowRight,
  Check,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/verify-identity")({
  validateSearch: (search: Record<string, unknown>) => ({
    appId: typeof search["appId"] === "string" ? (search["appId"] as string) : undefined,
    email: typeof search["email"] === "string" ? (search["email"] as string) : undefined,
    reupload: search["reupload"] === true || search["reupload"] === "true",
  }),
  head: () => ({
    meta: [
      { title: "Identity Verification — Precious Meets" },
      {
        name: "description",
        content: "Consent-based offline identity verification for table safety.",
      },
    ],
  }),
  component: VerifyIdentityPage,
});

function VerifyIdentityPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const { user, profile, refreshProfile } = useAuth();

  // Search params for re-upload workflow
  const appId = search.appId;
  const emailParam = search.email;
  const isExplicitReupload = search.reupload;

  // Re-upload state
  const [app, setApp] = useState<MemberApplication | null>(null);
  const [newFileUrl, setNewFileUrl] = useState<string | null>(null);
  const [newFileName, setNewFileName] = useState<string | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [isSubmittingReupload, setIsSubmittingReupload] = useState(false);
  const [reuploadSuccess, setReuploadSuccess] = useState(false);

  // Default flow state
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifyingMock, setVerifyingMock] = useState(false);

  // Load application if appId or email is present
  useEffect(() => {
    if (appId || emailParam) {
      const loadApp = async () => {
        let apps = ApplicationsService.getApplications();
        let found = apps.find(
          (a: MemberApplication) =>
            (appId && a.id.toLowerCase() === appId.toLowerCase()) ||
            (emailParam &&
              a.applicantEmail.toLowerCase() === emailParam.toLowerCase()),
        );
        if (!found) {
          try {
            apps = await ApplicationsService.fetchApplicationsFromDb();
            found = apps.find(
              (a: MemberApplication) =>
                (appId && a.id.toLowerCase() === appId.toLowerCase()) ||
                (emailParam &&
                  a.applicantEmail.toLowerCase() === emailParam.toLowerCase()),
            );
          } catch (e) {
            console.warn("[VerifyIdentity] Failed to fetch application from DB:", e);
          }
        }
        if (found) {
          setApp(found);
        }
      };
      loadApp();
    }
  }, [appId, emailParam]);

  const isReuploadMode =
    isExplicitReupload ||
    app?.identityStatus === "reupload_requested" ||
    Boolean(appId && app);

  // Handle re-upload file attachment with canvas compression
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size is too large. Please select a document under 10MB.");
      return;
    }

    setIsProcessingFile(true);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const MAX_DIM = 900;
          let width = img.width;
          let height = img.height;
          if (width > MAX_DIM || height > MAX_DIM) {
            if (width > height) {
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            } else {
              width = Math.round((width * MAX_DIM) / height);
              height = MAX_DIM;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.7);
            setNewFileUrl(compressedDataUrl);
            setNewFileName(file.name);
            toast.success("Aadhaar card image attached successfully!");
          } else {
            setNewFileUrl(event.target?.result as string);
            setNewFileName(file.name);
          }
          setIsProcessingFile(false);
        };
        img.onerror = () => {
          toast.error("Failed to process image file. Please try another image.");
          setIsProcessingFile(false);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    } else if (file.type === "application/pdf") {
      if (file.size > 4 * 1024 * 1024) {
        toast.error("PDF is larger than 4MB. Please upload a smaller PDF or an image.");
        setIsProcessingFile(false);
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewFileUrl(event.target?.result as string);
        setNewFileName(file.name);
        toast.success("Aadhaar PDF document attached successfully!");
        setIsProcessingFile(false);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Unsupported file type. Please upload a JPG, PNG, WEBP, or PDF.");
      setIsProcessingFile(false);
    }
  };

  const handleSubmitReupload = async () => {
    if (!newFileUrl) {
      toast.error("Please select a clear photo or PDF of your Aadhaar card.");
      return;
    }

    const targetId = app?.id || appId || emailParam;
    if (!targetId) {
      toast.error("Unable to identify application. Please use the link sent to your email.");
      return;
    }

    setIsSubmittingReupload(true);
    try {
      const res = await ApplicationsService.submitAadhaarReupload(
        targetId,
        newFileUrl,
        newFileName || "aadhaar_card_reupload",
      );
      setApp(res.application);
      setReuploadSuccess(true);
      toast.success("Aadhaar re-uploaded successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit re-upload.");
    } finally {
      setIsSubmittingReupload(false);
    }
  };

  // Default DigiLocker mock handlers
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
      const session =
        await IdentityVerificationService.createVerificationSession({
          userId: user.id,
          userEmail: user.email || "guest@preciousmeets.com",
          fullName:
            profile?.full_name || profile?.display_name || "Guest Attendee",
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

  const handleCompleteMock = async (
    status: "success" | "failure" | "manual_review",
  ) => {
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

  const isVerified =
    profile?.identity_verified || profile?.identity_status === "verified";

  return (
    <div className="flex min-h-screen flex-col bg-ivory text-foreground">
      <Navbar />

      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-4 sm:px-6 py-20 sm:py-24">
        <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm">
          {/* ========================================================================= */}
          {/* MODE 1: AADHAAR RE-UPLOAD WORKFLOW                                       */}
          {/* ========================================================================= */}
          {isReuploadMode ? (
            reuploadSuccess ? (
              <div className="space-y-6 text-center py-4">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-forest text-ivory shadow-sm">
                  <CheckCircle2 className="size-8" />
                </div>
                <div className="space-y-2">
                  <span className="font-mono text-xs uppercase tracking-wider text-forest font-bold">
                    ✓ Document Submitted
                  </span>
                  <h1 className="font-display text-2xl sm:text-3xl font-normal text-foreground">
                    Aadhaar Re-upload Received
                  </h1>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
                    Thank you, {app?.applicantName || "Member"}. Your updated Aadhaar document has been submitted to the curation committee. Our team will review it shortly and update your status.
                  </p>
                </div>

                <div className="rounded-2xl border border-forest/20 bg-forest/5 p-4 text-xs text-muted-foreground space-y-1 text-left max-w-md mx-auto">
                  <div className="flex items-center gap-1.5 font-semibold text-forest">
                    <ShieldCheck className="size-4" />
                    <span>Application Ref: {app?.applicationReference || "PM-VERIFIED"}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    You do not need to take any further action. You will receive an email confirmation once verification is complete.
                  </p>
                </div>

                <div className="pt-2">
                  <Button
                    onClick={() => navigate({ to: "/" })}
                    className="rounded-full bg-burgundy px-8 py-2.5 text-xs font-semibold text-ivory hover:bg-burgundy/90 cursor-pointer"
                  >
                    Return to Homepage
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-amber-700">
                  <AlertTriangle className="size-5" />
                  <span className="label-mono text-xs font-bold uppercase tracking-wider">
                    Attention Required · Re-verification
                  </span>
                </div>

                <div>
                  <h1 className="font-display text-2xl sm:text-3xl text-foreground font-normal">
                    Re-verify Your <em className="italic text-burgundy">Aadhaar Card</em>
                  </h1>
                  <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Hello {app?.applicantName || "Member"}, please upload a clear, legible copy of your Aadhaar card to complete your identity verification.
                  </p>
                </div>

                {/* Curator Feedback Note */}
                <div className="rounded-2xl border-l-4 border-amber-600 bg-amber-500/10 p-4 border border-border/60">
                  <span className="font-mono text-[10px] uppercase font-bold text-amber-900 tracking-wider block mb-1">
                    Curator Note / Reason:
                  </span>
                  <p className="text-xs text-foreground font-medium leading-relaxed italic">
                    "{app?.aadhaarRejectionFeedback || "Your previous upload was unclear or cut off. Please upload a clear, complete copy of your Aadhaar document."}"
                  </p>
                </div>

                {/* Document Upload Zone */}
                <div className="space-y-3">
                  <label className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground block">
                    Upload Aadhaar Document (JPG, PNG, PDF up to 10MB)
                  </label>

                  <div className="relative rounded-2xl border-2 border-dashed border-border hover:border-burgundy/50 bg-ivory/50 transition-colors p-6 text-center cursor-pointer">
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleFileChange}
                      disabled={isProcessingFile || isSubmittingReupload}
                      className="absolute inset-0 size-full opacity-0 cursor-pointer z-10"
                    />

                    {isProcessingFile ? (
                      <div className="flex flex-col items-center justify-center py-4 space-y-2">
                        <Loader2 className="size-7 animate-spin text-burgundy" />
                        <span className="text-xs font-semibold text-muted-foreground">
                          Processing and compressing document...
                        </span>
                      </div>
                    ) : newFileUrl ? (
                      <div className="flex flex-col items-center space-y-3 py-2">
                        <div className="size-12 rounded-xl bg-forest/10 border border-forest/30 flex items-center justify-center text-forest">
                          <FileText className="size-6" />
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-bold text-foreground truncate max-w-xs">
                            {newFileName || "Aadhaar Card Attached"}
                          </p>
                          <span className="text-[10px] text-forest font-mono uppercase font-bold">
                            ✓ Ready for Submission
                          </span>
                        </div>
                        <span className="text-[11px] text-burgundy underline hover:text-burgundy/80">
                          Click to choose a different file
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center space-y-2 py-4">
                        <div className="size-12 rounded-full bg-burgundy/10 text-burgundy flex items-center justify-center mb-1">
                          <UploadCloud className="size-6" />
                        </div>
                        <p className="text-xs font-bold text-foreground">
                          Click or drag to upload your Aadhaar document
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Clear photo of front side, full e-Aadhaar, or PDF
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Privacy Assurance */}
                <div className="rounded-xl border border-border/80 bg-background p-3.5 text-[11px] text-muted-foreground space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-foreground">
                    <Lock className="size-3.5 text-forest" /> UIDAI Offline Privacy Guarantee
                  </div>
                  <p className="leading-relaxed">
                    Zero raw Aadhaar numbers or biometrics are ever stored. Your document is processed strictly for age and identity authentication in compliance with Indian DPDP regulations.
                  </p>
                </div>

                {/* Submit Action */}
                <Button
                  onClick={handleSubmitReupload}
                  disabled={!newFileUrl || isProcessingFile || isSubmittingReupload}
                  className="w-full rounded-full bg-burgundy py-5 font-semibold text-ivory hover:bg-burgundy/90 disabled:opacity-50 cursor-pointer shadow-sm flex items-center justify-center gap-2 text-xs sm:text-sm"
                >
                  {isSubmittingReupload ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Submitting to Curation Team...</span>
                    </>
                  ) : (
                    <>
                      <Check className="size-4" />
                      <span>Submit Aadhaar for Verification</span>
                    </>
                  )}
                </Button>
              </div>
            )
          ) : (
            /* ========================================================================= */
            /* MODE 2: DEFAULT DIGILOCKER VERIFICATION FLOW                             */
            /* ========================================================================= */
            <div>
              <div className="flex items-center gap-2 text-forest">
                <ShieldCheck className="size-5" />
                <span className="label-mono text-xs">Trust & Safety Protocol</span>
              </div>

              <h1 className="font-display mt-3 text-3xl md:text-4xl font-normal">
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
                    Your profile holds a verified status. You can join any curated table in Delhi NCR.
                  </p>
                  <Button
                    onClick={() => navigate({ to: "/dashboard" })}
                    className="mt-6 rounded-full bg-forest px-6 text-xs font-semibold text-white hover:bg-forest/90 cursor-pointer"
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
                      className="rounded-lg bg-forest text-xs text-white hover:bg-forest/90 cursor-pointer"
                    >
                      Verify Success
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleCompleteMock("manual_review")}
                      disabled={loading}
                      className="rounded-lg text-xs cursor-pointer"
                    >
                      Manual Review
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleCompleteMock("failure")}
                      disabled={loading}
                      className="rounded-lg text-xs cursor-pointer"
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
                      className="mt-1 size-4 accent-burgundy cursor-pointer"
                    />
                    <label htmlFor="aadhaar_consent" className="text-xs leading-relaxed text-foreground cursor-pointer">
                      I hereby provide voluntary, informed consent to verify my identity via an authorized DigiLocker offline XML verification service for the sole purpose of safety matching on Precious Meets.
                    </label>
                  </div>

                  <Button
                    onClick={handleInitiate}
                    disabled={loading || !consent}
                    className="w-full rounded-full bg-burgundy py-5 font-semibold text-ivory hover:bg-burgundy/90 disabled:opacity-50 cursor-pointer"
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
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
