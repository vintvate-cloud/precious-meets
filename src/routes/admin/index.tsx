import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  EventsService,
  AdminEvent,
  AdminAttendee,
} from "@/lib/events-service";
import {
  ApplicationsService,
  MemberApplication,
} from "@/lib/applications-service";
import { InteractiveTable } from "@/components/admin/InteractiveTable";
import { EventFormModal } from "@/components/admin/EventFormModal";
import { EventQrScannerModal } from "@/components/admin/EventQrScannerModal";
import { UsersArchiveSection } from "@/components/admin/UsersArchiveSection";
import {
  VerificationsSection,
  VerificationQueueItem,
} from "@/components/admin/VerificationsSection";
import { VerificationsService } from "@/lib/verifications-service";
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  Calendar,
  CreditCard,
  CheckCircle2,
  Plus,
  Edit3,
  Trash2,
  Sparkles,
  Utensils,
  Archive,
  ArrowRight,
  ScanLine,
  Menu,
  X,
  Compass,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export interface SOSIncident {
  id: string;
  reference: string;
  userName: string;
  userEmail: string;
  category: string;
  status: "open" | "acknowledged" | "resolved";
  createdAt: string;
  bookingRef: string;
  location: string;
}

const STORAGE_INCIDENTS_KEY = "precious_meets_sos_incidents";

type AdminTab = "users" | "events" | "verifications" | "incidents" | "overview";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Operations & Seating Console — Precious Meets" },
      {
        name: "description",
        content: "Executive management for curated meets, 6-seat table assignments, attendee passes, and SOS safety.",
      },
    ],
  }),
  component: AdminConsolePage,
});

