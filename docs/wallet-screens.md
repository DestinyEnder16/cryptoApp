# How the Wallet Sandbox Screens Work

The goal: give the **Wallets** tab a full sandbox experience — portfolio overview + history, a deposit flow, a withdraw flow, and a transactions list/detail — without a wallet backend. Everything reads from one local data module, so a real API can replace it later without touching the screens.

## The moving parts

| Piece | File | What it does |
|---|---|---|
| Sandbox data | `src/data/sandboxWallet.ts` | Single source of truth: assets/balances, portfolio chart + history, transactions, deposit address/network, settlement delays, fee. Plus `getTransactionById`. |
| Shared UI atoms | `src/components/wallet/` | `WalletField` (boxed label+value/input), `WalletAssetRow`, `TransactionRow`, `CoinBadge`, `WalletNote` |
| Screen UIs | `src/components/screens/wallet/` | One component per screen (`WalletHomeScreen`, `DepositAddressScreen`, …) |
| Route files | `src/app/(tabs)/wallet/**` | Thin wrappers that just render the matching screen component |
| Real data reused | `useVerification()` (limits), `LineChartView`, `StatusRow`, `NumInputField` | KYC withdrawal limits, the chart, label/value rows, PIN entry |

## The mental model

**Route files only route.** Following the KYC pattern, each file under `app/(tabs)/wallet/` is a 3-line wrapper (e.g. `main.tsx` → `<WalletHomeScreen />`). All UI lives in `src/components/screens/wallet/`. This keeps navigation and presentation separate and makes the route tree easy to scan.

**Data lives in one place.** Screens import from `sandboxWallet.ts` rather than hardcoding values. Cross-screen flow values (chosen asset, amount, address) are passed as **expo-router route params** and read with `useLocalSearchParams` — no global state needed.

## The flows — step by step

- **Home** (`/wallet/main`): portfolio card → `/wallet/portfolio`; Deposit/Withdraw/Trade actions; balances list; recent transactions → `/wallet/transactions/[id]`.
- **Deposit**: `/wallet/deposit` (pick asset) → `/wallet/deposit/address?asset=` (QR + copy address) → `/wallet/deposit/simulate?asset=` (amount + delay → toast, `router.dismissTo('/wallet/main')`).
- **Withdraw**: `/wallet/withdraw` (form, limit from `useVerification`) → `/wallet/withdraw/confirm?…` (review + 4-digit PIN gates submit) → `/wallet/withdraw/submitted` → `View transaction`.
- **Transactions**: `/wallet/transactions` (All/Deposits/Withdrawals filter) → `/wallet/transactions/[id]` (detail via `getTransactionById`).

All navigation stays **inside the wallet stack** (`Stack` in `_layout.tsx`), which avoids the cross-navigator mount crash documented elsewhere. The KYC gate in `wallet/index.tsx` still decides `main` vs `locked`; these screens sit behind `main`.

## Note on typed routes

`typedRoutes` is enabled, so adding/renaming a wallet route means the generated `.expo/types/router.d.ts` must refresh (it does automatically when Metro runs). Until then, `tsc` may flag the new route strings.

## In one sentence

Thin route files render screen components that draw from a single `sandboxWallet.ts` data module and pass flow state through route params, all within the wallet stack.
