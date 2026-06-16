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
import { FlashList } from '@shopify/flash-list';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function Notifications() {
  const { data, isLoading } = useFetchNotificationsQuery();
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
      <View style={styles.dot} />
      <View style={styles.itemText}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemBody}>{item.body}</Text>
      </View>
      <Text
        style={[
          styles.status,
          item.isRead ? styles.statusRead : styles.statusNew,
        ]}
      >
        {item.isRead ? 'Read' : 'New'}
      </Text>
    </View>
  );
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
    alignItems: 'center',
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 14,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.green,
  },
  itemText: {
    flex: 1,
    gap: 4,
  },
  itemTitle: {
    fontFamily: Fonts.medium,
    color: Colors.text,
    fontSize: 15,
  },
  itemBody: {
    fontFamily: Fonts.regular,
    color: Colors.ash,
    fontSize: 12,
  },
  status: {
    fontFamily: Fonts.medium,
    fontSize: 13,
  },
  statusNew: {
    color: Colors.green,
  },
  statusRead: {
    color: Colors.ash,
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
