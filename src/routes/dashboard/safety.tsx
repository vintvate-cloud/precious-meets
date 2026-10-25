import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/lib/auth-context";
import { SosModal } from "@/components/SosModal";
import { ShieldAlert, PhoneCall, UserX, AlertTriangle, ShieldCheck, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/safety")({
  head: () => ({
    meta: [
      { title: "Safety & Emergency Hub — Precious Meets" },
      { name: "description", content: "Emergency safety tools, SOS incident reports, and attendee moderation." },
    ],
  }),
  component: DashboardSafetyPage,
});

function DashboardSafetyPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [reportUser, setReportUser] = useState("");
  const [reportReason, setReportReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate({
        to: "/login",
        search: { redirect: "/dashboard/safety" } as any,
      });
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-ivory text-foreground px-4 text-center">
        <div className="flex flex-col items-center space-y-4 max-w-sm p-8 rounded-3xl border border-border/70 bg-card/90 shadow-lg backdrop-blur">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-burgundy border-t-transparent" />
          <h2 className="font-serif text-xl font-medium tracking-tight text-foreground">
            Verifying Member Credentials...
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Direct access to the safety hub requires an active member account. Redirecting you to sign in...
          </p>
        </div>
      </div>
    );
  }

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportUser || !reportReason) {
      toast.error("Please fill out both the attendee name and details.");
      return;
    }
    setSubmitted(true);
    toast.success("Confidential report received. Our moderation team will investigate.");
  };

  return (
    <div className="flex min-h-screen flex-col bg-ivory text-foreground">
      <Navbar />

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 pb-24 pt-28">
        <div className="max-w-xl">
          <span className="label-mono text-xs text-destructive">Safety Protocol</span>
          <h1 className="font-display mt-1 text-3xl md:text-4xl">
            Attendee <em className="italic text-burgundy">Safety Hub</em>
          </h1>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            We operate a zero-tolerance policy against harassment, aggressive corporate pitching, discrimination, and non-consensual behavior.
          </p>
        </div>

        {/* Emergency Hotline Grid */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5 text-center">
            <span className="text-[10px] uppercase font-mono text-destructive font-semibold">National Police</span>
            <p className="font-mono text-3xl font-bold text-destructive mt-1">112</p>
            <p className="text-[11px] text-muted-foreground mt-1">Immediate physical threat</p>
            <a
              href="tel:112"
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-destructive px-4 py-1.5 text-xs font-semibold text-destructive-foreground hover:bg-destructive/90"
            >
              <PhoneCall className="size-3" /> Call 112
            </a>
          </div>

          <div className="rounded-2xl border border-forest/30 bg-forest/5 p-5 text-center">
            <span className="text-[10px] uppercase font-mono text-forest font-semibold">Women's Helpline</span>
            <p className="font-mono text-3xl font-bold text-forest mt-1">1091</p>
            <p className="text-[11px] text-muted-foreground mt-1">24/7 National Women Helpline</p>
            <a
              href="tel:1091"
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-forest px-4 py-1.5 text-xs font-semibold text-white hover:bg-forest/90"
            >
              <PhoneCall className="size-3" /> Call 1091
            </a>
          </div>

          <div className="rounded-2xl border border-burgundy/30 bg-burgundy/5 p-5 text-center flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono text-burgundy font-semibold">App Emergency Beacon</span>
              <p className="font-display text-xl font-bold text-burgundy mt-1">Safety SOS</p>
              <p className="text-[11px] text-muted-foreground mt-1">Dispatches alert to our safety team</p>
            </div>
            <div className="mt-3">
              <SosModal />
            </div>
          </div>
        </div>

        {/* Report / Block Section */}
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 text-foreground font-display text-xl">
              <UserX className="size-5 text-destructive" />
              <span>Report an Incident or Member</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              If someone at a table violated your personal boundaries or made you uncomfortable, report them confidentially. We enforce permanent removals.
            </p>

            {submitted ? (
              <div className="mt-6 rounded-xl bg-sage/50 p-4 text-center text-xs text-forest">
                Thank you for notifying us. Your report has been escalated to senior moderation.
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="mt-6 space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-foreground">Attendee Name or Meet Reference</label>
                  <input
                    type="text"
                    required
                    value={reportUser}
                    onChange={(e) => setReportUser(e.target.value)}
                    placeholder="e.g. Guest at Mehrauli Supper Club"
                    className="mt-1 w-full rounded-md border border-input bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>

                <div>
                  <label className="font-semibold text-foreground">Details of Occurrence</label>
                  <textarea
                    required
                    rows={4}
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    placeholder="Please explain what took place..."
                    className="mt-1 w-full rounded-md border border-input bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-full bg-ink py-4 text-xs font-semibold text-ivory hover:bg-burgundy"
                >
                  Submit Confidential Report
                </Button>
              </form>
            )}
          </div>

          {/* Table Code of Conduct */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm space-y-4 text-xs">
            <div className="flex items-center gap-2 text-foreground font-display text-xl">
              <HeartHandshake className="size-5 text-forest" />
              <span>The Table Agreements</span>
            </div>

            <div className="space-y-3 pt-2 text-muted-foreground leading-relaxed">
              <div className="flex items-start gap-2">
                <span className="font-mono text-burgundy font-bold">1.</span>
                <p><strong className="text-foreground">No Unsolicited Commercial Pitching:</strong> Tables are protected spaces for human curiosity, not startup investor pitches.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-mono text-burgundy font-bold">2.</span>
                <p><strong className="text-foreground">Absolute Consent & Space:</strong> Everyone has the right to step away, decline conversation topics, or decline sharing personal contact details.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-mono text-burgundy font-bold">3.</span>
                <p><strong className="text-foreground">Verified Human Trust:</strong> All members undergo offline identity checks to keep tables accountable and safe.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
