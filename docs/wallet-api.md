# How the Wallet API Wiring Works

The goal: feed the **Wallets** tab from the real wallet API — balances, portfolio value + history, deposit addresses, transactions, and now the simulate-deposit and withdrawal flows are backed by real mutations.

## The moving parts

| Piece | File | What it does |
|---|---|---|
| Endpoints | `src/store/api/walletApi.ts` | All 9 wallet endpoints (5 queries + 4 mutations), injected into `baseApi` |
| Types | `src/types/wallet/types.ts` | Response shapes (`WalletOverview`, `Transaction`, `Withdrawal`, `TransferPayload`, …) |
| Transaction display | `src/helpers/describeTransaction.ts` | Turns a raw transaction into title/sign/color |
| Amount + date format | `src/helpers/formatAmount.ts`, `src/helpers/formatTxDate.ts` | Unit/date formatting shared across screens |
| Screen UIs | `src/components/screens/wallet/` | Consume the hooks; render loading/empty/error states |
| Shared atoms | `src/components/wallet/WalletAssetRow`, `TransactionRow` | Presentational rows fed by the API data |
| Sandbox-only | `src/data/sandboxWallet.ts` | Settlement-delay picker (UI only — sent as `settlementDelaySeconds` to the real API) |

## All endpoints

Every query and mutation runs through `baseApi`'s auth + token-refresh wrapper.

| Hook | Endpoint | Type | What it returns / does |
|---|---|---|---|
| `useGetWalletQuery` | `GET /wallet` | query | `WalletOverview` — balances, addresses, portfolio value, verification |
| `useGetPortfolioHistoryQuery(range)` | `GET /wallet/portfolio/history?range=` | query | Chart points + meta (kept whole for the summary card) |
| `useGetDepositAddressesQuery` | `GET /wallet/deposit-addresses` | query | `DepositAddress[]` |
| `useGetDepositAddressQuery(symbol)` | `GET /wallet/deposit-addresses/{symbol}` | query | One `DepositAddress` with real `address` + `qrPayload` |
| `useGetTransactionsQuery(params)` | `GET /wallet/transactions` | query | `Transaction[]`, filter/sort via params |
| `useGetTransactionByIdQuery(id)` | `GET /wallet/transactions/{id}` | query | One `Transaction` |
| `useSimulateDepositMutation` | `POST /wallet/deposit/simulate` | mutation | `SimulateDepositPayload` — created tx + updated wallet + `pollingUrl` |
| `useRequestWithdrawalMutation` | `POST /wallet/withdrawals` | mutation | `Withdrawal` object (distinct from a `Transaction`) |
| `useCreateTransferMutation` | `POST /wallet/transfers` | mutation | `TransferPayload` — transfer record + both-sides transactions + updated wallet |

Queries are tagged `Wallet` or `Transaction`. `requestWithdrawal` and `createTransfer` auto-invalidate both tags on success so balances and history refetch. `simulateDeposit` does not auto-invalidate — the screen waits for the polled transaction to reach `completed` first, then invalidates manually (see below).

## Things worth understanding

### 1. The transaction "describe" layer

The API transaction is raw: a `type`, a `status`, and up to two legs (`fromAsset`/`fromAmount` → `toAsset`/`toAmount`). The UI needs a **title**, a **signed amount string**, and a **color direction**. `describeTransaction(tx)` computes all three in one place:

- **Direction** drives color: `deposit`/`sell` → credit (green); `withdrawal`/`buy` → debit (red); `swap`/`transfer` → neutral (white).
- **Title**: `"ETH → USDC swap"`, `"USDT deposit"`, `"Buy BTC"`, etc.
- **Amount**: compact for list rows (`+250 USDT`), fuller on detail (`0.1 ETH → 306.12 USDC` for swaps).

Both `TransactionRow` and `TransactionDetailsScreen` call this, so they always agree on sign and label.

### 2. Simulate deposit → polling

The API creates a deposit in `pending` state and returns a `pollingUrl` like `/wallet/transactions/txn_deposit_001`. The screen:

1. Calls `simulateDeposit` with `{ amount, settlementDelaySeconds }`.
2. Extracts the transaction id from `pollingUrl` (last path segment).
3. Sets `pollingId`, which activates `useGetTransactionByIdQuery(pollingId, { pollingInterval: 2000 })`.
4. RTK Query refetches every 2 seconds.
5. A `useEffect` watches `polledTx.status`. When it becomes `'completed'`:
   - Calls `dispatch(walletApi.util.invalidateTags(['Wallet', 'Transaction']))` to refresh balances and the tx list.
   - Shows a success toast.
   - Navigates to `/wallet/main`.

The polling stops naturally when the component unmounts (either on navigation or if the user goes back manually). The `settlementDelaySeconds` picker in the UI maps directly to the API field — the sandbox delay is no longer just cosmetic.

### 3. Withdrawal flow

`ConfirmWithdrawalScreen` reads the `amount`, `address`, `asset`, and `network` from route params (set in `WithdrawScreen`), gates on a 4-digit PIN (UX only — the current withdrawal endpoint doesn't take a PIN in the request body), then calls `requestWithdrawal`. On success it navigates to `WithdrawalSubmittedScreen` passing the real API data (`wd.feeAssetAmount`, `wd.id` as the reference, `wd.createdAt`) as route params. `WithdrawalSubmittedScreen` reads these directly — no more hardcoded fee or reference.

> **Note:** The `Withdrawal` response is a separate object from `Transaction`. It has `feeAssetAmount` rather than `feeAmount`, and an `id` that serves as the reference. The withdrawal won't appear in the transaction list immediately — that's driven by the server creating the matching transaction record.

### 4. Transfer (endpoint available, screen not yet built)

`POST /wallet/transfers` takes `{ assetSymbol, amount, recipient, pin }` and returns both the sender and recipient transaction records plus the updated wallet. The hook `useCreateTransferMutation` is wired and ready. No transfer screen exists yet — add it when the UI spec arrives.

### 5. Portfolio history → chart

`LineChartView` wants `{ timestamp, value }[]`. The endpoint returns `{ time, valueUsd, … }[]` plus a `meta` block. The screen maps `time → new Date(time).getTime()` and `valueUsd → value`, and reads `meta.latestValueUsd` for the summary card. The period buttons (`1D/1W/1M/1Y`) change the `range` argument — RTK Query caches each range separately. The home screen reuses the `1D` cache to derive today's change % (`(latest - first) / first`).

## What the API doesn't carry (yet)

`GET /wallet` balances give `{ assetSymbol, available, locked }` — no friendly name and no per-asset USD value (only the portfolio total is in USD). The balances list shows symbol + available units with locked as a caption. `WalletAssetRow` accepts `value`/`caption`, so richer balance data slots in without structural change.

## In one sentence

Nine wallet hooks (5 queries + 4 mutations) feed every wallet screen; `simulateDeposit` drives a real pending→completed polling cycle; `requestWithdrawal` replaces the old client-only flow and passes live fee/reference data to the submitted screen; and `createTransfer` is wired and waiting for its screen.
