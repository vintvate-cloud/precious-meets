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
  Lock,
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
        // Exit to home
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNext = () => {
    // If still in quiz questions
    if (currentIndex < QUIZ_QUESTIONS.length) {
      const currentQ = QUIZ_QUESTIONS[currentIndex];
      if (currentQ && currentQ.isRequired && !answers[currentQ.id]) {
        toast.error("Please select an answer to continue.");
        return;
      }
      goToStep(currentIndex + 1);
      return;
    }

    // If on the final contact step (Page Breaker)
    handleSubmit();
  };

  const handleBack = () => {
    if (currentIndex === 0) {
      // Navigate back to home page smoothly
      navigate({ to: "/" });
      return;
    }

    // Move to previous step
    const prev = currentIndex - 1;
    window.history.back();
    setCurrentIndex(prev);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    // Validate final contact questions
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

    // Save contact information
    const contactData = {
      fullName: fullName.trim(),
      phone: cleanPhone,
      pincode: cleanPin,
      email: email.trim(),
    };
    localStorage.setItem(LOCAL_STORAGE_CONTACT_KEY, JSON.stringify(contactData));

    // Seed mock profile so user name carries forward immediately
    const userSession = {
      id: `u_${Date.now()}`,
      email: contactData.email,
      user_metadata: {
        full_name: contactData.fullName,
        name: contactData.fullName.split(" ")[0] || "Guest",
      },
    };
    const profileSession = {
      id: userSession.id,
      email: contactData.email,
      full_name: contactData.fullName,
      display_name: contactData.fullName.split(" ")[0] || "Guest",
      city: "Delhi NCR",
      phone: contactData.phone,
      identity_verified: true,
      identity_status: "verified",
      onboarding_completed: true,
      quiz_completed: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    localStorage.setItem(
      "precious_meets_mock_user",
      JSON.stringify({ user: userSession, profile: profileSession })
    );

    // Compute Social Profile Scores
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

  // Determine if we're on question or final contact step
  const isContactStep = currentIndex === QUIZ_QUESTIONS.length;
  const currentQ: QuizQuestion | undefined = !isContactStep
    ? QUIZ_QUESTIONS[currentIndex]
    : undefined;
  const currentVal = currentQ ? answers[currentQ.id] : undefined;

  return (
    <div className="flex min-h-screen flex-col bg-ivory text-foreground">
      {/* Top Bar with Progress */}
      <header className="sticky top-0 z-30 border-b border-border/80 bg-ivory/95 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <button
            onClick={() => navigate({ to: "/" })}
            className="font-display text-xl tracking-tight text-foreground transition-opacity hover:opacity-80"
          >
            Precious<em className="text-burgundy not-italic font-normal">meets</em>
          </button>
          <div className="flex items-center gap-4">
            <span className="label-mono text-xs text-muted-foreground">
              {isContactStep ? "Final Step" : `${currentIndex + 1} of ${QUIZ_QUESTIONS.length}`}
            </span>
            <button
              onClick={handleReset}
              title="Start Over"
              className="text-muted-foreground transition-colors hover:text-burgundy"
            >
              <RefreshCcw className="size-3.5" />
            </button>
          </div>
        </div>
        <div className="mx-auto mt-3 h-1 w-full max-w-3xl overflow-hidden rounded-full bg-sage/60">
          <div
            className="h-full bg-burgundy transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      {/* Main View Area */}
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-6 py-12">
        {/* ------------------------------------------------------------- */}
        {/* CASE A: Standard Quiz Question (Questions 1 through 9) */}
        {/* ------------------------------------------------------------- */}
        {!isContactStep && currentQ && (
          <div>
            <div className="mb-2">
              <span className="label-mono inline-block rounded-full bg-sage/60 px-3 py-1 text-xs text-forest">
                {currentQ.category.replace("_", " ").toUpperCase()}
              </span>
            </div>

            <h1 className="font-display text-3xl leading-snug md:text-4xl">
              {currentQ.title}
            </h1>
            {currentQ.subtitle && (
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {currentQ.subtitle}
              </p>
            )}

            {/* Options Rendering */}
            <div className="mt-8 space-y-3">
              {currentQ.type === "single_select" && (
                <div className="grid gap-3">
                  {currentQ.options.map((opt) => {
                    const isSelected = currentVal === opt.value;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => saveAnswer(currentQ.id, opt.value)}
                        className={`flex items-start justify-between rounded-xl border p-4 text-left transition-all ${
                          isSelected
                            ? "border-burgundy bg-card shadow-sm ring-1 ring-burgundy"
                            : "border-border/80 bg-card/60 hover:border-burgundy/40 hover:bg-card"
                        }`}
                      >
                        <div>
                          <p className="font-medium text-foreground">{opt.label}</p>
                          {opt.sublabel && (
                            <p className="mt-1 text-xs text-muted-foreground">{opt.sublabel}</p>
                          )}
                        </div>
                        <div
                          className={`grid size-5 shrink-0 place-items-center rounded-full border transition-colors ${
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

              {currentQ.type === "multi_select" && (
                <div className="grid gap-2.5 sm:grid-cols-2">
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
                        onClick={toggle}
                        className={`flex items-center justify-between rounded-xl border p-3.5 text-left text-sm transition-all ${
                          isSelected
                            ? "border-burgundy bg-card font-medium text-foreground ring-1 ring-burgundy"
                            : "border-border/80 bg-card/60 text-muted-foreground hover:border-burgundy/40 hover:bg-card"
                        }`}
                      >
                        <span>{opt.label}</span>
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

              {currentQ.type === "slider" && (
                <div className="rounded-xl border border-border/80 bg-card p-6">
                  <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                    <span>{currentQ.sliderLabels?.left || "Low"}</span>
                    <span>{currentQ.sliderLabels?.right || "High"}</span>
                  </div>
                  <div className="py-6">
                    <Slider
                      defaultValue={[typeof currentVal === "number" ? currentVal : 50]}
                      max={currentQ.sliderMax || 100}
                      min={currentQ.sliderMin || 0}
                      step={currentQ.sliderStep || 5}
                      onValueChange={(val) => saveAnswer(currentQ.id, val[0])}
                      className="accent-burgundy"
                    />
                  </div>
                  <p className="text-center font-mono text-sm font-semibold text-burgundy">
                    Selected: {typeof currentVal === "number" ? currentVal : 50}%
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* CASE B: PAGE BREAKER + FINAL BASIC QUESTIONS (SINGLE PAGE) */}
        {/* ------------------------------------------------------------- */}
        {isContactStep && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Page Breaker Header Card */}
            <div className="rounded-2xl border border-burgundy/30 bg-burgundy/5 p-6 text-center">
              <span className="label-mono inline-block rounded-full bg-burgundy px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-ivory">
                Final Step · Delhi NCR Table Placement
              </span>
              <h1 className="font-display mt-3 text-3xl md:text-4xl text-foreground">
                Hold your seat at the <em className="italic text-burgundy">table</em>
              </h1>
              <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-muted-foreground">
                To eliminate predatory anonymity, Precious Meets requires basic details for 100% Offline Aadhaar verification via DigiLocker.
              </p>
            </div>

            {/* Single-Page Contact Form */}
            <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm space-y-4">
              {/* Full Name */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <User className="size-3.5 text-burgundy" /> Full Name (as per Aadhaar ID)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Aisha Mehra"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-input bg-background p-3 text-sm text-foreground focus:border-burgundy focus:outline-none focus:ring-1 focus:ring-burgundy"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <Phone className="size-3.5 text-forest" /> Mobile Number (for Secret Venue Access)
                </label>
                <div className="mt-1.5 flex rounded-xl border border-input bg-background overflow-hidden focus-within:border-burgundy focus-within:ring-1 focus-within:ring-burgundy">
                  <span className="flex items-center px-3 text-xs font-mono font-semibold bg-sage/30 text-muted-foreground border-r border-border/60">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    className="w-full p-3 text-sm text-foreground bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              {/* Grid: Pincode and Email */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Pincode */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                    <MapPin className="size-3.5 text-ochre" /> Delhi NCR Pincode
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="e.g. 110001"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                    className="mt-1.5 w-full rounded-xl border border-input bg-background p-3 text-sm text-foreground focus:border-burgundy focus:outline-none focus:ring-1 focus:ring-burgundy"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                    <Mail className="size-3.5 text-burgundy" /> Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="you@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-input bg-background p-3 text-sm text-foreground focus:border-burgundy focus:outline-none focus:ring-1 focus:ring-burgundy"
                  />
                </div>
              </div>

              {/* Safety Assurance Callout */}
              <div className="mt-6 rounded-xl border border-forest/20 bg-forest/5 p-4 text-[11px] leading-relaxed text-muted-foreground">
                <div className="flex items-center gap-1.5 font-semibold text-forest">
                  <ShieldCheck className="size-4" /> 100% Aadhaar Verification & Strict Privacy
                </div>
                <p className="mt-1">
                  We never store raw Aadhaar numbers or biometrics. All identity validation is performed via secure DigiLocker XML. Your contact is never sold, shared, or spammed.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* Navigation Buttons (Always working Back button) */}
        {/* ------------------------------------------------------------- */}
        <div className="mt-12 flex items-center justify-between border-t border-border/60 pt-6">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <ArrowLeft className="size-3.5" />
            {currentIndex === 0 ? "Back to Home" : "Back"}
          </Button>

          <Button
            onClick={handleNext}
            disabled={submitting}
            className="flex items-center gap-2 rounded-full bg-burgundy px-7 py-5 text-xs font-semibold uppercase tracking-wider text-ivory hover:bg-burgundy/90 shadow-sm cursor-pointer"
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
        </div>
      </main>
    </div>
  );
}
