# CryptoApp (tMinus1)

This application is designed to help crypto enthusiasts and experts track and manage their crypto assets. It is a React Native app built with Expo (SDK 54), Expo Router, and Redux Toolkit / RTK Query.

## Tech stack

| Area | Choice |
|------|--------|
| Framework | React Native `0.81.5` + React `19.1.0` (New Architecture enabled) |
| Platform | Expo SDK `~54.0.33`, `expo-dev-client` |
| Navigation | `expo-router` (file-based, typed routes) |
| State / data | `@reduxjs/toolkit` + RTK Query, `redux-persist` |
| Forms | `react-hook-form` + `yup` / `@hookform/resolvers` |
| Money math | `big.js` (decimal-safe, avoids float rounding) |
| Secure storage | `react-native-keychain` (tokens), `AsyncStorage` (persisted profile) |
| Styling | `twrnc` (Tailwind for RN) + shared constants |
| Updates | `expo-updates` (OTA), EAS Build |

## Supported Node version

Node **>= 20.19.4** is required (dictated by the current Expo/RN toolchain). Use an active LTS line (20.x or 22.x). There is currently **no `engines` field or `.nvmrc`** committed, so pin your version manually (e.g. `nvm use 22`).

Package manager: **npm** (a `package-lock.json` is the source of truth).

## Getting started

```bash
npm install                 # install dependencies
cp .env.example .env        # (see Environment variables) — create .env with your API URL
npx expo start              # start the Metro dev server (dev client / Expo Go)
npm run android             # build & run the native Android app (expo run:android)
npm run ios                 # build & run the native iOS app (expo run:ios)
```

