// Central API base URL, set via .env locally and EAS environment variables
// for builds.
export const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error('EXPO_PUBLIC_API_URL is not set');
}
