import ActionBtn from "@/src/shared/components/ActionBtn";
import AppBackground from "@/src/shared/components/AppBackground";
import ProfileInfoCard from "@/src/features/profile/components/ProfileInfoCard";
import ProfileStripItem from "@/src/features/profile/components/ProfileStripItem";
import ScreenIntro from "@/src/shared/components/ScreenIntro";
import { Colors } from "@/src/shared/constants/styles";
import { showToast } from "@/src/shared/helpers/showToast";
import { signOut } from "@/src/features/auth/services/auth";
import { useFetchPriceAlertsQuery } from "@/src/features/alerts/store/alertsApi";
import { useLogoutMutation } from "@/src/features/auth/store/authApi";
import { useFetchNotificationsQuery } from "@/src/features/notifications/store/notificationApi";
import { useFetchWatchlistQuery } from "@/src/features/markets/store/watchListApi";
import { useAppDispatch } from "@/src/store/hooks";
import { useIsFocused } from "@react-navigation/native";
import { router } from "expo-router";
import { ScrollView, View } from "react-native";

const SUBTITLE_PLACEHOLDER = "—";

export default function ProfileHomeScreen() {
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();
  const { data: alertsData } = useFetchPriceAlertsQuery();
  const { data: notificationsData } = useFetchNotificationsQuery(undefined, {
    pollingInterval: isFocused ? 15000 : 0,
    skipPollingIfUnfocused: true,
  });
  const { data: watchlistData } = useFetchWatchlistQuery();
  const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();

  const activeAlerts = alertsData?.meta.active;
  const unreadCount = notificationsData?.data.filter((n) => !n.isRead).length;
  const watchlistSymbols = watchlistData?.data
    .slice(0, 3)
    .map((a) => a.symbol)
    .join(", ");

  return (
    <AppBackground>
      <View style={{ flex: 1 }}>
        <ScreenIntro title="Profile" />

        <ProfileInfoCard />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 20, paddingBottom: 40 }}
        >
          <ProfileStripItem
            title="Edit profile"
            subtitle="Name, email, phone"
            onPress={() => router.navigate("/profile/edit")}
          />
          <ProfileStripItem
            title="Security"
            subtitle="2FA, PIN, recovery codes"
            onPress={() => router.navigate("/profile/security")}
          />
          <ProfileStripItem
            title="Price alerts"
            subtitle={
              activeAlerts === undefined
                ? SUBTITLE_PLACEHOLDER
                : `${activeAlerts} active alerts`
            }
            badge={activeAlerts}
            onPress={() => router.navigate("/profile/priceAlerts")}
          />
          <ProfileStripItem
            title="Notifications"
            subtitle={
              unreadCount === undefined
                ? SUBTITLE_PLACEHOLDER
                : `${unreadCount} unread messages`
            }
            badge={unreadCount}
            onPress={() => router.navigate("/profile/notifications")}
          />
          <ProfileStripItem
            title="Watchlist"
            subtitle={watchlistSymbols || SUBTITLE_PLACEHOLDER}
            onPress={() => router.navigate("/(tabs)/markets/watchlist")}
          />
        </ScrollView>
      </View>
    </AppBackground>
  );
}
