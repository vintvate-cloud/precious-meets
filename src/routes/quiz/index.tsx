import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
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
  UploadCloud,
  FileText,
  CheckCircle2,
  Trash2,
  Image as ImageIcon,
  Loader2,
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
  const [aadhaarFileUrl, setAadhaarFileUrl] = useState<string | null>(null);
  const [aadhaarFileName, setAadhaarFileName] = useState<string | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Always initialize quiz with clean empty fields for all users
  useEffect(() => {
    // Clear any previous answers and contact data so questions always start unselected
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(LOCAL_STORAGE_CONTACT_KEY);
    setAnswers({});
    setCurrentIndex(0);
    setFullName("");
    setPhone("");
    setPincode("");
    setEmail("");
    setAadhaarFileUrl(null);
    setAadhaarFileName(null);

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

  const handleAadhaarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size is too large. Please select a document under 10MB.");
      return;
    }

    setIsProcessingFile(true);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Compress using canvas to ensure it fits comfortably in localStorage (~40-70kb)
          const MAX_DIM = 850;
          let width = img.width;
          let height = img.height;
          if (width > MAX_DIM || height > MAX_DIM) {
            if (width > height) {
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            } else {
              width = Math.round((width * MAX_DIM) / height);
              height = MAX_DIM;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.65);
            setAadhaarFileUrl(compressedDataUrl);
            setAadhaarFileName(file.name);
            toast.success("Aadhaar card image attached successfully!");
          } else {
            setAadhaarFileUrl(event.target?.result as string);
            setAadhaarFileName(file.name);
          }
          setIsProcessingFile(false);
        };
        img.onerror = () => {
          toast.error("Failed to process image file. Please try another image.");
          setIsProcessingFile(false);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    } else if (file.type === "application/pdf") {
      if (file.size > 3 * 1024 * 1024) {
        toast.error("PDF is larger than 3MB. Please upload a smaller PDF or an image.");
        setIsProcessingFile(false);
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setAadhaarFileUrl(event.target?.result as string);
        setAadhaarFileName(file.name);
        toast.success("Aadhaar PDF document attached successfully!");
        setIsProcessingFile(false);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Unsupported file type. Please upload a JPG, PNG, WEBP, or PDF.");
      setIsProcessingFile(false);
    }
  };

  const handleRemoveAadhaar = () => {
    setAadhaarFileUrl(null);
    setAadhaarFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
    if (!aadhaarFileUrl) {
      toast.error("Please upload your Aadhaar Card document for identity verification.");
      return;
    }

    setSubmitting(true);

    const contactData = {
      fullName: fullName.trim(),
      phone: cleanPhone,
      pincode: cleanPin,
      email: email.trim(),
      aadhaarFileUrl,
      aadhaarFileName: aadhaarFileName || "aadhaar_card_upload",
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

                {/* Aadhaar Card Upload Field */}
                <div className="space-y-2 pt-2 border-t border-border/70">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-foreground">
                      <ShieldCheck className="size-4 text-forest" />
                      <span>Upload Aadhaar Card (Front / Full)</span>
                      <span className="text-burgundy text-xs font-bold">*</span>
                    </label>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      JPG, PNG, PDF (Max 10MB)
                    </span>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleAadhaarFileChange}
                    className="hidden"
                  />

                  {!aadhaarFileUrl ? (
                    <div
                      onClick={() => !isProcessingFile && fileInputRef.current?.click()}
                      className="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/90 bg-muted/20 p-4 sm:p-5 text-center hover:border-burgundy/60 hover:bg-sage/10 transition-all duration-200 cursor-pointer"
                    >
                      {isProcessingFile ? (
                        <div className="flex flex-col items-center gap-2 py-2">
                          <Loader2 className="size-6 animate-spin text-burgundy" />
                          <p className="text-xs sm:text-sm font-medium text-foreground">
                            Processing & optimizing document...
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="size-10 rounded-full bg-sage/30 flex items-center justify-center text-forest group-hover:bg-burgundy/10 group-hover:text-burgundy transition-colors">
                            <UploadCloud className="size-5" />
                          </div>
                          <p className="mt-2 text-xs sm:text-sm font-semibold text-foreground">
                            Click to upload Aadhaar card
                          </p>
                          <p className="mt-0.5 text-[11px] text-muted-foreground">
                            Required for 100% offline identity verification. Stored securely.
                          </p>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-forest/30 bg-forest/5 p-3 sm:p-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {aadhaarFileUrl.startsWith("data:image/") ? (
                          <div className="relative size-12 shrink-0 rounded-xl overflow-hidden border border-border shadow-xs bg-card">
                            <img
                              src={aadhaarFileUrl}
                              alt="Aadhaar Preview"
                              className="size-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="size-12 shrink-0 rounded-xl bg-burgundy/10 flex items-center justify-center text-burgundy border border-burgundy/20">
                            <FileText className="size-6" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="size-3.5 text-forest shrink-0" />
                            <p className="text-xs sm:text-sm font-semibold text-foreground truncate">
                              {aadhaarFileName || "Aadhaar_Document_Uploaded"}
                            </p>
                          </div>
                          <p className="text-[11px] text-forest font-medium mt-0.5">
                            ✓ Aadhaar attached for verification
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          className="h-8 px-2.5 text-xs text-foreground hover:bg-muted cursor-pointer"
                        >
                          Change
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleRemoveAadhaar}
                          className="h-8 px-2 text-xs text-destructive hover:bg-destructive/10 cursor-pointer"
                          title="Remove file"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  )}
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
