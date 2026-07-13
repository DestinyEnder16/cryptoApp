import { API_URL } from '@/src/shared/constants/config';

// Joins the API base URL with a server-relative path (e.g. an asset icon).
// API_URL carries a trailing slash and the paths carry a leading slash, so a
// naive template literal produces a double slash — which the API 404s on.
export function assetUrl(path: string): string {
  return `${(API_URL ?? '').replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}
