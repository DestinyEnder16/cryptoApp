import type { PriceAlertsResponse } from '@/src/types/alerts/types';
import { baseApi } from './baseApi';

export const alertApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchPriceAlerts: build.query<PriceAlertsResponse, void>({
      query: () => '/me/price-alerts',
    }),
  }),
});

export const { useFetchPriceAlertsQuery } = alertApi;
