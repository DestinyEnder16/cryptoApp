# How Device Registration Works

The goal: get this device's Expo push token onto the backend (`POST /me/devices`) so it can receive push notifications — automatically on login, without registering the same token twice, and with a visible retry path if it fails.

For what happens *after* a push arrives (keeping the in-app list live), see [notifications.md](notifications.md).

## The moving parts

| Piece | File | What it does |
|---|---|---|
| Push token helper | `src/services/expoPushToken.ts` | Asks the OS for the device's Expo push token |
| Token-loading hook | `src/hooks/useCurrentDeviceToken.ts` | Wraps the token helper in React state (load/error/reload) |
| Registration hook | `src/hooks/useEnsureDeviceRegistered.ts` | The single place that decides whether to register, and does it |
| API endpoints | `src/store/api/devicesApi.ts` | `GET /me/devices` and `POST /me/devices` via RTK Query |
| Auth bootstrap | `src/app/_layout.tsx` | Calls the hook silently on every login/cold-boot |
| Devices screen | `src/app/(tabs)/profile/security/devices.tsx` | Calls the same hook, but renders its state (list, errors, retry button) |
| Auth header | `src/store/api/baseApi.ts` | Attaches the user's bearer token to every request |

## One hook, two call sites

There used to be two separate implementations of "check if this device is registered, register it if not" — one inline in the Devices screen, one in a standalone `usePushNotifications` hook fired from auth bootstrap. They were consolidated into a single hook, `useEnsureDeviceRegistered(enabled: boolean)`, because both were doing the same thing against the same two RTK Query hooks.

- **`_layout.tsx`** calls it silently: `useEnsureDeviceRegistered(isAuthenticated)`, ignoring the return value. This is what makes registration happen automatically on cold boot and fresh login, with no UI.
- **`devices.tsx`** calls the same hook with `enabled: true` and actually renders what it returns — the device list, a loading state, and (via the hook's `retry()`) a "Try again" button if something failed.

## The flow — step by step

### Step 1 — Something calls `useEnsureDeviceRegistered(enabled)`

Either `AuthBootstrap` (whenever `isAuthenticated` becomes true) or the Devices screen (on every mount, since it's always `enabled`).

### Step 2 — Fetch this device's token and the existing device list, in parallel

- `useCurrentDeviceToken()` calls `getExpoPushToken()`, which asks the OS for notification permission and returns a string like `ExponentPushToken[xxxxxxx]` (or a synthetic dev-only fallback token in `__DEV__` on a simulator/denied permission — see the caveat in [notifications.md](notifications.md)).
- `useGetDevicesQuery()` fires `GET /me/devices`, skipped entirely if `enabled` is `false`.

### Step 3 — Decide whether to register

```ts
const alreadyRegistered =
  !!token && devices.some((d) => d.expoPushToken === token);
```

If this exact token is already in the returned list, the effect does nothing — this is what stops a relogin on the same device from re-sending a token the backend already has.

### Step 4 — Register if needed

```ts
useEffect(() => {
  if (!enabled || !token || isLoadingDevices || isRegistering) return;
  if (alreadyRegistered) return;
  registerDevice({ expoPushToken: token, platform: getDevicePlatform() });
}, [...]);
```

This fires the RTK Query mutation in `devicesApi.ts`, sending `POST /me/devices` with `{ expoPushToken, platform }`. The bearer token is attached automatically by `baseApi.ts`.

### Step 5 — Cache refreshes automatically

`registerDevice` declares `invalidatesTags: ['Device']`; `getDevices` declares `providesTags: ['Device']`. RTK Query re-runs `GET /me/devices` once the POST succeeds, so any mounted consumer (the Devices screen's list, the "Registered devices" subtitle on the security index screen) picks up the new device without an explicit refetch call.

### Step 6 — Error / retry path (Devices screen only)

If the token fetch or the registration mutation fails, `devices.tsx` surfaces `tokenError`/`registerError` and shows a **Try again** button wired to the hook's `retry()`, which reloads the token, refetches the device list, and retries the mutation.

## Who identifies "this device" in the UI

Both `devices.tsx` (the "Current" badge on a device row) and the security index screen's "Registered devices" subtitle identify the current device the same way: comparing `device.expoPushToken === token` from `useEnsureDeviceRegistered`/`useCurrentDeviceToken` against each entry in the fetched list. Platform labels (`"iOS device"`, `"Android"`, etc.) come from the shared `src/helpers/devicePlatform.ts`.

## Mental model in one sentence

> On login (silently) or on visiting the Devices screen (visibly), fetch this device's push token and the backend's device list, and POST the token only if the backend doesn't already have it.
