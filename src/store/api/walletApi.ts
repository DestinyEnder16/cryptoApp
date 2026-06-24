import type {
  DepositAddress,
  DepositAddressResponse,
  DepositAddressesResponse,
  PortfolioHistoryResponse,
  PortfolioRange,
  Transaction,
  TransactionListParams,
  TransactionsResponse,
  WalletOverview,
  WalletResponse,
} from '@/src/types/wallet/types';
import { baseApi } from './baseApi';

export const walletApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getWallet: build.query<WalletOverview, void>({
      query: () => '/wallet',
      transformResponse: (response: WalletResponse) => response.data,
      providesTags: ['Wallet'],
    }),

    // Whole response kept (data + meta) so screens can read latest value/range.
    getPortfolioHistory: build.query<PortfolioHistoryResponse, PortfolioRange>({
      query: (range) => ({ url: '/wallet/portfolio/history', params: { range } }),
      keepUnusedDataFor: 60,
    }),

    getDepositAddresses: build.query<DepositAddress[], void>({
      query: () => '/wallet/deposit-addresses',
      transformResponse: (response: DepositAddressesResponse) => response.data,
      keepUnusedDataFor: 300,
    }),

    getDepositAddress: build.query<DepositAddress, string>({
      query: (symbol) => `/wallet/deposit-addresses/${symbol}`,
      transformResponse: (response: DepositAddressResponse) => response.data,
      keepUnusedDataFor: 300,
    }),

    getTransactions: build.query<Transaction[], TransactionListParams | void>({
      query: (params) => ({
        url: '/wallet/transactions',
        params: params ?? undefined,
      }),
      transformResponse: (response: TransactionsResponse) => response.data,
      providesTags: ['Transaction'],
    }),
  }),
});

export const {
  useGetWalletQuery,
  useGetPortfolioHistoryQuery,
  useGetDepositAddressesQuery,
  useGetDepositAddressQuery,
  useGetTransactionsQuery,
} = walletApi;
