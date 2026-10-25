import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { type SocialProfileScores } from "@/lib/scoring-engine";
import { useAuth } from "@/lib/auth-context";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { EmailService } from "@/lib/email-service";
import { ApplicationsService } from "@/lib/applications-service";
import { VerificationsService } from "@/lib/verifications-service";
import { openRazorpaySubscriptionCheckout } from "@/lib/razorpay-client";
import { CryptoService } from "@/lib/crypto-service";
import { RazorpaySubscriptionModal, type RazorpayPaymentResult } from "@/components/RazorpaySubscriptionModal";
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
      { title: "Your Vibe Profile & Founding Membership — Precious Meets" },
      {
        name: "description",
        content: "Discover your conversational archetype, social insights, and unlock founding member table access.",
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
  const [phone, setPhone] = useState(authProfile?.phone || "+91 ");
  const [paying, setPaying] = useState(false);
  const [razorpayModalOpen, setRazorpayModalOpen] = useState(false);

  // Success Dialog State
  const [successData, setSuccessData] = useState<{
    memberId: string;
    email: string;
    amount: string;
    invoiceNumber: string;
    paymentId: string;
  } | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("precious_meets_latest_profile");
    if (raw) {
      try {
        setProfile(JSON.parse(raw));
      } catch (e) {
        // Ignore JSON error
      }
    } else {
      // Default fallback profile if user accessed directly
      const fallback: SocialProfileScores = {
        algorithmVersion: "v1.0.0",
        archetype: {
          title: "The Curious Flâneur",
          description:
            "You balance thoughtful observation with warm conversation, drawn to authentic stories and hidden creative corners.",
          keyTraits: ["Observant", "Culture Enthusiast", "Unhurried Listener"],
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

  const handleSubscribe = () => {
    if (!name.trim()) {
      toast.error("Please enter your full name for your Member Pass.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address for subscription access.");
      return;
    }
    // Launch interactive Razorpay popup modal
    setRazorpayModalOpen(true);
  };

  const handleRazorpaySuccess = async (result: RazorpayPaymentResult) => {
    setPaying(true);

    try {
      const memberId = `PM-FOUNDER-${Math.floor(1000 + Math.random() * 9000)}`;
      const invoiceNumber = CryptoService.generateInvoiceNumber();

      // 1. Activate membership in app state & localStorage
      activateSubscription({
        name: name.trim(),
        email: email.trim(),
        paymentId: result.paymentId,
        memberId,
      });

      // 2. Dispatch a verification request to the Admin Panel's verification queue!
      VerificationsService.addRequest({
        userName: name.trim(),
        email: email.trim(),
        phone: phone.trim() || "+91 98765 43210",
        city: "Delhi NCR",
        method: "digilocker_consent_offline",
        notes: `Annual Founding Member Pass (₹1,999 Razorpay Payment: ${result.paymentId}). Archetype: ${profile?.archetype?.title || "The Curious Flâneur"}`,
        amountInr: 1999,
        memberId,
      });

      // 3. Record full member application dossier for executive review in ApplicationsService
      ApplicationsService.createOrUpdateFromCheckout({
        userId: user?.id,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        archetypeTitle: profile?.archetype?.title || "The Curious Flâneur",
        archetypeDescription: profile?.archetype?.description || "Curated Member",
        scores: profile?.dimensions,
        dietary: profile?.dimensions?.dietary,
        allergies: profile?.dimensions?.allergies,
        boundaries: profile?.dimensions?.boundaries,
        sharedInterests: profile?.dimensions?.sharedInterests,
        paymentId: result.paymentId,
        amountInr: 1999,
        memberId,
        invoiceNumber,
      });

      // 4. Dispatch automated subscription confirmation email with Razorpay invoice & credentials notice
      try {
        await EmailService.send({
          to: email.trim(),
          subject: "Thanks for Subscribing to Precious Meets — Invoice & Member Access ✨",
          template: "subscription_activated",
          data: {
            name: name.trim(),
            email: email.trim(),
            amount: "₹1,999",
            plan: "Annual Founding Member Pass",
            memberId,
            archetype: profile?.archetype?.title || "Curious Flâneur",
            dashboardUrl: `${window.location.origin}/dashboard`,
            invoiceNumber,
            paymentId: result.paymentId,
            credentialsEtaNotice:
              "We are reviewing your conversational vibe profile and will email your member sign-in credentials to this email address in a short while.",
          },
        });
      } catch (emailErr) {
        console.warn("Email service notice:", emailErr);
      }

      setPaying(false);
      setSuccessData({
        memberId,
        email: email.trim(),
        amount: "₹1,999",
        invoiceNumber,
        paymentId: result.paymentId,
      });
      toast.success("Payment Successful! Razorpay invoice and subscription confirmation dispatched.");
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
              ✦ 98% Compatibility in {dimensions.preferredCity}
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

          {/* Qualitative Insights */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-border/60 bg-background/80 p-5">
              <div className="flex items-center gap-2 text-xs font-bold text-burgundy uppercase tracking-wider font-mono">
                <Users className="size-4" /> Seating Synergy
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                You pair exquisitely opposite grounded listeners, balanced alongside an expressive catalyst who naturally bridges ideas.
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-background/80 p-5">
              <div className="flex items-center gap-2 text-xs font-bold text-forest uppercase tracking-wider font-mono">
                <Sparkles className="size-4" /> Conversational Gift
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                You make dinner companions feel seen. You ask thoughtful follow-ups rather than merely waiting for your turn to speak.
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-background/80 p-5">
              <div className="flex items-center gap-2 text-xs font-bold text-ochre uppercase tracking-wider font-mono">
                <Wine className="size-4" /> Ideal Ambience
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                An intimate candlelit loft or wine cellar, unhurried 4-course tasting, soft jazz vinyl, and zero corporate posturing.
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
                  <Sparkles className="size-3" /> Exclusive Founding Membership · 2026 Pass
                </div>

                <h2 className="font-display mt-4 text-3xl sm:text-4xl md:text-5xl leading-tight text-ivory">
                  Unlock Your Seat at the <em className="text-[#C6A568] italic font-serif">Table</em>
                </h2>

                <p className="mt-3 text-sm leading-relaxed text-ivory/80">
                  Join our curated private circle across Delhi NCR. One annual pass unlocks unlimited invites to weekly 6-person suppers with compatible conversationalists and uncompromising women-first security.
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
                        You hold an active Founding Member Pass (ID: {subscription?.memberId || "PM-FOUNDER"}).
                      </p>
                      <Button
                        onClick={() => navigate({ to: "/dashboard" })}
                        className="mt-6 w-full rounded-full bg-[#C6A568] font-bold text-[#171514] hover:bg-[#C6A568]/90"
                      >
                        Enter Member Dashboard &rarr;
                      </Button>
                    </div>
                  ) : (
                    <div>
                      {/* Pricing Tag */}
                      <div className="flex items-baseline justify-between border-b border-ivory/15 pb-4">
                        <div>
                          <span className="label-mono text-[10px] uppercase text-[#C6A568]">
                            Annual Founding Pass
                          </span>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="font-display text-4xl sm:text-5xl font-bold text-ivory">
                              ₹1,999
                            </span>
                            <span className="text-xs line-through text-ivory/50">₹4,999</span>
                            <span className="text-[11px] text-ivory/70">/ year</span>
                          </div>
                        </div>
                        <span className="rounded-full bg-[#C6A568]/20 px-2.5 py-1 text-[10px] font-bold text-[#C6A568]">
                          60% OFF
                        </span>
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

      {/* Razorpay Interactive Checkout Popup Modal */}
      <RazorpaySubscriptionModal
        open={razorpayModalOpen}
        onOpenChange={setRazorpayModalOpen}
        userName={name}
        userEmail={email}
        userPhone={phone}
        amountInr={1999}
        planTitle="Annual Founding Member Pass"
        onSuccess={handleRazorpaySuccess}
        onError={(err) => toast.error(err)}
      />

      {/* Subscription Success & Email Dispatched Modal */}
      {successData && (
        <Dialog open={true} onOpenChange={() => navigate({ to: "/dashboard" })}>
          <DialogContent className="max-w-md bg-card text-foreground">
            <DialogHeader className="text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-forest/20 text-forest mb-2">
                <CheckCircle2 className="size-10" />
              </div>
              <DialogTitle className="font-display text-3xl">
                Payment Successful!
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Your ₹1,999 Founding Membership payment has been confirmed by Razorpay.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-3 text-center">
              <div className="rounded-2xl border border-forest/30 bg-forest/5 p-4">
                <span className="text-[10px] uppercase font-mono text-muted-foreground">
                  Your Founding Member ID
                </span>
                <p className="font-mono text-2xl font-bold text-burgundy mt-0.5">
                  {successData.memberId}
                </p>
                <div className="flex items-center justify-center gap-1.5 mt-1 text-xs text-forest font-semibold">
                  <CheckCircle2 className="size-3.5" />
                  <span>Payment Confirmed: {successData.amount} (Annual Pass)</span>
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
                    We will email your member sign in credentials to <strong>{successData.email}</strong> in a while. Our curation team is verifying your profile and table match.
                  </p>
                </div>
              </div>

              {/* Status Box: Resend Email Dispatched */}
              <div className="flex items-start gap-3 rounded-xl border border-border/80 bg-background p-3 text-left">
                <Mail className="size-5 text-forest shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-semibold text-foreground">Razorpay Tax Invoice Dispatched</p>
                  <p className="text-muted-foreground mt-0.5">
                    We sent your official welcome receipt, Razorpay tax invoice (<strong>{successData.invoiceNumber}</strong>), and onboarding dossier to <strong>{successData.email}</strong> via Resend.
                  </p>
                </div>
              </div>

              <Button
                onClick={() => navigate({ to: "/dashboard" })}
                className="w-full rounded-full bg-burgundy py-5 font-semibold text-ivory hover:bg-burgundy/90 cursor-pointer"
              >
                Enter Member Dashboard &rarr;
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Footer />
    </div>
  );
}
