import { API_URL } from '@/src/constants/config';
import { getRefreshToken, saveRefreshToken } from '@/src/services/nativeKeychain';
import type { AppDispatch, RootState } from '@/src/store';
import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { setRefreshToken, setToken } from '../slices/authSlice';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

interface RefreshResponse {
  data: { accessToken: string; refreshToken: string };
}

// Single-flight guard: if several requests 401 at once, they all await the same
// refresh call instead of each firing one (which would rotate the refresh token
// out from under the others and invalidate them).
let refreshPromise: Promise<string | null> | null = null;

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    if (!refreshPromise) {
      refreshPromise = (async () => {
        const state = api.getState() as RootState;
        const refreshToken =
          state.auth.refreshToken ?? (await getRefreshToken());
        if (!refreshToken) return null;

        const refreshResult = await rawBaseQuery(
          {
            url: 'auth/refresh',
            method: 'POST',
            body: { refreshToken },
          },
          api,
          extraOptions
        );

        const payload = (refreshResult.data as RefreshResponse | undefined)
          ?.data;
        if (!payload) return null;

        // Persist the rotated pair: the old refresh token is now dead.
        api.dispatch(setToken(payload.accessToken));
        api.dispatch(setRefreshToken(payload.refreshToken));
        await saveRefreshToken(payload.refreshToken);
        return payload.accessToken;
      })().finally(() => {
        refreshPromise = null;
      });
    }

    const newAccessToken = await refreshPromise;

    if (newAccessToken) {
      // Retry the original request with the fresh access token.
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      // Refresh failed / no refresh token — tear the whole session down
      // (Keychain, device record, persisted profile, and API cache), not just
      // Redux. Lazy import avoids a static cycle with auth.ts, which imports
      // baseApi. Route guards handle navigation off protected screens.
      const { signOut } = await import('@/src/services/auth');
      await signOut(api.dispatch as AppDispatch);
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'cryptoApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Notification', 'Device', 'Wallet', 'Transaction', 'PriceAlert', 'Watchlist'],
  endpoints: () => ({}),
});
