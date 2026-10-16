import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<SVGSVGElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDone(true);
      onComplete();
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Table continuous rotation
      gsap.to(tableRef.current, {
        rotation: 360,
        duration: 3,
        repeat: -1,
        ease: "none",
        transformOrigin: "center center",
      });

      // 2. Preloader sequence timeline
      const tl = gsap.timeline({
        onComplete: () => {
          setDone(true);
        },
      });

      tl.to({}, { duration: 1.5 }) // Allow table rotation to be enjoyed
        // Curtain rises from bottom to cover screen
        .fromTo(
          curtainRef.current,
          { yPercent: 100 },
          {
            yPercent: 0,
            duration: 0.85,
            ease: "power3.inOut",
          },
        )
        // Fire hero sequential animation right as the curtain starts lifting up
        .call(() => {
          onComplete();
        })
        // Curtain lifts off the top of screen to unveil hero
        .to(curtainRef.current, {
          yPercent: -100,
          duration: 0.85,
          ease: "power3.inOut",
        })
        .to(rootRef.current, {
          opacity: 0,
          duration: 0.2,
          pointerEvents: "none",
        });
    }, rootRef);

    return () => ctx.revert();
  }, [onComplete]);

  if (done) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ivory text-ink"
    >
      {/* Table & Attendees Centerpiece */}
      <div className="flex flex-col items-center gap-6">
        <svg
          ref={tableRef}
          viewBox="-100 -100 200 200"
          className="size-36 md:size-44 overflow-visible"
        >
          {/* Circular table */}
          <circle cx="0" cy="0" r="50" fill="#5F7045" opacity="0.95" />
          {/* Inner ring */}
          <circle cx="0" cy="0" r="42" fill="none" stroke="#F8F2E7" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
          {/* Table centerpiece candle */}
          <circle cx="0" cy="0" r="5" fill="#C6A568" />
          {/* 6 Attendees revolving around table */}
          {[0, 60, 120, 180, 240, 300].map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            const cx = Math.cos(rad) * 66;
            const cy = Math.sin(rad) * 66;
            const isYou = i === 0;
            return (
              <circle
                key={deg}
                cx={cx}
                cy={cy}
                r={isYou ? 8.5 : 7.5}
                fill={isYou ? "#F8F2E7" : i % 2 === 0 ? "#691C35" : "#C6A568"}
                stroke="#171514"
                strokeWidth={isYou ? 2.5 : 0}
              />
            );
          })}
        </svg>

        <div className="flex flex-col items-center gap-2 text-center">
          <p className="font-display text-2xl tracking-wide text-ink">
            Precious<em className="text-burgundy">meets</em>
          </p>
          <span className="label-mono text-[10px] tracking-widest text-forest/80 uppercase">
            Setting your table...
          </span>
        </div>
      </div>

      {/* Solid Purple / Burgundy Rising Curtain */}
      <div
        ref={curtainRef}
        className="absolute inset-0 bg-burgundy z-50 flex items-center justify-center text-ivory pointer-events-none"
        style={{ transform: "translateY(100%)" }}
      >
        <span className="font-display text-4xl sm:text-5xl italic text-ochre">
          Every meet counts.
        </span>
      </div>
    </div>
  );
}
