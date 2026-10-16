import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { QUIZ_QUESTIONS, type QuizQuestion } from "@/lib/quiz-data";
import { calculateSocialProfile } from "@/lib/scoring-engine";
import { ArrowLeft, ArrowRight, Check, Sparkles, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

export const Route = createFileRoute("/quiz/")({
  head: () => ({
    meta: [
      { title: "Social Discovery Quiz — Precious Meets" },
      { name: "description", content: "Discover your social archetype and find curated tables of compatible minds." },
    ],
  }),
  component: QuizPage,
});

const LOCAL_STORAGE_KEY = "precious_meets_quiz_answers";

function QuizPage() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);

  // Restore previous answers if any
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        setAnswers(JSON.parse(saved));
      } catch (e) {
        // Ignore
      }
    }
  }, []);

  const currentQ: QuizQuestion = QUIZ_QUESTIONS[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100);

  const saveAnswer = (questionId: string, value: any) => {
    const updated = { ...answers, [questionId]: value };
    setAnswers(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  };

  const handleNext = () => {
    if (currentQ.isRequired && !answers[currentQ.id]) {
      toast.error("Please select an answer to continue.");
      return;
    }

    if (currentIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const profileResult = calculateSocialProfile(answers);
    localStorage.setItem("precious_meets_latest_profile", JSON.stringify(profileResult));
    toast.success("Profile calculated! Curating your tables...");
    navigate({ to: "/quiz/results" });
  };

  const handleReset = () => {
    if (confirm("Reset all quiz answers?")) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setAnswers({});
      setCurrentIndex(0);
    }
  };

  const currentVal = answers[currentQ.id];

  return (
    <div className="flex min-h-screen flex-col bg-ivory text-foreground">
      {/* Top Bar with Progress */}
      <header className="sticky top-0 z-30 border-b border-border/80 bg-ivory/95 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <button
            onClick={() => navigate({ to: "/" })}
            className="font-display text-xl tracking-tight text-foreground"
          >
            Precious<em className="text-burgundy not-italic font-normal">meets</em>
          </button>
          <div className="flex items-center gap-4">
            <span className="label-mono text-xs text-muted-foreground">
              {currentIndex + 1} of {QUIZ_QUESTIONS.length}
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

      {/* Main Question View */}
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-6 py-12">
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

        {/* Navigation Buttons */}
        <div className="mt-12 flex items-center justify-between border-t border-border/60 pt-6">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" /> Back
          </Button>

          <Button
            onClick={handleNext}
            disabled={submitting}
            className="flex items-center gap-2 rounded-full bg-burgundy px-6 py-5 text-xs font-semibold uppercase tracking-wider text-ivory hover:bg-burgundy/90"
          >
            {currentIndex === QUIZ_QUESTIONS.length - 1 ? (
              <>
                <Sparkles className="size-3.5" /> Complete & Match
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
