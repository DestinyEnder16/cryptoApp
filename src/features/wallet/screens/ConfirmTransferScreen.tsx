import AppBackground from "@/src/shared/components/AppBackground";
import AppKeyboardScrollView from "@/src/shared/components/AppKeyboardScrollView";
import Btn from "@/src/shared/components/Btn";
import ScreenIntro from "@/src/shared/components/ScreenIntro";
import { Fonts } from "@/src/shared/constants/fonts";
import { Colors } from "@/src/shared/constants/styles";
import { showToast } from "@/src/shared/helpers/showToast";
import { useCreateTransferMutation } from "@/src/features/wallet/store/walletApi";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Row } from "./WithdrawalSubmittedScreen";

export default function ConfirmTransferScreen() {
  const params = useLocalSearchParams<{
    assetSymbol?: string;
    amount?: string;
    recipient?: string;
  }>();

  const assetSymbol = params.assetSymbol ?? "USDT";
  const amount = params.amount ?? "0";
  const recipient = params.recipient ?? "";
  const numericAmount = parseFloat(amount) || 0;

  const recipientDisplay =
    recipient.length > 20
      ? `${recipient.slice(0, 10)}…${recipient.slice(-6)}`
      : recipient;

  const [pin, setPin] = useState("");
  const [createTransfer, { isLoading }] = useCreateTransferMutation();

  const submit = async () => {
    try {
      const result = await createTransfer({
        assetSymbol,
        amount: numericAmount,
        recipient,
        pin,
      }).unwrap();

      router.navigate({
        pathname: "/wallet/send/result",
        params: {
          reference: result.transfer.reference,
          assetSymbol: result.transfer.assetSymbol,
          amount: String(result.transfer.amount),
          recipientName: result.transfer.recipient.fullName,
          recipientEmail: result.transfer.recipient.email,
        },
      });
    } catch (e) {
      console.error(e);
      showToast({
        type: "error",
        title: "Transfer failed",
        message:
          "Could not complete the transfer. Check your PIN and try again.",
      });
    }
  };

  return (
    <AppBackground>
      <ScreenIntro
        title="Confirm transfer"
        description="Review the details, then enter your PIN to send."
        hasBackBtn
      />

      <AppKeyboardScrollView
        contentContainerStyle={{ paddingTop: 20, gap: 16 }}
      >
        <View style={styles.summaryCard}>
          <Text style={styles.amountText}>
            {amount} {assetSymbol}
          </Text>
          <Row label="Asset" value={assetSymbol} />
          <Row label="Recipient" value={recipientDisplay} />
          <Row label="Fee" value="0.00" />
        </View>

        <View style={styles.pinCard}>
          <Text style={styles.pinLabel}>Transaction PIN</Text>
          <TextInput
            value={pin}
            onChangeText={(t) => setPin(t.replace(/[^0-9]/g, "").slice(0, 4))}
            keyboardType="number-pad"
            maxLength={4}
            secureTextEntry
            style={styles.pinInput}
            placeholder="••••"
            placeholderTextColor={Colors.textMuted}
          />
        </View>

        <View style={{ marginTop: 8 }}>
          <Btn
            text="Send now"
            fontSize={13}
            disabled={pin.length < 4 || isLoading}
            action={submit}
          />
        </View>
      </AppKeyboardScrollView>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    backgroundColor: "#141820",
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 28,
    gap: 20,
    marginVertical: 8,
  },
  amountText: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 34,
    textAlign: "center",
    marginBottom: 8,
  },
  pinCard: {
    backgroundColor: "#141820",
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  pinLabel: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 13,
  },
  pinInput: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 20,
    letterSpacing: 6,
    marginTop: 10,
  },
});
