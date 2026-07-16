# How Routing & Tab Navigation Work

The goal: keep the `app/` tree a thin **routing layer** (feature UI lives in `src/features/**/screens/`), and make cross-tab deep navigation behave — so a deep screen always has a way back to its tab's home, without letting an unverified user slip past a KYC gate.

This doc covers three intertwined things: the route→screen convention, the tab-stack **anchor** that fixes deep-link back behavior, and how that anchor interacts with the KYC-gated tabs.

## The moving parts

| Piece | File | What it does |
|---|---|---|
| Route files | `src/app/**` | Thin wrappers — each renders one screen component and nothing else |
| Screen components | `src/features/<feature>/screens/` | All screen UI + logic (e.g. `CoinDetailScreen`, `TradeFormScreen`) |
| Tab bar | `src/app/(tabs)/_layout.tsx` | The 5 tabs; `backBehavior="history"` |
| Per-tab stacks | `src/app/(tabs)/<tab>/_layout.tsx` | A `Stack` per tab; some export `unstable_settings` |
| KYC hook | `src/features/kyc/hooks/useVerification.ts` | `isKycApproved` / `isLoading` from `/me` |
| Locked screens | `TradesLockedScreen`, `WalletLockedScreen` | The "verify to continue" UI shown to unverified users |

## Route files only route

Every file under `src/app/` is a wrapper that renders its feature screen:

```tsx
// src/app/(tabs)/profile/edit.tsx
import EditProfileScreen from '@/src/features/profile/screens/EditProfileScreen';

export default function EditProfileRoute() {
  return <EditProfileScreen />;
}
```

The matching UI lives in `src/features/profile/screens/EditProfileScreen.tsx`. This holds across **every** feature (auth, home, markets, notifications, profile, alerts, onboarding, trades, wallet). The only files in `app/` that contain logic instead of a wrapper are the routing primitives: `_layout.tsx` navigators, the `index.tsx` **redirect gates** (e.g. `trades/index` → `main`/`locked` by KYC), and the root splash placeholder.

Why: screens read their own route params with `useLocalSearchParams`, so the wrapper never needs props — which keeps the route tree scannable and lets features own their UI.

## The anchor: fixing deep-link back behavior

**The bug it fixes.** Tapping *Buy* on a coin runs `router.navigate('/trades/buy')` — a cross-tab jump *into* the Trades stack. Without an anchor, Expo Router seeds that stack with **only** the deep screen (`[buy]`). It has no root beneath it, so:

- Back has nothing to pop and falls through to the tabs' `backBehavior="history"`, dumping you on the previous tab.
- The tab keeps that rootless stack, so re-tapping it strands you on the deep screen with no route to the tab's home.

**The fix.** Declare the tab's home as the stack **anchor** in its `_layout.tsx`:

```tsx
export const unstable_settings = {
  initialRouteName: 'index',
};
```

`unstable_settings` is a *magic module export* — you never reference it; Expo Router reads it off the layout module (the same way it reads `default`) and passes `initialRouteName` to the underlying React Navigation stack. With it set, deep-linking to `/markets/watchlist` seeds `[index, watchlist]` instead of `[watchlist]`, so back reaches the tab home and the tab stays navigable.

Applied as:

| Tab | Anchor | Why |
|---|---|---|
| `profile` | `index` | `index` is a real screen (`ProfileHomeScreen`) |
| `markets` | `index` | `index` is a real screen (`MarketsHomeScreen`) |
| `trades` | `main` | `index` is a **KYC redirect gate**, not a real screen |
| `wallet` | `main` | `index` is a **KYC redirect gate**, not a real screen |

**Why gated tabs anchor at `main`, not `index`.** `trades/index` and `wallet/index` render `<Redirect href=… />` based on KYC. If you anchored on `index`, deep-linking `/trades/buy` would mount `index` beneath it, fire its redirect, and **replace the `buy` screen you were navigating to** — a poisoned anchor. `main` is the real tab home and never redirects, so it's a safe anchor.

## KYC gating on the trade tab

The anchor introduces a wrinkle: because `main` sits at the base of the Trades stack, an unverified user could reach it via the back stack (e.g. `index` redirects them to `locked`, leaving `[main, locked]`; backing out of `locked` would land on `main`). So trades is gated at **two levels**:

1. **Entry gate** — `CoinDetailScreen.goToTrade()` checks `isKycApproved`; unverified users go to `/trades/locked` instead of the trade form.
2. **Content gate** — `TradeFormScreen` and `TradeMainScreen` call `useVerification()` and, when not approved, render `<TradesLockedScreen />` **inline** (not a redirect). Rendering inline holds no matter how the screen ended up in the stack — direct deep-link, or mounted beneath the anchor — with no navigation side effects to fight the anchor.

While `useVerification()` is still loading (`/me` unresolved) the content gate shows a spinner rather than flashing trade UI. In practice `/me` is already cached by the time you reach these screens, so the check resolves immediately.

> Note: the ungated path was real — the coin-detail Buy/Sell/Swap buttons and `TradeFormScreen` had **no** KYC check; only `trades/index` did, and deep links skipped it. The two gates above close that.

## In one sentence

`app/` files just route to `features/**/screens` components; each tab stack names an anchor via `unstable_settings.initialRouteName` (`index` for plain tabs, `main` for the KYC-gated trades/wallet tabs) so deep links stay navigable, and the trade screens gate on `isKycApproved` at both the entry and content level so the anchor can't leak trade UI to unverified users.
