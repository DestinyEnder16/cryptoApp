import type { NotificationResponse } from '@/src/features/notifications/types/notification';
import { baseApi } from '@/src/store/baseApi';

interface NotificationsReadResponse {
  data: { updated: boolean };
}

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchNotifications: build.query<NotificationResponse, void>({
      query: () => '/me/notifications',
      providesTags: ['Notification'],
    }),
    readAllNotifications: build.mutation<NotificationsReadResponse, void>({
      query: () => ({
        url: '/me/notifications/read-all',
        method: 'PATCH',
      }),
      invalidatesTags: ['Notification'],
    }),
  }),
});

export const { useFetchNotificationsQuery, useReadAllNotificationsMutation } =
  notificationApi;
