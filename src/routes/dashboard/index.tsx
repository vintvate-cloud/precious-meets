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
  const { user, profile, subscription, signOut } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [invitations, setInvitations] = useState<UserSeatInvitation[]>([]);
  const [reservedEventIds, setReservedEventIds] = useState<string[]>([]);

  // Load initial data from EventsService & LocalStorage
  const loadDashboardData = () => {
    const loadedEvents = EventsService.getEvents();
    setEvents(loadedEvents);

    const loadedInvitations = EventsService.getUserInvitations();
    setInvitations(loadedInvitations);

    const savedRsvps = localStorage.getItem(LOCAL_STORAGE_RESERVATIONS_KEY);
    if (savedRsvps) {
      try {
        setReservedEventIds(JSON.parse(savedRsvps));
      } catch (e) {
        // ignore
      }
    } else {
      // Default reserve first event for founder demo
      const initialRsvps = ["evt_delhi_supper"];
      setReservedEventIds(initialRsvps);
      localStorage.setItem(LOCAL_STORAGE_RESERVATIONS_KEY, JSON.stringify(initialRsvps));
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Handle RSVP toggle
  const handleToggleRsvp = (event: AdminEvent) => {
    let updated: string[];
    if (reservedEventIds.includes(event.id)) {
      updated = reservedEventIds.filter((id) => id !== event.id);
      toast.info(`Reservation for "${event.title}" cancelled. Seat credit retained.`);
    } else {
      updated = [...reservedEventIds, event.id];
      toast.success(
        `Seat reserved for "${event.title}"! Secret venue gate pass: ${event.secretAccessCode || "GATE-402"}`
      );
    }
    setReservedEventIds(updated);
    localStorage.setItem(LOCAL_STORAGE_RESERVATIONS_KEY, JSON.stringify(updated));
  };

  // Next confirmed event for the countdown card
  const confirmedEvents = events.filter((e) => reservedEventIds.includes(e.id));
  const nextEvent = confirmedEvents.length > 0 ? {
    title: confirmedEvents[0].title,
    dateDisplay: confirmedEvents[0].dateDisplay,
    neighborhood: `${confirmedEvents[0].neighborhood}, ${confirmedEvents[0].city}`,
    venueName: confirmedEvents[0].venueName,
    gateCode: confirmedEvents[0].secretAccessCode || "GATE-402",
  } : null;

  // Formatted seated events for the universal QR pass
  const seatedEvents = confirmedEvents.map((e, index) => ({
    id: e.id,
    title: e.title,
    dateDisplay: e.dateDisplay,
    neighborhood: `${e.neighborhood}, ${e.city}`,
    venueName: e.venueName,
    gateCode: e.secretAccessCode || "GATE-402",
    seatNumber: index + 1,
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
    { id: "meets", label: "Meets", icon: Wine, badge: null },
    {
      id: "requests",
      label: "Requests",
      icon: Mail,
      badge: pendingInvitationsCount > 0 ? pendingInvitationsCount : null,
    },
    { id: "profile", label: "Profile", icon: User, badge: null },
    { id: "questions", label: "Quiz Record", icon: FileQuestion, badge: null },
    { id: "invoice", label: "Invoices", icon: Receipt, badge: null },
  ];

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
                  <ArrowRight className="size-4 text-muted-foreground" />
                </div>
                <h4 className="font-display mt-3 text-base text-foreground">
                  Explore Curated Meets
                </h4>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  Browse upcoming 6-person dinners and reserve your complimentary seat.
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

        {/* Tab 2: MEETS & TABLE BROWSING */}
        {activeTab === "meets" && (
          <div className="animate-in fade-in duration-300">
            <EventsListSection
              events={events}
              reservedEventIds={reservedEventIds}
              onToggleRsvp={handleToggleRsvp}
              userCity={city}
            />
          </div>
        )}

        {/* Tab 3: SEAT REQUESTS & INVITATIONS */}
        {activeTab === "requests" && (
          <div className="animate-in fade-in duration-300">
            <SeatInvitationsSection
              invitations={invitations}
              onInvitationUpdated={loadDashboardData}
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
