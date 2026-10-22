import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { QUIZ_QUESTIONS, QuizQuestion } from "@/lib/quiz-data";
import {
  FileQuestion,
  Sparkles,
  CheckCircle2,
  Calendar,
  RotateCcw,
  Sliders,
  Compass,
  User,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function QuizResponsesSection() {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [contact, setContact] = useState<{
    fullName?: string;
    phone?: string;
    email?: string;
    pincode?: string;
    submittedAt?: string;
  }>({});

  useEffect(() => {
    try {
      const savedAnswers = localStorage.getItem("precious_meets_quiz_answers");
      if (savedAnswers) {
        setAnswers(JSON.parse(savedAnswers));
      } else {
        // Fallback default answers for demonstration
        setAnswers({
          q1: "contributor",
          q2: "fulfilled_balanced",
          q3: 65,
          q4: ["art_culture", "philosophy_life", "culinary_travel"],
          q5: "thoughtful_stories",
          q6: "culinary_explorer",
          q7: ["creative_minds", "entrepreneurs_builders"],
          q8: "friday_saturday_evening",
          q9: true,
        });
      }

      const savedContact = localStorage.getItem("precious_meets_user_contact");
      if (savedContact) {
        setContact(JSON.parse(savedContact));
      } else {
        setContact({
          fullName: "Aria Sharma",
          phone: "+91 98100 12345",
          email: "aria.sharma@example.com",
          pincode: "110030",
          submittedAt: "22 October 2026",
        });
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const getOptionLabel = (q: QuizQuestion, answerValue: any) => {
    if (q.type === "slider") {
      return (
        <span className="font-mono font-bold text-burgundy">
          Tempo Index: {answerValue || 50}/100 ({answerValue > 50 ? "Lively & Buzzing" : "Intimate & Slow"})
        </span>
      );
    }

    if (Array.isArray(answerValue)) {
      const labels = answerValue
        .map((val) => q.options.find((o) => o.value === val)?.label || val)
        .join(", ");
      return <span className="font-medium text-foreground">{labels || "Selected Multiple"}</span>;
    }

    const matched = q.options.find((o) => o.value === answerValue);
    if (matched) {
      return (
        <div>
          <span className="font-medium text-foreground block">{matched.label}</span>
          {matched.sublabel && (
            <span className="text-[11px] text-muted-foreground">{matched.sublabel}</span>
          )}
        </div>
      );
    }

    return <span className="text-muted-foreground">{String(answerValue || "Not answered")}</span>;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end border-b border-border/60 pb-5">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-burgundy font-bold">
            Application Discovery Record
          </span>
          <h2 className="font-display mt-1 text-2xl sm:text-3xl text-foreground">
            My Submitted Quiz Responses
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            The 9-dimension conversational discovery questions answered during your table membership application.
          </p>
        </div>

        <Link
          to="/quiz"
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-sage/40 transition-colors shadow-xs"
        >
          <RotateCcw className="size-3.5 text-ochre" /> Retake Discovery Quiz
        </Link>
      </div>

      {/* Application Snapshot Card */}
      <div className="rounded-3xl border border-border/80 bg-gradient-to-r from-sage/20 via-card to-ochre/10 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-5 text-forest" />
            <span className="font-display text-lg text-foreground">
              Discovery Application Completed
            </span>
          </div>
          <span className="font-mono text-xs text-muted-foreground">
            Date Filled: <strong className="text-foreground">{contact.submittedAt || "22 October 2026"}</strong>
          </span>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-4 text-xs">
          <div>
            <span className="text-muted-foreground block text-[11px]">Applicant Name</span>
            <span className="font-semibold text-foreground">{contact.fullName || "Founding Member"}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px]">Primary Phone</span>
            <span className="font-semibold text-foreground">{contact.phone || "+91 98100 12345"}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px]">Contact Email</span>
            <span className="font-semibold text-foreground">{contact.email || "member@preciousmeets.com"}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px]">Postal Pincode</span>
            <span className="font-semibold text-foreground">{contact.pincode || "110030"}</span>
          </div>
        </div>
      </div>

      {/* 9 Questions List */}
      <div className="space-y-4">
        <h3 className="font-display text-xl text-foreground">
          Questionnaire Breakdown (9 Calibration Dimensions)
        </h3>

        <div className="space-y-3">
          {QUIZ_QUESTIONS.map((q, idx) => {
            const userAnswer = answers[q.id];

            return (
              <div
                key={q.id}
                className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs transition-all hover:border-burgundy/30"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="grid size-5 place-items-center rounded-full bg-burgundy/15 font-mono text-[10px] font-bold text-burgundy">
                        {idx + 1}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        {q.category.replace("_", " ")}
                      </span>
                    </div>

                    <h4 className="font-display text-base text-foreground mt-1">
                      {q.title}
                    </h4>

                    {q.subtitle && (
                      <p className="text-[11px] text-muted-foreground">
                        {q.subtitle}
                      </p>
                    )}
                  </div>

                  <span className="shrink-0 rounded-full bg-sage/30 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-forest">
                    {q.dimension.replace("_", " ")}
                  </span>
                </div>

                {/* Selected Choice Box */}
                <div className="mt-3 rounded-xl bg-sage/20 border border-border/60 p-3 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="text-[10px] uppercase font-mono font-semibold text-burgundy shrink-0 mt-0.5">
                      Your Response:
                    </span>
                    <div className="flex-1">
                      {getOptionLabel(q, userAnswer)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
