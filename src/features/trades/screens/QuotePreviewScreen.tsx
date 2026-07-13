import AppBackground from '@/src/shared/components/AppBackground';
import Btn from '@/src/shared/components/Btn';
import ScreenIntro from '@/src/shared/components/ScreenIntro';
import { Fonts } from '@/src/shared/constants/fonts';
import { Colors } from '@/src/shared/constants/styles';
import { formatAmount } from '@/src/shared/helpers/formatAmount';
import { useGetQuoteQuery } from '@/src/features/trades/store/tradeApi';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

function InfoCard({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <View style={styles.infoCard}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, valueColor ? { color: valueColor } : {}]}>
        {value}
      </Text>
    </View>
  );
}

export default function QuotePreviewScreen() {
  const { quoteId } = useLocalSearchParams<{ quoteId?: string }>();

  const { data: quote, isLoading } = useGetQuoteQuery(quoteId!, {
    skip: !quoteId,
  });

  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!quote) return;
    const computeRemaining = () =>
      Math.max(
        0,
        Math.floor((new Date(quote.expiresAt).getTime() - Date.now()) / 1000)
      );

    setSecondsLeft(computeRemaining());
    intervalRef.current = setInterval(() => {
      const rem = computeRemaining();
      setSecondsLeft(rem);
      if (rem === 0) clearInterval(intervalRef.current!);
    }, 1000);

    return () => clearInterval(intervalRef.current!);
  }, [quote?.expiresAt]);

  const expired = quote?.isExpired || secondsLeft === 0;

  const pad = (n: number) => String(n).padStart(2, '0');
  const s = secondsLeft ?? 0;
  const countdownDisplay = `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;

  if (isLoading || secondsLeft === null) {
    return (
      <AppBackground>
        <ScreenIntro
          title="Quote preview"
          description="Confirming quote details…"
          hasBackBtn
        />
        <ActivityIndicator
          color={Colors.green}
          size="large"
          style={{ marginTop: 60 }}
        />
      </AppBackground>
    );
  }

  /* ── EXPIRED STATE ─────────────────────────────────────────────────────── */
  if (expired) {
    return (
      <AppBackground>
        <ScreenIntro
          title="Quote expired"
          description="Rates moved. Request a fresh quote before trading."
          hasBackBtn
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 24, paddingBottom: 32, gap: 10 }}
        >
          {/* Centered expired card */}
          <View style={styles.expiredCard}>
            <View style={styles.expiredIconCircle}>
              <Text style={styles.expiredIconTxt}>!</Text>
            </View>
            <Text style={styles.expiredHeading}>
              This quote is no longer valid
            </Text>
            <Text style={styles.expiredSubtitle}>
              Get a new quote so the rate, fee, and receive amount are current.
            </Text>
          </View>

          {/* Meta info cards */}
          {quote && (
            <>
              <InfoCard label="Expired quote" value={quote.id} />
              <InfoCard
                label="Previous receive"
                value={`${formatAmount(quote.toAmount)} ${quote.toAsset}`}
              />
            </>
          )}
        </ScrollView>

        <Pressable style={styles.amberBtn} onPress={() => router.back()}>
          <Text style={styles.amberBtnTxt}>Get new quote</Text>
        </Pressable>
      </AppBackground>
    );
  }

  /* ── ACTIVE STATE ──────────────────────────────────────────────────────── */
  return (
    <AppBackground>
      <ScreenIntro
        title="Quote preview"
        description="Confirm the rate before this quote expires."
        hasBackBtn
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 24, paddingBottom: 32, gap: 8 }}
      >
        {/* Full-width timer card */}
        <View style={[styles.timerCard, { marginBottom: 8 }]}>
          <Text style={styles.timerLabel}>Expires in</Text>
          <Text style={styles.timerValue}>{countdownDisplay}</Text>
        </View>

        {/* Individual detail cards */}
        {quote && (
          <>
            <InfoCard
              label="From"
              value={`${formatAmount(quote.fromAmount)} ${quote.fromAsset}`}
            />
            <InfoCard
              label="To"
              value={`${formatAmount(quote.toAmount)} ${quote.toAsset}`}
            />
            <InfoCard
              label="Rate"
              value={`1 ${quote.toAsset} = ${quote.rate.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })} ${quote.fromAsset}`}
            />
            <InfoCard
              label="Fee"
              value={`${formatAmount(quote.feeAmount)} ${quote.fromAsset}`}
            />
            <InfoCard
              label="Estimated receive"
              value={`${formatAmount(quote.toAmount)} ${quote.toAsset}`}
              valueColor={Colors.green}
            />
          </>
        )}
      </ScrollView>

      <Btn
        text="Confirm with PIN"
        action={() => router.navigate(`/trades/confirm?quoteId=${quoteId}`)}
        fontSize={16}
      />
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  // ── Timer ─────────────────────────────────────────────────────────────────
  timerCard: {
    backgroundColor: Colors.lime,
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timerLabel: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 14,
  },
  timerValue: {
    color: Colors.green,
    fontFamily: Fonts.bold,
    fontSize: 30,
    letterSpacing: 2,
  },

  // ── Info card (active state) ───────────────────────────────────────────────
  infoCard: {
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    flexShrink: 1,
    textAlign: 'right',
    marginLeft: 16,
  },

  // ── Expired state ─────────────────────────────────────────────────────────
  expiredCard: {
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    gap: 14,
    marginBottom: 6,
  },
  expiredIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.brown,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  expiredIconTxt: {
    color: Colors.orangeBrown,
    fontFamily: Fonts.bold,
    fontSize: 40,
  },
  expiredHeading: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 18,
    textAlign: 'center',
  },
  expiredSubtitle: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
  amberBtn: {
    backgroundColor: Colors.orangeBrown,
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  amberBtnTxt: {
    color: Colors.dark,
    fontFamily: Fonts.medium,
    fontSize: 16,
  },
});
