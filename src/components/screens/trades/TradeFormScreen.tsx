import AppBackground from '@/src/components/AppBackground';
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

// Colored dot shown next to asset name
const ASSET_DOT: { [asset: string]: string } = {
  USDT: Colors.green,
  USDC: Colors.blue,
  BTC:  Colors.green,
  ETH:  Colors.red,
  SOL:  Colors.blue,
};

const TAB_CONFIG = {
  buy: {
    title:       'Buy Bitcoin',
    description: 'Create a quote before confirming with PIN.',
    fromLabel:   'You pay',
    fromAsset:   'USDT',
    toLabel:     'You receive',
    toAsset:     'BTC',
    calcPreview: (from: number) => from / 64200.5,
    btnLabel:    'Get quote',
    btnBg:       Colors.lightGreen,
    btnTxt:      Colors.dark,
    infoRows: [
      { label: 'Available',          value: '920.00 USDT', valueColor: Colors.text  },
      { label: 'Estimated rate',     value: '1 BTC = 64,200.50 USDT', valueColor: Colors.text  },
      { label: 'Verification limit', value: '$5,000',      valueColor: Colors.green },
    ],
  },
  sell: {
    title:       'Sell Ethereum',
    description: 'Preview rate and fees before execution.',
    fromLabel:   'You sell',
    fromAsset:   'ETH',
    toLabel:     'You receive',
    toAsset:     'USDT',
    calcPreview: (from: number) => from * 1840.8,
    btnLabel:    'Get quote',
    btnBg:       Colors.red,
    btnTxt:      Colors.text,
    infoRows: [
      { label: 'Available',        value: '1.25 ETH',       valueColor: Colors.text },
      { label: 'Fee estimate',     value: '15.50 USDT',     valueColor: Colors.text },
      { label: 'Receive after fees', value: '1,540.80 USDT', valueColor: Colors.text },
    ],
  },
  swap: {
    title:       'Swap assets',
    description: 'Convert one supported coin into another.',
    fromLabel:   'From',
    fromAsset:   'SOL',
    toLabel:     'To',
    toAsset:     'BTC',
    calcPreview: (from: number) => from * 0.002275,
    btnLabel:    'Preview swap',
    btnBg:       Colors.lightGreen,
    btnTxt:      Colors.dark,
    infoRows: [
      { label: 'Route',        value: 'SOL → USDT → BTC', valueColor: Colors.text },
      { label: 'Fee estimate', value: '$4.84',             valueColor: Colors.text },
      { label: 'Quote expires', value: '30 seconds',       valueColor: Colors.text },
    ],
  },
};

// Active tab pill color per tab key
const TAB_ACTIVE_BG: { buy: string; sell: string; swap: string } = {
  buy:  Colors.lightGreen,
  sell: Colors.red,
  swap: Colors.lightGreen,
};
const TAB_ACTIVE_TXT: { buy: string; sell: string; swap: string } = {
  buy:  Colors.dark,
  sell: Colors.text,
  swap: Colors.dark,
};

const TABS: TabKey[] = ['buy', 'sell', 'swap'];

interface Props {
  initialTab?: TabKey;
}

