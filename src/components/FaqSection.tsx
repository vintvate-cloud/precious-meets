import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    id: "verification",
    question: "How does offline Aadhaar verification work?",
    answer:
      "Every guest completes a secure government DigiLocker check before a seat is confirmed. No biometrics are ever stored, ensuring 100% vetted identities and zero fake or anonymous profiles.",
  },
  {
    id: "solo-arrival",
    question: "Can I come alone, or should I bring a friend?",
    answer:
      "Everyone arrives alone by design. Solo arrival eliminates cliques, encourages genuine openness, and ensures all six guests start on equal, curious footing.",
  },
  {
    id: "safety",
    question: "How do you ensure women-first safety at every table?",
    answer:
      "We maintain a balanced 50:50 ratio, host exclusively in private vetted heritage venues, have dedicated Guardian Hosts on site, and offer 24/7 SOS desk support.",
  },
  {
    id: "curation",
    question: "How do you decide who sits at my table?",
    answer:
      "Our Discovery Quiz maps your conversational energy, curiosity archetype, and life stage to balance quiet depth with warm anchors for effortless chemistry.",
  },
  {
    id: "venue-reveal",
    question: "When and where do I receive the venue details?",
    answer:
      "You choose your neighborhood when booking. The secret venue address, entrance code, and host coordinates unlock in your Member Dashboard 24 hours prior.",
  },
  {
    id: "dietary",
    question: "What if I have dietary preferences or allergies?",
    answer:
      "Every dinner features seasonal four-course tasting menus with artisan vegetarian, vegan, and Jain tracks prepared individually according to your quiz preferences.",
  },
  {
    id: "cancellation",
    question: "What is your cancellation and credit policy?",
    answer:
      "Notify us at least 48 hours in advance and your pass credit is preserved for 90 days to rebook any upcoming table across Delhi NCR.",
  },
];

export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>("verification");

  const toggleFaq = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      className="relative w-full bg-black text-ivory py-24 sm:py-36 px-4 sm:px-8 lg:px-16 border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Left Column: Bold Minimal "FAQ" Column */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <span className="text-xs sm:text-sm font-mono uppercase tracking-[0.25em] text-ochre font-bold block mb-3">
              Common Questions
            </span>

            <h2 className="font-display text-7xl sm:text-8xl md:text-9xl lg:text-[9.5rem] text-ivory tracking-tight leading-none select-none">
              FAQ
            </h2>

            <p className="mt-6 text-base sm:text-lg text-ivory/70 leading-relaxed font-sans max-w-sm">
              Everything you need to know about safety, curation, and taking your seat at the table.
            </p>

            <div className="mt-10 pt-8 border-t border-white/10 hidden lg:block">
              <p className="text-xs font-mono uppercase tracking-wider text-ivory/50 mb-3">
                Have an unlisted query?
              </p>
              <Link
                to="/quiz"
                className="inline-flex items-center gap-2 text-sm font-semibold text-ochre hover:text-white transition-colors group"
              >
                <span>Take the Discovery Quiz</span>
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Prominent, Bigger Minimal FAQs (7 Items) */}
          <div className="lg:col-span-8 divide-y divide-white/10">
            {faqs.map((faq, index) => {
              const isOpen = openId === faq.id;

              return (
                <div key={faq.id} className="py-7 sm:py-9 md:py-11 first:pt-0 last:pb-0">
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    aria-expanded={isOpen}
                    className="w-full flex items-start justify-between text-left gap-6 cursor-pointer select-none group"
                  >
                    <span className="flex items-start gap-4 sm:gap-5 pr-2">
                      <span className="text-sm sm:text-base md:text-lg font-mono text-ochre font-bold select-none pt-1">
                        0{index + 1}
                      </span>
                      <span
                        className={`font-display text-xl sm:text-2xl md:text-3xl lg:text-[2rem] leading-tight tracking-tight transition-colors duration-200 ${
                          isOpen ? "text-ochre" : "text-ivory group-hover:text-ochre"
                        }`}
                      >
                        {faq.question}
                      </span>
                    </span>

                    {/* Prominent Plus / Minus Glyph Button */}
                    <span
                      className={`shrink-0 size-9 sm:size-11 rounded-full flex items-center justify-center border transition-all duration-300 mt-1 ${
                        isOpen
                          ? "bg-ochre text-ink border-ochre scale-105"
                          : "border-white/20 text-ivory/70 group-hover:border-ochre group-hover:text-ochre group-hover:scale-105"
                      }`}
                    >
                      {isOpen ? (
                        <Minus className="size-4 sm:size-5 transition-transform" />
                      ) : (
                        <Plus className="size-4 sm:size-5 transition-transform" />
                      )}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.32, ease: [0.19, 1, 0.22, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pt-4 sm:pt-5 pl-9 sm:pl-11 pr-4 sm:pr-8 text-sm sm:text-base md:text-lg text-ivory/75 leading-relaxed font-sans max-w-3xl">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
