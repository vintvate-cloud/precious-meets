import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { type SocialProfileScores } from "@/lib/scoring-engine";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Sparkles, Calendar, ArrowRight, ShieldCheck, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/quiz/results")({
  head: () => ({
    meta: [
      { title: "Your Social Discovery Profile — Precious Meets" },
      { name: "description", content: "Your social archetype and compatible tables." },
    ],
  }),
  component: QuizResultsPage,
});

function QuizResultsPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<SocialProfileScores | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("precious_meets_latest_profile");
    if (raw) {
      try {
        setProfile(JSON.parse(raw));
      } catch (e) {
        // Ignore
      }
    }
  }, []);

  if (!profile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-ivory px-4 text-center">
        <h1 className="font-display text-3xl">No Quiz Results Found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Take our 5-minute discovery quiz to uncover your social archetype.
        </p>
        <Link
          to="/quiz"
          className="mt-6 rounded-full bg-burgundy px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-ivory hover:bg-burgundy/90"
        >
          Take the Quiz
        </Link>
      </div>
    );
  }

  const { archetype, dimensions } = profile;

  return (
    <div className="flex min-h-screen flex-col bg-ivory text-foreground">
      <Navbar />

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 pb-24 pt-28">
        {/* Header Hero */}
        <div className="text-center">
          <span className="label-mono rounded-full bg-sage/80 px-4 py-1.5 text-xs text-forest">
            Social Discovery Insights · Algorithm {profile.algorithmVersion}
          </span>
          <h1 className="font-display mt-6 text-4xl leading-tight md:text-6xl">
            You are <em className="italic text-burgundy">{archetype.title}</em>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            {archetype.description}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {archetype.keyTraits.map((t) => (
              <span
                key={t}
                className="rounded-full border border-border/80 bg-card px-3.5 py-1 text-xs font-medium text-foreground"
              >
                ✦ {t}
              </span>
            ))}
          </div>
        </div>

        {/* 5 Dimension Breakdown */}
        <div className="mt-16 rounded-2xl border border-border/80 bg-card/70 p-8 shadow-sm">
          <h2 className="font-display text-2xl">Your Social Spectrum</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            These traits are used to seat complementary minds together without echo chambers.
          </p>

          <div className="mt-8 space-y-5">
            <div>
              <div className="flex justify-between text-xs font-semibold">
                <span>Social Energy</span>
                <span className="font-mono text-burgundy">{dimensions.socialEnergy}%</span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-sage/50">
                <div
                  className="h-full bg-burgundy rounded-full transition-all"
                  style={{ width: `${dimensions.socialEnergy}%` }}
                />
              </div>
              <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                <span>Reflective & Grounded</span>
                <span>Vibrant & Expressive</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold">
                <span>Conversation Depth</span>
                <span className="font-mono text-burgundy">{dimensions.conversationDepth}%</span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-sage/50">
                <div
                  className="h-full bg-forest rounded-full transition-all"
                  style={{ width: `${dimensions.conversationDepth}%` }}
                />
              </div>
              <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                <span>Playful Banter</span>
                <span>Existential & Philosophical</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold">
                <span>Curiosity & Breadth</span>
                <span className="font-mono text-burgundy">{dimensions.curiosity}%</span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-sage/50">
                <div
                  className="h-full bg-ochre rounded-full transition-all"
                  style={{ width: `${dimensions.curiosity}%` }}
                />
              </div>
              <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                <span>Specialized</span>
                <span>Eclectic & Polymathic</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold">
                <span>Adventure & Spontaneity</span>
                <span className="font-mono text-burgundy">{dimensions.adventure}%</span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-sage/50">
                <div
                  className="h-full bg-ink rounded-full transition-all"
                  style={{ width: `${dimensions.adventure}%` }}
                />
              </div>
              <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                <span>Structured & Familiar</span>
                <span>Bold & Spontaneous</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Matches CTA */}
        <div className="mt-14 rounded-2xl border border-burgundy/30 bg-burgundy p-8 text-ivory">
          <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
            <div>
              <h3 className="font-display text-2xl md:text-3xl">Tables Compatible with Your Rhythm</h3>
              <p className="mt-2 text-xs leading-relaxed text-ivory/80">
                We have 3 curated upcoming meets in {dimensions.preferredCity} with seats matched to your profile.
              </p>
            </div>
            <Link
              to="/experiences"
              className="flex items-center gap-2 rounded-full bg-ivory px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-burgundy shadow-sm hover:bg-card"
            >
              Explore Compatible Meets <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
