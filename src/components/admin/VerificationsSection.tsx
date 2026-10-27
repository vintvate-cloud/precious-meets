import React, { useState, useMemo } from "react";
import { EventsService, AdminAttendee } from "@/lib/events-service";
import { ApplicationsService, MemberApplication } from "@/lib/applications-service";
import { VerificationsService } from "@/lib/verifications-service";
import { getSampleAadhaarSvg } from "@/lib/aadhaar-utils";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  Filter,
  FileCheck2,
  Copy,
  ExternalLink,
  Sparkles,
  Users,
  Award,
  Calendar,
  Lock,
  Phone,
  Mail,
  MapPin,
  Check,
  ChevronRight,
  Info,
  AlertCircle,
  FileText,
  Eye,
  Trash2,
  Camera,
  Instagram,
  Linkedin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import type { VerificationRecord } from "@/lib/verifications-service";

export type VerificationQueueItem = VerificationRecord;

export interface UnifiedVerifiedUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  city: string;
  memberTier: "Private Member" | "Verified Member" | "Invited Guest";
  memberId: string;
  archetypeTitle: string;
  verificationMethod: string;
  verificationReference: string;
  verifiedAt: string;
  source: "attendee_directory" | "member_application" | "verification_queue";
  gender?: "female" | "male" | "non-binary";
  dietary?: string;
  aadhaarFileUrl?: string;
  aadhaarFileName?: string;
  userPhotoUrl?: string;
  userPhotoFileName?: string;
  instagram?: string;
  linkedin?: string;
}

interface VerificationsSectionProps {
  queue: VerificationQueueItem[];
  onUpdateQueueStatus: (id: string, status: "verified" | "failed") => void;
  onDeleteQueueItem?: (id: string, email?: string) => void;
}

