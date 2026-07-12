// NOTE: Monetary values below arrive from the API as JS `number`s. Do NOT do
// arithmetic or comparisons on them with the raw operators — float rounding can
// corrupt balance checks and amounts. Route all money math through
// src/helpers/money.ts. (Migrating the wire format to decimal strings / integer
// minor units is a backend contract change tracked separately.)

export interface TradeQuote {
  id: string;
  type: 'buy' | 'sell' | 'swap';
  fromAsset: string;
  toAsset: string;
  fromAmount: number;
  toAmount: number;
  rate: number;
  feeAmount: number;
  expiresAt: string;
  expiresInSeconds: number;
  isExpired: boolean;
}

export interface TradeQuoteResponse {
  data: TradeQuote;
}

export interface CreateQuoteRequest {
  type: 'buy' | 'sell' | 'swap';
  fromAsset: string;
  toAsset: string;
  fromAmount: number;
}

export interface ExecuteTradeRequest {
  quoteId: string;
  pin: string;
}

export interface TradeTransaction {
  id: string;
  userId: string;
  type: string;
  status: string;
  fromAsset: string;
  toAsset: string;
  fromAmount: number;
  toAmount: number;
  feeAmount: number;
  rate: number;
  reference: string;
  note: string;
  createdAt: string;
  completedAt: string;
}

export interface ExecuteTradeResult {
  transaction: TradeTransaction;
  wallet: {
    id: string;
    userId: string;
    fiatCurrency: string;
    depositAddresses: unknown[];
    balances: { assetSymbol: string; available: number; locked: number }[];
  };
}

export interface ExecuteTradeResponse {
  data: ExecuteTradeResult;
}
