import AppBackground from '@/src/shared/components/AppBackground';
import ScreenIntro from '@/src/shared/components/ScreenIntro';
import { Fonts } from '@/src/shared/constants/fonts';
import { Colors } from '@/src/shared/constants/styles';
import { formatAmount } from '@/src/shared/helpers/formatAmount';
import { getApiErrorMessage } from '@/src/shared/helpers/getApiErrorMessage';
import { format, gt, isPositive, mul } from '@/src/shared/helpers/money';
import { showToast } from '@/src/shared/helpers/showToast';
import { useFetchAssetDetailsQuery } from '@/src/features/markets/store/marketApi';
import { useVerification } from '@/src/features/kyc/hooks/useVerification';
import { useCreateQuoteMutation } from '@/src/features/trades/store/tradeApi';
import { useGetWalletQuery } from '@/src/features/wallet/store/walletApi';
import TradesLockedScreen from './TradesLockedScreen';
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

const ASSET_DOT: { [asset: string]: string } = {
  USDT: Colors.green,
  USDC: Colors.blue,
  BTC:  Colors.green,
  ETH:  Colors.red,
  SOL:  Colors.blue,
};

// Static per-tab config — labels, colors, button text.
// fromAsset / toAsset / title are derived dynamically from the symbol prop.
const TAB_CONFIG = {
  buy: {
    description: 'Create a quote before confirming with PIN.',
    fromLabel:   'You pay',
    toLabel:     'You receive',
    btnLabel:    'Get quote',
    btnBg:       Colors.lightGreen,
    btnTxt:      Colors.dark,
  },
  sell: {
    description: 'Preview rate and fees before execution.',
    fromLabel:   'You sell',
    toLabel:     'You receive',
    btnLabel:    'Get quote',
    btnBg:       Colors.red,
    btnTxt:      Colors.text,
  },
  swap: {
    description: 'Convert one supported coin into another.',
    fromLabel:   'From',
    toLabel:     'To',
    btnLabel:    'Preview swap',
    btnBg:       Colors.lightGreen,
    btnTxt:      Colors.dark,
  },
};

// Fallback when no symbol is passed in (direct navigation to /trades/buy)
const DEFAULT_SYMBOL: { buy: string; sell: string; swap: string } = {
  buy:  'BTC',
  sell: 'ETH',
  swap: 'SOL',
};

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
const STABLE_ASSETS = new Set(['USDT', 'USDC']);

// Returns fromAsset + toAsset for a given tab + coin symbol.
function deriveAssets(tab: TabKey, sym: string) {
  switch (tab) {
    case 'buy':  return { fromAsset: 'USDT', toAsset: sym };
    case 'sell': return { fromAsset: sym, toAsset: 'USDT' };
    case 'swap': return { fromAsset: sym, toAsset: sym === 'BTC' ? 'ETH' : 'BTC' };
  }
}

interface Props {
  initialTab?: TabKey;
  /** Coin symbol coming from the coin detail page (e.g. 'ETH'). */
  symbol?: string;
}

