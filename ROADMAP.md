# Roadmap

## Phase 1: MVP (Current)
- [x] Category management (create, delete)
- [x] Exercise management (add, edit via modal)
- [x] Active workout sessions with live timer
- [x] Set logging with +/- adjustments
- [x] Pause/resume timer
- [x] Completed workout history (grouped by month)
- [x] Workout detail view with totals
- [x] PWA support (installable, offline)
- [x] localStorage persistence

## Phase 2: Database Migration
- [ ] Add Supabase (or similar) as backend
- [ ] Create new repository implementations (`categoryRepositorySupabase.ts`, etc.)
- [ ] Swap repository imports in stores — UI untouched
- [ ] Add user authentication (email/password or OAuth)
- [ ] Cloud sync across devices

## Phase 3: Enhanced Features
- [ ] Exercise reordering (drag & drop)
- [ ] Category reordering
- [ ] Exercise history / progress charts (weight over time)
- [ ] Personal records tracking
- [ ] Rest timer between sets (configurable)
- [ ] Export workout data (CSV/JSON)
- [ ] Dark mode

## Phase 4: Social & Advanced
- [ ] Share workouts with friends
- [ ] Workout templates / programs
- [ ] Notifications / reminders
- [ ] Apple Health / Google Fit integration
