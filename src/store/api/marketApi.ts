import type { AssetDetails, CoinData } from '@/src/types/coin/types';
import type {
  AssetDetailsResponse,
  SupportedAssetsResponse,
  TrendingAssetsResponse,
} from '@/src/types/market/types';
import { baseApi } from './baseApi';

export const marketApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchSupportedAssets: build.query<string[], void>({
      query: () => '/market/assets',
      transformResponse: (response: SupportedAssetsResponse) =>
        response.data.map((asset) => asset.symbol),
      keepUnusedDataFor: 300,
    }),

    fetchAssetDetails: build.query<AssetDetails, string>({
      query: (arg) => `/market/assets/${arg}`,
      transformResponse: (response: AssetDetailsResponse): AssetDetails => ({
        ...response.data,
        chartData: response.data.chart.map((point) => ({
          timestamp: new Date(point.time).getTime(),
          value: point.priceUsd,
        })),
      }),
      keepUnusedDataFor: 60,
    }),

    fetchTrendingAssets: build.query<CoinData[], void>({
      query: () => '/market/trending',
      transformResponse: (response: TrendingAssetsResponse) => response.data,
      keepUnusedDataFor: 60,
    }),
  }),
});

export const {
  useFetchSupportedAssetsQuery,
  useFetchAssetDetailsQuery,
  useFetchTrendingAssetsQuery,
} = marketApi;
