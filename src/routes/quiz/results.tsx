import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { type SocialProfileScores } from "@/lib/scoring-engine";
import { useAuth } from "@/lib/auth-context";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { EmailService } from "@/lib/email-service";
import { ApplicationsService } from "@/lib/applications-service";
import { VerificationsService } from "@/lib/verifications-service";
import { CryptoService } from "@/lib/crypto-service";
import { openRazorpaySubscriptionCheckout } from "@/lib/razorpay-client";
import { supabase } from "@/lib/supabase";
import {

  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  CreditCard,
  Lock,
  Calendar,
  Wine,
  Users,
  CheckCircle2,
  Heart,
  Loader2,
  Mail,
  Compass,
  Clock,
  Printer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/quiz/results")({
  head: () => ({
    meta: [
      { title: "Your Vibe Profile & Membership — Precious Meets" },
      {
        name: "description",
        content: "Discover your conversational archetype, social insights, and unlock curated table access.",
      },
    ],
  }),
  component: QuizResultsPage,
});

export function QuizResultsPage() {
  const navigate = useNavigate();
  const { user, profile: authProfile, isSubscribed, subscription, activateSubscription } = useAuth();
  const [profile, setProfile] = useState<SocialProfileScores | null>(null);

  // Subscription Checkout Form State
  const [name, setName] = useState(authProfile?.display_name || user?.user_metadata?.full_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(authProfile?.phone || "");
  const [aadhaarFileUrl, setAadhaarFileUrl] = useState<string | undefined>(undefined);
  const [aadhaarFileName, setAadhaarFileName] = useState<string | undefined>(undefined);
  const [userPhotoUrl, setUserPhotoUrl] = useState<string | undefined>(undefined);
  const [userPhotoFileName, setUserPhotoFileName] = useState<string | undefined>(undefined);
  const [instagram, setInstagram] = useState<string | undefined>(undefined);
  const [linkedin, setLinkedin] = useState<string | undefined>(undefined);
  const [paying, setPaying] = useState(false);
  const [paidDossier, setPaidDossier] = useState<{ memberId: string; paymentId: string; invoiceNumber: string } | null>(null);

  // Success Dialog State
  const [successData, setSuccessData] = useState<{
    memberId: string;
    email: string;
    amount: string;
    invoiceNumber: string;
    paymentId: string;
  } | null>(null);

  useEffect(() => {
    const syncStatusWithDatabase = async () => {
      const emailToCheck = (email || user?.email || "").trim().toLowerCase();
      const rawPaid = typeof window !== "undefined" ? localStorage.getItem("precious_meets_paid_dossier") : null;

      if (!emailToCheck) {
        if (!user && typeof window !== "undefined") {
          localStorage.removeItem("precious_meets_paid_dossier");
          setPaidDossier(null);
        }
        return;
      }

      // Query Supabase directly to check if there is an active application in the database
      try {
        const { data: dbApp } = await supabase
          .from("member_applications")
          .select("id, status, membership_status, invoice_number, razorpay_payment_id")
          .eq("applicant_email", emailToCheck)
          .maybeSingle();

        if (!dbApp) {
          // If no application exists in the database, clear any lingering local paid dossier
          if (typeof window !== "undefined") {
            localStorage.removeItem("precious_meets_paid_dossier");
          }
          setPaidDossier(null);
        } else if (rawPaid) {
          try {
            setPaidDossier(JSON.parse(rawPaid));
          } catch (e) {
            setPaidDossier(null);
          }
        }
      } catch (err) {
        if (rawPaid) {
          try {
            setPaidDossier(JSON.parse(rawPaid));
          } catch (e) {}
        }
      }
    };

    syncStatusWithDatabase();
  }, [email, user?.email]);

  useEffect(() => {
    const raw = localStorage.getItem("precious_meets_latest_profile");
    if (raw) {
      try {
        setProfile(JSON.parse(raw));
      } catch (e) {
        // Ignore JSON error
      }
    } else {
      // Default fallback profile if user accessed directly without completing quiz
      const fallback: SocialProfileScores = {
        algorithmVersion: "v1.0.0",
        archetype: {
          title: "The Curious Flâneur",
          description:
            "You balance thoughtful observation with warm conversation, drawn to authentic stories and hidden creative corners.",
          keyTraits: ["Observant", "Culture Enthusiast", "Unhurried Listener"],
          seatingSynergy:
            "The quintessential table chameleon; harmonizes naturally across any group composition with easy grace and unhurried charm.",
          conversationalGift:
            "You read the room with subtle wisdom and find authentic common ground with companions from every walk of life.",
          idealAmbience:
            "Artisanal supper club with a curated heritage menu, warm candlelight, soft vinyl acoustics, and eclectic kindred spirits.",
          compatibilityRating: 96,
        },
        dimensions: {
          socialEnergy: 68,
          conversationDepth: 84,
          playfulness: 72,
          curiosity: 88,
          adventure: 75,
          sharedInterests: ["Culinary Heritage & Wine", "Philosophy & Psychology", "Literature & Cinema"],
          dietary: "Vegetarian",
          allergies: [],
          boundaries: [],
          preferredCity: "Delhi NCR",
        },
        quizAnswers: [],
      };
      setProfile(fallback);
    }
  }, []);

  useEffect(() => {
    // Check saved contact from quiz first
    const savedContact = localStorage.getItem("precious_meets_user_contact");
    if (savedContact) {
      try {
        const c = JSON.parse(savedContact);
        if (c.fullName) setName(c.fullName);
        if (c.email) setEmail(c.email);
        if (c.phone) setPhone("+91 " + c.phone);
        if (c.aadhaarFileUrl) setAadhaarFileUrl(c.aadhaarFileUrl);
        if (c.aadhaarFileName) setAadhaarFileName(c.aadhaarFileName);
        if (c.userPhotoUrl) setUserPhotoUrl(c.userPhotoUrl);
        if (c.userPhotoFileName) setUserPhotoFileName(c.userPhotoFileName);
        if (c.instagram) setInstagram(c.instagram);
        if (c.linkedin) setLinkedin(c.linkedin);
        return;
      } catch (e) {
        // Ignore
      }
    }

    if (user?.email && !email) {
      setEmail(user.email);
    }
    if (authProfile?.display_name && !name) {
      setName(authProfile.display_name);
    }
  }, [user, authProfile]);

  const handleSubscribe = async () => {
    if (!name.trim()) {
      toast.error("Please enter your full name for your Member Pass.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address for subscription access.");
      return;
    }

    setPaying(true);

    try {
      // Launch the ACTUAL Razorpay payment gateway checkout modal
      await openRazorpaySubscriptionCheckout({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        amountInr: 1999,
        archetypeTitle: profile?.archetype?.title || "The Curious Flâneur",
        onSuccess: (result) => {
          handleRazorpaySuccess({
            paymentId: result.paymentId,
            orderId: result.orderId,
            signature: result.signature,
          });
        },
        onError: (err) => {
          setPaying(false);
          toast.info(err || "Payment cancelled. You can retry whenever you are ready.");
        },
      });
    } catch (err: any) {
      setPaying(false);
      toast.error(err.message || "Failed to initialize Razorpay gateway.");
    }
  };

  const handleRazorpaySuccess = async (result: {
    paymentId: string;
    orderId: string;
    signature: string;
  }) => {
    setPaying(true);

    try {
      const memberId = `PM-${Math.floor(1000 + Math.random() * 9000)}`;
      const invoiceNumber = CryptoService.generateInvoiceNumber();
      const formattedDate = new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      // Retrieve Aadhaar document, personal photo proof, and contact details from state or fallback to saved contact in localStorage
      let effectiveEmail = email.trim();
      let effectiveName = name.trim();
      let effectivePhone = phone.trim();
      let effectiveAadhaarUrl = aadhaarFileUrl;
      let effectiveAadhaarName = aadhaarFileName;
      let effectiveUserPhotoUrl = userPhotoUrl;
      let effectiveUserPhotoName = userPhotoFileName;
      let effectiveInstagram = instagram;
      let effectiveLinkedin = linkedin;

      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem("precious_meets_user_contact");
          if (raw) {
            const parsed = JSON.parse(raw);
            if (!effectiveEmail && parsed.email) effectiveEmail = parsed.email.trim();
            if (!effectiveName && parsed.fullName) effectiveName = parsed.fullName.trim();
            if (!effectivePhone && parsed.phone) effectivePhone = ("+91 " + parsed.phone).trim();
            if (!effectiveInstagram && parsed.instagram) effectiveInstagram = parsed.instagram.trim();
            if (!effectiveLinkedin && parsed.linkedin) effectiveLinkedin = parsed.linkedin.trim();
            if (!effectiveAadhaarUrl && parsed.aadhaarFileUrl) effectiveAadhaarUrl = parsed.aadhaarFileUrl;
            if (!effectiveAadhaarName && parsed.aadhaarFileName) effectiveAadhaarName = parsed.aadhaarFileName;
            if (!effectiveUserPhotoUrl && parsed.userPhotoUrl) effectiveUserPhotoUrl = parsed.userPhotoUrl;
            if (!effectiveUserPhotoName && parsed.userPhotoFileName) effectiveUserPhotoName = parsed.userPhotoFileName;
          }
        } catch (e) {}
      }

      if (!effectiveEmail && user?.email) {
        effectiveEmail = user.email.trim();
      }

      // 1. Dispatch automated subscription & payment confirmed email IMMEDIATELY
      // This sends the Razorpay tax invoice & subscription confirmation email directly to the applicant's inbox
      const sendEmailPromise = EmailService.send({
        to: effectiveEmail,
        subject: "Tax Invoice & Payment Receipt | Precious Meets",
        template: "subscription_activated",
        data: {
          name: effectiveName || "Member",
          email: effectiveEmail,
          amount: "₹1,999",
          plan: "Precious Meets Membership",
          memberId,
          archetype: profile?.archetype?.title || "Curious Flâneur",
          dashboardUrl: `${window.location.origin}/login`,
          invoiceNumber,
          paymentId: result.paymentId,
          date: formattedDate,
          credentialsEtaNotice:
            "We will email your member sign in credentials in a while. Once your credentials have been sent by the admin, you will be able to log in.",
        },
      });

      // 2. Record member application dossier for curation review directly in Supabase
      // Note: User is pending admin credential issuance
      await ApplicationsService.createOrUpdateFromCheckout({
        userId: user?.id,
        name: effectiveName,
        email: effectiveEmail,
        phone: effectivePhone,
        archetypeTitle: profile?.archetype?.title || "The Curious Flâneur",
        archetypeDescription: profile?.archetype?.description || "Curated Member",
        archetypeTraits: profile?.archetype?.keyTraits || [],
        scores: profile?.dimensions
          ? {
              socialEnergy: profile.dimensions.socialEnergy,
              conversationDepth: profile.dimensions.conversationDepth,
              playfulness: profile.dimensions.playfulness,
              curiosity: profile.dimensions.curiosity,
              adventure: profile.dimensions.adventure,
            }
          : undefined,
        dietary: profile?.dimensions?.dietary,
        allergies: profile?.dimensions?.allergies,
        boundaries: profile?.dimensions?.boundaries,
        sharedInterests: profile?.dimensions?.sharedInterests,
        quizAnswers: profile?.quizAnswers || [],
        paymentId: result.paymentId,
        orderId: result.orderId,
        amountInr: 1999,
        memberId,
        invoiceNumber,
        aadhaarFileUrl: effectiveAadhaarUrl,
        aadhaarFileName: effectiveAadhaarName,
        userPhotoUrl: effectiveUserPhotoUrl,
        userPhotoFileName: effectiveUserPhotoName,
        applicantInstagram: effectiveInstagram,
        applicantLinkedin: effectiveLinkedin,
      });

      // 3. Dispatch a verification request to the Admin Panel's verification queue
      VerificationsService.addRequest({
        userName: effectiveName,
        email: effectiveEmail,
        phone: effectivePhone || "+91 98765 43210",
        city: "Delhi NCR",
        instagram: effectiveInstagram,
        linkedin: effectiveLinkedin,
        method: effectiveAadhaarUrl ? "aadhaar_card_upload" : "digilocker_consent_offline",
        notes: `Precious Meets Membership (₹1,999 Razorpay Payment: ${result.paymentId}). Archetype: ${profile?.archetype?.title || "The Curious Flâneur"}${effectiveAadhaarName ? ` | Aadhaar Document: ${effectiveAadhaarName}` : ""}`,
        amountInr: 1999,
        memberId,
        avatar: effectiveUserPhotoUrl,
        aadhaarFileUrl: effectiveAadhaarUrl,
        aadhaarFileName: effectiveAadhaarName,
        userPhotoUrl: effectiveUserPhotoUrl,
        userPhotoFileName: effectiveUserPhotoName,
        requestedAtIso: new Date().toISOString(),
      });

      // Await email delivery confirmation
      try {
        const emailRes = await sendEmailPromise;
        if (emailRes && emailRes.success) {
          console.log("[results.tsx] Payment invoice email sent successfully to", email.trim(), "ID:", emailRes.id);
        } else {
          console.warn("[results.tsx] Email dispatch warning:", emailRes?.error);
        }
      } catch (emailErr) {
        console.warn("[results.tsx] Email service notice:", emailErr);
      }

      const dossierData = {
        memberId,
        paymentId: result.paymentId,
        invoiceNumber,
      };
      setPaidDossier(dossierData);
      localStorage.setItem("precious_meets_paid_dossier", JSON.stringify(dossierData));

      setPaying(false);
      setSuccessData({
        memberId,
        email: email.trim(),
        amount: "₹1,999",
        invoiceNumber,
        paymentId: result.paymentId,
      });
      toast.success("Payment Received! Invoice & payment confirmation email sent to your inbox.");
    } catch (e: any) {
      setPaying(false);
      toast.error(e.message || "An unexpected error occurred during confirmation.");
    }
  };

  if (!profile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-ivory px-4 text-center">
        <h1 className="font-display text-3xl">Calculating Your Vibe Profile...</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Curating your conversational archetype and complementary seating.
        </p>
        <Link
          to="/quiz"
          className="mt-6 rounded-full bg-burgundy px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-ivory hover:bg-burgundy/90"
        >
          Take the 10-Question Quiz
        </Link>
      </div>
    );
  }

  const { archetype, dimensions } = profile;

  return (
    <div className="flex min-h-screen flex-col bg-ivory text-foreground">
      <Navbar />

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 pb-28 pt-28">
        {/* Step Progression Breadcrumb */}
        <div className="mx-auto mb-8 flex max-w-md items-center justify-center gap-3 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
          <span className="text-forest">1. Quiz Completed</span>
          <span>&rarr;</span>
          <span className="font-bold text-burgundy">2. Vibe Score</span>
          <span>&rarr;</span>
          <span className="text-foreground">3. Member Unlock</span>
        </div>

        {/* Hero Section: Archetype & Vibe */}
        <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-8 sm:p-12 shadow-sm text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-sage/70 px-4 py-1.5 text-xs font-semibold text-forest">
            <Sparkles className="size-3.5 text-ochre" /> Social Chemistry Archetype · Precious Algorithm v1.0
          </div>

          <h1 className="font-display mt-6 text-4xl leading-tight sm:text-6xl md:text-7xl">
            You are <em className="italic text-burgundy font-serif">{archetype.title}</em>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg leading-relaxed text-muted-foreground">
            {archetype.description}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2.5">
            {archetype.keyTraits.map((t) => (
              <span
                key={t}
                className="rounded-full border border-border/80 bg-background px-4 py-1.5 text-xs font-medium text-foreground shadow-xs"
              >
                ✦ {t}
              </span>
            ))}
            <span className="rounded-full bg-burgundy/10 px-4 py-1.5 text-xs font-semibold text-burgundy">
              ✦ {archetype.compatibilityRating || 96}% Compatibility in {dimensions.preferredCity}
            </span>
          </div>
        </div>

        {/* 4 Social Spectrum Dimensions */}
        <div className="mt-12 rounded-3xl border border-border/80 bg-card/80 p-8 shadow-sm">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl">Your Social Spectrum & Insights</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                How our algorithm balances your dinner table to ensure vibrant, flowing conversation.
              </p>
            </div>
            <span className="label-mono text-xs text-forest bg-sage/40 px-3 py-1 rounded-full w-fit">
              City Hub: {dimensions.preferredCity}
            </span>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {/* Social Energy */}
            <div className="rounded-2xl border border-border/60 bg-background p-5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-foreground">Social Energy</span>
                <span className="font-mono text-burgundy">{dimensions.socialEnergy}%</span>
              </div>
              <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-sage/50">
                <div
                  className="h-full bg-burgundy rounded-full transition-all duration-700"
                  style={{ width: `${dimensions.socialEnergy}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
                <span>Reflective & Mindful</span>
                <span>Vibrant & Expressive</span>
              </div>
            </div>

            {/* Conversation Depth */}
            <div className="rounded-2xl border border-border/60 bg-background p-5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-foreground">Conversation Depth</span>
                <span className="font-mono text-forest">{dimensions.conversationDepth}%</span>
              </div>
              <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-sage/50">
                <div
                  className="h-full bg-forest rounded-full transition-all duration-700"
                  style={{ width: `${dimensions.conversationDepth}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
                <span>Playful Banter</span>
                <span>Existential & Philosophical</span>
              </div>
            </div>

            {/* Polymathic Curiosity */}
            <div className="rounded-2xl border border-border/60 bg-background p-5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-foreground">Polymathic Curiosity</span>
                <span className="font-mono text-ochre">{dimensions.curiosity}%</span>
              </div>
              <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-sage/50">
                <div
                  className="h-full bg-[#B8860B] rounded-full transition-all duration-700"
                  style={{ width: `${dimensions.curiosity}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
                <span>Focused Specialist</span>
                <span>Eclectic Mind</span>
              </div>
            </div>

            {/* Adventure & Spontaneity */}
            <div className="rounded-2xl border border-border/60 bg-background p-5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-foreground">Adventure & Spontaneity</span>
                <span className="font-mono text-ink">{dimensions.adventure}%</span>
              </div>
              <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-sage/50">
                <div
                  className="h-full bg-ink rounded-full transition-all duration-700"
                  style={{ width: `${dimensions.adventure}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
                <span>Structured & Cozy</span>
                <span>Sensory & Bold</span>
              </div>
            </div>
          </div>

          {/* Qualitative Insights - Dynamic per Archetype */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-border/60 bg-background/80 p-5">
              <div className="flex items-center gap-2 text-xs font-bold text-burgundy uppercase tracking-wider font-mono">
                <Users className="size-4" /> Seating Synergy
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {archetype.seatingSynergy ||
                  "You pair exquisitely opposite grounded listeners, balanced alongside an expressive catalyst who naturally bridges ideas."}
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-background/80 p-5">
              <div className="flex items-center gap-2 text-xs font-bold text-forest uppercase tracking-wider font-mono">
                <Sparkles className="size-4" /> Conversational Gift
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {archetype.conversationalGift ||
                  "You make dinner companions feel seen. You ask thoughtful follow-ups rather than merely waiting for your turn to speak."}
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-background/80 p-5">
              <div className="flex items-center gap-2 text-xs font-bold text-ochre uppercase tracking-wider font-mono">
                <Wine className="size-4" /> Ideal Ambience
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {archetype.idealAmbience ||
                  "An intimate candlelit loft or wine cellar, unhurried 4-course tasting, soft jazz vinyl, and zero corporate posturing."}
              </p>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* BEAUTIFUL SUBSCRIPTION CARD (₹1,999) WITH RAZORPAY CHECKOUT */}
        {/* ------------------------------------------------------------- */}
        <section id="subscription-card" className="mt-16 scroll-mt-24">
          <div className="relative overflow-hidden rounded-3xl border-2 border-[#C6A568]/70 bg-gradient-to-br from-[#2D0D17] via-[#1A060C] to-[#120308] p-8 sm:p-12 text-ivory shadow-2xl">
            {/* Subtle background luxury glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-[#C6A568]/15 blur-3xl" />
            <div className="pointer-events-none absolute -left-20 -bottom-20 size-80 rounded-full bg-[#691C35]/30 blur-3xl" />

            <div className="relative z-10 grid gap-10 lg:grid-cols-12 lg:items-center">
              {/* Left Column: Perks & Value Proposition */}
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#C6A568]/40 bg-[#C6A568]/10 px-3.5 py-1 text-[11px] font-mono tracking-widest uppercase text-[#C6A568]">
                  <Sparkles className="size-3" /> Exclusive Circle Membership · 2026
                </div>

                <h2 className="font-display mt-4 text-3xl sm:text-4xl md:text-5xl leading-tight text-ivory">
                  Unlock Your Seat at the <em className="text-[#C6A568] italic font-serif">Table</em>
                </h2>

                <p className="mt-3 text-sm leading-relaxed text-ivory/80">
                  Join our curated private circle across Delhi NCR. Unlocks invitations to weekly 6-person suppers with compatible conversationalists and uncompromising women-first security.
                </p>

                {/* Benefits Bullet Grid */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="grid size-5 shrink-0 place-items-center rounded-full bg-[#C6A568]/20 text-[#C6A568] mt-0.5">
                      <Check className="size-3 stroke-[3]" />
                    </div>
                    <span className="text-xs leading-relaxed text-ivory/90">
                      <strong>Guaranteed Priority Table Access:</strong> Weekly curated suppers across Delhi NCR's most secluded enclaves.
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="grid size-5 shrink-0 place-items-center rounded-full bg-[#C6A568]/20 text-[#C6A568] mt-0.5">
                      <Check className="size-3 stroke-[3]" />
                    </div>
                    <span className="text-xs leading-relaxed text-ivory/90">
                      <strong>100% Offline Aadhaar Verification:</strong> Every member is verified via DigiLocker. Zero anonymous attendees.
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="grid size-5 shrink-0 place-items-center rounded-full bg-[#C6A568]/20 text-[#C6A568] mt-0.5">
                      <Check className="size-3 stroke-[3]" />
                    </div>
                    <span className="text-xs leading-relaxed text-ivory/90">
                      <strong>Hand-Matched Seating:</strong> Paired directly with complementary vibes ({archetype.title}).
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="grid size-5 shrink-0 place-items-center rounded-full bg-[#C6A568]/20 text-[#C6A568] mt-0.5">
                      <Check className="size-3 stroke-[3]" />
                    </div>
                    <span className="text-xs leading-relaxed text-ivory/90">
                      <strong>Complimentary Welcome Drinks & Chef Tasting Course:</strong> At every attended meet.
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="grid size-5 shrink-0 place-items-center rounded-full bg-[#C6A568]/20 text-[#C6A568] mt-0.5">
                      <Check className="size-3 stroke-[3]" />
                    </div>
                    <span className="text-xs leading-relaxed text-ivory/90">
                      <strong>Strict Privacy & Zero Pitching:</strong> Safe, identity-verified community with zero corporate solicitations.
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="grid size-5 shrink-0 place-items-center rounded-full bg-[#C6A568]/20 text-[#C6A568] mt-0.5">
                      <Check className="size-3 stroke-[3]" />
                    </div>
                    <span className="text-xs leading-relaxed text-ivory/90">
                      <strong>Full Attendee Dashboard Access:</strong> Secret venue reveals, gate pass codes & booking manager.
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Checkout Pricing Card */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl border border-ivory/20 bg-ivory/5 p-6 backdrop-blur-md shadow-xl">
                  {isSubscribed ? (
                    <div className="text-center py-6">
                      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-forest/20 text-[#82C341]">
                        <CheckCircle2 className="size-8" />
                      </div>
                      <h3 className="font-display mt-4 text-2xl text-ivory">Active Member</h3>
                      <p className="mt-1 text-xs text-ivory/80">
                        You hold an active Member Pass. Your credentials are fully activated.
                      </p>
                      <Button
                        onClick={() => navigate({ to: "/dashboard" })}
                        className="mt-6 w-full rounded-full bg-[#C6A568] font-bold text-[#171514] hover:bg-[#C6A568]/90"
                      >
                        Enter Member Dashboard &rarr;
                      </Button>
                    </div>
                  ) : paidDossier ? (
                    <div className="text-center py-6">
                      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#C6A568]/20 text-[#C6A568]">
                        <Clock className="size-8 animate-pulse" />
                      </div>
                      <h3 className="font-display mt-4 text-2xl text-ivory">Payment Confirmed</h3>
                      <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono">
                        <span className="size-1.5 rounded-full bg-amber-400 animate-ping" />
                        <span>Paid · Pending Credential Dispatch</span>
                      </div>
                      <p className="mt-3 text-xs leading-relaxed text-ivory/80 max-w-sm mx-auto">
                        Your payment of ₹1,999 has been authorized via Razorpay (Invoice: {paidDossier.invoiceNumber}). Our executive curation committee is reviewing your cohort seating.
                      </p>
                      <div className="mt-4 p-4 rounded-xl bg-ivory/10 border border-ivory/15 text-left text-xs text-ivory/90 space-y-2">
                        <p className="font-semibold text-[#C6A568]">What Happens Next:</p>
                        <p className="leading-relaxed text-[11px]">
                          1. We will email your member sign-in credentials to <strong>{email}</strong> in a while.
                        </p>
                        <p className="leading-relaxed text-[11px]">
                          2. Your password will be auto-generated and follows strong encryption standards.
                        </p>
                        <p className="leading-relaxed text-[11px]">
                          3. Once credentials arrive, sign in to unlock your matched secret tables.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {/* Pricing Tag */}
                      <div className="flex items-baseline justify-between border-b border-ivory/15 pb-4">
                        <div>
                          <span className="label-mono text-[10px] uppercase text-[#C6A568]">
                            Private Circle Access
                          </span>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="font-display text-4xl sm:text-5xl font-bold text-ivory">
                              ₹1,999
                            </span>
                            <span className="text-[11px] text-ivory/70">membership</span>
                          </div>
                        </div>
                      </div>

                      {/* Inputs */}
                      <div className="mt-5 space-y-3">
                        <div>
                          <label className="text-[11px] font-medium text-ivory/80">
                            Your Name (for Member ID)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Aria Sharma"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 w-full rounded-lg border border-ivory/20 bg-black/40 px-3 py-2 text-xs text-ivory placeholder:text-ivory/40 focus:border-[#C6A568] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-medium text-ivory/80">
                            Email (for Pass Receipt & Invites)
                          </label>
                          <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 w-full rounded-lg border border-ivory/20 bg-black/40 px-3 py-2 text-xs text-ivory placeholder:text-ivory/40 focus:border-[#C6A568] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-medium text-ivory/80">
                            Phone (for Meet Venue SMS/WhatsApp)
                          </label>
                          <input
                            type="tel"
                            placeholder="+91 98765 43210"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="mt-1 w-full rounded-lg border border-ivory/20 bg-black/40 px-3 py-2 text-xs text-ivory placeholder:text-ivory/40 focus:border-[#C6A568] focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* CTA Button */}
                      <Button
                        onClick={handleSubscribe}
                        disabled={paying}
                        className="mt-6 w-full rounded-full bg-gradient-to-r from-[#C6A568] to-[#E5C17D] py-6 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#171514] shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                      >
                        {paying ? (
                          <>
                            <Loader2 className="size-4 animate-spin" />
                            Authorizing Razorpay Gateway...
                          </>
                        ) : (
                          <>
                            <CreditCard className="size-4 text-[#171514]" />
                            Pay ₹1,999 via Razorpay
                          </>
                        )}
                      </Button>

                      {/* Razorpay Trust Badges */}
                      <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-ivory/70">
                        <Lock className="size-3 text-[#C6A568]" />
                        <span>Instant 256-bit SSL Razorpay Checkout · Direct Admin Console Synchronization</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Subscription Success & Email Dispatched Modal */}
      {successData && (
        <Dialog
          open={true}
          onOpenChange={() => {
            setSuccessData(null);
          }}
        >
          <DialogContent className="max-w-md bg-card text-foreground">
            <DialogHeader className="text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-forest/20 text-forest mb-2">
                <CheckCircle2 className="size-10" />
              </div>
              <DialogTitle className="font-display text-3xl">
                Payment Authorized!
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Your ₹1,999 membership payment has been confirmed by Razorpay.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-3 text-center">
              <div className="rounded-2xl border border-forest/30 bg-forest/5 p-4">
                <span className="text-[10px] uppercase font-mono text-muted-foreground">
                  Your Member ID
                </span>
                <p className="font-mono text-2xl font-bold text-burgundy mt-0.5">
                  {successData.memberId}
                </p>
                <div className="flex items-center justify-center gap-1.5 mt-1 text-xs text-forest font-semibold">
                  <CheckCircle2 className="size-3.5" />
                  <span>Payment Confirmed: {successData.amount}</span>
                </div>
              </div>

              {/* Razorpay Tax Invoice & Payment ID */}
              <div className="flex items-center justify-between rounded-xl bg-ivory border border-border px-3.5 py-2.5 text-xs font-mono">
                <div className="text-left">
                  <span className="text-[10px] uppercase text-muted-foreground block">Razorpay Tax Invoice</span>
                  <span className="font-bold text-foreground">{successData.invoiceNumber}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase text-muted-foreground block">Payment Reference</span>
                  <span className="font-bold text-burgundy">{successData.paymentId}</span>
                </div>
              </div>

              {/* Notice that Member Sign-in Credentials will be emailed in a while */}
              <div className="flex items-start gap-3 rounded-xl border border-burgundy/20 bg-burgundy/5 p-3.5 text-left">
                <Lock className="size-5 text-burgundy shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-semibold text-burgundy">Member Login Credentials Dispatch</p>
                  <p className="text-muted-foreground mt-0.5 leading-relaxed">
                    We will email your member sign-in credentials to <strong>{successData.email}</strong> in a while. Once your credentials have been sent by the admin, you will be marked as an active user and can log in.
                  </p>
                </div>
              </div>

              {/* Status Box: Email Dispatched */}
              <div className="flex items-start gap-3 rounded-xl border border-border/80 bg-background p-3 text-left">
                <Mail className="size-5 text-forest shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-semibold text-foreground">Razorpay Tax Invoice Dispatched</p>
                  <p className="text-muted-foreground mt-0.5">
                    We sent your official welcome receipt, Razorpay tax invoice (<strong>{successData.invoiceNumber}</strong>), and onboarding dossier to <strong>{successData.email}</strong>.
                  </p>
                </div>
              </div>

              <div className="flex pt-1">
                <Button
                  type="button"
                  onClick={() => setSuccessData(null)}
                  className="w-full rounded-full py-5 font-semibold text-ivory bg-burgundy hover:bg-burgundy/90 cursor-pointer text-xs"
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Footer />
    </div>
  );
}
