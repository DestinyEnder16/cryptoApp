import AppBackground from '@/src/components/AppBackground';
import Loader from '@/src/components/Loader';
import ScreenIntro from '@/src/components/ScreenIntro';
import { Fonts } from '@/src/constants/fonts';
import { CheckMarkIcon } from '@/src/constants/images';
import { Colors } from '@/src/constants/styles';
import {
  useFetchNotificationsQuery,
  useReadAllNotificationsMutation,
} from '@/src/store/api/notificationApi';
import type { NotificationDetails } from '@/src/types/notification/types';
import { useIsFocused } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function Notifications() {
  const isFocused = useIsFocused();
  const { data, isLoading } = useFetchNotificationsQuery(undefined, {
    pollingInterval: isFocused ? 15000 : 0,
    skipPollingIfUnfocused: true,
  });
  const [readAll, { isLoading: isMarking }] = useReadAllNotificationsMutation();

  const notifications = data?.data ?? [];
  const hasUnread = notifications.some((n) => !n.isRead);

  const handleMarkAllRead = () => {
    if (!hasUnread || isMarking) return;
    readAll();
  };

  return (
    <AppBackground>
      <View style={styles.container}>
        <ScreenIntro
          title="Notifications"
          description="Security, KYC, transaction, and alert messages."
          hasBackBtn
        />

        {isLoading ? (
          <Loader />
        ) : (
          <View style={styles.content}>
            <Pressable
              onPress={handleMarkAllRead}
              disabled={!hasUnread || isMarking}
              style={({ pressed }) => [
                styles.markAllBtn,
                (!hasUnread || isMarking) && styles.markAllBtnDisabled,
                pressed && styles.markAllBtnPressed,
              ]}
            >
              <Text style={styles.markAllText}>Mark all as read</Text>
            </Pressable>

            {notifications.length === 0 ? (
              <EmptyState />
            ) : (
              <FlashList
                data={notifications}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                renderItem={({ item }) => <NotificationItem item={item} />}
              />
            )}
          </View>
        )}
      </View>
    </AppBackground>
  );
}

function NotificationItem({ item }: { item: NotificationDetails }) {
  return (
    <View style={styles.item}>
      <View style={[styles.dot, item.isRead && styles.dotRead]} />
      <View style={styles.itemText}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemTitle} numberOfLines={1}>
            {item.title}
          </Text>
          {!item.isRead && <View style={styles.newBadge} />}
        </View>
        <Text style={styles.itemBody}>{item.body}</Text>
        <Text style={styles.itemDate}>{formatNotifDate(item.createdAt)}</Text>
      </View>
    </View>
  );
}

function formatNotifDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';

  const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const now = new Date();

  if (date.toDateString() === now.toDateString()) {
    return time;
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday, ${time}`;
  }

  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86_400_000);
  if (diffDays < 7) {
    return `${date.toLocaleDateString([], { weekday: 'short' })}, ${time}`;
  }

  const sameYear = date.getFullYear() === now.getFullYear();
  const datePart = date.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    ...(sameYear ? {} : { year: 'numeric' }),
  });
  return `${datePart}, ${time}`;
}

function EmptyState() {
  return (
    <View style={styles.empty}>
      <CheckMarkIcon />
      <Text style={styles.emptyTitle}>All caught up</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    marginTop: 24,
  },
  markAllBtn: {
    backgroundColor: Colors.secondaryBackgroundColor,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  markAllBtnDisabled: {
    opacity: 0.5,
  },
  markAllBtnPressed: {
    opacity: 0.75,
  },
  markAllText: {
    fontFamily: Fonts.medium,
    color: Colors.text,
    fontSize: 15,
  },
  listContent: {
    paddingBottom: 24,
  },
  separator: {
    height: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 14,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.green,
    marginTop: 4,
  },
  dotRead: {
    backgroundColor: Colors.grey,
  },
  itemText: {
    flex: 1,
    gap: 5,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemTitle: {
    flex: 1,
    fontFamily: Fonts.medium,
    color: Colors.text,
    fontSize: 15,
  },
  newBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.green,
  },
  itemBody: {
    fontFamily: Fonts.regular,
    color: Colors.ash,
    fontSize: 13,
    lineHeight: 18,
  },
  itemDate: {
    fontFamily: Fonts.regular,
    color: Colors.grey,
    fontSize: 11,
    marginTop: 2,
  },
  empty: {
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    gap: 10,
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyTitle: {
    fontFamily: Fonts.bold,
    color: Colors.text,
    fontSize: 18,
  },
  emptyBody: {
    fontFamily: Fonts.regular,
    color: Colors.ash,
    fontSize: 13,
    lineHeight: 18,
  },
});
