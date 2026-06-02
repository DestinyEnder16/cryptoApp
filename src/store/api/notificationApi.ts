import type { NotificationResponse } from '@/src/types/notification/types';
import { baseApi } from './baseApi';

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchNotifications: build.query<NotificationResponse, void>({
      query: () => '/me/notifications',
    }),
  }),
});

export const { useFetchNotificationsQuery } = notificationApi;
