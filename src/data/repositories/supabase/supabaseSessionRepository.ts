import { supabase } from "../../../lib/supabase";
import type { WorkoutSession, ExerciseLog, WorkoutSet } from "../../../types/models";
import type { SessionRepository } from "../../types";

interface DbSession {
  id: string;
  user_id: string;
  category_id: string;
  category_name: string;
  started_at: string;
  finished_at: string | null;
  paused_duration: number;
  status: "active" | "completed";
  exercise_logs: DbExerciseLog[];
}

interface DbExerciseLog {
  id: string;
  session_id: string;
  exercise_id: string;
  exercise_name: string;
  is_bodyweight: boolean;
  workout_sets: DbWorkoutSet[];
}

interface DbWorkoutSet {
  id: string;
  exercise_log_id: string;
  set_number: number;
  reps: number;
  weight: number;
  completed_at: string;
}

function mapSet(db: DbWorkoutSet): WorkoutSet {
  return {
    setNumber: db.set_number,
    reps: db.reps,
    weight: db.weight,
    completedAt: db.completed_at,
  };
}

function mapLog(db: DbExerciseLog): ExerciseLog {
  return {
    exerciseId: db.exercise_id,
    exerciseName: db.exercise_name,
    isBodyweight: db.is_bodyweight,
    sets: (db.workout_sets || []).map(mapSet).sort((a, b) => a.setNumber - b.setNumber),
  };
}

function mapSession(db: DbSession): WorkoutSession {
  return {
    id: db.id,
    categoryId: db.category_id,
    categoryName: db.category_name,
    startedAt: db.started_at,
    finishedAt: db.finished_at,
    pausedDuration: db.paused_duration,
    exerciseLogs: (db.exercise_logs || []).map(mapLog),
    status: db.status,
  };
}

async function getUserId(): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return user.id;
}

export const supabaseSessionRepository: SessionRepository = {
  async getAll() {
    const { data, error } = await supabase
      .from("workout_sessions")
      .select("*, exercise_logs(*, workout_sets(*))")
      .order("started_at", { ascending: false });

    if (error) throw error;
    return (data as DbSession[]).map(mapSession);
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from("workout_sessions")
      .select("*, exercise_logs(*, workout_sets(*))")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }
    return mapSession(data as DbSession);
  },

  async getActive() {
    const { data, error } = await supabase
      .from("workout_sessions")
      .select("*, exercise_logs(*, workout_sets(*))")
      .eq("status", "active")
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;
    return mapSession(data as DbSession);
  },

  async save(session: WorkoutSession) {
    const userId = await getUserId();

    // Upsert the session
    const { error: sessionError } = await supabase
      .from("workout_sessions")
      .upsert({
        id: session.id,
        user_id: userId,
        category_id: session.categoryId,
        category_name: session.categoryName,
        started_at: session.startedAt,
        finished_at: session.finishedAt,
        paused_duration: session.pausedDuration,
        status: session.status,
      });

    if (sessionError) throw sessionError;

    // Sync exercise logs and sets
    for (const log of session.exerciseLogs) {
      // Check if log exists
      const { data: existingLog } = await supabase
        .from("exercise_logs")
        .select("id")
        .eq("session_id", session.id)
        .eq("exercise_id", log.exerciseId)
        .maybeSingle();

      let logId: string;

      if (existingLog) {
        logId = existingLog.id;
      } else {
        const { data: newLog, error: logError } = await supabase
          .from("exercise_logs")
          .insert({
            user_id: userId,
            session_id: session.id,
            exercise_id: log.exerciseId,
            exercise_name: log.exerciseName,
            is_bodyweight: log.isBodyweight,
          })
          .select("id")
          .single();

        if (logError) throw logError;
        logId = newLog.id;
      }

      // Upsert sets — delete existing and re-insert for simplicity
      await supabase
        .from("workout_sets")
        .delete()
        .eq("exercise_log_id", logId);

      if (log.sets.length > 0) {
        const setsToInsert = log.sets.map((s) => ({
          user_id: userId,
          exercise_log_id: logId,
          set_number: s.setNumber,
          reps: s.reps,
          weight: s.weight,
          completed_at: s.completedAt,
        }));

        const { error: setsError } = await supabase
          .from("workout_sets")
          .insert(setsToInsert);

        if (setsError) throw setsError;
      }
    }
  },

  async delete(id: string) {
    // Cascade will handle exercise_logs and workout_sets
    const { error } = await supabase.from("workout_sessions").delete().eq("id", id);
    if (error) throw error;
  },
};
