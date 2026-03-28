-- Migration: Add unique constraint on exercise_logs to prevent race-condition duplicates
-- Also add unique constraint on workout_sets to prevent duplicate sets

-- Deduplicate any existing exercise_logs before adding constraint
DELETE FROM exercise_logs a
USING exercise_logs b
WHERE a.id > b.id
  AND a.session_id = b.session_id
  AND a.exercise_id = b.exercise_id;

-- Add unique constraint
ALTER TABLE exercise_logs
ADD CONSTRAINT uq_exercise_logs_session_exercise
UNIQUE (session_id, exercise_id);

-- Deduplicate any existing workout_sets before adding constraint
DELETE FROM workout_sets a
USING workout_sets b
WHERE a.id > b.id
  AND a.exercise_log_id = b.exercise_log_id
  AND a.set_number = b.set_number;

-- Add unique constraint
ALTER TABLE workout_sets
ADD CONSTRAINT uq_workout_sets_log_number
UNIQUE (exercise_log_id, set_number);
