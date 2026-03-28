/** Input validation for repository data. */

const MAX_NAME_LENGTH = 255;
const MAX_REPS = 9999;
const MAX_WEIGHT = 99999;

export function validateName(name: string, field = "Name"): string {
  const trimmed = name.trim();
  if (trimmed.length === 0) throw new Error(`${field} cannot be empty`);
  if (trimmed.length > MAX_NAME_LENGTH) throw new Error(`${field} cannot exceed ${MAX_NAME_LENGTH} characters`);
  return trimmed;
}

export function validateReps(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return Math.min(Math.round(value), MAX_REPS);
}

export function validateWeight(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return Math.min(Math.round(value * 10) / 10, MAX_WEIGHT);
}
