import React, { useId } from "react";

export type AvatarBadgeVariant = "pink" | "gold" | "mint" | "ivory";

const VARIANT_CONFIG: Record<
  AvatarBadgeVariant,
  { stroke: string; glow: string; halo: string }
> = {
  pink: {
    stroke: "#f472b6",
    glow: "rgba(244, 114, 182, 0.7)",
    halo: "rgba(244, 114, 182, 0.22)",
  },
  gold: {
    stroke: "#fbbf24",
    glow: "rgba(251, 191, 36, 0.7)",
    halo: "rgba(251, 191, 36, 0.22)",
  },
  mint: {
    stroke: "#86efac",
    glow: "rgba(134, 239, 172, 0.7)",
    halo: "rgba(134, 239, 172, 0.22)",
  },
  ivory: {
    stroke: "#f8fafc",
    glow: "rgba(248, 250, 252, 0.7)",
    halo: "rgba(248, 250, 252, 0.22)",
  },
};

interface AvatarFigureSVGProps {
  variant?: AvatarBadgeVariant;
  className?: string;
  opacity?: number;
  showGroundShadow?: boolean;
}

/**
 * Circular Glowing Avatar Badge (matching user's reference image)
 * Features an outer glowing halo, crisp colored ring border,
 * dark translucent core, and centered user silhouette (head + shoulders).
 */
export function AvatarFigureSVG({
  variant = "gold",
  className = "w-full h-full",
  opacity = 1,
  showGroundShadow = false,
}: AvatarFigureSVGProps) {
  const clipId = useId();
  const config = VARIANT_CONFIG[variant] || VARIANT_CONFIG.gold;

  return (
    <div className={`relative ${className}`} style={{ opacity }}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full overflow-visible select-none pointer-events-none"
      >
        <defs>
          <clipPath id={clipId}>
            <circle cx="50" cy="50" r="38.5" />
          </clipPath>
        </defs>

        {/* Ambient Ground Shadow (optional for strolling promenade figures) */}
        {showGroundShadow && (
          <ellipse cx="50" cy="98" rx="24" ry="4" fill="#0f172a" opacity="0.32" />
        )}

        {/* Dynamic bobbing / floating group */}
        <g className="torso-bob">
          {/* 1. Luminous Outer Halo / Glow Ring */}
          <circle
            cx="50"
            cy="50"
            r="48"
            fill={config.halo}
            className="animate-pulse"
          />

          {/* 2. Crisp Outer Circular Border with Radial Core Backdrop */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="rgba(10, 15, 26, 0.85)"
            stroke={config.stroke}
            strokeWidth="3.2"
            style={{
              filter: `drop-shadow(0 0 7px ${config.glow})`,
            }}
          />

          {/* 3. User Silhouette (Clipped smoothly inside the circular ring) */}
          <g clipPath={`url(#${clipId})`}>
            {/* Circular Head */}
            <circle cx="50" cy="38" r="13.5" fill={config.stroke} />

            {/* Rounded Shoulder / Bust Curve */}
            <path
              d="M 21 86 C 21 64, 34 57, 50 57 C 66 57, 79 64, 79 86 Z"
              fill={config.stroke}
            />
          </g>
        </g>
      </svg>
    </div>
  );
}
