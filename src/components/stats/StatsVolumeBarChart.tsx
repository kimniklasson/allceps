import { useState, useEffect, useRef } from "react";
import type { MonthlyPoint } from "../../utils/statistics";
import { formatKg } from "../../utils/formatNumber";

interface Props {
  data: MonthlyPoint[];
}

const CHART_HEIGHT = 88;

export function StatsVolumeBarChart({ data }: Props) {
  const [tooltip, setTooltip] = useState<number | null>(null);
  const [animate, setAnimate] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const maxValue = Math.max(...data.map((d) => d.value), 1);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timer);
  }, [data]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setTooltip(null);
      }
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, []);

  if (data.length === 0) {
    return (
      <div className="rounded-card border border-black/10 dark:border-white/10 p-4">
        <p className="text-[13px] opacity-50 text-center">Ingen data ännu</p>
      </div>
    );
  }

  return (
    <div ref={containerRef}>
      <div className="rounded-card border border-black/10 dark:border-white/10 px-4 pt-4 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-baseline mb-4">
          <span className="text-[13px] font-medium opacity-50">Volym/månad</span>
          <span className="text-[13px] font-bold tracking-wide">
            {formatKg(data.reduce((sum, d) => sum + d.value, 0))}
          </span>
        </div>

        {/* Bars */}
        <div className="flex items-end gap-[5px]" style={{ height: CHART_HEIGHT }}>
          {data.map((d, i) => {
            const isCurrent = d.monthKey === currentMonthKey;
            const heightPct = d.value > 0 ? Math.max((d.value / maxValue) * 100, 6) : 0;
            const isSelected = tooltip === i;

            return (
              <div
                key={d.monthKey}
                className="relative flex-1 flex flex-col justify-end h-full cursor-pointer"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  setTooltip(isSelected ? null : i);
                }}
              >
                {/* Tooltip */}
                {isSelected && (
                  <div className="absolute bottom-[calc(100%+6px)] left-1/2 -translate-x-1/2 z-10
                    bg-black dark:bg-white text-white dark:text-black
                    text-[11px] font-semibold px-[7px] py-[3px] rounded-lg whitespace-nowrap
                    shadow-sm pointer-events-none">
                    {formatKg(d.value)}
                    <div className="absolute top-full left-1/2 -translate-x-1/2
                      border-4 border-transparent border-t-black dark:border-t-white" />
                  </div>
                )}

                {/* Bar */}
                <div
                  className="rounded-t-[3px] w-full transition-opacity duration-150"
                  style={{
                    height: animate ? `${heightPct}%` : "0%",
                    background: isCurrent ? "#F5C800" : "rgba(128,128,128,0.55)",
                    opacity: isSelected ? 0.75 : 1,
                    transition: `height 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.03}s, opacity 0.15s`,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Month labels */}
      <div className="flex gap-[5px] mt-2 px-4">
        {data.map((d) => (
          <div
            key={d.monthKey}
            className="flex-1 text-center text-[11px]"
            style={{ opacity: d.monthKey <= currentMonthKey ? 0.5 : 0.25 }}
          >
            {d.label}
          </div>
        ))}
      </div>
    </div>
  );
}
