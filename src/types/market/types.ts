import type { AssetDetails, CoinData } from "../coin/types";

export interface SupportedAssetsResponse {
  data: CoinData[];
}

export interface AssetDetailsResponse {
  data: Omit<AssetDetails, "chartData">;
}

export interface TrendingAssetsResponse {
  data: CoinData[];
}
