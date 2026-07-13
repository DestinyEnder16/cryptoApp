# How Token Refresh Works

The goal: when a user's **access token expires mid-session**, the app should quietly get a new one and carry on — instead of failing the request or forcing a re-login.

## The problem it solves

The API hands out two tokens at login:

- **Access token** — short-lived. Sent on every request as `Authorization: Bearer <token>`.
- **Refresh token** — long-lived. Used *only* to get a new access token when the old one expires.

Before this existed, the app stored only the access token and threw the refresh token away. So the moment the access token expired, every request failed with `401 ACCESS_TOKEN_EXPIRED` until the app was relaunched.

## The moving parts

| Piece | File | What it does |
|---|---|---|
| Reauth wrapper | `src/store/baseApi.ts` | Catches `401`s, refreshes, retries the request |
| Auth state | `src/features/auth/store/authSlice.ts` | Holds `token` + `refreshToken` in memory |
| Keychain | `src/features/auth/services/nativeKeychain.ts` | Persists both tokens across app launches |
| Login screens | `handleSignin`, `SignInView`, `verification`, `verify-2fa`, `retrySignin` | Save the refresh token at login |
| Launch bootstrap | `src/app/_layout.tsx` | Restores both tokens when the app reopens |

## One important fact: refresh tokens rotate

Every call to `/auth/refresh` returns a **new** access token *and* a **new** refresh token, and **kills the old refresh token**. So we must always save the new refresh token after a refresh — if we kept using the old one, the next refresh would fail.

This is also why we need a "single-flight" guard (Step 3 below).

## The flow — step by step

### Step 1 — A request comes back 401

Every API call in the app goes through `baseQueryWithReauth` in `baseApi.ts`. It runs the request normally. If the response is anything other than `401`, it returns as-is — nothing special happens.

### Step 2 — Try to refresh

On a `401`, the wrapper:

1. Reads the refresh token (from Redux, falling back to the Keychain).
2. If there's no refresh token → gives up and logs out.
3. Calls `POST /auth/refresh` with `{ refreshToken }`.

```ts
const refreshResult = await rawBaseQuery(
  { url: 'auth/refresh', method: 'POST', body: { refreshToken } },
  api,
  extraOptions,
);
```

### Step 3 — Single-flight guard (the tricky part)

Imagine three requests fire at once and all get `401`. Without protection, all three would call `/auth/refresh` — but because tokens rotate, the first call invalidates the refresh token, so the other two fail.

To prevent this, the refresh runs inside a shared promise:

```ts
let refreshPromise: Promise<string | null> | null = null;
// ...
if (!refreshPromise) {
  refreshPromise = doTheRefresh().finally(() => { refreshPromise = null; });
}
const newAccessToken = await refreshPromise; // everyone awaits the same call
```

Only the **first** 401 actually refreshes; the others wait for that same result.

### Step 4 — Save the new tokens

If refresh succeeds, store the rotated pair everywhere:

```ts
api.dispatch(setToken(payload.accessToken));        // Redux (for live requests)
api.dispatch(setRefreshToken(payload.refreshToken)); // Redux
await saveRefreshToken(payload.refreshToken);        // Keychain (survives relaunch)
```

### Step 5 — Retry the original request

With a fresh access token in Redux, the wrapper re-runs the original request. The screen that made the call never knew anything went wrong — it just gets its data.

### Step 6 — If refresh fails → log out

If the refresh token is missing or rejected, the wrapper ends the session:

```ts
api.dispatch(logout());
api.dispatch(baseApi.util.resetApiState());
```

> **No infinite loops:** the `/auth/refresh` call is made with the raw base query, *not* through the reauth wrapper. So a `401` from refresh itself can't trigger another refresh.

## Where the tokens live

| | Access token | Refresh token |
|---|---|---|
| In memory (Redux `auth`) | ✅ `token` | ✅ `refreshToken` |
| Persisted (Keychain) | ✅ existing entry | ✅ separate entry |
| Restored on launch | `_layout.tsx` | `_layout.tsx` |

The refresh token uses its **own** Keychain entry (`com.tminus.crypto.refresh`) so existing code that reads the access-token entry keeps working unchanged.

## One gotcha for existing users

Users who logged in *before* this feature shipped have no saved refresh token. Their first expired-token event will fall through to logout (one re-login). Everyone who logs in after is fully covered.

## Mental model in one sentence

> Any request that 401s → refresh the token once (even if many fail at once) → save the new rotated pair → retry the request → only log out if refresh itself fails.
