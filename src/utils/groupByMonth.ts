import type { WorkoutSession } from "../types/models";
import { formatMonthYear, getMonthKey } from "./formatDate";
import type { MonthGroup } from "../stores/useHistoryStore";

export function groupSessionsByMonth(sessions: WorkoutSession[]): MonthGroup[] {
  const groups = new Map<string, { label: string; sessions: WorkoutSession[] }>();

  for (const session of sessions) {
    const key = getMonthKey(session.startedAt);
    if (!groups.has(key)) {
      groups.set(key, {
        label: formatMonthYear(session.startedAt),
        sessions: [],
      });
    }
    groups.get(key)!.sessions.push(session);
  }

  // Sort groups by key descending (most recent first)
  return Array.from(groups.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([, group]) => group);
}
