/** Format a kg value with space thousands separator: "1 234 kg" */
export function formatKg(kg: number): string {
  const rounded = Math.round(kg);
  return rounded.toLocaleString("sv-SE") + " kg";
}

/** Format a number with optional decimal places */
export function formatDecimal(n: number, decimals = 1): string {
  return n.toFixed(decimals).replace(/\.0+$/, "");
}
