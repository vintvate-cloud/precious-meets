import React, { useEffect, useRef } from "react";

interface SummitAttendeesProps {
  isNight?: boolean;
}

const PAL = ["#ff9933", "#ffd166", "#2ec4b6", "#ff5d8f", "#7c9cff", "#4cc46a"];
const WORDS = ["Namaste", "Hi!", "Chai?", "Hello", "Kya haal?", "Welcome"];
const LOOP = 20; // 20-second perfectly seamless cycle with zero cut points

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
 * Grounded Promenade Walkway Animation:
 * - Strictly constrained to the bottom promenade walkway area (no floating in the sky/monuments)
 * - Proportional minimal black SVGs (never squashed or distorted)
 * - Roaming within a natural radius on the promenade
 * - Seamless loop: random wander -> speech bubbles -> 6-6 grouping -> dispersing
 */
export function SummitAttendees({ isNight = true }: SummitAttendeesProps) {
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
    const t0 = performance.now();

    // 4 cluster locations flanking the central promenade walkway
    const CF_DESKTOP = [0.16, 0.36, 0.64, 0.84];
    const CF_MOBILE = [0.26, 0.74];

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
            // Spawn each person within their roaming radius on the promenade walkway
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
            });
          }
        }
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
     * Minimal Black (#000000) matching PromenadeHumanFigure specification
     * Perfectly proportional circular head and semicircular dome bust (never squashed)
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

    function frame(now: number) {
      if (!ctx || !canvas) return;
      const dt = Math.min(0.05, (now - lastTime || 16) / 1000);
      lastTime = now;
      const f = dt * 60;

      // Promenade vertical bounds: strictly on the ground walkway
      const walkMinY = H * 0.64;
      const walkMaxY = H * 0.90;

      // Continuous loop time
      const T = (((now - t0) / 1000) * 1.0) % LOOP;

      // Grouping Weight (wc):
      // T = 0 to 5.5s: 0 (random wandering on the promenade)
      // T = 5.5 to 9.5s: ramp up to 1 (pulling into 6-person groups)
      // T = 9.5 to 13.5s: hold at 1 (connected 6-person clusters)
      // T = 13.5 to 17.5s: ramp down to 0 (smoothly dispersing back to wander)
      // T = 17.5 to 20s: 0 (wandering freely, seamless loop)
      const wc = sm(5.5, 9.5, T) * (1 - sm(13.5, 17.5, T));
      const ww = Math.max(0.25, 1 - wc * 0.75);

      const pull = 1 - Math.exp(-dt * 2.2);

      // Physics update: smooth grounded motion within promenade band
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
      }

      // Clear canvas (transparent to let Delhi skyline show through)
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // Constellation Network Connections
      const D = 110 * sc;
      ctx.lineWidth = 1.3;
      for (let i = 0; i < P.length; i++) {
        const p = P[i];
        for (let j = i + 1; j < P.length; j++) {
          const q = P[j];
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < D) {
            // Enhanced alpha when clustering in 6s
            const baseAlpha = (1 - d / D) * 0.7;
            const groupBonus = p.cl === q.cl ? (0.45 + wc * 0.45) : (0.2 + wc * 0.15);
            ctx.strokeStyle = p.c;
            ctx.globalAlpha = Math.min(0.85, baseAlpha * groupBonus);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y - 6 * sc);
            ctx.lineTo(q.x, q.y - 6 * sc);
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;

      // Render People (slightly increased size for optimal visibility on promenade)
      const r = 6.6 * sc;
      const sortedP = [...P].sort((a, b) => a.y - b.y);

      for (const p of sortedP) {
        const bob = Math.sin(now * 0.004 + p.ph) * 1.0;

        // Soft ground contact shadow under each figure on the promenade walkway
        ctx.beginPath();
        ctx.ellipse(p.x, p.y + bob + r * 1.6, r * 1.25, r * 0.38, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
        ctx.fill();

        // The SVG figure itself ALWAYS stays in minimal black (#000000), perfectly proportional without any outer circle
        drawPerson(p.x, p.y + bob, r);
      }

      // Greetings speech bubbles appearing over people on the promenade
      if (now - lastSpawn > 900) {
        lastSpawn = now;
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
