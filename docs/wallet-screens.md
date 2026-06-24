# How the Wallet Screens Work

The goal: give the **Wallets** tab a full experience — portfolio overview + history, a deposit flow, a withdraw flow, and a transactions list/detail. Read data (balances, portfolio, deposit addresses, transactions) comes from the wallet API; only the deposit-simulate and withdraw flows stay client-side as sandbox until their mutations exist.

> For how the API itself is wired (endpoints, caching, the transaction "describe" layer), see [wallet-api.md](wallet-api.md). This doc covers the **screen/navigation** structure.

## The moving parts

| Piece | File | What it does |
|---|---|---|
| API hooks | `src/store/api/walletApi.ts` | The five `GET` wallet endpoints the screens read from |
| Sandbox constants | `src/data/sandboxWallet.ts` | What the API doesn't model yet: settlement-delay picker + flat withdrawal fee |
| Shared UI atoms | `src/components/wallet/` | `WalletField` (boxed label+value/input), `WalletAssetRow`, `TransactionRow`, `CoinBadge`, `WalletNote` |
| Screen UIs | `src/components/screens/wallet/` | One component per screen (`WalletHomeScreen`, `DepositAddressScreen`, …) |
| Route files | `src/app/(tabs)/wallet/**` | Thin wrappers that just render the matching screen component |
| Real data reused | `useVerification()` (limits), `LineChartView` | KYC withdrawal limits, the portfolio chart |

## The mental model

**Route files only route.** Following the KYC pattern, each file under `app/(tabs)/wallet/` is a 3-line wrapper (e.g. `main.tsx` → `<WalletHomeScreen />`). All UI lives in `src/components/screens/wallet/`. This keeps navigation and presentation separate and makes the route tree easy to scan.

**Screens read from API hooks.** Each screen calls a `useGet…Query` hook and renders a loading state while it resolves. Cross-screen flow values (chosen asset, amount, address) are still passed as **expo-router route params** and read with `useLocalSearchParams` — no global state needed.

## The flows — step by step

- **Home** (`/wallet/main`): portfolio card → `/wallet/portfolio`; Deposit/Withdraw/Trade actions; balances list; recent transactions → `/wallet/transactions/[id]`.
- **Deposit**: `/wallet/deposit` (pick asset) → `/wallet/deposit/address?asset=` (QR + copy address) → `/wallet/deposit/simulate?asset=` (amount + delay → toast, `router.dismissTo('/wallet/main')`).
- **Withdraw**: `/wallet/withdraw` (form, limit from `useVerification`) → `/wallet/withdraw/confirm?…` (review + 4-digit PIN gates submit) → `/wallet/withdraw/submitted` → `View transaction`.
- **Transactions**: `/wallet/transactions` (All/Deposits/Withdrawals filter applied server-side via the `type` param) → `/wallet/transactions/[id]` (detail picks the entry out of the cached list — see [wallet-api.md](wallet-api.md)).

All navigation stays **inside the wallet stack** (`Stack` in `_layout.tsx`), which avoids the cross-navigator mount crash documented elsewhere. The KYC gate in `wallet/index.tsx` still decides `main` vs `locked`; these screens sit behind `main`.

## Note on typed routes

`typedRoutes` is enabled, so adding/renaming a wallet route means the generated `.expo/types/router.d.ts` must refresh (it does automatically when Metro runs). Until then, `tsc` may flag the new route strings.

## In one sentence

Thin route files render screen components that draw from the wallet API hooks (falling back to a tiny `sandboxWallet.ts` for the simulate/withdraw flows) and pass flow state through route params, all within the wallet stack.
