import React, { useEffect, useRef } from "react";

interface SummitAttendeesProps {
  isNight?: boolean;
  onStageChange?: (stage: 0 | 1 | 2) => void;
}

const PAL = ["#ff9933", "#ffd166", "#2ec4b6", "#ff5d8f", "#7c9cff", "#4cc46a"];
const WORDS = ["Namaste", "Hi!", "Chai?", "Hello", "Kya haal?", "Welcome"];
const LOOP = 29; // 29-second extended, perfectly smooth sequential cycle

interface Person {
  i: number;
  cl: number;
  c: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  ph: number;
  ang: number;
  rad: number;
  v: number; // verification factor 0 -> 1
  pop: number; // timestamp when verification card popped
  popT: number; // scheduled loop time T when this person verifies
}

interface GreetingBubble {
  x: number;
  y: number;
  t: number;
  w: string;
  personIndex: number;
}

// Smoothstep ease curve
const sm = (a: number, b: number, x: number) => {
  x = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return x * x * (3 - 2 * x);
};

function seeded(s: number) {
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

/**
 * SUMMIT ATTENDEES ANIMATION
 * Exact Sequential Storyline:
 * 1. (0s - 7s): Normal Random Wandering — strangers freely strolling on promenade
 * 2. (7s - 11.5s): Random Verification Checks — ID card with green checkmark pops on random people
 * 3. (10.5s - 15s): Verified People Connect — connecting lines link verified people together
 * 4. (14s - 20.5s): Grouping — they assemble into 6-6 table clusters
 * 5. (18.5s - 24.5s): Hi / Hello Text — speech bubbles appear only once grouped at their tables
 * 6. (24s - 29s): Disperse & Seamless Loop — groups disperse and return to normal wandering with 0 cuts
 */
export function SummitAttendees({ isNight = true, onStageChange }: SummitAttendeesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let W = container.clientWidth || window.innerWidth;
    let H = container.clientHeight || 320;
    let DPR = Math.min(window.devicePixelRatio || 1, 2);
    let sc = Math.max(0.75, Math.min(W, H * 2.2) / 680);

    let P: Person[] = [];
    let cents: { x: number; y: number }[] = [];
    let fx: GreetingBubble[] = [];
    let lastSpawn = 0;
    let lastTime = 0;
    let lastCycleId = -1;
    let lastStage: 0 | 1 | 2 = -1;
    const t0 = performance.now();

    // 4 cluster locations flanking the central promenade walkway
    const CF_DESKTOP = [0.16, 0.36, 0.64, 0.84];
    const CF_MOBILE = [0.26, 0.74];

    function scheduleRandomVerifications(cycleId: number) {
      const r = seeded(cycleId * 1337 + 7);
      for (const p of P) {
        // ~50% random members get verified in this cycle
        if (r() < 0.5) {
          // Stagger verification pop times across Step 2 (T = 7.0s to 11.2s)
          p.popT = 7.0 + r() * 4.2;
        } else {
          p.popT = -1;
        }
        p.pop = -1;
        p.v = 0;
      }
    }

    function layout() {
      const isMobile = W < 640;
      const CF = isMobile ? CF_MOBILE : CF_DESKTOP;
      const numGroups = CF.length;
      const personsPerGroup = 6;

      // Ground promenade walkway vertical range (strictly below the balustrade railing)
      const walkMinY = H * 0.65;
      const walkMaxY = H * 0.90;
      const walkCenterY = H * 0.78;

      cents = CF.map((f) => ({
        x: W * f,
        y: walkCenterY,
      }));

      // Only initialize positions if empty to preserve continuous positions on resize
      if (P.length !== numGroups * personsPerGroup) {
        const r = seeded(42);
        P = [];
        for (let g = 0; g < numGroups; g++) {
          const groupCenterX = W * CF[g];
          for (let m = 0; m < personsPerGroup; m++) {
            const idx = g * personsPerGroup + m;
            const spawnX = Math.max(25, Math.min(W - 25, groupCenterX + (r() - 0.5) * (W * 0.18)));
            const spawnY = walkMinY + r() * (walkMaxY - walkMinY);

            P.push({
              i: idx,
              cl: g,
              c: PAL[m % PAL.length],
              x: spawnX,
              y: spawnY,
              vx: (r() - 0.5) * 0.6,
              vy: (r() - 0.5) * 0.3,
              ph: r() * 9,
              ang: (m / personsPerGroup) * Math.PI * 2 + (r() - 0.5) * 0.5,
              rad: 0.35 + r() * 0.65,
              v: 0,
              pop: -1,
              popT: -1,
            });
          }
        }
        scheduleRandomVerifications(0);
      }
    }

    function resize() {
      if (!container || !canvas) return;
      W = container.clientWidth || window.innerWidth;
      H = container.clientHeight || 320;
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      sc = Math.max(0.75, Math.min(W, H * 2.2) / 680);
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      layout();
    }

    resize();
    window.addEventListener("resize", resize);

    /**
     * DRAW PERSON
     * Minimal Black (day) / Pure White (night) matching PromenadeHumanFigure
     */
    function drawPerson(x: number, y: number, r: number) {
      if (!ctx) return;
      ctx.globalAlpha = 1;
      ctx.fillStyle = isNight ? "#ffffff" : "#000000";

      // Head: Solid Circle (exact 1:1 circle, no distortion)
      ctx.beginPath();
      ctx.arc(x, y - r * 1.7, r * 0.85, 0, Math.PI * 2);
      ctx.fill();

      // Shoulders / Bust: Semicircular Arc Dome
      ctx.beginPath();
      ctx.ellipse(x, y + r * 0.8, r * 1.35, r * 1.6, 0, Math.PI, Math.PI * 2);
      ctx.fill();
    }

    /**
     * DRAW VERIFICATION CARD
     * Exact match to user screenshot:
     * - Off-white card body with soft shadow
     * - Top accent color bar
     * - Green circular badge with crisp white checkmark
     * - Placeholder text lines
     */
    function drawVerificationCard(p: Person, now: number) {
      if (!ctx || p.pop <= 0) return;
      const duration = 2200; // visible for 2.2s
      const elapsed = now - p.pop;
      if (elapsed < 0 || elapsed > duration) return;

      const t = elapsed / duration;
      // Fast fade-in, steady hold, then smooth fade-out
      const alpha = t < 0.12 ? t / 0.12 : t > 0.7 ? (1 - t) / 0.3 : 1;
      const s = sc;
      const x = p.x;
      // Gently floats upwards from head
      const y = p.y - (26 + t * 14) * s;

      ctx.save();
      ctx.globalAlpha = alpha;

      // Card shadow
      ctx.shadowColor = "rgba(0, 0, 0, 0.28)";
      ctx.shadowBlur = 6 * s;
      ctx.shadowOffsetY = 2 * s;

      // 1. Card Body
      const w = 34 * s;
      const h = 22 * s;
      const cr = 3.5 * s;
      ctx.fillStyle = "#fffaf0";
      ctx.beginPath();
      if ("roundRect" in ctx) {
        ctx.roundRect(x - w / 2, y - h / 2, w, h, cr);
      } else {
        ctx.rect(x - w / 2, y - h / 2, w, h);
      }
      ctx.fill();

      // Reset shadow for card elements
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      // 2. Top Color Banner
      ctx.fillStyle = p.c;
      ctx.beginPath();
      if ("roundRect" in ctx) {
        ctx.roundRect(x - w / 2, y - h / 2, w, 4.5 * s, [cr, cr, 0, 0]);
      } else {
        ctx.fillRect(x - w / 2, y - h / 2, w, 4.5 * s);
      }
      ctx.fill();

      // 3. Green Circular Verification Badge
      const badgeX = x - 8.5 * s;
      const badgeY = y + 2 * s;
      const badgeR = 4.8 * s;
      ctx.beginPath();
      ctx.arc(badgeX, badgeY, badgeR, 0, Math.PI * 2);
      ctx.fillStyle = "#12a150";
      ctx.fill();

      // 4. White Checkmark Icon
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.4 * s;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(badgeX - 2.4 * s, badgeY + 0.1 * s);
      ctx.lineTo(badgeX - 0.7 * s, badgeY + 1.9 * s);
      ctx.lineTo(badgeX + 2.4 * s, badgeY - 1.8 * s);
      ctx.stroke();

      // 5. Placeholder Text Lines
      ctx.fillStyle = "#b9b0c4";
      const lineX = x - 0.5 * s;
      if ("roundRect" in ctx) {
        ctx.beginPath();
        ctx.roundRect(lineX, y - 1.5 * s, 13 * s, 2 * s, 1 * s);
        ctx.fill();
        ctx.beginPath();
        ctx.roundRect(lineX, y + 3 * s, 9 * s, 2 * s, 1 * s);
        ctx.fill();
      } else {
        ctx.fillRect(lineX, y - 1.5 * s, 13 * s, 2 * s);
        ctx.fillRect(lineX, y + 3 * s, 9 * s, 2 * s);
      }

      ctx.restore();
    }

    function frame(now: number) {
      if (!ctx || !canvas) return;
      const dt = Math.min(0.05, (now - lastTime || 16) / 1000);
      lastTime = now;
      const f = dt * 60;

      // Promenade vertical bounds: strictly on the ground walkway
      const walkMinY = H * 0.64;
      const walkMaxY = H * 0.90;

      // Continuous loop time & cycle detection
      const totalSec = (now - t0) / 1000;
      const cycleId = Math.floor(totalSec / LOOP);
      const T = totalSec % LOOP;

      // New cycle: schedule fresh random members for verification
      if (cycleId !== lastCycleId) {
        lastCycleId = cycleId;
        scheduleRandomVerifications(cycleId);
      }
      // Headline Stage Tracking:
      // Stage 0: (0s - 7.2s) Wandering -> "Six strangers. One table."
      // Stage 1: (7.2s - 14.0s) Verifying -> "Everyone is verified here."
      // Stage 2: (14.0s - 27.5s) Grouping & Talking -> "Six strangers. One table."
      // Stage 0: (27.5s - 29.0s) Quiet reset to Stage 0
      let currentStage: 0 | 1 | 2 = 0;
      if (T >= 7.2 && T < 14.0) {
        currentStage = 1;
      } else if (T >= 14.0 && T < 27.5) {
        currentStage = 2;
      } else {
        currentStage = 0;
      }

      if (currentStage !== lastStage) {
        lastStage = currentStage;
        onStageChange?.(currentStage);
      }

      // Grouping Weight (wc):
      // T = 0 to 14.0s: 0 (Step 1 wandering, Step 2 verifications, Step 3 connections begin)
      // T = 14.0 to 18.0s: ramp up to 1 (Step 4: members pull into 6-person groups)
      // T = 18.0 to 23.5s: hold at 1 (Step 5: assembled groups talking with speech bubbles)
      // T = 23.5 to 27.0s: ramp down to 0 (Step 6: smoothly dispersing back to wander)
      // T = 27.0 to 29.0s: 0 (freely wandering strangers, seamless return to 0s)
      const wc = sm(14.0, 18.0, T) * (1 - sm(23.5, 27.0, T));
      const ww = Math.max(0.25, 1 - wc * 0.75);

      const pull = 1 - Math.exp(-dt * 2.2);

      // Physics and Verification updates
      for (const p of P) {
        const a =
          Math.sin(p.x * 0.004 + now * 0.0003 + p.ph) +
          Math.cos(p.y * 0.005 - now * 0.00025 + p.ph * 2);
        p.vx = Math.max(-1.1, Math.min(1.1, p.vx * 0.96 + Math.cos(a * 1.6) * 0.07 * f));
        p.vy = Math.max(-0.5, Math.min(0.5, p.vy * 0.96 + Math.sin(a * 1.6) * 0.035 * f));

        p.x += p.vx * f * ww;
        p.y += p.vy * f * ww * 0.45;

        // Bounce horizontally within screen boundaries
        if (p.x < 18) {
          p.x = 18;
          p.vx = Math.abs(p.vx);
        }
        if (p.x > W - 18) {
          p.x = W - 18;
          p.vx = -Math.abs(p.vx);
        }

        // STRICT VERTICAL GROUND BOUNDS: Keep on promenade walkway (never fly into sky)
        if (p.y < walkMinY) {
          p.y = walkMinY;
          p.vy = Math.abs(p.vy) * 0.5;
        }
        if (p.y > walkMaxY) {
          p.y = walkMaxY;
          p.vy = -Math.abs(p.vy) * 0.5;
        }

        // Clustered positions on promenade (6 per group)
        const c = cents[p.cl];
        const rr = (12 + p.rad * 26) * sc;
        const cx = c.x + Math.cos(p.ang) * rr;
        const cy = c.y + Math.sin(p.ang) * rr * 0.28; // flattened perspective for ground plane

        // Pull towards 6-person group
        p.x += (cx - p.x) * pull * wc;
        p.y += (cy - p.y) * pull * wc;

        // Verification Triggering: only scheduled random people pop their check card (Step 2)
        if (p.popT > 0 && T >= p.popT && p.pop < 0) {
          p.pop = now;
        }

        // Verification progress: ramps up once popped, fades out when groups disperse (Step 6)
        if (p.pop > 0 && T < 23.5) {
          p.v = Math.min(1, p.v + dt * 2.2);
        } else if (T >= 23.5) {
          p.v = Math.max(0, p.v - dt * 1.5);
        }
      }

      // Clear canvas (transparent to let Delhi skyline show through)
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // Constellation Network Connections:
      // Active ONLY AFTER people get verified check (Step 3: starts at T = 10.5s)
      const linePhase = sm(10.5, 13.5, T) * (1 - sm(24.0, 26.5, T));
      const D = 120 * sc;
      ctx.lineWidth = 1.35;

      if (linePhase > 0.02) {
        for (let i = 0; i < P.length; i++) {
          const p = P[i];
          if (p.v < 0.15) continue; // Only verified connect

          for (let j = i + 1; j < P.length; j++) {
            const q = P[j];
            if (q.v < 0.15) continue; // Only verified connect

            const d = Math.hypot(p.x - q.x, p.y - q.y);
            if (d < D) {
              const baseAlpha = (1 - d / D) * 0.75;
              // Enhanced alpha as verified members assemble in their 6-person group
              const groupBonus = p.cl === q.cl ? (0.5 + wc * 0.5) : 0.35;
              const verifiedFactor = Math.min(p.v, q.v);

              ctx.strokeStyle = p.c;
              ctx.globalAlpha = Math.min(0.85, baseAlpha * groupBonus * verifiedFactor * linePhase);
              ctx.beginPath();
              ctx.moveTo(p.x, p.y - 6 * sc);
              ctx.lineTo(q.x, q.y - 6 * sc);
              ctx.stroke();
            }
          }
        }
      }

      ctx.globalAlpha = 1;

      // Render People
      const r = 6.6 * sc;
      const sortedP = [...P].sort((a, b) => a.y - b.y);

      for (const p of sortedP) {
        const bob = Math.sin(now * 0.004 + p.ph) * 1.0;

        // Soft ground contact shadow under each figure on the promenade walkway
        ctx.beginPath();
        ctx.ellipse(p.x, p.y + bob + r * 1.6, r * 1.25, r * 0.38, 0, 0, Math.PI * 2);
        ctx.fillStyle = isNight ? "rgba(0, 0, 0, 0.45)" : "rgba(0, 0, 0, 0.22)";
        ctx.fill();

        // The SVG figure itself: pure minimal black (day) / white (night)
        drawPerson(p.x, p.y + bob, r);

        // Render Floating Verification Card Badge over verified members (Step 2)
        if (p.pop > 0) {
          drawVerificationCard(p, now);
        }
      }

      // STEP 5: Hi / Hello Speech Bubbles APPEAR ONLY AFTER GROUPING (T = 18.0s to 24.5s)
      if (T >= 18.0 && T < 24.5) {
        if (now - lastSpawn > 800) {
          lastSpawn = now;
          // Spawn over members assembled in their groups
          const availableP = P[Math.floor(Math.random() * P.length)];
          if (availableP) {
            fx.push({
              x: availableP.x,
              y: availableP.y - 22 * sc,
              t: now,
              w: WORDS[Math.floor(Math.random() * WORDS.length)],
              personIndex: availableP.i,
            });
          }
        }
      }

      // Filter expired bubbles (duration: 1800ms)
      fx = fx.filter((e) => now - e.t < 1800);
      ctx.font = `700 ${Math.round(12 * sc)}px 'Manrope', system-ui, sans-serif`;
      ctx.textAlign = "center";

      for (const e of fx) {
        const t = (now - e.t) / 1800;
        const person = P.find((p) => p.i === e.personIndex);
        const curX = person ? person.x : e.x;
        const curY = (person ? person.y - 22 * sc : e.y) - t * 20 * sc;

        // Gentle ripple ring below bubble
        ctx.globalAlpha = (1 - t) * 0.5;
        ctx.strokeStyle = "#ffd166";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.ellipse(curX, curY + 11 * sc, t * 40 * sc, t * 12 * sc, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Clean white text bubble pill
        const w = ctx.measureText(e.w).width + 16;
        ctx.globalAlpha = Math.min(1, (1 - t) * 2.2);
        ctx.fillStyle = "rgba(255, 250, 240, 0.96)";
        ctx.beginPath();
        if ("roundRect" in ctx) {
          ctx.roundRect(curX - w / 2, curY - 13, w, 18, 9);
        } else {
          ctx.rect(curX - w / 2, curY - 13, w, 18);
        }
        ctx.fill();

        ctx.fillStyle = "#2a1636";
        ctx.fillText(e.w, curX, curY);
      }

      ctx.globalAlpha = 1;

      animId = requestAnimationFrame(frame);
    }

    animId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [isNight]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[260px] sm:h-[300px] md:h-[340px] lg:h-[380px] overflow-hidden select-none pointer-events-none"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
      />
    </div>
  );
}
