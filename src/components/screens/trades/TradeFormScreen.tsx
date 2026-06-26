import AppBackground from '@/src/components/AppBackground';
import Btn from '@/src/components/Btn';
import ScreenIntro from '@/src/components/ScreenIntro';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { getApiErrorMessage } from '@/src/helpers/getApiErrorMessage';
import { showToast } from '@/src/helpers/showToast';
import { useCreateQuoteMutation } from '@/src/store/api/tradeApi';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type TabKey = 'buy' | 'sell' | 'swap';

const TAB_LABELS: { key: TabKey; label: string }[] = [
  { key: 'buy', label: 'Buy' },
  { key: 'sell', label: 'Sell' },
  { key: 'swap', label: 'Swap' },
];

const TAB_CONFIG = {
  buy: {
    title: 'Buy Bitcoin',
    description: 'Confirm your quote before execution',
    fromLabel: 'You pay',
    fromAsset: 'USDT',
    toLabel: 'You receive',
    toAsset: 'BTC',
    previewRate: 64200.5,
    calcPreview: (from: number) => from / 64200.5,
    btnLabel: 'Get quote',
    infoRows: [
      { label: 'Estimated fee', value: '1 BTC = 64,263.50 USDT' },
      { label: 'Verification limit', value: '$5,000' },
    ],
  },
  sell: {
    title: 'Sell Ethereum',
    description: 'Confirm your quote before execution',
    fromLabel: 'You sell',
    fromAsset: 'ETH',
    toLabel: 'You receive',
    toAsset: 'USDT',
    previewRate: 1840.8,
    calcPreview: (from: number) => from * 1840.8,
    btnLabel: 'Get quote',
    infoRows: [
      { label: 'Fee estimate', value: '15.30 USDT' },
      { label: 'Service after fees', value: '1,840.80 USDT' },
    ],
  },
  swap: {
    title: 'Swap assets',
    description: 'Route through liquidity for the best price',
    fromLabel: 'From',
    fromAsset: 'SOL',
    toLabel: 'To',
    toAsset: 'BTC',
    previewRate: 0.002275,
    calcPreview: (from: number) => from * 0.002275,
    btnLabel: 'Preview swap',
    infoRows: [
      { label: 'New estimate', value: '$5.8' },
      { label: 'Route', value: 'SOL → USDT → BTC' },
    ],
  },
};

interface Props {
  initialTab?: TabKey;
}

export default function TradeFormScreen({ initialTab = 'buy' }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  const [fromAmount, setFromAmount] = useState('');
  const inputRef = useRef<TextInput>(null);

  const [createQuote, { isLoading }] = useCreateQuoteMutation();

  const config = TAB_CONFIG[activeTab];

  useEffect(() => {
    setFromAmount('');
  }, [activeTab]);

  const previewToAmount = (() => {
    const n = parseFloat(fromAmount);
    if (!n || n <= 0) return '';
    const result = config.calcPreview(n);
    return result < 0.001
      ? result.toFixed(6)
      : result < 1
      ? result.toFixed(5)
      : result.toFixed(2);
  })();

  async function handleGetQuote() {
    const n = parseFloat(fromAmount);
    if (!n || n <= 0) return;
    try {
      const quote = await createQuote({
        type: activeTab,
        fromAsset: config.fromAsset,
        toAsset: config.toAsset,
        fromAmount: n,
      }).unwrap();
      router.navigate(`/trades/quote?quoteId=${quote.id}`);
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Quote failed',
        message: getApiErrorMessage(err, 'Could not create a quote. Try again.'),
      });
    }
  }

  const canSubmit = !!fromAmount && parseFloat(fromAmount) > 0 && !isLoading;

  return (
    <AppBackground>
      <ScreenIntro
        title={config.title}
        description={config.description}
        hasBackBtn
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 20, paddingBottom: 32, gap: 16 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Tab switcher */}
          <View style={styles.tabRow}>
            {TAB_LABELS.map(({ key, label }) => (
              <Pressable
                key={key}
                style={[styles.tab, activeTab === key && styles.tabActive]}
                onPress={() => setActiveTab(key)}
              >
                <Text
                  style={[
                    styles.tabTxt,
                    activeTab === key && styles.tabTxtActive,
                  ]}
                >
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Amount card */}
          <View style={styles.card}>
            <View style={styles.amountBlock}>
              <Text style={styles.amountLabel}>{config.fromLabel}</Text>
              <View style={styles.amountRow}>
                <TextInput
                  ref={inputRef}
                  value={fromAmount}
                  onChangeText={setFromAmount}
                  placeholder="0.00"
                  placeholderTextColor={Colors.ash}
                  keyboardType="decimal-pad"
                  style={styles.amountInput}
                />
                <View style={styles.assetPill}>
                  <Text style={styles.assetTxt}>{config.fromAsset}</Text>
                  <Text style={styles.assetArrow}>▾</Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.amountBlock}>
              <Text style={styles.amountLabel}>{config.toLabel}</Text>
              <View style={styles.amountRow}>
                <Text
                  style={[
                    styles.amountInput,
                    { color: previewToAmount ? Colors.text : Colors.ash },
                  ]}
                >
                  {previewToAmount || '0.00'}
                </Text>
                <View style={styles.assetPill}>
                  <Text style={styles.assetTxt}>{config.toAsset}</Text>
                  <Text style={styles.assetArrow}>▾</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Info rows */}
          <View style={styles.infoCard}>
            {config.infoRows.map((row) => (
              <View key={row.label} style={styles.infoRow}>
                <Text style={styles.infoLabel}>{row.label}</Text>
                <Text style={styles.infoValue}>{row.value}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={{ paddingBottom: 8, gap: 12 }}>
          {isLoading && (
            <ActivityIndicator color={Colors.green} style={{ alignSelf: 'center' }} />
          )}
          <Btn
            text={config.btnLabel}
            action={handleGetQuote}
            disabled={!canSubmit}
            fontSize={16}
          />
        </View>
      </KeyboardAvoidingView>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  tabRow: {
    flexDirection: 'row',
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: Colors.lime,
  },
  tabTxt: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: Colors.ash,
  },
  tabTxtActive: {
    color: Colors.green,
  },
  card: {
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 20,
    overflow: 'hidden',
  },
  amountBlock: {
    padding: 20,
    gap: 10,
  },
  amountLabel: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 12,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  amountInput: {
    flex: 1,
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 28,
  },
  assetPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primaryBackgroundColor,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  assetTxt: {
    color: Colors.text,
    fontFamily: Fonts.medium,
    fontSize: 14,
  },
  assetArrow: {
    color: Colors.ash,
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.primaryBackgroundColor,
    marginHorizontal: 20,
  },
  infoCard: {
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
});
