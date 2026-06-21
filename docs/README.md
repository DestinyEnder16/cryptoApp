# Docs

Plain-language explanations of the trickier areas of this app — the kind of thing that's hard to piece together from the code alone. Each doc follows the same shape: the goal, a table of the moving parts, a step-by-step walkthrough, and a one-sentence summary.

## Index

| Doc | What it covers |
|---|---|
| [token-refresh.md](token-refresh.md) | How expired access tokens are refreshed automatically so requests don't fail mid-session |
| [kyc-upload.md](kyc-upload.md) | How a KYC document photo is picked and uploaded to the server (Cloudinary) |
| [kyc-status.md](kyc-status.md) | How the pending/approved/rejected screens are picked from the user's real KYC status |
| [device-registration.md](device-registration.md) | How the current device auto-registers for push notifications |
| [wallet-screens.md](wallet-screens.md) | How the Wallets tab sandbox screens (deposit/withdraw/transactions) are structured and wired |

## Adding a new doc

When a new complex area is built, add a file here and a row above. Keep it simple: explain it like you would to a teammate who's new to the code. Favor a short walkthrough and a clear mental model over exhaustive detail.
