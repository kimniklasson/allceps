import { useMemo } from "react";
import type { WorkoutSession } from "../../types/models";

const MONTH_LABELS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
const CHART_HEIGHT = 80; // px

interface Props {
  sessions: WorkoutSession[];
}

export function WorkoutBarChart({ sessions }: Props) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed

  const { monthlyCounts, total } = useMemo(() => {
    const counts = new Array(12).fill(0);
    for (const session of sessions) {
      const d = new Date(session.startedAt);
      if (d.getFullYear() === currentYear) {
        counts[d.getMonth()]++;
      }
    }
    return { monthlyCounts: counts, total: counts.reduce((a, b) => a + b, 0) };
  }, [sessions, currentYear]);

  const maxCount = Math.max(...monthlyCounts, 1);

  return (
    <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-[#f5f5f5] dark:bg-[#1c1c1c] px-4 pt-4 pb-3">
      {/* Header */}
      <div className="flex justify-between items-baseline mb-4">
        <span className="text-[13px] font-medium opacity-50">{currentYear}</span>
        <span className="text-[13px] font-bold tracking-wide">TOTALT {total}</span>
      </div>

      {/* Bars */}
      <div className="flex items-end gap-[5px]" style={{ height: CHART_HEIGHT }}>
        {monthlyCounts.map((count, i) => {
          const isCurrent = i === currentMonth;
          const heightPct = count > 0 ? Math.max((count / maxCount) * 100, 8) : 0;

          return (
            <div key={i} className="flex-1 flex flex-col justify-end" style={{ height: "100%" }}>
              {count > 0 && (
                <div
                  className="rounded-t-[3px] w-full"
                  style={{
                    height: `${heightPct}%`,
                    background: isCurrent ? "#F5C800" : "rgba(128,128,128,0.55)",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Month labels */}
      <div className="flex gap-[5px] mt-2">
        {MONTH_LABELS.map((label, i) => (
          <div
            key={i}
            className="flex-1 text-center text-[11px]"
            style={{ opacity: i <= currentMonth ? 0.5 : 0.25 }}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
