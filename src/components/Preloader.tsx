import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";

const SEAT_ANGLES = [-90, -30, 30, 90, 150, 210];

const preloaderSeats = SEAT_ANGLES.map((deg, id) => {
  const rad = (deg * Math.PI) / 180;
  return {
    id,
    deg,
    plateX: 200 + 68 * Math.cos(rad),
    plateY: 200 + 68 * Math.sin(rad),
    chairX: 200 + 138 * Math.cos(rad),
    chairY: 200 + 138 * Math.sin(rad),
  };
});

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const rotatingSeatsRef = useRef<SVGGElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDone(true);
      onComplete();
      return;
    }

    const ctx = gsap.context(() => {
      // 0. Initial hidden states
      gsap.set("[data-preload-rings] circle", {
        opacity: 0,
        scale: 0.92,
        transformOrigin: "200px 200px",
      });
      gsap.set("[data-preload-table]", {
        scale: 0.4,
        opacity: 0,
        transformOrigin: "200px 200px",
      });
      gsap.set("[data-preload-plate]", {
        scale: 0,
        opacity: 0,
        transformOrigin: "center center",
      });
      gsap.set("[data-preload-chair]", {
        scale: 0.6,
        opacity: 0,
        transformOrigin: "center center",
      });
      gsap.set("[data-preload-text]", {
        opacity: 0,
        y: 10,
        filter: "blur(4px)",
      });
      gsap.set("[data-preload-line]", {
        scaleX: 0,
        transformOrigin: "center center",
      });
      gsap.set("[data-preload-caption]", {
        opacity: 0,
        y: 12,
        filter: "blur(3px)",
      });
      gsap.set("[data-preload-table-stage]", {
        autoAlpha: 1,
        display: "flex",
      });
      gsap.set("[data-preload-matters-wrap]", {
        autoAlpha: 0,
        display: "none",
      });
      gsap.set("[data-preload-matters-text]", {
        scale: 0.88,
        opacity: 0,
        filter: "blur(6px)",
        transformOrigin: "center center",
      });

      // Master GSAP Timeline
      const tl = gsap.timeline({
        onComplete: () => {
          setDone(true);
        },
      });

      // Phase 1: Architectural Drawing Assembly
      // 1. Concentric guide rings reveal with blueprint drawing ease
      tl.to(
        "[data-preload-rings] circle",
        {
          opacity: 1,
          scale: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: "power2.out",
        },
        0.05,
      )
        // 2. Sand table disc blooms softly into place
        .to(
          "[data-preload-table]",
          {
            opacity: 1,
            scale: 1,
            duration: 0.75,
            ease: "back.out(1.25)",
          },
          0.2,
        )
        // 3. Dining chairs glide into position radially with smooth physics
        .to(
          "[data-preload-chair]",
          {
            scale: 1,
            opacity: 1,
            duration: 0.65,
            stagger: {
              each: 0.05,
              from: "start",
            },
            ease: "power3.out",
          },
          0.35,
        )
        // 4. White porcelain dinner plates pop onto table rim
        .to(
          "[data-preload-plate]",
          {
            scale: 1,
            opacity: 1,
            duration: 0.45,
            stagger: {
              each: 0.04,
              from: "center",
            },
            ease: "back.out(1.7)",
          },
          0.55,
        )
        // 5. Center serif inscription dissolves in (kept stationary & upright)
        .to(
          "[data-preload-text]",
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.6,
            ease: "power2.out",
          },
          0.75,
        )
        // 6. Accent burgundy line expands outward
        .to(
          "[data-preload-line]",
          {
            scaleX: 1,
            duration: 0.45,
            ease: "power2.out",
          },
          0.95,
        )
        // 7. Bottom reference caption glides in
        .to(
          "[data-preload-caption]",
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.6,
            ease: "power2.out",
          },
          1.05,
        );

      // Subtle ambient turntable rotation of chairs & plates on the timeline
      // Center table disc and text remain perfectly upright and readable
      tl.to(
        rotatingSeatsRef.current,
        {
          rotation: 24,
          duration: 2.2,
          ease: "power1.inOut",
          transformOrigin: "200px 200px",
        },
        0.3,
      );

      // Phase 2: Architectural Table completely dissolves BEFORE Statement
      // Users have a clear hold to read the table and caption with zero visual conflict
      tl.to(
        "[data-preload-table-stage]",
        {
          autoAlpha: 0,
          scale: 0.94,
          filter: "blur(4px)",
          duration: 0.45,
          ease: "power2.inOut",
        },
        2.2,
      );

      // Completely hide and remove table stage from rendering before text appears
      tl.set("[data-preload-table-stage]", { display: "none" }, 2.65);

      // Phase 3: "Every meet matters." Statement Screen
      // Completely isolated in time — table is 100% gone before this begins
      tl.set("[data-preload-matters-wrap]", { display: "flex", autoAlpha: 0 }, 2.68)
        .to(
          "[data-preload-matters-wrap]",
          {
            autoAlpha: 1,
            duration: 0.35,
            ease: "power2.out",
          },
          2.7,
        )
        .to(
          "[data-preload-matters-text]",
          {
            opacity: 1,
            filter: "blur(0px)",
            scale: 1.18,
            duration: 1.45,
            ease: "power1.out",
          },
          2.7,
        );

      // Phase 4: Solid Burgundy Rising & Lifting Theatre Curtain
      // Curtain sweeps up from bottom to blanket the screen
      tl.fromTo(
        curtainRef.current,
        { yPercent: 100 },
        {
          yPercent: 0,
          duration: 0.75,
          ease: "power4.inOut",
        },
        4.15,
      )
        // While screen is completely blanketed, wipe all preloader contents behind it
        .call(() => {
          gsap.set("[data-preload-matters-wrap]", { autoAlpha: 0, display: "none" });
          gsap.set("[data-preload-bg]", { opacity: 0 });
        })
        // Right as curtain starts lifting, trigger hero animation sequence
        .call(() => {
          onComplete();
        })
        // Phase 5: Curtain lifts up unveiling the pristine hero
        .to(curtainRef.current, {
          yPercent: -100,
          duration: 0.75,
          ease: "power4.inOut",
        })
        // Fade out root wrapper and unmount
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
    <AnimatePresence>
      <motion.div
        ref={rootRef}
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.3 } }}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#F7EFEB] text-[#2D2118] select-none px-4 overflow-hidden"
      >
        {/* Subtle organic ambient glow & grain layer */}
        <div
          data-preload-bg
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, #FCF8F3 0%, #F6ECE2 55%, #EFE4D8 100%)",
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(#DEC7A8_1px,transparent_1px)] [background-size:24px_24px] opacity-35" />
        </div>

        {/* Stage 1: Architectural Dinner Table Diagram */}
        <div
          data-preload-table-stage
          className="relative z-10 flex flex-col items-center gap-6"
        >
          <svg
            viewBox="0 0 400 400"
            className="size-72 sm:size-84 md:size-96 overflow-visible"
            aria-hidden
          >
            {/* Outer Orbit Group: Rings, Plates, Chairs rotate gracefully */}
            <g ref={rotatingSeatsRef}>
              {/* 3 Concentric Architectural Guide Rings */}
              <g data-preload-rings>
                {/* Outer guide ring */}
                <circle
                  cx="200"
                  cy="200"
                  r="184"
                  fill="none"
                  stroke="#E4D7CA"
                  strokeWidth="1.1"
                />
                {/* Middle chair guide ring */}
                <circle
                  cx="200"
                  cy="200"
                  r="138"
                  fill="none"
                  stroke="#DCCBB9"
                  strokeWidth="0.95"
                />
                {/* Inner table clearance ring */}
                <circle
                  cx="200"
                  cy="200"
                  r="104"
                  fill="none"
                  stroke="#E0D1C2"
                  strokeWidth="0.85"
                />
              </g>

              {/* 6 White Porcelain Dinner Plates on Table Rim */}
              {preloaderSeats.map((s) => (
                <g key={`plate-${s.id}`} data-preload-plate>
                  {/* Outer plate rim */}
                  <circle
                    cx={s.plateX}
                    cy={s.plateY}
                    r="11.5"
                    fill="#FFFFFF"
                    stroke="#3E2C20"
                    strokeWidth="1.1"
                    style={{
                      filter: "drop-shadow(0 1px 3px rgba(62,44,32,0.1))",
                    }}
                  />
                  {/* Inner plate depression */}
                  <circle
                    cx={s.plateX}
                    cy={s.plateY}
                    r="7"
                    fill="#FAF6F0"
                    stroke="#DAC9B7"
                    strokeWidth="0.7"
                  />
                </g>
              ))}

              {/* 6 Architectural Dining Chairs with Burgundy Curved Backrest Cap */}
              {preloaderSeats.map((s) => (
                <g
                  key={`chair-${s.id}`}
                  transform={`translate(${s.chairX}, ${s.chairY}) rotate(${s.deg + 90})`}
                >
                  <g data-preload-chair={s.id}>
                    {/* Full Chair Outline Base */}
                    <rect
                      x="-20"
                      y="-9"
                      width="40"
                      height="18"
                      rx="6"
                      fill="#FFFFFF"
                      stroke="#3E2C20"
                      strokeWidth="1.2"
                      style={{
                        filter: "drop-shadow(0 2px 6px rgba(62,44,32,0.08))",
                      }}
                    />

                    {/* Burgundy Backrest: Outer half of the chair facing outward */}
                    <path
                      d="M -20 -3 L -20 -4 C -20 -6.76 -17.76 -9 -15 -9 L 15 -9 C 17.76 -9 20 -6.76 20 -4 L 20 -3 Z"
                      fill="#962838"
                      stroke="#3E2C20"
                      strokeWidth="1.2"
                    />

                    {/* Seat Cushion Divider Line */}
                    <line
                      x1="-19.5"
                      y1="-3"
                      x2="19.5"
                      y2="-3"
                      stroke="#3E2C20"
                      strokeWidth="1"
                    />
                  </g>
                </g>
              ))}
            </g>

            {/* Central Table Disc: Bevel + Warm Sand/Camel Top (Stays centered & steady) */}
            <g data-preload-table>
              {/* Outer table edge ring */}
              <circle
                cx="200"
                cy="200"
                r="92"
                fill="#DFCAAC"
                stroke="#3E2C20"
                strokeWidth="1.2"
                style={{
                  filter: "drop-shadow(0 4px 16px rgba(62,44,32,0.08))",
                }}
              />
              {/* Main Sand Table Surface */}
              <circle
                cx="200"
                cy="200"
                r="90"
                fill="#DEC7A8"
                stroke="#3E2C20"
                strokeWidth="0.8"
              />
            </g>

            {/* Center Table Inscription - Stays perfectly horizontal & level */}
            <g data-preload-text className="select-none pointer-events-none">
              <text
                x="200"
                y="190"
                textAnchor="middle"
                fill="#3E2C20"
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: "italic",
                  fontSize: "17.5px",
                  letterSpacing: "0.015em",
                }}
              >
                Every friend was
              </text>
              <text
                x="200"
                y="209"
                textAnchor="middle"
                fill="#3E2C20"
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: "italic",
                  fontSize: "17.5px",
                  letterSpacing: "0.015em",
                }}
              >
                once a stranger.
              </text>
              <line
                data-preload-line
                x1="187"
                y1="220"
                x2="213"
                y2="220"
                stroke="#962838"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </g>
          </svg>

          {/* Exact Caption from Reference Image */}
          <div data-preload-caption className="flex flex-col items-center gap-1 text-center max-w-sm px-4">
            <p className="font-sans text-[13px] sm:text-[14px] text-[#5A4535] tracking-wide font-normal leading-relaxed">
              Six seats. One table. Pulled up for people who haven&apos;t met &mdash; yet.
            </p>
          </div>
        </div>

        {/* Stage 2: "Every meet matters." Statement Screen with Size Increase & Delay */}
        <div
          data-preload-matters-wrap
          style={{ display: "none" }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none px-6 text-center"
        >
          <h1
            data-preload-matters-text
            className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl italic text-[#691C35] tracking-tight select-none"
          >
            Every meet <span className="text-[#C6A568] not-italic">matters.</span>
          </h1>
        </div>

        {/* Stage 3: Solid Burgundy Rising & Lifting Theatre Curtain */}
        <div
          ref={curtainRef}
          className="absolute inset-0 bg-[#691C35] z-50 pointer-events-none"
          style={{ transform: "translateY(100%)" }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
