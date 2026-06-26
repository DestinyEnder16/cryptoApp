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

export interface CreatePriceAlertRequest {
  assetSymbol: string;
  direction: PriceAlertDirection;
  targetPriceUsd: number;
}

export interface CreatePriceAlertResponse {
  data: PriceAlert;
}

export interface UpdatePriceAlertRequest {
  direction?: PriceAlertDirection;
  targetPriceUsd?: number;
  isActive?: boolean;
}

export interface UpdatedPriceAlert {
  id: string;
  assetSymbol: string;
  direction: PriceAlertDirection;
  targetPriceUsd: number;
  isActive: boolean;
  triggeredAt: string | null;
}

export interface UpdatePriceAlertResponse {
  data: UpdatedPriceAlert;
}

export interface DeletePriceAlertResponse {
  data: { deleted: boolean };
}