function AdminConsolePage() {
  const { user, isAdmin, signOut, loading } = useAuth();
  const navigate = useNavigate();

  // Security Gate: Direct access without admin credentials immediately redirects to /login
  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate({
        to: "/login",
        search: { redirect: "/admin" } as any,
      });
    }
  }, [user, isAdmin, loading, navigate]);

  const [activeTab, setActiveTab] = useState<AdminTab>("users");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Events & Seating State
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [attendees, setAttendees] = useState<AdminAttendee[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [eventFilter, setEventFilter] = useState<"upcoming" | "past" | "all">("upcoming");

  // Applications (Real member dossiers for overview metrics)
  const [applications, setApplications] = useState<MemberApplication[]>([]);

  // Modal State
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AdminEvent | null>(null);

  // Scanner Modal State
  const [scannerModalOpen, setScannerModalOpen] = useState(false);
  const [scanningEvent, setScanningEvent] = useState<AdminEvent | null>(null);

  const handleOpenScanner = (evt: AdminEvent) => {
    setScanningEvent(evt);
    setSelectedEventId(evt.id);
    setScannerModalOpen(true);
  };

  // Load events, attendees, and applications
  useEffect(() => {
    const refreshData = () => {
      const loadedEvents = EventsService.getEvents();
      const loadedAttendees = EventsService.getAttendees();
      const loadedApps = ApplicationsService.getApplications();
      setEvents(loadedEvents);
      setAttendees(loadedAttendees);
      setApplications(loadedApps);

      if (loadedEvents.length > 0 && !selectedEventId) {
        const firstUpcoming = loadedEvents.find((e) => e.status !== "completed") || loadedEvents[0];
        if (firstUpcoming) {
          setSelectedEventId(firstUpcoming.id);
        }
      }
    };

    refreshData();

    // Hydrate applications from server data file
    ApplicationsService.fetchApplicationsFromServer().then((srvApps) => {
      if (srvApps && srvApps.length > 0) {
        setApplications(srvApps);
      }
    });

    // Hydrate verifications queue from server data file
    VerificationsService.fetchQueueFromServer().then((srvQueue) => {
      if (srvQueue && srvQueue.length > 0) {
        setVerifications(srvQueue);
      }
    });

    ApplicationsService.fetchApplicationsFromDb().then((dbApps) => {
      if (dbApps && dbApps.length > 0) {
        setApplications(dbApps);
      }
    });

    window.addEventListener("storage", refreshData);
    window.addEventListener("precious_meets_applications_updated", refreshData);
    window.addEventListener("precious_meets_verification_updated", refreshData);
    return () => {
      window.removeEventListener("storage", refreshData);
      window.removeEventListener("precious_meets_applications_updated", refreshData);
      window.removeEventListener("precious_meets_verification_updated", refreshData);
    };
  }, [selectedEventId]);

  const selectedEvent = events.find((e) => e.id === selectedEventId) || events[0];

  // Filtered Events
  const filteredEvents = events.filter((e) => {
    if (eventFilter === "upcoming") return e.status !== "completed";
    if (eventFilter === "past") return e.status === "completed";
    return true;
  });

  // Event Handlers
  const handleSaveEvent = (eventData: Omit<AdminEvent, "id" | "seats">) => {
    if (editingEvent) {
      const updated = EventsService.updateEvent(editingEvent.id, eventData);
      setEvents(EventsService.getEvents());
      toast.success(`"${updated.title}" has been updated.`);
    } else {
      const created = EventsService.createEvent(eventData);
      setEvents(EventsService.getEvents());
      setSelectedEventId(created.id);
      toast.success(`New meet "${created.title}" successfully hosted!`);
    }
    setEditingEvent(null);
  };

  const handleDeleteEvent = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to remove "${title}"?`)) {
      EventsService.deleteEvent(id);
      const remaining = EventsService.getEvents();
      setEvents(remaining);
      if (selectedEventId === id) {
        setSelectedEventId(remaining[0]?.id || null);
      }
      toast.info(`Event "${title}" removed.`);
    }
  };

  const handleToggleStatus = (event: AdminEvent) => {
    const nextStatus = event.status === "completed" ? "published" : "completed";
    EventsService.updateEvent(event.id, { status: nextStatus });
    setEvents(EventsService.getEvents());
    toast.success(
      nextStatus === "completed"
        ? `"${event.title}" marked as completed.`
        : `"${event.title}" marked as upcoming.`
    );
  };

  const handleEventUpdated = (updated: AdminEvent) => {
    setEvents(EventsService.getEvents());
    if (scanningEvent && scanningEvent.id === updated.id) {
      setScanningEvent(updated);
    }
  };

  // SOS Incidents
  const [incidents, setIncidents] = useState<SOSIncident[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(STORAGE_INCIDENTS_KEY);
      if (saved) {
        const parsed: SOSIncident[] = JSON.parse(saved);
        return parsed.filter(
          (inc) =>
            inc.id !== "inc_01" &&
            inc.id !== "inc_02" &&
            !inc.userEmail?.endsWith("@example.com")
        );
      }
    } catch (e) {
      // ignore
    }
    return [];
  });

  const [verifications, setVerifications] = useState<VerificationQueueItem[]>([]);

  useEffect(() => {
    setVerifications(VerificationsService.getQueue());

    VerificationsService.fetchQueueFromServer().then((srvQueue) => {
      if (srvQueue && srvQueue.length > 0) {
        setVerifications(srvQueue);
      }
    });

    const handleUpdate = () => {
      setVerifications(VerificationsService.getQueue());
    };

    window.addEventListener("storage", handleUpdate);
    window.addEventListener("precious_meets_verification_updated", handleUpdate);
    window.addEventListener("precious_meets_applications_updated", handleUpdate);
    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("precious_meets_verification_updated", handleUpdate);
      window.removeEventListener("precious_meets_applications_updated", handleUpdate);
    };
  }, []);

  const handleResolveIncident = (id: string) => {
    setIncidents((prev) => {
      const updated = prev.map((inc) =>
        inc.id === id ? { ...inc, status: "resolved" as const } : inc
      );
      try {
        localStorage.setItem(STORAGE_INCIDENTS_KEY, JSON.stringify(updated));
      } catch (e) {
        // ignore
      }
      return updated;
    });
    toast.success("Incident marked as resolved.");
  };

  const handleUpdateVerification = (id: string, status: "verified" | "failed") => {
    const updated = VerificationsService.updateStatus(id, status);
    setVerifications(updated);
    toast.success(`Verification status updated to ${status}.`);
  };

  const handleDeleteVerification = (id: string, email?: string) => {
    const updated = VerificationsService.deleteRecord(id, email);
    setVerifications(updated);
    setApplications(ApplicationsService.getApplications());
    toast.success("Record deleted.");
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate({ to: "/" });
    } catch (e) {
      navigate({ to: "/" });
    }
  };

  // Nav counts
  const pendingApplicationsCount = applications.filter((a) => a.status === "pending_review").length;
  const upcomingEventsCount = events.filter((e) => e.status !== "completed").length;
  const pendingVerificationsCount = verifications.filter(
    (v) => v.status === "pending" || v.status === "manual_review"
  ).length;
  const activeIncidentsCount = incidents.filter((i) => i.status !== "resolved").length;

  const NAV_ITEMS = [
    {
      id: "users" as const,
      label: "Users & Dossiers",
      icon: Users,
      badge: pendingApplicationsCount > 0 ? `${pendingApplicationsCount}` : null,
      badgeColor: "bg-amber-500/20 text-amber-300",
    },
    {
      id: "events" as const,
      label: "Meets & Seating",
      icon: Calendar,
      badge: upcomingEventsCount > 0 ? `${upcomingEventsCount}` : null,
      badgeColor: "bg-white/10 text-white/80",
    },
    {
      id: "verifications" as const,
      label: "Verifications",
      icon: ShieldCheck,
      badge: pendingVerificationsCount > 0 ? `${pendingVerificationsCount}` : null,
      badgeColor: "bg-amber-500/20 text-amber-300",
    },
    {
      id: "incidents" as const,
      label: "Emergency SOS",
      icon: ShieldAlert,
      badge: activeIncidentsCount > 0 ? `${activeIncidentsCount}` : null,
      badgeColor: "bg-destructive text-white animate-pulse",
    },
    {
      id: "overview" as const,
      label: "Metrics & Revenue",
      icon: Sparkles,
      badge: null,
      badgeColor: "",
    },
  ];

  if (loading || !user || !isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#FAF7F2] text-[#171514] px-4 text-center">
        <div className="flex flex-col items-center space-y-4 max-w-sm p-8 rounded-3xl border border-black/5 bg-white shadow-xl">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#691C35] border-t-transparent" />
          <h2 className="font-serif text-lg font-medium text-[#171514]">
            Verifying Clearance...
          </h2>
          <p className="text-xs text-muted-foreground">
            Direct access requires administrator credentials.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#171514]">
      {/* ========================================================================= */}
      {/* 1. LEFT SIDE PANEL (DESKTOP)                                               */}
      {/* ========================================================================= */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 xl:w-72 flex-col justify-between bg-[#151212] text-white border-r border-white/10 z-30 p-5 selection:bg-[#691C35]/40">
        <div className="space-y-6">
          {/* Top Brand Monogram */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <span className="grid size-8 place-items-center rounded-full bg-white/10 border border-white/15 text-[#C6A568] transition-transform duration-300 group-hover:scale-105">
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="8" stroke="#FAF7F2" strokeWidth="2" />
                  <circle cx="12" cy="12" r="3" fill="#C6A568" />
                </svg>
              </span>
              <div className="flex flex-col">
                <span className="font-display text-lg text-white tracking-tight leading-tight">
                  Precious<em className="text-[#C6A568] not-italic font-serif"> meets</em>
                </span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#C6A568]/80 font-bold">
                  Admin Console
                </span>
              </div>
            </Link>
          </div>

          {/* Admin Clearance Card */}
          <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-3.5">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-full bg-gradient-to-tr from-[#691C35] to-[#C6A568] flex items-center justify-center text-xs font-serif font-bold text-white shadow-xs">
                AD
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-xs text-white truncate">Administrator</div>
                <div className="font-mono text-[10px] text-white/50 truncate">
                  {user?.email || "admin@preciousmeets.com"}
                </div>
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px]">
              <span className="text-emerald-400 font-mono flex items-center gap-1 font-semibold">
                <ShieldCheck className="size-3" /> Clearance
              </span>
              <span className="text-white/40 font-mono">Delhi NCR</span>
            </div>
          </div>

          {/* Navigation Items (Minimal, sleek) */}
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-white/10 text-white font-semibold shadow-xs"
                      : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`size-4 ${isActive ? "text-[#C6A568]" : "text-white/50"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Utility Links */}
        <div className="border-t border-white/10 pt-4 space-y-1">
          <Link
            to="/dashboard"
            className="w-full flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-xs text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors"
          >
            <Compass className="size-4 text-white/40" />
            <span>Member Portal</span>
          </Link>
          <Link
            to="/"
            className="w-full flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-xs text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors"
          >
            <ArrowRight className="size-4 text-white/40" />
            <span>Public Website</span>
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-xs text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="size-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MOBILE HEADER & DRAWER                                                  */}
      {/* ========================================================================= */}
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between bg-[#151212] text-white border-b border-white/10 px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-full bg-white/10 border border-white/15 text-[#C6A568]">
            <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="8" stroke="#FAF7F2" strokeWidth="2" />
              <circle cx="12" cy="12" r="3" fill="#C6A568" />
            </svg>
          </span>
          <span className="font-display text-base text-white tracking-tight">
            Precious<em className="text-[#C6A568] not-italic font-serif"> meets</em>
          </span>
        </Link>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex">
          <div className="w-72 bg-[#151212] text-white p-5 flex flex-col justify-between h-full shadow-2xl">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="font-display text-lg text-white">Admin Operations</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-white/60 hover:text-white"
                >
                  <X className="size-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium cursor-pointer ${
                        isActive
                          ? "bg-white/10 text-white font-semibold"
                          : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`size-4 ${isActive ? "text-[#C6A568]" : "text-white/50"}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="border-t border-white/10 pt-4 space-y-1">
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-xs text-white/60"
              >
                <Compass className="size-4 text-white/40" />
                <span>Member Portal</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-xs text-red-400"
              >
                <LogOut className="size-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MAIN CONTENT CANVAS                                                     */}
      {/* ========================================================================= */}
      <div className="lg:pl-64 xl:pl-72 flex flex-col min-h-screen">
        {/* Top Minimal Bar */}
        <div className="sticky top-0 z-20 border-b border-black/5 bg-[#FAF7F2]/90 backdrop-blur-md px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-xl sm:text-2xl font-medium text-[#171514]">
              {activeTab === "users" && "User Dossiers"}
              {activeTab === "events" && "Meets & Seating"}
              {activeTab === "verifications" && "Verifications Queue"}
              {activeTab === "incidents" && "Emergency SOS"}
              {activeTab === "overview" && "Operations Metrics"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === "events" && (
              <Button
                size="sm"
                onClick={() => {
                  setEditingEvent(null);
                  setEventModalOpen(true);
                }}
                className="rounded-full bg-[#5F7045] hover:bg-[#5F7045]/90 text-[#FAF7F2] text-xs font-semibold px-4 cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="size-3.5" />
                <span>Host Meet</span>
              </Button>
            )}

            <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground bg-black/[0.03] px-3 py-1.5 rounded-full border border-black/5">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Delhi NCR Active</span>
            </div>
          </div>
        </div>

        {/* Tab Content Body */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto flex-1">
          {/* TAB 1: USERS ARCHIVE */}
          {activeTab === "users" && (
            <div>
              <UsersArchiveSection />
            </div>
          )}

          {/* TAB 2: MEETS & SEATING */}
          {activeTab === "events" && (
            <div className="space-y-4">
              {/* Filter Pills */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEventFilter("upcoming")}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                    eventFilter === "upcoming"
                      ? "bg-[#171514] text-white shadow-xs"
                      : "border border-border/80 bg-card text-muted-foreground hover:bg-sage/40 hover:text-foreground"
                  }`}
                >
                  Upcoming ({events.filter((e) => e.status !== "completed").length})
                </button>
                <button
                  type="button"
                  onClick={() => setEventFilter("past")}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                    eventFilter === "past"
                      ? "bg-[#171514] text-white shadow-xs"
                      : "border border-border/80 bg-card text-muted-foreground hover:bg-sage/40 hover:text-foreground"
                  }`}
                >
                  Concluded ({events.filter((e) => e.status === "completed").length})
                </button>
                <button
                  type="button"
                  onClick={() => setEventFilter("all")}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                    eventFilter === "all"
                      ? "bg-[#171514] text-white shadow-xs"
                      : "border border-border/80 bg-card text-muted-foreground hover:bg-sage/40 hover:text-foreground"
                  }`}
                >
                  All ({events.length})
                </button>
              </div>

              {/* Split Screen Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column: Events Directory */}
                <div className="lg:col-span-4 space-y-3">
                  {filteredEvents.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground">
                      No meets found. Click "+ Host Meet" to create one.
                    </div>
                  ) : (
                    filteredEvents.map((evt) => {
                      const isSelected = evt.id === selectedEventId;
                      const seatedCount = evt.seats.filter(Boolean).length;

                      return (
                        <div
                          key={evt.id}
                          onClick={() => setSelectedEventId(evt.id)}
                          className={`group relative overflow-hidden rounded-2xl border p-4 transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? "border-[#691C35] border-l-4 bg-[#691C35]/[0.03] shadow-md ring-1 ring-[#691C35]/20"
                              : "border-border/80 bg-card hover:border-[#691C35]/40 hover:shadow-xs"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`rounded-full px-2 py-0.5 text-[9px] font-mono uppercase font-bold flex items-center gap-1 ${
                                    evt.status === "published"
                                      ? "bg-forest/15 text-forest"
                                      : evt.status === "completed"
                                      ? "bg-muted text-muted-foreground"
                                      : "bg-ochre/15 text-ochre"
                                  }`}
                                >
                                  {evt.status}
                                </span>
                                <span className="text-[11px] font-medium text-forest truncate">
                                  {evt.city}
                                </span>
                              </div>

                              <h3 className="font-serif mt-1 text-base font-medium leading-snug group-hover:text-[#691C35] transition-colors truncate">
                                {evt.title}
                              </h3>
                              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                                {evt.dateDisplay} · {evt.neighborhood}
                              </p>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="font-mono text-xs font-bold text-foreground block">
                                ₹{evt.priceInr.toLocaleString()}
                              </span>
                            </div>
                          </div>

                          <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-2 text-xs">
                            <div className="flex items-center gap-1.5">
                              <span className={`size-2 rounded-full ${seatedCount === 6 ? "bg-forest" : "bg-[#691C35]"}`} />
                              <span className="font-medium text-foreground text-[11px]">
                                {seatedCount} / 6 Seated
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                title="Scan Guest QR"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenScanner(evt);
                                }}
                                className="flex items-center gap-1 rounded-full bg-forest/15 px-2.5 py-1 text-[10px] font-semibold text-forest hover:bg-forest hover:text-ivory transition-all cursor-pointer"
                              >
                                <ScanLine className="size-3" />
                                <span>Scan</span>
                              </button>

                              <button
                                type="button"
                                title="Edit Meet"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingEvent(evt);
                                  setEventModalOpen(true);
                                }}
                                className="rounded-full p-1.5 text-muted-foreground hover:bg-black/5 hover:text-foreground transition-colors"
                              >
                                <Edit3 className="size-3.5" />
                              </button>

                              <button
                                type="button"
                                title={evt.status === "completed" ? "Mark as Upcoming" : "Mark as Completed"}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleStatus(evt);
                                }}
                                className="rounded-full p-1.5 text-muted-foreground hover:bg-black/5 hover:text-forest transition-colors"
                              >
                                <Archive className="size-3.5" />
                              </button>

                              <button
                                type="button"
                                title="Remove Meet"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteEvent(evt.id, evt.title);
                                }}
                                className="rounded-full p-1.5 text-muted-foreground hover:bg-destructive/15 hover:text-destructive transition-colors"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Right Column: Interactive 6-Seater Table Room */}
                <div className="lg:col-span-8">
                  {selectedEvent ? (
                    <InteractiveTable
                      event={selectedEvent}
                      attendees={attendees}
                      onEventUpdated={handleEventUpdated}
                      onOpenScanner={() => handleOpenScanner(selectedEvent)}
                    />
                  ) : (
                    <div className="rounded-3xl border border-dashed border-border p-16 text-center text-muted-foreground bg-card">
                      <Utensils className="mx-auto size-12 text-muted-foreground/40 mb-3" />
                      <h3 className="font-serif text-xl">No Meet Selected</h3>
                      <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                        Choose a meet from the list to view and configure seating.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: VERIFICATIONS */}
          {activeTab === "verifications" && (
            <div>
              <VerificationsSection
                queue={verifications}
                onUpdateQueueStatus={handleUpdateVerification}
                onDeleteQueueItem={handleDeleteVerification}
              />
            </div>
          )}

          {/* TAB 4: SOS INCIDENTS */}
          {activeTab === "incidents" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs text-muted-foreground">
                  Live emergency transmissions from seated guests.
                </span>
              </div>

              {incidents.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-border p-12 text-center text-muted-foreground bg-card">
                  <ShieldCheck className="mx-auto size-12 text-forest/60 mb-3" />
                  <h3 className="font-serif text-xl text-foreground">All Clear</h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                    No active SOS alerts. All meets and tables are secure.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {incidents.map((inc) => (
                    <div
                      key={inc.id}
                      className={`rounded-2xl border p-5 transition-all ${
                        inc.status === "resolved"
                          ? "border-border/60 bg-card/60 opacity-60"
                          : "border-destructive/30 bg-destructive/5"
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-destructive">
                              {inc.reference}
                            </span>
                            <span className="rounded-full bg-destructive/15 px-2 py-0.5 text-[10px] uppercase font-semibold text-destructive">
                              {inc.category}
                            </span>
                            <span className="text-[10px] text-muted-foreground">· {inc.createdAt}</span>
                          </div>
                          <h3 className="font-medium mt-1 text-base text-foreground">
                            {inc.userName} ({inc.userEmail})
                          </h3>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            Booking: <strong className="text-foreground">{inc.bookingRef}</strong> | Location: {inc.location}
                          </p>
                        </div>

                        <div>
                          {inc.status === "resolved" ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-forest">
                              <CheckCircle2 className="size-4" /> Resolved
                            </span>
                          ) : (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleResolveIncident(inc.id)}
                              className="text-xs rounded-full cursor-pointer"
                            >
                              Mark as Resolved
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: OVERVIEW & METRICS */}
          {activeTab === "overview" && (() => {
            const totalMembersCount = applications.length;
            const verifiedCount = applications.filter((a) => a.identityStatus === "verified").length;
            const grossRevenue = applications
              .filter((a) => a.paymentStatus === "paid")
              .reduce((acc, a) => acc + (a.paymentAmountInr || 1999), 0);
            const verificationRate = totalMembersCount > 0 ? Math.round((verifiedCount / totalMembersCount) * 100) : 0;

            return (
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="text-xs font-medium">Registered Members</span>
                      <Users className="size-4 text-forest" />
                    </div>
                    <p className="font-serif mt-2 text-2xl font-bold">{totalMembersCount.toLocaleString()}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">Applications on file</p>
                  </div>

                  <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="text-xs font-medium">Verified Members</span>
                      <ShieldCheck className="size-4 text-forest" />
                    </div>
                    <p className="font-serif mt-2 text-2xl font-bold">{verifiedCount.toLocaleString()}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">{verificationRate}% Aadhaar verified</p>
                  </div>

                  <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="text-xs font-medium">Pass Revenue</span>
                      <CreditCard className="size-4 text-[#691C35]" />
                    </div>
                    <p className="font-mono mt-2 text-2xl font-bold text-[#691C35]">₹{grossRevenue.toLocaleString()}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">Captured payments</p>
                  </div>

                  <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-5 shadow-xs">
                    <div className="flex items-center justify-between text-destructive">
                      <span className="text-xs font-medium">Active SOS</span>
                      <ShieldAlert className="size-4" />
                    </div>
                    <p className="font-serif mt-2 text-2xl font-bold text-destructive">
                      {activeIncidentsCount}
                    </p>
                    <p className="mt-1 text-[11px] text-destructive">
                      {activeIncidentsCount > 0 ? "Attention required" : "All clear"}
                    </p>
                  </div>
                </div>

                {/* Meets Roster */}
                <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs">
                  <h2 className="font-serif text-lg font-medium">Active Meets Roster</h2>
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="border-b border-border/60 text-muted-foreground">
                        <tr>
                          <th className="pb-3">Meet</th>
                          <th className="pb-3">Neighborhood</th>
                          <th className="pb-3">Price</th>
                          <th className="pb-3">Capacity</th>
                          <th className="pb-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {events.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-6 text-center text-muted-foreground">
                              No meets scheduled yet.
                            </td>
                          </tr>
                        ) : (
                          events.map((evt) => (
                            <tr key={evt.id}>
                              <td className="py-3 font-medium text-foreground">{evt.title}</td>
                              <td className="py-3 text-muted-foreground">{evt.neighborhood}, {evt.city}</td>
                              <td className="py-3 font-mono">₹{evt.priceInr.toLocaleString()}</td>
                              <td className="py-3">{evt.seats.filter(Boolean).length} / 6 seats</td>
                              <td className="py-3">
                                <span
                                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                                    evt.status === "published"
                                      ? "bg-forest/20 text-forest"
                                      : evt.status === "completed"
                                      ? "bg-muted text-muted-foreground"
                                      : "bg-ochre/20 text-ochre"
                                  }`}
                                >
                                  {evt.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })()}
        </main>
      </div>

      {/* Event Add / Edit Modal */}
      <EventFormModal
        open={eventModalOpen}
        onClose={() => {
          setEventModalOpen(false);
          setEditingEvent(null);
        }}
        initialEvent={editingEvent}
        onSave={handleSaveEvent}
      />

      {/* Event QR Gate Scanner Modal */}
      {scannerModalOpen && scanningEvent && (
        <EventQrScannerModal
          open={scannerModalOpen}
          onOpenChange={(open) => {
            setScannerModalOpen(open);
            if (!open) setScanningEvent(null);
          }}
          event={scanningEvent}
          attendees={attendees}
          onEventUpdated={handleEventUpdated}
        />
      )}
    </div>
  );
}
