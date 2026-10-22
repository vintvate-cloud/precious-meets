import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/lib/auth-context";
import {
  EventsService,
  AdminEvent,
  AdminAttendee,
} from "@/lib/events-service";
import { InteractiveTable } from "@/components/admin/InteractiveTable";
import { EventFormModal } from "@/components/admin/EventFormModal";
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  Calendar,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  Plus,
  Edit3,
  Trash2,
  Clock,
  Sparkles,
  MapPin,
  Utensils,
  Archive,
  ArrowRight,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
  const { user, profile, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<"events" | "overview" | "incidents" | "verifications">("events");

  // Events & Seating State
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [attendees, setAttendees] = useState<AdminAttendee[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [eventFilter, setEventFilter] = useState<"upcoming" | "past" | "all">("upcoming");

  // Modal State
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AdminEvent | null>(null);

  // Load events and attendees from service
  useEffect(() => {
    const loadedEvents = EventsService.getEvents();
    const loadedAttendees = EventsService.getAttendees();
    setEvents(loadedEvents);
    setAttendees(loadedAttendees);

    if (loadedEvents.length > 0 && !selectedEventId) {
      // Default select the first upcoming event
      const firstUpcoming = loadedEvents.find((e) => e.status !== "completed") || loadedEvents[0];
      setSelectedEventId(firstUpcoming.id);
    }
  }, []);

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
    const updated = EventsService.updateEvent(event.id, { status: nextStatus });
    setEvents(EventsService.getEvents());
    toast.success(
      nextStatus === "completed"
        ? `"${event.title}" archived as Concluded Meet.`
        : `"${event.title}" reinstated as Upcoming Meet.`
    );
  };

  const handleEventUpdated = (updated: AdminEvent) => {
    setEvents(EventsService.getEvents());
  };

  // Sample operational SOS & verification data
  const [incidents, setIncidents] = useState([
    {
      id: "inc_01",
      reference: "SOS-K89A2-Z11",
      userName: "Aria Sharma",
      userEmail: "aria.sharma@example.com",
      category: "discomfort",
      status: "open",
      createdAt: "14 mins ago",
      bookingRef: "PM-X92F8A",
      location: "Mehrauli, Delhi NCR (GPS Attached)",
    },
    {
      id: "inc_02",
      reference: "SOS-M44C9-B02",
      userName: "Rohan Patel",
      userEmail: "rohan.p@example.com",
      category: "venue_safety",
      status: "acknowledged",
      createdAt: "2 hours ago",
      bookingRef: "PM-B33G19",
      location: "Indiranagar, Bengaluru",
    },
  ]);

  const [verifications, setVerifications] = useState([
    {
      id: "ver_01",
      userName: "Ananya Deshmukh",
      email: "ananya.d@example.com",
      method: "digilocker_consent_offline",
      status: "pending",
      requestedAt: "Today, 2:15 PM",
    },
    {
      id: "ver_02",
      userName: "Vikram Sengupta",
      email: "vikram.s@example.com",
      method: "digilocker_consent_offline",
      status: "manual_review",
      requestedAt: "Yesterday, 6:40 PM",
    },
  ]);

  const handleResolveIncident = (id: string) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, status: "resolved" } : inc)),
    );
    toast.success("Incident marked as resolved. Audit logged.");
  };

  const handleUpdateVerification = (id: string, status: "verified" | "failed") => {
    setVerifications((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status } : v)),
    );
    toast.success(`Verification status updated to ${status}.`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-ivory text-foreground">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 pb-24 pt-28">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-border/80 pb-6 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="label-mono text-xs text-burgundy font-bold">Admin Console</span>
              <span className="rounded-full bg-burgundy/15 px-2.5 py-0.5 text-[10px] font-semibold text-burgundy">
                Executive Access
              </span>
            </div>
            <h1 className="font-display mt-2 text-3xl sm:text-4xl">
              Salons, <em className="italic text-burgundy">Seating & Safety Operations</em>
            </h1>
          </div>

          {/* Master Tabs - Simplified */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "events", label: "Meets & Seating" },
              { id: "overview", label: "Metrics" },
              { id: "incidents", label: "SOS Alerts" },
              { id: "verifications", label: "Verifications" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300 active:scale-95 cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-burgundy text-ivory shadow-md scale-100 ring-2 ring-burgundy/20"
                    : "border border-border/80 bg-card text-muted-foreground hover:bg-sage/40 hover:text-foreground hover:border-border"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 1. EVENTS & INTERACTIVE TABLE SEATING TAB */}
        {activeTab === "events" && (
          <div className="mt-6 space-y-4">
            {/* Top Toolbar: Simplified Filter Chips + "+ Host Meet" Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setEventFilter("upcoming")}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 active:scale-95 cursor-pointer ${
                    eventFilter === "upcoming"
                      ? "bg-foreground text-background shadow-xs ring-1 ring-foreground/20"
                      : "border border-border/80 bg-card text-muted-foreground hover:bg-sage/40 hover:text-foreground"
                  }`}
                >
                  Upcoming ({events.filter((e) => e.status !== "completed").length})
                </button>
                <button
                  type="button"
                  onClick={() => setEventFilter("past")}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 active:scale-95 cursor-pointer ${
                    eventFilter === "past"
                      ? "bg-foreground text-background shadow-xs ring-1 ring-foreground/20"
                      : "border border-border/80 bg-card text-muted-foreground hover:bg-sage/40 hover:text-foreground"
                  }`}
                >
                  Past ({events.filter((e) => e.status === "completed").length})
                </button>
                <button
                  type="button"
                  onClick={() => setEventFilter("all")}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 active:scale-95 cursor-pointer ${
                    eventFilter === "all"
                      ? "bg-foreground text-background shadow-xs ring-1 ring-foreground/20"
                      : "border border-border/80 bg-card text-muted-foreground hover:bg-sage/40 hover:text-foreground"
                  }`}
                >
                  All ({events.length})
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingEvent(null);
                  setEventModalOpen(true);
                }}
                className="flex items-center gap-2 rounded-full bg-forest px-5 py-2 text-xs font-semibold text-ivory shadow-md transition-all duration-300 hover:bg-forest/90 hover:scale-105 hover:shadow-lg active:scale-95 cursor-pointer group"
              >
                <Plus className="size-3.5 transition-transform duration-300 group-hover:rotate-90" />
                <span>Host Meet</span>
              </button>
            </div>

            {/* Split Screen Layout: Left & Right scroll independently on desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start lg:h-[calc(100vh-215px)] lg:overflow-hidden">
              {/* Left Column: Events Directory (4 cols) - Independently Scrollable */}
              <div className="lg:col-span-4 lg:h-full lg:overflow-y-auto admin-scroll pr-1.5 space-y-3">
                <div className="flex items-center justify-between pb-1">
                  <span className="label-mono text-[11px] text-muted-foreground uppercase font-bold tracking-wider">
                    Meets Directory ({filteredEvents.length})
                  </span>
                  <span className="text-[10px] text-muted-foreground">Scroll to browse</span>
                </div>

                {filteredEvents.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground">
                    No meets found under this filter.
                  </div>
                ) : (
                  filteredEvents.map((evt) => {
                    const isSelected = evt.id === selectedEventId;
                    const seatedCount = evt.seats.filter(Boolean).length;

                    return (
                      <div
                        key={evt.id}
                        onClick={() => setSelectedEventId(evt.id)}
                        className={`group relative overflow-hidden rounded-2xl border p-4 transition-all duration-300 cursor-pointer ${
                          isSelected
                            ? "border-burgundy border-l-4 border-l-burgundy bg-burgundy/[0.04] shadow-md ring-1 ring-burgundy/30 -translate-y-0.5"
                            : "border-border/80 bg-card hover:border-burgundy/40 hover:bg-sage/10 hover:-translate-y-0.5 hover:shadow-sm"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className={`rounded-full px-2 py-0.2 text-[9px] font-mono uppercase font-bold flex items-center gap-1 ${
                                  evt.status === "published"
                                    ? "bg-forest/15 text-forest"
                                    : evt.status === "completed"
                                    ? "bg-muted text-muted-foreground"
                                    : "bg-ochre/15 text-ochre"
                                }`}
                              >
                                <span className={`size-1.5 rounded-full ${evt.status === "published" ? "bg-forest animate-pulse" : "bg-muted-foreground"}`} />
                                {evt.status}
                              </span>
                              <span className="text-[11px] font-medium text-forest">
                                {evt.city}
                              </span>
                            </div>

                            <h3 className="font-display mt-1.5 text-base sm:text-lg font-medium leading-snug group-hover:text-burgundy transition-colors truncate">
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
                            <ArrowRight className="size-3.5 text-muted-foreground ml-auto mt-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 text-burgundy" />
                          </div>
                        </div>

                        {/* Seating Progress Pill */}
                        <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-2 text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className={`flex size-2 rounded-full ${seatedCount === 6 ? "bg-forest" : "bg-burgundy"}`} />
                            <span className="font-medium text-foreground text-[11px]">
                              {seatedCount} / 6 Seated
                            </span>
                            {seatedCount === 6 && (
                              <span className="text-[9px] text-forest font-bold font-mono bg-forest/10 px-1.5 py-0.2 rounded-full">
                                Full
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              title="Edit Details"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingEvent(evt);
                                setEventModalOpen(true);
                              }}
                              className="rounded-full p-1.5 text-muted-foreground hover:bg-sage/50 hover:text-foreground transition-all duration-200 hover:scale-110 active:scale-90"
                            >
                              <Edit3 className="size-3.5" />
                            </button>

                            <button
                              type="button"
                              title={evt.status === "completed" ? "Reinstate as Upcoming" : "Mark as Concluded"}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleStatus(evt);
                              }}
                              className="rounded-full p-1.5 text-muted-foreground hover:bg-sage/50 hover:text-forest transition-all duration-200 hover:scale-110 active:scale-90"
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
                              className="rounded-full p-1.5 text-muted-foreground hover:bg-destructive/20 hover:text-destructive transition-all duration-200 hover:scale-110 active:scale-90"
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

              {/* Right Column: Interactive 6-Seater Table Room (8 cols) - Independently Scrollable */}
              <div className="lg:col-span-8 lg:h-full lg:overflow-y-auto admin-scroll pr-1">
                {selectedEvent ? (
                  <InteractiveTable
                    event={selectedEvent}
                    attendees={attendees}
                    onEventUpdated={handleEventUpdated}
                  />
                ) : (
                  <div className="rounded-3xl border border-dashed border-border p-16 text-center text-muted-foreground">
                    <Utensils className="mx-auto size-12 text-muted-foreground/40 mb-3" />
                    <h3 className="font-display text-2xl">No Meet Selected</h3>
                    <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                      Choose an event from the left directory or click "+ Host Meet" to configure 6-seat table seating.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 2. EXECUTIVE METRICS TAB */}
        {activeTab === "overview" && (
          <div className="mt-8 space-y-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-medium">Total Registered Members</span>
                  <Users className="size-4 text-forest" />
                </div>
                <p className="font-display mt-3 text-3xl font-bold">1,482</p>
                <p className="mt-1 text-[11px] text-forest">↑ +24% this week in Delhi NCR</p>
              </div>

              <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-medium">Verified Attendees</span>
                  <ShieldCheck className="size-4 text-forest" />
                </div>
                <p className="font-display mt-3 text-3xl font-bold">1,210</p>
                <p className="mt-1 text-[11px] text-muted-foreground">81.6% DigiLocker Aadhaar verification</p>
              </div>

              <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-medium">Gross Bookings Revenue</span>
                  <CreditCard className="size-4 text-burgundy" />
                </div>
                <p className="font-mono mt-3 text-3xl font-bold text-burgundy">₹4,82,500</p>
                <p className="mt-1 text-[11px] text-muted-foreground">Razorpay captured passes</p>
              </div>

              <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 shadow-sm">
                <div className="flex items-center justify-between text-destructive">
                  <span className="text-xs font-medium">Active SOS Incidents</span>
                  <ShieldAlert className="size-4 animate-pulse" />
                </div>
                <p className="font-display mt-3 text-3xl font-bold text-destructive">
                  {incidents.filter((i) => i.status !== "resolved").length}
                </p>
                <p className="mt-1 text-[11px] text-destructive">Requires safety attention</p>
              </div>
            </div>

            {/* Quick Experiences table */}
            <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm">
              <h2 className="font-display text-2xl">Active Experiences Across Cities</h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border/60 text-muted-foreground">
                    <tr>
                      <th className="pb-3">Experience</th>
                      <th className="pb-3">City</th>
                      <th className="pb-3">Price</th>
                      <th className="pb-3">Booked / Total</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {events.map((evt) => (
                      <tr key={evt.id}>
                        <td className="py-3 font-medium">{evt.title}</td>
                        <td className="py-3 text-muted-foreground">{evt.city} ({evt.neighborhood})</td>
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
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. SOS INCIDENTS TAB */}
        {activeTab === "incidents" && (
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl text-destructive">Emergency SOS Incidents</h2>
                <p className="text-xs text-muted-foreground">
                  Live reports transmitted from active bookings and attendee views.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {incidents.map((inc) => (
                <div
                  key={inc.id}
                  className={`rounded-2xl border p-6 transition-all ${
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
                      <h3 className="font-display mt-2 text-xl font-medium">
                        Reported by {inc.userName} ({inc.userEmail})
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
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
                          onClick={() => handleResolveIncident(inc.id)}
                          className="text-xs rounded-full"
                        >
                          Mark as Resolved
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. VERIFICATIONS TAB */}
        {activeTab === "verifications" && (
          <div className="mt-8 space-y-4">
            <div>
              <h2 className="font-display text-2xl">Aadhaar Offline Verification Queue</h2>
              <p className="text-xs text-muted-foreground">
                Consent-based verification records from DigiLocker partner API.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border/60 text-muted-foreground">
                    <tr>
                      <th className="pb-3">User</th>
                      <th className="pb-3">Method</th>
                      <th className="pb-3">Requested At</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {verifications.map((v) => (
                      <tr key={v.id}>
                        <td className="py-4">
                          <p className="font-medium text-foreground">{v.userName}</p>
                          <p className="text-[11px] text-muted-foreground">{v.email}</p>
                        </td>
                        <td className="py-4 font-mono text-[11px] text-muted-foreground">
                          {v.method}
                        </td>
                        <td className="py-4 text-muted-foreground">{v.requestedAt}</td>
                        <td className="py-4">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                              v.status === "verified"
                                ? "bg-forest/20 text-forest"
                                : v.status === "pending"
                                ? "bg-ochre/20 text-ochre"
                                : "bg-destructive/15 text-destructive"
                            }`}
                          >
                            {v.status}
                          </span>
                        </td>
                        <td className="py-4 text-right space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => handleUpdateVerification(v.id, "verified")}
                            className="text-[11px] h-7 px-3 text-forest border-forest/30"
                          >
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleUpdateVerification(v.id, "failed")}
                            className="text-[11px] h-7 px-3"
                          >
                            Reject
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

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

      <Footer />
    </div>
  );
}
