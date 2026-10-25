import { useEffect, useRef } from "react";
import gsap from "gsap";

interface UseAttendeeLifeEngineProps {
  seatIndex: number;
  gender: "man" | "woman";
  isFrontRow?: boolean;
}

/**
 * Biometric Human Life-Engine Hook (GSAP)
 *
 * Implements real-life biomechanics for seated dinner guests:
 * 1. Asynchronous Breathing: 3.6s - 4.4s organic ribcage/clavicle rise with
 *    unique phase offsets per seat so no two people breathe in sync.
 * 2. Cervical Lag: The head lags slightly behind the chest during respiration.
 * 3. Conversational Micro-Gestures: Periodic thoughtful listening tilts,
 *    subtle listening nods, and cross-table conversational focus.
 * 4. Micro-Weight Shifts: Settling into chair posture every 18–25 seconds.
 * 5. Pauses: Natural stretches of calm stillness to avoid fidgety/cringe motion.
 */
export function useAttendeeLifeEngine({
  seatIndex,
  gender,
  isFrontRow = false,
}: UseAttendeeLifeEngineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<SVGGElement>(null);
  const torsoRef = useRef<SVGGElement>(null);

  useEffect(() => {
    // Respect user's accessibility preferences
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    if (!containerRef.current || !headRef.current || !torsoRef.current) return;

    const ctx = gsap.context(() => {
      // Deterministic pseudo-random seed based on seatIndex
      const seed = ((seatIndex * 137.5) % 100) / 100;
      const breathDuration = 3.6 + (seatIndex % 4) * 0.28 + seed * 0.2;
      const breathDelay = (seatIndex * 0.72) % 3.0;

      // -------------------------------------------------------------
      // 1. BIOMETRIC BREATHING (Subtle Torso / Shoulder Expansion)
      // -------------------------------------------------------------
      gsap.to(torsoRef.current, {
        y: -1.4,
        scaleX: 1.008,
        scaleY: 1.004,
        transformOrigin: "50% 90%",
        duration: breathDuration * 0.45,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: breathDelay,
      });

      // -------------------------------------------------------------
      // 2. CERVICAL LAG (Head follows chest with organic micro-delay)
      // -------------------------------------------------------------
      gsap.to(headRef.current, {
        y: -1.0,
        transformOrigin: "50% 88%",
        duration: breathDuration * 0.45,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: breathDelay + 0.12, // Natural delay between diaphragm and neck
      });

      // -------------------------------------------------------------
      // 3. CONVERSATIONAL MICRO-GESTURES & CROSS-TABLE LISTENING
      // -------------------------------------------------------------
      // Alternate tilt directions to match conversational partners across table
      const tiltDirection = seatIndex % 2 === 0 ? 1 : -1;
      const tiltAngle = tiltDirection * (1.8 + (seatIndex % 3) * 0.7);

      const conversationTl = gsap.timeline({
        repeat: -1,
        repeatDelay: 6 + (seatIndex * 1.8) % 8, // Non-uniform idle pauses
        delay: 1.5 + (seatIndex * 0.85) % 4,
      });

      conversationTl
        // Step A: Thoughtful listening tilt toward conversation partner
        .to(headRef.current, {
          rotation: tiltAngle,
          transformOrigin: "50% 90%",
          duration: 1.4,
          ease: "power2.out",
        })
        // Step B: Gentle attentive pause while listening (2 seconds of stillness)
        .to({}, { duration: 2.2 })
        // Step C: Subtle two-stage listening nod
        .to(headRef.current, {
          y: "+=1.5",
          duration: 0.4,
          ease: "sine.out",
        })
        .to(headRef.current, {
          y: "-=1.5",
          duration: 0.55,
          ease: "sine.inOut",
        })
        // Step D: Another brief stillness
        .to({}, { duration: 1.8 })
        // Step E: Return gently to neutral resting posture
        .to(headRef.current, {
          rotation: 0,
          duration: 1.6,
          ease: "sine.inOut",
        });

      // -------------------------------------------------------------
      // 4. PERIODIC POSTURE SETTLING / WEIGHT SHIFT (Every 18 - 26s)
      // -------------------------------------------------------------
      const shiftX = (seatIndex % 2 === 0 ? 1 : -1) * (0.8 + (seatIndex % 2) * 0.4);
      const shiftRotate = (seatIndex % 2 === 0 ? 0.4 : -0.4);

      gsap.to(containerRef.current, {
        x: shiftX,
        rotation: shiftRotate,
        transformOrigin: "50% 100%",
        duration: 3.0,
        repeat: -1,
        yoyo: true,
        repeatDelay: 17 + (seatIndex * 2.3) % 10,
        ease: "power1.inOut",
        delay: 3 + (seatIndex * 1.4) % 6,
      });
    }, containerRef);

    return () => ctx.revert();
  }, [seatIndex, gender, isFrontRow]);

  return { containerRef, headRef, torsoRef };
}
