import AppBackground from "@/src/components/AppBackground";
import Btn from "@/src/components/Btn";
import ScreenIntro from "@/src/components/ScreenIntro";
import { Fonts } from "@/src/constants/fonts";
import { Colors } from "@/src/constants/styles";
import { assetUrl } from "@/src/helpers/assetUrl";
import { getApiErrorMessage } from "@/src/helpers/getApiErrorMessage";
import { showToast } from "@/src/helpers/showToast";
import { useCreatePriceAlertMutation } from "@/src/store/api/alertsApi";
import { useFetchAssetDetailsQuery } from "@/src/store/api/marketApi";
import type { PriceAlertDirection } from "@/src/types/alerts/types";
import { useIsFocused } from "@react-navigation/native";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
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
} from "react-native";

const DIRECTIONS: PriceAlertDirection[] = ["above", "below"];

function formatUsd(value: number): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function CreateAlertScreen() {
  const { symbol } = useLocalSearchParams<{ symbol?: string }>();
  const isFocused = useIsFocused();

  // The coin to alert on is chosen upstream (coin detail screen) and passed in
  // via the route param — fetch its live details for display and polled price.
  const { data: asset } = useFetchAssetDetailsQuery(symbol ?? "", {
    skip: !symbol,
    pollingInterval: isFocused ? 20000 : 0,
    skipPollingIfUnfocused: true,
  });

  const [direction, setDirection] = useState<PriceAlertDirection>("above");
  const [targetPrice, setTargetPrice] = useState("");

  const [createAlert, { isLoading }] = useCreatePriceAlertMutation();

  const parsedTarget = parseFloat(targetPrice.replace(/,/g, ""));
  const canCreate = !!symbol && !isNaN(parsedTarget) && parsedTarget > 0;

  const formattedTarget = canCreate
    ? parsedTarget.toLocaleString("en-US", { maximumFractionDigits: 2 })
    : "--";

  const triggerText = canCreate
    ? `${symbol} ${direction} $${formattedTarget}`
    : "--";

  async function handleCreate() {
    if (!canCreate || !symbol) return;
    try {
      await createAlert({
        assetSymbol: symbol,
        direction,
        targetPriceUsd: parsedTarget,
      }).unwrap();
      router.replace({
        pathname: "/profile/alertCreated",
        params: {
          symbol,
          direction,
          targetPrice: String(parsedTarget),
        },
      });
    } catch (err) {
      showToast({
        type: "error",
        title: "Failed to create alert",
        message: getApiErrorMessage(err, "Something went wrong. Try again."),
      });
    }
  }

  return (
    <View style={styles.root}>
      <AppBackground>
        <ScreenIntro
          title="Create price alert"
          description={
            symbol
              ? `Get notified when ${symbol} crosses your target.`
              : "Get notified when your coin crosses your target."
          }
          hasBackBtn
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              paddingTop: 24,
              paddingBottom: 32,
              gap: 16,
            }}
          >
            {/* Asset — fixed to the coin passed from the coin detail screen */}
            <View style={styles.assetCard}>
              {asset ? (
                <>
                  <View style={styles.assetLeft}>
                    <Image
                      cachePolicy="memory-disk"
                      source={{ uri: assetUrl(asset.iconUrl) }}
                      style={styles.assetCircle}
                    />
                    <View style={styles.assetMeta}>
                      <Text style={styles.assetSymbol}>{asset.symbol}</Text>
                      <Text style={styles.assetFullName}>{asset.name}</Text>
                    </View>
                  </View>
                  <Text style={styles.assetPrice}>
                    ${formatUsd(asset.priceUsd)}
                  </Text>
                </>
              ) : (
                <ActivityIndicator color={Colors.green} />
              )}
            </View>

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
                    <Text
                      style={[styles.dirTxt, active && styles.dirTxtActive]}
                    >
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
              <ActivityIndicator
                color={Colors.green}
                style={{ paddingVertical: 20 }}
              />
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
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  // ── Asset card ─────────────────────────────────────────────────────────────
  assetCard: {
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  assetLeft: {
    flexDirection: "row",
    alignItems: "center",
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
  assetSymbol: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 16,
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
    flexDirection: "row",
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    alignSelf: "flex-end",
    paddingBottom: 4,
  },

  // ── Info rows ─────────────────────────────────────────────────────────────
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    textAlign: "right",
    marginLeft: 12,
  },
});
