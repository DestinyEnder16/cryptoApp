export interface WatchlistAsset {
  id: string;
  symbol: string;
  name: string;
  network: string;
  priceUsd: number;
  change24h: number;
  isActive: boolean;
  minBuyUsd: number;
  minSellUsd: number;
  iconUrl: string;
}

export interface WatchlistResponse {
  data: WatchlistAsset[];
  meta: {
    count: number;
  };
}
