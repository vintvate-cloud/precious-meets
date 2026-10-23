import { useEffect, useRef, useState } from "react";
import {
  ShieldCheck,
  Sparkles,
  QrCode,
  CheckCircle2,
  Lock,
  ArrowRight,
  Check,
  Ticket,
  Users,
  Compass,
  Building,
  UserCheck,
  Calendar,
  Clock,
  MapPin,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";

export const HOW_STEPS = [
  {
    num: "01",
    tag: "Onboarding",
    title: "Profile Preferences",
    desc: "Set your preferred Delhi NCR dining enclave, contact info, and one-line vibe.",
    pill: "/onboarding",
    duration: 4500,
  },
  {
    num: "02",
    tag: "Discovery Quiz",
    title: "Conversational Mapping",
    desc: "9 intuitive questions to map your social energy, depth, and curiosity archetype.",
    pill: "/quiz",
    duration: 4500,
  },
  {
    num: "03",
    tag: "Offline Aadhaar",
    title: "DigiLocker Verification",
    desc: "Authorized offline XML check. Zero raw UID storage. 100% verified real humans.",
    pill: "/verify-identity",
    duration: 4500,
  },
  {
    num: "04",
    tag: "Admin Console",
    title: "Curated 6-Seat Seating",
    desc: "Our host operations engine pairs compatible verified guests for effortless table chemistry.",
    pill: "/admin",
    duration: 4500,
  },
  {
    num: "05",
    tag: "Member Hub",
    title: "Secret Table & Gate Pass",
    desc: "Your digital pass unlocks the heritage venue gate code, table seat, and host QR scan.",
    pill: "/dashboard",
    duration: 4500,
  },
];

export function HowPhoneMockup() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Automatic Step Advancing Engine
  useEffect(() => {
    if (!isPlaying || isHovered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const currentDuration = HOW_STEPS[activeStep].duration || 4500;

    timerRef.current = setTimeout(() => {
      setActiveStep((prev) => (prev + 1) % HOW_STEPS.length);
    }, currentDuration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [activeStep, isPlaying, isHovered]);

  const handleStepClick = (index: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setActiveStep(index);
  };

  const currentStep = HOW_STEPS[activeStep];

  return (
    <section
      id="how"
      className="relative py-20 sm:py-28 bg-[#22301A] text-ivory select-none overflow-hidden"
    >
      {/* High-Performance Smooth CSS Transitions */}
      <style>{`
        @keyframes stepProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
        @keyframes pageSlideIn {
          from { opacity: 0; transform: translateX(20px) scale(0.98); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes pageSlideOut {
          from { opacity: 1; transform: translateX(0) scale(1); }
          to { opacity: 0; transform: translateX(-20px) scale(0.98); }
        }
        @keyframes cardFadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .anim-progress-bar {
          animation: stepProgress 4.5s linear forwards;
        }
        .anim-card-fade {
          animation: cardFadeUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Atmospheric Warm Ambient Backdrop Glows */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-[50vw] h-[50vw] max-w-[650px] max-h-[650px] rounded-full bg-[#C6A568]/10 blur-[160px]" />
        <div className="w-[35vw] h-[35vw] max-w-[500px] max-h-[500px] rounded-full bg-[#691C35]/12 blur-[140px]" />
      </div>

      {/* Main Viewport Container */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-8 lg:px-12">
        <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          
          {/* Left Column: Flow Controls & Storytelling */}
          <div className="flex flex-col justify-center lg:col-span-6 xl:col-span-6 max-w-xl">
            
            {/* Minimal Badge & Flow Indicator */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-ochre animate-pulse" />
                <p className="font-mono text-[11px] uppercase tracking-widest text-ochre font-semibold">
                  Continuous Platform Walkthrough
                </p>
              </div>

              {/* Play / Pause Toggle Button */}
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ivory/10 hover:bg-ivory/20 text-ivory/70 text-[10px] font-mono transition-colors cursor-pointer"
                title={isPlaying ? "Pause automatic walkthrough" : "Resume walkthrough"}
              >
                {isPlaying ? (
                  <>
                    <Pause className="size-2.5 text-ochre" />
                    <span>Auto-Playing</span>
                  </>
                ) : (
                  <>
                    <Play className="size-2.5 text-ochre" />
                    <span>Paused</span>
                  </>
                )}
              </button>
            </div>

            {/* Headline */}
            <h2 className="font-display text-4xl sm:text-5xl lg:text-[3.8rem] leading-[0.96] tracking-tight text-ivory">
              How strangers<br />
              <em className="font-serif italic text-ochre font-normal">become friends.</em>
            </h2>

            {/* Step Tabs with Animated Progress Bars */}
            <div className="mt-7 flex flex-wrap items-center gap-2">
              {HOW_STEPS.map((step, idx) => {
                const isActive = idx === activeStep;
                return (
                  <button
                    key={step.num}
                    type="button"
                    onClick={() => handleStepClick(idx)}
                    className={`group relative overflow-hidden flex items-center gap-1.5 px-3.5 py-2 rounded-full transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "bg-white/15 text-ivory border border-ochre/50 shadow-md shadow-ochre/20"
                        : "bg-ivory/10 text-ivory/60 hover:bg-ivory/20 hover:text-ivory border border-transparent"
                    }`}
                  >
                    {/* Active Step Real-Time Progress Bar */}
                    {isActive && isPlaying && !isHovered && (
                      <div className="absolute inset-0 bg-ochre/25 origin-left anim-progress-bar" />
                    )}

                    <span className="relative z-10 font-mono text-xs font-bold text-ochre">
                      {step.num}
                    </span>
                    <span className="relative z-10 text-[11px] font-sans font-medium tracking-tight">
                      {step.tag}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Single Active Step Block */}
            <div
              key={activeStep}
              className="mt-6 pt-6 border-t border-ivory/15 anim-card-fade"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs uppercase tracking-widest text-ochre font-bold px-2.5 py-1 rounded bg-ochre/15 border border-ochre/30">
                  Step 0{activeStep + 1} of 05
                </span>
                <span className="font-mono text-xs text-ivory/60">
                  {currentStep.pill}
                </span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl text-ivory mt-3 font-medium">
                {currentStep.title}
              </h3>

              <p className="text-sm sm:text-base text-ivory/80 mt-2 leading-relaxed max-w-md">
                {currentStep.desc}
              </p>
            </div>

            {/* Clean Action Link */}
            <div className="mt-8 flex items-center gap-4">
              <a
                href="/quiz"
                className="inline-flex items-center gap-2 rounded-full bg-burgundy hover:bg-ochre hover:text-ink px-5 py-2.5 text-xs font-mono uppercase tracking-widest text-ivory shadow-lg transition-all duration-300 hover:scale-105"
              >
                <span>Take the 3-min quiz</span>
                <ArrowRight className="size-3.5" />
              </a>
              <span className="font-mono text-[11px] text-ivory/50">
                100% Offline · Delhi NCR
              </span>
            </div>
          </div>

          {/* Right Column: Phone Mockup Advancing Automatically Through Real Pages */}
          <div
            className="flex items-center justify-center lg:col-span-6 xl:col-span-6"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* iPhone Frame */}
            <div
              className="relative w-[270px] sm:w-[285px] md:w-[300px] h-[540px] sm:h-[565px] rounded-[44px] bg-[#0E0D0C] p-2.5 shadow-[0_25px_60px_-12px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.14)_inset,0_0_0_3px_#34312E] transition-all duration-500"
            >
              {/* Hardware Side Buttons */}
              <div className="absolute -left-[5px] top-24 h-9 w-[3px] rounded-l-sm bg-[#5C554F]" />
              <div className="absolute -left-[5px] top-36 h-9 w-[3px] rounded-l-sm bg-[#5C554F]" />
              <div className="absolute -right-[5px] top-28 h-14 w-[3px] rounded-r-sm bg-[#5C554F]" />

              {/* iPhone Inner Display Shell */}
              <div className="relative h-full w-full overflow-hidden rounded-[36px] bg-[#F7F4EE] text-foreground flex flex-col justify-between shadow-inner">
                
                {/* iOS Status Bar */}
                <div className="relative z-30 pt-2 px-5 flex items-center justify-between text-neutral-800 font-mono text-[10px] bg-[#F7F4EE]/90 backdrop-blur-sm border-b border-black/5">
                  <span className="font-bold">9:41</span>
                  
                  {/* Dynamic Island */}
                  <div className="h-4 w-20 rounded-full bg-black flex items-center justify-end pr-2 gap-1 border border-white/10 shadow-inner">
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-semibold">5G</span>
                    <div className="w-4 h-2 rounded-[2px] border border-neutral-800 p-[1px]">
                      <div className="h-full w-3 bg-neutral-800 rounded-[1px]" />
                    </div>
                  </div>
                </div>

                {/* Inside Screen Flow: Smooth Cross-fade Between Real Routes */}
                <div className="relative flex-1 w-full overflow-hidden bg-[#F7F4EE] flex flex-col">
                  
                  {/* ======================================================== */}
                  {/* PAGE 1: /onboarding (Complete Your Profile) */}
                  {/* ======================================================== */}
                  <div
                    className={`absolute inset-0 p-4 flex flex-col justify-between transition-all duration-500 ease-out ${
                      activeStep === 0
                        ? "opacity-100 translate-x-0 scale-100 pointer-events-auto"
                        : "opacity-0 -translate-x-6 scale-95 pointer-events-none"
                    }`}
                  >
                    <div>
                      {/* Mini Navbar */}
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/5">
                        <span className="font-display text-xs tracking-tight text-neutral-900 font-semibold">
                          Precious <em className="text-[#691C35] not-italic">meets</em>
                        </span>
                        <span className="font-mono text-[9px] text-[#22301A] font-bold px-2 py-0.5 rounded-full bg-[#22301A]/10">
                          /onboarding
                        </span>
                      </div>

                      {/* Onboarding Form Card */}
                      <div className="rounded-2xl border border-neutral-200 bg-white p-3.5 shadow-sm">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-[#22301A] font-bold block mb-1">
                          Welcome Onboard
                        </span>
                        <h3 className="font-display text-lg text-neutral-900 leading-tight">
                          Complete Your <em className="italic text-[#691C35]">Profile</em>
                        </h3>
                        <p className="text-[10px] text-neutral-500 mt-1 leading-normal">
                          Just a few essentials before you enter the Social Discovery Quiz.
                        </p>

                        <div className="mt-3 space-y-2 text-[10px]">
                          <div>
                            <label className="font-semibold text-neutral-700 block mb-0.5">
                              Preferred Enclave
                            </label>
                            <div className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-2.5 py-1.5 text-neutral-800 font-medium flex items-center justify-between">
                              <span>Delhi NCR (Mehrauli, Sunder Nursery)</span>
                              <Compass className="size-3 text-neutral-400" />
                            </div>
                          </div>

                          <div>
                            <label className="font-semibold text-neutral-700 block mb-0.5">
                              Contact Phone
                            </label>
                            <div className="w-full rounded-lg border border-neutral-300 bg-white px-2.5 py-1.5 text-neutral-800 font-mono text-[11px] flex items-center gap-1.5">
                              <span className="text-neutral-400">+91</span>
                              <span>98100 12345</span>
                              <span className="size-1.5 rounded-full bg-emerald-500 ml-auto" />
                            </div>
                          </div>

                          <div>
                            <label className="font-semibold text-neutral-700 block mb-0.5">
                              One-line about you
                            </label>
                            <div className="w-full rounded-lg border border-ochre/80 bg-ochre/10 px-2.5 py-1.5 text-neutral-800 text-[10px] italic">
                              “Architect loving natural wine and jazz.”
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <div className="w-full rounded-full bg-[#691C35] text-white py-2.5 px-4 text-[11px] font-semibold text-center shadow-md flex items-center justify-center gap-1.5">
                        <span>Continue to Discovery Quiz</span>
                        <ArrowRight className="size-3" />
                      </div>
                    </div>
                  </div>

                  {/* ======================================================== */}
                  {/* PAGE 2: /quiz (Social Discovery Quiz) */}
                  {/* ======================================================== */}
                  <div
                    className={`absolute inset-0 p-4 flex flex-col justify-between transition-all duration-500 ease-out ${
                      activeStep === 1
                        ? "opacity-100 translate-x-0 scale-100 pointer-events-auto"
                        : "opacity-0 -translate-x-6 scale-95 pointer-events-none"
                    }`}
                  >
                    <div>
                      {/* Mini Navbar */}
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/5">
                        <span className="font-display text-xs tracking-tight text-neutral-900 font-semibold">
                          Precious <em className="text-[#691C35] not-italic">meets</em>
                        </span>
                        <span className="font-mono text-[9px] text-[#22301A] font-bold px-2 py-0.5 rounded-full bg-[#22301A]/10">
                          /quiz · 2 of 9
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden mb-2.5">
                        <div className="h-full bg-[#691C35] rounded-full transition-all duration-700" style={{ width: "33%" }} />
                      </div>

                      {/* Actual Question from QUIZ_QUESTIONS */}
                      <div className="rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm">
                        <span className="font-mono text-[9px] text-[#22301A] uppercase tracking-wider font-bold block mb-1">
                          Social Energy Focus
                        </span>
                        <h3 className="font-display text-xs font-semibold text-neutral-900 leading-snug">
                          At a gathering of unfamiliar people, where do you find your focus?
                        </h3>

                        {/* Real Options */}
                        <div className="mt-2.5 space-y-1.5">
                          <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-2 text-[10px] text-neutral-600 flex items-center justify-between">
                            <div>
                              <span className="font-medium text-neutral-800 block">Quiet Observer</span>
                              <span className="text-[9px] text-neutral-500">Taking in the room and listening first</span>
                            </div>
                            <span className="size-3.5 rounded-full border border-neutral-300 shrink-0" />
                          </div>

                          {/* Selected Option (Gentle Engager) */}
                          <div className="rounded-xl border-2 border-[#691C35] bg-[#691C35]/10 p-2 text-[10px] text-neutral-900 flex items-center justify-between shadow-sm">
                            <div>
                              <span className="font-bold text-[#691C35] block">Gentle Engager</span>
                              <span className="text-[9px] text-neutral-600">Connecting intimately with one or two nearby</span>
                            </div>
                            <div className="size-4 rounded-full bg-[#691C35] flex items-center justify-center text-white shrink-0">
                              <Check className="size-2.5 stroke-[3]" />
                            </div>
                          </div>

                          <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-2 text-[10px] text-neutral-600 flex items-center justify-between">
                            <div>
                              <span className="font-medium text-neutral-800 block">Active Contributor</span>
                              <span className="text-[9px] text-neutral-500">Comfortably chiming in on topics</span>
                            </div>
                            <span className="size-3.5 rounded-full border border-neutral-300 shrink-0" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quiz Footer Button */}
                    <div className="pt-2">
                      <div className="w-full rounded-full bg-[#22301A] text-white py-2.5 px-4 text-[11px] font-semibold text-center shadow-md flex items-center justify-center gap-1.5">
                        <span>Next Question (3 of 9)</span>
                        <ArrowRight className="size-3" />
                      </div>
                    </div>
                  </div>

                  {/* ======================================================== */}
                  {/* PAGE 3: /verify-identity (Offline Aadhaar DigiLocker) */}
                  {/* ======================================================== */}
                  <div
                    className={`absolute inset-0 p-4 flex flex-col justify-between transition-all duration-500 ease-out ${
                      activeStep === 2
                        ? "opacity-100 translate-x-0 scale-100 pointer-events-auto"
                        : "opacity-0 -translate-x-6 scale-95 pointer-events-none"
                    }`}
                  >
                    <div>
                      {/* Mini Navbar */}
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/5">
                        <span className="font-display text-xs tracking-tight text-neutral-900 font-semibold">
                          Precious <em className="text-[#691C35] not-italic">meets</em>
                        </span>
                        <span className="font-mono text-[9px] text-emerald-700 font-bold px-2 py-0.5 rounded-full bg-emerald-100">
                          /verify-identity
                        </span>
                      </div>

                      {/* Actual Verify Identity Card */}
                      <div className="rounded-2xl border border-neutral-200 bg-white p-3.5 shadow-sm relative overflow-hidden">
                        
                        <div className="flex items-center gap-1.5 text-[#22301A] mb-1">
                          <ShieldCheck className="size-3.5 text-emerald-600" />
                          <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-emerald-800">
                            Trust & Safety Protocol
                          </span>
                        </div>

                        <h3 className="font-display text-base text-neutral-900 leading-tight">
                          Aadhaar <em className="italic text-[#691C35]">Identity Verification</em>
                        </h3>

                        {/* Real Privacy Notice from verify-identity.tsx */}
                        <div className="mt-2.5 rounded-xl border border-neutral-200 bg-neutral-50 p-2 text-[9px] text-neutral-600 space-y-1">
                          <div className="flex items-center gap-1 font-semibold text-neutral-800">
                            <Lock className="size-2.5 text-emerald-700" />
                            <span>Zero Raw Aadhaar Storage Guarantee</span>
                          </div>
                          <p className="leading-tight text-neutral-500">
                            In compliance with UIDAI & Indian DPDP Act: no 12-digit numbers or biometrics stored.
                          </p>
                        </div>

                        {/* Live Verified Member Status Banner */}
                        <div className="mt-3 rounded-xl border border-emerald-300 bg-emerald-50/80 p-2.5 text-center">
                          <div className="mx-auto size-7 rounded-full bg-emerald-600 text-white flex items-center justify-center mb-1 shadow-sm">
                            <CheckCircle2 className="size-4" />
                          </div>
                          <span className="font-display text-xs font-bold text-neutral-900 block">
                            Verified Member Status
                          </span>
                          <span className="font-mono text-[9px] text-emerald-700 block mt-0.5">
                            DigiLocker Cryptographic XML Validated
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Confirmation */}
                    <div className="pt-2">
                      <div className="w-full rounded-full bg-emerald-700 text-white py-2.5 px-4 text-[11px] font-semibold text-center shadow-md flex items-center justify-center gap-1.5">
                        <Check className="size-3" />
                        <span>Eligible for Curated Tables</span>
                      </div>
                    </div>
                  </div>

                  {/* ======================================================== */}
                  {/* PAGE 4: /admin (Admin Operations & Seating Console) */}
                  {/* ======================================================== */}
                  <div
                    className={`absolute inset-0 p-4 flex flex-col justify-between transition-all duration-500 ease-out ${
                      activeStep === 3
                        ? "opacity-100 translate-x-0 scale-100 pointer-events-auto"
                        : "opacity-0 -translate-x-6 scale-95 pointer-events-none"
                    }`}
                  >
                    <div>
                      {/* Mini Navbar */}
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/5">
                        <div className="flex items-center gap-1.5">
                          <Building className="size-3 text-neutral-800" />
                          <span className="font-mono text-[9px] font-bold text-neutral-900">
                            HOST CONSOLE
                          </span>
                        </div>
                        <span className="font-mono text-[9px] text-[#691C35] font-bold px-2 py-0.5 rounded-full bg-[#691C35]/10">
                          /admin/seating
                        </span>
                      </div>

                      {/* Admin Table Matrix Card */}
                      <div className="rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm">
                        <div className="flex items-center justify-between border-b border-neutral-100 pb-1.5 mb-2">
                          <div>
                            <span className="font-mono text-[8px] uppercase tracking-wider text-neutral-500 block">
                              Active Event
                            </span>
                            <span className="font-display text-xs font-bold text-neutral-900">
                              Sunder Nursery Supper
                            </span>
                          </div>
                          <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                            Table 01 · 6/6
                          </span>
                        </div>

                        {/* 6 Curated Verified Guests Grid */}
                        <div className="space-y-1 text-[9px]">
                          {[
                            { name: "Aarav M.", archetype: "Quiet Observer", verified: true },
                            { name: "Priya S.", archetype: "Active Contributor", verified: true },
                            { name: "Kabir D.", archetype: "Gentle Engager", verified: true },
                            { name: "Ananya R.", archetype: "Vibrant Catalyst", verified: true },
                            { name: "Rohan V.", archetype: "Deep Thinker", verified: true },
                            { name: "Tanya K.", archetype: "Creative Connector", verified: true },
                          ].map((guest, idx) => (
                            <div
                              key={guest.name}
                              className="flex items-center justify-between p-1.5 rounded-lg bg-neutral-50 border border-neutral-200/60"
                            >
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-[8px] text-neutral-400 font-bold">
                                  #{idx + 1}
                                </span>
                                <span className="font-semibold text-neutral-800">
                                  {guest.name}
                                </span>
                                <span className="text-[8px] text-neutral-500">
                                  ({guest.archetype})
                                </span>
                              </div>
                              <span className="flex items-center gap-0.5 text-emerald-700 text-[8px] font-bold">
                                <Check className="size-2.5" /> ID
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Chemistry Score */}
                        <div className="mt-2 pt-1.5 border-t border-neutral-100 flex items-center justify-between text-[9px]">
                          <span className="text-neutral-500 font-mono">Table Chemistry Index</span>
                          <span className="font-mono font-bold text-[#691C35]">98% Harmony Match</span>
                        </div>
                      </div>
                    </div>

                    {/* Admin Status Pill */}
                    <div className="pt-2">
                      <div className="w-full rounded-full bg-neutral-900 text-white py-2.5 px-4 text-[10px] font-mono uppercase tracking-wider text-center shadow-md flex items-center justify-center gap-1.5">
                        <UserCheck className="size-3 text-emerald-400" />
                        <span>Table Ready · Invites Dispatched</span>
                      </div>
                    </div>
                  </div>

                  {/* ======================================================== */}
                  {/* PAGE 5: /dashboard (Member Hub & Official Pass) */}
                  {/* ======================================================== */}
                  <div
                    className={`absolute inset-0 p-3.5 flex flex-col justify-between transition-all duration-500 ease-out ${
                      activeStep === 4
                        ? "opacity-100 translate-x-0 scale-100 pointer-events-auto"
                        : "opacity-0 -translate-x-6 scale-95 pointer-events-none"
                    }`}
                  >
                    <div>
                      {/* Mini Navbar */}
                      <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-black/5">
                        <span className="font-display text-xs tracking-tight text-neutral-900 font-semibold">
                          Precious <em className="text-[#691C35] not-italic">meets</em>
                        </span>
                        <span className="font-mono text-[9px] text-[#22301A] font-bold px-2 py-0.5 rounded-full bg-[#22301A]/10">
                          /dashboard
                        </span>
                      </div>

                      {/* Official Member Pass Card (Styled Exactly like MemberPassCard.tsx) */}
                      <div className="relative overflow-hidden rounded-2xl border border-ochre/50 bg-gradient-to-br from-[#1c0d12] via-[#2a131a] to-[#12080c] p-3 text-ivory shadow-lg">
                        
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
                          <div className="flex items-center gap-1.5">
                            <div className="grid size-6 place-items-center rounded-lg bg-ochre/30 border border-ochre/50 text-ochre">
                              <Ticket className="size-3" />
                            </div>
                            <div>
                              <span className="font-mono text-[7px] uppercase tracking-wider text-ochre/90 block">
                                Digital Member Pass
                              </span>
                              <span className="font-display text-xs tracking-tight text-ivory font-bold">
                                Precious<em className="text-ochre not-italic font-normal">meets</em>
                              </span>
                            </div>
                          </div>

                          <span className="inline-flex items-center gap-1 rounded-full bg-forest/30 px-2 py-0.5 text-[8px] font-medium text-emerald-300 border border-emerald-500/30">
                            <ShieldCheck className="size-2.5 text-emerald-400" /> Aadhaar Verified
                          </span>
                        </div>

                        {/* Member Name */}
                        <div>
                          <span className="font-mono text-[8px] uppercase tracking-wider text-white/60">
                            Honored Guest
                          </span>
                          <h4 className="font-display text-sm text-ivory font-medium mt-0.5">
                            Vedant Vyas
                          </h4>
                          <span className="inline-block mt-1 font-mono text-[8px] text-ochre bg-white/10 px-2 py-0.5 rounded border border-white/10">
                            ✦ Gentle Engager · Delhi NCR
                          </span>
                        </div>

                        {/* Secret Venue & Held Seat Pass */}
                        <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between">
                          <div>
                            <span className="font-mono text-[8px] text-white/60 block">Upcoming Meet</span>
                            <span className="text-[10px] font-semibold text-ivory block">Sunder Nursery Supper</span>
                            <span className="text-[9px] text-ochre font-mono block">Secret Gate: GATE-402</span>
                          </div>

                          {/* Scannable Gate QR Code */}
                          <div className="size-11 rounded-lg bg-white p-1 flex items-center justify-center shrink-0 shadow-sm">
                            <QrCode className="size-9 text-neutral-900" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Wallet Action Button */}
                    <div className="pt-2">
                      <div className="w-full rounded-full bg-black border border-white/20 text-white py-2 px-3 text-[10px] font-mono uppercase tracking-wider text-center shadow-md flex items-center justify-center gap-1.5">
                        <Sparkles className="size-3 text-ochre" />
                        <span>Ready for Table · Tap for Pass</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* iPhone Home Bar */}
                <div className="relative z-30 pb-2 flex justify-center bg-[#F7F4EE]">
                  <div className="h-1 w-20 rounded-full bg-neutral-400" />
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
