import { Link, useLocation } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ShieldCheck,
  User,
  LogOut,
  ShieldAlert,
  Sparkles,
  BookOpen,
  ArrowRight,
  HelpCircle,
} from "lucide-react";

export function Navbar() {
  const { user, profile, isAdmin, signOut } = useAuth();
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");
  const isMemberAuthenticated = Boolean(user || isDashboard);
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const handleHowItWorksClick = (e: React.MouseEvent) => {
    setOpen(false);
    const target = document.getElementById("how");
    if (target) {
      e.preventDefault();
      const lenis = (window as unknown as { __lenis?: { scrollTo: (target: HTMLElement | string, options?: { offset?: number; duration?: number }) => void } }).__lenis;
      if (lenis) {
        lenis.scrollTo(target, { offset: 0, duration: 1.5 });
      } else {
        target.scrollIntoView({ behavior: "smooth" });
      }
      window.history.pushState(null, "", "#how");
    }
  };

  return (
    <header data-nav className="fixed inset-x-0 top-4 z-50 flex justify-center px-4 pointer-events-none">
      <div ref={menuRef} className="relative w-full max-w-4xl">
        <nav
          data-nav-bar
          style={{
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.65) 100%)",
            backdropFilter: "blur(28px) saturate(190%) contrast(95%)",
            WebkitBackdropFilter: "blur(28px) saturate(190%) contrast(95%)",
          }}
          className="pointer-events-auto flex w-full items-center justify-between rounded-full border border-black/5 py-2 pl-3.5 sm:pl-5 pr-2 text-[#171514] shadow-[0_12px_32px_-10px_rgba(23,21,20,0.08),_0_2px_8px_-2px_rgba(23,21,20,0.03)] transition-all duration-300"
        >
          {/* Left: Brand Monogram + Logo */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <span className="grid size-8 place-items-center rounded-full bg-white border border-black/5 text-[#691C35] transition-transform duration-300 group-hover:scale-105 shadow-xs">
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="8" stroke="#691C35" strokeWidth="2" />
                  <circle cx="12" cy="12" r="3" fill="#C6A568" />
                </svg>
              </span>
              <span className="font-display text-xl sm:text-2xl text-[#171514] tracking-tight">
                Precious<em className="text-[#691C35] not-italic font-serif"> meets</em>
              </span>
            </Link>
          </div>

          {/* Right Controls: Ambient City Pill + CTA Button + User Avatar + Menu Toggle Button */}
          <div className="flex items-center gap-2">
            {/* Ambient City Pill */}
            <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-[11px] font-mono tracking-wider text-[#171514]/75 border border-black/5">
              <span className="size-1.5 rounded-full bg-[#5F7045] animate-pulse" />
              <span>Delhi NCR</span>
            </div>

            {/* Solid Pill CTA Button -> routes to /quiz (only shown when not logged in) */}
            {!isMemberAuthenticated && (
              <Link
                to="/quiz"
                className="rounded-full bg-white text-[#171514] border border-black/10 px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold tracking-tight shadow-xs transition-all duration-300 hover:bg-[#691C35] hover:text-white hover:scale-105 active:scale-95"
              >
                Save a seat
              </Link>
            )}

            {/* User Profile Avatar if authenticated or in dashboard */}
            {isMemberAuthenticated && (
              <Link
                to="/dashboard"
                title="Go to Dashboard"
                className="inline-flex rounded-full ring-offset-background transition-transform hover:scale-105 cursor-pointer"
              >
                <Avatar className="size-8 sm:size-9 border border-black/10 shadow-xs">
                  <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.display_name || "User"} />
                  <AvatarFallback className="bg-sage text-xs font-semibold text-forest">
                    {profile?.display_name?.slice(0, 2).toUpperCase() || "ME"}
                  </AvatarFallback>
                </Avatar>
              </Link>
            )}

            {/* Compact Dropdown Menu Toggle Button - ALWAYS visible on all screen sizes */}
            <button
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className="relative grid size-9 sm:size-10 place-items-center rounded-full bg-[#171514] text-white shadow-sm transition-all duration-300 hover:bg-[#691C35] hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span className={`absolute h-px w-3.5 sm:w-4 bg-white transition-transform duration-500 ${open ? "rotate-45" : "-translate-y-1"}`} />
              <span className={`absolute h-px w-3.5 sm:w-4 bg-white transition-transform duration-500 ${open ? "-rotate-45" : "translate-y-1"}`} />
            </button>
          </div>
        </nav>

        {/* COMPACT DROPDOWN POPUP */}
        {open && (
          <div className="pointer-events-auto absolute top-full right-0 mt-2.5 w-72 sm:w-80 overflow-hidden rounded-2xl border border-white/80 bg-white/95 p-2.5 text-[#171514] shadow-[0_20px_50px_rgba(0,0,0,0.18)] backdrop-blur-2xl animate-in fade-in slide-in-from-top-3 duration-200">
            <div className="px-3 py-2 border-b border-[#171514]/10 mb-1 flex items-center justify-between">
              <span className="label-mono text-[10px] uppercase font-bold text-muted-foreground">
                Navigation
              </span>
              <span className="text-[10px] text-forest font-semibold flex items-center gap-1">
                <ShieldCheck className="size-3" /> 100% Aadhaar Verified
              </span>
            </div>

            <div className="space-y-1">
              <Link
                to="/quiz"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-xl bg-burgundy px-3 py-2.5 text-xs font-semibold text-ivory hover:bg-burgundy/90 shadow-xs transition-colors"
              >
                <div className="flex items-center gap-2.5">
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
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="size-4 text-forest" />
                  <span>The Philosophy & Safety</span>
                </div>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-forest/15 text-forest">
                  Women-First
                </span>
              </Link>

              <a
                href="/#how"
                onClick={handleHowItWorksClick}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-foreground hover:bg-sage/40 transition-colors cursor-pointer"
              >
                <BookOpen className="size-4 text-foreground/70" />
                <span>How It Works</span>
              </a>

              <Link
                to="/safety"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <ShieldAlert className="size-4 text-red-600" />
                <span>24/7 Safety & SOS</span>
              </Link>

              <Link
                to="/faq"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-foreground hover:bg-sage/40 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <HelpCircle className="size-4 text-foreground/70" />
                  <span>Frequently Asked Questions</span>
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/5 text-muted-foreground font-semibold">
                  FAQ
                </span>
              </Link>

              {isMemberAuthenticated ? (
                <div className="border-t border-[#171514]/10 my-1 pt-1 space-y-1">
                  <div className="px-3 py-1.5 flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono text-muted-foreground">Member Session</span>
                    <span className="text-xs font-medium text-foreground truncate max-w-[150px]">{profile?.display_name || user?.email || "Founding Member"}</span>
                  </div>
                  {!isDashboard && (
                    <Link
                      to="/dashboard"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-foreground hover:bg-sage/40 transition-colors"
                    >
                      <User className="size-4 text-foreground/70" />
                      <span>My Dashboard</span>
                    </Link>
                  )}
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-burgundy hover:bg-burgundy/10 transition-colors"
                    >
                      <ShieldCheck className="size-4 text-burgundy" />
                      <span>Admin Operations</span>
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      signOut();
                    }}
                    className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors cursor-pointer text-left"
                  >
                    <LogOut className="size-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-foreground hover:bg-sage/40 transition-colors border-t border-[#171514]/10 pt-2"
                >
                  <User className="size-4 text-foreground/70" />
                  <span>Member Sign In</span>
                </Link>
              )}
            </div>

            <div className="mt-2 border-t border-[#171514]/10 pt-2 px-3 text-[11px] text-muted-foreground flex items-center justify-between">
              <span>Delhi NCR · Active Circles</span>
              <span className="font-mono text-[10px] text-forest">Verified Tables</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
