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
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate({ to: "/dashboard" });
      } else {
        navigate({ to: "/login" });
      }
    });
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ivory text-foreground">
      <Loader2 className="size-8 animate-spin text-burgundy" />
      <p className="font-display mt-4 text-xl">Connecting to your table...</p>
      <p className="mt-1 text-xs text-muted-foreground">Verifying Google authentication session.</p>
    </div>
  );
}