export default function TradeFormScreen({ initialTab = 'buy' }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  const [fromAmount, setFromAmount] = useState('');
  const inputRef = useRef<TextInput>(null);

  const [createQuote, { isLoading }] = useCreateQuoteMutation();
  const config = TAB_CONFIG[activeTab];

  useEffect(() => { setFromAmount(''); }, [activeTab]);

  const previewToAmount = (() => {
    const n = parseFloat(fromAmount);
    if (!n || n <= 0) return '';
    const r = config.calcPreview(n);
    return r < 0.001 ? r.toFixed(6) : r < 1 ? r.toFixed(5) : r.toFixed(2);
  })();

  async function handleGetQuote() {
    const n = parseFloat(fromAmount);
    if (!n || n <= 0) return;
    try {
      const quote = await createQuote({
        type: activeTab,
        fromAsset: config.fromAsset,
        toAsset:   config.toAsset,
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
          contentContainerStyle={{ paddingTop: 20, paddingBottom: 32, gap: 14 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Tab switcher */}
          <View style={styles.tabRow}>
            {TABS.map((key) => {
              const isActive = activeTab === key;
              return (
                <Pressable
                  key={key}
                  style={[
                    styles.tab,
                    isActive && {
                      backgroundColor: TAB_ACTIVE_BG[key],
                    },
                  ]}
                  onPress={() => setActiveTab(key)}
                >
                  <Text
                    style={[
                      styles.tabTxt,
                      isActive
                        ? { color: TAB_ACTIVE_TXT[key] }
                        : { color: Colors.ash },
                    ]}
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* "You pay / You sell / From" card */}
          <View style={styles.amountCard}>
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
              <AssetBadge asset={config.fromAsset} />
            </View>
          </View>

          {/* Swap direction arrow (swap tab only) */}
          {activeTab === 'swap' && (
            <View style={styles.swapArrowWrap}>
              <View style={styles.swapArrowBtn}>
                <Text style={styles.swapArrowTxt}>↓</Text>
              </View>
            </View>
          )}

          {/* "You receive / To" card */}
          <View style={styles.amountCard}>
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
              <AssetBadge asset={config.toAsset} />
            </View>
          </View>

          {/* Info rows — no card wrapper, transparent rows */}
          <View>
            {config.infoRows.map((row, i) => (
              <View
                key={row.label}
                style={[
                  styles.infoRow,
                  i === config.infoRows.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <Text style={styles.infoLabel}>{row.label}</Text>
                <Text style={[styles.infoValue, { color: row.valueColor }]}>
                  {row.value}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* CTA button */}
        <View style={{ paddingBottom: 8 }}>
          {isLoading && (
            <ActivityIndicator
              color={Colors.green}
              style={{ alignSelf: 'center', marginBottom: 10 }}
            />
          )}
          <Pressable
            style={[
              styles.ctaBtn,
              { backgroundColor: canSubmit ? config.btnBg : '#555' },
            ]}
            onPress={handleGetQuote}
            disabled={!canSubmit}
          >
            <Text style={[styles.ctaTxt, { color: config.btnTxt }]}>
              {config.btnLabel}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </AppBackground>
  );
}

function AssetBadge({ asset }: { asset: string }) {
  const dotColor = ASSET_DOT[asset] ?? Colors.ash;
  return (
    <View style={styles.assetBadge}>
      <View style={[styles.assetDot, { backgroundColor: dotColor }]} />
      <Text style={styles.assetTxt}>{asset}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // ── Tabs ──────────────────────────────────────────────────────────────────
  tabRow: {
    flexDirection: 'row',
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 11,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabTxt: {
    fontFamily: Fonts.medium,
    fontSize: 14,
  },

  // ── Amount cards ──────────────────────────────────────────────────────────
  amountCard: {
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  amountLabel: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 13,
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
    fontSize: 32,
  },

  // ── Swap arrow ────────────────────────────────────────────────────────────
  swapArrowWrap: {
    alignItems: 'center',
    marginVertical: -4,
    zIndex: 1,
  },
  swapArrowBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.lime,
    borderWidth: 3,
    borderColor: Colors.primaryBackgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swapArrowTxt: {
    color: Colors.green,
    fontSize: 16,
    fontFamily: Fonts.bold,
  },

  // ── Asset badge ───────────────────────────────────────────────────────────
  assetBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  assetDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
  },
  assetTxt: {
    color: Colors.text,
    fontFamily: Fonts.medium,
    fontSize: 15,
  },

  // ── Info rows ─────────────────────────────────────────────────────────────
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondaryBackgroundColor,
  },
  infoLabel: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 13,
  },
  infoValue: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    flexShrink: 1,
    textAlign: 'right',
    marginLeft: 12,
  },

  // ── CTA button ────────────────────────────────────────────────────────────
  ctaBtn: {
    width: '100%',
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  ctaTxt: {
    fontFamily: Fonts.medium,
    fontSize: 17,
  },
});
