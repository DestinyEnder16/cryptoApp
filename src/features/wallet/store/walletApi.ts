import type {
  DepositAddress,
  DepositAddressResponse,
  DepositAddressesResponse,
  PortfolioHistoryResponse,
  PortfolioRange,
  SimulateDepositPayload,
  SimulateDepositRequest,
  SimulateDepositResponse,
  Transaction,
  TransactionListParams,
  TransactionResponse,
  TransactionsResponse,
  TransferPayload,
  TransferRequest,
  TransferResponse,
  Withdrawal,
  WithdrawalRequest,
  WithdrawalResponse,
  WalletOverview,
  WalletResponse,
} from '@/src/features/wallet/types/wallet';
import { baseApi } from '@/src/store/baseApi';

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

    getTransactionById: build.query<Transaction, string>({
      query: (id) => `/wallet/transactions/${id}`,
      transformResponse: (response: TransactionResponse) => response.data,
    }),

    simulateDeposit: build.mutation<SimulateDepositPayload, SimulateDepositRequest>({
      query: (body) => ({
        url: '/wallet/deposit/simulate',
        method: 'POST',
        body,
      }),
      transformResponse: (response: SimulateDepositResponse) => response.data,
      // Tags invalidated after the polled tx completes, not here — the screen
      // calls invalidatesTags manually once polling confirms 'completed'.
    }),

    requestWithdrawal: build.mutation<Withdrawal, WithdrawalRequest>({
      query: (body) => ({
        url: '/wallet/withdrawals',
        method: 'POST',
        body,
      }),
      transformResponse: (response: WithdrawalResponse) => response.data,
      invalidatesTags: ['Wallet', 'Transaction'],
    }),

    createTransfer: build.mutation<TransferPayload, TransferRequest>({
      query: (body) => ({
        url: '/wallet/transfers',
        method: 'POST',
        body,
      }),
      transformResponse: (response: TransferResponse) => response.data,
      invalidatesTags: ['Wallet', 'Transaction'],
    }),
  }),
});

export const {
  useGetWalletQuery,
  useGetPortfolioHistoryQuery,
  useGetDepositAddressesQuery,
  useGetDepositAddressQuery,
  useGetTransactionsQuery,
  useGetTransactionByIdQuery,
  useSimulateDepositMutation,
  useRequestWithdrawalMutation,
  useCreateTransferMutation,
} = walletApi;
