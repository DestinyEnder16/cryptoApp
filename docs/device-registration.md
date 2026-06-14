# How Device Registration Works

The goal: when a user opens the **Devices** screen, the current phone/browser is automatically saved to the backend so it can receive push notifications and appear in their "active devices" list.

## The moving parts

| Piece | File | What it does |
|---|---|---|
| Push token helper | `src/services/expoPushToken.ts` | Asks the OS for the device's Expo push token |
| API endpoints | `src/store/api/devicesApi.ts` | `GET /me/devices` and `POST /me/devices` via RTK Query |
| UI screen | `src/app/(tabs)/profile/security/devices.tsx` | Orchestrates the flow and renders the list |
| Auth header | `src/store/api/baseApi.ts` | Attaches the user's bearer token to every request |

## The flow — step by step

### Step 1 — User opens the Devices screen

The `Devices` component in `devices.tsx` mounts. Two things start in parallel:

- `useGetDevicesQuery()` fires a `GET /me/devices` request to fetch any devices already registered for this user.
- A `useEffect` calls `loadToken()` to fetch *this* device's push token.

### Step 2 — Get the Expo push token

`getExpoPushToken()` in `expoPushToken.ts`:

1. Asks the OS for notification permission (`Notifications.requestPermissionsAsync()`).
2. If granted, calls `Notifications.getExpoPushTokenAsync()` with the EAS project ID — this returns a string like `ExponentPushToken[xxxxxxx]`.
3. If we're on a simulator or permission is denied **in dev**, it falls back to a synthetic token (`ExponentPushToken[dev-ios-<sessionId>]`) so the flow can still be tested without a real device.
4. The token is stored in the screen's local state as `thisDeviceToken`.

### Step 3 — Decide whether to register

The screen compares the freshly fetched token against the list returned by the API:

```ts
const alreadyRegistered =
  !!thisDeviceToken &&
  devices.some((d) => d.expoPushToken === thisDeviceToken);
```

If the token already appears in the list → do nothing. Otherwise, continue.

### Step 4 — Auto-register the device

A `useEffect` waits until both the token AND the device list are ready, then calls:

```ts
registerDevice({
  expoPushToken: thisDeviceToken,
  platform: getDevicePlatform(), // 'ios' | 'android' | 'web'
});
```

This triggers the RTK Query mutation defined in `devicesApi.ts`, which sends a `POST /me/devices` with the token + platform in the body. The user's bearer token is attached automatically by `prepareHeaders` in `baseApi.ts`.

### Step 5 — Refresh the list automatically

The mutation declares `invalidatesTags: ['Device']`. Because `getDevices` declares `providesTags: ['Device']`, RTK Query automatically re-runs `GET /me/devices` once the POST succeeds. The list re-renders with the new device included, and the one matching `thisDeviceToken` is labeled **"Current"**.

### Step 6 — Error / retry path

If something fails (permission denied in production, network error, etc.), the screen shows the `EmptyState` with a **Try again** button. `handleRetry` re-runs the token fetch, refetches the list, and retries the registration mutation.

## Mental model in one sentence

> Open screen → ask OS for push token → check if backend already knows it → if not, POST it → tag invalidation refreshes the list.
