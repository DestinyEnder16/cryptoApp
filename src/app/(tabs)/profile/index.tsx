import AppBackground from '@/src/components/AppBackground';
import ProfileInfoCard from '@/src/components/ProfileInfoCard';
import ProfileStripItem from '@/src/components/ProfileStripItem';
import ScreenIntro from '@/src/components/ScreenIntro';
import { useFetchPriceAlertsQuery } from '@/src/store/api/alertsApi';
import { useFetchNotificationsQuery } from '@/src/store/api/notificationApi';
import { useFetchWatchlistQuery } from '@/src/store/api/watchListApi';
import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SUBTITLE_PLACEHOLDER = '—';

export default function ProfileIndex() {
  const insets = useSafeAreaInsets();

  const { data: alertsData } = useFetchPriceAlertsQuery();
  const { data: notificationsData } = useFetchNotificationsQuery();
  const { data: watchlistData } = useFetchWatchlistQuery();

  const activeAlerts = alertsData?.meta.active;
  const unreadCount = notificationsData?.data.filter((n) => !n.isRead).length;
  const watchlistSymbols = watchlistData?.data
    .slice(0, 3)
    .map((a) => a.symbol)
    .join(', ');

  return (
    <AppBackground>
      <View
        style={{ paddingTop: insets.top + 20, paddingHorizontal: 20, flex: 1 }}
      >
        <ScreenIntro title="Profile" />

        <ProfileInfoCard />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 20, paddingBottom: 40 }}
        >
          <ProfileStripItem
            title="Edit profile"
            subtitle="Name, email, phone"
          />
          <ProfileStripItem
            title="Security"
            subtitle="2FA, PIN, recovery codes"
            onPress={() => router.navigate('/profile/security')}
          />
          <ProfileStripItem
            title="Price alerts"
            subtitle={
              activeAlerts === undefined
                ? SUBTITLE_PLACEHOLDER
                : `${activeAlerts} active alerts`
            }
            badge={activeAlerts}
            onPress={() => router.navigate('/profile/priceAlerts')}
          />
          <ProfileStripItem
            title="Notifications"
            subtitle={
              unreadCount === undefined
                ? SUBTITLE_PLACEHOLDER
                : `${unreadCount} unread messages`
            }
            badge={unreadCount}
            onPress={() => router.navigate('/profile/notifications')}
          />
          <ProfileStripItem
            title="Watchlist"
            subtitle={watchlistSymbols || SUBTITLE_PLACEHOLDER}
          />
        </ScrollView>
      </View>
    </AppBackground>
  );
}
