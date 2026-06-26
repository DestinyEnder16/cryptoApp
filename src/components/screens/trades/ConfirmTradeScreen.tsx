import AppBackground from '@/src/components/AppBackground';
import ScreenIntro from '@/src/components/ScreenIntro';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { formatAmount } from '@/src/helpers/formatAmount';
import { getApiErrorMessage } from '@/src/helpers/getApiErrorMessage';
import { useExecuteTradeMutation, useGetQuoteQuery } from '@/src/store/api/tradeApi';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const PIN_LENGTH = 4;
const PAD_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];

export default function ConfirmTradeScreen() {
  const { quoteId } = useLocalSearchParams<{ quoteId?: string }>();

  const { data: quote, isLoading: quoteLoading } = useGetQuoteQuery(quoteId!, {
    skip: !quoteId,
  });

  const [executeTrade, { isLoading: executing }] = useExecuteTradeMutation();
  const [pin, setPin] = useState('');

  function handleKey(key: string) {
    if (executing) return;
    if (key === '⌫') {
      setPin((p) => p.slice(0, -1));
      return;
    }
    if (!key) return;
    if (pin.length >= PIN_LENGTH) return;
    const next = pin + key;
    setPin(next);
    if (next.length === PIN_LENGTH) {
      submitTrade(next);
    }
  }

  async function submitTrade(enteredPin: string) {
    if (!quoteId) return;
    try {
      const result = await executeTrade({ quoteId, pin: enteredPin }).unwrap();
      const tx = result.transaction;
      router.navigate(
        `/trades/result?status=completed` +
          `&txnId=${tx.id}` +
          `&reference=${tx.reference}` +
          `&fromAsset=${tx.fromAsset}` +
          `&toAsset=${tx.toAsset}` +
          `&toAmount=${tx.toAmount}` +
          `&feeAmount=${tx.feeAmount}`
      );
    } catch (err) {
      const message = getApiErrorMessage(err, 'Trade execution failed.');
      setPin('');
      router.navigate(
        `/trades/result?status=failed&errorMessage=${encodeURIComponent(message)}&fromAsset=${quote?.fromAsset ?? ''}&toAsset=${quote?.toAsset ?? ''}&fromAmount=${quote?.fromAmount ?? ''}`
      );
    }
  }

  const label = quote
    ? `${quote.type.charAt(0).toUpperCase() + quote.type.slice(1)} ${quote.toAsset}`
    : '…';

  return (
    <AppBackground>
      <ScreenIntro
        title="Confirm trade"
        description="Enter your transaction PIN to execute this quote."
        hasBackBtn
      />

      <View style={{ flex: 1, paddingTop: 24, gap: 24 }}>
        {/* Trade summary card */}
        {quoteLoading ? (
          <ActivityIndicator color={Colors.green} />
        ) : quote ? (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>{label}</Text>
            <Text style={styles.summaryLine}>
              {formatAmount(quote.fromAmount)} {quote.fromAsset} →{' '}
              {formatAmount(quote.toAmount)} {quote.toAsset}
            </Text>
            <Text style={styles.summaryFee}>
              Fee: {formatAmount(quote.feeAmount)} {quote.fromAsset}
            </Text>
          </View>
        ) : null}

        {/* PIN display */}
        <View style={styles.pinSection}>
          <Text style={styles.pinLabel}>Transaction PIN</Text>
          <View style={styles.pinDots}>
            {Array.from({ length: PIN_LENGTH }).map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i < pin.length && styles.dotFilled]}
              />
            ))}
          </View>
        </View>

        {/* Number pad */}
        {executing ? (
          <ActivityIndicator
            color={Colors.green}
            size="large"
            style={{ marginTop: 24 }}
          />
        ) : (
          <View style={styles.pad}>
            {PAD_KEYS.map((key, idx) => (
              <Pressable
                key={idx}
                style={[styles.padKey, !key && styles.padKeyEmpty]}
                onPress={() => handleKey(key)}
                disabled={!key && key !== '0'}
              >
                <Text
                  style={[
                    styles.padKeyTxt,
                    key === '⌫' && styles.padKeyBackspace,
                  ]}
                >
                  {key}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        <Text style={styles.disclaimer}>
          The API executes only after a valid PIN is submitted. Your quote will
          be consumed on execution.
        </Text>
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 16,
    padding: 20,
    gap: 8,
  },
  summaryTitle: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 18,
  },
  summaryLine: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 13,
  },
  summaryFee: {
    color: Colors.textMuted,
    fontFamily: Fonts.regular,
    fontSize: 12,
  },
  pinSection: {
    alignItems: 'center',
    gap: 20,
  },
  pinLabel: {
    color: Colors.ash,
    fontFamily: Fonts.medium,
    fontSize: 14,
  },
  pinDots: {
    flexDirection: 'row',
    gap: 20,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.ash,
    backgroundColor: 'transparent',
  },
  dotFilled: {
    backgroundColor: Colors.green,
    borderColor: Colors.green,
  },
  pad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 20,
  },
  padKey: {
    width: '30%',
    aspectRatio: 1.8,
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  padKeyEmpty: {
    backgroundColor: 'transparent',
  },
  padKeyTxt: {
    color: Colors.text,
    fontFamily: Fonts.medium,
    fontSize: 22,
  },
  padKeyBackspace: {
    fontSize: 18,
    color: Colors.ash,
  },
  disclaimer: {
    color: Colors.textMuted,
    fontFamily: Fonts.regular,
    fontSize: 11,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 18,
  },
});
