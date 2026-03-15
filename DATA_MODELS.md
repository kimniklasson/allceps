# Data Models

## TypeScript Interfaces

### Category
```typescript
interface Category {
  id: string;           // crypto.randomUUID()
  name: string;         // e.g. "Bröst och triceps"
  exercises: Exercise[];
  createdAt: string;    // ISO 8601 timestamp
  sortOrder: number;    // for ordering
}
```

### Exercise
```typescript
interface Exercise {
  id: string;
  categoryId: string;
  name: string;         // e.g. "Bänkpress"
  baseReps: number;     // default starting reps
  baseWeight: number;   // default starting weight (kg)
  isBodyweight: boolean; // if true, display as "Kroppsvikt + X kg"
  sortOrder: number;
}
```

### WorkoutSet
```typescript
interface WorkoutSet {
  setNumber: number;    // 1, 2, 3...
  reps: number;
  weight: number;       // kg (extra weight for bodyweight exercises)
  completedAt: string;  // ISO 8601 timestamp
}
```

### ExerciseLog
```typescript
interface ExerciseLog {
  exerciseId: string;
  exerciseName: string;  // snapshot — survives exercise deletion
  isBodyweight: boolean;
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

## localStorage Keys

All keys are prefixed with `workout-app:`.

| Key | Type | Description |
|-----|------|-------------|
| `workout-app:categories` | `Category[]` | All categories with nested exercises |
| `workout-app:sessions` | `WorkoutSession[]` | All workout sessions |
| `workout-app:category-store` | Zustand state | Category store hydration |
| `workout-app:session-store` | Zustand state | Session store hydration (includes timer state) |
