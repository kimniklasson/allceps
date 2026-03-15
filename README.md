# Träningsappen — Exercise Tracking Web App

A mobile-first exercise tracking web app where users create workout categories, add exercises, log sets during sessions with a live timer, and review completed workouts.

## Tech Stack

- **React 18 + TypeScript** — UI framework
- **Vite** — Build tool
- **React Router v6** — Client-side routing
- **Zustand** — State management with localStorage persistence
- **Tailwind CSS 4** — Utility-first styling
- **Lucide React** — Icons
- **vite-plugin-pwa** — Progressive Web App support

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

The app uses a **repository pattern** for data access — Zustand stores call repository methods, never touching localStorage directly. This makes it straightforward to swap in a database later.

```
src/
  components/     → UI components organized by feature
  data/           → Repository pattern (localStorage implementations)
  hooks/          → Custom hooks (timer, etc.)
  stores/         → Zustand stores (categories, session, history)
  types/          → TypeScript interfaces
  utils/          → Utility functions (formatting, calculations)
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for details.

## PWA

The app is installable on mobile devices. On Chrome, tap "Add to Home Screen" from the browser menu.
