import AppBackground from '@/src/shared/components/AppBackground';
import Btn from '@/src/shared/components/Btn';
import Loader from '@/src/shared/components/Loader';
import ScreenIntro from '@/src/shared/components/ScreenIntro';
import { Fonts } from '@/src/shared/constants/fonts';
import { Colors } from '@/src/shared/constants/styles';
import {
  useDeletePriceAlertMutation,
  useFetchPriceAlertsQuery,
  useUpdatePriceAlertMutation,
} from '@/src/features/alerts/store/alertsApi';
import type { PriceAlert } from '@/src/features/alerts/types/alerts';
import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

type AlertStatus = 'on' | 'off' | 'triggered';

export default function PriceAlertsScreen() {
  const { data, isLoading } = useFetchPriceAlertsQuery();

  const alerts = data?.data ?? [];

  return (
    <AppBackground>
      <View style={styles.container}>
        <ScreenIntro
          title="Price alerts"
          description="Create, edit, pause, or delete market alerts."
          hasBackBtn
        />

        <View style={styles.createBtn}>
          <Btn
            text="Create alert"
            action={() => router.navigate('/profile/createAlert')}
          />
        </View>

        {isLoading ? (
          <Loader />
        ) : alerts.length === 0 ? (
          <EmptyState />
        ) : (
          <FlashList
            data={alerts}
            keyExtractor={(item) => item.id}
            estimatedItemSize={60}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={({ item }) => <AlertItem item={item} />}
          />
        )}
      </View>
    </AppBackground>
  );
}

function AlertItem({ item }: { item: PriceAlert }) {
  const status = getStatus(item);
  const [updateAlert, { isLoading: updating }] = useUpdatePriceAlertMutation();
  const [deleteAlert, { isLoading: deleting }] = useDeletePriceAlertMutation();

  const busy = updating || deleting;

  function handleToggle() {
    if (status === 'triggered' || busy) return;
    updateAlert({ alertId: item.id, body: { isActive: !item.isActive } });
  }

  function handleLongPress() {
    Alert.alert(
      'Delete alert',
      `Remove the ${item.assetSymbol} ${item.direction} ${formatPrice(item.targetPriceUsd)} alert?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteAlert(item.id),
        },
      ]
    );
  }

  return (
    <Pressable
      style={[styles.item, busy && styles.itemBusy]}
      onLongPress={handleLongPress}
      delayLongPress={400}
    >
      <View
        style={[
          styles.dot,
          { backgroundColor: status === 'off' ? Colors.red : Colors.green },
        ]}
      />
      <View style={styles.itemText}>
        <Text style={styles.itemTitle}>
          {item.assetSymbol} {item.direction} {formatPrice(item.targetPriceUsd)}
        </Text>
        <Text style={styles.itemSubtitle}>{getSubtitle(item, status)}</Text>
      </View>
      <Pressable
        onPress={handleToggle}
        disabled={status === 'triggered' || busy}
        hitSlop={12}
      >
        <Text style={[styles.badge, styles[`badge_${status}`]]}>
          {badgeLabel(status)}
        </Text>
      </Pressable>
    </Pressable>
  );
}

function EmptyState() {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle}>No alerts yet</Text>
      <Text style={styles.emptyBody}>
        Create your first price alert to get notified when a market hits your
        target.
      </Text>
    </View>
  );
}

function getStatus(alert: PriceAlert) {
  if (alert.triggeredAt) return 'triggered';
  return alert.isActive ? 'on' : 'off';
}

function badgeLabel(status: AlertStatus) {
  if (status === 'on') return 'On';
  if (status === 'off') return 'Off';
  return 'Read';
}

function getSubtitle(alert: PriceAlert, status: AlertStatus) {
  if (status === 'on') return 'Active · push notification on';
  if (status === 'off') return 'Paused · tap badge to resume';
  return `Triggered ${formatTriggeredAt(alert.triggeredAt!)}`;
}

function formatPrice(value: number) {
  return `$${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
}

function formatTriggeredAt(iso: string) {
  const triggered = new Date(iso);
  const now = new Date();
  const sameDay =
    triggered.getFullYear() === now.getFullYear() &&
    triggered.getMonth() === now.getMonth() &&
    triggered.getDate() === now.getDate();
  if (sameDay) return 'today';

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const wasYesterday =
    triggered.getFullYear() === yesterday.getFullYear() &&
    triggered.getMonth() === yesterday.getMonth() &&
    triggered.getDate() === yesterday.getDate();
  if (wasYesterday) return 'yesterday';

  return triggered.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  createBtn: {
    marginTop: 24,
    marginBottom: 16,
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
  itemBusy: {
    opacity: 0.5,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
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
  itemSubtitle: {
    fontFamily: Fonts.regular,
    color: Colors.ash,
    fontSize: 12,
  },
  badge: {
    fontFamily: Fonts.medium,
    fontSize: 13,
  },
  badge_on: {
    color: Colors.green,
  },
  badge_off: {
    color: Colors.red,
  },
  badge_triggered: {
    color: Colors.ash,
  },
  empty: {
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    gap: 10,
    marginTop: 8,
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
