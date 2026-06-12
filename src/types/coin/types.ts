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

export interface AssetStats {
  marketCapUsd: number;
  volume24hUsd: number;
  circulatingSupply: number;
  maxSupply: number | null;
  allTimeHighUsd: number;
  high24hUsd: number;
  low24hUsd: number;
  volumeToMarketCapRatio: number;
  about: string;
  websiteUrl: string;
  explorerUrl: string;
}

export interface AssetDetails extends CoinData {
  stats: AssetStats;
  chart: ChartPoint[];
  chartData: ChartDatum[];
}

export interface Candle {
  time: string;
  openUsd: number;
  highUsd: number;
  lowUsd: number;
  closeUsd: number;
  volume: number;
}
