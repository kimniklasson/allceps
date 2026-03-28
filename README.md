# Forfutureyou — Workout Tracking Web App

A mobile-first workout tracking web app where users create workout categories, manage a global exercise library, log sets during sessions with a live timer, track progress with statistics and personal records, assign muscle groups to exercises, view 3D body models, and log body measurements.

## Tech Stack

- **React 19 + TypeScript** — UI framework
- **Vite 8** — Build tool
- **React Router v7** — Client-side routing
- **Zustand 5** — State management with localStorage persistence
- **Tailwind CSS 4** — Utility-first styling
- **Supabase** — Backend (PostgreSQL database, authentication, RLS)
- **Three.js** — 3D body model visualization (OBJLoader + OrbitControls)
- **dnd-kit** — Drag & drop for category/exercise reordering
- **Canvas Confetti** — Personal record celebrations
- **Lucide React** — Icon library
- **Vercel** — Hosting and deployment

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. Use Chrome DevTools mobile viewport (393px) for the intended experience.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Architecture

The app uses a **repository pattern** for data access — Zustand stores call repository methods, never touching storage directly. Two implementations exist: localStorage (offline/dev) and Supabase (authenticated users). The active implementation is selected automatically based on auth state.

```
src/
  auth/           → Authentication provider (Supabase)
  components/     → UI components organized by feature
    body/         → 3D body model visualization (Three.js)
    categories/   → Category management
    exercises/    → Exercise forms, cards, muscle group picker
    history/      → Workout history views & charts
    layout/       → App shell, headers, nav, theme
    session/      → Session-related components
    stats/        → Statistics & progress charts (custom SVG)
    ui/           → Reusable UI components
  data/           → Repository pattern (localStorage + Supabase implementations)
  hooks/          → Custom hooks (timer, drag-sort, PB tracking, rest timer)
  lib/            → Supabase client configuration
  pages/          → Page components
  stores/         → Zustand stores (exercises, categories, session, history, muscle groups, settings)
  types/          → TypeScript interfaces
  constants/      → UI strings (i18n-ready), z-index scale
  utils/          → Utility functions (formatting, calculations, statistics, confetti, body geometry, scroll lock, validation, cn)
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for details.

## Key Features

- **Global exercise library** — Exercises exist independently and can be assigned to multiple categories
- **Category workouts** — Organize exercises into training categories (e.g. "Chest & Triceps")
- **Muscle groups** — Assign muscle groups to exercises with percentage-based distribution
- **Live session timer** — Start sessions by tapping SET, with pause/resume and elapsed time
- **Rest timer** — Automatic rest time tracking between sets
- **Swipe gestures** — Swipe left to remove from category, right to duplicate
- **Personal records** — Automatic PB tracking with confetti celebration
- **Statistics dashboard** — Strength/volume trends, muscle group volume, muscle balance, PRs, streaks, intensity score, category distribution, motivational stats
- **Exercise progress** — Individual exercise charts with year/month views
- **3D body model** — Interactive Three.js visualization with measurement points (13 per gender)
- **Body measurements** — Log and track measurements at specific body points with history
- **Dark mode** — Full dark theme support (light/dark/auto)
- **PWA** — Installable on mobile devices
- **Authentication** — Email/password + Google OAuth via Supabase
- **Cloud sync** — Automatic data sync across devices for authenticated users
