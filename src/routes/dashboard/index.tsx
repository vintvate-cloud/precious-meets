import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/lib/auth-context";
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
  Ticket,
  Wine,
  Mail,
  User,
  FileQuestion,
  Receipt,
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({
    meta: [
      { title: "Member Experience Hub — Precious Meets" },
      {
        name: "description",
        content:
          "Exclusive mobile-friendly member portal for 6-person curated meets, table invitations, profile customization, and payment receipts.",
      },
    ],
  }),
  component: DashboardPage,
});

const LOCAL_STORAGE_RESERVATIONS_KEY = "precious_meets_member_rsvps";

type DashboardTab = "overview" | "meets" | "requests" | "profile" | "questions" | "invoice";

export function DashboardPage() {
  const { user, profile, subscription, signOut, loading } = useAuth();
  const navigate = useNavigate();

  // Security Gate: Direct access without authentication is blocked
  useEffect(() => {
    if (!loading && !user) {
      navigate({
        to: "/login",
        search: { redirect: "/dashboard" } as any,
      });
    }
  }, [user, loading, navigate]);

  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [invitations, setInvitations] = useState<UserSeatInvitation[]>([]);
  const [reservedEventIds, setReservedEventIds] = useState<string[]>([]);

  // Load initial data from EventsService & LocalStorage
  const loadDashboardData = () => {
    const loadedEvents = EventsService.getEvents();
    setEvents(loadedEvents);

    const loadedInvitations = EventsService.getUserInvitations(user?.email || undefined);
    setInvitations(loadedInvitations);

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
    return () => {
      window.removeEventListener("precious_meets_events_updated", loadDashboardData);
      window.removeEventListener("storage", loadDashboardData);
    };
  }, [user?.email]);

  // Only accepted invitations represent confirmed meets the user can attend
  const acceptedInvitations = invitations.filter((i) => i.status === "accepted");

  // Next confirmed event for the countdown card
  const nextEvent = acceptedInvitations.length > 0 ? {
    title: acceptedInvitations[0].eventTitle,
    dateDisplay: acceptedInvitations[0].dateDisplay,
    neighborhood: `${acceptedInvitations[0].neighborhood}, ${acceptedInvitations[0].city}`,
    venueName: acceptedInvitations[0].venueName,
    gateCode: acceptedInvitations[0].secretAccessCode || "GATE-402",
  } : null;

  // Formatted seated events for the universal QR pass
  const seatedEvents = acceptedInvitations.map((inv) => ({
    id: inv.eventId,
    title: inv.eventTitle,
    dateDisplay: inv.dateDisplay,
    neighborhood: `${inv.neighborhood}, ${inv.city}`,
    venueName: inv.venueName,
    gateCode: inv.secretAccessCode || "GATE-402",
    seatNumber: inv.seatNumber,
  }));

  const displayName = profile?.display_name || user?.user_metadata?.full_name || "Founding Member";
  const memberId = subscription?.memberId || "PM-FOUNDER-8841";
  const city = profile?.city || "Delhi NCR";

  // Read archetype
  let userArchetype = "The Curious Flâneur";
  try {
    const raw = localStorage.getItem("precious_meets_latest_profile");
    if (raw) {
      const p = JSON.parse(raw);
      if (p?.archetype?.title) userArchetype = p.archetype.title;
    }
  } catch (e) {
    // ignore
  }

  const pendingInvitationsCount = invitations.filter((i) => i.status === "pending").length;

  const NAV_TABS = [
    { id: "overview", label: "Overview", icon: Sparkles, badge: null },
    {
      id: "meets",
      label: "Meets",
      icon: Wine,
      badge: acceptedInvitations.length > 0 ? `${acceptedInvitations.length}` : null,
    },
    {
      id: "requests",
      label: "Requests",
      icon: Mail,
      badge: pendingInvitationsCount > 0 ? `${pendingInvitationsCount} New` : null,
    },
    { id: "profile", label: "Profile", icon: User, badge: null },
    { id: "questions", label: "Quiz Record", icon: FileQuestion, badge: null },
    { id: "invoice", label: "Invoices", icon: Receipt, badge: null },
  ];

  if (loading || !user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-ivory text-foreground px-4 text-center">
        <div className="flex flex-col items-center space-y-4 max-w-sm p-8 rounded-3xl border border-border/70 bg-card/90 shadow-lg backdrop-blur">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-burgundy border-t-transparent" />
          <h2 className="font-serif text-xl font-medium tracking-tight text-foreground">
            Verifying Member Credentials...
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Direct access to the salon dashboard requires an authenticated member account. Redirecting you to sign in...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-ivory text-foreground selection:bg-burgundy/20">
      <Navbar />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 sm:px-6 pb-28 pt-24 sm:pt-28">
        {/* Mobile Sticky / Floating Segmented Tab Control */}
        <div className="sticky top-18 z-40 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0 py-2 backdrop-blur-md bg-ivory/80">
          <div className="flex items-center gap-1.5 overflow-x-auto rounded-full border border-border/80 bg-card p-1.5 shadow-sm scrollbar-none">
            {NAV_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as DashboardTab)}
                  className={`relative flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-burgundy text-ivory shadow-sm scale-100 font-bold"
                      : "text-muted-foreground hover:bg-sage/40 hover:text-foreground"
                  }`}
                >
                  <Icon className="size-3.5" />
                  <span>{tab.label}</span>

                  {tab.badge && (
                    <span className="grid size-4.5 place-items-center rounded-full bg-ochre text-[10px] font-bold text-ink shadow-xs">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab 1: OVERVIEW & VIP PASSCARD */}
        {activeTab === "overview" && (
          <div className="animate-in fade-in duration-300">
            <MemberPassCard
              displayName={displayName}
              memberId={memberId}
              userArchetype={userArchetype}
              city={city}
              nextEvent={nextEvent}
              onExploreMeets={() => setActiveTab("meets")}
              onViewInvitations={() => setActiveTab("requests")}
              pendingInvitationsCount={pendingInvitationsCount}
              seatedEvents={seatedEvents}
            />

            {/* Quick Link Cards to other sections */}
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <button
                onClick={() => setActiveTab("meets")}
                className="rounded-3xl border border-border/80 bg-card p-5 text-left transition-all hover:border-burgundy/40 hover:shadow-sm cursor-pointer"
              >
                <div className="flex items-center justify-between text-burgundy">
                  <Wine className="size-5" />
                  {acceptedInvitations.length > 0 && (
                    <span className="rounded-full bg-forest/20 text-forest font-mono text-[10px] font-bold px-2 py-0.5">
                      {acceptedInvitations.length} Booked
                    </span>
                  )}
                  {acceptedInvitations.length === 0 && <ArrowRight className="size-4 text-muted-foreground" />}
                </div>
                <h4 className="font-display mt-3 text-base text-foreground">
                  My Confirmed Meets
                </h4>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  View accepted 6-person tables, your allocated seat, and secret gate PIN.
                </p>
              </button>

              <button
                onClick={() => setActiveTab("requests")}
                className="relative rounded-3xl border border-border/80 bg-card p-5 text-left transition-all hover:border-ochre/50 hover:shadow-sm cursor-pointer"
              >
                {pendingInvitationsCount > 0 && (
                  <span className="absolute top-4 right-4 rounded-full bg-ochre px-2 py-0.5 font-mono text-[10px] font-bold text-ink">
                    {pendingInvitationsCount} New
                  </span>
                )}
                <div className="flex items-center justify-between text-ochre">
                  <Mail className="size-5" />
                  {pendingInvitationsCount === 0 && <ArrowRight className="size-4 text-muted-foreground" />}
                </div>
                <h4 className="font-display mt-3 text-base text-foreground">
                  Seat Invitations
                </h4>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  Review personal invitations dispatched by our table curators.
                </p>
              </button>

              <button
                onClick={() => setActiveTab("invoice")}
                className="rounded-3xl border border-border/80 bg-card p-5 text-left transition-all hover:border-forest/40 hover:shadow-sm cursor-pointer"
              >
                <div className="flex items-center justify-between text-forest">
                  <Receipt className="size-5" />
                  <ArrowRight className="size-4 text-muted-foreground" />
                </div>
                <h4 className="font-display mt-3 text-base text-foreground">
                  Official Invoices & Tax Receipts
                </h4>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  Download or print verified payment receipts and application records.
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: MEETS & TABLE PASSES (ONLY ACCEPTED MEETS) */}
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

        {/* Tab 3: SEAT REQUESTS & INVITATIONS */}
        {activeTab === "requests" && (
          <div className="animate-in fade-in duration-300">
            <SeatInvitationsSection
              invitations={invitations}
              onInvitationUpdated={loadDashboardData}
              onViewAcceptedMeets={() => setActiveTab("meets")}
            />
          </div>
        )}

        {/* Tab 4: MANAGE PROFILE & PREFERENCES */}
        {activeTab === "profile" && (
          <div className="animate-in fade-in duration-300">
            <ProfileEditorSection />
          </div>
        )}

        {/* Tab 5: FILLED QUESTIONS & DISCOVERY QUIZ RECORD */}
        {activeTab === "questions" && (
          <div className="animate-in fade-in duration-300">
            <QuizResponsesSection />
          </div>
        )}

        {/* Tab 6: PAYMENT INVOICE & TAX RECEIPT */}
        {activeTab === "invoice" && (
          <div className="animate-in fade-in duration-300">
            <InvoiceReceiptSection />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
