import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type LoginSearch = {
  redirect?: string | undefined;
  mode?: string | undefined;
  email?: string | undefined;
};

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => {
    return {
      redirect: typeof search["redirect"] === "string" ? (search["redirect"] as string) : undefined,
      mode: typeof search["mode"] === "string" ? (search["mode"] as string) : undefined,
      email: typeof search["email"] === "string" ? (search["email"] as string) : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Sign In — Precious Meets" },
      {
        name: "description",
        content: "Sign in with your credentials to access your bookings and matched tables.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const { signInWithEmail } = useAuth();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [email, setEmail] = useState(search.email || "");
  const [password, setPassword] = useState("");

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

      const targetRoute = cleanEmail === "admin@preciousmeets.com"
        ? (search.redirect || "/admin")
        : (search.redirect || "/dashboard");
      navigate({ to: targetRoute as any });
    } catch (err: any) {
      setErrorMessage(err?.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-ivory text-foreground selection:bg-burgundy/20">
      {/* ========================================================================= */}
      {/* LEFT COLUMN: Editorial Visual Canvas (Atmospheric Supper Club Image)       */}
      {/* ========================================================================= */}
      <div className="relative hidden h-full w-1/2 flex-col justify-between overflow-hidden bg-ink p-8 lg:p-10 xl:p-12 text-ivory lg:flex">
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
            <span className="font-display text-3xl xl:text-4xl font-normal tracking-tight text-ivory">
              Precious<em className="text-ochre not-italic">meets</em>
            </span>
          </Link>
        </div>

        {/* Bottom Atmospheric Content & Quote */}
        <div className="relative z-10 max-w-lg space-y-4 xl:space-y-5">

          <h2 className="font-display text-3xl xl:text-4xl leading-[1.18] text-ivory">
            Where thoughtful minds sit down as strangers and leave as{" "}
            <em className="italic text-ochre font-normal">intimate company</em>.
          </h2>

          <p className="text-xs xl:text-sm leading-relaxed text-ivory/80">
            Intimate 6-seat supper clubs, single-origin tastings, and cultural salons across Delhi NCR.
            Every guest identity-verified. Every table thoughtfully matched.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT COLUMN: Interactive Luxury Auth Card (Non-scrollable, Sign In Only) */}
      {/* ========================================================================= */}
      <div className="flex h-full w-full flex-col justify-between px-6 py-6 sm:px-10 lg:w-1/2 lg:px-12 xl:px-16 overflow-y-auto lg:overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between shrink-0">
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
        <div className="mx-auto my-auto w-full max-w-md py-4">
          {/* Header */}
          <div className="space-y-2">

            <h1 className="font-display text-3xl sm:text-4xl leading-tight">
              Welcome to <em className="italic text-burgundy">the Circle</em>
            </h1>

            <p className="text-sm sm:text-[15px] leading-relaxed text-muted-foreground">
              Sign in with your email and password to access your bookings, table assignments, and compatibility archetype.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mt-3.5 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-3.5">
            <div>
              <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-muted-foreground font-medium">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@gmail.com"
                  className="w-full rounded-xl border border-border/80 bg-card py-3 pl-10 pr-4 text-sm font-medium text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-burgundy focus:ring-1 focus:ring-burgundy"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => toast.info("Password reset instructions will be sent to your email.")}
                  className="text-xs text-burgundy hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-border/80 bg-card py-3 pl-10 pr-10 text-sm font-medium text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-burgundy focus:ring-1 focus:ring-burgundy font-mono"
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

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-burgundy py-3.5 h-12 text-sm font-semibold uppercase tracking-wider text-ivory shadow-md transition-all hover:bg-burgundy/90 active:scale-98 cursor-pointer mt-1.5"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin text-ivory" />
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Sign In to Circle</span>
                  <ArrowRight className="size-4" />
                </div>
              )}
            </Button>
          </form>

          {/* New Member Registration / Discovery Quiz Gate */}
          <div className="mt-6 rounded-2xl border border-ochre/30 bg-ochre/5 p-4 text-center sm:text-left sm:flex sm:items-center sm:justify-between sm:gap-4">
            <div className="space-y-1">
              <span className="inline-block rounded-full bg-ochre/20 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-ochre">
                New to Precious Meets?
              </span>
              <h4 className="font-display text-base font-medium text-foreground">
                Apply for Curated Membership
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Direct registration is closed. New members join by completing our 3-minute conversational quiz to find matched salons.
              </p>
            </div>
            <Link
              to="/quiz"
              className="mt-3 inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-burgundy px-4 py-2.5 text-xs font-semibold text-ivory transition-all hover:bg-burgundy/90 sm:mt-0"
            >
              <span>Take Quiz</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-2 text-center text-[10px] text-muted-foreground shrink-0">
          © {new Date().getFullYear()} Precious Meets. All rights reserved.
        </div>
      </div>
    </div>
  );
}
