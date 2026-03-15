export interface Category {
  id: string;
  name: string;
  exercises: Exercise[];
  createdAt: string;
  sortOrder: number;
}

export interface Exercise {
  id: string;
  categoryId: string;
  name: string;
  baseReps: number;
  baseWeight: number;
  isBodyweight: boolean;
  sortOrder: number;
}

export interface WorkoutSet {
  setNumber: number;
  reps: number;
  weight: number;
  completedAt: string;
}

export interface ExerciseLog {
  exerciseId: string;
  exerciseName: string;
  isBodyweight: boolean;
  sets: WorkoutSet[];
}

export interface WorkoutSession {
  id: string;
  categoryId: string;
  categoryName: string;
  startedAt: string;
  finishedAt: string | null;
  pausedDuration: number;
  exerciseLogs: ExerciseLog[];
  status: "active" | "completed";
}

/** Temporary per-exercise adjustments during an active session */
export interface ExerciseAdjustment {
  exerciseId: string;
  currentReps: number;
  currentWeight: number;
}
