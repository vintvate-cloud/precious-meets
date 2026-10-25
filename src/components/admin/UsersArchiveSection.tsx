import React, { useState, useEffect } from "react";
import {
  MemberApplication,
  ApplicationsService,
} from "@/lib/applications-service";
import { UserDossierModal } from "./UserDossierModal";
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  ShieldCheck,
  CreditCard,
  User,
  ExternalLink,
  Sparkles,
  Inbox,
  AlertCircle,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function UsersArchiveSection() {
  const [applications, setApplications] = useState<MemberApplication[]>([]);
  const [filter, setFilter] = useState<
    "all" | "pending_review" | "approved" | "rejected"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApplication, setSelectedApplication] =
    useState<MemberApplication | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setApplications(ApplicationsService.getApplications());
    ApplicationsService.fetchApplicationsFromDb().then((realApps) => {
      if (realApps && realApps.length > 0) {
        setApplications(realApps);
      }
    });
  }, []);

  const handleOpenDossier = (app: MemberApplication) => {
    setSelectedApplication(app);
    setModalOpen(true);
  };

  const handleApplicationUpdated = (updated: MemberApplication) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === updated.id ? updated : a)),
    );
    if (selectedApplication?.id === updated.id) {
      setSelectedApplication(updated);
    }
  };

  // Metrics
  const totalCount = applications.length;
  const pendingCount = applications.filter(
    (a) => a.status === "pending_review",
  ).length;
  const approvedCount = applications.filter(
    (a) => a.status === "approved",
  ).length;
  const rejectedCount = applications.filter(
    (a) => a.status === "rejected",
  ).length;

  // Filtered List
  const filteredApplications = applications.filter((app) => {
    if (filter !== "all" && app.status !== filter) return false;
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    return (
      app.applicantName.toLowerCase().includes(query) ||
      app.applicantEmail.toLowerCase().includes(query) ||
      app.applicationReference.toLowerCase().includes(query) ||
      app.archetypeTitle.toLowerCase().includes(query) ||
      app.applicantCity.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. ARCHIVE OVERVIEW METRICS                                                */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span className="font-mono uppercase">Total Dossiers</span>
            <FileText className="size-4 text-burgundy" />
          </div>
          <div className="font-display text-3xl font-semibold mt-2 text-foreground">
            {totalCount}
          </div>
          <span className="text-[10px] text-muted-foreground">
            Active membership archive
          </span>
        </div>

        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 shadow-xs">
          <div className="flex items-center justify-between text-amber-800 text-xs">
            <span className="font-mono uppercase font-semibold">
              Awaiting Review
            </span>
            <span className="relative flex size-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full size-2.5 bg-amber-500" />
            </span>
          </div>
          <div className="font-display text-3xl font-semibold mt-2 text-amber-900">
            {pendingCount}
          </div>
          <span className="text-[10px] text-amber-700/80">
            Quiz, Payment & Aadhaar completed
          </span>
        </div>

        <div className="rounded-2xl border border-forest/30 bg-forest/5 p-4 shadow-xs">
          <div className="flex items-center justify-between text-forest text-xs">
            <span className="font-mono uppercase font-semibold">
              Verified Members
            </span>
            <CheckCircle2 className="size-4 text-forest" />
          </div>
          <div className="font-display text-3xl font-semibold mt-2 text-forest">
            {approvedCount}
          </div>
          <span className="text-[10px] text-forest/80">
            Active table reservation access
          </span>
        </div>

        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 shadow-xs">
          <div className="flex items-center justify-between text-destructive text-xs">
            <span className="font-mono uppercase font-semibold">Declined</span>
            <XCircle className="size-4 text-destructive" />
          </div>
          <div className="font-display text-3xl font-semibold mt-2 text-destructive">
            {rejectedCount}
          </div>
          <span className="text-[10px] text-destructive/80">
            Feedback email dispatched
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TOOLBAR: SEARCH & STATUS FILTER CHIPS                                   */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-y border-border/80 py-4">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "All Files", count: totalCount },
            {
              id: "pending_review",
              label: "Awaiting Action",
              count: pendingCount,
            },
            {
              id: "approved",
              label: "Verified Members",
              count: approvedCount,
            },
            { id: "rejected", label: "Declined", count: rejectedCount },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                filter === tab.id
                  ? "bg-foreground text-background shadow-xs ring-1 ring-foreground/20"
                  : "border border-border/80 bg-card text-muted-foreground hover:bg-sage/40 hover:text-foreground"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                  filter === tab.id
                    ? "bg-background text-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, dossier #..."
            className="w-full rounded-full border border-border/80 bg-card py-1.5 pl-9 pr-3 text-xs text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-burgundy focus:ring-1 focus:ring-burgundy"
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. PHYSICAL DOSSIER / FILE GRID                                            */}
      {/* ========================================================================= */}
      {filteredApplications.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border/80 bg-card/50 p-12 text-center">
          <Inbox className="size-10 mx-auto text-muted-foreground/50 mb-3" />
          <h4 className="font-display text-xl text-foreground">
            No Member Dossiers Found
          </h4>
          <p className="mt-1 text-xs text-muted-foreground">
            No applications match the current filter or search criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredApplications.map((app) => {
            const isPending = app.status === "pending_review";
            const isApproved = app.status === "approved";
            const isRejected = app.status === "rejected";

            return (
              <div
                key={app.id}
                onClick={() => handleOpenDossier(app)}
                className="group relative flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-5 shadow-xs transition-all duration-300 hover:shadow-lg hover:border-burgundy/40 hover:-translate-y-1 cursor-pointer"
              >
                {/* Simulated Physical Manila Folder Tab */}
                <div className="flex items-center justify-between pb-3 border-b border-border/70">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider rounded-t-md bg-ivory border border-border px-2 py-0.5 text-foreground/80 group-hover:text-burgundy transition-colors">
                      📁 {app.applicationReference}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Status Seal Badge */}
                  <div>
                    {isApproved && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-forest/15 px-2 py-0.5 font-mono text-[9px] font-bold text-forest">
                        <CheckCircle2 className="size-2.5" /> VERIFIED
                      </span>
                    )}
                    {isPending && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 font-mono text-[9px] font-bold text-amber-700 animate-pulse">
                        <Clock className="size-2.5" /> PENDING ACTION
                      </span>
                    )}
                    {isRejected && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-destructive/15 px-2 py-0.5 font-mono text-[9px] font-bold text-destructive">
                        <XCircle className="size-2.5" /> DECLINED
                      </span>
                    )}
                  </div>
                </div>

                {/* Member Profile Preview */}
                <div className="py-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        app.avatarUrl ||
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                      }
                      alt={app.applicantName}
                      className="size-12 rounded-2xl border border-border object-cover"
                    />
                    <div>
                      <h4 className="font-display text-xl font-normal text-foreground group-hover:text-burgundy transition-colors">
                        {app.applicantName}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {app.applicantEmail}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {app.applicantCity} · {app.applicantPhone}
                      </p>
                    </div>
                  </div>

                  {/* Archetype Chip */}
                  <div className="rounded-xl bg-ivory p-2.5 border border-border/80">
                    <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                      <span>VIBE ARCHETYPE</span>
                      <span className="text-forest font-semibold">
                        Score: {app.conversationDepthScore}% Depth
                      </span>
                    </div>
                    <div className="font-serif text-sm font-semibold text-foreground mt-0.5 line-clamp-1">
                      {app.archetypeTitle}
                    </div>
                  </div>

                  {/* 4 Member Status Checks */}
                  <div className="grid grid-cols-4 gap-1 pt-1 text-[9px] font-mono">
                    <div className="flex items-center justify-center gap-1 rounded-lg bg-forest/10 py-1 text-forest font-medium">
                      <CheckCircle2 className="size-2.5" /> Quiz
                    </div>
                    <div
                      className={`flex items-center justify-center gap-1 rounded-lg py-1 font-medium ${
                        app.paymentStatus === "paid"
                          ? "bg-forest/10 text-forest"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <CreditCard className="size-2.5" />
                      <span>{app.paymentStatus === "paid" ? "₹1,999" : "Unpaid"}</span>
                    </div>
                    <div
                      className={`flex items-center justify-center gap-1 rounded-lg py-1 font-medium ${
                        app.identityStatus === "verified"
                          ? "bg-forest/10 text-forest"
                          : "bg-amber-500/10 text-amber-700"
                      }`}
                    >
                      <ShieldCheck className="size-2.5" />
                      <span>{app.identityStatus === "verified" ? "Aadhaar" : "Pending"}</span>
                    </div>
                    <div
                      className={`flex items-center justify-center gap-1 rounded-lg py-1 font-medium ${
                        app.credentialsSent
                          ? "bg-forest/10 text-forest font-bold"
                          : "bg-purple-500/10 text-purple-700"
                      }`}
                    >
                      <KeyRound className="size-2.5" />
                      <span>{app.credentialsSent ? "Creds Sent" : "No Creds"}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-muted-foreground">
                    Click to review dossier & answers
                  </span>
                  <span className="font-semibold text-burgundy flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Open File →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Interactive Dossier File Modal */}
      <UserDossierModal
        application={selectedApplication}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onApplicationUpdated={handleApplicationUpdated}
      />
    </div>
  );
}
