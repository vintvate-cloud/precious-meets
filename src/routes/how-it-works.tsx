import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Sparkles, Users, Utensils, ShieldCheck, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How It Works — Precious Meets" },
      { name: "description", content: "The philosophy, matching mechanics, and table rituals behind Precious Meets." },
    ],
  }),
  component: HowItWorksPage,
});

function HowItWorksPage() {
  const steps = [
    {
      num: "01",
      title: "The Discovery Quiz",
      desc: "Complete 9 intentional questions examining your conversational tempo, social battery, and emotional curiosity. Zero corporate credentials, strictly who you are beneath the noise.",
      icon: <Sparkles className="size-6 text-burgundy" />,
    },
    {
      num: "02",
      title: "Psychometric Table Curation",
      desc: "Our matching engine curates tables of 4–6 compatible people. We balance energy levels to ensure everyone speaks, listens, and feels at ease.",
      icon: <Users className="size-6 text-forest" />,
    },
    {
      num: "03",
      title: "100% Offline Aadhaar Verification",
      desc: "Zero anonymity. Every single guest verifies their legal identity via UIDAI DigiLocker before receiving a table pass. In Delhi NCR, this eliminates predatory behavior before you ever step through the door.",
      icon: <ShieldCheck className="size-6 text-ochre" />,
    },
    {
      num: "04",
      title: "The Long Table Gathering",
      desc: "Arrive at an intimate private venue like Mehrauli, Hauz Khas, and many more. Share an unhurried 4-course meal guided by a vetted, trained host.",
      icon: <Utensils className="size-6 text-burgundy" />,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-ivory text-foreground">
      <Navbar />

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 pb-24 pt-28">
        <div className="text-center max-w-2xl mx-auto">
          <span className="label-mono text-xs text-forest">The Precious Meets Protocol</span>
          <h1 className="font-display mt-3 text-4xl leading-tight md:text-6xl">
            From Strangers to <em className="italic text-burgundy">Stories</em>
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Modern cities are crowded yet lonely. Precious Meets creates intentional small tables where authentic conversation replaces superficial nightlife, backed by India's strictest trust and safety architecture.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2">
          {steps.map((s) => (
            <div
              key={s.num}
              className="flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-sage/40">{s.icon}</div>
                  <span className="font-mono text-2xl font-bold text-muted-foreground/40">{s.num}</span>
                </div>
                <h3 className="font-display mt-6 text-2xl font-normal">{s.title}</h3>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Women Safety & Aadhaar Verification Focus Banner */}
        <div className="mt-16 rounded-3xl border border-forest/30 bg-sage/20 p-8 sm:p-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-forest/10 px-3 py-1 text-xs font-semibold text-forest">
                <ShieldCheck className="size-4" />
                Delhi NCR Women-First Safety Architecture
              </div>
              <h2 className="font-display mt-3 text-2xl sm:text-3xl text-foreground">
                Engineered for women who love meeting people, but rightfully distrust the city.
              </h2>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                Delhi's social landscape is plagued by catfishing, aggressive clubs, and predatory anonymity. We fix this at the root: 100% offline Aadhaar verification through DigiLocker, strict 50:50 gender ratios, private secluded venues, and a 24/7 Safety SOS beacon.
              </p>
            </div>
            <div className="shrink-0">
              <Link
                to="/philosophy"
                className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-xs font-semibold uppercase tracking-wider text-ivory hover:bg-forest/90 transition-all shadow-md"
              >
                Read Our Safety Philosophy &rarr;
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 rounded-3xl border border-border/80 bg-burgundy p-8 text-ivory text-center">
          <h2 className="font-display text-3xl">Ready to take a seat?</h2>
          <p className="mt-2 text-xs leading-relaxed text-ivory/80 max-w-md mx-auto">
            Take 3 minutes to complete your 9-question Social Discovery Quiz and discover which tables align with your tempo.
          </p>
          <div className="mt-6">
            <Link
              to="/quiz"
              className="inline-flex items-center gap-2 rounded-full bg-ivory px-6 py-3 text-xs font-semibold uppercase tracking-wider text-burgundy hover:bg-card transition-all"
            >
              Take the Quiz &rarr;
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
