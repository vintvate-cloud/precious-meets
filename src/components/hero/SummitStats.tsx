import React, { useEffect, useState } from "react";

interface StatItem {
  target: number;
  suffix?: string;
  label: string;
}

const statsData: StatItem[] = [
  { target: 4, suffix: "", label: "DAYS" },
  { target: 6, suffix: "", label: "TRACKS" },
  { target: 250, suffix: "+", label: "SESSIONS" },
  { target: 100, suffix: "+", label: "PARTNERS" },
];

export function SummitStats({ isNight = false }: { isNight?: boolean }) {
  const [counts, setCounts] = useState<number[]>([0, 0, 0, 0]);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1800; // 1.8s countup

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);

      setCounts(statsData.map((item) => Math.round(item.target * eased)));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    const animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="relative z-30 w-full max-w-4xl mx-auto px-4 sm:px-6 py-1 sm:py-1.5">
      <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center select-none">
        {statsData.map((stat, idx) => (
          <div
            key={stat.label}
            className="flex flex-col items-center justify-center group transition-transform duration-300 hover:-translate-y-0.5"
          >
            {/* Monumental Number */}
            <span
              className={`font-black tracking-tight text-lg sm:text-2xl md:text-3xl lg:text-4xl transition-colors duration-500 ${
                isNight ? "text-white" : "text-slate-900"
              }`}
            >
              {counts[idx]}
              {stat.suffix}
            </span>

            {/* Label Underneath */}
            <span
              className={`font-bold tracking-widest text-[9px] sm:text-[10px] md:text-xs uppercase mt-0.5 transition-colors duration-500 ${
                isNight ? "text-sky-400" : "text-slate-700"
              }`}
            >
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