export default function TradeFormScreen({ initialTab = 'buy', symbol }: Props) {
  const { isKycApproved, isLoading: kycLoading } = useVerification();
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  const [fromAmount, setFromAmount] = useState('');
  const inputRef = useRef<TextInput>(null);

  const [createQuote, { isLoading }] = useCreateQuoteMutation();
  const config = TAB_CONFIG[activeTab];

  // When a symbol is passed (from coin page), it stays fixed across tab switches.
  // When no symbol is passed, use the per-tab default so behavior matches before.
  const resolvedSymbol = symbol ?? DEFAULT_SYMBOL[activeTab];
  const { fromAsset, toAsset } = deriveAssets(activeTab, resolvedSymbol);

  // Live wallet balances
  const { data: walletData } = useGetWalletQuery();
  const availableBalance =
    walletData?.wallet.balances.find((b) => b.assetSymbol === fromAsset)?.available ?? 0;

  // Live prices — stablecoins are always $1
  const { data: fromDetails } = useFetchAssetDetailsQuery(fromAsset, {
    skip: STABLE_ASSETS.has(fromAsset),
  });
  const { data: toDetails } = useFetchAssetDetailsQuery(toAsset, {
    skip: STABLE_ASSETS.has(toAsset),
  });

  const fromPriceUsd = STABLE_ASSETS.has(fromAsset) ? 1 : (fromDetails?.priceUsd ?? 0);
  const toPriceUsd   = STABLE_ASSETS.has(toAsset)   ? 1 : (toDetails?.priceUsd   ?? 0);

  // How many toAsset units you receive per 1 fromAsset unit
  const rate = toPriceUsd > 0 ? fromPriceUsd / toPriceUsd : 0;

  // Derive screen title from the live coin name so it stays correct.
  // Buy = coin being received; Sell/Swap = coin being sent.
  const coinDetails = activeTab === 'buy' ? toDetails : fromDetails;
  const coinName = coinDetails?.name ?? resolvedSymbol;
  const title = activeTab === 'swap'
    ? `Swap ${coinName}`
    : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} ${coinName}`;

  useEffect(() => { setFromAmount(''); }, [activeTab]);

  const inputAmount = parseFloat(fromAmount) || 0;

  const previewToAmount = (() => {
    if (!inputAmount || !rate) return '';
    // Decimal-safe: avoid float error in inputAmount * rate before display.
    const r = mul(inputAmount, rate);
    if (r.lt(0.001)) return format(r, 6);
    if (r.lt(1))     return format(r, 5);
    return format(r, 2);
  })();

  // Compare the raw typed string against the balance with decimal precision so
  // an exact-balance amount isn't wrongly flagged (or wrongly allowed).
  const hasInsufficientBalance =
    isPositive(fromAmount) && gt(fromAmount, availableBalance);

  // "1 BTC = 64,200.50 USDT" for buy; "1 ETH = 1,840.80 USDT" for sell/swap
  const rateDisplay = (() => {
    if (!rate) return '—';
    if (STABLE_ASSETS.has(fromAsset)) {
      const formatted = toPriceUsd.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return `1 ${toAsset} = ${formatted} ${fromAsset}`;
    }
    const formatted =
      rate < 0.001 ? rate.toFixed(6) : rate < 1 ? rate.toFixed(5) : rate.toFixed(2);
    return `1 ${fromAsset} = ${formatted} ${toAsset}`;
  })();

  async function handleGetQuote() {
    if (!inputAmount || hasInsufficientBalance) return;
    try {
      const quote = await createQuote({
        type:       activeTab,
        fromAsset,
        toAsset,
        fromAmount: inputAmount,
      }).unwrap();
      router.navigate(`/trades/quote?quoteId=${quote.id}`);
    } catch (err) {
      showToast({
        type:    'error',
        title:   'Quote failed',
        message: getApiErrorMessage(err, 'Could not create a quote. Try again.'),
      });
    }
  }

  const canSubmit = inputAmount > 0 && !isLoading && !hasInsufficientBalance;

  // Content-level KYC gate. Guards direct deep-links to /trades/buy and the case
  // where the tab's `main` anchor mounts this screen beneath the stack for an
  // unverified user. Renders the locked screen inline (no redirect) so it holds
  // regardless of how this screen ended up in the stack.
  if (kycLoading) {
    return (
      <AppBackground>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={Colors.green} />
        </View>
      </AppBackground>
    );
  }
  if (!isKycApproved) return <TradesLockedScreen />;

  return (
    <AppBackground>
      <ScreenIntro
        title={title}
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
                    isActive && { backgroundColor: TAB_ACTIVE_BG[key] },
                  ]}
                  onPress={() => setActiveTab(key)}
                >
                  <Text
                    style={[
                      styles.tabTxt,
                      { color: isActive ? TAB_ACTIVE_TXT[key] : Colors.ash },
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
              <AssetBadge asset={fromAsset} />
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
              <AssetBadge asset={toAsset} />
            </View>
          </View>

          {/* Info rows */}
          <View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Available</Text>
              <Text style={styles.infoValue}>
                {formatAmount(availableBalance)} {fromAsset}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Total cost</Text>
              <Text
                style={[
                  styles.infoValue,
                  hasInsufficientBalance && { color: Colors.red },
                ]}
              >
                {inputAmount > 0 ? `${fromAmount} ${fromAsset}` : '—'}
              </Text>
            </View>

            <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.infoLabel}>Estimated rate</Text>
              <Text style={styles.infoValue}>{rateDisplay}</Text>
            </View>
          </View>

          {/* Insufficient balance warning */}
          {hasInsufficientBalance && (
            <Text style={styles.warningTxt}>
              Insufficient balance — you only have{' '}
              {formatAmount(availableBalance)} {fromAsset} available.
            </Text>
          )}
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
    color: Colors.text,
    fontFamily: Fonts.medium,
    fontSize: 13,
    flexShrink: 1,
    textAlign: 'right',
    marginLeft: 12,
  },

  // ── Warning text ──────────────────────────────────────────────────────────
  warningTxt: {
    color: Colors.red,
    fontFamily: Fonts.regular,
    fontSize: 13,
    textAlign: 'center',
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
