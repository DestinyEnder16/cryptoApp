/**
 * Client-only sandbox constants for the deposit/withdraw simulation flows.
 *
 * Wallet data (balances, portfolio, deposit addresses, transactions) now comes
 * from the wallet API — see src/store/api/walletApi.ts. What remains here are
 * the values the API does not yet model: the deposit settlement-delay picker
 * and the flat withdrawal fee used while previewing a withdrawal.
 */

export interface SettlementDelay {
  label: string;
  seconds: number;
}

export const SETTLEMENT_DELAYS: SettlementDelay[] = [
  { label: '10 seconds', seconds: 10 },
  { label: '30 seconds', seconds: 30 },
  { label: '60 seconds', seconds: 60 },
];

/** Flat sandbox network fee applied to withdrawals (USDT). */
export const WITHDRAWAL_FEE_USDT = 1;
