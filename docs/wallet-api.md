# How the Wallet API Wiring Works

The goal: feed the **Wallets** tab from the real wallet API instead of local mock data — balances, portfolio value + history, deposit addresses, and transactions all come from the server, while a couple of sandbox-only flows stay client-side until the API covers them.

## The moving parts

| Piece | File | What it does |
|---|---|---|
| Endpoints | `src/store/api/walletApi.ts` | The five `GET` wallet endpoints, injected into `baseApi` |
| Types | `src/types/wallet/types.ts` | Response shapes (`WalletOverview`, `Transaction`, …) |
| Transaction display | `src/helpers/describeTransaction.ts` | Turns a raw transaction into title/sign/color |
| Amount + date format | `src/helpers/formatAmount.ts`, `src/helpers/formatTxDate.ts` | Unit/date formatting shared across screens |
| Screen UIs | `src/components/screens/wallet/` | Consume the hooks; render loading/empty states |
| Shared atoms | `src/components/wallet/WalletAssetRow`, `TransactionRow` | Presentational rows fed by the API data |
| Still sandbox | `src/data/sandboxWallet.ts` | Settlement-delay picker + flat withdrawal fee only |

## The endpoints

All five are read-only queries on `baseApi` (so they inherit the auth + token-refresh wrapper). They are tagged `Wallet` / `Transaction` so a future deposit/withdraw **mutation** can invalidate and refetch.

| Hook | Endpoint | Returns |
|---|---|---|
| `useGetWalletQuery` | `GET /wallet` | `WalletOverview` — balances, deposit addresses, portfolio value, verification |
| `useGetPortfolioHistoryQuery(range)` | `GET /wallet/portfolio/history?range=` | Chart points **+ meta** (kept whole) |
| `useGetDepositAddressesQuery` | `GET /wallet/deposit-addresses` | `DepositAddress[]` |
| `useGetDepositAddressQuery(symbol)` | `GET /wallet/deposit-addresses/{symbol}` | One `DepositAddress` |
| `useGetTransactionsQuery(params)` | `GET /wallet/transactions` | `Transaction[]` (filter/sort via params) |

Each is cached **per argument**: `getPortfolioHistory('1M')` and `getPortfolioHistory('1D')` are separate cache entries, and the transactions list caches separately per filter object.

## Three things worth understanding

### 1. The transaction "describe" layer

The API transaction is raw: a `type`, a `status`, and up to two legs (`fromAsset`/`fromAmount` → `toAsset`/`toAmount`). The UI needs a **title**, a **signed amount**, and a **color**. Rather than scatter that logic across the row and the detail screen, `describeTransaction(tx)` computes it once:

- **Direction** drives color. `deposit`/`sell` read as **credit** (green), `withdrawal`/`buy` as **debit** (red), and `swap`/`transfer` as **neutral** (a wash — one asset becomes another).
- **Title** is built from the type and assets, e.g. `"ETH → USDC swap"`, `"USDT deposit"`, `"Buy BTC"`.
- **Amount** is compact for list rows (`+250 USDT`) and fuller on the detail screen, where a swap shows both legs (`0.1 ETH → 306.12 USDC`).

The row and the detail screen both call this, so they can never disagree on sign or label.

### 2. Portfolio history → chart points

`LineChartView` wants `{ timestamp, value }[]`. The endpoint returns `{ time, valueUsd, … }[]` plus a `meta` block. The screen maps `time → Date(time).getTime()` and `valueUsd → value`, and reads `meta.latestValueUsd` for the summary. The period buttons (`1D/1W/1M/1Y`) just change the `range` argument — RTK Query refetches and caches each range. The same trick powers the **"today" change** on the home screen: it reads the `1D` series and compares the first point to the latest value.

> We keep the **whole** history response (`data` + `meta`) instead of transforming to bare points, because the summary card and the change badge both need `meta`.

### 3. Transaction detail with no by-id endpoint

There is no `GET /wallet/transactions/{id}` yet. The detail screen reuses the list cache with `selectFromResult` and finds the entry by id:

```ts
const { tx } = useGetTransactionsQuery(
  { order: 'desc' },
  { selectFromResult: ({ data }) => ({ tx: data?.find((t) => t.id === id) }) },
);
```

If the list is already cached (you tapped in from the list), this is instant — no extra request. On a cold deep-link it fetches the list once, then resolves. When a by-id endpoint ships, this screen swaps to it without other changes.

## What is still sandbox / client-only

The provided endpoints are **read-only**. Two flows have no server action yet, so they stay client-side and are clearly labeled "sandbox" in the UI:

- **Simulate deposit** — the settlement-delay picker and the success toast (`SETTLEMENT_DELAYS`).
- **Withdraw confirm → submitted** — the PIN gate, the flat fee preview (`WITHDRAWAL_FEE_USDT`), and the generated reference.

These read from `sandboxWallet.ts`, now trimmed to just those two constants. When deposit/withdraw mutation endpoints arrive, they replace these and invalidate the `Wallet` / `Transaction` tags to refresh balances and history.

## A note on the data the API doesn't carry

`GET /wallet` balances give `{ assetSymbol, available, locked }` — no friendly name and **no per-asset USD value** (only the portfolio total is in USD). So the balances list shows the symbol and the available units (with locked as a caption) rather than a fabricated dollar figure per asset. When richer balance data arrives, `WalletAssetRow` already accepts a `value`/`caption` and can show it without structural change.

## In one sentence

Five cached `GET` hooks feed the wallet screens; a single `describeTransaction` helper normalizes transactions for display, the portfolio history response powers both the chart and the change badge, and only the deposit-simulate and withdraw flows remain client-side until their mutations exist.
