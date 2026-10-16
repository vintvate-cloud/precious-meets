import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border/80 bg-card/60 px-6 py-16 text-foreground">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link to="/" className="font-display text-3xl">
              Precious<em className="text-burgundy not-italic font-normal">meets</em>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Intimate dinner salons, unhurried coffee tastings, and sunset walks for thoughtful people beyond your usual circle.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <span className="label-mono rounded-full bg-sage/60 px-3 py-1 text-xs text-forest">
                Mumbai
              </span>
              <span className="label-mono rounded-full bg-sage/60 px-3 py-1 text-xs text-forest">
                Bengaluru
              </span>
              <span className="label-mono rounded-full bg-sage/60 px-3 py-1 text-xs text-forest">
                Delhi NCR
              </span>
            </div>
          </div>

          <div>
            <h4 className="label-mono text-xs font-semibold text-foreground/70">Explore</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link to="/experiences" className="text-muted-foreground hover:text-burgundy">
                  Upcoming Meets
                </Link>
              </li>
              <li>
                <Link to="/quiz" className="text-muted-foreground hover:text-burgundy">
                  Personality Quiz
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-muted-foreground hover:text-burgundy">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/safety" className="text-muted-foreground hover:text-burgundy">
                  Safety Protocol
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="label-mono text-xs font-semibold text-foreground/70">Trust & Legal</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-burgundy">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-burgundy">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/safety" className="text-muted-foreground hover:text-burgundy">
                  Emergency SOS
                </Link>
              </li>
              <li>
                <Link to="/verify-identity" className="text-muted-foreground hover:text-burgundy">
                  Aadhaar Verification
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between border-t border-border/60 pt-8 text-xs text-muted-foreground sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Precious Meets Technologies Pvt. Ltd. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Every meet matters.</p>
        </div>
      </div>
    </footer>
  );
}
