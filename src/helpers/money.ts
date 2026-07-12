// eslint-disable-next-line import/no-named-as-default -- Big is big.js's default export
import Big from 'big.js';

/**
 * Decimal-safe money math.
 *
 * Monetary values cross the wire as JS `number`s (see the money fields in
 * src/types/wallet/types.ts and src/types/trade/types.ts). Doing arithmetic or
 * comparisons on those numbers directly risks float-rounding errors
 * (e.g. 0.1 + 0.2 !== 0.3), which can corrupt balance checks and trade amounts.
 *
 * Route ALL amount arithmetic and comparisons through these helpers. They
 * operate on Big internally and return plain values, so callers never touch the
 * float operators. Inputs accept the string the user typed or the number from
 * the API; anything unparseable is treated as 0.
 */

export type Money = number | string;

const toBig = (value: Money): Big => {
  try {
    return new Big(value === '' || value == null ? 0 : value);
  } catch {
    return new Big(0);
  }
};

export const mul = (a: Money, b: Money): Big => toBig(a).mul(toBig(b));
export const add = (a: Money, b: Money): Big => toBig(a).add(toBig(b));
export const sub = (a: Money, b: Money): Big => toBig(a).sub(toBig(b));

/** a > b */
export const gt = (a: Money, b: Money): boolean => toBig(a).gt(toBig(b));
/** a >= b */
export const gte = (a: Money, b: Money): boolean => toBig(a).gte(toBig(b));

/** True when the value is a valid, strictly-positive amount. */
export const isPositive = (value: Money): boolean => gt(value, 0);

/** Convert a Big/number/string amount back to a JS number for API payloads. */
export const toNumber = (value: Money | Big): number => Number(value.toString());

/** Format an amount to a fixed number of decimal places (rounding down). */
export const format = (value: Money | Big, dp: number): string =>
  new Big(value.toString()).toFixed(dp, Big.roundDown);
