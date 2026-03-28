# Data Models

## TypeScript Interfaces

### MuscleGroup
```typescript
interface MuscleGroup {
  id: string;           // UUID
  name: string;         // e.g. "Bröst", "Triceps"
  createdAt: string;    // ISO 8601 timestamp
}
```

### MuscleGroupAssignment
```typescript
interface MuscleGroupAssignment {
  muscleGroupId: string;
  muscleGroupName: string; // denormalized for display
  percentage: number;      // 0–100
}
```

### Exercise (Global)
```typescript
interface Exercise {
  id: string;           // UUID
  name: string;         // e.g. "Bänkpress"
  baseReps: number;     // default starting reps
  baseWeight: number;   // default starting weight (kg)
  isBodyweight: boolean; // if true, display as "Kroppsvikt + X kg"
  muscleGroups: MuscleGroupAssignment[]; // assigned muscle groups with percentages
}
```

### CategoryExercise (Exercise within a category context)
```typescript
interface CategoryExercise extends Exercise {
  sortOrder: number;    // ordering within the category
}
```

### Category
```typescript
interface Category {
  id: string;           // UUID
  name: string;         // e.g. "Bröst och triceps"
  exercises: CategoryExercise[]; // populated via join table
  createdAt: string;    // ISO 8601 timestamp
  sortOrder: number;    // for ordering
  colorIndex: number;   // determines category color from palette
}
```

### WorkoutSet
```typescript
interface WorkoutSet {
  setNumber: number;    // 1, 2, 3...
  reps: number;
  weight: number;       // kg (extra weight for bodyweight exercises)
  startedAt?: string;   // ISO 8601 timestamp (when the set started)
  completedAt: string;  // ISO 8601 timestamp
}
```

### ActiveSetInfo
```typescript
interface ActiveSetInfo {
  exerciseId: string;
  startedAt: string;    // ISO 8601 timestamp
}
```

### ExerciseLog
```typescript
interface ExerciseLog {
  exerciseId: string;    // references global exercise ID
  exerciseName: string;  // denormalized snapshot — survives exercise deletion
  isBodyweight: boolean;
  muscleGroups: Array<{ name: string; percentage: number }>; // JSONB snapshot at logging time
  sets: WorkoutSet[];
}
```

### WorkoutSession
```typescript
interface WorkoutSession {
  id: string;
  categoryId: string;
  categoryName: string;   // snapshot — survives category deletion
  startedAt: string;      // ISO 8601
  finishedAt: string | null;
  pausedDuration: number; // milliseconds spent paused
  exerciseLogs: ExerciseLog[];
  status: "active" | "completed";
}
```

### ExerciseAdjustment
```typescript
interface ExerciseAdjustment {
  exerciseId: string;
  currentReps: number;
  currentWeight: number;
}
```

## Supabase Tables

| Table | Description |
|-------|-------------|
| `global_exercises` | Global exercise definitions (user-scoped) |
| `category_exercises` | Join table: many-to-many between categories and exercises, with sort_order |
| `categories` | Workout categories (user-scoped) |
| `muscle_groups` | User-defined muscle groups (unique per user by name) |
| `exercise_muscle_groups` | Join table: many-to-many between exercises and muscle groups, with percentage |
| `workout_sessions` | Workout sessions with status and timing |
| `exercise_logs` | Logged exercises per session (denormalized name + muscle_groups JSONB snapshot) |
| `workout_sets` | Individual sets per exercise log |

### Table Schemas

#### categories
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | References auth.users |
| name | TEXT | Category name |
| sort_order | INTEGER | Ordering |
| created_at | TIMESTAMPTZ | Creation timestamp |

#### global_exercises
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | References auth.users |
| name | TEXT | Exercise name |
| base_reps | INTEGER | Default reps (default 10) |
| base_weight | REAL | Default weight in kg (default 0) |
| is_bodyweight | BOOLEAN | Bodyweight exercise flag (default false) |
| created_at | TIMESTAMPTZ | Creation timestamp |

#### category_exercises
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| category_id | UUID | References categories |
| exercise_id | UUID | References global_exercises |
| sort_order | INTEGER | Ordering within category |
| | UNIQUE | (category_id, exercise_id) |

