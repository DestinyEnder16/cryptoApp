# How KYC Status Screens Work

The goal: after a user submits KYC, show them the screen that matches their **real** status — waiting (pending), upgraded (approved), or needs-fixing (rejected) — driven by the backend, not by hardcoded navigation.

## The four statuses

The backend tracks `kycStatus` on the user (`/me`): `not_started`, `pending`, `approved`, `rejected`. Each maps to a screen:

| Status | Screen | Look |
|---|---|---|
| `not_started` | `KycStart` (intro) | Start-the-flow call to action |
| `pending` | `PendingScreen` | Gold ring with dots, "Pending review" |
| `approved` | `ApprovedScreen` | Green check, "Level N unlocked" |
| `rejected` | `RejectedScreen` | Red alert, "Try again" + reason |

## The moving parts

| Piece | File | What it does |
|---|---|---|
| Router | `src/app/kyc/index.tsx` | Reads `/me` and renders the screen for the current status |
| Status data | `src/hooks/useVerification.ts` | Exposes `kycStatus`, `level`, `label`, `limits` from `/me` |
| Screens | `src/components/screens/kyc/status/*` | The three status screens + shared `StatusRow` |

## The flow — step by step

### Step 1 — Everything routes through `/kyc`

The home/wallet/trades "locked" banners all send the user to `/kyc`. That's the single entry point, so the routing decision lives in one place: `kyc/index.tsx`.

### Step 2 — Wait for `/me`, then branch

```ts
const { data: user, isLoading } = useFetchMeQuery();
if (isLoading) return <LoadingIcon />;

switch (user?.kycStatus) {
  case 'pending':  return <Redirect href="/kyc/status/pending" />;
  case 'approved': return <Redirect href="/kyc/status/approved" />;
  case 'rejected': return <Redirect href="/kyc/status/rejected" />;
  default:         return <KycStart />; // not_started
}
```

Because this reads live `/me` data, the same `/kyc` link always lands the user on the correct screen.

### Step 3 — Screens show real numbers

The dollar amounts and level aren't hardcoded — they come from `verification.limits` via `useVerification()`:

- **Approved:** trade / withdrawal / daily limits → `limits.tradePerTransactionUsd`, etc.
- **Pending:** sandbox deposit cap → `limits.depositPerTransactionUsd`.

### Step 4 — Submitting refreshes the status

`submitKyc` declares `invalidatesTags: ['User']`, so `/me` refetches after a submission and `kycStatus` flips to `pending`. (The Review screen navigates straight to `/kyc/status/pending` after submit, since that result is already known.)

## Gotcha: the rejection reason isn't available

The mockup shows a specific reason ("Document photo was blurry…"). That text is the admin's `reviewerNote` — but **there's no user-facing GET endpoint** that returns it (`/me` doesn't include it, and `GET /auth/kyc` is a 404). So `RejectedScreen` shows a sensible generic message instead. If the API later exposes the note, swap the static text for it.

## Mental model in one sentence

> Everything points at `/kyc`; that page reads the user's real `kycStatus` from `/me` and renders pending / approved / rejected (or the intro) — with the numbers pulled from the verification limits.
