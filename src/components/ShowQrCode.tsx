import * as Clipboard from "expo-clipboard";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { Fonts } from "../constants/fonts";
import { CameraIcon, ClipboardIcon } from "../constants/images";
import { Colors } from "../constants/styles";
import ActionBtn from "./ActionBtn";
import CurrencyHeader from "./CurrencyHeader";
import { useAppSelector } from "../store/hooks";

type Mode = "show" | "scan";

type ComponentProps = {
  action: React.Dispatch<React.SetStateAction<Mode>>;
};

export default function ShowQrCode({ action }: ComponentProps) {
  const user = useAppSelector((state) => state.auth.user);
  const address = user?.id;

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(address!);
  };

  return (
    <View style={styles.container}>
      <CurrencyHeader amount={40000} baseCurrency="usd" />

      <Text style={styles.heading}>My QR Code</Text>

      <View
        style={{
          backgroundColor: Colors.text,
          alignItems: "center",
          padding: 30,
          borderRadius: 12,
        }}
      >
        <QRCode value="https://www.google.com" size={250} />
      </View>

      <View style={{ width: "100%", paddingHorizontal: 20, gap: 20 }}>
        <View style={styles.addressBlock}>
          <Text style={styles.info}>ADDRESS</Text>

          <View style={styles.inputRow}>
            <TextInput
              style={styles.txtInput}
              value={address}
              editable={false}
            />

            <Pressable style={styles.copyBtn} onPress={copyToClipboard}>
              <ClipboardIcon />
            </Pressable>
          </View>
        </View>

        <Text style={styles.txt}>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
          dolore
        </Text>

        <ActionBtn
          text="Scan QR code"
          action={() => action("scan")}
          styles={{ backgroundColor: "transparent", txtColor: Colors.green }}
          icon={<CameraIcon />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  heading: {
    fontFamily: Fonts.bold,
    color: Colors.text,
    marginVertical: 20,
    fontSize: 18,
  },
  info: {
    color: Colors.grey,
    fontFamily: Fonts.regular,
    textAlign: "center",
    marginBottom: 10,
  },
  addressBlock: {
    marginTop: 25,
    width: "100%",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  txtInput: {
    flex: 1,
    backgroundColor: Colors.secondaryBackgroundColor,
    height: 33,
    color: Colors.grey,
    padding: 0,
    paddingHorizontal: 10,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  copyBtn: {
    backgroundColor: "white",
    height: 33,
    alignItems: "center",
    justifyContent: "center",
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    paddingHorizontal: 12,
  },
  txt: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    textAlign: "center",
    lineHeight: 24,
  },
});
