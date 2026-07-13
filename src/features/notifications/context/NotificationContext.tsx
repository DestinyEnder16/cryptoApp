import React, { ReactNode, useEffect } from "react";
import * as Notifications from "expo-notifications";
import { store } from "@/src/store";
import { baseApi } from "@/src/store/baseApi";

interface NotificationProviderProps {
  children: ReactNode;
}

// Keeps the in-app notification list/badge live: a push arriving (foreground)
// or being tapped means the server has new notification data, so invalidate
// the cache rather than waiting on the next poll. Device registration lives
// separately in useEnsureDeviceRegistered.
export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  useEffect(() => {
    const notificationListener = Notifications.addNotificationReceivedListener(
      () => {
        store.dispatch(baseApi.util.invalidateTags(["Notification"]));
      },
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener(() => {
        store.dispatch(baseApi.util.invalidateTags(["Notification"]));
      });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  return <>{children}</>;
};
