import { useState, useMemo } from "react";
import type { WorkoutSession } from "../../types/models";
import type { ExercisePR } from "../../utils/statistics";
import { computeWeightProgression, computeRepsProgression, computeVolumeProgression } from "../../utils/statistics";
import { StatsLineChart } from "./StatsLineChart";
import { StatsVolumeBarChart } from "./StatsVolumeBarChart";

interface Props {
  sessions: WorkoutSession[];
  prs: ExercisePR[];
}

export function StatsProgressCharts({ sessions, prs }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Default to first exercise
  const activeId = selectedId || (prs.length > 0 ? prs[0].exerciseId : null);
  const activePr = prs.find((pr) => pr.exerciseId === activeId);

  const weightData = useMemo(() => {
    if (!activeId) return [];
    return computeWeightProgression(activeId, sessions);
  }, [activeId, sessions]);

  const repsData = useMemo(() => {
    if (!activeId || !activePr?.isBodyweight) return [];
    return computeRepsProgression(activeId, sessions);
  }, [activeId, sessions, activePr?.isBodyweight]);

  const volumeData = useMemo(() => computeVolumeProgression(sessions), [sessions]);

  // For bodyweight exercises, show reps chart; for weighted, show weight chart
  const showReps = activePr?.isBodyweight && repsData.length > 0;
  const lineData = showReps
    ? repsData.map((d) => ({ label: d.label, value: d.value }))
    : weightData.map((d) => ({ label: d.label, value: d.value }));

  return (
    <div className="flex flex-col gap-4">
      <span className="text-[12px] font-bold uppercase tracking-wider opacity-50">
        Framsteg
      </span>

      {/* Exercise pill selector */}
      {prs.length > 0 && (
        <div className="flex gap-2 overflow-x-auto -mx-8 px-8 pb-2 no-scrollbar">
          {prs.map((pr) => {
            const isActive = pr.exerciseId === activeId;
            return (
              <button
                key={pr.exerciseId}
                onClick={() => setSelectedId(pr.exerciseId)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors ${
                  isActive
                    ? "bg-black dark:bg-white text-white dark:text-black"
                    : "bg-black/5 dark:bg-white/10 opacity-60"
                }`}
              >
                {pr.exerciseName}
              </button>
            );
          })}
        </div>
      )}

      {/* Line chart — weight or reps progression */}
      {lineData.length > 0 && (
        <StatsLineChart
          key={activeId}
          data={lineData}
          unit={showReps ? "reps" : "kg"}
        />
      )}

      {lineData.length === 0 && activeId && (
        <div className="rounded-card border border-black/10 dark:border-white/10 p-4">
          <p className="text-[13px] opacity-50 text-center">Ingen progressionsdata ännu</p>
        </div>
      )}

      {/* Volume bar chart */}
      <StatsVolumeBarChart data={volumeData} />
    </div>
  );
}
