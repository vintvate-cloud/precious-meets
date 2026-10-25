import React, { useState } from "react";
import {
  MemberApplication,
  ApplicationsService,
} from "@/lib/applications-service";
import { VerificationsService } from "@/lib/verifications-service";
import { getSampleAadhaarSvg } from "@/lib/aadhaar-utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  CreditCard,
  FileText,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Sparkles,
  AlertTriangle,
  Loader2,
  Lock,
  ArrowRight,
  ExternalLink,
  Send,
  UserCheck,
  UserX,
  KeyRound,
  Copy,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface UserDossierModalProps {
  application: MemberApplication | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplicationUpdated: (updated: MemberApplication) => void;
}

export function UserDossierModal({
  application,
  open,
  onOpenChange,
  onApplicationUpdated,
}: UserDossierModalProps) {
  if (!application) return null;

  const [activeSheet, setActiveSheet] = useState<
    "quiz" | "payment" | "identity" | "decision"
  >("quiz");
  const [processing, setProcessing] = useState(false);
  const [reviewerNotes, setReviewerNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [sendingCredentials, setSendingCredentials] = useState(false);
  const [credentialsModalOpen, setCredentialsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSendCredentials = async () => {
    setSendingCredentials(true);
    try {
      const res = await ApplicationsService.sendMemberCredentials(application.id);
      toast.success(
        `Login credentials dispatched to ${application.applicantEmail}!`,
        {
          description: `Strong 16-character auto-generated password generated and sent via Resend.`,
        },
      );
      onApplicationUpdated(res.application);
      setCredentialsModalOpen(false);
    } catch (e: any) {
      toast.error(e.message || "Failed to dispatch credentials.");
    } finally {
      setSendingCredentials(false);
    }
  };

  const handleApprove = async () => {
    setProcessing(true);
    try {
      const res = await ApplicationsService.approveApplication(
        application.id,
        reviewerNotes || "Approved for curated tables by curation committee.",
      );
      toast.success(
        `Application ${application.applicationReference} approved!`,
        {
          description: `Welcome pass email dispatched to ${application.applicantEmail}.`,
        },
      );
      onApplicationUpdated(res.application);
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e.message || "Failed to approve application.");
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    setProcessing(true);
    try {
      const res = await ApplicationsService.rejectApplication(
        application.id,
        rejectionReason ||
          "Due to cohort balance and seat capacity restrictions, we cannot accept this application for the current season.",
      );
      toast.info(
        `Application ${application.applicationReference} declined.`,
        {
          description: `Notice email sent to ${application.applicantEmail}.`,
        },
      );
      onApplicationUpdated(res.application);
      setRejectModalOpen(false);
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e.message || "Failed to reject application.");
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteDossier = async () => {
    if (!application) return;
    if (
      window.confirm(
        `Are you sure you want to permanently delete the application for "${application.applicantName}" (${application.applicantEmail})?\n\nThis will remove their file from both dossiers and verifications.`
      )
    ) {
      setProcessing(true);
      try {
        await ApplicationsService.deleteApplication(application.id);
        VerificationsService.deleteRecord(application.id, application.applicantEmail);
        toast.success(`Application for "${application.applicantName}" permanently deleted.`);
        onOpenChange(false);
      } catch (e: any) {
        toast.error(e.message || "Failed to delete application.");
      } finally {
        setProcessing(false);
      }
    }
  };

  const isPending = application.status === "pending_review";
  const isApproved = application.status === "approved";
  const isRejected = application.status === "rejected";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[95vw] p-0 overflow-hidden bg-ivory text-foreground border border-border shadow-2xl rounded-3xl max-h-[92vh] flex flex-col">
        {/* ========================================================================= */}
        {/* DOSSIER FOLDER HEADER (Physical Archive Aesthetic)                        */}
        {/* ========================================================================= */}
        <div className="relative border-b border-border/80 bg-card p-6 pb-4">
          {/* Top Folder Tab */}
          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wider rounded-t-lg bg-burgundy/10 text-burgundy border border-b-0 border-burgundy/20 px-3 py-1 font-semibold">
                CONFIDENTIAL DOSSIER · {application.applicationReference}
              </span>
              <span className="text-[11px] text-muted-foreground font-mono">
                Received: {application.createdAt ? new Date(application.createdAt).toLocaleDateString() : "Recent"}
              </span>
            </div>

            {/* Status Stamp */}
            <div className="pr-8 sm:pr-6">
              {isApproved && (
                <span className="inline-flex items-center gap-1 rounded-full border border-forest/30 bg-forest/15 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-forest">
                  <CheckCircle2 className="size-3.5" />
                  VERIFIED MEMBER
                </span>
              )}
              {isPending && (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/15 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-amber-700 animate-pulse">
                  <AlertTriangle className="size-3.5" />
                  AWAITING REVIEW
                </span>
              )}
              {isRejected && (
                <span className="inline-flex items-center gap-1 rounded-full border border-destructive/30 bg-destructive/15 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-destructive">
                  <XCircle className="size-3.5" />
                  DECLINED
                </span>
              )}
            </div>
          </div>

          {/* Member Card Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-4">
              <img
                src={
                  application.avatarUrl ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                }
                alt={application.applicantName}
                className="size-14 rounded-2xl border-2 border-border/80 object-cover shadow-xs"
              />
              <div>
                <h2 className="font-display text-2xl font-normal leading-tight text-foreground">
                  {application.applicantName}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-0.5">
                  <span className="flex items-center gap-1">
                    <Mail className="size-3" />
                    {application.applicantEmail}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="size-3" />
                    {application.applicantPhone}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3" />
                    {application.applicantCity}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick 3-Pillar Verification Badges */}
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
              <div className="flex items-center gap-1 rounded-xl border border-forest/20 bg-forest/10 px-2.5 py-1.5 text-forest font-semibold">
                <CheckCircle2 className="size-3 text-forest" />
                <span>Quiz Complete</span>
              </div>
              <div
                className={`flex items-center gap-1 rounded-xl border px-2.5 py-1.5 font-semibold ${
                  application.paymentStatus === "paid"
                    ? "border-forest/20 bg-forest/10 text-forest"
                    : "border-border bg-card text-muted-foreground"
                }`}
              >
                <CreditCard className="size-3" />
                <span>
                  {application.paymentStatus === "paid"
                    ? `Paid ₹${application.paymentAmountInr}`
                    : "Unpaid"}
                </span>
              </div>
              <div
                className={`flex items-center gap-1 rounded-xl border px-2.5 py-1.5 font-semibold ${
                  application.identityStatus === "verified"
                    ? "border-forest/20 bg-forest/10 text-forest"
                    : "border-amber-500/20 bg-amber-500/10 text-amber-700"
                }`}
              >
                <ShieldCheck className="size-3" />
                <span>
                  {application.identityStatus === "verified"
                    ? "Aadhaar Verified"
                    : "Aadhaar Pending"}
                </span>
              </div>
              <div
                className={`flex items-center gap-1 rounded-xl border px-2.5 py-1.5 font-semibold ${
                  application.credentialsSent
                    ? "border-forest/20 bg-forest/10 text-forest"
                    : "border-purple-500/20 bg-purple-500/10 text-purple-700"
                }`}
              >
                <KeyRound className="size-3" />
                <span>
                  {application.credentialsSent
                    ? "Credentials Sent"
                    : "Credentials Pending"}
                </span>
              </div>
            </div>
          </div>

          {/* Dossier Sheets Navigation Tabs */}
          <div className="flex items-center gap-1.5 pt-5 -mb-4 overflow-x-auto">
            {[
              {
                id: "quiz",
                label: "1. Vibe & Quiz Dossier",
                icon: Sparkles,
              },
              {
                id: "payment",
                label: "2. Financial Record",
                icon: CreditCard,
              },
              {
                id: "identity",
                label: "3. Aadhaar Verification",
                icon: ShieldCheck,
              },
              {
                id: "decision",
                label: "4. Review History & Emails",
                icon: FileText,
              },
            ].map((sheet) => {
              const Icon = sheet.icon;
              const isActive = activeSheet === sheet.id;
              return (
                <button
                  key={sheet.id}
                  onClick={() => setActiveSheet(sheet.id as any)}
                  className={`flex items-center gap-1.5 rounded-t-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-ivory text-burgundy border-t-2 border-burgundy shadow-xs font-bold"
                      : "text-muted-foreground hover:bg-sage/40 hover:text-foreground"
                  }`}
                >
                  <Icon className="size-3.5" />
                  <span>{sheet.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DOSSIER BODY (Content of selected sheet)                                  */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-ivory">
          {/* SHEET 1: VIBE & QUIZ DOSSIER */}
          {activeSheet === "quiz" && (
            <div className="space-y-6">
              {/* Archetype Highlight Banner */}
              <div className="rounded-2xl border border-ochre/30 bg-card p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="label-mono text-xs text-forest">
                    Social Compatibility Archetype
                  </span>
                  <span className="rounded-full bg-burgundy/10 px-3 py-0.5 font-mono text-[10px] font-bold text-burgundy">
                    10-Question Scoring Engine
                  </span>
                </div>
                <h3 className="font-display mt-2 text-2xl text-foreground">
                  {application.archetypeTitle}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground max-w-2xl">
                  {application.archetypeDescription}
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {application.archetypeTraits?.map((trait, i) => (
                    <span
                      key={i}
                      className="rounded-full border border-border bg-ivory px-3 py-0.5 text-[11px] font-medium text-foreground"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>

              {/* Dimension Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    Conversational Dynamics (0–100)
                  </h4>

                  {[
                    {
                      label: "Social Energy",
                      value: application.socialEnergyScore,
                      desc: "Intimacy vs. Large room dynamic",
                    },
                    {
                      label: "Conversation Depth",
                      value: application.conversationDepthScore,
                      desc: "Philosophical & deep discourse",
                    },
                    {
                      label: "Playfulness / Wit",
                      value: application.playfulnessScore,
                      desc: "Humor, storytelling & banter",
                    },
                    {
                      label: "Curiosity Factor",
                      value: application.curiosityScore,
                      desc: "Interest in unfamiliar perspectives",
                    },
                    {
                      label: "Sensory & Adventure",
                      value: application.adventureScore,
                      desc: "Appetite for experimental venues",
                    },
                  ].map((dim, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-foreground">
                          {dim.label}
                        </span>
                        <span className="font-mono font-bold text-burgundy">
                          {dim.value}%
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-border/60 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-burgundy transition-all duration-500"
                          style={{ width: `${dim.value}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {dim.desc}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Dietary & Boundaries */}
                <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    Table Safety & Boundaries
                  </h4>

                  <div className="space-y-1">
                    <span className="text-[11px] font-mono uppercase text-muted-foreground">
                      Dietary Preferences
                    </span>
                    <p className="text-xs font-semibold text-foreground bg-ivory rounded-xl p-2.5 border border-border">
                      {application.dietaryPreference || "Flexible / Omnivore"}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-mono uppercase text-muted-foreground">
                      Known Allergies
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {application.allergies && application.allergies.length > 0 ? (
                        application.allergies.map((alg, i) => (
                          <span
                            key={i}
                            className="rounded-lg bg-destructive/10 text-destructive border border-destructive/20 px-2 py-0.5 text-[11px] font-mono"
                          >
                            ⚠️ {alg}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          None declared
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-mono uppercase text-muted-foreground">
                      Conversational Boundaries
                    </span>
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      {application.personalBoundaries &&
                      application.personalBoundaries.length > 0 ? (
                        application.personalBoundaries.map((b, i) => (
                          <li
                            key={i}
                            className="rounded-lg bg-ivory p-2 border border-border text-[11px]"
                          >
                            🛡️ {b}
                          </li>
                        ))
                      ) : (
                        <li>Standard community guidelines apply.</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Answers Breakdown */}
              {application.quizAnswers && application.quizAnswers.length > 0 && (
                <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    Detailed Question-by-Question Responses
                  </h4>
                  <div className="space-y-2">
                    {application.quizAnswers.map((ans, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-border/60 bg-ivory/60 p-3 text-xs"
                      >
                        <div className="font-medium text-foreground">
                          Q{ans.questionNumber || idx + 1}: {ans.questionTitle}
                        </div>
                        <div className="mt-1 text-burgundy font-serif italic text-sm">
                          “{ans.answerLabel}”
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SHEET 2: FINANCIAL RECORD */}
          {activeSheet === "payment" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-border/70 pb-4">
                  <div>
                    <span className="label-mono text-xs text-forest">
                      Payment Verification
                    </span>
                    <h3 className="font-display text-2xl text-foreground mt-1">
                      {application.paymentPlanTitle}
                    </h3>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider ${
                      application.paymentStatus === "paid"
                        ? "bg-forest/15 text-forest border border-forest/30"
                        : "bg-destructive/15 text-destructive border border-destructive/30"
                    }`}
                  >
                    {application.paymentStatus}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="rounded-xl bg-ivory p-3 border border-border">
                    <span className="font-mono text-[10px] uppercase text-muted-foreground">
                      Amount Paid
                    </span>
                    <div className="font-display text-2xl text-foreground font-bold mt-0.5">
                      ₹{application.paymentAmountInr}
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      Full 365-day founding membership
                    </span>
                  </div>

                  <div className="rounded-xl bg-ivory p-3 border border-border">
                    <span className="font-mono text-[10px] uppercase text-muted-foreground">
                      Gateway Reference
                    </span>
                    <div className="font-mono text-xs text-burgundy font-bold mt-1 break-all">
                      {application.razorpayPaymentId || "pay_unassigned"}
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      Razorpay Authorized Checkout
                    </span>
                  </div>

                  <div className="rounded-xl bg-ivory p-3 border border-border">
                    <span className="font-mono text-[10px] uppercase text-muted-foreground">
                      Transaction Date
                    </span>
                    <div className="text-xs font-semibold text-foreground mt-1">
                      {application.paidAt
                        ? new Date(application.paidAt).toLocaleString()
                        : "Pending"}
                    </div>
                  </div>

                  <div className="rounded-xl bg-ivory p-3 border border-border">
                    <span className="font-mono text-[10px] uppercase text-muted-foreground">
                      Member Pass Reference
                    </span>
                    <div className="font-mono text-xs font-bold text-foreground mt-1">
                      {application.applicationReference}
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-sage/30 p-3.5 border border-forest/20 text-xs text-muted-foreground flex items-center gap-2">
                  <ShieldCheck className="size-4 text-forest shrink-0" />
                  <span>
                    Payment captured via PCI-DSS Level 1 compliant Razorpay
                    gateway. If rejected, automatic 100% refund is initiated.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* SHEET 3: AADHAAR VERIFICATION */}
          {activeSheet === "identity" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-border/70 pb-4">
                  <div>
                    <span className="label-mono text-xs text-forest">
                      UIDAI Compliance Protocol
                    </span>
                    <h3 className="font-display text-2xl text-foreground mt-1">
                      Offline Aadhaar & DigiLocker Audit
                    </h3>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider ${
                      application.identityStatus === "verified"
                        ? "bg-forest/15 text-forest border border-forest/30"
                        : "bg-amber-500/15 text-amber-700 border border-amber-500/30"
                    }`}
                  >
                    {application.identityStatus}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="rounded-xl bg-ivory p-3 border border-border">
                    <span className="font-mono text-[10px] uppercase text-muted-foreground">
                      Verification Method
                    </span>
                    <div className="font-semibold text-foreground mt-0.5">
                      {application.identityProvider}
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      Zero raw Aadhaar numbers or biometrics stored
                    </span>
                  </div>

                  <div className="rounded-xl bg-ivory p-3 border border-border">
                    <span className="font-mono text-[10px] uppercase text-muted-foreground">
                      Provider Verification Hash
                    </span>
                    <div className="font-mono text-xs text-forest font-bold mt-0.5">
                      {application.identityReference || "DL-CONSENT-TOKEN-01"}
                    </div>
                  </div>

                  <div className="rounded-xl bg-ivory p-3 border border-border sm:col-span-2">
                    <span className="font-mono text-[10px] uppercase text-muted-foreground">
                      Verification Timestamp
                    </span>
                    <div className="text-xs font-semibold text-foreground mt-0.5">
                      {application.identityVerifiedAt
                        ? new Date(
                            application.identityVerifiedAt,
                          ).toLocaleString()
                        : "Not yet completed"}
                    </div>
                  </div>
                </div>

                {/* Uploaded Aadhaar Document Proof */}
                {(() => {
                  const effectiveUrl =
                    application.aadhaarFileUrl ||
                    (application.identityProvider === "aadhaar_card_upload" || application.aadhaarFileName
                      ? getSampleAadhaarSvg(application.applicantName, application.applicationReference)
                      : null);
                  if (!effectiveUrl) return null;

                  return (
                    <div className="rounded-xl bg-ivory p-4 border border-burgundy/30 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-semibold text-burgundy text-xs">
                          <FileText className="size-4" />
                          <span>Uploaded Aadhaar Document ({application.aadhaarFileName || "UIDAI Aadhaar Copy"})</span>
                        </div>
                        <a
                          href={effectiveUrl}
                          download={application.aadhaarFileName || "aadhaar_card"}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-burgundy hover:underline cursor-pointer"
                        >
                          <ExternalLink className="size-3" /> Open Original
                        </a>
                      </div>
                      {!effectiveUrl.startsWith("data:application/pdf") && !effectiveUrl.toLowerCase().includes(".pdf") ? (
                        <div className="flex justify-center bg-card rounded-lg p-2 border border-border">
                          <img
                            src={effectiveUrl}
                            alt="Aadhaar Card"
                            className="max-h-64 object-contain rounded"
                          />
                        </div>
                      ) : (
                        <iframe
                          src={effectiveUrl}
                          title="Aadhaar PDF"
                          className="w-full h-64 rounded border border-border"
                        />
                      )}
                    </div>
                  );
                })()}

                <div className="rounded-xl bg-forest/5 p-4 border border-forest/20 text-xs text-muted-foreground space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-forest">
                    <ShieldCheck className="size-4" />
                    <span>UIDAI Compliance Audit Guarantee</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    This applicant completed consent-driven XML/DigiLocker offline
                    verification confirming age (18+), residency, and matching full
                    legal name.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SHEET 4: REVIEW HISTORY & EMAILS */}
          {activeSheet === "decision" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-4">
                <h3 className="font-display text-xl text-foreground">
                  Adjudication Trail & Email Notifications
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="rounded-xl bg-ivory p-3.5 border border-border">
                    <div className="flex justify-between font-mono text-[11px] text-muted-foreground">
                      <span>Reviewed By:</span>
                      <span className="font-semibold text-foreground">
                        {application.reviewedBy || "Pending Review"}
                      </span>
                    </div>
                    {application.reviewedAt && (
                      <div className="flex justify-between font-mono text-[11px] text-muted-foreground mt-1">
                        <span>Reviewed At:</span>
                        <span>
                          {new Date(application.reviewedAt).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {application.reviewDecisionNotes && (
                    <div className="rounded-xl bg-forest/10 p-3.5 border border-forest/20 text-xs">
                      <span className="font-mono text-[10px] uppercase font-bold text-forest">
                        Curation Committee Notes:
                      </span>
                      <p className="mt-1 text-foreground leading-relaxed">
                        {application.reviewDecisionNotes}
                      </p>
                    </div>
                  )}

                  {application.rejectionReason && (
                    <div className="rounded-xl bg-destructive/10 p-3.5 border border-destructive/20 text-xs">
                      <span className="font-mono text-[10px] uppercase font-bold text-destructive">
                        Rejection Feedback Given:
                      </span>
                      <p className="mt-1 text-foreground leading-relaxed">
                        {application.rejectionReason}
                      </p>
                    </div>
                  )}

                  {application.decisionEmailSentAt && (
                    <div className="rounded-xl bg-ivory p-3.5 border border-border flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Send className="size-4 text-forest" />
                        <div>
                          <div className="font-semibold text-foreground">
                            Decision Email Sent
                          </div>
                          <div className="text-[10px] text-muted-foreground font-mono">
                            Template: {application.decisionEmailTemplate}
                          </div>
                        </div>
                      </div>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {new Date(
                          application.decisionEmailSentAt,
                        ).toLocaleTimeString()}
                      </span>
                    </div>
                  )}

                  {/* Member Login Credentials Card */}
                  <div className="rounded-xl bg-purple-500/5 p-4 border border-purple-500/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <KeyRound className="size-4 text-purple-700" />
                        <span className="font-semibold text-foreground text-xs">
                          Member Login Credentials (Auto-Generated)
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                          application.credentialsSent
                            ? "bg-forest/15 text-forest"
                            : "bg-purple-500/15 text-purple-800"
                        }`}
                      >
                        {application.credentialsSent ? "Dispatched" : "Pending Dispatch"}
                      </span>
                    </div>

                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Auto-generated strong passwords follow 16+ characters with uppercase, lowercase, numbers, and symbols. The login link directs to <code>/login</code> with instructions not to share credentials.
                    </p>

                    <div className="rounded-lg bg-card p-3 border border-border space-y-1.5 text-xs">
                      <div className="flex justify-between font-mono text-[11px]">
                        <span className="text-muted-foreground">Sign-In Email:</span>
                        <span className="font-semibold text-foreground">{application.applicantEmail}</span>
                      </div>
                      {application.autoGeneratedPassword && (
                        <div className="flex items-center justify-between font-mono text-[11px] pt-1 border-t border-border/60">
                          <span className="text-muted-foreground">Auto-Generated Password:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-burgundy bg-burgundy/10 px-2 py-0.5 rounded">
                              {showPassword ? application.autoGeneratedPassword : "••••••••••••••••"}
                            </span>
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="text-muted-foreground hover:text-foreground text-[10px] underline cursor-pointer"
                            >
                              {showPassword ? "Hide" : "Show"}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(application.autoGeneratedPassword || "");
                                toast.success("Password copied to clipboard");
                              }}
                              className="text-muted-foreground hover:text-foreground cursor-pointer"
                              title="Copy Password"
                            >
                              <Copy className="size-3" />
                            </button>
                          </div>
                        </div>
                      )}
                      {application.credentialsSentAt && (
                        <div className="flex justify-between font-mono text-[10px] text-muted-foreground pt-1">
                          <span>Dispatched At:</span>
                          <span>{new Date(application.credentialsSentAt).toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    <Button
                      size="sm"
                      onClick={() => setCredentialsModalOpen(true)}
                      disabled={sendingCredentials}
                      className="w-full rounded-xl bg-purple-700 hover:bg-purple-800 text-ivory text-xs font-semibold py-2 shadow-xs cursor-pointer flex items-center justify-center gap-2"
                    >
                      <KeyRound className="size-3.5" />
                      <span>{application.credentialsSent ? "Re-generate & Re-send Login Credentials" : "Send Login Credentials to User"}</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* DOSSIER FOOTER (Executive Decision Actions)                                */}
        {/* ========================================================================= */}
        <div className="border-t border-border/80 bg-card/80 backdrop-blur-xs px-4 py-3 sm:px-6 sm:py-3.5 flex flex-col md:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 text-xs text-muted-foreground w-full md:w-auto justify-between md:justify-start shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeleteDossier}
              disabled={processing}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 text-xs px-2.5 h-8.5 cursor-pointer rounded-xl shrink-0"
              title="Permanently delete application dossier"
            >
              <Trash2 className="size-3.5 mr-1.5" />
              Delete Application
            </Button>
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-muted-foreground/75 pl-2 border-l border-border/60 shrink-0">
              <Lock className="size-3 text-burgundy" />
              <span>Audit-logged action</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 w-full md:w-auto">
            {/* Direct Send Credentials Button for Admin */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCredentialsModalOpen(true)}
              disabled={sendingCredentials}
              className={`rounded-full text-xs font-semibold px-3.5 py-1.5 h-9 cursor-pointer flex items-center gap-1.5 shrink-0 ${
                application.credentialsSent
                  ? "border-forest/40 text-forest hover:bg-forest/10"
                  : "border-purple-600/40 text-purple-700 hover:bg-purple-50"
              }`}
            >
              <KeyRound className="size-3.5" />
              <span>
                {application.credentialsSent
                  ? "Credentials Sent ✓"
                  : "Send Login Credentials"}
              </span>
            </Button>

            {isPending ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRejectModalOpen(true)}
                  disabled={processing}
                  className="rounded-full border-destructive/40 text-destructive hover:bg-destructive/10 text-xs font-semibold px-3.5 py-1.5 h-9 cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <UserX className="size-3.5" />
                  <span>Decline Application</span>
                </Button>

                <Button
                  size="sm"
                  onClick={handleApprove}
                  disabled={processing}
                  className="rounded-full bg-forest text-ivory hover:bg-forest/90 text-xs font-semibold px-4.5 py-1.5 h-9 shadow-xs cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  {processing ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <UserCheck className="size-3.5" />
                  )}
                  <span>Approve & Issue Member Pass</span>
                </Button>
              </>
            ) : isApproved ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-forest font-semibold flex items-center gap-1 py-1 px-2.5 rounded-full bg-forest/10 border border-forest/20">
                  <CheckCircle2 className="size-3.5" /> Member Inducted
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRejectModalOpen(true)}
                  className="rounded-full border-border text-xs text-muted-foreground hover:text-destructive h-9 px-3.5 cursor-pointer shrink-0"
                >
                  Revoke & Decline
                </Button>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-destructive font-semibold flex items-center gap-1 py-1 px-2.5 rounded-full bg-destructive/10 border border-destructive/20">
                  <XCircle className="size-3.5" /> Application Declined
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleApprove}
                  className="rounded-full border-forest/40 text-forest hover:bg-forest/10 text-xs font-semibold h-9 px-3.5 cursor-pointer shrink-0"
                >
                  Re-evaluate & Approve
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>

      {/* Reject Modal */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent className="max-w-md bg-ivory rounded-3xl p-6 border border-border">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-foreground">
              Decline Application for {application.applicantName}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Please enter the curator rationale. This explanation will be
              courteously formatted and dispatched via email to{" "}
              <strong>{application.applicantEmail}</strong> along with refund
              confirmation.
            </p>

            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Table harmony capacity restrictions, or commercial small talk conflict."
              className="w-full rounded-2xl border border-border bg-card p-3 text-xs outline-none focus:border-burgundy focus:ring-1 focus:ring-burgundy"
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRejectModalOpen(false)}
                className="rounded-full text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleReject}
                disabled={processing}
                className="rounded-full bg-destructive text-ivory hover:bg-destructive/90 text-xs font-semibold"
              >
                {processing && <Loader2 className="size-3 animate-spin mr-1" />}
                Confirm Rejection & Dispatch Email
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Send Login Credentials Confirmation Modal */}
      <Dialog open={credentialsModalOpen} onOpenChange={setCredentialsModalOpen}>
        <DialogContent className="max-w-md bg-ivory rounded-3xl p-6 border border-border">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <div className="size-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
                <KeyRound className="size-4" />
              </div>
              <DialogTitle className="font-display text-xl text-foreground">
                Send Login Credentials
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <p className="text-xs text-muted-foreground leading-relaxed">
              This will automatically generate a cryptographically strong 16-character password and dispatch a secure access notification to the member's registered email via Resend.
            </p>

            <div className="rounded-2xl bg-card border border-border p-4 space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-mono uppercase text-[10px] text-muted-foreground">Recipient Email</span>
                <span className="font-semibold text-foreground font-mono">{application.applicantEmail}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-mono uppercase text-[10px] text-muted-foreground">Member Name</span>
                <span className="font-medium text-foreground">{application.applicantName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-mono uppercase text-[10px] text-muted-foreground">Password Policy</span>
                <span className="text-[11px] text-forest font-semibold">16-char High Entropy (A-Z, a-z, 0-9, #$@!)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-mono uppercase text-[10px] text-muted-foreground">Sign-In Destination</span>
                <span className="text-[11px] font-mono text-burgundy font-semibold">/login</span>
              </div>
            </div>

            <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-[11px] text-amber-800 flex items-start gap-2">
              <AlertTriangle className="size-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                The email includes a prominent <strong>"Sign In to Your Member Portal"</strong> button and explicit security instruction: <em>"Please do not share these credentials with anyone. For your security, you can change your password after logging in."</em>
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCredentialsModalOpen(false)}
                className="rounded-full text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSendCredentials}
                disabled={sendingCredentials}
                className="rounded-full bg-purple-700 text-ivory hover:bg-purple-800 text-xs font-semibold px-4 cursor-pointer"
              >
                {sendingCredentials ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin mr-1" />
                    Generating & Sending...
                  </>
                ) : (
                  <>
                    <Send className="size-3.5 mr-1" />
                    Confirm & Send Login Credentials
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
