import { useEffect, useRef } from "react";
import { useHistoryStore } from "../stores/useHistoryStore";
import { useCategoryStore } from "../stores/useCategoryStore";
import type { Category } from "../types/models";

/**
 * One-time migration: backfill muscle group data into old sessions
 * that were logged before muscle groups were assigned to exercises.
 */
export function useBackfillMuscleGroups() {
  const done = useRef(false);
  const { sessions, updateSession, loadSessions } = useHistoryStore();
  const { categories } = useCategoryStore();

  useEffect(() => {
    if (done.current || sessions.length === 0 || categories.length === 0) return;

    const exerciseMuscleMap = buildExerciseMuscleMap(categories);
    if (exerciseMuscleMap.size === 0) return;

    // Check if any session needs backfilling
    const needsBackfill = sessions.some((s) =>
      s.exerciseLogs.some(
        (log) =>
          (!log.muscleGroups || log.muscleGroups.length === 0) &&
          exerciseMuscleMap.has(log.exerciseId)
      )
    );

    if (!needsBackfill) {
      done.current = true;
      return;
    }

    done.current = true;

    (async () => {
      for (const session of sessions) {
        let changed = false;
        const updatedLogs = session.exerciseLogs.map((log) => {
          if (log.muscleGroups && log.muscleGroups.length > 0) return log;
          const mg = exerciseMuscleMap.get(log.exerciseId);
          if (!mg || mg.length === 0) return log;
          changed = true;
          return { ...log, muscleGroups: mg };
        });

        if (changed) {
          await updateSession({ ...session, exerciseLogs: updatedLogs });
        }
      }

      await loadSessions();
    })();
  }, [sessions, categories, updateSession, loadSessions]);
}

function buildExerciseMuscleMap(
  categories: Category[]
): Map<string, Array<{ name: string; percentage: number }>> {
  const map = new Map<string, Array<{ name: string; percentage: number }>>();
  for (const cat of categories) {
    for (const ex of cat.exercises) {
      if (ex.muscleGroups.length > 0) {
        map.set(
          ex.id,
          ex.muscleGroups.map((mg) => ({
            name: mg.muscleGroupName,
            percentage: mg.percentage,
          }))
        );
      }
    }
  }
  return map;
}
