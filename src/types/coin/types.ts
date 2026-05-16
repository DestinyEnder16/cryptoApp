export interface CoinData {
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

export interface ChartPoint {
  time: string;
  priceUsd: number;
}

export interface ChartDatum {
  timestamp: number;
  value: number;
}

export interface AssetDetails extends CoinData {
  chart: ChartPoint[];
  chartData: ChartDatum[];
}
