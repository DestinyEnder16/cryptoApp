import ActionBtn from '@/src/components/ActionBtn';
import AppBackground from '@/src/components/AppBackground';
import ScreenIntro from '@/src/components/ScreenIntro';
import WalletField from '@/src/components/wallet/WalletField';
import WalletNote from '@/src/components/wallet/WalletNote';
import { Colors } from '@/src/constants/styles';
import { showToast } from '@/src/helpers/showToast';
import { useGetDepositAddressQuery } from '@/src/store/api/walletApi';
import * as Clipboard from 'expo-clipboard';
import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

/** Middle-truncate a long address for compact display. */
const shorten = (value: string) =>
  value.length > 16 ? `${value.slice(0, 8)}…${value.slice(-4)}` : value;

export default function DepositAddressScreen() {
  const { asset } = useLocalSearchParams<{ asset?: string }>();
  const symbol = asset ?? 'USDT';
  const { data: deposit, isLoading } = useGetDepositAddressQuery(symbol);

  const copyAddress = async () => {
    if (!deposit) return;
    await Clipboard.setStringAsync(deposit.address);
    showToast({
      type: 'success',
      title: 'Address copied',
      message: 'The deposit address is on your clipboard.',
    });
  };

  return (
    <AppBackground>
      <ScreenIntro
        title={`${symbol} deposit`}
        description="Copy the address or scan the QR code."
        hasBackBtn
      />

      {isLoading || !deposit ? (
        <ActivityIndicator
          color={Colors.green}
          style={{ marginTop: 60 }}
          size="large"
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 20, paddingBottom: 30, gap: 20 }}
        >
          <View style={styles.qrWrap}>
            <QRCode value={deposit.qrPayload} size={150} />
          </View>

          <WalletField label="Network" value={deposit.network} />
          <WalletField label="Deposit address" value={shorten(deposit.address)} />

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
      )}
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
