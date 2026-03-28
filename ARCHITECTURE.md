# Architecture

## Data Flow

```
User Action → Component → Zustand Store → Repository → Supabase / localStorage
                ↑                              ↓
                └── re-render ← state update ←─┘
```

## Repository Pattern

All data access goes through repository interfaces defined in `src/data/types.ts`:

- **ExerciseRepository** — CRUD for global exercises (with muscle group assignments)
- **CategoryRepository** — CRUD for categories + join-table operations (add/remove exercises to/from categories)
- **SessionRepository** — CRUD for workout sessions (with serialized save queue to prevent race conditions)
- **MuscleGroupRepository** — CRUD for user-defined muscle groups

Two implementations exist per interface:
- **Local** (`src/data/repositories/`) — uses localStorage
- **Supabase** (`src/data/repositories/supabase/`) — uses Supabase PostgreSQL

The active implementation is selected automatically in `src/data/repositories/index.ts` based on authentication state.

## Database Schema

Exercises are **global entities** with a many-to-many relationship to categories. Muscle groups have a many-to-many relationship to exercises with percentage weights:

```
global_exercises ←─ category_exercises ─→ categories
                         (join table)

global_exercises ←─ exercise_muscle_groups ─→ muscle_groups
                         (join table, percentage)

workout_sessions ─→ exercise_logs ─→ workout_sets
                    (includes muscle_groups JSONB snapshot)
```

- `global_exercises` — user-scoped exercise definitions (name, baseReps, baseWeight, isBodyweight)
- `category_exercises` — join table with sort_order per category
- `muscle_groups` — user-defined muscle groups (unique per user by name)
- `exercise_muscle_groups` — join table with percentage (0–100) per assignment
- `exercise_logs` stores `exercise_id` (TEXT) + denormalized `exercise_name` + JSONB `muscle_groups` snapshot for history resilience

## Zustand Stores

| Store | Responsibility |
|-------|---------------|
| `useExerciseStore` | Global exercise library CRUD (with muscle group assignments) |
| `useCategoryStore` | Category CRUD + add/remove exercises to/from categories |
| `useSessionStore` | Active workout session, timer state, set logging |
| `useHistoryStore` | Completed workout sessions |
| `useMuscleGroupStore` | User-defined muscle groups CRUD |
| `useSettingsStore` | User preferences (theme, weight, age, sex, calorie display) |

All stores use `persist` middleware for localStorage hydration. `useSessionStore` persists timer state (`startTimestamp`, `pausedDuration`) so the timer survives page refresh.

## Routing

```
/                              → CategoryList (home page)
/category/:id                  → Exercise list for a category
/history                       → Completed workouts grouped by month
/history/:sessionId            → Workout detail view
/stats                         → Statistics dashboard
/stats/exercise/:exerciseId    → Individual exercise progress charts
/profile                       → User profile and settings
/body                          → 3D body model with measurements (standalone)
/login                         → Login page
/signup                        → Sign up page
/auth/callback                 → OAuth callback handler
/set-name                      → First-time onboarding (set display name)
```

`AppShell` is the layout route wrapping all protected pages. It renders the `Header` (fixed top), `SessionTimerBar` (fixed bottom, conditional), and `BottomNav` (fixed bottom).

## Header

The header shows a "+" button on category pages (`/category/:id`) that opens the exercise modal. It dispatches a `CustomEvent("open-exercise-modal")` which the `ExerciseListPage` listens for.

## Timer

The `useTimer` hook uses `requestAnimationFrame` (not `setInterval`) to compute elapsed time:

```
elapsed = Date.now() - startTimestamp - pausedDuration
```

This approach has no drift and survives page refresh since timestamps are persisted in Zustand.

## Session Rules

- A session starts when the user taps "SET 1" on any exercise
- Sessions are locked to one category — tapping SET in a different category while a session is active is blocked
- Pause stores `pauseStartedAt` timestamp, resume adds the delta to `pausedDuration`
- Finishing a session saves it as "completed" with all exercise logs (including muscle group snapshots)
- Cancel dialog asks "Nej" / "Ja" for confirmation

## Exercise Management

