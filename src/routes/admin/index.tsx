import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/lib/auth-context";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Operations Console — Precious Meets" },
      { name: "description", content: "Executive management for experiences, bookings, verifications, and SOS safety." },
    ],
  }),
  component: AdminConsolePage,
});

function AdminConsolePage() {
  const { user, profile, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "incidents" | "verifications" | "bookings">("overview");

  // Sample operational data
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

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-24 pt-28">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-border/80 pb-6 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="label-mono text-xs text-burgundy font-bold">Admin Console</span>
              <span className="rounded-full bg-burgundy/15 px-2.5 py-0.5 text-[10px] font-semibold text-burgundy">
                Executive Access
              </span>
            </div>
            <h1 className="font-display mt-2 text-3xl md:text-4xl">
              Platform <em className="italic text-burgundy">Operations & Safety</em>
            </h1>
          </div>

          {/* Sub Navigation */}
          <div className="flex items-center gap-2">
            {[
              { id: "overview", label: "Metrics" },
              { id: "incidents", label: "SOS Incidents" },
              { id: "verifications", label: "ID Verification" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  activeTab === tab.id
                    ? "bg-burgundy text-ivory"
                    : "border border-border/80 bg-card text-muted-foreground hover:bg-sage/40"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* METRICS TAB */}
        {activeTab === "overview" && (
          <div className="mt-8 space-y-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-medium">Total Registered Members</span>
                  <Users className="size-4 text-forest" />
                </div>
                <p className="font-display mt-3 text-3xl font-bold">1,482</p>
                <p className="mt-1 text-[11px] text-forest">↑ +24% this week</p>
              </div>

              <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-medium">Verified Attendees</span>
                  <ShieldCheck className="size-4 text-forest" />
                </div>
                <p className="font-display mt-3 text-3xl font-bold">1,210</p>
                <p className="mt-1 text-[11px] text-muted-foreground">81.6% verification rate</p>
              </div>

              <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-medium">Gross Bookings Revenue</span>
                  <CreditCard className="size-4 text-burgundy" />
                </div>
                <p className="font-mono mt-3 text-3xl font-bold text-burgundy">₹4,82,500</p>
                <p className="mt-1 text-[11px] text-muted-foreground">Razorpay captured</p>
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
                    <tr>
                      <td className="py-3 font-medium">The Long Table Supper</td>
                      <td className="py-3 text-muted-foreground">Mehrauli, Delhi NCR</td>
                      <td className="py-3 font-mono">₹2,499</td>
                      <td className="py-3">2 / 6 seats</td>
                      <td className="py-3">
                        <span className="rounded-full bg-forest/20 px-2.5 py-0.5 text-[10px] font-semibold text-forest">
                          Published
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 font-medium">Slow Coffee & Vinyl Sunday</td>
                      <td className="py-3 text-muted-foreground">Indiranagar, Bengaluru</td>
                      <td className="py-3 font-mono">₹1,199</td>
                      <td className="py-3">4 / 6 seats</td>
                      <td className="py-3">
                        <span className="rounded-full bg-forest/20 px-2.5 py-0.5 text-[10px] font-semibold text-forest">
                          Published
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 font-medium">After-Dark Walk & Wine</td>
                      <td className="py-3 text-muted-foreground">Hauz Khas, Delhi</td>
                      <td className="py-3 font-mono">₹1,899</td>
                      <td className="py-3">1 / 6 seats</td>
                      <td className="py-3">
                        <span className="rounded-full bg-forest/20 px-2.5 py-0.5 text-[10px] font-semibold text-forest">
                          Published
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SOS INCIDENTS TAB */}
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

        {/* VERIFICATIONS TAB */}
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

      <Footer />
    </div>
  );
}
