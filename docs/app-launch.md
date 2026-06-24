# How App Launch Works

The goal: when the app cold-starts, decide **where to send the user** (onboarding, sign-in, or home) without flashing empty screens or a half-loaded UI along the way.

## The problem it solves

Two things need to be ready before the first real screen can render, and **both are asynchronous**:

1. **The persisted profile** has to be read back off disk. Redux starts empty every launch; the saved `profile` slice lives in AsyncStorage and takes at least a tick to load.
2. **The session has to be resolved** — is there a valid token? does it still work? does the user need a biometric check? — before we know which route to land on.

If we rendered the app immediately, the user would see an empty profile pop into place, and the screen would jump to the right route a moment later. The launch flow holds the native splash screen up over *both* waits so the first thing the user sees is the correct, fully-loaded screen.

## The moving parts

| Piece | File | What it does |
|---|---|---|
| Persisted profile | `src/store/index.ts` | Only the `profile` slice is wrapped in `persistReducer` (AsyncStorage) |
| Persistor | `src/store/index.ts` | `persistStore(store)` reads the profile back and fires `REHYDRATE` |
| `PersistGate` | `src/app/_layout.tsx` | Renders nothing until rehydration finishes |
| `AuthBootstrap` | `src/app/_layout.tsx` | Resolves the session and picks the landing route |
| Keychain | `src/services/nativeKeychain.ts` | Source of truth for "is there a token" (not the persisted profile) |
| Splash screen | `expo-router` `SplashScreen` | Kept up over the whole sequence; hidden only at the end |

## One important fact: only `profile` is persisted

Everything else in the store — `auth`, `user`, `coin`, `kyc`, and the RTK Query cache — is in-memory and starts empty on every launch. So `PersistGate` is really gating on **one** slice: the cached profile. That's why the gate is fast (a single small read) and why auth state is rebuilt from the Keychain rather than restored from disk.

## The flow — step by step

### Step 1 — Fonts load, splash stays up

`SplashScreen.preventAutoHideAsync()` runs at module load, so the native splash never auto-dismisses. `RootLayout` returns `null` until the custom fonts finish loading. The splash covers this.

### Step 2 — `PersistGate` waits for rehydration

`persistStore(store)` kicks off an async read of the persisted `profile` from AsyncStorage and dispatches `REHYDRATE` when it lands. `<PersistGate loading={null}>` renders nothing until that completes, then mounts its children. `loading={null}` is fine here because the splash is still up — there's nothing to show yet anyway.

### Step 3 — `AuthBootstrap` resolves the session

Once mounted, `AuthBootstrap` runs `bootstrap()` to decide the route:

1. **No Keychain credentials** → `/onboarding`.
2. **Token exists** → hydrate Redux (`setToken`, and `setRefreshToken` if present) so the next request carries the `Bearer` header.
3. **Validate the token** by calling `fetchMe`:
   - **Auth error** → `signOut` wipes the Keychain, Redux, and persisted profile → `/(auth)/auth`.
   - **Other error** (e.g. offline) → log a warning → `/(auth)/auth`.
4. **Biometric gate** — only if the user opted in *and* the device has biometrics enrolled:
   - **Passed** → `/(tabs)/home`.
   - **Failed/cancelled** → `/(auth)/welcome` (which has a password fallback).
5. **Otherwise** → `/(tabs)/home`.

While this runs, `AuthBootstrap` returns `null` (no `target` yet), so the splash is *still* up.

### Step 4 — Navigate, then drop the splash

A second effect waits until `target` is set **and** the children have mounted (effects fire after commit, so `<Stack>` exists by now). It runs `router.replace(target)` and only then calls `SplashScreen.hideAsync()`. The splash lifts to reveal the correct screen already in place — no flash, no jump.

## Why the ordering matters

There are effectively **two gates in series**: `PersistGate` (waits for rehydration) and then `AuthBootstrap` returning `null` until the route is decided. The splash covers both.

- By the time the user lands on `/(tabs)/home`, the cached `profile` is already in the store, so the authed UI paints with the *last known* profile immediately instead of flashing empty while `fetchMe` is still in flight.
- The session's source of truth is the Keychain, not the persisted profile — so a stale or wiped profile can never make the app think it's logged in.
- Because the gate guarantees a fully-rehydrated store, `signOut`'s purge during a dead-token launch operates on real state, not a half-loaded one.

> **One caveat:** the splash stays up until `bootstrap()` resolves *and* the redirect lands — not merely until rehydration. If `fetchMe` is slow (e.g. poor network), the splash lingers on that network call, not on the (sub-frame) profile read.

## Mental model in one sentence

> Keep the splash up → wait for the persisted profile to rehydrate (`PersistGate`) → resolve the session and pick a route (`AuthBootstrap`) → navigate there → only then hide the splash, so the first screen the user sees is already correct and fully loaded.
