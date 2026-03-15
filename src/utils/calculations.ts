import type { WorkoutSession } from "../types/models";

export interface WorkoutTotals {
  totalSets: number;
  totalReps: number;
  totalWeight: number;
}

export function calculateWorkoutTotals(session: WorkoutSession): WorkoutTotals {
  let totalSets = 0;
  let totalReps = 0;
  let totalWeight = 0;

  for (const log of session.exerciseLogs) {
    for (const set of log.sets) {
      totalSets++;
      totalReps += set.reps;
      totalWeight += set.reps * set.weight;
    }
  }

  return { totalSets, totalReps, totalWeight };
}
