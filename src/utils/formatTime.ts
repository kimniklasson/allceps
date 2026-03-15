/**
 * Format milliseconds as HH:MM:SS
 */
export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

/**
 * Format duration between two ISO timestamps as a human-readable string.
 * E.g. "1h 05 min" or "45 min"
 */
export function formatDuration(startedAt: string, finishedAt: string, pausedDuration = 0): string {
  const start = new Date(startedAt).getTime();
  const end = new Date(finishedAt).getTime();
  const totalMs = end - start - pausedDuration;
  const totalMinutes = Math.max(1, Math.round(totalMs / 60000));

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return `${hours}h ${minutes.toString().padStart(2, "0")} min`;
  }
  return `${minutes} min`;
}
