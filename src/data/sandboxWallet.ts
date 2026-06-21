/**
 * Local sandbox wallet data. There is no wallet/transactions backend yet, so
 * the wallet screens read from this single typed module. Swap these exports for
 * an RTK Query API later without touching the screens' shape expectations.
 */

export interface SandboxAsset {
  symbol: string;
  name: string;
  /** Human-readable balance in the asset's own units, e.g. "0.0205 BTC". */
  units: string;
  balanceUsd: number;
}

export const sandboxAssets: SandboxAsset[] = [
  { symbol: 'USDT', name: 'Tether', units: '2,450 USDT', balanceUsd: 2450.0 },
  { symbol: 'BTC', name: 'Bitcoin', units: '0.0205 BTC', balanceUsd: 1284.0 },
  { symbol: 'ETH', name: 'Ethereum', units: '0.5400 ETH', balanceUsd: 1158.4 },
];

export const totalPortfolioUsd = 4892.4;
export const changeTodayPct = 3.8;

export interface PortfolioPoint {
  timestamp: number;
  value: number;
}

/** Smooth-ish upward series used by the portfolio chart. */
export const portfolioChartData: PortfolioPoint[] = [
  4210, 4185, 4320, 4290, 4410, 4380, 4505, 4470, 4600, 4565, 4720, 4690, 4810,
  4892,
].map((value, i) => ({ timestamp: i, value }));

export interface PortfolioHistoryRow {
  id: string;
  month: string;
  valueUsd: number;
  changePct: number;
}

export const portfolioHistory: PortfolioHistoryRow[] = [
  { id: 'h-2026-05', month: 'May 2026', valueUsd: 4892.4, changePct: 2.8 },
  { id: 'h-2026-04', month: 'April 2026', valueUsd: 4713.2, changePct: 1.6 },
  { id: 'h-2026-03', month: 'March 2026', valueUsd: 4421.0, changePct: -0.6 },
];

export type SandboxTxType =
  | 'deposit'
  | 'withdrawal'
  | 'buy'
  | 'sell'
  | 'swap'
  | 'alert';

export type SandboxTxStatus = 'completed' | 'pending';

export interface SandboxTransaction {
  id: string;
  type: SandboxTxType;
  title: string;
  /** Primary display amount, pre-signed/formatted e.g. "+$250.00", "0.03 ETH". */
  amountLabel: string;
  /** Whether the amount reads as a credit (green) or debit (red). */
  direction: 'credit' | 'debit' | 'neutral';
  status: SandboxTxStatus;
  date: string;
  asset: string;
  network: string;
  reference: string;
  rate: string;
  /** Larger headline amount shown on the detail screen. */
  detailAmount: string;
}

export const sandboxTransactions: SandboxTransaction[] = [
  {
    id: 'txu_392e43e9',
    type: 'deposit',
    title: 'USDT deposit',
    amountLabel: '+$250.00',
    direction: 'credit',
    status: 'completed',
    date: 'Today',
    asset: 'USDT',
    network: 'TRC20',
    reference: 'txu_392e43e9',
    rate: '$1.00',
    detailAmount: '+250.00 USDT',
  },
  {
    id: 'txb_18a0c7d2',
    type: 'buy',
    title: 'BTC buy',
    amountLabel: '-$100.00',
    direction: 'debit',
    status: 'completed',
    date: 'Today',
    asset: 'BTC',
    network: 'Bitcoin',
    reference: 'txb_18a0c7d2',
    rate: '$62,540.00',
    detailAmount: '-100.00 USD',
  },
  {
    id: 'txw_8392',
    type: 'withdrawal',
    title: 'USDT withdrawal',
    amountLabel: '-100.00',
    direction: 'debit',
    status: 'pending',
    date: 'Yesterday',
    asset: 'USDT',
    network: 'TRC20',
    reference: 'txw_8392',
    rate: '$1.00',
    detailAmount: '-100.00 USDT',
  },
  {
    id: 'txs_4471ab',
    type: 'swap',
    title: 'ETH swap',
    amountLabel: '0.03 ETH',
    direction: 'neutral',
    status: 'completed',
    date: 'Yesterday',
    asset: 'ETH',
    network: 'Ethereum',
    reference: 'txs_4471ab',
    rate: '$2,145.00',
    detailAmount: '+0.03 ETH',
  },
  {
    id: 'txa_pricebtc',
    type: 'alert',
    title: 'Price alert',
    amountLabel: 'BTC',
    direction: 'neutral',
    status: 'completed',
    date: 'Fired',
    asset: 'BTC',
    network: 'Bitcoin',
    reference: 'txa_pricebtc',
    rate: '$62,540.00',
    detailAmount: 'BTC reached target',
  },
];

export function getTransactionById(
  id: string | undefined
): SandboxTransaction | undefined {
  if (!id) return undefined;
  return sandboxTransactions.find((tx) => tx.id === id);
}

export const DEPOSIT_NETWORK = 'TRC20 sandbox network';
export const DEPOSIT_ADDRESS = 'TXYZ8gQ3kP9aBcDeFgHjKmNpQrStUv9F12';
/** Short form for compact UI (mockup shows a truncated address). */
export const DEPOSIT_ADDRESS_SHORT = 'TXYZ...9F12';

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
