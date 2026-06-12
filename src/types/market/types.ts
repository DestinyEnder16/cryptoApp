import type { AssetDetails, Candle, CoinData } from "../coin/types";

export interface SupportedAssetsResponse {
  data: CoinData[];
}

export interface AssetDetailsResponse {
  data: Omit<AssetDetails, "chartData">;
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