> This project ships a committed native `android/` folder (see [Release procedures](#release-procedures)). `npm run android` builds directly from it; the NDK is pinned to `27.1.12297006` in `android/build.gradle`.

## Environment variables

Configuration is read from `.env` locally and from EAS environment variables for builds. Only `EXPO_PUBLIC_*` variables are exposed to the app bundle.

| Variable | Required | Description |
|----------|----------|-------------|
| `EXPO_PUBLIC_API_URL` | **Yes** | Base URL of the backend API. Consumed in `src/shared/constants/config.ts`; the app **throws at startup** if it is unset. |

Example `.env`:

```
EXPO_PUBLIC_API_URL=https://api.example.com
```

## Project architecture

The project follows a **feature-first** structure under `src/`. Each feature owns its screens' logic, API slices, Redux slices, services, and types; cross-cutting code lives in `shared/`; routing lives in `app/`.

```
src/
  app/                 # expo-router routes (the navigable tree)
    (auth)/            #   auth flow: sign in / register / OTP / 2FA / biometric
    (tabs)/            #   authenticated app: home, markets, wallet, trades, profile
    kyc/               #   KYC verification flow
    _layout.tsx        #   root layout + AuthBootstrap (session restore & routing)
  features/            # domain features, each self-contained
    alerts/ auth/ home/ kyc/ markets/
    notifications/ onboarding/ profile/ trades/ wallet/
      components/      #   feature UI
      store/           #   RTK Query api slices + redux slices
      services/        #   side-effectful helpers (keychain, session flags…)
      hooks/ helpers/ types/
  shared/              # reusable UI, constants, hooks, schemas, libs, helpers
  store/               # Redux store wiring
    baseApi.ts         #   RTK Query base (auth header + refresh-token reauth)
    index.ts           #   configureStore + redux-persist + reducer registration
    hooks.ts           #   typed useAppDispatch / useAppSelector
```

### State & data flow

- **`store/index.ts`** combines all reducers and registers every RTK Query api slice (side-effect imports). Only the **`profile`** slice is persisted via `redux-persist` (`AsyncStorage`); the RTK Query cache is in-memory only.
- **`store/baseApi.ts`** is the single RTK Query base query. It:
  - attaches `Authorization: Bearer <token>` from `state.auth.token`;
  - on a `401`, runs a **single-flight refresh** against `auth/refresh`, rotates the token pair (persisting the new refresh token to the keychain), and retries the original request;
  - on refresh failure, tears down the full session (keychain, device record, persisted profile, API cache) via `signOut`.
- **Session bootstrap** lives in `src/app/_layout.tsx` (`AuthBootstrap`): on cold start it restores tokens from the keychain, validates them by fetching `/me`, optionally gates behind biometrics, and routes to `/onboarding`, `/(auth)/*`, or `/(tabs)/home`.

### Authentication & tokens

- Access token is stored in the device keychain (`react-native-keychain`); the refresh token is stored separately and rotated on refresh.
- The profile (`/me`) result is cached in RTK Query and mirrored into the persisted `profile` slice.

## API expectations

The app expects a REST backend at `EXPO_PUBLIC_API_URL`, with:

- **Auth:** `Bearer` access tokens on protected routes; a `POST auth/refresh` endpoint that accepts `{ refreshToken }` and returns `{ data: { accessToken, refreshToken } }`. A `401` triggers automatic refresh + retry.
- **Response envelope:** endpoints wrap payloads in a `{ data: ... }` object (RTK Query `transformResponse` unwraps `response.data` — see `src/features/profile/store/profileApi.ts`).
- **Representative endpoints:** `/me` (profile + KYC + settings), `auth/refresh`, plus wallet, trades, markets, notifications, price alerts, device registration, and KYC endpoints (each defined in the corresponding `features/*/store/*Api.ts`).
- **Monetary values:** treat amounts as decimal-safe (`big.js`) — avoid relying on JS floating-point for balances/quotes.

Detailed per-domain contracts are documented under [`docs/`](./docs):

- [`docs/app-launch.md`](./docs/app-launch.md) · [`docs/token-refresh.md`](./docs/token-refresh.md) · [`docs/device-registration.md`](./docs/device-registration.md)
- [`docs/kyc-status.md`](./docs/kyc-status.md) · [`docs/kyc-upload.md`](./docs/kyc-upload.md)
- [`docs/wallet-api.md`](./docs/wallet-api.md) · [`docs/wallet-screens.md`](./docs/wallet-screens.md) · [`docs/notifications.md`](./docs/notifications.md)

## Quality checks / "test" commands

> **There is currently no automated test suite** (no unit/integration/e2e tests or CI workflow). Until one is added, the enforced quality gates are static analysis:

```bash
npm run lint          # ESLint (eslint-config-expo)
npx tsc --noEmit      # TypeScript type-check
npx expo-doctor       # validate Expo/SDK dependency alignment
```

Run all three before opening a PR. Recommended next step: add a test runner (e.g. Jest + React Native Testing Library) covering authentication, token rotation, signup, and money math, plus a CI workflow that runs lint + type-check + tests.

## Release procedures

Builds and OTA updates are handled by **EAS**. Profiles are defined in [`eas.json`](./eas.json):

| Profile | Distribution | Channel |
|---------|--------------|---------|
| `development` | internal (dev client) | `development` |
| `preview` | internal | `preview` |
| `production` | store (auto-increments version) | `production` |

```bash
eas build --profile development --platform android
eas build --profile preview --platform android
eas build --profile production --platform android
eas update --channel <channel>     # ship an OTA JS-only update
```

### Native build notes (important)

This project **commits and ships the native `android/` folder** (it is *not* regenerated by prebuild on EAS). Consequences to respect on every release:

- **Runtime version is manual and duplicated.** `app.json` uses a static `"runtimeVersion": "1.0.0"` and it **must stay in sync** with `android/app/src/main/res/values/strings.xml` (`expo_runtime_version`). expo-updates fails the build if they drift.
- **NDK is pinned** to `27.1.12297006` in `android/build.gradle` (required by RN 0.81's `std::format` usage).
- **`.easignore` governs the upload, not `.gitignore`.** Because `.easignore` exists it fully replaces `.gitignore` for EAS, so `android/`'s generated build output (`android/app/build/`, `.cxx/`, `.gradle/`, `local.properties`) is excluded there explicitly to keep the upload small.
- **iOS is still CNG** — the `ios/` folder is ignored and regenerated by prebuild.
- Bump the app `version` in `app.json` (and native `versionCode`/`versionName` as needed) for store releases.
