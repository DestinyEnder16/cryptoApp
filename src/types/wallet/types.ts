import type { UserVerification } from '../auth/types';

// GET /wallet ---------------------------------------------------------------

export interface DepositAddress {
  assetSymbol: string;
  network: string;
  address: string;
  /** URI used as the QR code payload, e.g. "bitcoin:tb1q…". */
  qrPayload: string;
}

export interface WalletBalance {
  assetSymbol: string;
  /** Spendable balance in the asset's own units. */
  available: number;
  /** Reserved (e.g. pending withdrawals) in the asset's own units. */
  locked: number;
}

export interface Wallet {
  id: string;
  userId: string;
  fiatCurrency: string;
  depositAddresses: DepositAddress[];
  balances: WalletBalance[];
}

export interface WalletOverview {
  wallet: Wallet;
  /** Total portfolio value in USD. */
  portfolioValueUsd: number;
  /** Same total converted to the user's fiat currency. */
  portfolioValue: number;
  portfolioCurrency: string;
  verification: UserVerification;
}

export interface WalletResponse {
  data: WalletOverview;
}

// GET /wallet/portfolio/history --------------------------------------------

export type PortfolioRange = '1D' | '1W' | '1M' | '1Y';

export interface PortfolioPoint {
  time: string;
  valueUsd: number;
  value: number;
  currency: string;
}

export interface PortfolioHistoryMeta {
  count: number;
  range: PortfolioRange;
  latestValueUsd: number;
  latestValue: number;
  currency: string;
}

export interface PortfolioHistoryResponse {
  data: PortfolioPoint[];
  meta: PortfolioHistoryMeta;
}

// GET /wallet/deposit-addresses[/{symbol}] ---------------------------------

export interface DepositAddressesResponse {
  data: DepositAddress[];
  meta: { count: number };
}

export interface DepositAddressResponse {
  data: DepositAddress;
}

// GET /wallet/transactions --------------------------------------------------

export type TransactionType =
  | 'buy'
  | 'sell'
  | 'swap'
  | 'deposit'
  | 'withdrawal'
  | 'transfer';

export type TransactionStatus =
  | 'pending'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  status: TransactionStatus;
  fromAsset?: string;
  toAsset?: string;
  fromAmount?: number;
  toAmount?: number;
  feeAmount?: number;
  rate?: number;
  reference: string;
  note?: string;
  createdAt: string;
  completedAt?: string | null;
}

export interface TransactionsResponse {
  data: Transaction[];
  meta: { count: number };
}

export interface TransactionListParams {
  status?: TransactionStatus;
  type?: TransactionType;
  page?: number;
  limit?: number;
  order?: 'asc' | 'desc';
}

export interface TransactionResponse {
  data: Transaction;
}

// POST /wallet/deposit/simulate ---------------------------------------------

export interface SimulateDepositRequest {
  amount: number;
  settlementDelaySeconds: number;
}

export interface SimulateDepositPayload {
  transaction: Transaction;
  wallet: Wallet;
  estimatedCompletionAt: string;
  /** Path to poll for completion, e.g. "/wallet/transactions/txn_deposit_001". */
  pollingUrl: string;
}

export interface SimulateDepositResponse {
  data: SimulateDepositPayload;
}

// POST /wallet/withdrawals --------------------------------------------------

export interface WithdrawalRequest {
  assetSymbol: string;
  amount: number;
  address: string;
  network: string;
  pin: string;
}

export interface Withdrawal {
  id: string;
  userId: string;
  assetSymbol: string;
  amount: number;
  feeAssetAmount: number;
  address: string;
  network: string;
  status: string;
  createdAt: string;
  reviewedAt: string | null;
  reviewerNote: string | null;
}

export interface WithdrawalResponse {
  data: Withdrawal;
}

// POST /wallet/transfers ----------------------------------------------------

export interface TransferRequest {
  assetSymbol: string;
  amount: number;
  /** Email, phone, user id, or deposit address of the recipient. */
  recipient: string;
  pin: string;
}

export interface TransferRecipient {
  id: string;
  fullName: string;
  email: string;
  phone: string;
}

export interface TransferPayload {
  transfer: {
    reference: string;
    assetSymbol: string;
    amount: number;
    recipient: TransferRecipient;
  };
  transaction: Transaction;
  recipientTransaction: Transaction;
  wallet: Wallet;
}

export interface TransferResponse {
  data: TransferPayload;
}