- Exercises are global — they exist independently of categories
- The exercise modal (opened via "+" in header) is the central place to create, assign, and permanently delete exercises
- Swipe-to-delete on a category page only removes the exercise from that category
- Permanent deletion (trash icon in modal) removes the exercise from all categories
- New exercises created in the modal are auto-checked for the current category
- Exercises can have multiple muscle groups assigned with percentage distribution

## Muscle Group System

- Muscle groups are user-defined and global (shared across all exercises)
- Each exercise can have multiple groups with percentage-based distribution (0–100%)
- Adding/removing groups auto-redistributes percentages proportionally
- MuscleGroupPicker component allows inline creation, renaming, and deletion
- Deleting a muscle group cascades to all exercise assignments
- Muscle group snapshots are stored in exercise_logs JSONB for historical accuracy

## 3D Body Model

- `BodyModelPage` — full interactive 3D scene with orbit controls (standalone route `/body`)
- `BodyModelPreview` — static preview used in profile page for sex selection
- Loads `malefemale.obj` via Three.js OBJLoader
- Geometry split by X coordinate: male (negative X) on left, female (positive X) on right
- 13 measurement points per gender (neck, shoulders, chest, waist, glutes, arms, forearms, thighs, calves)
- Click any measurement dot to enter/view measurement history (up to 5 entries per point)
- Camera animation with easing for zoom transitions
- Theme-aware: adapts materials and background to light/dark mode

## Statistics

All charts are custom SVG-based (no third-party charting library):

- **StatsLineChart** — single-series line chart with gradient fill and interactive tooltips
- **StatsMultiLineChart** — multi-series line chart with optional baseline
- **WorkoutBarChart** — stacked bar chart by category (month/week toggle)
- Responsive width via ResizeObserver
- Animated line drawing and staggered bar fills

Statistics components:
- **StatsOverviewCards** — intensity score ring + category distribution donut
- **StatsStrengthTrend** — estimated 1RM trends per category (Epley formula)
- **StatsVolumeTrend** — total volume per category over time
- **StatsMuscleGroupVolume** — horizontal bar chart (30d/all-time toggle)
- **StatsMuscleBalance** — balance score with color coding (green/yellow/red)
- **StatsPersonalRecords** — best lifts per exercise (expandable list)
- **StatsStreaks** — current/longest streak, weekly/monthly records, favorite day
- **StatsSessionOverview** — scrolling cards (avg duration, total time, avg rest, calories)
- **StatsExerciseInsights** — per-exercise analytics
- **StatsFunMotivational** — badges and fun conversion stats

## Animations

- Page transitions: 0.2s fade-in
- Item entry: 0.4s slide-in with staggered delays (70ms between items)
- New exercise: 0.45s spring entrance with overshoot
- Bottom sheet: slide-up from bottom
- Rotating tips: 10s interval with 0.7s crossfade
- PB confetti: canvas-confetti on personal records
- Chart animations: stroke-dashoffset for lines, staggered fill for bars

## Authentication

- Email/password signup with email redirect
- Google OAuth
- Password reset via email
- Account deletion (cascades through manual cleanup + RPC call)
- Automatic localStorage → Supabase migration on first login
- Settings synced to Supabase user_metadata

## Utilities

- **`cn()`** (`src/utils/cn.ts`) — class name merging utility, filters out falsy values (lightweight alternative to `clsx`)
- **`Z`** (`src/utils/zIndex.ts`) — centralized z-index scale: `DRAG_ITEM(10)`, `STICKY_BAR(40)`, `FFY_TEXT(45)`, `OVERLAY(50)`, `MODAL(70)`, `CRITICAL_CONFIRM(200)`
- **`scrollLock`** (`src/utils/scrollLock.ts`) — ref-counted body scroll lock (multiple components can acquire/release without conflicts)
- **`validation`** (`src/utils/validation.ts`) — input validation for names, reps, weights (used in Supabase repositories)

## Internationalization (i18n)

All user-visible Swedish UI strings are centralized in `src/constants/ui-strings.ts`, organized by feature area (NAV, AUTH, PROFILE, EXERCISES, STATS, etc.). Components import from this file rather than using hardcoded strings. To translate the app, replace the string values in this single file.

## Data Migration

- `exerciseGlobalMigration.ts` — runs at app startup, migrates old nested exercise format (exercises inside categories) to the new global format (global exercises + join table)
- `localToSupabase.ts` — one-time migration from localStorage to Supabase on first login
