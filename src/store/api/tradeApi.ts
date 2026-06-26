import type {
  CreateQuoteRequest,
  ExecuteTradeRequest,
  ExecuteTradeResponse,
  ExecuteTradeResult,
  TradeQuote,
  TradeQuoteResponse,
} from '@/src/types/trade/types';
import { baseApi } from './baseApi';

export const tradeApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createQuote: build.mutation<TradeQuote, CreateQuoteRequest>({
      query: (body) => ({
        url: '/trade/quotes',
        method: 'POST',
        body,
      }),
      transformResponse: (response: TradeQuoteResponse) => response.data,
    }),

    getQuote: build.query<TradeQuote, string>({
      query: (quoteId) => `/trade/quotes/${quoteId}`,
      transformResponse: (response: TradeQuoteResponse) => response.data,
    }),

    executeTrade: build.mutation<ExecuteTradeResult, ExecuteTradeRequest>({
      query: (body) => ({
        url: '/trade/execute',
        method: 'POST',
        body,
      }),
      transformResponse: (response: ExecuteTradeResponse) => response.data,
      invalidatesTags: ['Wallet', 'Transaction'],
    }),
  }),
});

export const {
  useCreateQuoteMutation,
  useGetQuoteQuery,
  useExecuteTradeMutation,
} = tradeApi;
