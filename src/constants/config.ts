// Central API base URL.
//
// We prefer the EXPO_PUBLIC_API_URL env var (set via .env locally and eas.json
// for builds), but fall back to the hardcoded production URL. Standalone
// builds don't always receive the env var reliably, so the fallback guarantees
// the app can always reach the backend.
export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'https://crypto-api-guwm.onrender.com/';
