import type { WatchlistResponse } from '@/src/types/watchlist/types';
import { baseApi } from './baseApi';

export const watchListApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchWatchlist: build.query<WatchlistResponse, void>({
      query: () => '/me/watchlist',
    }),
  }),
});

export const { useFetchWatchlistQuery } = watchListApi;
