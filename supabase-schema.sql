-- ================================================
-- Supabase Schema for Workout Tracker App
-- Run this in the Supabase SQL Editor
-- ================================================

-- 1. Categories
CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Exercises
CREATE TABLE exercises (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id   UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  base_reps     INTEGER NOT NULL DEFAULT 10,
  base_weight   REAL NOT NULL DEFAULT 0,
  is_bodyweight BOOLEAN NOT NULL DEFAULT false,
  sort_order    INTEGER NOT NULL DEFAULT 0
);

-- 3. Workout Sessions
CREATE TABLE workout_sessions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id     UUID NOT NULL,
  category_name   TEXT NOT NULL,
  started_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at     TIMESTAMPTZ,
  paused_duration INTEGER NOT NULL DEFAULT 0,
  status          TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed'))
);

-- 4. Exercise Logs
CREATE TABLE exercise_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id      UUID NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
  exercise_id     TEXT NOT NULL,
  exercise_name   TEXT NOT NULL,
  is_bodyweight   BOOLEAN NOT NULL DEFAULT false
);

-- 5. Workout Sets
CREATE TABLE workout_sets (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_log_id UUID NOT NULL REFERENCES exercise_logs(id) ON DELETE CASCADE,
  set_number      INTEGER NOT NULL,
  reps            INTEGER NOT NULL,
  weight          REAL NOT NULL DEFAULT 0,
  completed_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ================================================
-- Indexes
-- ================================================

CREATE INDEX idx_categories_user ON categories(user_id, sort_order);
CREATE INDEX idx_exercises_category ON exercises(category_id, sort_order);
CREATE INDEX idx_sessions_user ON workout_sessions(user_id, started_at DESC);
CREATE INDEX idx_exercise_logs_session ON exercise_logs(session_id);
CREATE INDEX idx_workout_sets_log ON workout_sets(exercise_log_id, set_number);

-- ================================================
-- Row Level Security
-- ================================================

-- Categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own categories" ON categories
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Exercises
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own exercises" ON exercises
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Workout Sessions
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own sessions" ON workout_sessions
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Exercise Logs
ALTER TABLE exercise_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own exercise logs" ON exercise_logs
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Workout Sets
ALTER TABLE workout_sets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own workout sets" ON workout_sets
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
