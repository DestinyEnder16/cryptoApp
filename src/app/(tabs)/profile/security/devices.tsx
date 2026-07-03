import AppBackground from '@/src/components/AppBackground';
import Loader from '@/src/components/Loader';
import ScreenIntro from '@/src/components/ScreenIntro';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { getApiErrorMessage } from '@/src/helpers/getApiErrorMessage';
import { platformShort, platformTitle } from '@/src/helpers/devicePlatform';
import { useEnsureDeviceRegistered } from '@/src/hooks/useEnsureDeviceRegistered';
import type { RegisteredDevice } from '@/src/store/api/devicesApi';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function Devices() {
  const {
    devices,
    isLoadingDevices,
    token: thisDeviceToken,
    tokenError,
    isRegistering,
    registerError,
    retry,
  } = useEnsureDeviceRegistered(true);

  const errorMessage = tokenError
    ? tokenError
    : registerError
    ? getApiErrorMessage(registerError, 'Could not register this device.')
    : null;

  return (
    <AppBackground>
      <View style={styles.container}>
        <ScreenIntro
          title="Devices"
          description="Registered devices for push notification and session awareness."
          hasBackBtn
        />

        {isLoadingDevices ? (
          <View style={styles.loader}>
            <Loader />
          </View>
        ) : devices.length === 0 ? (
          <EmptyState
            errorMessage={errorMessage}
            isBusy={isRegistering}
            onRetry={retry}
          />
        ) : (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {devices.map((device) => (
              <DeviceRow
                key={device.id}
                device={device}
                isCurrent={device.expoPushToken === thisDeviceToken}
              />
            ))}
          </ScrollView>
        )}
      </View>
    </AppBackground>
  );
}

interface DeviceRowProps {
  device: RegisteredDevice;
  isCurrent: boolean;
}

function DeviceRow({ device, isCurrent }: DeviceRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.dot} />
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{platformTitle(device.platform)}</Text>
        <Text style={styles.rowSubtitle}>
          {platformShort(device.platform)} ·{' '}
          {isCurrent
            ? 'Push enabled'
            : `Last seen ${formatLastSeen(device.lastSeenAt)}`}
        </Text>
      </View>
      <Text style={styles.badge}>{isCurrent ? 'Current' : 'Active'}</Text>
    </View>
  );
}

interface EmptyStateProps {
  errorMessage: string | null;
  isBusy: boolean;
  onRetry: () => void;
}

function EmptyState({ errorMessage, isBusy, onRetry }: EmptyStateProps) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle}>
        {errorMessage ? 'Registration failed' : 'No devices registered'}
      </Text>
      <Text style={styles.emptyBody}>
        {errorMessage ??
          'Allow notifications to register this device for security alerts and price updates.'}
      </Text>
      <Pressable
        style={[styles.retryBtn, isBusy && styles.retryBtnDisabled]}
        onPress={onRetry}
        disabled={isBusy}
      >
        <Text style={styles.retryBtnText}>
          {isBusy ? 'Registering…' : 'Try again'}
        </Text>
      </Pressable>
    </View>
  );
}

function formatLastSeen(iso: string) {
  const then = new Date(iso);
  if (Number.isNaN(then.getTime())) return '—';
  const now = new Date();
  if (then.toDateString() === now.toDateString()) return 'today';

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (then.toDateString() === yesterday.toDateString()) return 'yesterday';

  const diffDays = Math.floor((now.getTime() - then.getTime()) / 86_400_000);
  if (diffDays < 7) return `${diffDays}d ago`;
  return then.toLocaleDateString();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    marginTop: 40,
  },
  scroll: {
    flex: 1,
    marginTop: 24,
  },
  scrollContent: {
    gap: 12,
    paddingBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 9999,
    backgroundColor: Colors.green,
  },
  rowText: {
    flex: 1,
    gap: 4,
  },
  rowTitle: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 16,
  },
  rowSubtitle: {
    color: Colors.grey,
    fontFamily: Fonts.regular,
    fontSize: 13,
  },
  badge: {
    color: Colors.green,
    fontFamily: Fonts.medium,
    fontSize: 13,
  },
  empty: {
    marginTop: 24,
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    gap: 12,
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
  retryBtn: {
    marginTop: 4,
    backgroundColor: Colors.green,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  retryBtnDisabled: {
    opacity: 0.6,
  },
  retryBtnText: {
    color: Colors.dark,
    fontFamily: Fonts.medium,
    fontSize: 14,
  },
});
