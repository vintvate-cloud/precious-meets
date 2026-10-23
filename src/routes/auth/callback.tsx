import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    let resolved = false;

    const handleSession = (session: any) => {
      if (resolved) return;
      if (session?.user) {
        resolved = true;
        const target =
          session.user.email?.toLowerCase() === "admin@preciousmeets.com"
            ? "/admin"
            : "/dashboard";
        navigate({ to: target as any });
      }
    };

    // 1. Check existing session immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        handleSession(session);
      }
    });

    // 2. Listen to auth state transition (PKCE exchange)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        handleSession(session);
      }
    });

    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        navigate({ to: "/login" as any });
      }
    }, 4000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ivory text-foreground px-6 text-center">
      <div className="size-10 flex items-center justify-center rounded-full bg-burgundy/10 text-burgundy mb-4">
        <Loader2 className="size-6 animate-spin" />
      </div>
      <p className="font-display text-2xl">Connecting to your table...</p>
      <p className="mt-2 text-xs text-muted-foreground max-w-sm">
        Verifying authenticated Google session and retrieving your private circle reservations.
      </p>
    </div>
  );
}
