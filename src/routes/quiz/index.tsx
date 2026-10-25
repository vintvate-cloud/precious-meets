import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { QUIZ_QUESTIONS, type QuizQuestion } from "@/lib/quiz-data";
import { calculateSocialProfile } from "@/lib/scoring-engine";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Sparkles,
  RefreshCcw,
  ShieldCheck,
  User,
  Phone,
  MapPin,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

export const Route = createFileRoute("/quiz/")({
  head: () => ({
    meta: [
      { title: "Social Discovery Quiz & Table Reservation — Precious Meets" },
      {
        name: "description",
        content: "Discover your conversational archetype, verified with 100% Offline Aadhaar for safe, curated dining in Delhi NCR.",
      },
    ],
  }),
  component: QuizPage,
});

const LOCAL_STORAGE_KEY = "precious_meets_quiz_answers";
const LOCAL_STORAGE_CONTACT_KEY = "precious_meets_user_contact";

// Total steps = 9 quiz questions + 1 final contact page breaker step
const TOTAL_STEPS = QUIZ_QUESTIONS.length + 1; // 10 steps

export function QuizPage() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(false);

  // Final Step: Basic Questions
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [pincode, setPincode] = useState("");
  const [email, setEmail] = useState("");

  // Restore previous answers and contacts if any
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        setAnswers(JSON.parse(saved));
      } catch (e) {
        // Ignore
      }
    }

    const savedContact = localStorage.getItem(LOCAL_STORAGE_CONTACT_KEY);
    if (savedContact) {
      try {
        const c = JSON.parse(savedContact);
        if (c.fullName) setFullName(c.fullName);
        if (c.phone) setPhone(c.phone);
        if (c.pincode) setPincode(c.pincode);
        if (c.email) setEmail(c.email);
      } catch (e) {
        // Ignore
      }
    }

    // Set initial history state
    window.history.replaceState({ quizStep: 0 }, "");

    // Browser back button handling
    const handlePopState = (e: PopStateEvent) => {
      if (e.state && typeof e.state.quizStep === "number") {
        setCurrentIndex(e.state.quizStep);
      } else {
        navigate({ to: "/" });
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [navigate]);

  const progressPercent = Math.round(((currentIndex + 1) / TOTAL_STEPS) * 100);

  const saveAnswer = (questionId: string, value: any) => {
    const updated = { ...answers, [questionId]: value };
    setAnswers(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  };

  const goToStep = (nextIndex: number) => {
    window.history.pushState({ quizStep: nextIndex }, "");
    setCurrentIndex(nextIndex);
  };

  // Auto-advance for single select options
  const handleSingleSelect = (questionId: string, value: string) => {
    if (isAutoAdvancing) return;
    saveAnswer(questionId, value);
    setIsAutoAdvancing(true);

    // Brief highlight feedback before moving to next step
    setTimeout(() => {
      goToStep(currentIndex + 1);
      setIsAutoAdvancing(false);
    }, 220);
  };

  const handleNext = () => {
    // If still in quiz questions
    if (currentIndex < QUIZ_QUESTIONS.length) {
      const currentQ = QUIZ_QUESTIONS[currentIndex];
      if (currentQ) {
        // Ensure slider defaults to 50 if user hasn't touched it
        if (currentQ.type === "slider" && answers[currentQ.id] === undefined) {
          saveAnswer(currentQ.id, 50);
        } else if (currentQ.isRequired && !answers[currentQ.id]) {
          toast.error("Please select an answer to continue.");
          return;
        }
      }
      goToStep(currentIndex + 1);
      return;
    }

    // If on the final contact step
    handleSubmit();
  };

  const handleBack = () => {
    if (currentIndex === 0) {
      navigate({ to: "/" });
      return;
    }

    const prev = currentIndex - 1;
    window.history.back();
    setCurrentIndex(prev);
  };

  const handleSubmit = async () => {
    if (!fullName.trim()) {
      toast.error("Please enter your full name.");
      return;
    }
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }
    const cleanPin = pincode.trim();
    if (cleanPin.length < 6) {
      toast.error("Please enter a valid 6-digit Pincode.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);

    const contactData = {
      fullName: fullName.trim(),
      phone: cleanPhone,
      pincode: cleanPin,
      email: email.trim(),
    };
    localStorage.setItem(LOCAL_STORAGE_CONTACT_KEY, JSON.stringify(contactData));

    // Store real applicant contact and calculated social compatibility profile
    const profileResult = calculateSocialProfile(answers);
    profileResult.dimensions.preferredCity = "Delhi NCR";
    localStorage.setItem("precious_meets_latest_profile", JSON.stringify(profileResult));

    toast.success("Profile calculated! Curating your Delhi NCR tables...");
    navigate({ to: "/quiz/results" });
  };

  const handleReset = () => {
    if (confirm("Reset all quiz answers and start over?")) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      localStorage.removeItem(LOCAL_STORAGE_CONTACT_KEY);
      setAnswers({});
      setCurrentIndex(0);
      window.history.replaceState({ quizStep: 0 }, "");
    }
  };

  const isContactStep = currentIndex === QUIZ_QUESTIONS.length;
  const currentQ: QuizQuestion | undefined = !isContactStep
    ? QUIZ_QUESTIONS[currentIndex]
    : undefined;
  const currentVal = currentQ ? answers[currentQ.id] : undefined;

  // Next button is shown ONLY for:
  // 1. multi_select (where multiple options can be chosen)
  // 2. slider ("pull" interaction)
  // 3. isContactStep (final submit)
  const showNextButton =
    isContactStep ||
    currentQ?.type === "multi_select" ||
    currentQ?.type === "slider";

  return (
    <div className="flex h-screen w-full flex-col justify-between overflow-hidden bg-ivory text-foreground selection:bg-burgundy/20">
      {/* Top Bar with Progress */}
      <header className="shrink-0 border-b border-border/80 bg-ivory/95 px-6 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="font-display text-xl tracking-tight text-foreground transition-opacity hover:opacity-80 cursor-pointer"
          >
            Precious<em className="text-burgundy not-italic font-normal">meets</em>
          </button>
          <div className="flex items-center gap-4">
            <span className="label-mono text-xs text-muted-foreground">
              {isContactStep ? "Final Step" : `${currentIndex + 1} of ${QUIZ_QUESTIONS.length}`}
            </span>
            <button
              type="button"
              onClick={handleReset}
              title="Start Over"
              className="text-muted-foreground transition-colors hover:text-burgundy cursor-pointer"
            >
              <RefreshCcw className="size-3.5" />
            </button>
          </div>
        </div>
        <div className="mx-auto mt-2.5 h-1 w-full max-w-3xl overflow-hidden rounded-full bg-sage/60">
          <div
            className="h-full bg-burgundy transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      {/* Main View Area (Non-scrollable container with vertically centered questions) */}
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-between px-4 sm:px-6 py-4 sm:py-6 overflow-hidden">
        {/* Centered Question / Step Box */}
        <div className="my-auto w-full max-h-[calc(100vh-140px)] overflow-y-auto no-scrollbar">
          {/* ------------------------------------------------------------- */}
          {/* CASE A: Standard Quiz Question (Questions 1 through 9) */}
          {/* ------------------------------------------------------------- */}
          {!isContactStep && currentQ && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div>
                <span className="label-mono inline-block rounded-full bg-sage/60 px-3 py-0.5 text-[11px] font-semibold text-forest">
                  {currentQ.category.replace("_", " ").toUpperCase()}
                </span>
                <h1 className="font-display mt-2 text-2xl sm:text-3xl lg:text-4xl leading-tight">
                  {currentQ.title}
                </h1>
                {currentQ.subtitle && (
                  <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                    {currentQ.subtitle}
                  </p>
                )}
              </div>

              {/* Options Rendering */}
              <div className="pt-2">
                {/* Single Select: clicking an option automatically highlights & advances */}
                {currentQ.type === "single_select" && (
                  <div
                    className={
                      currentQ.options.length > 4
                        ? "grid gap-2 sm:grid-cols-2"
                        : "grid gap-2.5"
                    }
                  >
                    {currentQ.options.map((opt) => {
                      const isSelected = currentVal === opt.value;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          disabled={isAutoAdvancing}
                          onClick={() => handleSingleSelect(currentQ.id, opt.value)}
                          className={`flex items-start justify-between rounded-xl border p-3.5 sm:p-4 text-left transition-all cursor-pointer ${
                            isSelected
                              ? "border-burgundy bg-card shadow-sm ring-1 ring-burgundy"
                              : "border-border/80 bg-card/70 hover:border-burgundy/40 hover:bg-card"
                          }`}
                        >
                          <div className="pr-2">
                            <p className="text-sm font-medium text-foreground">{opt.label}</p>
                            {opt.sublabel && (
                              <p className="mt-0.5 text-xs text-muted-foreground leading-snug">
                                {opt.sublabel}
                              </p>
                            )}
                          </div>
                          <div
                            className={`grid size-5 shrink-0 place-items-center rounded-full border transition-colors mt-0.5 ${
                              isSelected
                                ? "border-burgundy bg-burgundy text-ivory"
                                : "border-border/80 bg-background"
                            }`}
                          >
                            {isSelected && <Check className="size-3" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Multi Select: users toggle options, Next button is provided below */}
                {currentQ.type === "multi_select" && (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {currentQ.options.map((opt) => {
                      const arr = Array.isArray(currentVal) ? currentVal : [];
                      const isSelected = arr.includes(opt.value);

                      const toggle = () => {
                        let updated = [...arr];
                        if (isSelected) {
                          updated = updated.filter((v) => v !== opt.value);
                        } else {
                          updated.push(opt.value);
                        }
                        saveAnswer(currentQ.id, updated);
                      };

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={toggle}
                          className={`flex items-center justify-between rounded-xl border p-3 text-left text-sm transition-all cursor-pointer ${
                            isSelected
                              ? "border-burgundy bg-card font-medium text-foreground ring-1 ring-burgundy"
                              : "border-border/80 bg-card/70 text-muted-foreground hover:border-burgundy/40 hover:bg-card"
                          }`}
                        >
                          <span className="text-xs sm:text-sm">{opt.label}</span>
                          <div
                            className={`grid size-4 shrink-0 place-items-center rounded border transition-colors ${
                              isSelected
                                ? "border-burgundy bg-burgundy text-ivory"
                                : "border-border/80 bg-background"
                            }`}
                          >
                            {isSelected && <Check className="size-3" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Slider (Pull): user pulls/drags slider, Next button is provided below */}
                {currentQ.type === "slider" && (
                  <div className="rounded-xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs">
                    <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                      <span>{currentQ.sliderLabels?.left || "Low"}</span>
                      <span>{currentQ.sliderLabels?.right || "High"}</span>
                    </div>
                    <div className="py-6">
                      <Slider
                        defaultValue={[typeof currentVal === "number" ? currentVal : 50]}
                        value={[typeof currentVal === "number" ? currentVal : 50]}
                        max={currentQ.sliderMax || 100}
                        min={currentQ.sliderMin || 0}
                        step={currentQ.sliderStep || 5}
                        onValueChange={(val) => saveAnswer(currentQ.id, val[0])}
                        className="accent-burgundy"
                      />
                    </div>
                    <p className="text-center font-mono text-xs sm:text-sm font-semibold text-burgundy">
                      Selected: {typeof currentVal === "number" ? currentVal : 50}%
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* CASE B: FINAL STEP (Generous, slightly larger content)       */}
          {/* ------------------------------------------------------------- */}
          {isContactStep && (
            <div className="w-full space-y-4 sm:space-y-5 animate-in fade-in duration-300">
              <div className="text-center space-y-1.5">
                <h1 className="font-display text-3xl sm:text-4xl text-foreground leading-tight">
                  Hold your seat at the <em className="italic text-burgundy">table</em>
                </h1>
                <p className="mx-auto max-w-lg text-sm sm:text-[15px] leading-relaxed text-muted-foreground">
                  Basic details for curated table matching and 100% Offline Aadhaar verification via DigiLocker.
                </p>
              </div>

              {/* Generous Contact Form Card */}
              <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-7 shadow-xs space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Full Name */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-foreground">
                      <User className="size-4 text-burgundy" /> Full Name (as per Aadhaar ID)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Aisha Mehra"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-input bg-background py-3 px-3.5 text-sm sm:text-base text-foreground focus:border-burgundy focus:outline-none focus:ring-1 focus:ring-burgundy"
                    />
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-foreground">
                      <Phone className="size-4 text-forest" /> Mobile Number
                    </label>
                    <div className="mt-1.5 flex rounded-xl border border-input bg-background overflow-hidden focus-within:border-burgundy focus-within:ring-1 focus-within:ring-burgundy">
                      <span className="flex items-center px-3.5 text-sm font-mono font-semibold bg-sage/30 text-muted-foreground border-r border-border/60">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="9876543210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                        className="w-full py-3 px-3.5 text-sm sm:text-base text-foreground bg-transparent focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Pincode */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-foreground">
                      <MapPin className="size-4 text-ochre" /> Delhi NCR Pincode
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="e.g. 110001"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                      className="mt-1.5 w-full rounded-xl border border-input bg-background py-3 px-3.5 text-sm sm:text-base text-foreground focus:border-burgundy focus:outline-none focus:ring-1 focus:ring-burgundy"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-foreground">
                      <Mail className="size-4 text-burgundy" /> Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="you@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-input bg-background py-3 px-3.5 text-sm sm:text-base text-foreground focus:border-burgundy focus:outline-none focus:ring-1 focus:ring-burgundy"
                    />
                  </div>
                </div>

                {/* Safety Assurance */}
                <div className="flex items-center justify-center gap-2 pt-1.5 text-xs sm:text-[13px] text-muted-foreground text-center">
                  <ShieldCheck className="size-4 text-forest shrink-0" />
                  <span>100% Offline Aadhaar verification via DigiLocker. Never spammed or sold.</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* Bottom Navigation: Back is always present; Next only when needed */}
        {/* ------------------------------------------------------------- */}
        <div className="mt-3 shrink-0 flex items-center justify-between border-t border-border/60 pt-3">
          <Button
            type="button"
            variant="ghost"
            onClick={handleBack}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <ArrowLeft className="size-3.5" />
            {currentIndex === 0 ? "Back to Home" : "Back"}
          </Button>

          {showNextButton ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={submitting}
              className="flex items-center gap-2 rounded-full bg-burgundy px-6 py-4 text-xs font-semibold uppercase tracking-wider text-ivory hover:bg-burgundy/90 shadow-xs cursor-pointer active:scale-98"
            >
              {isContactStep ? (
                <>
                  <Sparkles className="size-3.5 text-ochre" />
                  {submitting ? "Curating Tables..." : "Calculate My Vibe & Reveal Tables"}
                </>
              ) : currentIndex === QUIZ_QUESTIONS.length - 1 ? (
                <>
                  Continue to Final Step <ArrowRight className="size-3.5" />
                </>
              ) : (
                <>
                  Next <ArrowRight className="size-3.5" />
                </>
              )}
            </Button>
          ) : (
            <span className="text-[11px] text-muted-foreground/60 italic hidden sm:inline">
              Select an option to proceed
            </span>
          )}
        </div>
      </main>
    </div>
  );
}