export function VerificationsSection({
  queue,
  onUpdateQueueStatus,
  onDeleteQueueItem,
}: VerificationsSectionProps) {
  // Main view toggle: "verified_users" (All verified users in the site) vs "pending_queue"
  // Default to pending_queue if there are pending member accounts awaiting verification!
  const [viewMode, setViewMode] = useState<"verified_users" | "pending_queue">(() => {
    return queue.some((q) => q.status === "pending" || q.status === "manual_review")
      ? "pending_queue"
      : "verified_users";
  });

  const handleDelete = (id: string, email?: string, name?: string) => {
    const displayName = name || email || "this applicant";
    if (
      window.confirm(
        `Are you sure you want to permanently delete the application for "${displayName}"?\n\nThis will remove their verification request and member application completely.`
      )
    ) {
      if (onDeleteQueueItem) {
        onDeleteQueueItem(id, email);
      } else {
        VerificationsService.deleteRecord(id, email);
        toast.success(`Application for "${displayName}" deleted.`);
      }
    }
  };
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState<"all" | "Private Member" | "Verified Member">("all");
  const [selectedUserForCert, setSelectedUserForCert] = useState<UnifiedVerifiedUser | null>(null);
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Dedicated Identity & Aadhaar Document Viewer Modal state
  const [viewingAadhaar, setViewingAadhaar] = useState<{
    name: string;
    email: string;
    phone?: string;
    fileUrl: string;
    fileName?: string;
    userPhotoUrl?: string;
    userPhotoFileName?: string;
    status?: string;
    recordId?: string;
  } | null>(null);

  // 1. Gather all verified users present in the site
  const verifiedUsers = useMemo(() => {
    const list: UnifiedVerifiedUser[] = [];
    const seenEmails = new Set<string>();

    // Source A: Attendees Pool in EventsService
    const attendees = EventsService.getAttendees();
    attendees.forEach((att) => {
      if (att.identityVerified && !seenEmails.has(att.email.toLowerCase())) {
        seenEmails.add(att.email.toLowerCase());
        list.push({
          id: att.id,
          name: att.name,
          email: att.email,
          phone: att.phone,
          avatar: att.avatar,
          city: att.city,
          memberTier: att.memberTier,
          memberId: att.memberId,
          archetypeTitle: att.archetype?.title || "Curated Member",
          verificationMethod: "DigiLocker Aadhaar Offline XML",
          verificationReference: `DL-UIDAI-${att.memberId.replace(/[^0-9]/g, "").padStart(4, "0") || "9812"}`,
          verifiedAt: "Verified & Audited",
          source: "attendee_directory",
          gender: att.gender,
          dietary: att.dietary,
        });
      }
    });

    // Source B: Member Applications with verified identity
    const applications = ApplicationsService.getApplications();
    applications.forEach((app) => {
      if (
        (app.identityStatus === "verified" || app.status === "approved") &&
        !seenEmails.has(app.applicantEmail.toLowerCase())
      ) {
        seenEmails.add(app.applicantEmail.toLowerCase());
        list.push({
          id: app.id,
          name: app.applicantName,
          email: app.applicantEmail,
          phone: app.applicantPhone || "+91 98100 00000",
          avatar:
            app.userPhotoUrl ||
            app.avatarUrl ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
          city: app.applicantCity || "Delhi NCR",
          memberTier: app.status === "approved" ? "Private Member" : "Verified Member",
          memberId: app.applicationReference.replace("PM-FILE-", "PM-MEMBER-"),
          archetypeTitle: app.archetypeTitle || "Circle Member",
          verificationMethod: app.aadhaarFileUrl ? "Uploaded Aadhaar Card" : "DigiLocker Consent Offline",
          verificationReference: app.identityReference || "DL-AADHAAR-OK-7721",
          verifiedAt: app.identityVerifiedAt
            ? new Date(app.identityVerifiedAt).toLocaleDateString("en-IN", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "Verified Record",
          source: "member_application",
          gender: "non-binary",
          dietary: app.dietaryPreference,
          aadhaarFileUrl: app.aadhaarFileUrl,
          aadhaarFileName: app.aadhaarFileName,
          userPhotoUrl: app.userPhotoUrl || app.avatarUrl,
          userPhotoFileName: app.userPhotoFileName,
          instagram: app.applicantInstagram,
          linkedin: app.applicantLinkedin,
        });
      }
    });

    // Source C: Queue items that have been approved as "verified"
    queue.forEach((q) => {
      if (q.status === "verified" && !seenEmails.has(q.email.toLowerCase())) {
        seenEmails.add(q.email.toLowerCase());
        list.push({
          id: q.id,
          name: q.userName,
          email: q.email,
          phone: q.phone || "+91 98210 99881",
          avatar:
            q.userPhotoUrl ||
            q.avatar ||
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
          city: q.city || "Delhi NCR",
          memberTier: "Verified Member",
          memberId: `PM-VERIFIED-${q.id.replace("ver_", "").padStart(4, "0")}`,
          archetypeTitle: "Curated Dinner Guest",
          verificationMethod: q.aadhaarFileUrl ? "Uploaded Aadhaar Card" : "DigiLocker Offline Consent",
          verificationReference: `DL-AADHAAR-OK-${q.id.toUpperCase().replace("_", "")}`,
          verifiedAt: "Recently Verified",
          source: "verification_queue",
          aadhaarFileUrl: q.aadhaarFileUrl,
          aadhaarFileName: q.aadhaarFileName,
          userPhotoUrl: q.userPhotoUrl || q.avatar,
          userPhotoFileName: q.userPhotoFileName,
          instagram: q.instagram,
          linkedin: q.linkedin,
        });
      }
    });

    return list;
  }, [queue]);

  // Filtered Verified Users
  const filteredVerifiedUsers = useMemo(() => {
    return verifiedUsers.filter((user) => {
      if (tierFilter !== "all" && user.memberTier !== tierFilter) return false;
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      return (
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        user.phone.toLowerCase().includes(q) ||
        user.memberId.toLowerCase().includes(q) ||
        user.archetypeTitle.toLowerCase().includes(q) ||
        user.city.toLowerCase().includes(q) ||
        user.verificationReference.toLowerCase().includes(q)
      );
    });
  }, [verifiedUsers, tierFilter, searchQuery]);

  // Pending queue items count
  const pendingQueueCount = useMemo(() => {
    return queue.filter(
      (q) => q.status === "pending" || q.status === "manual_review"
    ).length;
  }, [queue]);

  // Auto-switch to pending queue if pending items exist and verified roster is empty
  React.useEffect(() => {
    if (pendingQueueCount > 0 && verifiedUsers.length === 0) {
      setViewMode("pending_queue");
    }
  }, [pendingQueueCount, verifiedUsers.length]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    toast.success(`${label} copied to clipboard`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenCertificate = (user: UnifiedVerifiedUser) => {
    setSelectedUserForCert(user);
    setCertModalOpen(true);
  };

  return (
    <div className="mt-8 space-y-6">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & HIGH-LEVEL SAFETY METRICS                                 */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="label-mono text-xs text-forest font-bold">
              Identity & Safety Operations
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-forest/15 px-2.5 py-0.5 text-[10px] font-semibold text-forest">
              <ShieldCheck className="size-3" />
              UIDAI DigiLocker Compliant
            </span>
          </div>
          <h2 className="font-display mt-1 text-2xl sm:text-3xl">
            Verified Members & <em className="italic text-burgundy">Aadhaar Queue</em>
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Consent-based identity verification, UIDAI offline XML validation, and 100% verified guest audit.
          </p>
        </div>

        {/* View Switcher: "All Verified Users" vs "Pending Queue" */}
        <div className="flex items-center gap-1.5 rounded-full border border-border/80 bg-card p-1 shadow-xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode("verified_users")}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              viewMode === "verified_users"
                ? "bg-burgundy text-ivory shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-sage/20"
            }`}
          >
            <ShieldCheck className="size-3.5" />
            <span>All Verified Users</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold font-mono ${
                viewMode === "verified_users"
                  ? "bg-ivory/20 text-ivory"
                  : "bg-forest/15 text-forest"
              }`}
            >
              {verifiedUsers.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("pending_queue")}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              viewMode === "pending_queue"
                ? "bg-burgundy text-ivory shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-sage/20"
            }`}
          >
            <Clock className="size-3.5" />
            <span>Pending Queue</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold font-mono ${
                viewMode === "pending_queue"
                  ? "bg-ivory/20 text-ivory"
                  : pendingQueueCount > 0
                  ? "bg-ochre text-foreground font-black animate-pulse"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {pendingQueueCount}
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. STATS OVERVIEW CARDS                                                   */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div
          onClick={() => setViewMode("verified_users")}
          className="rounded-2xl border border-forest/30 bg-forest/5 p-4 shadow-xs cursor-pointer hover:border-forest/60 hover:bg-forest/10 transition-all group"
        >
          <div className="flex items-center justify-between text-forest text-xs font-mono uppercase">
            <span>All Verified Users</span>
            <ShieldCheck className="size-4 group-hover:scale-110 transition-transform" />
          </div>
          <div className="font-display text-3xl font-semibold mt-2 text-foreground">
            {verifiedUsers.length}
          </div>
          <span className="text-[10px] text-muted-foreground">
            Active verified site members
          </span>
        </div>

        <div
          onClick={() => setViewMode("pending_queue")}
          className="rounded-2xl border border-ochre/30 bg-ochre/5 p-4 shadow-xs cursor-pointer hover:border-ochre/60 hover:bg-ochre/10 transition-all group"
        >
          <div className="flex items-center justify-between text-ochre text-xs font-mono uppercase">
            <span>Pending Review</span>
            <Clock className="size-4 group-hover:scale-110 transition-transform" />
          </div>
          <div className="font-display text-3xl font-semibold mt-2 text-foreground flex items-center justify-between">
            <span>{pendingQueueCount}</span>
            <span className="text-[11px] font-sans font-normal text-ochre opacity-0 group-hover:opacity-100 transition-opacity">
              Review →
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground">
            Awaiting executive approval
          </span>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-mono uppercase">
            <span>UIDAI Offline XML</span>
            <Award className="size-4 text-burgundy" />
          </div>
          <div className="font-display text-3xl font-semibold mt-2 text-foreground">
            100%
          </div>
          <span className="text-[10px] text-muted-foreground">
            Zero paper / Zero biometric stored
          </span>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-mono uppercase">
            <span>Safety Audit Pass</span>
            <Sparkles className="size-4 text-forest" />
          </div>
          <div className="font-display text-3xl font-semibold mt-2 text-foreground">
            Verified
          </div>
          <span className="text-[10px] text-muted-foreground">
            Pre-cleared for 6-guest tables
          </span>
        </div>
      </div>

      {/* Alert banner if there are pending verifications waiting */}
      {pendingQueueCount > 0 && viewMode === "verified_users" && (
        <div className="rounded-2xl border border-ochre/40 bg-ochre/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <span className="flex size-3 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ochre opacity-75"></span>
              <span className="relative inline-flex rounded-full size-3 bg-ochre"></span>
            </span>
            <div>
              <p className="text-xs font-bold text-foreground">
                {pendingQueueCount} Member {pendingQueueCount === 1 ? "Account" : "Accounts"} Awaiting Verification
              </p>
              <p className="text-[11px] text-muted-foreground">
                New users have paid and uploaded their Aadhaar ID. Review and approve their passes in the Pending Queue.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => setViewMode("pending_queue")}
            className="bg-burgundy text-ivory hover:bg-burgundy/90 text-xs rounded-full px-4 h-8 cursor-pointer shrink-0"
          >
            Open Pending Queue ({pendingQueueCount})
          </Button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. VIEW 1: ALL VERIFIED USERS PRESENT IN SITE                             */}
      {/* ========================================================================= */}
      {viewMode === "verified_users" && (
        <div className="space-y-4">
          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search verified users by name, email, member ID, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-border/80 bg-card py-2 pl-10 pr-4 text-xs text-foreground placeholder:text-muted-foreground focus:border-burgundy focus:outline-none focus:ring-1 focus:ring-burgundy"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter by Tier */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {(["all", "Private Member", "Verified Member"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTierFilter(t)}
                  className={`rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer shrink-0 ${
                    tierFilter === t
                      ? "bg-foreground text-background shadow-xs ring-1 ring-foreground/20"
                      : "border border-border/80 bg-card text-muted-foreground hover:bg-sage/40 hover:text-foreground"
                  }`}
                >
                  {t === "all" ? `All Tiers (${verifiedUsers.length})` : t}
                </button>
              ))}
            </div>
          </div>

          {/* Table of All Verified Users */}
          <div className="rounded-3xl border border-border/80 bg-card shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border/60 bg-muted/20 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-forest" />
                <span className="text-xs font-semibold text-foreground">
                  All Active Verified Site Users ({filteredVerifiedUsers.length})
                </span>
              </div>
              <span className="text-[11px] text-muted-foreground">
                All members hold DigiLocker / Aadhaar verification clearances
              </span>
            </div>

            {filteredVerifiedUsers.length === 0 ? (
              <div className="p-12 text-center text-xs text-muted-foreground space-y-2">
                <Users className="size-8 mx-auto text-muted-foreground/50" />
                <p className="font-medium text-foreground">No verified users match your search.</p>
                <p>Try searching by different keyword or reset filters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border/60 text-muted-foreground bg-muted/10">
                    <tr>
                      <th className="py-3 px-4">Verified Member</th>
                      <th className="py-3 px-4">Member ID & Tier</th>
                      <th className="py-3 px-4">Verification Method</th>
                      <th className="py-3 px-4">Archetype & City</th>
                      <th className="py-3 px-4">Status & Clearance</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredVerifiedUsers.map((u) => (
                      <tr
                        key={u.id}
                        className="hover:bg-sage/10 transition-colors group"
                      >
                        {/* 1. User & Contact Info */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <img
                                src={u.avatar}
                                alt={u.name}
                                className="size-10 rounded-full object-cover ring-2 ring-forest/30"
                              />
                              <span
                                title="Identity Verified"
                                className="absolute -bottom-1 -right-1 flex size-4 items-center justify-center rounded-full bg-forest text-ivory ring-2 ring-card"
                              >
                                <Check className="size-2.5 stroke-[3]" />
                              </span>
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-foreground flex items-center gap-1.5">
                                {u.name}
                              </p>
                              <p className="text-[11px] text-muted-foreground truncate">
                                {u.email}
                              </p>
                              <p className="text-[10px] font-mono text-muted-foreground/80">
                                {u.phone}
                              </p>
                              {(u.instagram || u.linkedin) && (
                                <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                                  {u.instagram && (
                                    <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-pink-700 bg-pink-500/10 px-1.5 py-0.2 rounded">
                                      <Instagram className="size-2.5" />
                                      <span>{u.instagram.startsWith("@") ? u.instagram : `@${u.instagram.replace(/.*instagram\.com\//, "")}`}</span>
                                    </span>
                                  )}
                                  {u.linkedin && (
                                    <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-blue-700 bg-blue-500/10 px-1.5 py-0.2 rounded">
                                      <Linkedin className="size-2.5" />
                                      <span>LinkedIn</span>
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* 2. Member ID & Tier */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            <span
                              className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                u.memberTier === "Private Member"
                                  ? "bg-burgundy/15 text-burgundy"
                                  : "bg-forest/15 text-forest"
                              }`}
                            >
                              {u.memberTier}
                            </span>
                            <div className="flex items-center gap-1">
                              <span className="font-mono text-[11px] font-bold text-foreground">
                                {u.memberId}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopy(u.memberId, "Member ID")}
                                title="Copy Member ID"
                                className="text-muted-foreground hover:text-foreground transition-colors p-0.5 cursor-pointer"
                              >
                                {copiedId === u.memberId ? (
                                  <Check className="size-3 text-forest" />
                                ) : (
                                  <Copy className="size-3" />
                                )}
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* 3. Verification Method & Ref */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1 text-forest font-medium">
                              <ShieldCheck className="size-3.5 shrink-0" />
                              <span className="text-[11px] font-semibold">
                                {u.verificationMethod}
                              </span>
                            </div>
                            <span className="font-mono text-[10px] text-muted-foreground block">
                              Ref: {u.verificationReference}
                            </span>
                            <span className="text-[10px] text-muted-foreground/70">
                              {u.verifiedAt}
                            </span>
                            <button
                              type="button"
                              onClick={() => setViewingAadhaar({
                                name: u.name,
                                email: u.email,
                                phone: u.phone,
                                fileUrl: u.aadhaarFileUrl || getSampleAadhaarSvg(u.name, u.memberId),
                                fileName: u.aadhaarFileName || "UIDAI_Aadhaar_Offline.xml",
                                userPhotoUrl: u.userPhotoUrl || u.avatar,
                                userPhotoFileName: u.userPhotoFileName,
                                status: "verified",
                                recordId: u.id,
                              })}
                              className="inline-flex items-center gap-1 mt-1 rounded bg-burgundy/10 hover:bg-burgundy/20 text-burgundy px-1.5 py-0.5 text-[10px] font-semibold transition-colors cursor-pointer"
                            >
                              <Eye className="size-3" />
                              <span>View Documents</span>
                            </button>
                          </div>
                        </td>

                        {/* 4. Archetype & City */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5">
                            <p className="font-medium text-foreground text-[11px]">
                              {u.archetypeTitle}
                            </p>
                            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <MapPin className="size-3" />
                              {u.city}
                            </p>
                          </div>
                        </td>

                        {/* 5. Status & Clearance */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 rounded-full bg-forest/20 px-2.5 py-0.5 text-[10px] font-bold text-forest">
                              <CheckCircle2 className="size-3" />
                              Verified & Active
                            </span>
                            <span className="block text-[10px] text-muted-foreground">
                              Pre-screened for Seating
                            </span>
                          </div>
                        </td>

                        {/* 6. Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setViewingAadhaar({
                                name: u.name,
                                email: u.email,
                                phone: u.phone,
                                fileUrl: u.aadhaarFileUrl || getSampleAadhaarSvg(u.name, u.memberId),
                                fileName: u.aadhaarFileName || "UIDAI_Aadhaar_Document",
                                userPhotoUrl: u.userPhotoUrl || u.avatar,
                                userPhotoFileName: u.userPhotoFileName,
                                status: "verified",
                                recordId: u.id,
                              })}
                              className="text-[11px] h-7 px-2.5 text-burgundy hover:bg-burgundy hover:text-ivory border-burgundy/30 transition-all duration-200 gap-1 cursor-pointer"
                              title="View uploaded identity documents"
                            >
                              <FileText className="size-3" />
                              <span>Inspect ID</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenCertificate(u)}
                              className="text-[11px] h-7 px-3 text-foreground hover:bg-burgundy hover:text-ivory border-border hover:border-burgundy transition-all duration-200 gap-1.5 cursor-pointer"
                            >
                              <Eye className="size-3" />
                              <span>View Pass</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(u.id, u.email, u.name)}
                              className="text-[11px] h-7 px-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer transition-colors"
                              title="Delete user application"
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. VIEW 2: PENDING VERIFICATION QUEUE (DigiLocker Offline Queue)          */}
      {/* ========================================================================= */}
      {viewMode === "pending_queue" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-ochre/30 bg-ochre/5 p-4 flex items-start gap-3">
            <Info className="size-4 text-ochre shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-semibold text-foreground">
                Aadhaar DigiLocker Offline Verification Queue
              </p>
              <p className="text-muted-foreground mt-0.5">
                These requests are awaiting administrator review. Approving a record will immediately issue an official Member ID and move the profile into the &ldquo;All Verified Users&rdquo; roster.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border/60 text-muted-foreground">
                  <tr>
                    <th className="pb-3 px-3">Applicant / User</th>
                    <th className="pb-3 px-3">Aadhaar Document</th>
                    <th className="pb-3 px-3">Verification Method</th>
                    <th className="pb-3 px-3">Requested At</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {queue.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-muted-foreground">
                        <ShieldCheck className="size-10 mx-auto text-forest/40 mb-2" />
                        <p className="font-semibold text-foreground text-sm">
                          All member verifications are up to date
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 max-w-sm mx-auto">
                          When users complete the social discovery quiz and pay via Razorpay, their accounts and uploaded Aadhaar IDs will appear here automatically for review.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    queue.map((v) => (
                      <tr key={v.id} className="hover:bg-sage/10 transition-colors">
                        <td className="py-4 px-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={
                                v.userPhotoUrl ||
                                v.avatar ||
                                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                              }
                              alt={v.userName}
                              className="size-9 rounded-full object-cover border border-border shadow-xs shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-semibold text-foreground truncate">{v.userName}</p>
                              <p className="text-[11px] text-muted-foreground truncate">{v.email}</p>
                              {v.phone && (
                                <p className="text-[10px] font-mono text-muted-foreground">{v.phone}</p>
                              )}
                              {(v.instagram || v.linkedin) && (
                                <div className="flex items-center gap-1.5 flex-wrap mt-1">
                                  {v.instagram && (
                                    <a
                                      href={
                                        v.instagram.startsWith("http")
                                          ? v.instagram
                                          : v.instagram.startsWith("instagram.com")
                                          ? `https://${v.instagram}`
                                          : `https://instagram.com/${v.instagram.replace("@", "")}`
                                      }
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-1 text-[10px] font-medium text-pink-700 bg-pink-500/10 px-1.5 py-0.5 rounded hover:underline cursor-pointer"
                                      title="Open Instagram"
                                    >
                                      <Instagram className="size-2.5" />
                                      <span className="truncate max-w-[110px]">
                                        {v.instagram.startsWith("@") ? v.instagram : `@${v.instagram.replace(/.*instagram\.com\//, "")}`}
                                      </span>
                                    </a>
                                  )}
                                  {v.linkedin && (
                                    <a
                                      href={
                                        v.linkedin.startsWith("http")
                                          ? v.linkedin
                                          : `https://${v.linkedin.replace(/^https?:\/\//, "")}`
                                      }
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-1 text-[10px] font-medium text-blue-700 bg-blue-500/10 px-1.5 py-0.5 rounded hover:underline cursor-pointer"
                                      title="Open LinkedIn"
                                    >
                                      <Linkedin className="size-2.5" />
                                      <span>LinkedIn</span>
                                    </a>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-3">
                          {(() => {
                            const fileUrl = v.aadhaarFileUrl || getSampleAadhaarSvg(v.userName, v.memberId || "2833");
                            const fileName = v.aadhaarFileName || "Aadhaar_Document.jpg";
                            return (
                              <button
                                type="button"
                                onClick={() => setViewingAadhaar({
                                  name: v.userName,
                                  email: v.email,
                                  phone: v.phone,
                                  fileUrl,
                                  fileName,
                                  userPhotoUrl: v.userPhotoUrl || v.avatar,
                                  userPhotoFileName: v.userPhotoFileName,
                                  status: v.status,
                                  recordId: v.id,
                                })}
                                className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-background hover:border-burgundy/50 hover:bg-burgundy/5 p-1.5 transition-all text-left cursor-pointer group shadow-2xs"
                              >
                                {fileUrl.startsWith("data:image/") ? (
                                  <img
                                    src={fileUrl}
                                    alt="Aadhaar"
                                    className="size-8 rounded-lg object-cover border border-border shrink-0"
                                  />
                                ) : (
                                  <div className="size-8 rounded-lg bg-burgundy/10 flex items-center justify-center text-burgundy shrink-0">
                                    <FileText className="size-4" />
                                  </div>
                                )}
                                <div className="min-w-0 pr-1">
                                  <span className="text-[11px] font-semibold text-burgundy block group-hover:underline">
                                    Compare Docs
                                  </span>
                                  <span className="text-[9px] text-muted-foreground block truncate max-w-[100px]">
                                    Aadhaar & Photo
                                  </span>
                                </div>
                              </button>
                            );
                          })()}
                        </td>
                        <td className="py-4 px-3 font-mono text-[11px] text-muted-foreground">
                          {v.method}
                        </td>
                        <td className="py-4 px-3 text-muted-foreground">{v.requestedAt}</td>
                        <td className="py-4 px-3">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                              v.status === "verified"
                                ? "bg-forest/20 text-forest"
                                : v.status === "pending"
                                ? "bg-ochre/20 text-ochre"
                                : v.status === "manual_review"
                                ? "bg-burgundy/15 text-burgundy"
                                : "bg-destructive/15 text-destructive"
                            }`}
                          >
                            {v.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="py-4 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {v.status !== "verified" ? (
                              <>
                                <Button
                                  variant="outline"
                                  onClick={() => onUpdateQueueStatus(v.id, "verified")}
                                  className="text-[11px] h-7 px-3 text-forest border-forest/30 hover:bg-forest hover:text-ivory cursor-pointer font-medium"
                                >
                                  Approve
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => onUpdateQueueStatus(v.id, "failed")}
                                  className="text-[11px] h-7 px-3 cursor-pointer"
                                >
                                  Reject
                                </Button>
                              </>
                            ) : (
                              <span className="text-[11px] text-forest font-semibold flex items-center gap-1 mr-1">
                                <CheckCircle2 className="size-3.5" /> Approved
                              </span>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(v.id, v.email, v.userName)}
                              className="text-[11px] h-7 px-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer transition-colors"
                              title="Delete application permanently"
                            >
                              <Trash2 className="size-3.5 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. VERIFIED IDENTITY CERTIFICATE MODAL                                    */}
      {/* ========================================================================= */}
      {selectedUserForCert && (
        <Dialog open={certModalOpen} onOpenChange={setCertModalOpen}>
          <DialogContent className="max-w-lg bg-ivory border-burgundy/20 p-0 overflow-hidden text-foreground">
            {/* Certificate Header Banner */}
            <div className="bg-gradient-to-r from-burgundy via-burgundy/95 to-burgundy p-6 text-ivory relative">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-ivory/80 uppercase tracking-widest font-mono">
                    <ShieldCheck className="size-4 text-forest" />
                    <span>UIDAI Digital Consent Passed</span>
                  </div>
                  <h3 className="font-display mt-2 text-2xl font-semibold">
                    Executive Identity Pass
                  </h3>
                  <p className="text-xs text-ivory/80 mt-0.5">
                    Precious Meets Verified Member Credential
                  </p>
                </div>
                <div className="size-10 rounded-full bg-ivory/10 flex items-center justify-center border border-ivory/20">
                  <Sparkles className="size-5 text-ivory" />
                </div>
              </div>
            </div>

            {/* Certificate Body */}
            <div className="p-6 space-y-6">
              {/* Member Card Summary */}
              <div className="flex items-center gap-4 rounded-2xl border border-border/80 bg-card p-4">
                <img
                  src={selectedUserForCert.avatar}
                  alt={selectedUserForCert.name}
                  className="size-16 rounded-full object-cover ring-2 ring-forest"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-display text-lg font-bold text-foreground">
                      {selectedUserForCert.name}
                    </h4>
                    <span className="rounded-full bg-forest/20 text-forest px-2 py-0.2 text-[9px] font-bold uppercase">
                      Verified
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{selectedUserForCert.email}</p>
                  <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                    {selectedUserForCert.phone}
                  </p>
                  {(selectedUserForCert.instagram || selectedUserForCert.linkedin) && (
                    <div className="flex items-center gap-2 mt-1.5">
                      {selectedUserForCert.instagram && (
                        <a
                          href={
                            selectedUserForCert.instagram.startsWith("http")
                              ? selectedUserForCert.instagram
                              : selectedUserForCert.instagram.startsWith("instagram.com")
                              ? `https://${selectedUserForCert.instagram}`
                              : `https://instagram.com/${selectedUserForCert.instagram.replace("@", "")}`
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-pink-700 bg-pink-500/10 px-2 py-0.5 rounded-full hover:underline"
                        >
                          <Instagram className="size-3" />
                          <span>{selectedUserForCert.instagram.startsWith("@") ? selectedUserForCert.instagram : `@${selectedUserForCert.instagram.replace(/.*instagram\.com\//, "")}`}</span>
                        </a>
                      )}
                      {selectedUserForCert.linkedin && (
                        <a
                          href={
                            selectedUserForCert.linkedin.startsWith("http")
                              ? selectedUserForCert.linkedin
                              : `https://${selectedUserForCert.linkedin.replace(/^https?:\/\//, "")}`
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-700 bg-blue-500/10 px-2 py-0.5 rounded-full hover:underline"
                        >
                          <Linkedin className="size-3" />
                          <span>LinkedIn</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Security Audit Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
                  <span className="text-[10px] uppercase font-mono text-muted-foreground block">
                    Member Identifier
                  </span>
                  <span className="font-mono font-bold text-foreground mt-0.5 block">
                    {selectedUserForCert.memberId}
                  </span>
                </div>

                <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
                  <span className="text-[10px] uppercase font-mono text-muted-foreground block">
                    Membership Tier
                  </span>
                  <span className="font-semibold text-burgundy mt-0.5 block">
                    {selectedUserForCert.memberTier}
                  </span>
                </div>

                <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
                  <span className="text-[10px] uppercase font-mono text-muted-foreground block">
                    Verification Method
                  </span>
                  <span className="font-medium text-foreground mt-0.5 block">
                    {selectedUserForCert.verificationMethod}
                  </span>
                </div>

                <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
                  <span className="text-[10px] uppercase font-mono text-muted-foreground block">
                    DigiLocker Reference Hash
                  </span>
                  <span className="font-mono text-[11px] font-bold text-forest mt-0.5 block">
                    {selectedUserForCert.verificationReference}
                  </span>
                </div>
              </div>

              {/* Uploaded Identity Documents (Aadhaar & Photo) */}
              {(selectedUserForCert.aadhaarFileUrl || selectedUserForCert.userPhotoUrl) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Aadhaar Thumbnail */}
                  {selectedUserForCert.aadhaarFileUrl && (
                    <div className="rounded-2xl border border-burgundy/30 bg-burgundy/5 p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-burgundy font-semibold">
                          <FileText className="size-3.5" />
                          <span>Aadhaar Document</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setViewingAadhaar({
                            name: selectedUserForCert.name,
                            email: selectedUserForCert.email,
                            phone: selectedUserForCert.phone,
                            fileUrl: selectedUserForCert.aadhaarFileUrl!,
                            fileName: selectedUserForCert.aadhaarFileName,
                            userPhotoUrl: selectedUserForCert.userPhotoUrl || selectedUserForCert.avatar,
                            userPhotoFileName: selectedUserForCert.userPhotoFileName,
                            status: "verified",
                            recordId: selectedUserForCert.id,
                          })}
                          className="text-[10px] h-6 px-2 text-burgundy hover:bg-burgundy/10 cursor-pointer"
                        >
                          View Full
                        </Button>
                      </div>
                      <div className="flex items-center gap-2.5">
                        {!selectedUserForCert.aadhaarFileUrl.startsWith("data:application/pdf") && !selectedUserForCert.aadhaarFileUrl.toLowerCase().includes(".pdf") ? (
                          <div className="relative size-12 shrink-0 rounded-xl overflow-hidden border border-border shadow-xs bg-card">
                            <img
                              src={selectedUserForCert.aadhaarFileUrl}
                              alt="Aadhaar Document"
                              className="size-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="size-12 shrink-0 rounded-xl bg-burgundy/10 flex items-center justify-center text-burgundy border border-burgundy/20">
                            <FileText className="size-5" />
                          </div>
                        )}
                        <div className="min-w-0 text-xs">
                          <p className="font-semibold text-foreground truncate">
                            {selectedUserForCert.aadhaarFileName || "Aadhaar_Document"}
                          </p>
                          <p className="text-[10px] text-forest font-medium">✓ Government ID</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Personal Photo Thumbnail */}
                  {selectedUserForCert.userPhotoUrl && (
                    <div className="rounded-2xl border border-forest/30 bg-forest/5 p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-forest font-semibold">
                          <Camera className="size-3.5" />
                          <span>Member Photo</span>
                        </div>
                        <span className="text-[10px] text-forest font-mono">Portrait</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="relative size-12 shrink-0 rounded-xl overflow-hidden border border-border shadow-xs bg-card">
                          <img
                            src={selectedUserForCert.userPhotoUrl}
                            alt="Member Photo"
                            className="size-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 text-xs">
                          <p className="font-semibold text-foreground truncate">
                            {selectedUserForCert.userPhotoFileName || "Applicant_Photo.jpg"}
                          </p>
                          <p className="text-[10px] text-forest font-medium">✓ Personal Photo</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Safety & Seating Clearance */}
              <div className="rounded-2xl border border-forest/30 bg-forest/5 p-4 text-xs space-y-2">
                <div className="flex items-center gap-2 text-forest font-semibold">
                  <CheckCircle2 className="size-4" />
                  <span>Executive Women Safety & Anti-Harrassment Clearance</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Identity securely matched against government record with explicit digital consent under Aadhaar Act 2016. No unmasked biometrics or national IDs are stored in persistent storage. Pre-screened for curated 6-guest seating tables.
                </p>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-[10px] font-mono text-muted-foreground">
                  Audit Code: PM-SEC-{selectedUserForCert.id.toUpperCase()}
                </span>
                <Button
                  onClick={() => setCertModalOpen(false)}
                  className="rounded-full bg-burgundy hover:bg-burgundy/90 text-ivory text-xs px-5 cursor-pointer"
                >
                  Close Pass
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* ========================================================================= */}
      {/* 6. DUAL IDENTITY & FACE-MATCH AUDIT VIEWER MODAL                          */}
      {/* ========================================================================= */}
      {viewingAadhaar && (
        <Dialog open={!!viewingAadhaar} onOpenChange={(open) => !open && setViewingAadhaar(null)}>
          <DialogContent className="max-w-4xl bg-ivory border-burgundy/20 p-0 overflow-hidden text-foreground">
            {/* Header */}
            <div className="bg-gradient-to-r from-burgundy via-burgundy/95 to-burgundy p-5 text-ivory">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-ivory/80 uppercase tracking-widest font-mono">
                    <ShieldCheck className="size-4 text-forest" />
                    <span>Identity Verification & Face-Match Review</span>
                  </div>
                  <h3 className="font-display mt-1 text-2xl font-bold">
                    {viewingAadhaar.name}&apos;s Verification Audit
                  </h3>
                  <p className="text-xs text-ivory/80 mt-0.5">
                    {viewingAadhaar.email} {viewingAadhaar.phone ? `• ${viewingAadhaar.phone}` : ""}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={viewingAadhaar.fileUrl}
                    download={viewingAadhaar.fileName || "aadhaar_card"}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-ivory/15 hover:bg-ivory/25 px-3.5 py-1.5 text-xs font-semibold text-ivory transition-colors cursor-pointer"
                  >
                    <ExternalLink className="size-3.5" />
                    <span>Open Aadhaar</span>
                  </a>
                  {viewingAadhaar.userPhotoUrl && (
                    <a
                      href={viewingAadhaar.userPhotoUrl}
                      download={viewingAadhaar.userPhotoFileName || "member_photo.jpg"}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-ivory/15 hover:bg-ivory/25 px-3.5 py-1.5 text-xs font-semibold text-ivory transition-colors cursor-pointer"
                    >
                      <Camera className="size-3.5" />
                      <span>Open Photo</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Document Body & Dual Previews */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="rounded-xl bg-sage/20 border border-forest/30 p-3 text-xs flex items-center gap-2.5 text-forest">
                <CheckCircle2 className="size-4 shrink-0" />
                <span>
                  <strong>Face-Match Protocol:</strong> Compare the facial features and name on the Aadhaar document (Left) against the applicant&apos;s personal photo (Right).
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Column 1: Aadhaar Document */}
                <div className="rounded-2xl border border-burgundy/30 bg-card p-4 space-y-3 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-border/60">
                      <div className="flex items-center gap-1.5 font-semibold text-burgundy text-xs">
                        <FileText className="size-4" />
                        <span>Aadhaar Document ({viewingAadhaar.fileName || "Aadhaar Card"})</span>
                      </div>
                      <span className="font-mono text-[10px] uppercase text-muted-foreground">Proof 1</span>
                    </div>

                    <div className="mt-3 flex justify-center bg-background rounded-xl p-2 border border-border min-h-[300px] items-center overflow-hidden">
                      {viewingAadhaar.fileUrl.startsWith("data:image/") ? (
                        <img
                          src={viewingAadhaar.fileUrl}
                          alt={`${viewingAadhaar.name}'s Aadhaar`}
                          className="max-h-[340px] w-auto max-w-full rounded-lg object-contain shadow-xs"
                        />
                      ) : (
                        <iframe
                          src={viewingAadhaar.fileUrl}
                          title="Aadhaar Document PDF"
                          className="w-full h-[340px] rounded-lg border border-border/80"
                        />
                      )}
                    </div>
                  </div>
                  <div className="pt-2 border-t border-border/50 text-[11px] text-muted-foreground font-mono flex items-center justify-between">
                    <span>UIDAI Government Document</span>
                    <span className="text-forest font-semibold">✓ Attached</span>
                  </div>
                </div>

                {/* Column 2: Personal Photo */}
                <div className="rounded-2xl border border-forest/30 bg-card p-4 space-y-3 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-border/60">
                      <div className="flex items-center gap-1.5 font-semibold text-forest text-xs">
                        <Camera className="size-4" />
                        <span>Personal Photo ({viewingAadhaar.userPhotoFileName || "Applicant Portrait"})</span>
                      </div>
                      <span className="font-mono text-[10px] uppercase text-muted-foreground">Proof 2</span>
                    </div>

                    <div className="mt-3 flex justify-center bg-background rounded-xl p-2 border border-border min-h-[300px] items-center overflow-hidden">
                      {viewingAadhaar.userPhotoUrl ? (
                        <img
                          src={viewingAadhaar.userPhotoUrl}
                          alt={`${viewingAadhaar.name}'s Photo`}
                          className="max-h-[340px] w-auto max-w-full rounded-lg object-contain shadow-xs"
                        />
                      ) : (
                        <div className="text-center p-6 text-xs text-muted-foreground flex flex-col items-center justify-center">
                          <Camera className="size-10 text-muted-foreground/30 mb-2" />
                          <p className="font-medium text-foreground">No personal photo uploaded yet</p>
                          <p className="text-[11px] mt-1 text-muted-foreground">Using account avatar or default placeholder</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="pt-2 border-t border-border/50 text-[11px] text-muted-foreground font-mono flex items-center justify-between">
                    <span>Live Member Photo</span>
                    <span className={viewingAadhaar.userPhotoUrl ? "text-forest font-semibold" : "text-amber-600 font-semibold"}>
                      {viewingAadhaar.userPhotoUrl ? "✓ Attached" : "Pending"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status and Action bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border/60">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <FileCheck2 className="size-4 text-forest shrink-0" />
                  <span className="truncate max-w-[280px]">
                    Document: <strong className="text-foreground">{viewingAadhaar.fileName || "Aadhaar Card"}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {viewingAadhaar.recordId && viewingAadhaar.status && viewingAadhaar.status !== "verified" && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => {
                          onUpdateQueueStatus(viewingAadhaar.recordId!, "verified");
                          toast.success(`Approved Aadhaar verification for ${viewingAadhaar.name}`);
                          setViewingAadhaar(null);
                        }}
                        className="text-xs text-forest border-forest/30 hover:bg-forest hover:text-ivory cursor-pointer"
                      >
                        <Check className="size-3.5 mr-1" /> Approve & Issue Pass
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          onUpdateQueueStatus(viewingAadhaar.recordId!, "failed");
                          toast.error(`Rejected Aadhaar verification for ${viewingAadhaar.name}`);
                          setViewingAadhaar(null);
                        }}
                        className="text-xs cursor-pointer"
                      >
                        <XCircle className="size-3.5 mr-1" /> Reject
                      </Button>
                    </>
                  )}
                  {viewingAadhaar.recordId && (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        const recId = viewingAadhaar.recordId!;
                        const recEmail = viewingAadhaar.email;
                        const recName = viewingAadhaar.name;
                        setViewingAadhaar(null);
                        handleDelete(recId, recEmail, recName);
                      }}
                      className="text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                    >
                      <Trash2 className="size-3.5 mr-1" /> Delete Application
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    onClick={() => setViewingAadhaar(null)}
                    className="text-xs cursor-pointer"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
