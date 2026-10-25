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
      {/* ========================================================================= */}
      {/* 1. DYNAMIC COLOR LIGHTING ATMOSPHERE                                      */}
      {/* ========================================================================= */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {/* Soft, Breathing Color Aura matching active greeting */}
        <motion.div
          animate={{
            backgroundColor: activeGreeting.bgGlow,
            scale: [1, 1.08, 1],
          }}
          transition={{ duration: 3.2, ease: "easeInOut" }}
          className="w-[80vw] h-[80vw] max-w-[850px] max-h-[850px] rounded-full blur-[150px]"
        />

        {/* Ambient Gold Core Glow */}
        <div className="absolute w-[50vw] h-[50vw] max-w-[550px] max-h-[550px] rounded-full bg-[#C6A568]/[0.08] blur-[130px]" />
      </div>

      {/* Classical Geometry Arch Lines in Background */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-30">
        <svg viewBox="0 0 1000 800" className="w-full h-full stroke-[#171514]/[0.07] fill-none">
          <circle cx="500" cy="400" r="320" strokeDasharray="3 6" strokeWidth="1" />
          <circle cx="500" cy="400" r="210" strokeWidth="0.8" />
          <circle cx="500" cy="400" r="90" strokeDasharray="2 4" strokeWidth="0.6" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center justify-center my-auto space-y-10 sm:space-y-16 text-center">
        {/* ========================================================================= */}
        {/* 2. SECTION HEADER (Editorial Whisper)                                      */}
        {/* ========================================================================= */}
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#171514] tracking-tight leading-tight">
            Welcomed in <span className="italic font-serif text-[#691C35]">every language.</span>
          </h2>

          <p className="font-sans text-xs sm:text-sm text-[#171514]/70 max-w-md mx-auto leading-relaxed">
            No matter how you say hello, there is a thoughtful seat waiting for you at our table.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* 3. CENTERSTAGE GREETING STATEMENT (Monumental Say [Greeting] to 5 new people) */}
        {/* ========================================================================= */}
        <div className="w-full flex flex-col items-center justify-center px-2">
          {/* Main Statement: Monumental, grand, fluidly responsive */}
          <div className="flex flex-nowrap whitespace-nowrap items-baseline justify-center gap-x-2 sm:gap-x-4 md:gap-x-7 text-center w-full max-w-full px-1">
            {/* Left Static Side */}
            <span className="font-display text-[clamp(2rem,6.8vw,7.5rem)] font-normal tracking-tight text-[#171514] select-none shrink-0 leading-none">
              Say
            </span>

            {/* Center Animated Greeting */}
            <div className="inline-flex items-baseline justify-center px-1 sm:px-2">
              <AnimatePresence mode="wait">
                <motion.span
                  key={activeGreeting.id}
                  initial={{ opacity: 0, y: 22, filter: "blur(10px)", scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
                  exit={{ opacity: 0, y: -22, filter: "blur(10px)", scale: 1.06 }}
                  transition={{
                    duration: 0.65,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{
                    fontFamily: activeGreeting.fontFamily,
                    color: activeGreeting.accentColor,
                  }}
                  className="text-[clamp(2rem,6.8vw,7.5rem)] font-normal leading-none inline-block drop-shadow-sm transition-colors duration-500 py-1"
                >
                  {activeGreeting.native}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Right Static Side */}
            <span className="font-display text-[clamp(2rem,6.8vw,7.5rem)] font-normal tracking-tight text-[#171514] select-none shrink-0 leading-none">
              to 5 new people
            </span>
          </div>

          {/* Pronunciation & Cultural Meaning (Animated with active greeting) */}
          <div className="min-h-[72px] sm:min-h-[84px] flex items-center justify-center mt-6 sm:mt-10">
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
