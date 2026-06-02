import { authApi } from './authApi';
import { baseApi } from './baseApi';
import { marketApi } from './marketApi';
import { notificationApi } from './notificationApi';
import { profileApi } from './profileApi';
import { settingsApi } from './settingsApi';
import { verificationApi } from './verificationApi';

export const cryptoApi = baseApi as typeof baseApi &
  typeof authApi &
  typeof verificationApi &
  typeof profileApi &
  typeof settingsApi &
  typeof marketApi &
  typeof notificationApi;

export { useLoginMutation, useSignupMutation } from './authApi';
export {
  useFetchAssetDetailsQuery,
  useFetchSupportedAssetsQuery,
  useFetchTrendingAssetsQuery,
} from './marketApi';
export { useFetchNotificationsQuery } from './notificationApi';
export { useEditProfileMutation, useFetchMeQuery } from './profileApi';
export { useEditSettingsMutation, useFetchMySettingsQuery } from './settingsApi';
export { useOtpMutation, useOtpVerificationMutation } from './verificationApi';
