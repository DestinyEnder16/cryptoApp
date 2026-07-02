import type { AssetDetails, Candle, CoinData } from '@/src/types/coin/types';
import type {
  AssetDetailsResponse,
  CandlesResponse,
  MarketTrade,
  MarketTradesResponse,
  OrderBook,
  OrderBookResponse,
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

    fetchCandles: build.query<Candle[], string>({
      query: (symbol) => `/market/assets/${symbol}/candles`,
      transformResponse: (response: CandlesResponse) => response.data,
      keepUnusedDataFor: 60,
    }),

    fetchOrderBook: build.query<OrderBook, { symbol: string; levels?: number }>({
      query: ({ symbol, levels = 12 }) =>
        `/market/assets/${symbol}/order-book?levels=${levels}`,
      transformResponse: (response: OrderBookResponse) => response.data,
      keepUnusedDataFor: 30,
    }),

    fetchMarketTrades: build.query<MarketTrade[], string>({
      query: (symbol) => `/market/assets/${symbol}/trades`,
      transformResponse: (response: MarketTradesResponse) => response.data,
      keepUnusedDataFor: 30,
    }),
  }),
});

export const {
  useFetchSupportedAssetsQuery,
  useFetchAssetDetailsQuery,
  useFetchTrendingAssetsQuery,
  useFetchCandlesQuery,
  useFetchOrderBookQuery,
  useFetchMarketTradesQuery,
} = marketApi;
