import { ImageBackground } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAppSelector } from "../store/hooks";
import { currencyConverter } from "../services/currencyConverter";
import { EyeSlash } from "../constants/images";
import { Colors } from "../constants/styles";
import { Fonts } from "../constants/fonts";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import ActionBtn from "./ActionBtn";

export default function WalletHeader() {
  const user = useAppSelector((state) => state.auth.user);
  const currency = user?.settings.fiatCurrency;
  const amount = 40059.83;
  const insets = useSafeAreaInsets();

  const [visible, setVisible] = useState(true);

  return (
    <ImageBackground
      source={require("@/assets/images/background.png")}
      style={{
        paddingTop: insets.top + 10,
        paddingHorizontal: 15,
        paddingBottom: 10,
        gap: 50,
      }}
    >
      <View style={styles.row}>
        <View>
          <Text style={styles.balance}>Current Balance</Text>

          <Text style={styles.amount}>{visible ? amount : "****"}</Text>

          <Text style={styles.convertedAmount}>
            {visible
              ? `$${currencyConverter(amount, "btc", currency!)}`
              : "****"}
          </Text>
        </View>

        <View>
          <Pressable onPress={() => setVisible((prev) => !prev)} hitSlop={20}>
            {visible ? (
              <Ionicons name="eye" size={24} color={Colors.grey} />
            ) : (
              <EyeSlash />
            )}
          </Pressable>
        </View>
      </View>

      <View style={[styles.row, { gap: 5 }]}>
        <ActionBtn
          text="Deposit"
          styles={{
            backgroundColor: Colors.green,
            txtColor: Colors.dark,
          }}
          style={{ flex: 1 }}
        />
        <ActionBtn
          text="Withdraw"
          styles={{
            backgroundColor: Colors.secondaryBackgroundColor,
            txtColor: Colors.grey,
          }}
          style={{ flex: 1 }}
        />
        <ActionBtn
          text="Transfer"
          styles={{
            backgroundColor: Colors.secondaryBackgroundColor,
            txtColor: Colors.grey,
          }}
          style={{ flex: 1 }}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  balance: {
    color: Colors.ash,
    marginBottom: 20,
  },
  amount: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 32,
  },
  convertedAmount: {
    color: Colors.grey,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
