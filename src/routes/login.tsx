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
};

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => {
    return {
      redirect: typeof search["redirect"] === "string" ? (search["redirect"] as string) : undefined,
      mode: typeof search["mode"] === "string" ? (search["mode"] as string) : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Sign In — Precious Meets" },
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
  const { signInWithGoogle, signInWithEmail } = useAuth();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

  const isAdminCandidate = email.trim().toLowerCase() === "admin@preciousmeets.com";

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
              Sign in with Google or your credentials to access your bookings, table assignments, and compatibility archetype.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mt-3.5 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Google OAuth Button */}
          <div className="mt-5">
            <Button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="group flex w-full items-center justify-center gap-3 rounded-xl border border-border/90 bg-card py-4 text-sm font-semibold text-foreground shadow-xs transition-all hover:bg-sage/40 hover:border-burgundy/30 cursor-pointer active:scale-98 h-12"
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin text-burgundy" />
              ) : (
                <svg className="size-4.5 shrink-0" viewBox="0 0 24 24">
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
          <div className="relative my-4 flex items-center justify-center">
            <div className="w-full border-t border-border/80" />
            <span className="relative bg-ivory px-3 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              or continue with email
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
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
                  placeholder="you@domain.com or admin@preciousmeets.com"
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
                  placeholder={isAdminCandidate ? "Enter admin password (11111111)" : "••••••••"}
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
                  <span>
                    {isAdminCandidate ? "Unlock Executive Console" : "Sign In to Circle"}
                  </span>
                  <ArrowRight className="size-4" />
                </div>
              )}
            </Button>
          </form>


        </div>

        {/* Footer info */}
        <div className="pt-2 text-center text-[10px] text-muted-foreground shrink-0">
          © {new Date().getFullYear()} Precious Meets. All rights reserved.
        </div>
      </div>
    </div>
  );
}
