import { StyleSheet, Text, View } from "react-native";
import BackHeader from "../components/BackHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ForwardBtn,
  SettingsAbout,
  SettingsAppearance,
  SettingsCurrency,
  SettingsLanguage,
  SettingsPreference,
} from "../constants/images";
import { Colors } from "../constants/styles";
import { Fonts } from "../constants/fonts";
import { SvgProps } from "react-native-svg";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import ActionBtn from "../components/ActionBtn";
import { logout, setToken } from "../store/slices/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

type SettingsConfig = {
  icon: React.FC<SvgProps>;
  info: string;
  type: string;
};

export default function Settings() {
  const insets = useSafeAreaInsets();
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  console.log(user?.settings);
  const settings: SettingsConfig[] = [
    {
      icon: SettingsLanguage,
      info: "English",
      type: "Langugage",
    },
    {
      icon: SettingsCurrency,
      info: user?.settings.fiatCurrency!,
      type: "Currency",
    },
    {
      icon: SettingsAppearance,
      info: user?.settings.theme!,
      type: "Appearance",
    },
    {
      icon: SettingsPreference,
      info: "Customize",
      type: "Preference",
    },
    {
      icon: SettingsAbout,
      info: "v1.2.3",
      type: "About Us",
    },
  ];

  async function handleLogout() {
    await AsyncStorage.removeItem("token");
    dispatch(logout());
  }
  return (
    <View style={[{ paddingTop: insets.top + 10, paddingHorizontal: 10 }]}>
      <View style={{ paddingLeft: 20 }}>
        <BackHeader txt="Settings" marginBottom={50} />
      </View>

      <View style={{ paddingHorizontal: 20, gap: 30 }}>
        {settings.map((el, index) => {
          const Icon = el.icon;
          return (
            <View
              key={index}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottomWidth: 0.2,
                paddingBottom: 30,
                borderBottomColor: Colors.textMuted,
              }}
            >
              <View style={[styles.row, { gap: 30 }]}>
                <View
                  style={{
                    backgroundColor: Colors.secondaryBackgroundColor,
                    padding: 15,
                    height: 28,
                    width: 31,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 100,
                  }}
                >
                  <Icon />
                </View>
                <Text
                  style={{ fontFamily: Fonts.regular, color: Colors.textMuted }}
                >
                  {el.type}
                </Text>
              </View>

              <View style={[styles.row, { gap: 10 }]}>
                <Text style={styles.txt}>{el.info}</Text>
                <ForwardBtn />
              </View>
            </View>
          );
        })}

        <ActionBtn
          text="Logout"
          styles={{ backgroundColor: Colors.red, txtColor: Colors.text }}
          action={handleLogout}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  txt: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
  },
});
