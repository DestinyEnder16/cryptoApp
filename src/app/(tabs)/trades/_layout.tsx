import ScreenHeader from "@/src/components/ScreenHeader";
import { Colors } from "@/src/constants/styles";
import { Stack } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TradesLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Stack
      screenOptions={{
        animation: "slide_from_right",
        header: () => (
          <View
            style={{
              paddingTop: insets.top + 10,
              backgroundColor: Colors.primaryBackgroundColor,
            }}
          >
            <ScreenHeader variant="market" />
          </View>
        ),
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="buy" />
      <Stack.Screen name="sell" />
    </Stack>
  );
}
