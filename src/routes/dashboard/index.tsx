import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  EventsService,
  AdminEvent,
  UserSeatInvitation,
} from "@/lib/events-service";
import { MemberPassCard } from "@/components/dashboard/MemberPassCard";
import { EventsListSection } from "@/components/dashboard/EventsListSection";
import { SeatInvitationsSection } from "@/components/dashboard/SeatInvitationsSection";
import { ProfileEditorSection } from "@/components/dashboard/ProfileEditorSection";
import { QuizResponsesSection } from "@/components/dashboard/QuizResponsesSection";
import { InvoiceReceiptSection } from "@/components/dashboard/InvoiceReceiptSection";
import {
  Sparkles,
  Calendar,
  Mail,
  User,
  FileQuestion,
  Receipt,
  ShieldAlert,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  Compass,
} from "lucide-react";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({
    meta: [
      { title: "Member Dashboard — Precious Meets" },
      {
        name: "description",
        content: "Curated member dashboard for verified meets and table passes.",
      },
    ],
  }),
  component: DashboardPage,
  errorComponent: ({ error, reset }: { error: any; reset: () => void }) => (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FAF7F2] text-[#171514] px-4 text-center">
      <div className="max-w-md w-full p-8 rounded-3xl border border-black/5 bg-white shadow-xl space-y-4">
        <h2 className="font-display text-2xl text-[#171514]">Member Portal Notice</h2>
        <p className="text-xs text-muted-foreground">
          There was an issue loading your member account data.
        </p>
        {error && (
          <div className="text-left p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-mono text-red-700 max-h-36 overflow-auto">
            {error instanceof Error ? error.message : String(error)}
          </div>
        )}
        <div className="flex flex-wrap gap-2 justify-center pt-2">
          <button
            onClick={() => reset()}
            className="rounded-full bg-[#691C35] text-white text-xs font-semibold px-5 py-2 cursor-pointer hover:bg-[#691C35]/90"
          >
            Retry Loading
          </button>
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                localStorage.removeItem("precious_meets_mock_user");
                localStorage.removeItem("precious_meets_session_timestamp");
                window.location.href = "/login";
              }
            }}
            className="rounded-full border border-black/15 bg-white text-xs font-semibold px-5 py-2 cursor-pointer hover:bg-neutral-50"
          >
            Re-authenticate
          </button>
        </div>
      </div>
    </div>
  ),
});

const LOCAL_STORAGE_RESERVATIONS_KEY = "precious_meets_member_rsvps";

type DashboardTab = "overview" | "meets" | "requests" | "profile" | "questions" | "invoice";

