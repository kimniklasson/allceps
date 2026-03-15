# Architecture

## Data Flow

```
User Action → Component → Zustand Store → Repository → localStorage
                ↑                              ↓
                └── re-render ← state update ←─┘
```

## Repository Pattern

All data access goes through repository interfaces defined in `src/data/types.ts`:

- **CategoryRepository** — CRUD for categories and exercises
- **SessionRepository** — CRUD for workout sessions

Current implementations use localStorage (`src/data/repositories/`). To migrate to a database:

1. Create new repository implementations (e.g., `categoryRepositorySupabase.ts`)
2. Implement the same interface
3. Swap the import in the Zustand stores
4. UI code remains untouched

## Zustand Stores

| Store | Responsibility |
|-------|---------------|
| `useCategoryStore` | Category and exercise CRUD |
| `useSessionStore` | Active workout session, timer state, set logging |
| `useHistoryStore` | Completed workout sessions |

`useSessionStore` persists timer state (`startTimestamp`, `pausedDuration`) so the timer survives page refresh.

## Routing

```
/                    → CategoryList (home page)
/category/:id        → Exercise list for a category
/history             → Completed workouts grouped by month
/history/:sessionId  → Workout detail view
```

`AppShell` is the layout route wrapping all pages. It renders the `Header` (fixed top) and `SessionTimerBar` (fixed bottom, conditional). The timer bar never unmounts during navigation.

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
- Finishing a session saves it as "completed" with all exercise logs
