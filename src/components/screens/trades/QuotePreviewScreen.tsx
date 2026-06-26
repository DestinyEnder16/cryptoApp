import AppBackground from '@/src/components/AppBackground';
import Btn from '@/src/components/Btn';
import ScreenIntro from '@/src/components/ScreenIntro';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { formatAmount } from '@/src/helpers/formatAmount';
import { useGetQuoteQuery } from '@/src/store/api/tradeApi';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

function InfoRow({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <View style={styles.infoRow}>
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

  // Seed the countdown once we have the real expiry timestamp from the API.
  useEffect(() => {
    if (!quote) return;
    const computeRemaining = () =>
      Math.max(0, Math.floor((new Date(quote.expiresAt).getTime() - Date.now()) / 1000));

    setSecondsLeft(computeRemaining());
    intervalRef.current = setInterval(() => {
      const rem = computeRemaining();
      setSecondsLeft(rem);
      if (rem === 0) clearInterval(intervalRef.current!);
    }, 1000);

    return () => clearInterval(intervalRef.current!);
  }, [quote?.expiresAt]);

  const expired = quote?.isExpired || secondsLeft === 0;

  function handleConfirm() {
    router.navigate(`/trades/confirm?quoteId=${quoteId}`);
  }

  function handleNewQuote() {
    router.back();
  }

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
        <ActivityIndicator color={Colors.green} size="large" style={{ marginTop: 60 }} />
      </AppBackground>
    );
  }

  return (
    <AppBackground>
      <ScreenIntro
        title="Quote preview"
        description="Confirm the details before your quote expires."
        hasBackBtn
      />

      <View style={{ flex: 1, paddingTop: 24, gap: 20 }}>
        {/* Timer / expired banner */}
        {!expired ? (
          <View style={styles.timerRow}>
            <View style={styles.timerBadge}>
              <Text style={styles.timerTxt}>{countdownDisplay}</Text>
            </View>
            <Text style={styles.timerNote}>
              Quote expires in {secondsLeft}s
            </Text>
          </View>
        ) : (
          <View style={styles.expiredBanner}>
            <Text style={styles.expiredIcon}>!</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.expiredTitle}>Quote expired</Text>
              <Text style={styles.expiredDesc}>
                This quote is no longer valid. Get a new one to continue.
              </Text>
            </View>
          </View>
        )}

        {/* Quote detail rows */}
        {quote && (
          <View style={styles.card}>
            <InfoRow
              label="Action"
              value={`${quote.type.charAt(0).toUpperCase() + quote.type.slice(1)} ${quote.toAsset}`}
            />
            <InfoRow
              label="From"
              value={`${formatAmount(quote.fromAmount)} ${quote.fromAsset}`}
            />
            <InfoRow
              label="To"
              value={`${formatAmount(quote.toAmount)} ${quote.toAsset}`}
            />
            <InfoRow
              label="Rate"
              value={`1 ${quote.toAsset} = ${quote.rate.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${quote.fromAsset}`}
            />
            <InfoRow
              label="Fee"
              value={`${formatAmount(quote.feeAmount)} ${quote.fromAsset}`}
            />
            <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.infoLabel}>Estimated balance</Text>
              <Text style={[styles.infoValue, { color: Colors.green }]}>
                {formatAmount(quote.toAmount)} {quote.toAsset}
              </Text>
            </View>
          </View>
        )}

        {/* Expired quote meta */}
        {expired && quote && (
          <View style={styles.metaCard}>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Expired quote</Text>
              <Text style={styles.metaValue}>{quote.id}</Text>
            </View>
            <View style={[styles.metaRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.metaLabel}>Amount</Text>
              <Text style={styles.metaValue}>
                {formatAmount(quote.fromAmount)} {quote.fromAsset}
              </Text>
            </View>
          </View>
        )}
      </View>

      {!expired ? (
        <Btn text="Confirm with PIN" action={handleConfirm} fontSize={16} />
      ) : (
        <Pressable style={styles.newQuoteBtn} onPress={handleNewQuote}>
          <Text style={styles.newQuoteTxt}>Get new quote</Text>
        </Pressable>
      )}
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timerBadge: {
    backgroundColor: Colors.lime,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  timerTxt: {
    color: Colors.green,
    fontFamily: Fonts.bold,
    fontSize: 16,
    letterSpacing: 1,
  },
  timerNote: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 13,
  },
  expiredBanner: {
    backgroundColor: '#2A1A08',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    borderWidth: 1,
    borderColor: Colors.orangeBrown,
  },
  expiredIcon: {
    color: Colors.orangeBrown,
    fontFamily: Fonts.bold,
    fontSize: 20,
    width: 28,
    textAlign: 'center',
  },
  expiredTitle: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 15,
    marginBottom: 4,
  },
  expiredDesc: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 13,
  },
  card: {
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 16,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
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
    flexShrink: 1,
    textAlign: 'right',
    marginLeft: 12,
  },
  metaCard: {
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 16,
    overflow: 'hidden',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primaryBackgroundColor,
  },
  metaLabel: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 13,
  },
  metaValue: {
    color: Colors.textMuted,
    fontFamily: Fonts.medium,
    fontSize: 13,
  },
  newQuoteBtn: {
    backgroundColor: Colors.orangeBrown,
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  newQuoteTxt: {
    color: Colors.dark,
    fontFamily: Fonts.medium,
    fontSize: 16,
  },
});
