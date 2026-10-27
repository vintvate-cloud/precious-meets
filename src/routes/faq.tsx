import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SosModal } from "@/components/SosModal";
import {
  Search,
  Plus,
  Minus,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  HelpCircle,
  MessageCircle,
  Mail,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Frequently Asked Questions — Precious Meets" },
      {
        name: "description",
        content:
          "Everything you need to know about offline Aadhaar verification, women-first safety, table curation, secret venues, and dining etiquette in Delhi NCR.",
      },
      { property: "og:title", content: "FAQ — Precious Meets" },
      {
        property: "og:description",
        content: "Answers to common questions about safety, curation, solo arrival, and table experiences.",
      },
    ],
  }),
  component: FaqPage,
});

type Category = "all" | "safety" | "curation" | "experience" | "booking";

interface FaqItem {
  id: string;
  category: "safety" | "curation" | "experience" | "booking";
  question: string;
  answer: string;
  tags?: string[];
}

const FAQ_DATA: FaqItem[] = [
  {
    id: "verification",
    category: "safety",
    question: "How does offline Aadhaar verification work?",
    answer:
      "Every guest completes a secure government DigiLocker verification before a table pass is confirmed. We never store raw Aadhaar numbers or biometrics. This guarantees zero fake profiles, eliminates anonymity, and ensures that everyone at your table is legally accountable.",
    tags: ["aadhaar", "digilocker", "identity", "verification", "security"],
  },
  {
    id: "women-safety",
    category: "safety",
    question: "How do you ensure women-first safety at every table?",
    answer:
      "Safety is engineered into our DNA. We maintain a strict 50:50 gender balance, host exclusively in private, vetted heritage venues with private entrances, have trained Guardian Hosts present throughout the evening, and offer a real-time 24/7 SOS desk with emergency dispatch.",
    tags: ["women", "safety", "ratio", "guardian", "sos", "night"],
  },
  {
    id: "misbehavior",
    category: "safety",
    question: "What happens if someone at the table behaves inappropriately?",
    answer:
      "Precious Meets operates on an absolute zero-tolerance policy. Guests agree to our Table Code of Conduct prior to arriving. Any guest engaging in unsolicited advances, harassment, aggressive business pitching, or intimidation is discreetly asked to leave immediately and permanently blacklisted across our platform.",
    tags: ["code of conduct", "harassment", "ban", "safe"],
  },
  {
    id: "solo-arrival",
    category: "curation",
    question: "Can I come alone, or should I bring a friend?",
    answer:
      "Everyone arrives alone by design. When guests arrive with existing friends, cliques naturally form and people stick to their comfort zone. Solo arrival levels the playing field so everyone enters with the same curiosity and openness to connect.",
    tags: ["solo", "alone", "friend", "cliques", "first time"],
  },
  {
    id: "curation-algorithm",
    category: "curation",
    question: "How do you decide who sits at my table?",
    answer:
      "Our Discovery Quiz maps your conversational energy, curiosity archetype, and life stage. Rather than matching people with identical careers or backgrounds, we curate tables for conversational harmony, balancing quiet reflective thinkers with warm conversational anchors.",
    tags: ["quiz", "matching", "archetype", "compatibility", "strangers"],
  },
  {
    id: "dating-or-networking",
    category: "curation",
    question: "Is Precious Meets a dating event or a networking meetup?",
    answer:
      "Neither. Precious Meets is about genuine human connection over good food. There are no LinkedIn elevator pitches, no business cards, and no awkward dating dynamics. We create room for honest, warm conversations about life, passions, childhood memories, and personal stories.",
    tags: ["dating", "networking", "linkedin", "social", "purpose"],
  },
  {
    id: "venue-reveal",
    category: "experience",
    question: "When and where do I receive the venue details?",
    answer:
      "You select your preferred neighborhood (such as Mehrauli, Chanakyapuri, Hauz Khas, or Sunder Nursery) when reserving your pass. The secret heritage venue address, private entry instructions, and host contact are unlocked in your Member Dashboard exactly 24 hours before your meet.",
    tags: ["venue", "location", "address", "secret", "delhi", "timing"],
  },
  {
    id: "dietary",
    category: "experience",
    question: "What if I have dietary preferences, allergies, or prefer Jain food?",
    answer:
      "Every dinner features seasonal four-course artisan menus crafted in partnership with renowned chefs. Dedicated vegetarian, vegan, Jain, and gluten-sensitive tracks are prepared individually based on the dietary preferences submitted during your quiz and booking.",
    tags: ["food", "diet", "jain", "vegan", "vegetarian", "allergies", "menu"],
  },
  {
    id: "conversation-flow",
    category: "experience",
    question: "What if there are awkward silences at the table?",
    answer:
      "Every table features handcrafted 'Big Conversations' spark cards with thought-provoking, non-intrusive questions. Furthermore, our seasoned Guardian Host gently guides table rituals, ensuring everyone gets space to share without any pressure or performance anxiety.",
    tags: ["icebreakers", "conversation", "cards", "introvert", "shy"],
  },
  {
    id: "pass-inclusion",
    category: "booking",
    question: "What is included with my Precious Meets pass?",
    answer:
      "Your pass covers everything: your curated table seat, an unhurried 4-course culinary experience with beverages, offline identity vetting, table spark cards, dedicated host presence, and on-site hospitality. There are zero hidden fees or unexpected bill splits at the end of the evening.",
    tags: ["price", "pass", "cost", "included", "bill", "split"],
  },
  {
    id: "cancellation",
    category: "booking",
    question: "What is your cancellation and credit policy?",
    answer:
      "If your schedule changes, simply notify us at least 48 hours in advance via your dashboard. Your full pass value will be credited to your account and remains valid for 90 days to rebook any upcoming table across Delhi NCR.",
    tags: ["cancellation", "refund", "reschedule", "credits", "policy"],
  },
];

