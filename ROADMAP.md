# Roadmap

## Phase 1: MVP
- [x] Category management (create, delete, reorder via drag & drop)
- [x] Global exercise library (create, edit, permanent delete)
- [x] Many-to-many: exercises can belong to multiple categories
- [x] Exercise modal with search, create, toggle per category, trash icon
- [x] Active workout sessions with live timer (requestAnimationFrame)
- [x] Set logging with +/- adjustments and inline editing
- [x] Pause/resume timer
- [x] Completed workout history (grouped by month)
- [x] Workout detail view with totals
- [x] PWA support (installable)
- [x] localStorage persistence

## Phase 2: Backend & Auth
- [x] Supabase backend (PostgreSQL + RLS)
- [x] User authentication (email/password)
- [x] Google OAuth
- [x] Cloud sync across devices
- [x] Data migration: localStorage → Supabase on first login
- [x] Repository pattern with auto-switching (local vs Supabase)

## Phase 3: UX & Design
- [x] Dark mode (full theme support — light/dark/auto)
- [x] Swipe gestures (left to remove from category, right to duplicate)
- [x] Staggered entrance animations
- [x] Personal records tracking with confetti
- [x] Rotating tip messages on category pages
- [x] Empty state messages
- [x] Session cancel confirmation (Nej/Ja)

## Phase 4: Statistics & Analytics
- [x] Statistics dashboard page
- [x] Personal records display (expandable list)
- [x] Workout streaks (current, longest, weekly/monthly records)
- [x] Intensity score ring with animated progress
- [x] Category distribution donut chart
- [x] Strength trend chart (estimated 1RM per category, Epley formula)
- [x] Volume trend chart (total volume per category over time)
- [x] Muscle group volume distribution (horizontal bar chart, 30d/all-time)
- [x] Muscle balance score (with color-coded thresholds)
- [x] Session overview cards (avg duration, total time, avg rest, calories)
- [x] Workout bar chart (stacked by category, month/week toggle)
- [x] Exercise-specific analytics and insights
- [x] Individual exercise progress page (year/month view toggle)
- [x] Fun motivational stats and badges

## Phase 5: Muscle Groups & Body
- [x] User-defined muscle groups (CRUD)
- [x] Percentage-based muscle group assignment to exercises
- [x] Auto-redistribution of percentages when adding/removing groups
- [x] MuscleGroupPicker component with inline create/rename/delete
- [x] Muscle group snapshots in exercise logs (JSONB)
- [x] 3D body model visualization (Three.js, OBJLoader)
- [x] Interactive orbit controls
- [x] Male/female model split (geometry splitting by X coordinate)
- [x] 13 measurement points per gender
- [x] Measurement input with history (up to 5 entries per point)
- [x] Camera animation with easing for zoom transitions
- [x] Theme-aware 3D rendering (light/dark materials and background)
- [x] Rest timer tracking between sets

## Phase 6: Code Quality & i18n Prep
- [x] Centralized UI strings for i18n (`src/constants/ui-strings.ts`)
- [x] Centralized z-index scale (`src/utils/zIndex.ts`)
- [x] Class name utility (`cn()`) replacing manual array joins
- [x] Ref-counted scroll lock utility
- [x] Input validation in Supabase repositories
- [x] Optimistic updates with rollback in stores
- [x] Three.js memory leak fixes (geometry/material disposal)
- [x] RAF timer optimization (no callback recreation)
- [x] SVG chart accessibility (role="img", aria-label)
- [x] Swipe action colors via CSS custom properties
- [x] Loading indicator on muscle group creation
- [x] DB unique constraints for exercise_logs and workout_sets

## Phase 7: Future
- [ ] English translation (swap values in `ui-strings.ts`)
- [ ] Workout templates / programs
- [ ] Export workout data (CSV/JSON)
- [ ] Share workouts
- [ ] Notifications / reminders
- [ ] Apple Health / Google Fit integration
