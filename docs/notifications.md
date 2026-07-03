# How Notifications Work

The goal: get push notifications onto the user's device, and keep the in-app notifications list/badge in sync with the server — ideally without the user having to pull-to-refresh.

This doc covers the **data/delivery side** (getting a notification to show up, and keeping the in-app list live). For how a device gets registered with the backend in the first place, see [device-registration.md](device-registration.md) — that's a separate concern this doc assumes is already done.

## The moving parts

| Piece | File | What it does |
|---|---|---|
| Global notification handler | `src/app/_layout.tsx` | Tells the OS how to present a push while the app is open (banner, sound, badge) |
| Live-sync listener | `src/context/NotificationContext.tsx` | Invalidates the notification cache when a push arrives or is tapped |
| API layer | `src/store/api/notificationApi.ts` | `GET /me/notifications` and `PATCH /me/notifications/read-all` via RTK Query |
| List screens | `src/app/(tabs)/home/notifications.tsx`, `src/app/(tabs)/profile/notifications.tsx` | Render the list, poll while focused |
| Badge | `src/app/(tabs)/profile/index.tsx` | Shows the unread count, also polls while focused |
| Device registration | `src/hooks/useEnsureDeviceRegistered.ts` | Separate concern — see [device-registration.md](device-registration.md) |

## Two independent mechanisms keep the list "live"

There is **no WebSocket or real-time channel** here. Two separate, simpler mechanisms combine to make the notifications list feel live:

### 1. Push-triggered cache invalidation (near-instant, but only while the app can run JS)

`NotificationContext.tsx` registers two `expo-notifications` listeners for the lifetime of the app:

```ts
Notifications.addNotificationReceivedListener(() => {
  store.dispatch(baseApi.util.invalidateTags(["Notification"]));
});

Notifications.addNotificationResponseReceivedListener(() => {
  store.dispatch(baseApi.util.invalidateTags(["Notification"]));
});
```

- **`addNotificationReceivedListener`** fires when a push arrives **while the app is foregrounded**.
- **`addNotificationResponseReceivedListener`** fires when the user **taps** a notification (foreground, background, or from a cold start).

Either one dispatches `invalidateTags(['Notification'])` directly on the Redux store. Because `fetchNotifications` in `notificationApi.ts` declares `providesTags: ['Notification']`, RTK Query immediately refetches any component that's currently subscribed to that query — the notifications list, the badge, wherever it's mounted — with no user action needed.

This is as close to "instant" as this app gets, but it only works if the app's JS is actually running when the push lands. If the app is backgrounded or killed, these listeners aren't running, so the OS shows the notification banner but the in-app cache doesn't refresh until the user opens the app again.

### 2. Polling fallback (up to 15s delay, only while a relevant screen is focused)

The list/badge screens pass a `pollingInterval` when they call the query, mirroring the pattern used elsewhere in the app (e.g. `MarketAssetView.tsx`):

```ts
const isFocused = useIsFocused();
const { data } = useFetchNotificationsQuery(undefined, {
  pollingInterval: isFocused ? 15000 : 0,
  skipPollingIfUnfocused: true,
});
```

This catches anything the push mechanism missed — a delayed push, a denied permission, a dropped notification — at the cost of up to a 15-second delay, and only while the user actually has that screen open.

`notificationApi.ts` itself defines **no polling** — `pollingInterval` is opt-in per call site, not baked into the endpoint. Looking at `notificationApi.ts` alone, there is nothing that makes notifications arrive live; the "live" behavior is entirely bolted on from these two call sites plus the context listener.

## The flow — step by step

### Step 1 — Backend sends a push

Assumed to happen server-side (outside this repo) using the Expo push token registered via `POST /me/devices`. This app has no visibility into whether/when the backend actually does this.

### Step 2 — Expo delivers it to the device

Handled entirely by the OS + Expo's push service. If the app is foregrounded, `Notifications.setNotificationHandler` (set in `_layout.tsx`) decides how it's presented:

```ts
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
```

### Step 3 — The app reacts, if it can

- **Foregrounded:** `addNotificationReceivedListener` fires → `invalidateTags(['Notification'])` → any mounted `useFetchNotificationsQuery` subscriber refetches right away.
- **Tapped (any app state):** `addNotificationResponseReceivedListener` fires the same invalidation once the app resumes.
- **Backgrounded/killed and never tapped:** nothing runs. The OS banner is the only signal the user gets until they open the app, at which point a normal mount-time fetch (or the next poll) picks up the new data.

### Step 4 — Screens read from the same cache

`fetchNotifications` is a single RTK Query cache entry keyed on no arguments, so every consumer — `home/notifications.tsx`, `profile/notifications.tsx`, and the badge in `profile/index.tsx` — shares one entry. Invalidating it once (from the push listener, from polling, or from `readAllNotifications`) updates all three simultaneously.

### Step 5 — Marking as read

`readAllNotifications` is a mutation (`PATCH /me/notifications/read-all`) that declares `invalidatesTags: ['Notification']`, so it refreshes the same shared cache the same way a push does.

## Caveats worth knowing

- **No delivery guarantee from this repo's perspective.** Whether a push actually gets sent when a notification is created is entirely a backend concern — unverifiable from the client code.
- **Dev/emulator testing:** `getExpoPushToken()` falls back to a synthetic fake token in `__DEV__` when there's no real device/permission. That token gets "successfully" registered with the backend, but Expo's push service will never deliver a real push to it — so registration succeeding in the logs does not mean a push will arrive on an emulator.
- **Background delivery isn't instant by design.** This app doesn't use `expo-task-manager`/background fetch to react to pushes while backgrounded — it relies on the OS-level banner plus a fetch when the app is next opened.

## Mental model in one sentence

> A push notification arriving (or being tapped) tells the app "something changed" via a Redux cache invalidation; a 15s poll on the visible screens is the fallback for whatever that signal misses.
