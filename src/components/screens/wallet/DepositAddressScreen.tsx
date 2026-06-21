import AppBackground from '@/src/components/AppBackground';
import ActionBtn from '@/src/components/ActionBtn';
import ScreenIntro from '@/src/components/ScreenIntro';
import WalletField from '@/src/components/wallet/WalletField';
import WalletNote from '@/src/components/wallet/WalletNote';
import { Colors } from '@/src/constants/styles';
import {
  DEPOSIT_ADDRESS,
  DEPOSIT_ADDRESS_SHORT,
  DEPOSIT_NETWORK,
} from '@/src/data/sandboxWallet';
import { showToast } from '@/src/helpers/showToast';
import * as Clipboard from 'expo-clipboard';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export default function DepositAddressScreen() {
  const { asset } = useLocalSearchParams<{ asset?: string }>();
  const symbol = asset ?? 'USDT';

  const copyAddress = async () => {
    await Clipboard.setStringAsync(DEPOSIT_ADDRESS);
    showToast({
      type: 'success',
      title: 'Address copied',
      message: 'The sandbox deposit address is on your clipboard.',
    });
  };

  return (
    <AppBackground>
      <ScreenIntro
        title={`${symbol} deposit`}
        description="Copy the demo address or scan the QR code."
        hasBackBtn
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 30, gap: 20 }}
      >
        <View style={styles.qrWrap}>
          <QRCode value={DEPOSIT_ADDRESS} size={150} />
        </View>

        <WalletField label="Network" value={DEPOSIT_NETWORK} />
        <WalletField label="Deposit address" value={DEPOSIT_ADDRESS_SHORT} />

        <View style={styles.btnRow}>
          <ActionBtn
            text="Copy address"
            styles={{ backgroundColor: Colors.green, txtColor: Colors.dark }}
            style={styles.btn}
            action={copyAddress}
          />
          <ActionBtn
            text="Simulate deposit"
            styles={{
              backgroundColor: Colors.secondaryBackgroundColor,
              txtColor: Colors.text,
            }}
            style={styles.btn}
            action={() =>
              router.navigate(`/wallet/deposit/simulate?asset=${symbol}`)
            }
          />
        </View>

        <WalletNote
          tone="warning"
          title="Important"
          message="Only use the sandbox simulator in class. This address is not real custody."
        />
      </ScrollView>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  qrWrap: {
    alignSelf: 'center',
    backgroundColor: Colors.text,
    padding: 24,
    borderRadius: 16,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  btn: {
    flex: 1,
  },
});