export function DashboardPage() {
  const { user, profile, subscription, signOut, loading, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Security Gate: Direct access without authentication is blocked
  useEffect(() => {
    if (!loading && !user) {
      navigate({
        to: "/login",
      });
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } finally {
      navigate({ to: "/login" });
    }
  };

  const getUrlTab = (): DashboardTab | null => {
    if (typeof window === "undefined") return null;
    const tabParam = new URLSearchParams(window.location.search).get("tab") as DashboardTab;
    if (tabParam && ["overview", "meets", "requests", "profile", "questions", "invoice"].includes(tabParam)) {
      return tabParam;
    }
    return null;
  };

  const [activeTab, setActiveTab] = useState<DashboardTab>(() => getUrlTab() || "overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [invitations, setInvitations] = useState<UserSeatInvitation[]>([]);
  const [, setReservedEventIds] = useState<string[]>([]);

  // Sync tab from URL query if user clicks a direct invitation link (?tab=requests)
  useEffect(() => {
    const urlTab = getUrlTab();
    if (urlTab) {
      setActiveTab(urlTab);
    }
  }, []);

  // Load initial data from EventsService & LocalStorage & Supabase
  const loadDashboardData = () => {
    const loadedEvents = EventsService.getEvents();
    setEvents(loadedEvents);

    const loadedInvitations = EventsService.getUserInvitations(user?.email || undefined);
    setInvitations(loadedInvitations);

    // Fetch live invitations from Supabase so user on any browser/device immediately sees their invite
    if (user?.email) {
      EventsService.fetchUserInvitations(user.email).then((dbInv) => {
        if (dbInv && dbInv.length > 0) {
          setInvitations(dbInv);
        }
      });
    }

    const savedRsvps = localStorage.getItem(LOCAL_STORAGE_RESERVATIONS_KEY);
    if (savedRsvps) {
      try {
        setReservedEventIds(JSON.parse(savedRsvps));
      } catch (e) {
        // ignore
      }
    } else {
      setReservedEventIds([]);
    }
  };

  useEffect(() => {
    loadDashboardData();
    window.addEventListener("precious_meets_events_updated", loadDashboardData);
    window.addEventListener("storage", loadDashboardData);

    // Realtime Supabase channel scoped STRICTLY to this user's email to avoid global broadcast egress
    let channel: any = null;
    let debounceTimer: any = null;

    if (user?.email) {
      const cleanEmail = user.email.trim().toLowerCase();
      const channelId = `member_invites_${cleanEmail.replace(/[^a-zA-Z0-9]/g, "_")}`;

      channel = supabase
        .channel(channelId)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "member_applications",
            filter: `applicant_email=eq.${cleanEmail}`,
          },
          () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
              loadDashboardData();
            }, 1000);
          }
        )
        .subscribe();
    }

    return () => {
      clearTimeout(debounceTimer);
      window.removeEventListener("precious_meets_events_updated", loadDashboardData);
      window.removeEventListener("storage", loadDashboardData);
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [user?.email]);

  const acceptedInvitations = (invitations || []).filter((i) => i && i.status === "accepted");

  const nextEvent = acceptedInvitations.length > 0 && acceptedInvitations[0] ? {
    title: acceptedInvitations[0].eventTitle || "Curated Gathering",
    dateDisplay: acceptedInvitations[0].dateDisplay || "Upcoming Date",
    neighborhood: `${acceptedInvitations[0].neighborhood || "Delhi"}, ${acceptedInvitations[0].city || "NCR"}`,
    venueName: acceptedInvitations[0].venueName || "Heritage Venue",
    gateCode: acceptedInvitations[0].secretAccessCode || "GATE-402",
  } : null;

  const seatedEvents = acceptedInvitations.map((inv) => ({
    id: inv?.eventId || "",
    title: inv?.eventTitle || "Curated Gathering",
    dateDisplay: inv?.dateDisplay || "Upcoming Date",
    neighborhood: `${inv?.neighborhood || "Delhi"}, ${inv?.city || "NCR"}`,
    venueName: inv?.venueName || "Heritage Venue",
    gateCode: inv?.secretAccessCode || "GATE-402",
    seatNumber: inv?.seatNumber || 1,
  }));

  const displayName = String(profile?.display_name || user?.user_metadata?.full_name || (user?.email ? user.email.split("@")[0] : "Member"));
  const memberId = String(subscription?.memberId || "PM-8841");
  const city = String(profile?.city || "Delhi NCR");

  let userArchetype = "The Curious Flâneur";
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem("precious_meets_latest_profile") : null;
    if (raw) {
      const p = JSON.parse(raw);
      if (p?.archetype?.title) userArchetype = p.archetype.title;
    }
  } catch (e) {
    // ignore
  }

  const pendingInvitationsCount = (invitations || []).filter((i) => i && i.status === "pending").length;

  const NAV_TABS = [
    { id: "overview", label: "Overview", icon: Sparkles, badge: null },
    {
      id: "meets",
      label: "Confirmed Meets",
      icon: Calendar,
      badge: acceptedInvitations.length > 0 ? `${acceptedInvitations.length}` : null,
    },
    {
      id: "requests",
      label: "Seat Invitations",
      icon: Mail,
      badge: pendingInvitationsCount > 0 ? `${pendingInvitationsCount}` : null,
    },
    { id: "profile", label: "Profile", icon: User, badge: null },
    { id: "questions", label: "Quiz Dossier", icon: FileQuestion, badge: null },
    { id: "invoice", label: "Receipts", icon: Receipt, badge: null },
  ];

  if (loading || !user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#FAF7F2] text-[#171514] px-4 text-center">
        <div className="flex flex-col items-center space-y-4 max-w-sm p-8 rounded-3xl border border-black/5 bg-white shadow-xl">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#691C35] border-t-transparent" />
          <h2 className="font-serif text-lg font-medium text-[#171514]">
            Verifying Member Credentials...
          </h2>
          <p className="text-xs text-muted-foreground">
            Direct access requires an authenticated member account.
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
              <span className="font-display text-xl text-white tracking-tight">
                Precious<em className="text-[#C6A568] not-italic font-serif"> meets</em>
              </span>
            </Link>
          </div>

          {/* Member Card Summary */}
          <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-3.5">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-full bg-gradient-to-tr from-[#691C35] to-[#C6A568] flex items-center justify-center text-xs font-serif font-bold text-white shadow-xs">
                {String(displayName || "PM").slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-xs text-white truncate">{displayName}</div>
                <div className="font-mono text-[10px] text-white/50 truncate">{memberId}</div>
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px]">
              <span className="text-emerald-400 font-mono flex items-center gap-1 font-semibold">
                <ShieldCheck className="size-3" /> Verified
              </span>
              <span className="text-white/40 font-mono">{city}</span>
            </div>
          </div>

          {/* Navigation Links (Minimal, sleek) */}
          <nav className="space-y-1">
            {NAV_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as DashboardTab)}
                  className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-[#691C35] text-white font-semibold shadow-sm"
                      : "text-white/70 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`size-4 ${isActive ? "text-[#C6A568]" : "text-white/60"}`} />
                    <span>{tab.label}</span>
                  </div>

                  {tab.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      isActive ? "bg-white text-[#691C35]" : "bg-[#C6A568] text-[#151212]"
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Panel Utilities */}
        <div className="space-y-1.5 pt-4 border-t border-white/10 text-xs">
          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold bg-[#E5C17D] text-[#151212] hover:bg-white transition-all shadow-md group"
            >
              <ShieldCheck className="size-4 text-[#151212] shrink-0" />
              <span className="truncate">Back to Admin Console</span>
              <span className="ml-auto text-xs opacity-70 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
            </Link>
          )}

          <Link
            to="/safety"
            className="flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-white/60 hover:text-red-400 hover:bg-white/[0.04] transition-colors"
          >
            <ShieldAlert className="size-4 text-red-400" />
            <span>24/7 Safety & SOS</span>
          </Link>

          <Link
            to="/"
            className="flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors"
          >
            <Compass className="size-4" />
            <span>Precious Meets Home</span>
          </Link>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-white/60 hover:text-red-400 hover:bg-white/[0.04] transition-colors cursor-pointer text-left"
          >
            <LogOut className="size-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MOBILE TOP BAR & NAVIGATION                                            */}
      {/* ========================================================================= */}
      <div className="lg:hidden sticky top-0 z-30 bg-[#151212] text-white px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <Link to="/" className="font-display text-lg text-white tracking-tight">
          Precious<em className="text-[#C6A568] not-italic font-serif"> meets</em>
        </Link>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E5C17D] text-[#151212] font-semibold text-[11px]"
            >
              <ShieldCheck className="size-3.5" />
              <span>Admin</span>
            </Link>
          )}
          <span className="font-mono text-[11px] text-[#C6A568] bg-white/10 px-2.5 py-1 rounded-full">
            {memberId}
          </span>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="grid size-8 place-items-center rounded-lg bg-white/10 text-white"
          >
            {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#151212] border-b border-white/10 px-4 py-3 space-y-1 animate-in fade-in slide-in-from-top-2">
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold bg-[#E5C17D] text-[#151212] mb-2"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4" />
                <span>Back to Admin Console</span>
              </div>
              <span>&rarr;</span>
            </Link>
          )}
          {NAV_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as DashboardTab);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs ${
                  isActive ? "bg-[#691C35] text-white font-semibold" : "text-white/70 hover:bg-white/[0.06]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="size-4" />
                  <span>{tab.label}</span>
                </div>
                {tab.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#C6A568] text-[#151212]">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
            <Link to="/safety" className="text-red-400">Emergency SOS</Link>
            <button onClick={handleSignOut} className="hover:text-red-400">Sign Out</button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MAIN RIGHT CONTENT AREA                                                */}
      {/* ========================================================================= */}
      <main className="lg:pl-64 xl:pl-72 min-h-screen flex flex-col justify-between">
        {isAdmin && (
          <div className="sticky top-0 z-20 bg-[#151212] border-b border-[#E5C17D]/30 px-4 sm:px-8 py-2.5 flex items-center justify-between text-xs text-white backdrop-blur-md shadow-sm">
            <div className="flex items-center gap-2.5">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-[#E5C17D]">Admin Session Preview</span>
              <span className="hidden sm:inline text-white/50 font-mono text-[11px]">— Logged in as Administrator</span>
            </div>
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5C17D] text-[#151212] font-semibold text-[11px] hover:bg-white transition-colors shadow-xs"
            >
              <ShieldCheck className="size-3.5" />
              <span>Back to Admin Console &rarr;</span>
            </Link>
          </div>
        )}
        <div className="max-w-5xl mx-auto w-full p-5 sm:p-8 lg:p-10 space-y-6">

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="animate-in fade-in duration-300 space-y-6">
              <MemberPassCard
                displayName={displayName}
                memberId={memberId}
                userArchetype={userArchetype}
                city={city}
                nextEvent={nextEvent}
                onExploreMeets={() => setActiveTab("meets")}
                onViewInvitations={() => setActiveTab("requests")}
                pendingInvitationsCount={pendingInvitationsCount}
                pendingInvitations={(invitations || []).filter((i) => i && i.status === "pending")}
                onAcceptInvitation={(inv) => {
                  try {
                    EventsService.respondToInvitation(inv.id, "accepted");
                    toast.success(
                      `Seat #${inv.seatNumber} confirmed for "${inv.eventTitle}"! Door PIN unlocked.`
                    );
                    loadDashboardData();
                  } catch (err: any) {
                    toast.error(err.message || "Failed to accept");
                  }
                }}
                onDeclineInvitation={(inv) => {
                  try {
                    EventsService.respondToInvitation(inv.id, "declined", "Passed from overview");
                    toast.info(`Invitation for "${inv.eventTitle}" politely passed.`);
                    loadDashboardData();
                  } catch (err: any) {
                    toast.error(err.message || "Failed to decline");
                  }
                }}
                seatedEvents={seatedEvents}
              />
            </div>
          )}

          {/* TAB 2: CONFIRMED MEETS */}
          {activeTab === "meets" && (
            <div className="animate-in fade-in duration-300">
              <EventsListSection
                events={events}
                acceptedInvitations={acceptedInvitations}
                pendingInvitationsCount={pendingInvitationsCount}
                onViewRequests={() => setActiveTab("requests")}
                userCity={city}
                displayName={displayName}
                memberId={memberId}
              />
            </div>
          )}

          {/* TAB 3: SEAT INVITATIONS */}
          {activeTab === "requests" && (
            <div className="animate-in fade-in duration-300">
              <SeatInvitationsSection
                invitations={invitations}
                onInvitationUpdated={loadDashboardData}
                onViewAcceptedMeets={() => setActiveTab("meets")}
              />
            </div>
          )}

          {/* TAB 4: PROFILE */}
          {activeTab === "profile" && (
            <div className="animate-in fade-in duration-300">
              <ProfileEditorSection />
            </div>
          )}

          {/* TAB 5: QUIZ DOSSIER */}
          {activeTab === "questions" && (
            <div className="animate-in fade-in duration-300">
              <QuizResponsesSection />
            </div>
          )}

          {/* TAB 6: INVOICES & RECEIPTS */}
          {activeTab === "invoice" && (
            <div className="animate-in fade-in duration-300">
              <InvoiceReceiptSection />
            </div>
          )}
        </div>

        {/* Minimal Subtle Footer */}
        <footer className="px-5 sm:px-8 lg:px-10 py-6 border-t border-black/5 text-center sm:text-left text-[11px] font-mono text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} Precious Meets Technologies Pvt. Ltd.</span>
          <div className="flex items-center gap-4">
            <Link to="/terms" className="hover:text-foreground">Terms</Link>
            <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link to="/safety" className="hover:text-red-600 font-semibold">24/7 Safety</Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
