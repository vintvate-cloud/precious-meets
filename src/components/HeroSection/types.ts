import type { ReactNode } from "react";

export interface HeroSlide {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  location?: string;
}

export interface HeroSectionProps {
  /**
   * Array of curated photographs shown in the editorial showcase.
   */
  slides?: HeroSlide[];

  /**
   * Monumental typographic statement on the left flank.
   * @default "every"
   */
  leftFlankText?: ReactNode;

  /**
   * Monumental typographic statement on the right flank.
   * @default "matters."
   */
  rightFlankText?: ReactNode;

  /**
   * Minimal location or badge text at the top.
   * @default "DELHI NCR · 6 GUESTS ONLY"
   */
  kicker?: string;

  /**
   * Minimal single-line poetic subtitle.
   * @default "Curated dinners designed for meaningful human connections across Delhi NCR."
   */
  subtitle?: string;

  /**
   * Auto-advance interval in milliseconds (0 to disable auto-advance).
   * @default 6500
   */
  autoPlayInterval?: number;

  /**
   * CTA button label.
   * @default "Take the Quiz"
   */
  ctaText?: string;

  /**
   * CTA button target href.
   * @default "/quiz"
   */
  ctaHref?: string;

  /**
   * Optional custom container class name.
   */
  className?: string;
}
