import { useEffect, useMemo } from "react";
import { useHistoryStore } from "../stores/useHistoryStore";
import { useCategoryStore } from "../stores/useCategoryStore";
import { StatsPersonalRecords } from "../components/stats/StatsPersonalRecords";
import { StatsStreaks } from "../components/stats/StatsStreaks";
import { StatsSessionOverview } from "../components/stats/StatsSessionOverview";
import { StatsExerciseInsights } from "../components/stats/StatsExerciseInsights";
import * as stats from "../utils/statistics";

export function StatsPage() {
  const { sessions, loadSessions } = useHistoryStore();
  const { categories, loadCategories } = useCategoryStore();

  useEffect(() => {
    loadSessions();
    loadCategories();
  }, [loadSessions, loadCategories]);

  const prs = useMemo(() => stats.computeExercisePRs(sessions), [sessions]);
  const streaks = useMemo(() => stats.computeStreaks(sessions), [sessions]);
  const sessionStats = useMemo(() => stats.computeSessionStats(sessions), [sessions]);

  const allExercises = useMemo(() => {
    return categories.flatMap((c) => c.exercises.map((e) => ({ id: e.id, name: e.name })));
  }, [categories]);

  const insights = useMemo(
    () => stats.computeExerciseInsights(sessions, allExercises),
    [sessions, allExercises]
  );
  const isEmpty = sessions.length === 0;

  return (
    <div className="flex flex-col gap-10">
      {/* Page header */}
      <div className="flex flex-col items-center text-center">
        <span className="text-[20px] font-bold leading-[1.22]">Statistik</span>
        <span className="text-[20px] leading-[1.22] opacity-50">
          Dina framsteg och rekord
        </span>
      </div>

      {isEmpty ? (
        <p className="text-[15px] opacity-50 text-center pt-4">
          Inga träningspass ännu.
        </p>
      ) : (
        <>
          <StatsPersonalRecords prs={prs} />
          <StatsStreaks streaks={streaks} />
          <StatsSessionOverview stats={sessionStats} />
          <StatsExerciseInsights insights={insights} />
        </>
      )}
    </div>
  );
}