const CATEGORIES: { id: Category; label: string }[] = [
  { id: "all", label: "All Questions" },
  { id: "safety", label: "Safety & Verification" },
  { id: "curation", label: "Curation & Archetypes" },
  { id: "experience", label: "Venues & Dining" },
  { id: "booking", label: "Passes & Policies" },
];

function FaqPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>("verification");

  const filteredFaqs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return FAQ_DATA.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!q) return true;
      const matchQuestion = item.question.toLowerCase().includes(q);
      const matchAnswer = item.answer.toLowerCase().includes(q);
      const matchTags = item.tags?.some((t) => t.toLowerCase().includes(q));
      return matchQuestion || matchAnswer || matchTags;
    });
  }, [selectedCategory, searchQuery]);

  const toggleFaq = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex min-h-screen flex-col bg-ivory text-foreground selection:bg-burgundy/15 selection:text-burgundy">
      <Navbar />

      <main className="flex-1 w-full pt-28 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-3.5 py-1 text-xs font-mono font-semibold tracking-wider text-forest border border-forest/15">
              <ShieldCheck className="size-3.5" />
              100% Transparency & Real-World Safety
            </span>

            <h1 className="font-display mt-4 text-4xl sm:text-5xl md:text-6xl text-foreground tracking-tight leading-[1.1]">
              Frequently Asked <em className="italic text-burgundy font-serif">Questions</em>
            </h1>

            <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Everything you need to know about arriving alone, identity vetting through DigiLocker, women-first safety, and what happens around our long tables.
            </p>
          </div>

          {/* Search Box */}
          <div className="mt-10 max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions (e.g. Aadhaar, solo, women safety, food)..."
                className="w-full rounded-2xl border border-black/10 bg-white/90 pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 shadow-xs backdrop-blur-sm transition-all focus:border-burgundy focus:outline-hidden focus:ring-2 focus:ring-burgundy/15"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer px-1.5 py-0.5 rounded bg-black/5"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`rounded-full px-4 py-2 text-xs font-medium tracking-tight transition-all cursor-pointer ${
                    active
                      ? "bg-[#171514] text-white shadow-xs scale-102"
                      : "bg-white/80 border border-black/5 text-foreground/75 hover:bg-black/5 hover:text-foreground"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* FAQ Accordion List */}
          <div className="mt-12 rounded-3xl border border-black/5 bg-white/80 backdrop-blur-md shadow-[0_12px_40px_-15px_rgba(0,0,0,0.06)] divide-y divide-black/5 overflow-hidden">
            {filteredFaqs.length === 0 ? (
              <div className="py-16 px-6 text-center">
                <HelpCircle className="size-10 text-muted-foreground/40 mx-auto mb-3" />
                <h3 className="font-display text-xl text-foreground">No matching questions found</h3>
                <p className="mt-2 text-xs text-muted-foreground max-w-sm mx-auto">
                  We couldn't find an answer for "{searchQuery}". You can contact our concierge or take the discovery quiz.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-burgundy px-4 py-2 text-xs font-semibold text-ivory hover:bg-burgundy/90 transition-colors"
                >
                  View All Questions
                </button>
              </div>
            ) : (
              filteredFaqs.map((faq, index) => {
                const isOpen = openId === faq.id;
                return (
                  <div key={faq.id} className="p-5 sm:p-7 transition-colors hover:bg-black/[0.015]">
                    <button
                      type="button"
                      onClick={() => toggleFaq(faq.id)}
                      aria-expanded={isOpen}
                      className="w-full flex items-start justify-between text-left gap-4 cursor-pointer select-none group"
                    >
                      <div className="flex items-start gap-3 sm:gap-4 pr-2">
                        <span className="text-xs sm:text-sm font-mono text-burgundy font-bold pt-0.5 select-none shrink-0">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={`font-display text-lg sm:text-xl md:text-2xl leading-snug tracking-tight transition-colors ${
                            isOpen ? "text-burgundy" : "text-foreground group-hover:text-burgundy"
                          }`}
                        >
                          {faq.question}
                        </span>
                      </div>

                      <span
                        className={`shrink-0 size-8 sm:size-9 rounded-full flex items-center justify-center border transition-all duration-200 mt-0.5 ${
                          isOpen
                            ? "bg-burgundy text-white border-burgundy scale-105"
                            : "border-black/10 text-foreground/70 group-hover:border-burgundy group-hover:text-burgundy"
                        }`}
                      >
                        {isOpen ? (
                          <Minus className="size-3.5 sm:size-4" />
                        ) : (
                          <Plus className="size-3.5 sm:size-4" />
                        )}
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: [0.19, 1, 0.22, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="pt-3.5 pl-7 sm:pl-9 pr-4 sm:pr-8 text-xs sm:text-sm text-foreground/80 leading-relaxed font-sans max-w-2xl">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            )}
          </div>

          {/* Safety & Trust Assurance Highlight Card */}
          <div className="mt-14 rounded-3xl border border-forest/25 bg-sage/20 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest uppercase tracking-wider font-mono">
                <CheckCircle2 className="size-4" />
                Zero Compromise Standard
              </div>
              <h2 className="font-display mt-2 text-2xl sm:text-3xl text-foreground">
                Still wondering if Precious Meets is right for you?
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Take our 9-question Discovery Quiz. It maps your social battery, personal boundaries, and conversational curiosity before you ever commit to a table.
              </p>
            </div>
            <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link
                to="/quiz"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-burgundy px-6 py-3 text-xs font-semibold text-ivory hover:bg-burgundy/90 transition-all shadow-xs"
              >
                <Sparkles className="size-4 text-ochre" />
                <span>Take Discovery Quiz</span>
                <ArrowRight className="size-3.5" />
              </Link>
              <Link
                to="/safety"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white border border-black/10 px-5 py-3 text-xs font-medium text-foreground hover:bg-black/5 transition-all"
              >
                <ShieldCheck className="size-4 text-forest" />
                <span>Read Safety Protocol</span>
              </Link>
            </div>
          </div>

          {/* Need Direct Assistance Desk */}
          <div className="mt-8 text-center border-t border-black/5 pt-8">
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Have a specific question not covered here?
            </p>
            <div className="mt-3 flex flex-wrap justify-center items-center gap-4 text-xs font-medium text-foreground">
              <a
                href="mailto:concierge@preciousmeets.com"
                className="inline-flex items-center gap-1.5 hover:text-burgundy transition-colors"
              >
                <Mail className="size-3.5 text-burgundy" />
                <span>concierge@preciousmeets.com</span>
              </a>
              <span className="text-black/20">•</span>
              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-forest transition-colors"
              >
                <MessageCircle className="size-3.5 text-forest" />
                <span>WhatsApp Guest Concierge (10 AM – 8 PM)</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Persistent On-Page Floating Safety SOS Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <SosModal
          triggerButton={
            <button
              type="button"
              aria-label="24/7 Safety SOS & Host Escort"
              className="flex items-center gap-2 rounded-full bg-red-700 hover:bg-red-800 text-white px-4 py-3 text-xs font-bold shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer border border-red-500/50"
            >
              <ShieldAlert className="size-4 animate-pulse text-white" />
              <span>24/7 Safety SOS</span>
            </button>
          }
        />
      </div>
    </div>
  );
}
