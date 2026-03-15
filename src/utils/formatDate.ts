const SWEDISH_DAYS = ["Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"];

const SWEDISH_MONTHS_UPPER = [
  "JANUARI", "FEBRUARI", "MARS", "APRIL", "MAJ", "JUNI",
  "JULI", "AUGUSTI", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DECEMBER",
];

/**
 * Format date as "Mån 27/2"
 */
export function formatShortDate(isoString: string): string {
  const date = new Date(isoString);
  const day = SWEDISH_DAYS[date.getDay()];
  return `${day} ${date.getDate()}/${date.getMonth() + 1}`;
}

/**
 * Format month/year as "MARS 2026"
 */
export function formatMonthYear(isoString: string): string {
  const date = new Date(isoString);
  return `${SWEDISH_MONTHS_UPPER[date.getMonth()]} ${date.getFullYear()}`;
}

/**
 * Get month key for grouping: "2026-03"
 */
export function getMonthKey(isoString: string): string {
  const date = new Date(isoString);
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
}
