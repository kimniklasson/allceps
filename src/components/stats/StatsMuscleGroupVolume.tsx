import { useMemo, useState } from "react";
import type { WorkoutSession } from "../../types/models";
import { computeMuscleGroupVolume } from "../../utils/statistics";

interface Props {
  sessions: WorkoutSession[];
  userWeight: number;
}

const periods = [
  { label: "30 dagar", value: 30 as number | null },
  { label: "All tid", value: null as number | null },
];

export function StatsMuscleGroupVolume({ sessions, userWeight }: Props) {
  const [periodDays, setPeriodDays] = useState<number | null>(null);

  const result = useMemo(
    () => computeMuscleGroupVolume(sessions, userWeight, periodDays),
    [sessions, userWeight, periodDays]
  );

  if (!result.hasData) {
    return (
      <div className="flex flex-col gap-2">
        <span className="text-[12px] font-bold uppercase tracking-wider opacity-50">
          Reps per muskelgrupp
        </span>
        <div className="bg-card rounded-card p-4">
          <p className="text-[13px] opacity-50">
            Tilldela muskelgrupper till dina övningar för att se fördelningen.
          </p>
        </div>
      </div>
    );
  }

  const maxReps = result.groups[0]?.totalReps || 1;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-bold uppercase tracking-wider opacity-50">
          Reps per muskelgrupp
        </span>
        <div className="flex gap-1">
          {periods.map((p) => (
            <button
              key={p.label}
              onClick={() => setPeriodDays(p.value)}
              className={`text-[11px] px-2 py-0.5 rounded-full transition-opacity ${
                periodDays === p.value
                  ? "bg-white/10 opacity-100"
                  : "opacity-40"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-card p-4 flex flex-col gap-2.5">
        {result.groups.map((group, i) => {
          const widthPct = (group.totalReps / maxReps) * 100;
          const opacity = 1 - (i / Math.max(result.groups.length - 1, 1)) * 0.6;

          return (
            <div key={group.muscleGroupName} className="flex items-center gap-3">
              <span className="text-[13px] opacity-70 w-[90px] shrink-0 truncate">
                {group.muscleGroupName}
              </span>
              <div className="flex-1 h-3 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${widthPct}%`,
                    backgroundColor: "#FFD900",
                    opacity,
                    animationDelay: `${i * 0.05}s`,
                  }}
                />
              </div>
              <span className="text-[12px] tabular-nums opacity-50 shrink-0 text-right">
                {group.percentage}%
              </span>
            </div>
          );
        })}

      </div>
    </div>
  );
}
