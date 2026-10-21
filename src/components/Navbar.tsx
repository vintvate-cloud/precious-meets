import { Link, useRouter } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { SosModal } from "@/components/SosModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ShieldCheck,
  User,
  Calendar,
  LogOut,
  ShieldAlert,
  Sparkles,
  BookOpen,
  Utensils,
  ArrowRight,
} from "lucide-react";

export function Navbar() {
  const { user, profile, isAdmin, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4 pointer-events-none">
      <div ref={menuRef} className="relative w-full max-w-4xl">
        <nav className="pointer-events-auto flex w-full items-center justify-between rounded-full border border-border/80 bg-ivory/95 py-2 pl-5 pr-2 shadow-sm backdrop-blur-md">
          <div className="flex items-center gap-5 sm:gap-6">
            <Link to="/" className="font-display text-2xl tracking-tight text-foreground">
              Precious<em className="text-burgundy not-italic font-normal">meets</em>
            </Link>
            <div className="hidden items-center gap-4 md:flex">
              <Link
                to="/philosophy"
                className="text-xs font-semibold text-foreground/85 transition-colors hover:text-burgundy flex items-center gap-1"
              >
                Philosophy
                <span className="text-[9px] bg-forest/15 text-forest px-1.5 py-0.2 rounded-full font-mono">Safety USP</span>
              </Link>
              <Link
                to="/experiences"
                className="text-xs font-medium text-foreground/80 transition-colors hover:text-burgundy"
              >
                Meets
              </Link>
              <Link
                to="/how-it-works"
                className="text-xs font-medium text-foreground/80 transition-colors hover:text-burgundy"
              >
                How It Works
              </Link>
              <Link
                to="/safety"
                className="text-xs font-medium text-foreground/80 transition-colors hover:text-burgundy"
              >
                Safety Code
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/quiz"
              className="hidden items-center gap-1.5 rounded-full bg-burgundy px-4 py-2 text-xs font-semibold uppercase tracking-wider text-ivory transition-transform hover:scale-105 sm:inline-flex"
            >
              <Sparkles className="size-3.5 text-ochre" />
              Take the Quiz
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="rounded-full ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer">
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
                          <ShieldCheck className="size-3 text-forest" /> Aadhaar Verified
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
                className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-foreground transition-colors hover:bg-sage/40"
              >
                Sign In
              </Link>
            )}

            {/* Compact Dropdown Menu Toggle Button */}
            <button
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className="grid size-9 place-items-center rounded-full bg-ink text-ivory hover:bg-burgundy transition-all duration-300 md:hidden cursor-pointer"
            >
              <span className={`block h-0.5 w-4 bg-ivory transition-transform duration-300 ${open ? "rotate-45 translate-y-1" : "-translate-y-0.5"}`} />
              <span className={`block h-0.5 w-4 bg-ivory transition-transform duration-300 ${open ? "-rotate-45 -translate-y-0.5" : "translate-y-0.5"}`} />
            </button>
          </div>
        </nav>

        {/* COMPACT DROPDOWN POPUP FOR NAVBAR */}
        {open && (
          <div className="pointer-events-auto absolute top-full right-0 mt-2 w-72 overflow-hidden rounded-2xl border border-border/80 bg-card/95 p-2.5 text-card-foreground shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200 md:hidden">
            <div className="px-3 py-2 border-b border-border/60 mb-1 flex items-center justify-between text-[10px] font-mono uppercase text-muted-foreground">
              <span>Navigation</span>
              <span className="text-forest font-semibold flex items-center gap-1">
                <ShieldCheck className="size-3" /> 100% Aadhaar Verified
              </span>
            </div>

            <div className="space-y-1">
              <Link
                to="/quiz"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-xl bg-burgundy px-3 py-2.5 text-xs font-semibold text-ivory hover:bg-burgundy/90 shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-ochre" />
                  <span>Take the Discovery Quiz</span>
                </div>
                <ArrowRight className="size-3.5" />
              </Link>

              <Link
                to="/philosophy"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-foreground hover:bg-sage/40 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-forest" />
                  <span>The Safety Philosophy</span>
                </div>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-forest/15 text-forest">USP</span>
              </Link>

              <Link
                to="/how-it-works"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-foreground hover:bg-sage/40 transition-colors"
              >
                <BookOpen className="size-4 text-foreground/70" />
                <span>How It Works</span>
              </Link>

              <Link
                to="/experiences"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-foreground hover:bg-sage/40 transition-colors"
              >
                <Utensils className="size-4 text-foreground/70" />
                <span>Curated Meets</span>
              </Link>

              <Link
                to="/safety"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <ShieldAlert className="size-4 text-red-600" />
                <span>Safety & SOS Beacon</span>
              </Link>

              <Link
                to={user ? "/dashboard" : "/login"}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-foreground hover:bg-sage/40 transition-colors border-t border-border/50 pt-2"
              >
                <User className="size-4 text-foreground/70" />
                <span>{user ? "My Dashboard" : "Member Sign In"}</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
