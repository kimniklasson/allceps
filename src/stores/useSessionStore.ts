import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  WorkoutSession,
  ExerciseAdjustment,
} from "../types/models";
import { sessionRepository } from "../data/repositories/sessionRepository";

interface SessionState {
  /** The currently active workout session, or null */
  activeSession: WorkoutSession | null;
  /** Per-exercise temporary reps/weight adjustments */
  adjustments: ExerciseAdjustment[];

  // Timer state (persisted for refresh survival)
  isRunning: boolean;
  isPaused: boolean;
  startTimestamp: number | null;
  pausedDuration: number;
  pauseStartedAt: number | null;

  // Actions
  startSession: (categoryId: string, categoryName: string) => void;
  logSet: (
    exerciseId: string,
    exerciseName: string,
    isBodyweight: boolean,
    reps: number,
    weight: number
  ) => void;
  togglePause: () => void;
  finishSession: () => WorkoutSession | null;
  cancelSession: () => void;

  // Adjustment helpers
  getAdjustment: (exerciseId: string, baseReps: number, baseWeight: number) => ExerciseAdjustment;
  setAdjustment: (exerciseId: string, reps: number, weight: number) => void;

  // Helpers
  getExerciseSetCount: (exerciseId: string) => number;
  hasActiveSession: () => boolean;
  isSessionForCategory: (categoryId: string) => boolean;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      activeSession: null,
      adjustments: [],
      isRunning: false,
      isPaused: false,
      startTimestamp: null,
      pausedDuration: 0,
      pauseStartedAt: null,

      startSession: (categoryId, categoryName) => {
        const session: WorkoutSession = {
          id: crypto.randomUUID(),
          categoryId,
          categoryName,
          startedAt: new Date().toISOString(),
          finishedAt: null,
          pausedDuration: 0,
          exerciseLogs: [],
          status: "active",
        };
        sessionRepository.save(session);
        set({
          activeSession: session,
          adjustments: [],
          isRunning: true,
          isPaused: false,
          startTimestamp: Date.now(),
          pausedDuration: 0,
          pauseStartedAt: null,
        });
      },

      logSet: (exerciseId, exerciseName, isBodyweight, reps, weight) => {
        const { activeSession } = get();
        if (!activeSession) return;

        const updatedLogs = [...activeSession.exerciseLogs];
        let exerciseLog = updatedLogs.find((l) => l.exerciseId === exerciseId);

        if (!exerciseLog) {
          exerciseLog = {
            exerciseId,
            exerciseName,
            isBodyweight,
            sets: [],
          };
          updatedLogs.push(exerciseLog);
        }

        exerciseLog.sets.push({
          setNumber: exerciseLog.sets.length + 1,
          reps,
          weight,
          completedAt: new Date().toISOString(),
        });

        const updatedSession = { ...activeSession, exerciseLogs: updatedLogs };
        sessionRepository.save(updatedSession);
        set({ activeSession: updatedSession });
      },

      togglePause: () => {
        const { isPaused, pauseStartedAt, pausedDuration } = get();
        if (isPaused && pauseStartedAt) {
          // Resume
          const additionalPause = Date.now() - pauseStartedAt;
          set({
            isPaused: false,
            pauseStartedAt: null,
            pausedDuration: pausedDuration + additionalPause,
          });
        } else {
          // Pause
          set({
            isPaused: true,
            pauseStartedAt: Date.now(),
          });
        }
      },

      finishSession: () => {
        const { activeSession, isPaused, pauseStartedAt, pausedDuration } = get();
        if (!activeSession) return null;

        // Account for any ongoing pause
        let totalPaused = pausedDuration;
        if (isPaused && pauseStartedAt) {
          totalPaused += Date.now() - pauseStartedAt;
        }

        const finishedSession: WorkoutSession = {
          ...activeSession,
          finishedAt: new Date().toISOString(),
          pausedDuration: totalPaused,
          status: "completed",
        };
        sessionRepository.save(finishedSession);

        set({
          activeSession: null,
          adjustments: [],
          isRunning: false,
          isPaused: false,
          startTimestamp: null,
          pausedDuration: 0,
          pauseStartedAt: null,
        });

        return finishedSession;
      },

      cancelSession: () => {
        const { activeSession } = get();
        if (activeSession) {
          sessionRepository.delete(activeSession.id);
        }
        set({
          activeSession: null,
          adjustments: [],
          isRunning: false,
          isPaused: false,
          startTimestamp: null,
          pausedDuration: 0,
          pauseStartedAt: null,
        });
      },

      getAdjustment: (exerciseId, baseReps, baseWeight) => {
        const existing = get().adjustments.find((a) => a.exerciseId === exerciseId);
        return existing ?? { exerciseId, currentReps: baseReps, currentWeight: baseWeight };
      },

      setAdjustment: (exerciseId, reps, weight) => {
        set((state) => {
          const filtered = state.adjustments.filter((a) => a.exerciseId !== exerciseId);
          return {
            adjustments: [
              ...filtered,
              { exerciseId, currentReps: reps, currentWeight: weight },
            ],
          };
        });
      },

      getExerciseSetCount: (exerciseId) => {
        const { activeSession } = get();
        if (!activeSession) return 0;
        const log = activeSession.exerciseLogs.find((l) => l.exerciseId === exerciseId);
        return log?.sets.length ?? 0;
      },

      hasActiveSession: () => {
        return get().activeSession !== null;
      },

      isSessionForCategory: (categoryId) => {
        return get().activeSession?.categoryId === categoryId;
      },
    }),
    {
      name: "workout-app:session-store",
    }
  )
);
