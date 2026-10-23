import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  ShieldCheck,
  ArrowRight,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Sparkles,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type LoginSearch = {
  redirect?: string;
  mode?: "signin" | "signup";
};

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => {
    return {
      redirect: typeof search["redirect"] === "string" ? (search["redirect"] as string) : undefined,
      mode: search["mode"] === "signup" ? "signup" : "signin",
    };
  },
  head: () => ({
    meta: [
      { title: "Sign In & Membership — Precious Meets" },
      {
        name: "description",
        content: "Sign in with Google or your credentials to access your bookings and matched tables.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const { user, signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();

  const [mode, setMode] = useState<"signin" | "signup">(
    search.mode === "signup" ? "signup" : "signin",
  );
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);

  const destination = search.redirect || (email.toLowerCase().includes("admin") ? "/admin" : "/dashboard");

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const { error } = await signInWithGoogle(search.redirect || "/dashboard");
      if (error) {
        setErrorMessage(error.message || "Failed to initiate Google authentication. Please try again.");
        toast.error("Google sign in failed", { description: error.message });
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "An unexpected error occurred during Google sign-in.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setErrorMessage("Please provide a valid email address.");
      return;
    }

    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "signin") {
        const { error } = await signInWithEmail(cleanEmail, password);
        if (error) {
          setErrorMessage(error.message || "Invalid credentials. Please verify your email and password.");
          toast.error("Sign in failed", { description: error.message });
          setLoading(false);
          return;
        }

        toast.success(
          cleanEmail === "admin@preciousmeets.com"
            ? "Welcome back, Administrator."
            : "Successfully signed in.",
        );

        const targetRoute = cleanEmail === "admin@preciousmeets.com" ? (search.redirect || "/admin") : (search.redirect || "/dashboard");
        navigate({ to: targetRoute as any });
      } else {
        // Sign Up Mode
        if (!fullName.trim()) {
          setErrorMessage("Please provide your full name.");
          setLoading(false);
          return;
        }

        if (password.length < 6) {
          setErrorMessage("Password must be at least 6 characters long.");
          setLoading(false);
          return;
        }

        if (password !== confirmPassword) {
          setErrorMessage("Passwords do not match.");
          setLoading(false);
          return;
        }

        if (!agreeTerms) {
          setErrorMessage("Please agree to our Community Code & Standards to proceed.");
          setLoading(false);
          return;
        }

        const { error } = await signUpWithEmail(cleanEmail, password, fullName);
        if (error) {
          setErrorMessage(error.message || "Could not register account. Please try again.");
          toast.error("Sign up failed", { description: error.message });
          setLoading(false);
          return;
        }

        toast.success("Account created successfully! Welcome to Precious Meets.");
        navigate({ to: (search.redirect || "/dashboard") as any });
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  const isAdminCandidate = email.trim().toLowerCase() === "admin@preciousmeets.com";

  return (
    <div className="flex min-h-screen w-full bg-ivory text-foreground selection:bg-burgundy/20">
      {/* ========================================================================= */}
      {/* LEFT COLUMN: Editorial Visual Canvas (Atmospheric Supper Club Image)       */}
      {/* ========================================================================= */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-ink p-12 text-ivory lg:flex">
        {/* Background Image with Cinematic Dark/Warm Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105 hover:scale-100"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=85')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-ochre/15 via-transparent to-black/60" />

        {/* Top Branding */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-display text-3xl font-normal tracking-tight text-ivory">
              Precious<em className="text-ochre not-italic">meets</em>
            </span>
          </Link>
          <div className="flex items-center gap-2 rounded-full border border-ivory/20 bg-ivory/10 px-3.5 py-1 backdrop-blur-md">
            <span className="size-1.5 rounded-full bg-ochre animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-ivory/90">
              Private Dining Circle
            </span>
          </div>
        </div>

        {/* Bottom Atmospheric Content & Quote */}
        <div className="relative z-10 max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-burgundy/80 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-ivory backdrop-blur-sm">
            <Sparkles className="size-3.5 text-ochre" />
            <span>Curated Strangers · Shared Tables</span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl leading-[1.15] text-ivory">
            Where thoughtful minds sit down as strangers and leave as{" "}
            <em className="italic text-ochre font-normal">intimate company</em>.
          </h2>

          <p className="text-sm leading-relaxed text-ivory/80">
            Intimate 6-seat supper clubs, single-origin tastings, and cultural salons across Delhi NCR.
            Every guest identity-verified. Every table thoughtfully matched.
          </p>

          {/* Social Proof Pills */}
          <div className="flex flex-wrap gap-2 pt-2">
            {[
              "Intimate 6-Seat Tables",
              "100% ID Verified",
              "Zero Commercial Small Talk",
              "Delhi NCR",
            ].map((feature, i) => (
              <span
                key={i}
                className="rounded-full border border-ivory/20 bg-black/30 px-3 py-1 font-mono text-[10px] text-ivory/90 backdrop-blur-xs"
              >
                {feature}
              </span>
            ))}
          </div>

          <div className="border-t border-ivory/15 pt-4 text-[11px] text-ivory/60 flex items-center gap-2">
            <ShieldCheck className="size-4 text-ochre" />
            <span>Strict privacy protected by UIDAI-compliant verification standards.</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT COLUMN: Interactive Luxury Auth Card (Google OAuth + Form)           */}
      {/* ========================================================================= */}
      <div className="flex w-full flex-col justify-between px-6 py-10 sm:px-12 lg:w-1/2 lg:px-16 xl:px-20 overflow-y-auto">
        {/* Mobile Top Bar */}
        <div className="flex items-center justify-between pb-6 lg:pb-0">
          <Link to="/" className="font-display text-2xl tracking-tight text-foreground lg:hidden">
            Precious<em className="text-burgundy not-italic">meets</em>
          </Link>
          <Link
            to="/"
            className="text-xs font-semibold text-muted-foreground hover:text-burgundy transition-colors ml-auto"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Center Auth Container */}
        <div className="mx-auto my-auto w-full max-w-md py-6">
          {/* Header & Tabs */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="label-mono text-xs text-forest font-semibold">
                {mode === "signin" ? "Member Authentication" : "New Attendee Onboarding"}
              </span>
              {isAdminCandidate && (
                <span className="rounded-full bg-burgundy/15 px-2.5 py-0.5 font-mono text-[10px] font-bold text-burgundy">
                  Admin Terminal
                </span>
              )}
            </div>

            <h1 className="font-display text-3xl sm:text-4xl">
              {mode === "signin" ? (
                <>
                  Welcome to <em className="italic text-burgundy">the Circle</em>
                </>
              ) : (
                <>
                  Apply for <em className="italic text-burgundy">Membership</em>
                </>
              )}
            </h1>

            <p className="text-xs leading-relaxed text-muted-foreground">
              {mode === "signin"
                ? "Sign in with Google or your credentials to access your bookings, table assignments, and compatibility archetype."
                : "Join an unhurried community of curious guests, thinkers, and conversationalists across Delhi NCR."}
            </p>

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 rounded-2xl bg-card border border-border/80 p-1">
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setErrorMessage(null);
                }}
                className={`rounded-xl py-2 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  mode === "signin"
                    ? "bg-burgundy text-ivory shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setErrorMessage(null);
                }}
                className={`rounded-xl py-2 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  mode === "signup"
                    ? "bg-burgundy text-ivory shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Google OAuth Button */}
          <div className="mt-6">
            <Button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="group flex w-full items-center justify-center gap-3 rounded-2xl border border-border/90 bg-card py-5 text-xs font-semibold text-foreground shadow-xs transition-all hover:bg-sage/40 hover:border-burgundy/30 cursor-pointer active:scale-98"
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin text-burgundy" />
              ) : (
                <svg className="size-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>Continue with Google</span>
            </Button>
          </div>

          {/* Elegant Divider */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="w-full border-t border-border/80" />
            <span className="relative bg-ivory px-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              or continue with email
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Aria Sharma"
                    className="w-full rounded-2xl border border-border/80 bg-card py-3 pl-10 pr-4 text-xs font-medium text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-burgundy focus:ring-1 focus:ring-burgundy"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com or admin@preciousmeets.com"
                  className="w-full rounded-2xl border border-border/80 bg-card py-3 pl-10 pr-4 text-xs font-medium text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-burgundy focus:ring-1 focus:ring-burgundy"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  Password
                </label>
                {mode === "signin" && (
                  <button
                    type="button"
                    onClick={() => toast.info("Password reset instructions will be sent to your email.")}
                    className="text-[11px] text-burgundy hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isAdminCandidate ? "Enter admin password (11111111)" : "••••••••"}
                  className="w-full rounded-2xl border border-border/80 bg-card py-3 pl-10 pr-10 text-xs font-medium text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-burgundy focus:ring-1 focus:ring-burgundy font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {mode === "signup" && (
              <div>
                <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  Confirm Password
                </label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-border/80 bg-card py-3 pl-10 pr-4 text-xs font-medium text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-burgundy focus:ring-1 focus:ring-burgundy font-mono"
                  />
                </div>
              </div>
            )}

            {mode === "signup" && (
              <label className="flex items-start gap-2 pt-1 text-[11px] text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded border-border text-burgundy focus:ring-burgundy"
                />
                <span>
                  I agree to the{" "}
                  <Link to="/terms" className="text-burgundy hover:underline">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link to="/safety" className="text-burgundy hover:underline">
                    Community Safety Code
                  </Link>
                  .
                </span>
              </label>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-burgundy py-5 text-xs font-semibold uppercase tracking-wider text-ivory shadow-md transition-all hover:bg-burgundy/90 active:scale-98 cursor-pointer mt-2"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin text-ivory" />
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>
                    {mode === "signin"
                      ? isAdminCandidate
                        ? "Unlock Executive Console"
                        : "Sign In to Circle"
                      : "Create Member Account"}
                  </span>
                  <ArrowRight className="size-3.5" />
                </div>
              )}
            </Button>
          </form>

          {/* Quick Admin Helper Link */}
          <div className="mt-6 border-t border-border/70 pt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setEmail("admin@preciousmeets.com");
                setPassword("11111111");
                toast.info("Admin credentials autofilled for operational review.");
              }}
              className="text-[11px] text-muted-foreground hover:text-burgundy transition-colors cursor-pointer"
            >
              Executive Admin? <span className="underline font-medium">Use credentials for admin@preciousmeets.com</span>
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
            <ShieldCheck className="size-3.5 text-forest" />
            <span>Strict data sovereignty. We never sell your personal information.</span>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-6 text-center text-[10px] text-muted-foreground">
          © {new Date().getFullYear()} Precious Meets. All rights reserved.
        </div>
      </div>
    </div>
  );
}
