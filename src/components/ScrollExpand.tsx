import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import tableStill from "@/assets/table-still.png.asset.json";

/**
 * Pinned scroll-expand: a small rounded capsule photo grows to fill the
 * viewport while the headline halves part to either side.
 */
export function ScrollExpand() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set("[data-frame]", { width: "100vw", height: "100vh", borderRadius: 0 });
        gsap.set("[data-overlay]", { opacity: 1 });
        return;
      }
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
        },
      });
      tl.fromTo(
        "[data-frame]",
        { width: "min(38vw, 520px)", height: "min(26vw, 340px)", borderRadius: "999px" },
        { width: "100vw", height: "100vh", borderRadius: "0px", ease: "power2.inOut" },
        0,
      )
        .fromTo("[data-img]", { scale: 1.35 }, { scale: 1, ease: "power2.inOut" }, 0)
        .to("[data-left]", { xPercent: -120, opacity: 0, ease: "power2.in" }, 0)
        .to("[data-right]", { xPercent: 120, opacity: 0, ease: "power2.in" }, 0)
        .fromTo("[data-overlay]", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.35 }, 0.7);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="philosophy" className="relative h-[320vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 z-10 flex items-center justify-between px-[4vw] font-display text-[13vw] leading-none md:text-[10vw]">
          <span data-left>Every</span>
          <span data-right className="italic text-burgundy">meet</span>
        </div>
        <div data-frame className="relative z-0 overflow-hidden" style={{ width: "min(38vw,520px)", height: "min(26vw,340px)", borderRadius: 999 }}>
          <img
            data-img
            src={tableStill.url}
            alt="A dark green table set with a half-finished plate, an olive, a glass of wine and a burgundy calla lily"
            className="absolute inset-0 size-full object-cover"
            loading="lazy"
          />
          <div data-overlay className="absolute inset-0 flex flex-col justify-end p-[6vw] text-ivory opacity-0">
            <p className="label-mono mb-6 text-ochre">The Precious Meets promise</p>
            <h2 className="max-w-4xl font-display text-6xl leading-[0.95] md:text-8xl">
              Every meet <em className="text-ochre">matters.</em>
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed opacity-85">
              A table laid with care, a seat held for you, and an evening that might change who you know.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
