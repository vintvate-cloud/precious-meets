import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

interface GreetingItem {
  id: string;
  native: string;
  roman: string;
  language: string;
  region: string;
  meaning: string;
  fontFamily: string;
  accentColor: string;
  bgGlow: string;
  textColor: string;
}

const GREETINGS: GreetingItem[] = [
  {
    id: "punjabi",
    native: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ",
    roman: "Sat Sri Akal",
    language: "Punjabi",
    region: "Punjab",
    meaning: "Truth is the Timeless Being",
    fontFamily: "'Noto Serif Gurmukhi', serif",
    accentColor: "#B8860B", // Warm Ochre
    bgGlow: "rgba(184, 134, 11, 0.16)",
    textColor: "text-[#B8860B]",
  },
  {
    id: "hindi",
    native: "नमस्ते",
    roman: "Namaste",
    language: "Hindi",
    region: "Northern India",
    meaning: "The divine in me bows to the divine in you",
    fontFamily: "'Rozha One', 'Noto Serif Devanagari', serif",
    accentColor: "#691C35", // Deep Burgundy
    bgGlow: "rgba(105, 28, 53, 0.16)",
    textColor: "text-[#691C35]",
  },
  {
    id: "urdu",
    native: "آداب",
    roman: "Adaab",
    language: "Urdu",
    region: "Delhi & Awadh",
    meaning: "Respect and grace upon you",
    fontFamily: "'Noto Nastaliq Urdu', 'Amiri', serif",
    accentColor: "#5F7045", // Deep Olive/Forest
    bgGlow: "rgba(95, 112, 69, 0.18)",
    textColor: "text-[#5F7045]",
  },
  {
    id: "tamil",
    native: "வணக்கம்",
    roman: "Vanakkam",
    language: "Tamil",
    region: "Tamil Nadu",
    meaning: "Humble salutations of warmth",
    fontFamily: "'Noto Serif Tamil', serif",
    accentColor: "#C2410C", // Terracotta
    bgGlow: "rgba(194, 65, 12, 0.16)",
    textColor: "text-[#C2410C]",
  },
  {
    id: "bengali",
    native: "নমস্কার",
    roman: "Nomoshkar",
    language: "Bengali",
    region: "Bengal",
    meaning: "Reverence, goodwill, and peace",
    fontFamily: "'Noto Serif Bengali', serif",
    accentColor: "#1E293B", // Midnight Slate
    bgGlow: "rgba(30, 41, 59, 0.15)",
    textColor: "text-[#1E293B]",
  },
  {
    id: "rajasthani",
    native: "खम्मा घणी",
    roman: "Khamma Ghani",
    language: "Rajasthani",
    region: "Marwar & Mewar",
    meaning: "May you be blessed with abundant grace",
    fontFamily: "'Rozha One', 'Noto Serif Devanagari', serif",
    accentColor: "#D97706", // Amber
    bgGlow: "rgba(217, 119, 6, 0.18)",
    textColor: "text-[#D97706]",
  },
  {
    id: "telugu",
    native: "నమస్కారం",
    roman: "Namaskaram",
    language: "Telugu",
    region: "Andhra & Telangana",
    meaning: "Offerings of heartful reverence",
    fontFamily: "'Noto Serif Telugu', 'Mandali', sans-serif",
    accentColor: "#4D6038", // Forest Sage
    bgGlow: "rgba(77, 96, 56, 0.18)",
    textColor: "text-[#4D6038]",
  },
  {
    id: "french",
    native: "Bonjour",
    roman: "Bonjour",
    language: "French",
    region: "Paris & Pondicherry",
    meaning: "A good and gracious day to you",
    fontFamily: "'Instrument Serif', serif",
    accentColor: "#691C35",
    bgGlow: "rgba(105, 28, 53, 0.15)",
    textColor: "text-[#691C35]",
  },
  {
    id: "italian",
    native: "Ciao",
    roman: "Ciao",
    language: "Italian",
    region: "Venice & Rome",
    meaning: "At your warm companionship",
    fontFamily: "'Instrument Serif', serif",
    accentColor: "#5F7045",
    bgGlow: "rgba(95, 112, 69, 0.15)",
    textColor: "text-[#5F7045]",
  },
  {
    id: "english",
    native: "Hi",
    roman: "Hi",
    language: "English",
    region: "The Global Table",
    meaning: "A warm and effortless invitation to connect",
    fontFamily: "'Instrument Serif', serif",
    accentColor: "#171514",
    bgGlow: "rgba(23, 21, 20, 0.12)",
    textColor: "text-[#171514]",
  },
];

export function DoorGreetings() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeGreeting = GREETINGS[currentIndex];

  // Auto-advance timer (cycles automatically and continuously every 3 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % GREETINGS.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[85vh] sm:min-h-screen w-full bg-[#FAF7F2] text-[#171514] flex flex-col justify-center items-center py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden select-none">
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center justify-center my-auto space-y-8 sm:space-y-12 text-center">
        {/* ========================================================================= */}
        {/* CENTERSTAGE GREETING STATEMENT (Say -> [Language Greeting] -> to 5 new people) */}
        {/* ========================================================================= */}
        <div className="w-full flex flex-col items-center justify-center px-4">
          {/* Top: Say */}
          <h2 className="font-display text-[clamp(2.5rem,7vw,6.5rem)] font-normal tracking-tight text-[#171514] select-none leading-none mt-2 sm:mt-4">
            Say
          </h2>

          {/* Center Animated Greeting */}
          <div className="min-h-[1.2em] flex items-center justify-center my-1 sm:my-2">
            <AnimatePresence mode="wait">
              <motion.span
                key={activeGreeting.id}
                initial={{ opacity: 0, y: 24, filter: "blur(10px)", scale: 0.92 }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
                exit={{ opacity: 0, y: -24, filter: "blur(10px)", scale: 1.06 }}
                transition={{
                  duration: 0.65,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  fontFamily: activeGreeting.fontFamily,
                  color: activeGreeting.accentColor,
                }}
                className="text-[clamp(4.25rem,12vw,10.5rem)] font-normal leading-[1.12] inline-block drop-shadow-sm transition-colors duration-500 py-1"
              >
                {activeGreeting.native}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Bottom: to 5 new people */}
          <span className="font-display text-[clamp(2.5rem,7vw,6.5rem)] font-normal tracking-tight text-[#171514] select-none leading-none mt-1 sm:mt-2">
            to 5 new people
          </span>

          {/* Pronunciation & Cultural Meaning (Animated with active greeting) */}
          <div className="min-h-[72px] sm:min-h-[84px] flex items-center justify-center mt-8 sm:mt-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeGreeting.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center text-center space-y-2"
              >
                <p className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-[#171514]/85">
                  "{activeGreeting.roman}"
                  <span className="font-sans not-italic text-xs sm:text-sm font-mono uppercase tracking-widest text-[#171514]/40 ml-3">
                    ({activeGreeting.language})
                  </span>
                </p>
                <div className="flex items-center gap-2 text-xs sm:text-sm font-sans text-[#171514]/65">
                  <Sparkles className="size-3.5 text-[#C6A568] shrink-0" />
                  <span className="italic font-normal">{activeGreeting.meaning}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
