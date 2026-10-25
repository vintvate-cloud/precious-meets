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
    native: "Welcome",
    roman: "Welcome",
    language: "English",
    region: "The Global Table",
    meaning: "Make yourself at home",
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
    <section className="relative min-h-[92vh] sm:min-h-screen w-full bg-[#FAF7F2] text-[#171514] flex flex-col justify-between py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden select-none">
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
          className="w-[75vw] h-[75vw] max-w-[700px] max-h-[700px] rounded-full blur-[140px]"
        />

        {/* Ambient Gold Core Glow */}
        <div className="absolute w-[45vw] h-[45vw] max-w-[480px] max-h-[480px] rounded-full bg-[#C6A568]/[0.08] blur-[120px]" />
      </div>

      {/* Classical Geometry Arch Lines in Background */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-30">
        <svg viewBox="0 0 1000 800" className="w-full h-full stroke-[#171514]/[0.07] fill-none">
          <circle cx="500" cy="400" r="320" strokeDasharray="3 6" strokeWidth="1" />
          <circle cx="500" cy="400" r="210" strokeWidth="0.8" />
          <circle cx="500" cy="400" r="90" strokeDasharray="2 4" strokeWidth="0.6" />
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* 2. SECTION HEADER (Editorial Whisper)                                      */}
      {/* ========================================================================= */}
      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-3">
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#171514] tracking-tight leading-tight">
          Welcomed in <span className="italic font-serif text-[#691C35]">every language.</span>
        </h2>

        <p className="font-sans text-xs sm:text-sm text-[#171514]/70 max-w-md mx-auto leading-relaxed">
          No matter how you say hello, there is a thoughtful seat waiting for you at our table.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 3. CENTERSTAGE GREETING PODIUM (Say [Greeting] to 5 new people)            */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full max-w-5xl mx-auto my-auto py-8 sm:py-12 flex flex-col items-center justify-center">

        {/* Dynamic Greeting Container with static left & right wings */}
        <div className="relative w-full flex flex-col items-center justify-center text-center px-4">
          {/* Language & Cultural Region Pill */}
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 bg-white/90 border border-black/8 shadow-xs text-xs font-mono font-medium text-[#171514]/80 mb-5 sm:mb-8">
            <span
              className="size-2 rounded-full animate-ping"
              style={{ backgroundColor: activeGreeting.accentColor }}
            />
            <span className="font-semibold" style={{ color: activeGreeting.accentColor }}>
              {activeGreeting.language}
            </span>
            <span className="text-[#171514]/30">·</span>
            <span className="text-[#171514]/70">{activeGreeting.region}</span>
          </div>

          {/* Main Statement: Always in 1 single line like Image 1 (never wraps to 2 lines) */}
          <div className="flex flex-nowrap whitespace-nowrap items-baseline justify-center gap-x-2 sm:gap-x-4 md:gap-x-5 text-center w-full max-w-6xl px-1 sm:px-2">
            {/* Left Static Side (Not in animation) */}
            <span className="font-display text-[clamp(1.5rem,4.2vw,4.8rem)] font-normal tracking-tight text-[#171514] select-none shrink-0">
              Say
            </span>

            {/* Center Animated Greeting (Only this animates) */}
            <div className="inline-flex items-baseline justify-center px-1 sm:px-2">
              <AnimatePresence mode="wait">
                <motion.span
                  key={activeGreeting.id}
                  initial={{ opacity: 0, y: 16, filter: "blur(8px)", scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
                  exit={{ opacity: 0, y: -16, filter: "blur(8px)", scale: 1.05 }}
                  transition={{
                    duration: 0.65,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{
                    fontFamily: activeGreeting.fontFamily,
                    color: activeGreeting.accentColor,
                  }}
                  className="text-[clamp(1.5rem,4.2vw,4.8rem)] font-normal leading-none inline-block drop-shadow-sm transition-colors duration-500 py-1"
                >
                  {activeGreeting.native}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Right Static Side (Not in animation) */}
            <span className="font-display text-[clamp(1.5rem,4.2vw,4.8rem)] font-normal tracking-tight text-[#171514] select-none shrink-0">
              to 5 new people
            </span>
          </div>

          {/* Pronunciation & Cultural Meaning (Animated with active greeting) */}
          <div className="min-h-[64px] sm:min-h-[72px] flex items-center justify-center mt-3 sm:mt-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeGreeting.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center text-center space-y-1"
              >
                <p className="font-serif italic text-xl sm:text-2xl md:text-3xl text-[#171514]/85">
                  "{activeGreeting.roman}"
                </p>
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-sans text-[#171514]/65">
                  <Sparkles className="size-3.5 text-[#C6A568] shrink-0" />
                  <span className="italic font-normal">{activeGreeting.meaning}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. LANGUAGE SELECTOR PILLS & PROGRESS INDICATOR                            */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center gap-3">
        {/* Interactive Clickable Language Tags */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-2">
          {GREETINGS.map((item, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`px-3 py-1 rounded-full text-[11px] font-mono transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-[#691C35] text-white font-semibold shadow-sm scale-105"
                    : "bg-white/70 text-[#171514]/60 hover:bg-white hover:text-[#171514] border border-black/5"
                }`}
              >
                {item.language}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
