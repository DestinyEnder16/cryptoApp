import AppBackground from '@/src/components/AppBackground';
import Btn from '@/src/components/Btn';
import ScreenIntro from '@/src/components/ScreenIntro';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { getApiErrorMessage } from '@/src/helpers/getApiErrorMessage';
import { showToast } from '@/src/helpers/showToast';
import { useCreatePriceAlertMutation } from '@/src/store/api/alertsApi';
import type { PriceAlertDirection } from '@/src/types/alerts/types';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
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

interface AssetOption {
  symbol: string;
  name: string;
  color: string;
  currentPrice: number;
}

const SUPPORTED_ASSETS: AssetOption[] = [
  { symbol: 'BTC', name: 'Bitcoin',  color: '#F7931A', currentPrice: 64200.5  },
  { symbol: 'ETH', name: 'Ethereum', color: '#627EEA', currentPrice: 1840.8   },
  { symbol: 'SOL', name: 'Solana',   color: '#9945FF', currentPrice: 42.5     },
];

const DIRECTIONS: PriceAlertDirection[] = ['above', 'below'];

export default function CreateAlertScreen() {
  const { symbol: routeSymbol } = useLocalSearchParams<{ symbol?: string }>();
  const initialAsset = SUPPORTED_ASSETS.find((a) => a.symbol === routeSymbol) ?? SUPPORTED_ASSETS[0];

  const [selectedAsset, setSelectedAsset] = useState<AssetOption>(initialAsset);
  const [direction, setDirection]         = useState<PriceAlertDirection>('above');
  const [targetPrice, setTargetPrice]     = useState('');

  const sheetRef = useRef<BottomSheet>(null);
  const [createAlert, { isLoading }] = useCreatePriceAlertMutation();

  const parsedTarget = parseFloat(targetPrice.replace(/,/g, ''));
  const canCreate    = !isNaN(parsedTarget) && parsedTarget > 0;

  const formattedTarget = canCreate
    ? parsedTarget.toLocaleString('en-US', { maximumFractionDigits: 2 })
    : '--';

  const triggerText = canCreate
    ? `${selectedAsset.symbol} ${direction} $${formattedTarget}`
    : '--';

  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.6}
        pressBehavior="close"
      />
    ),
    []
  );

  function selectAsset(asset: AssetOption) {
    setSelectedAsset(asset);
    setTargetPrice('');
    sheetRef.current?.close();
  }

  async function handleCreate() {
    if (!canCreate) return;
    try {
      await createAlert({
        assetSymbol:    selectedAsset.symbol,
        direction,
        targetPriceUsd: parsedTarget,
      }).unwrap();
      showToast({
        type:    'success',
        title:   'Alert created',
        message: `You'll be notified when ${triggerText}.`,
      });
      router.back();
    } catch (err) {
      showToast({
        type:    'error',
        title:   'Failed to create alert',
        message: getApiErrorMessage(err, 'Something went wrong. Try again.'),
      });
    }
  }

  return (
    <View style={styles.root}>
      <AppBackground>
        <ScreenIntro
          title="Create price alert"
          description={`Get notified when ${selectedAsset.symbol} crosses your target.`}
          hasBackBtn
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingTop: 24, paddingBottom: 32, gap: 16 }}
          >
            {/* Asset selector — tap to open coin picker */}
            <Pressable
              style={styles.assetCard}
              onPress={() => sheetRef.current?.snapToIndex(0)}
            >
              <View style={styles.assetLeft}>
                <View style={[styles.assetCircle, { backgroundColor: selectedAsset.color }]} />
                <View style={styles.assetMeta}>
                  <View style={styles.assetNameRow}>
                    <Text style={styles.assetSymbol}>{selectedAsset.symbol}</Text>
                    <Text style={styles.chevron}>▾</Text>
                  </View>
                  <Text style={styles.assetFullName}>{selectedAsset.name}</Text>
                </View>
              </View>
              <Text style={styles.assetPrice}>
                ${selectedAsset.currentPrice.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            </Pressable>

            {/* Direction toggle */}
            <View style={styles.dirRow}>
              {DIRECTIONS.map((dir) => {
                const active = direction === dir;
                return (
                  <Pressable
                    key={dir}
                    style={[styles.dirPill, active && styles.dirPillActive]}
                    onPress={() => setDirection(dir)}
                  >
                    <Text style={[styles.dirTxt, active && styles.dirTxtActive]}>
                      {dir.charAt(0).toUpperCase() + dir.slice(1)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Target price input */}
            <View style={styles.priceCard}>
              <Text style={styles.priceLabel}>Target price</Text>
              <View style={styles.priceRow}>
                <TextInput
                  value={targetPrice}
                  onChangeText={setTargetPrice}
                  placeholder="0"
                  placeholderTextColor={Colors.ash}
                  keyboardType="decimal-pad"
                  style={styles.priceInput}
                />
                <Text style={styles.priceCurrency}>USD</Text>
              </View>
            </View>

            {/* Info rows */}
            <View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Trigger</Text>
                <Text style={styles.infoValue}>{triggerText}</Text>
              </View>
              <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.infoLabel}>Status</Text>
                <Text style={[styles.infoValue, { color: Colors.green }]}>
                  Active after creation
                </Text>
              </View>
            </View>
          </ScrollView>

          <View style={{ paddingBottom: 8 }}>
            {isLoading ? (
              <ActivityIndicator color={Colors.green} style={{ paddingVertical: 20 }} />
            ) : (
              <Btn
                text="Create alert"
                action={handleCreate}
                disabled={!canCreate}
                fontSize={16}
              />
            )}
          </View>
        </KeyboardAvoidingView>
      </AppBackground>

      {/* Coin picker bottom sheet */}
      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={['48%']}
        enablePanDownToClose
        enableDynamicSizing={false}
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.sheetBg}
        handleIndicatorStyle={styles.sheetHandle}
      >
        <BottomSheetView style={styles.sheetContent}>
          <Text style={styles.sheetTitle}>Select asset</Text>
          <Text style={styles.sheetSubtitle}>
            Choose a coin to monitor for this alert.
          </Text>

          <View style={styles.coinList}>
            {SUPPORTED_ASSETS.map((asset) => {
              const isSelected = asset.symbol === selectedAsset.symbol;
              return (
                <Pressable
                  key={asset.symbol}
                  style={[styles.coinRow, isSelected && styles.coinRowActive]}
                  onPress={() => selectAsset(asset)}
                >
                  <View style={[styles.coinCircle, { backgroundColor: asset.color }]} />
                  <View style={styles.coinMeta}>
                    <Text style={styles.coinSymbol}>{asset.symbol}</Text>
                    <Text style={styles.coinName}>{asset.name}</Text>
                  </View>
                  <Text style={styles.coinPrice}>
                    ${asset.currentPrice.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Text>
                  <View style={[styles.radio, isSelected && styles.radioActive]}>
                    {isSelected && <Text style={styles.radioCheck}>✓</Text>}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  // ── Asset selector card ────────────────────────────────────────────────────
  assetCard: {
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  assetLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  assetCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  assetMeta: {
    gap: 3,
  },
  assetNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  assetSymbol: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 16,
  },
  chevron: {
    color: Colors.ash,
    fontSize: 12,
    lineHeight: 20,
  },
  assetFullName: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 13,
  },
  assetPrice: {
    color: Colors.text,
    fontFamily: Fonts.medium,
    fontSize: 15,
  },

  // ── Direction toggle ──────────────────────────────────────────────────────
  dirRow: {
    flexDirection: 'row',
    gap: 10,
  },
  dirPill: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 50,
    backgroundColor: Colors.secondaryBackgroundColor,
  },
  dirPillActive: {
    backgroundColor: Colors.lightGreen,
  },
  dirTxt: {
    color: Colors.ash,
    fontFamily: Fonts.medium,
    fontSize: 14,
  },
  dirTxtActive: {
    color: Colors.dark,
  },

  // ── Target price card ─────────────────────────────────────────────────────
  priceCard: {
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 18,
    gap: 6,
  },
  priceLabel: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 13,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceInput: {
    flex: 1,
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 36,
    padding: 0,
  },
  priceCurrency: {
    color: Colors.ash,
    fontFamily: Fonts.medium,
    fontSize: 14,
    marginLeft: 8,
    alignSelf: 'flex-end',
    paddingBottom: 4,
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

  // ── Bottom sheet ──────────────────────────────────────────────────────────
  sheetBg: {
    backgroundColor: Colors.secondaryBackgroundColor,
  },
  sheetHandle: {
    backgroundColor: Colors.ash,
  },
  sheetContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  sheetTitle: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 18,
  },
  sheetSubtitle: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  coinList: {
    gap: 10,
    marginTop: 20,
  },

  // ── Coin picker rows ──────────────────────────────────────────────────────
  coinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Colors.dark,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  coinRowActive: {
    borderColor: Colors.green,
    backgroundColor: Colors.lime,
  },
  coinCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  coinMeta: {
    flex: 1,
    gap: 2,
  },
  coinSymbol: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 14,
  },
  coinName: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 12,
  },
  coinPrice: {
    color: Colors.text,
    fontFamily: Fonts.medium,
    fontSize: 13,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: Colors.ash,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: Colors.green,
    backgroundColor: Colors.green,
  },
  radioCheck: {
    color: Colors.dark,
    fontSize: 12,
    fontFamily: Fonts.bold,
    lineHeight: 16,
  },
});
