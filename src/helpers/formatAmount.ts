/**
 * Format a token/fiat amount in its own units, trimming trailing zeros.
 * e.g. 0.1 -> "0.1", 306.12 -> "306.12", 1000 -> "1,000".
 */
export function formatAmount(n: number, maxDecimals = 8): string {
  return n.toLocaleString(undefined, { maximumFractionDigits: maxDecimals });
}
