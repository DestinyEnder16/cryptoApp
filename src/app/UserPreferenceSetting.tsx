import { StyleSheet, Text, View } from "react-native";

import { router } from "expo-router";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ActionBtn from "../components/ActionBtn";
import { Colors } from "../constants/styles";
import { useEditSettingsMutation } from "../store/api/Api";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setSettings } from "../store/slices/authSlice";

export default function UserPreferenceSettingView() {
  const insets = useSafeAreaInsets();
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const userBiometricEnabled = user?.settings.biometricEnabled;

  const [isBiometricEnabled, setIsBiometricEnabled] = useState(
    Boolean(userBiometricEnabled),
  );

  const [editSettings, { isLoading }] = useEditSettingsMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleEditSetting() {
    if (!user?.settings) return;
    setErrorMessage(null);
    try {
      const updated = await editSettings({
        ...user.settings,
        biometricEnabled: isBiometricEnabled,
      }).unwrap();
      dispatch(setSettings(updated));
      if (router.canGoBack()) router.back();
    } catch {
      setErrorMessage("Couldn't save your changes. Please try again.");
    }
  }
  return (
    <View
      style={{ paddingTop: insets.top + 10, paddingLeft: insets.left + 10 }}
    >
      <Text style={styles.txt}>
        {userBiometricEnabled ? "Disable Biometrics" : "Enable Biometric"}
      </Text>

      <View style={{ flexDirection: "row", gap: 10 }}>
        <ActionBtn
          text="Yes"
          styles={{ backgroundColor: Colors.green, txtColor: Colors.text }}
          style={{ marginBottom: 30, flex: 1 }}
          action={() => setIsBiometricEnabled((prev) => !prev)}
        />
        <ActionBtn
          text="No"
          styles={{ backgroundColor: Colors.red, txtColor: Colors.text }}
          style={{ marginBottom: 30, flex: 1 }}
          action={() => {
            setIsBiometricEnabled((prev) => prev);
            router.canGoBack() && router.back();
          }}
        />
      </View>

      <ActionBtn
        text={isLoading ? "Editing" : "Save Changes"}
        styles={{ backgroundColor: Colors.ash, txtColor: Colors.text }}
        action={() => handleEditSetting()}
      />

      {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  txt: {
    color: Colors.text,
    marginBottom: 20,
  },
  error: {
    color: Colors.red ?? "#ff5a5a",
    marginTop: 16,
  },
});
