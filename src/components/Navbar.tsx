import { Link, useRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ShieldCheck, User, Calendar, LogOut, ShieldAlert, Sparkles } from "lucide-react";

export function Navbar() {
  const { user, profile, isAdmin, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <nav className="flex w-full max-w-4xl items-center justify-between rounded-full border border-border/80 bg-ivory/90 py-2 pl-6 pr-2 shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-6">
          <Link to="/" className="font-display text-2xl tracking-tight text-foreground">
            Precious<em className="text-burgundy not-italic font-normal">meets</em>
          </Link>
          <div className="hidden items-center gap-5 md:flex">
            <Link
              to="/experiences"
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-burgundy"
            >
              Meets
            </Link>
            <Link
              to="/how-it-works"
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-burgundy"
            >
              How It Works
            </Link>
            <Link
              to="/safety"
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-burgundy"
            >
              Safety
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/quiz"
            className="hidden items-center gap-1.5 rounded-full bg-burgundy px-4 py-2 text-xs font-semibold uppercase tracking-wider text-ivory transition-transform hover:scale-105 sm:inline-flex"
          >
            <Sparkles className="size-3.5" />
            Take the Quiz
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-full ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <Avatar className="size-9 border border-border">
                  <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.display_name || "User"} />
                  <AvatarFallback className="bg-sage text-xs font-semibold text-forest">
                    {profile?.display_name?.slice(0, 2).toUpperCase() || "ME"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-card text-card-foreground shadow-lg">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{profile?.display_name || "Attendee"}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    {profile?.identity_verified && (
                      <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-medium text-forest">
                        <ShieldCheck className="size-3 text-forest" /> ID Verified
                      </span>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="flex items-center gap-2 cursor-pointer">
                    <User className="size-4" /> Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/bookings" className="flex items-center gap-2 cursor-pointer">
                    <Calendar className="size-4" /> My Meets
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/safety" className="flex items-center gap-2 cursor-pointer">
                    <ShieldAlert className="size-4" /> Safety & SOS
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center gap-2 text-burgundy cursor-pointer font-medium">
                        <ShieldCheck className="size-4" /> Admin Console
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="flex items-center gap-2 text-destructive cursor-pointer">
                  <LogOut className="size-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              to="/login"
              className="rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold uppercase tracking-wider text-foreground transition-colors hover:bg-sage/40"
            >
              Sign In
            </Link>
          )}

          {/* Mobile hamburger menu */}
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
            className="grid size-9 place-items-center rounded-full bg-ink text-ivory md:hidden"
          >
            <span className={`block h-0.5 w-4 bg-ivory transition-transform duration-300 ${open ? "rotate-45 translate-y-1" : "-translate-y-0.5"}`} />
            <span className={`block h-0.5 w-4 bg-ivory transition-transform duration-300 ${open ? "-rotate-45 -translate-y-0.5" : "translate-y-0.5"}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 flex flex-col justify-center bg-burgundy/95 px-8 text-ivory backdrop-blur-md md:hidden"
        >
          <div className="flex flex-col gap-6 font-display text-4xl">
            <Link to="/" onClick={() => setOpen(false)} className="hover:text-ochre">Home</Link>
            <Link to="/experiences" onClick={() => setOpen(false)} className="hover:text-ochre">Curated Meets</Link>
            <Link to="/quiz" onClick={() => setOpen(false)} className="hover:text-ochre">Discovery Quiz</Link>
            <Link to="/how-it-works" onClick={() => setOpen(false)} className="hover:text-ochre">How It Works</Link>
            <Link to="/safety" onClick={() => setOpen(false)} className="hover:text-ochre">Safety & SOS</Link>
            {user ? (
              <Link to="/dashboard" onClick={() => setOpen(false)} className="hover:text-ochre">My Dashboard</Link>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)} className="hover:text-ochre">Sign In</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