#### muscle_groups
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | References auth.users |
| name | TEXT | Muscle group name |
| created_at | TIMESTAMPTZ | Creation timestamp |
| | UNIQUE | (user_id, name) |

#### exercise_muscle_groups
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| exercise_id | UUID | References global_exercises |
| muscle_group_id | UUID | References muscle_groups |
| percentage | INTEGER | Weight 0–100 |
| created_at | TIMESTAMPTZ | Creation timestamp |
| | UNIQUE | (exercise_id, muscle_group_id) |

#### workout_sessions
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | References auth.users |
| category_id | UUID | Category reference |
| category_name | TEXT | Denormalized snapshot |
| started_at | TIMESTAMPTZ | Session start |
| finished_at | TIMESTAMPTZ | Session end (nullable) |
| paused_duration | INTEGER | Milliseconds paused |
| status | TEXT | 'active' or 'completed' |

#### exercise_logs
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | References auth.users |
| session_id | UUID | References workout_sessions |
| exercise_id | TEXT | Exercise reference |
| exercise_name | TEXT | Denormalized snapshot |
| is_bodyweight | BOOLEAN | Bodyweight flag |
| muscle_groups | JSONB | Snapshot: [{name, percentage}] |

#### workout_sets
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | References auth.users |
| exercise_log_id | UUID | References exercise_logs |
| set_number | INTEGER | Set ordering |
| reps | INTEGER | Repetitions |
| weight | REAL | Weight in kg |
| started_at | TIMESTAMPTZ | Set start (nullable) |
| completed_at | TIMESTAMPTZ | Set completion |

### Relationships
```
auth.users
  ├── categories (1:N)
  │     └── category_exercises (M:N join)
  │           └── global_exercises
  ├── global_exercises (1:N)
  │     └── exercise_muscle_groups (M:N join)
  │           └── muscle_groups
  ├── muscle_groups (1:N)
  └── workout_sessions (1:N)
        └── exercise_logs (1:N)
              └── workout_sets (1:N)
```

### Row Level Security (RLS)

All tables have RLS enabled. Policies:

- **Simple user ownership** (`auth.uid() = user_id`): categories, global_exercises, muscle_groups, workout_sessions, exercise_logs, workout_sets
- **Ownership via join** (EXISTS subquery checking parent table's user_id): category_exercises, exercise_muscle_groups

### Indexes

| Index | Table | Columns |
|-------|-------|---------|
| idx_categories_user | categories | (user_id, sort_order) |
| idx_global_exercises_user | global_exercises | (user_id) |
| idx_category_exercises_category | category_exercises | (category_id, sort_order) |
| idx_category_exercises_exercise | category_exercises | (exercise_id) |
| idx_emg_exercise_id | exercise_muscle_groups | (exercise_id) |
| idx_emg_muscle_group_id | exercise_muscle_groups | (muscle_group_id) |
| idx_sessions_user | workout_sessions | (user_id, started_at DESC) |
| idx_exercise_logs_session | exercise_logs | (session_id) |
| idx_workout_sets_log | workout_sets | (exercise_log_id, set_number) |

## localStorage Keys

All keys are prefixed with `workout-app:`.

| Key | Type | Description |
|-----|------|-------------|
| `workout-app:global-exercises` | `Exercise[]` | Global exercise library |
| `workout-app:categories` | `Category[]` | Categories (exercises populated via join) |
| `workout-app:category-exercises` | `JoinEntry[]` | Join table: categoryId, exerciseId, sortOrder |
| `workout-app:sessions` | `WorkoutSession[]` | All workout sessions |
| `workout-app:muscle-groups` | `MuscleGroup[]` | User-defined muscle groups |
| `workout-app:exercise-muscle-groups` | `Assignment[]` | Exercise ↔ muscle group assignments |
| `workout-app:category-store` | Zustand state | Category store hydration |
| `workout-app:exercise-store` | Zustand state | Exercise store hydration |
| `workout-app:session-store` | Zustand state | Session store hydration (includes timer state) |
| `workout-app:muscle-group-store` | Zustand state | Muscle group store hydration |
| `workout-app:settings-store` | Zustand state | Settings store hydration (theme, weight, age, sex) |
| `workout-app:global-exercises-migration-done` | `"true"` | Migration flag |
