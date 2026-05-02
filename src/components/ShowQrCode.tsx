import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Fonts } from '../constants/fonts';
import { ClipboardIcon } from '../constants/images';
import { Colors } from '../constants/styles';
import CurrencyHeader from './CurrencyHeader';

export default function ShowQrCode() {
  return (
    <View style={styles.container}>
      <CurrencyHeader amount={400000} baseCurrency="usd" />

      <Text style={styles.heading}>My QR Code</Text>

      <View
        style={{
          backgroundColor: Colors.text,
          alignItems: 'center',
          padding: 30,
          borderRadius: 12,
        }}
      >
        <QRCode value="https://www.google.com" size={250} />
      </View>

      <View style={{ flex: 1, width: '100%', paddingHorizontal: 20 }}>
        <View style={styles.addressBlock}>
          <Text style={styles.info}>ADDRESS</Text>

          <View style={styles.inputRow}>
            <TextInput
              style={styles.txtInput}
              value="n2e5dirgMNYdQskfiP5zj39VYemXareK4C"
              editable={false}
            />

            <Pressable style={styles.copyBtn}>
              <ClipboardIcon />
            </Pressable>
          </View>
        </View>

        <Text style={styles.txt}>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
          dolore
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
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
    textAlign: 'center',
    marginBottom: 10,
  },
  addressBlock: {
    marginTop: 25,
    width: '100%',
    marginBottom: 30,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
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
    backgroundColor: 'white',
    height: 33,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    paddingHorizontal: 12,
  },
  txt: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    textAlign: 'center',
  },
});
