import type { AssetDetailsData, Candle, CoinData } from "../coin/types";

export interface SupportedAssetsResponse {
  data: CoinData[];
}

export interface AssetDetailsResponse {
  data: AssetDetailsData;
}

export interface TrendingAssetsResponse {
  data: CoinData[];
}

export interface CandlesResponse {
  data: Candle[];
  meta: {
    count: number;
    symbol: string;
    interval: string;
  };
}

export interface OrderBookLevel {
  priceUsd: number;
  amount: number;
  total: number;
}

export interface OrderBook {
  midPriceUsd: number;
  spreadUsd: number;
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
}

export interface OrderBookResponse {
  data: OrderBook;
  meta: { symbol: string; levels: number };
}

export interface MarketTrade {
  id: string;
  side: 'buy' | 'sell';
  priceUsd: number;
  amount: number;
  totalUsd: number;
  createdAt: string;
}

export interface MarketTradesResponse {
  data: MarketTrade[];
  meta: { count: number; symbol: string };
}
