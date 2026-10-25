import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ShieldCheck,
  Sparkles,
  QrCode,
  CheckCircle2,
  Lock,
  ArrowRight,
  Check,
  Ticket,
  Compass,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const HOW_STEPS = [
  {
    num: "01",
    tag: "Onboarding",
    title: "Profile Preferences",
    desc: "Set your preferred Delhi NCR dining enclave, contact info, and one-line vibe.",
    pill: "/onboarding",
  },
  {
    num: "02",
    tag: "Discovery Quiz",
    title: "Conversational Mapping",
    desc: "9 intuitive questions to map your social energy, depth, and curiosity archetype.",
    pill: "/quiz",
  },
  {
    num: "03",
    tag: "Offline Aadhaar",
    title: "DigiLocker Verification",
    desc: "Authorized offline XML check. Zero raw UID storage. 100% verified real humans.",
    pill: "/verify-identity",
  },
  {
    num: "04",
    tag: "Member Hub",
    title: "Secret Table & Gate Pass",
    desc: "Your digital pass unlocks the heritage venue gate code, table seat, and host QR scan.",
    pill: "/dashboard",
  },
];

export function HowPhoneMockup() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  // Scroll-driven screen change engine (No automatic timer)
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const calculateStep = () => {
      const rect = section.getBoundingClientRect();
      const totalScroll = section.offsetHeight - window.innerHeight;
      if (totalScroll <= 0) return;

      const currentScroll = -rect.top;
      const progress = Math.max(0, Math.min(1, currentScroll / totalScroll));

      // Map progress into 4 discrete step indexes: 0, 1, 2, 3
      const stepIndex = Math.min(
        HOW_STEPS.length - 1,
        Math.floor(progress * HOW_STEPS.length)
      );
      setActiveStep(stepIndex);
    };

    // GSAP ScrollTrigger integration
    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const stepIndex = Math.min(
          HOW_STEPS.length - 1,
          Math.floor(self.progress * HOW_STEPS.length)
        );
        setActiveStep(stepIndex);
      },
    });

    window.addEventListener("scroll", calculateStep, { passive: true });
    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      st.kill();
      window.removeEventListener("scroll", calculateStep);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const handleStepClick = (index: number) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const totalScroll = sectionRef.current.offsetHeight - window.innerHeight;
    const targetProgress = (index + 0.5) / HOW_STEPS.length;
    const targetScroll = window.scrollY + rect.top + targetProgress * totalScroll;
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
    setActiveStep(index);
  };

  const currentStep = HOW_STEPS[activeStep];
  const isNight = activeStep >= 2;

  return (
    <section
      id="how"
      ref={sectionRef}
      className={`relative h-[320vh] text-ivory select-none transition-colors duration-1000 ease-in-out ${
        isNight ? "bg-black" : "bg-[#5F7045]"
      }`}
    >
      {/* Sticky Full-Viewport Pinning Stage */}
      <div className="sticky top-0 h-[100dvh] w-full flex items-center justify-center overflow-hidden">
        {/* CSS Transitions */}
        <style>{`
          @keyframes cardFadeUp {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .anim-card-fade {
            animation: cardFadeUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}</style>

        {/* ======================================================== */}
        {/* DAY TO NIGHT DYNAMIC BACKGROUND SYSTEM */}
        {/* ======================================================== */}
        
        {/* 1. Day Sky Base (Olive Green) */}
        <div
          className="absolute inset-0 bg-[#5F7045] transition-opacity duration-1000 ease-in-out"
          style={{ opacity: isNight ? 0 : 1 }}
        />

        {/* 2. Pure Black Night Sky (Matches the lower section 100% seamlessly) */}
        <div
          className="absolute inset-0 bg-black transition-opacity duration-1000 ease-in-out"
          style={{ opacity: isNight ? 1 : 0 }}
        />

        {/* 3. Delicate Twinkling Night Stars */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-1000 ease-out"
          style={{ opacity: isNight ? 0.75 : 0 }}
        >
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12%" cy="14%" r="1" fill="#FFF" className="animate-pulse" />
            <circle cx="24%" cy="26%" r="1.4" fill="#F4DFC8" />
            <circle cx="38%" cy="16%" r="0.8" fill="#FFF" />
            <circle cx="48%" cy="22%" r="1" fill="#EADBB6" className="animate-pulse" />
            <circle cx="68%" cy="12%" r="1.3" fill="#FFF" />
            <circle cx="82%" cy="18%" r="1.6" fill="#C6A568" className="animate-pulse" />
            <circle cx="91%" cy="26%" r="0.9" fill="#FFF" />
            <circle cx="16%" cy="75%" r="1" fill="#FFF" />
            <circle cx="28%" cy="84%" r="0.8" fill="#EADBB6" />
            <circle cx="76%" cy="78%" r="1.2" fill="#FFF" className="animate-pulse" />
            <circle cx="88%" cy="82%" r="1.4" fill="#EADBB6" />
          </svg>
        </div>

        {/* 4. Daytime Ambient Backdrop Glows (Disabled in night mode so black stays pure) */}
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-1000"
          style={{ opacity: isNight ? 0 : 1 }}
        >
          <div className="w-[50vw] h-[50vw] max-w-[650px] max-h-[650px] rounded-full bg-[#C6A568]/10 blur-[160px]" />
          <div className="w-[35vw] h-[35vw] max-w-[500px] max-h-[500px] rounded-full bg-[#691C35]/12 blur-[140px]" />
        </div>

        {/* Main Viewport Container */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 w-full">
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-8">
            
            {/* Left Column: Headline & Walkthrough Badge */}
            <div className="flex flex-col justify-center text-center lg:text-left lg:col-span-4 xl:col-span-4">
              <div className="flex items-center justify-center lg:justify-start gap-2.5 mb-3">
                <div className="inline-flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full transition-all duration-700 ${
                      isNight
                        ? "bg-amber-300 shadow-[0_0_8px_#FCD34D]"
                        : "bg-ochre animate-pulse"
                    }`}
                  />
                  <p className="font-mono text-[11px] uppercase tracking-widest text-ochre font-semibold transition-colors duration-700">
                    {isNight ? "Twilight to Supper Table" : "Platform Walkthrough"}
                  </p>
                </div>

                <div className="px-2.5 py-0.5 rounded-full bg-ivory/10 text-ivory/70 text-[10px] font-mono transition-colors duration-700">
                  <span>{activeStep + 1} of 4</span>
                </div>
              </div>

              <h2 className="font-display text-3xl sm:text-4xl lg:text-[3rem] xl:text-[3.4rem] leading-[0.98] tracking-tight text-ivory">
                How strangers<br />
                <em className="font-serif italic text-ochre font-normal">become friends.</em>
              </h2>
            </div>

            {/* Center Column: Phone Mockup */}
            <div className="flex flex-col items-center justify-center lg:col-span-4 xl:col-span-4">
              {/* iPhone Frame */}
              <div
                className="relative w-[260px] sm:w-[275px] md:w-[285px] lg:w-[295px] h-[520px] sm:h-[545px] md:h-[560px] rounded-[44px] bg-[#0E0D0C] p-2.5 shadow-[0_25px_60px_-12px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.14)_inset,0_0_0_3px_#34312E] transition-all duration-700"
                style={{
                  boxShadow: isNight
                    ? "0 25px 60px -12px rgba(0,0,0,0.95), 0 0 50px -10px rgba(198,165,104,0.15)"
                    : undefined,
                }}
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

                  {/* Inside Screen Flow: Smooth Cross-fade Based on Scroll Position */}
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
                    {/* PAGE 4: /dashboard (Member Hub & Official Pass) */}
                    {/* ======================================================== */}
                    <div
                      className={`absolute inset-0 p-3.5 flex flex-col justify-between transition-all duration-500 ease-out ${
                        activeStep === 3
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

                        {/* Official Member Pass Card */}
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

              {/* Subtle Step Dots */}
              <div className="mt-5 flex items-center justify-center gap-2">
                {HOW_STEPS.map((step, idx) => (
                  <button
                    key={step.num}
                    type="button"
                    onClick={() => handleStepClick(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === activeStep ? "w-6 bg-ochre" : "w-2 bg-ivory/30 hover:bg-ivory/60"
                    }`}
                    title={`Step ${step.num}: ${step.title}`}
                    aria-label={`Go to step ${step.num}`}
                  />
                ))}
              </div>
            </div>

            {/* Right Column: Dynamic Step Title, Description & Action */}
            <div className="flex flex-col justify-center text-center lg:text-left lg:col-span-4 xl:col-span-4 max-w-md mx-auto lg:mx-0">
              {/* Dynamic Active Step Title & Subtitle */}
              <div
                key={activeStep}
                className="anim-card-fade"
              >
                <h3 className="font-display text-2xl sm:text-3xl lg:text-[2rem] text-ochre font-medium leading-snug">
                  {currentStep.title}
                </h3>
                <p className="text-sm sm:text-base text-ivory/80 mt-3 leading-relaxed">
                  {currentStep.desc}
                </p>
              </div>

              {/* Action Link & NCR Badge */}
              <div className="mt-8 flex flex-col sm:flex-row lg:flex-col items-center lg:items-start gap-3">
                <a
                  href="/quiz"
                  className="inline-flex items-center gap-2 rounded-full bg-burgundy hover:bg-ochre hover:text-ink px-6 py-3 text-xs font-mono uppercase tracking-widest text-ivory shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <span>Take the 3-min quiz</span>
                  <ArrowRight className="size-3.5" />
                </a>
                <span className="font-mono text-xs text-ivory/60">
                  100% Offline · Delhi NCR
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
