import AppBackground from '@/src/shared/components/AppBackground';
import Btn from '@/src/shared/components/Btn';
import ScreenIntro from '@/src/shared/components/ScreenIntro';
import { Fonts } from '@/src/shared/constants/fonts';
import { Colors } from '@/src/shared/constants/styles';
import type { PriceAlertDirection } from '@/src/features/alerts/types/alerts';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function AlertCreatedScreen() {
  const { symbol, direction, targetPrice } = useLocalSearchParams<{
    symbol: string;
    direction: PriceAlertDirection;
    targetPrice: string;
  }>();

  const parsed = parseFloat(targetPrice ?? '0');
  const formattedTarget = parsed.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const directionLabel =
    direction === 'above' ? 'Above' : 'Below';

  const heading = `${symbol ?? '—'} ${direction ?? ''} $${formattedTarget}`;

  return (
    <AppBackground>
      <ScreenIntro
        title="Alert created"
        description="We will notify you when the target is reached."
      />

      <View style={styles.body}>
        {/* Success icon */}
        <View style={styles.iconWrap}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconCheck}>✓</Text>
          </View>
        </View>

        {/* Heading */}
        <Text style={styles.heading}>{heading}</Text>
        <Text style={styles.subheading}>
          This alert appears in Profile → Price Alerts and{'\n'}
          can be edited or deleted.
        </Text>

        {/* Info rows */}
        <View style={styles.infoBlock}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Asset</Text>
            <Text style={styles.infoValue}>{symbol ?? '—'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Direction</Text>
            <Text style={styles.infoValue}>{directionLabel}</Text>
          </View>
          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.infoLabel}>Target</Text>
            <Text style={styles.infoValue}>${formattedTarget}</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Btn
          text="View alerts"
          action={() => router.navigate('/(tabs)/profile/priceAlerts')}
        />
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingTop: 32,
    gap: 16,
  },

  // ── Success icon ──────────────────────────────────────────────────────────
  iconWrap: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.lime,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCheck: {
    color: Colors.lightGreen,
    fontSize: 46,
    fontFamily: Fonts.bold,
    lineHeight: 54,
  },

  // ── Heading ───────────────────────────────────────────────────────────────
  heading: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 22,
    textAlign: 'center',
  },
  subheading: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },

  // ── Info rows ─────────────────────────────────────────────────────────────
  infoBlock: {
    marginTop: 8,
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 16,
    paddingHorizontal: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primaryBackgroundColor,
  },
  infoLabel: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 13,
  },
  infoValue: {
    color: Colors.text,
    fontFamily: Fonts.medium,
    fontSize: 13,
  },

  // ── Footer ────────────────────────────────────────────────────────────────
  footer: {
    paddingBottom: 8,
  },
});
