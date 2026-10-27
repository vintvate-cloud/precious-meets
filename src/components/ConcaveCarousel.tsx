import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
  useMemo,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface ConcaveCarouselItem {
  src?: string;
  alt?: string;
  title?: string;
  subtitle?: string;
  href?: string;
  badge?: string;
  quote?: string;
  author?: string;
  role?: string;
  city?: string;
  rating?: number;
}

export interface ConcaveCarouselRef {
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
  play: () => void;
  pause: () => void;
}

export interface ConcaveCarouselProps {
  items: ConcaveCarouselItem[];
  startIndex?: number;
  aspect?: number; // Width divided by height of every panel (default: 1.25)
  size?: number; // Height of centered panel as fraction of container (default: 0.46)
  curvature?: number; // How strongly wall bends around viewer: 0 to 1 (default: 0.72)
  distance?: number; // Distance in panel heights (default: 4)
  tilt?: number; // Viewing angle in degrees (default: 0)
  gap?: number; // Space between panels in pixels (default: 16)
  radius?: number; // Corner radius in pixels (default: 14)
  reflection?: number; // Strength of floor reflection: 0 to 1 (default: 0.06)
  dim?: number; // Fading toward edges: 0 to 1 (default: 0.35)
  autoplay?: "drift" | "step" | "off"; // Autoplay mode (default: "drift")
  speed?: number; // Drift speed in panels per second (default: 0.16)
  interval?: number; // Seconds between steps for "step" autoplay (default: 4)
  snap?: boolean; // Snap to centered panel (default: true)
  inertia?: number; // Inertia carry factor: 0 to 1 (default: 0.5)
  pauseOnHover?: boolean; // Brake on hover (default: true)
  draggable?: boolean; // Allow drag and flick (default: true)
  wheel?: boolean; // Allow scroll wheel (default: true)
  captions?: boolean; // Show title & subtitle (default: true)
  controls?: boolean; // Show prev/next buttons and index (default: true)
  backgroundColor?: string; // Background color (default: "transparent")
  paused?: boolean; // Forced pause (default: false)
  dpr?: number;
  ariaLabel?: string;
  onIndexChange?: (index: number) => void;
  onSelect?: (index: number, item: ConcaveCarouselItem) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const ConcaveCarousel = forwardRef<ConcaveCarouselRef, ConcaveCarouselProps>(
  (
    {
      items = [],
      startIndex = 0,
      aspect = 1.25,
      size = 0.46,
      curvature = 0.72,
      distance = 4,
      tilt = 0,
      gap = 16,
      radius = 14,
      reflection = 0.06,
      dim = 0.35,
      autoplay = "drift",
      speed = 0.16,
      interval = 4,
      snap = false,
      inertia = 0.5,
      pauseOnHover = false,
      draggable = true,
      wheel = false,
      captions = true,
      controls = true,
      backgroundColor = "transparent",
      paused: forcedPaused = false,
      ariaLabel = "Concave carousel gallery",
      onIndexChange,
      onSelect,
      className = "",
      style = {},
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const count = items.length;

    // Current continuous position (can be fractional)
    const positionRef = useRef<number>(startIndex);
    const targetPositionRef = useRef<number>(startIndex);
    const velocityRef = useRef<number>(0);
    const isDraggingRef = useRef<boolean>(false);
    const dragStartXRef = useRef<number>(0);
    const dragStartTimeRef = useRef<number>(0);
    const lastDragXRef = useRef<number>(0);
    const isHoveredRef = useRef<boolean>(false);
    const lastTimeRef = useRef<number>(0);
    const stepTimerRef = useRef<number>(0);

    // React state for re-rendering UI elements (captions, active index)
    const [renderPos, setRenderPos] = useState<number>(startIndex);
    const [containerWidth, setContainerWidth] = useState<number>(1000);
    const [containerHeight, setContainerHeight] = useState<number>(540);
    const [isInternalPaused, setIsInternalPaused] = useState<boolean>(false);

    // Active centered item index (wrapped 0..count-1)
    const activeIndex = useMemo(() => {
      if (count === 0) return 0;
      const rounded = Math.round(renderPos);
      return ((rounded % count) + count) % count;
    }, [renderPos, count]);

    // Keep parent informed of index change
    const lastReportedIndexRef = useRef<number>(activeIndex);
    useEffect(() => {
      if (lastReportedIndexRef.current !== activeIndex) {
        lastReportedIndexRef.current = activeIndex;
        onIndexChange?.(activeIndex);
      }
    }, [activeIndex, onIndexChange]);

    // Resize observer to adapt dimensions dynamically
    useEffect(() => {
      if (!containerRef.current) return;
      const el = containerRef.current;

      const updateDimensions = () => {
        const rect = el.getBoundingClientRect();
        setContainerWidth(rect.width || 1000);
        setContainerHeight(Math.max(rect.height || 540, 420));
      };

      updateDimensions();
      const observer = new ResizeObserver(updateDimensions);
      observer.observe(el);
      return () => observer.disconnect();
    }, []);

    // Dimensions for centered panel
    const panelHeight = Math.max(containerHeight * size, 220);
    const panelWidth = panelHeight * aspect;

    // Linear step between panels along the wall
    const stepX = panelWidth + gap;
    // 3D Perspective and Concave Curvature calculations
    const perspectivePx = Math.max(panelHeight * distance, 950);
    // Cylinder radius based on curvature: spreads panels comfortably across full screen width
    const cylinderRadius = Math.max(panelWidth * (2.8 / Math.max(curvature, 0.2)), 950);
    // Angular step between panels in radians
    const angleStepRad = stepX / cylinderRadius;
    const angleStepDeg = (angleStepRad * 180) / Math.PI;

    // Imperative ref methods
    useImperativeHandle(ref, () => ({
      next: () => {
        targetPositionRef.current = Math.round(targetPositionRef.current + 1);
      },
      prev: () => {
        targetPositionRef.current = Math.round(targetPositionRef.current - 1);
      },
      goTo: (idx: number) => {
        const currentWrapped = ((Math.round(positionRef.current) % count) + count) % count;
        let delta = idx - currentWrapped;
        if (delta > count / 2) delta -= count;
        if (delta < -count / 2) delta += count;
        targetPositionRef.current = positionRef.current + delta;
      },
      play: () => setIsInternalPaused(false),
      pause: () => setIsInternalPaused(true),
    }));

    // Animation & Physics Loop
    useEffect(() => {
      let animId: number;
      const friction = 0.88;
      const springK = 0.14;

      const animate = (currentTime: number) => {
        if (!lastTimeRef.current) lastTimeRef.current = currentTime;
        const deltaSec = Math.min((currentTime - lastTimeRef.current) / 1000, 0.1);
        lastTimeRef.current = currentTime;

        const isPaused = forcedPaused || isInternalPaused || (pauseOnHover && isHoveredRef.current);

        if (!isDraggingRef.current) {
          if (!isPaused && count > 0 && autoplay === "drift") {
            const diff = targetPositionRef.current - positionRef.current;
            if (Math.abs(diff) > 0.05) {
              // Smooth ease toward clicked prev/next target
              velocityRef.current += diff * 0.12;
              velocityRef.current *= 0.88;
              positionRef.current += velocityRef.current;
            } else {
              // 100% consistent, steady, uninterrupted drift
              positionRef.current += speed * deltaSec;
              targetPositionRef.current = positionRef.current;
            }
          } else if (!isPaused && count > 0 && autoplay === "step") {
            stepTimerRef.current += deltaSec;
            if (stepTimerRef.current >= interval) {
              stepTimerRef.current = 0;
              targetPositionRef.current = Math.round(targetPositionRef.current + (speed >= 0 ? 1 : -1));
            }
            const diff = targetPositionRef.current - positionRef.current;
            velocityRef.current += diff * springK;
            velocityRef.current *= friction;
            positionRef.current += velocityRef.current;
          } else {
            if (snap) {
              const diff = targetPositionRef.current - positionRef.current;
              velocityRef.current += diff * springK;
              velocityRef.current *= friction;
              positionRef.current += velocityRef.current;
            } else {
              velocityRef.current *= friction * inertia;
              positionRef.current += velocityRef.current;
              targetPositionRef.current = positionRef.current;
            }
          }
        }

        setRenderPos(positionRef.current);
        animId = requestAnimationFrame(animate);
      };

      animId = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animId);
    }, [autoplay, speed, interval, snap, inertia, pauseOnHover, forcedPaused, isInternalPaused, count]);

    // Drag, Swipe & Pointer Interaction Handlers
    const handlePointerDown = (e: React.PointerEvent) => {
      if (!draggable) return;
      isDraggingRef.current = true;
      dragStartXRef.current = e.clientX;
      dragStartTimeRef.current = performance.now();
      lastDragXRef.current = e.clientX;
      velocityRef.current = 0;
      (e.target as HTMLElement)?.setPointerCapture?.(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
      if (!isDraggingRef.current) return;
      const currentX = e.clientX;
      const deltaPx = currentX - lastDragXRef.current;
      lastDragXRef.current = currentX;

      // Sensitivity: panel width corresponds to 1.0 unit of position
      const posDelta = -deltaPx / (panelWidth * 0.95);
      positionRef.current += posDelta;
      targetPositionRef.current = positionRef.current;
    };

    const handlePointerUp = (e: React.PointerEvent) => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      const totalDist = e.clientX - dragStartXRef.current;
      const totalTime = Math.max(performance.now() - dragStartTimeRef.current, 1);
      const flickVelocity = -(totalDist / totalTime) * 0.12;

      if (snap) {
        targetPositionRef.current = Math.round(positionRef.current + flickVelocity * 3.5);
      } else {
        velocityRef.current = flickVelocity;
      }
    };

    // Scroll Wheel Interaction
    const handleWheel = useCallback(
      (e: React.WheelEvent) => {
        if (!wheel) return;
        const delta = Math.sign(e.deltaY || e.deltaX);
        if (delta !== 0) {
          e.preventDefault();
          targetPositionRef.current = Math.round(targetPositionRef.current + delta);
        }
      },
      [wheel]
    );

    // Keyboard Navigation (Arrow Keys & Space)
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "ArrowLeft") {
          targetPositionRef.current = Math.round(targetPositionRef.current - 1);
        } else if (e.key === "ArrowRight") {
          targetPositionRef.current = Math.round(targetPositionRef.current + 1);
        } else if (e.key === " ") {
          e.preventDefault();
          setIsInternalPaused((p) => !p);
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [forcedPaused]);

    if (count === 0) return null;

    // How many panels are needed on each side to reach past both screen borders
    const halfWidth = containerWidth / 2;
    const panelsNeeded = Math.ceil((halfWidth + panelWidth) / stepX) + 1;
    const visibleWindow = Math.min(Math.max(panelsNeeded, 3), 6);

    const centerPos = renderPos;
    const minK = Math.floor(centerPos - visibleWindow);
    const maxK = Math.ceil(centerPos + visibleWindow);

    const renderedPanels = [];
    for (let k = minK; k <= maxK; k++) {
      const itemIndex = ((k % count) + count) % count;
      const item = items[itemIndex];
      const delta = k - centerPos; // distance from center in panel units

      // Cylindrical Concave Curve Math:
      const angleRad = (delta * stepX) / cylinderRadius;
      const angleDeg = (angleRad * 180) / Math.PI;

      // X coordinate along cylinder arc (strictly increases with delta)
      const x = cylinderRadius * Math.sin(angleRad);

      // Only skip if panel has moved completely outside the screen borders by more than its full width
      if (Math.abs(x) > halfWidth + panelWidth) {
        continue;
      }

      // Inward concave curve: side panels come closer to viewer (+Z in perspective)
      const z = cylinderRadius * (1 - Math.cos(angleRad)) * 0.75;
      // Rotation around Y: left panels face inward to right, right panels face inward to left
      const rotateY = -angleDeg;

      // Dimming falloff: gentle dimming toward edges (default dim 0.35 = 65% opacity/brightness at extreme borders)
      // Images remain clearly visible and vibrant right up to both borders!
      const normalizedDist = Math.min(Math.abs(x) / (halfWidth + 1), 1.0);
      const opacity = Math.max(0.65, 1 - dim * normalizedDist);
      const zIndex = Math.round(100 - Math.abs(delta) * 10);
      const isCentered = Math.abs(delta) < 0.45;

      renderedPanels.push(
        <div
          key={`panel-${k}`}
          onClick={() => {
            if (isCentered) {
              onSelect?.(itemIndex, item);
              if (item.href) window.location.href = item.href;
            } else {
              targetPositionRef.current = k;
            }
          }}
          style={{
            position: "absolute",
            width: `${panelWidth}px`,
            height: `${panelHeight}px`,
            left: `calc(50% - ${panelWidth / 2}px)`,
            top: captions || controls ? `calc(35% - ${panelHeight / 2}px)` : `calc(36% - ${panelHeight / 2}px)`,
            transform: `translate3d(${x}px, 0px, ${z}px) rotateY(${rotateY}deg) rotateX(${tilt}deg)`,
            transformOrigin: "center center",
            zIndex,
            opacity,
            borderRadius: `${radius}px`,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transition: isDraggingRef.current
              ? "none"
              : "opacity 0.25s ease-out",
          }}
          className="group/panel select-none overflow-visible cursor-pointer"
        >
          {/* Main Card Surface - Testimonial Card or Artwork */}
          <div
            style={{
              borderRadius: `${radius}px`,
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
            className={`relative size-full overflow-hidden ${
              item.quote
                ? "bg-gradient-to-br from-[#1C2016] via-[#13160F] to-[#0C0E0A] border border-white/10 p-6 sm:p-7 flex flex-col justify-between"
                : "bg-neutral-900 border border-white/10"
            } shadow-[0_16px_36px_rgba(0,0,0,0.6)] transition-all duration-300`}
          >
            {item.quote ? (
              <>
                {/* Top Row: Stars + Quote Glyph */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-ochre text-xs sm:text-sm">
                    {"★".repeat(item.rating || 5)}
                  </div>
                  <span className="font-display italic text-3xl sm:text-4xl text-ochre/30 select-none leading-none">
                    “
                  </span>
                </div>

                {/* Middle: Testimonial Quote */}
                <p className="font-sans text-xs sm:text-sm md:text-[14px] leading-relaxed text-ivory/95 font-light my-auto line-clamp-4 select-none">
                  “{item.quote}”
                </p>

                {/* Bottom: Member Profile */}
                <div className="flex items-center gap-3 pt-3.5 border-t border-white/10 mt-auto">
                  <div className="size-9 rounded-full bg-ochre/15 border border-ochre/30 flex items-center justify-center text-ochre font-mono font-semibold text-xs shrink-0 select-none">
                    {item.author
                      ? item.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                      : "PM"}
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <h4 className="font-sans font-semibold text-xs sm:text-sm text-ivory truncate select-none">
                      {item.author}
                    </h4>
                    {item.role && (
                      <p className="font-sans text-[11px] text-ivory/60 truncate select-none">
                        {item.role}
                      </p>
                    )}
                  </div>
                </div>
              </>
            ) : item.src ? (
              <img
                src={item.src}
                alt={item.alt || item.title || `Gallery panel ${itemIndex + 1}`}
                loading="lazy"
                draggable={false}
                className="size-full object-cover transition-transform duration-700 group-hover/panel:scale-105"
              />
            ) : null}
          </div>

          {/* Floor Reflection Underneath */}
          {reflection > 0 && item.src && (
            <div
              style={{
                position: "absolute",
                top: `${panelHeight + 8}px`,
                left: 0,
                width: `${panelWidth}px`,
                height: `${panelHeight * 0.45}px`,
                borderRadius: `${radius}px`,
                transform: "scaleY(-1)",
                opacity: reflection * opacity,
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                maskImage:
                  "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, transparent 80%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, transparent 80%)",
                filter: "blur(2px)",
                pointerEvents: "none",
              }}
              className="overflow-hidden"
            >
              <img
                src={item.src}
                alt=""
                aria-hidden="true"
                draggable={false}
                className="size-full object-cover"
              />
            </div>
          )}
        </div>
      );
    }

    const currentItem = items[activeIndex];

    return (
      <div
        ref={containerRef}
        role="region"
        aria-label={ariaLabel}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onMouseEnter={() => {
          isHoveredRef.current = true;
        }}
        onMouseLeave={() => {
          isHoveredRef.current = false;
        }}
        style={{
          backgroundColor,
          minHeight: "440px",
          height: `${containerHeight}px`,
          ...style,
        }}
        className={`relative w-full overflow-hidden select-none cursor-grab active:cursor-grabbing ${className}`}
      >
        {/* 3D Concave Perspective Stage */}
        <div
          style={{
            perspective: `${perspectivePx}px`,
            transformStyle: "preserve-3d",
          }}
          className="relative size-full pointer-events-auto"
        >
          {renderedPanels}
        </div>

        {/* Captions Display (Centred panel title and subtitle exactly as in screenshot) */}
        {captions && currentItem && (
          <div className="pointer-events-none absolute inset-x-0 bottom-14 sm:bottom-16 flex flex-col items-center justify-center text-center px-4 z-40 transition-opacity duration-300">
            <h3 className="font-sans font-semibold text-base sm:text-lg text-white tracking-tight drop-shadow-sm">
              {currentItem.title}
            </h3>
            {currentItem.subtitle && (
              <p className="font-sans text-xs sm:text-sm text-neutral-400 max-w-md mt-0.5 font-normal tracking-normal">
                {currentItem.subtitle}
              </p>
            )}
          </div>
        )}

        {/* Controls Bar: <  06 / 08  > */}
        {controls && (
          <div className="absolute inset-x-0 bottom-4 sm:bottom-5 flex items-center justify-center gap-3 z-50 pointer-events-auto">
            {/* Previous Button */}
            <button
              type="button"
              onClick={() => {
                targetPositionRef.current = Math.round(targetPositionRef.current - 1);
              }}
              aria-label="Previous image"
              className="flex size-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/90 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="size-4" />
            </button>

            {/* Numeric Counter: e.g. 06 / 08 */}
            <span className="font-mono text-xs sm:text-sm text-white/80 font-medium px-2 tracking-wider select-none">
              {String(activeIndex + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </span>

            {/* Next Button */}
            <button
              type="button"
              onClick={() => {
                targetPositionRef.current = Math.round(targetPositionRef.current + 1);
              }}
              aria-label="Next image"
              className="flex size-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/90 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        )}
      </div>
    );
  }
);

ConcaveCarousel.displayName = "ConcaveCarousel";
export default ConcaveCarousel;
