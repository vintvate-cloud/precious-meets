import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "burgundy" | "ink" | "ivory" | "forest";

const tones: Record<Tone, { shell: string; dot: string }> = {
  burgundy: { shell: "bg-burgundy text-ivory hover:bg-ink", dot: "bg-ivory text-burgundy" },
  ink: { shell: "bg-ink text-ivory hover:bg-burgundy", dot: "bg-ivory text-ink" },
  forest: { shell: "bg-forest text-ivory hover:bg-ink", dot: "bg-ivory text-forest" },
  ivory: { shell: "bg-ivory text-ink hover:bg-ochre", dot: "bg-ink text-ivory" },
};

export function CtaButton({
  children,
  href = "#meets",
  tone = "burgundy",
  className,
}: {
  children: React.ReactNode;
  href?: string;
  tone?: Tone;
  className?: string;
}) {
  const t = tones[tone];
  return (
    <a
      href={href}
      className={cn(
        "group inline-flex items-center gap-4 rounded-full py-2 pl-7 pr-2 label-mono transition-colors duration-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring active:scale-[0.98]",
        t.shell,
        className,
      )}
    >
      <span className="transition-transform duration-500 group-hover:translate-x-1">{children}</span>
      <span
        className={cn(
          "grid size-11 place-items-center overflow-hidden rounded-full transition-transform duration-500 group-hover:translate-x-1",
          t.dot,
        )}
      >
        <ArrowRight className="size-4 transition-transform duration-500 group-hover:-rotate-45" />
      </span>
    </a>
  );
}
