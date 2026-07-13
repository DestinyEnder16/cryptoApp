import type {
  CreatePriceAlertRequest,
  CreatePriceAlertResponse,
  DeletePriceAlertResponse,
  PriceAlert,
  PriceAlertsResponse,
  UpdatePriceAlertRequest,
  UpdatePriceAlertResponse,
  UpdatedPriceAlert,
} from '@/src/features/alerts/types/alerts';
import { baseApi } from '@/src/store/baseApi';

export const alertApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchPriceAlerts: build.query<PriceAlertsResponse, void>({
      query: () => '/me/price-alerts',
      providesTags: ['PriceAlert'],
    }),
    createPriceAlert: build.mutation<PriceAlert, CreatePriceAlertRequest>({
      query: (body) => ({ url: '/me/price-alerts', method: 'POST', body }),
      transformResponse: (r: CreatePriceAlertResponse) => r.data,
      invalidatesTags: ['PriceAlert'],
    }),
    updatePriceAlert: build.mutation<
      UpdatedPriceAlert,
      { alertId: string; body: UpdatePriceAlertRequest }
    >({
      query: ({ alertId, body }) => ({
        url: `/me/price-alerts/${alertId}`,
        method: 'PATCH',
        body,
      }),
      transformResponse: (r: UpdatePriceAlertResponse) => r.data,
      invalidatesTags: ['PriceAlert'],
    }),
    deletePriceAlert: build.mutation<boolean, string>({
      query: (alertId) => ({
        url: `/me/price-alerts/${alertId}`,
        method: 'DELETE',
      }),
      transformResponse: (r: DeletePriceAlertResponse) => r.data.deleted,
      invalidatesTags: ['PriceAlert'],
    }),
  }),
});

export const {
  useFetchPriceAlertsQuery,
  useCreatePriceAlertMutation,
  useUpdatePriceAlertMutation,
  useDeletePriceAlertMutation,
} = alertApi;
