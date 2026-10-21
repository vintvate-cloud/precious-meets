import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/lib/auth-context";
import { Sparkles, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Welcome & Onboarding — Precious Meets" },
      { name: "description", content: "Complete your onboarding preferences." },
    ],
  }),
  component: OnboardingPage,
});

function OnboardingPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [city, setCity] = useState("Delhi NCR");
  const [phone, setPhone] = useState("+91 98100 12345");
  const [bio, setBio] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Onboarding profile saved!");
    navigate({ to: "/quiz" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-ivory text-foreground">
      <Navbar />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-24">
        <div className="rounded-3xl border border-border/80 bg-card p-8 shadow-sm">
          <span className="label-mono text-xs text-forest">Welcome Onboard</span>
          <h1 className="font-display mt-2 text-3xl">
            Complete Your <em className="italic text-burgundy">Profile</em>
          </h1>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Just a few essentials before you enter the Social Discovery Quiz.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs">
            <div>
              <label className="font-semibold text-foreground">Preferred City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="Delhi NCR">Delhi NCR (Mehrauli, Hauz Khas, Sunder Nursery, CP)</option>
                <option value="Bengaluru">Bengaluru (Indiranagar, Koramangala, Lavelle Rd)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-foreground">Contact Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="mt-1 w-full rounded-md border border-input bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <div>
              <label className="font-semibold text-foreground">One line about you</label>
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="e.g. Architect loving natural wine and jazz."
                className="mt-1 w-full rounded-md border border-input bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <Button
              type="submit"
              className="w-full rounded-full bg-burgundy py-5 font-semibold text-ivory hover:bg-burgundy/90 mt-2"
            >
              Continue to Discovery Quiz &rarr;
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
