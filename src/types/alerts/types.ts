export type PriceAlertDirection = 'above' | 'below';

export interface PriceAlertAsset {
  symbol: string;
  name: string;
}

export interface PriceAlert {
  id: string;
  userId: string;
  assetSymbol: string;
  direction: PriceAlertDirection;
  targetPriceUsd: number;
  isActive: boolean;
  triggeredAt: string | null;
  createdAt: string;
  asset: PriceAlertAsset;
}

export interface PriceAlertsResponse {
  data: PriceAlert[];
  meta: {
    count: number;
    active: number;
  };
}
