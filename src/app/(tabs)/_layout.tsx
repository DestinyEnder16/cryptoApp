import {
  ActivityIcon,
  HomeIcon,
  MarketIcon,
  TradeIcon,
  WalletIcon,
} from "@/src/constants/images";
import { Colors } from "@/src/constants/styles";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  return (
    <>
      <Tabs
        backBehavior="history"
        screenOptions={{
          tabBarActiveTintColor: Colors.green,
          tabBarLabelStyle: {
            color: Colors.textMuted,
          },
          tabBarInactiveTintColor: Colors.ash,
          headerShown: false,
          animation: "none",
          tabBarStyle: {
            position: "absolute",
            bottom: insets.bottom + 10,
            height: 76,
            backgroundColor: Colors.primaryBackgroundColor,
            borderRadius: 32,
            borderTopWidth: 0,
            marginHorizontal: 10,
            paddingTop: 0,
            paddingBottom: 0,

            // IMPORTANT: Bottom tab has a default Android elevation
            elevation: 0,
            shadowOpacity: 0,
          },
          tabBarItemStyle: {
            flex: 1,
            paddingTop: 14,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => <HomeIcon color={color} />,
          }}
        />
        <Tabs.Screen
          name="markets"
          options={{
            title: "Markets",
            tabBarIcon: ({ color }) => <MarketIcon color={color} />,
          }}
        />
        <Tabs.Screen
          name="trades"
          options={{
            title: "Trades",
            tabBarIcon: ({ color }) => <TradeIcon color={color} />,
          }}
        />
        <Tabs.Screen
          name="activity"
          options={{
            title: "Activity",
            tabBarIcon: ({ color }) => <ActivityIcon color={color} />,
          }}
        />
        <Tabs.Screen
          name="wallet"
          options={{
            title: "Wallets",
            tabBarIcon: ({ color }) => <WalletIcon color={color} />,
          }}
        />
      </Tabs>
    </>
  );
}
