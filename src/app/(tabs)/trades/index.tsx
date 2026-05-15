import ActionBtn from "@/src/components/ActionBtn";
import { Colors } from "@/src/constants/styles";
import { router } from "expo-router";
import { Text, View } from "react-native";

export default function Trades() {
  return (
    <View>
      <Text>hey world</Text>

      <View style={{ flexDirection: "row", flex: 1 }}>
        <ActionBtn
          text="Buy"
          styles={{
            backgroundColor: Colors.red,
            txtColor: Colors.text,
          }}
          style={{ flex: 1, borderRadius: 0 }}
          action={() => router.navigate("/trades/buy")}
        />
        <ActionBtn
          text="Sell"
          styles={{ backgroundColor: Colors.green, txtColor: Colors.dark }}
          style={{ flex: 1, borderRadius: 0 }}
          action={() => router.navigate("/trades/sell")}
        />
      </View>
    </View>
  );
}
