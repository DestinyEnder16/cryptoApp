# Docs

Plain-language explanations of the trickier areas of this app — the kind of thing that's hard to piece together from the code alone. Each doc follows the same shape: the goal, a table of the moving parts, a step-by-step walkthrough, and a one-sentence summary.

## Index

| Doc | What it covers |
|---|---|
| [navigation.md](navigation.md) | How `app/` routes to feature screens, how tab stacks anchor deep links (`unstable_settings.initialRouteName`), and how the trades tab is KYC-gated |
| [app-launch.md](app-launch.md) | How cold start picks the landing route (onboarding/sign-in/home) while the splash hides rehydration and the session check |
| [token-refresh.md](token-refresh.md) | How expired access tokens are refreshed automatically so requests don't fail mid-session |
| [kyc-upload.md](kyc-upload.md) | How a KYC document photo is picked and uploaded to the server (Cloudinary) |
| [kyc-status.md](kyc-status.md) | How the pending/approved/rejected screens are picked from the user's real KYC status |
| [device-registration.md](device-registration.md) | How the current device auto-registers for push notifications |
| [notifications.md](notifications.md) | How push arrival and polling keep the in-app notifications list/badge live |
| [wallet-api.md](wallet-api.md) | How the Wallets tab reads from the wallet API (endpoints, caching, transaction display, what's still sandbox) |
| [wallet-screens.md](wallet-screens.md) | How the Wallets tab screens (deposit/withdraw/transactions) are structured and wired |
