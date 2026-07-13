import type { WatchlistResponse } from '@/src/features/markets/types/watchlist';
import { baseApi } from '@/src/store/baseApi';

interface WatchlistSymbolsResponse {
  data: string[];
}

export const watchListApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchWatchlist: build.query<WatchlistResponse, void>({
      query: () => '/me/watchlist',
      providesTags: ['Watchlist'],
    }),
    addToWatchlist: build.mutation<WatchlistSymbolsResponse, string>({
      query: (symbol) => ({
        url: `/me/watchlist/${symbol}`,
        method: 'POST',
      }),
      invalidatesTags: ['Watchlist'],
    }),
    removeFromWatchlist: build.mutation<WatchlistSymbolsResponse, string>({
      query: (symbol) => ({
        url: `/me/watchlist/${symbol}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Watchlist'],
    }),
  }),
});

export const {
  useFetchWatchlistQuery,
  useAddToWatchlistMutation,
  useRemoveFromWatchlistMutation,
} = watchListApi;
