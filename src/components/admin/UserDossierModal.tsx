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
  Check,
  RefreshCw,
  FileUp,
  RotateCcw,
  Camera,
  Instagram,
  Linkedin,
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
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Aadhaar Verification Action States
  const [processingAadhaar, setProcessingAadhaar] = useState(false);
  const [aadhaarDecisionModalOpen, setAadhaarDecisionModalOpen] = useState(false);
  const [aadhaarDecisionTab, setAadhaarDecisionTab] = useState<"reupload" | "reject">("reupload");
  const [reuploadSubject, setReuploadSubject] = useState(
    "Action Required: Please Re-verify Your Aadhaar Document | Precious Meets"
  );
  const [reuploadFeedback, setReuploadFeedback] = useState(
    "The uploaded Aadhaar document was unclear or details could not be matched. Please upload a clear photo or DigiLocker e-Aadhaar PDF."
  );
  const [refundReason, setRefundReason] = useState(
    "Aadhaar document verification was declined. A 100% refund of ₹1,999 has been initiated to your original payment method."
  );

  const handleApproveAadhaar = async () => {
    setProcessingAadhaar(true);
    try {
      const res = await ApplicationsService.approveAadhaar(application.id);
      toast.success("Aadhaar verified successfully!", {
        description: "Member identity confirmed. You may now dispatch login credentials.",
      });
      onApplicationUpdated(res.application);
    } catch (e: any) {
      toast.error(e.message || "Failed to approve Aadhaar.");
    } finally {
      setProcessingAadhaar(false);
    }
  };

  const handleSendAadhaarReuploadRequest = async () => {
    setProcessingAadhaar(true);
    try {
      const res = await ApplicationsService.requestAadhaarReupload(
        application.id,
        reuploadSubject,
        reuploadFeedback,
      );
      toast.success(`Re-verification request dispatched to ${application.applicantEmail}!`, {
        description: "Email contains a one-click button directing user to the re-upload portal.",
      });
      onApplicationUpdated(res.application);
      setAadhaarDecisionModalOpen(false);
    } catch (e: any) {
      toast.error(e.message || "Failed to dispatch re-verification email.");
    } finally {
      setProcessingAadhaar(false);
    }
  };

  const handleRejectWithRefund = async () => {
    setProcessingAadhaar(true);
    try {
      const res = await ApplicationsService.rejectWithRefund(
        application.id,
        refundReason,
      );
      toast.info(`Application ${application.applicationReference} declined with refund guarantee.`, {
        description: `Notice email dispatched. ₹1,999 refund registered to process under 7 days.`,
      });
      onApplicationUpdated(res.application);
      setAadhaarDecisionModalOpen(false);
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e.message || "Failed to decline and process refund.");
    } finally {
      setProcessingAadhaar(false);
    }
  };

  const handleSendCredentials = async () => {
    setSendingCredentials(true);
    try {
      const res = await ApplicationsService.sendMemberCredentials(application.id);
      toast.success(
        `Login credentials dispatched to ${application.applicantEmail}!`,
        {
          description: `Strong 16-character auto-generated password generated and sent via secure email.`,
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

  const handleReassignCredentials = async () => {
    setSendingCredentials(true);
    try {
      const res = await ApplicationsService.reassignMemberCredentials(application.id);
      toast.success(
        `New credentials reassigned and emailed to ${application.applicantEmail}!`,
        {
          description: `Previous credentials invalidated. A brand new 16-character password has been generated and dispatched.`,
        },
      );
      onApplicationUpdated(res.application);
      setReassignModalOpen(false);
    } catch (e: any) {
      toast.error(e.message || "Failed to reassign credentials.");
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
          description: `Member inducted successfully. Send login credentials when ready.`,
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
                  application.userPhotoUrl ||
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
                  {application.applicantInstagram ? (
                    <a
                      href={
                        application.applicantInstagram.startsWith("http")
                          ? application.applicantInstagram
                          : application.applicantInstagram.startsWith("instagram.com")
                          ? `https://${application.applicantInstagram}`
                          : `https://instagram.com/${application.applicantInstagram.replace("@", "")}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-pink-700 bg-pink-500/15 border border-pink-500/30 font-semibold hover:underline px-2.5 py-0.5 rounded-full"
                    >
                      <Instagram className="size-3 text-pink-600" />
                      <span>{application.applicantInstagram.startsWith("@") ? application.applicantInstagram : `@${application.applicantInstagram.replace(/.*instagram\.com\//, "")}`}</span>
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-muted-foreground/80 bg-muted/60 border border-border px-2 py-0.5 rounded-full text-[11px]">
                      <Instagram className="size-3 text-muted-foreground/60" />
                      <span>No Instagram</span>
                    </span>
                  )}
                  {application.applicantLinkedin && (
                    <a
                      href={
                        application.applicantLinkedin.startsWith("http")
                          ? application.applicantLinkedin
                          : `https://${application.applicantLinkedin.replace(/^https?:\/\//, "")}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-blue-700 bg-blue-500/15 border border-blue-500/30 font-semibold hover:underline px-2.5 py-0.5 rounded-full"
                    >
                      <Linkedin className="size-3 text-blue-600" />
                      <span>LinkedIn Profile</span>
                    </a>
                  )}
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

              {/* Applicant Profiles & Social Verification */}
              <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
                    <Sparkles className="size-3.5 text-burgundy" />
                    <span>Social Identity & Profiles</span>
                  </h4>
                  <span className="text-[10px] font-mono text-forest bg-forest/10 border border-forest/20 px-2 py-0.5 rounded-full font-semibold">
                    Submitted with Application
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Instagram */}
                  <div className="flex items-center justify-between rounded-xl bg-pink-500/5 border border-pink-500/20 p-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="size-8 rounded-lg bg-pink-500/10 flex items-center justify-center shrink-0 text-pink-600">
                        <Instagram className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                          Instagram Handle (Mandatory)
                        </div>
                        <div className="text-xs font-semibold text-foreground truncate">
                          {application.applicantInstagram || "Not provided"}
                        </div>
                      </div>
                    </div>
                    {application.applicantInstagram ? (
                      <a
                        href={
                          application.applicantInstagram.startsWith("http")
                            ? application.applicantInstagram
                            : application.applicantInstagram.startsWith("instagram.com")
                            ? `https://${application.applicantInstagram}`
                            : `https://instagram.com/${application.applicantInstagram.replace("@", "")}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-pink-700 hover:underline shrink-0 ml-2"
                      >
                        Open <ExternalLink className="size-3" />
                      </a>
                    ) : (
                      <span className="text-[10px] text-muted-foreground font-mono">Missing</span>
                    )}
                  </div>

                  {/* LinkedIn */}
                  <div className="flex items-center justify-between rounded-xl bg-blue-500/5 border border-blue-500/20 p-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="size-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 text-blue-600">
                        <Linkedin className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                          LinkedIn Profile (Optional)
                        </div>
                        <div className="text-xs font-semibold text-foreground truncate">
                          {application.applicantLinkedin || "Not provided"}
                        </div>
                      </div>
                    </div>
                    {application.applicantLinkedin ? (
                      <a
                        href={
                          application.applicantLinkedin.startsWith("http")
                            ? application.applicantLinkedin
                            : `https://${application.applicantLinkedin.replace(/^https?:\/\//, "")}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 hover:underline shrink-0 ml-2"
                      >
                        Open <ExternalLink className="size-3" />
                      </a>
                    ) : (
                      <span className="text-[10px] text-muted-foreground font-mono">None</span>
                    )}
                  </div>
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
                      Full 365-day private circle membership
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
                      Application Reference
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
                        : application.identityStatus === "reuploaded"
                        ? "bg-blue-500/15 text-blue-700 border border-blue-500/30 animate-pulse"
                        : application.identityStatus === "reupload_requested"
                        ? "bg-amber-500/15 text-amber-700 border border-amber-500/30"
                        : application.identityStatus === "rejected"
                        ? "bg-destructive/15 text-destructive border border-destructive/30"
                        : "bg-amber-500/15 text-amber-700 border border-amber-500/30"
                    }`}
                  >
                    {application.identityStatus === "verified"
                      ? "✓ Verified"
                      : application.identityStatus === "reuploaded"
                      ? "★ Re-uploaded (Pending Review)"
                      : application.identityStatus === "reupload_requested"
                      ? "⚠ Re-upload Requested"
                      : application.identityStatus === "rejected"
                      ? "✕ Rejected"
                      : application.identityStatus}
                  </span>
                </div>

                {/* Re-uploaded notification banner */}
                {application.identityStatus === "reuploaded" && (
                  <div className="rounded-xl bg-blue-500/10 border border-blue-500/30 p-4 text-xs text-blue-900 flex items-start gap-3">
                    <RefreshCw className="size-5 text-blue-600 shrink-0 mt-0.5 animate-spin" />
                    <div className="space-y-1">
                      <div className="font-semibold text-blue-800">
                        Member Re-uploaded Aadhaar Document
                      </div>
                      <p className="text-[11px] text-blue-900/80 leading-relaxed">
                        The applicant submitted a revised document on{" "}
                        {application.aadhaarReuploadedAt
                          ? new Date(application.aadhaarReuploadedAt).toLocaleString()
                          : "recently"}
                        . Please inspect the updated document below and approve or reject.
                      </p>
                    </div>
                  </div>
                )}

                {/* Re-upload requested banner */}
                {application.identityStatus === "reupload_requested" && (
                  <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-4 text-xs text-amber-900 flex items-start gap-3">
                    <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <div className="font-semibold text-amber-800">
                        Re-upload Request Pending Member Action
                      </div>
                      <p className="text-[11px] text-amber-900/80 leading-relaxed">
                        A re-verification email has been dispatched to {application.applicantEmail}.
                        {application.aadhaarRejectionFeedback && (
                          <span className="block mt-1 font-mono text-[10px] bg-card/60 p-2 rounded border border-amber-500/20">
                            Reason: &ldquo;{application.aadhaarRejectionFeedback}&rdquo;
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                )}

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

                  {/* Social Profile Audit */}
                  <div className="rounded-xl bg-ivory p-3 border border-border sm:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="font-mono text-[10px] uppercase text-muted-foreground block">
                        Applicant Social Identity (Cross-check with Photo)
                      </span>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {application.applicantInstagram ? (
                          <a
                            href={
                              application.applicantInstagram.startsWith("http")
                                ? application.applicantInstagram
                                : application.applicantInstagram.startsWith("instagram.com")
                                ? `https://${application.applicantInstagram}`
                                : `https://instagram.com/${application.applicantInstagram.replace("@", "")}`
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-pink-700 bg-pink-500/15 border border-pink-500/30 text-xs font-semibold hover:underline px-2.5 py-1 rounded-lg"
                          >
                            <Instagram className="size-3.5 text-pink-600" />
                            <span>{application.applicantInstagram.startsWith("@") ? application.applicantInstagram : `@${application.applicantInstagram.replace(/.*instagram\.com\//, "")}`}</span>
                            <ExternalLink className="size-3" />
                          </a>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">No Instagram provided</span>
                        )}

                        {application.applicantLinkedin && (
                          <a
                            href={
                              application.applicantLinkedin.startsWith("http")
                                ? application.applicantLinkedin
                                : `https://${application.applicantLinkedin.replace(/^https?:\/\//, "")}`
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-blue-700 bg-blue-500/15 border border-blue-500/30 text-xs font-semibold hover:underline px-2.5 py-1 rounded-lg"
                          >
                            <Linkedin className="size-3.5 text-blue-600" />
                            <span>LinkedIn Profile</span>
                            <ExternalLink className="size-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Side-by-Side Face Match & Identity Verification Audit */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                        <ShieldCheck className="size-4 text-forest" />
                        <span>Identity Verification & Face-Match Review</span>
                      </h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Compare the facial features and identity on the Aadhaar document against the member&apos;s uploaded personal photo.
                      </p>
                    </div>
                    <span className="rounded-full bg-forest/15 border border-forest/30 px-2.5 py-0.5 text-[10px] font-mono font-bold text-forest uppercase">
                      Dual Proof Audit
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Card 1: Aadhaar Document */}
                    {(() => {
                      const effectiveAadhaar =
                        application.aadhaarFileUrl ||
                        (application.identityProvider === "aadhaar_card_upload" || application.aadhaarFileName
                          ? getSampleAadhaarSvg(application.applicantName, application.applicationReference)
                          : null);

                      return (
                        <div className="rounded-2xl bg-ivory p-4 border border-burgundy/30 space-y-3 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between pb-2 border-b border-border/60">
                              <div className="flex items-center gap-1.5 font-semibold text-burgundy text-xs">
                                <FileText className="size-4" />
                                <span className="truncate max-w-[170px] sm:max-w-[220px]">
                                  Aadhaar Card ({application.aadhaarFileName || "UIDAI Document"})
                                </span>
                              </div>
                              {effectiveAadhaar && (
                                <a
                                  href={effectiveAadhaar}
                                  download={application.aadhaarFileName || "aadhaar_card"}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-burgundy hover:underline cursor-pointer shrink-0"
                                >
                                  <ExternalLink className="size-3" /> View Full
                                </a>
                              )}
                            </div>

                            <div className="mt-3 flex justify-center bg-card rounded-xl p-2 border border-border min-h-[220px] items-center overflow-hidden">
                              {effectiveAadhaar ? (
                                !effectiveAadhaar.startsWith("data:application/pdf") && !effectiveAadhaar.toLowerCase().includes(".pdf") ? (
                                  <img
                                    src={effectiveAadhaar}
                                    alt="Aadhaar Card"
                                    className="max-h-56 w-auto object-contain rounded-lg shadow-xs"
                                  />
                                ) : (
                                  <iframe
                                    src={effectiveAadhaar}
                                    title="Aadhaar PDF"
                                    className="w-full h-56 rounded border border-border"
                                  />
                                )
                              ) : (
                                <div className="text-center p-4 text-xs text-muted-foreground">
                                  <FileText className="size-8 mx-auto text-muted-foreground/40 mb-1" />
                                  <span>No Aadhaar document uploaded</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                            <span>Proof 1: Government ID</span>
                            <span className="text-forest font-semibold">
                              {effectiveAadhaar ? "✓ Document Attached" : "Pending"}
                            </span>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Card 2: Applicant's Own Photo */}
                    {(() => {
                      const effectivePhoto = application.userPhotoUrl || application.avatarUrl;

                      return (
                        <div className="rounded-2xl bg-ivory p-4 border border-forest/30 space-y-3 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between pb-2 border-b border-border/60">
                              <div className="flex items-center gap-1.5 font-semibold text-forest text-xs">
                                <Camera className="size-4" />
                                <span className="truncate max-w-[170px] sm:max-w-[220px]">
                                  Personal Photo ({application.userPhotoFileName || "Applicant Portrait"})
                                </span>
                              </div>
                              {effectivePhoto && (
                                <a
                                  href={effectivePhoto}
                                  download={application.userPhotoFileName || "applicant_photo.jpg"}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-forest hover:underline cursor-pointer shrink-0"
                                >
                                  <ExternalLink className="size-3" /> View Full
                                </a>
                              )}
                            </div>

                            <div className="mt-3 flex justify-center bg-card rounded-xl p-2 border border-border min-h-[220px] items-center overflow-hidden">
                              {effectivePhoto ? (
                                <img
                                  src={effectivePhoto}
                                  alt="Applicant Personal Photo"
                                  className="max-h-56 w-auto object-contain rounded-lg shadow-xs"
                                />
                              ) : (
                                <div className="text-center p-4 text-xs text-muted-foreground">
                                  <Camera className="size-8 mx-auto text-muted-foreground/40 mb-1" />
                                  <span>No personal photo uploaded yet</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                            <span>Proof 2: Live Member Portrait</span>
                            <span className="text-forest font-semibold">
                              {effectivePhoto ? "✓ Photo Verified" : "Pending"}
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Aadhaar Verification Decision Action Bar */}
                <div className="rounded-xl bg-ivory p-4 border border-border flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <h4 className="font-semibold text-xs text-foreground">
                      Aadhaar Document Decision
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      {application.identityStatus === "verified"
                        ? "Aadhaar verified. You may now dispatch login credentials to this member."
                        : "Verify the uploaded Aadhaar document before credentials can be issued."}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setAadhaarDecisionTab("reupload");
                        setAadhaarDecisionModalOpen(true);
                      }}
                      disabled={processingAadhaar}
                      className="rounded-full border-amber-600/40 text-amber-700 hover:bg-amber-50 text-xs font-semibold px-3.5 h-8.5 cursor-pointer"
                    >
                      <AlertTriangle className="size-3.5 mr-1 text-amber-600" />
                      Reject / Re-verify
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      onClick={handleApproveAadhaar}
                      disabled={processingAadhaar || application.identityStatus === "verified"}
                      className={`rounded-full text-xs font-semibold px-4 h-8.5 shadow-xs ${
                        application.identityStatus === "verified"
                          ? "bg-forest/15 text-forest border border-forest/30 cursor-default"
                          : "bg-forest hover:bg-forest/90 text-ivory cursor-pointer"
                      }`}
                    >
                      {processingAadhaar ? (
                        <Loader2 className="size-3.5 animate-spin mr-1" />
                      ) : (
                        <Check className="size-3.5 mr-1" />
                      )}
                      {application.identityStatus === "verified" ? "Aadhaar Verified ✓" : "Approve Aadhaar"}
                    </Button>
                  </div>
                </div>

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
            <div className="space-y-4">
              {/* Member Login Credentials Card - Exactly matching image 4 */}
              <div className="rounded-2xl bg-purple-500/5 p-5 border border-purple-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <KeyRound className="size-4 text-purple-700" />
                    <span className="font-semibold text-foreground text-xs sm:text-sm">
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
                  Auto-generated strong passwords follow 16+ characters with uppercase, lowercase, numbers, and symbols. The login link directs to <code className="bg-muted px-1 py-0.5 rounded">/login</code> with instructions not to share credentials.
                </p>

                <div className="rounded-xl bg-card p-3.5 border border-border space-y-2 text-xs">
                  <div className="flex justify-between font-mono text-[11px]">
                    <span className="text-muted-foreground">Sign-In Email:</span>
                    <span className="font-semibold text-foreground font-mono">{application.applicantEmail}</span>
                  </div>
                  {application.autoGeneratedPassword && (
                    <div className="flex items-center justify-between font-mono text-[11px] pt-1.5 border-t border-border/60">
                      <span className="text-muted-foreground">Auto-Generated Password:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-burgundy bg-burgundy/10 px-2 py-0.5 rounded font-mono">
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
                    <div className="flex justify-between font-mono text-[10px] text-muted-foreground pt-1.5 border-t border-border/40">
                      <span>Dispatched At:</span>
                      <span>{new Date(application.credentialsSentAt).toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {/* If credentials already sent, allow admin to Reassign new credentials. Otherwise allow initial send. Gated on Aadhaar verification. */}
                {application.credentialsSent ? (
                  <Button
                    size="sm"
                    onClick={() => {
                      if (isApproved && application.identityStatus === "verified") {
                        setReassignModalOpen(true);
                      }
                    }}
                    disabled={
                      sendingCredentials ||
                      !isApproved ||
                      application.identityStatus !== "verified"
                    }
                    className={`w-full rounded-xl text-xs font-semibold py-2.5 shadow-xs flex items-center justify-center gap-2 ${
                      !isApproved || application.identityStatus !== "verified"
                        ? "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
                        : "bg-burgundy hover:bg-burgundy/90 text-ivory cursor-pointer"
                    }`}
                  >
                    <RotateCcw className="size-3.5" />
                    <span>Reassign & Dispatch New Credentials</span>
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => {
                      if (isApproved && application.identityStatus === "verified") {
                        setCredentialsModalOpen(true);
                      }
                    }}
                    disabled={
                      sendingCredentials ||
                      !isApproved ||
                      application.identityStatus !== "verified"
                    }
                    className={`w-full rounded-xl text-xs font-semibold py-2.5 shadow-xs flex items-center justify-center gap-2 ${
                      !isApproved || application.identityStatus !== "verified"
                        ? "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
                        : "bg-purple-700 hover:bg-purple-800 text-ivory cursor-pointer"
                    }`}
                  >
                    <KeyRound className="size-3.5" />
                    <span>
                      {!isApproved
                        ? "Approve application first to send credentials"
                        : application.identityStatus !== "verified"
                        ? "Verify Aadhaar first to enable credentials dispatch"
                        : "Send Login Credentials"}
                    </span>
                  </Button>
                )}
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
            {/* Direct Send / Reassign Credentials Button:
                - Not clickable until admin approves application AND Aadhaar is verified
                - If not yet sent: allows initial send
                - If already sent: allows reassigning brand new credentials */}
            {application.credentialsSent ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (isApproved && application.identityStatus === "verified") {
                    setReassignModalOpen(true);
                  }
                }}
                disabled={
                  sendingCredentials ||
                  !isApproved ||
                  application.identityStatus !== "verified"
                }
                title={
                  !isApproved
                    ? "Approve application first to enable reassigning credentials"
                    : application.identityStatus !== "verified"
                    ? "Aadhaar document must be verified before reassigning credentials"
                    : "Reassign brand new credentials and dispatch email to member"
                }
                className={`rounded-full text-xs font-semibold px-3.5 py-1.5 h-9 flex items-center gap-1.5 shrink-0 transition-all ${
                  !isApproved || application.identityStatus !== "verified"
                    ? "border-border text-muted-foreground/60 bg-muted/20 opacity-50 cursor-not-allowed"
                    : "border-burgundy/40 text-burgundy hover:bg-burgundy/10 cursor-pointer"
                }`}
              >
                <RotateCcw className="size-3.5" />
                <span>Reassign Credentials</span>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (
                    isApproved &&
                    application.identityStatus === "verified"
                  ) {
                    setCredentialsModalOpen(true);
                  }
                }}
                disabled={
                  sendingCredentials ||
                  !isApproved ||
                  application.identityStatus !== "verified"
                }
                title={
                  !isApproved
                    ? "Approve application first to enable sending credentials"
                    : application.identityStatus !== "verified"
                    ? "Aadhaar document must be verified before dispatching credentials"
                    : "Send Login Credentials"
                }
                className={`rounded-full text-xs font-semibold px-3.5 py-1.5 h-9 flex items-center gap-1.5 shrink-0 transition-all ${
                  !isApproved || application.identityStatus !== "verified"
                    ? "border-border text-muted-foreground/60 bg-muted/20 opacity-50 cursor-not-allowed"
                    : "border-purple-600/40 text-purple-700 hover:bg-purple-50 cursor-pointer"
                }`}
              >
                <KeyRound className="size-3.5" />
                <span>
                  {application.identityStatus !== "verified"
                    ? "Aadhaar Unverified"
                    : "Send Login Credentials"}
                </span>
              </Button>
            )}

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
                  <span>Approve Application</span>
                </Button>
              </>
            ) : isApproved ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-forest font-semibold flex items-center gap-1 py-1 px-2.5 rounded-full bg-forest/10 border border-forest/20">
                  <CheckCircle2 className="size-3.5" /> Member Inducted
                </span>
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
              This will automatically generate a cryptographically strong 16-character password and dispatch a secure access notification to the member's registered email.
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

      {/* Reassign Credentials Confirmation Modal */}
      <Dialog open={reassignModalOpen} onOpenChange={setReassignModalOpen}>
        <DialogContent className="max-w-lg bg-ivory rounded-3xl p-6 border border-border">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <div className="size-8 rounded-full bg-burgundy/10 text-burgundy flex items-center justify-center">
                <RotateCcw className="size-4" />
              </div>
              <DialogTitle className="font-display text-xl text-foreground">
                Reassign Member Credentials
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <p className="text-xs text-muted-foreground leading-relaxed">
              This will <strong>immediately revoke the member&apos;s current password</strong>, generate a brand new cryptographically strong 16-character password, update Supabase records, and dispatch a replacement credentials email to <strong>{application.applicantEmail}</strong>.
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
                <span className="font-mono uppercase text-[10px] text-muted-foreground">Previous Password</span>
                <span className="text-[11px] font-mono text-destructive line-through">
                  {application.autoGeneratedPassword ? application.autoGeneratedPassword.slice(0, 4) + "••••••••" : "••••••••••••"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-mono uppercase text-[10px] text-muted-foreground">Security Action</span>
                <span className="text-[11px] text-forest font-semibold">Immediate Old Token Revocation + New 16-char Password</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-mono uppercase text-[10px] text-muted-foreground">Sign-In Destination</span>
                <span className="text-[11px] font-mono text-burgundy font-semibold">/login</span>
              </div>
            </div>

            <div className="rounded-xl bg-burgundy/10 border border-burgundy/20 p-3 text-[11px] text-burgundy flex items-start gap-2">
              <AlertTriangle className="size-4 text-burgundy shrink-0 mt-0.5" />
              <span>
                <strong>Warning:</strong> Any active session with previous credentials will be invalidated. The member must sign in using the new replacement password sent to their inbox.
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setReassignModalOpen(false)}
                className="rounded-full text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleReassignCredentials}
                disabled={sendingCredentials}
                className="rounded-full bg-burgundy text-ivory hover:bg-burgundy/90 text-xs font-semibold px-4 cursor-pointer"
              >
                {sendingCredentials ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin mr-1" />
                    Reassigning & Dispatching...
                  </>
                ) : (
                  <>
                    <RotateCcw className="size-3.5 mr-1" />
                    Confirm & Reassign New Credentials
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Aadhaar Decision Modal: Re-verify or Direct Rejection with Refund */}
      <Dialog open={aadhaarDecisionModalOpen} onOpenChange={setAadhaarDecisionModalOpen}>
        <DialogContent className="max-w-lg bg-ivory rounded-3xl p-6 border border-border">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <div className="size-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                <AlertTriangle className="size-4" />
              </div>
              <DialogTitle className="font-display text-xl text-foreground">
                Aadhaar Review: {application.applicantName}
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {/* Tabs */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-card border border-border text-xs">
              <button
                type="button"
                onClick={() => setAadhaarDecisionTab("reupload")}
                className={`py-2 px-3 rounded-lg font-semibold transition-all cursor-pointer ${
                  aadhaarDecisionTab === "reupload"
                    ? "bg-amber-600 text-ivory shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Request Re-upload
              </button>
              <button
                type="button"
                onClick={() => setAadhaarDecisionTab("reject")}
                className={`py-2 px-3 rounded-lg font-semibold transition-all cursor-pointer ${
                  aadhaarDecisionTab === "reject"
                    ? "bg-destructive text-ivory shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Reject & Refund
              </button>
            </div>

            {aadhaarDecisionTab === "reupload" ? (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Send an email to <strong>{application.applicantEmail}</strong> requesting them to re-upload their Aadhaar. The email includes a secure link to the minimal re-verification upload portal.
                </p>

                <div className="space-y-1">
                  <label className="font-mono text-[10px] uppercase text-muted-foreground">
                    Email Subject
                  </label>
                  <input
                    type="text"
                    value={reuploadSubject}
                    onChange={(e) => setReuploadSubject(e.target.value)}
                    className="w-full rounded-xl border border-border bg-card p-2.5 text-xs outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[10px] uppercase text-muted-foreground">
                    Feedback / Instructions for Member
                  </label>
                  <textarea
                    rows={3}
                    value={reuploadFeedback}
                    onChange={(e) => setReuploadFeedback(e.target.value)}
                    placeholder="e.g. The photo was blurry or edges were cropped. Please upload a clear photo or e-Aadhaar PDF."
                    className="w-full rounded-xl border border-border bg-card p-2.5 text-xs outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                  />
                </div>

                <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-[11px] text-amber-800 space-y-1">
                  <div className="font-semibold flex items-center gap-1.5">
                    <Mail className="size-3.5" />
                    <span>Dispatched via safety@preciousmeets.com</span>
                  </div>
                  <p>
                    Includes a button: <strong>&ldquo;Re-verify Aadhaar / Re-upload Document&rdquo;</strong> directing to the minimal document re-upload page.
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAadhaarDecisionModalOpen(false)}
                    className="rounded-full text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSendAadhaarReuploadRequest}
                    disabled={processingAadhaar}
                    className="rounded-full bg-amber-600 text-ivory hover:bg-amber-700 text-xs font-semibold px-4 cursor-pointer"
                  >
                    {processingAadhaar ? (
                      <Loader2 className="size-3.5 animate-spin mr-1" />
                    ) : (
                      <Send className="size-3.5 mr-1" />
                    )}
                    Send Re-upload Email
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-[11px] text-destructive leading-relaxed">
                  <strong>Permanent Rejection & Refund Notice:</strong> This will reject the application and register an automatic 100% refund of ₹1,999 to the member's original payment method, processed within 5-7 business days.
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[10px] uppercase text-muted-foreground">
                    Reason for Rejection & Refund
                  </label>
                  <textarea
                    rows={3}
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    placeholder="e.g. Identity document could not be validated after review."
                    className="w-full rounded-xl border border-border bg-card p-2.5 text-xs outline-none focus:border-destructive focus:ring-1 focus:ring-destructive"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAadhaarDecisionModalOpen(false)}
                    className="rounded-full text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleRejectWithRefund}
                    disabled={processingAadhaar}
                    className="rounded-full bg-destructive text-ivory hover:bg-destructive/90 text-xs font-semibold px-4 cursor-pointer"
                  >
                    {processingAadhaar ? (
                      <Loader2 className="size-3.5 animate-spin mr-1" />
                    ) : (
                      <XCircle className="size-3.5 mr-1" />
                    )}
                    Confirm Rejection & Process Refund
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
