import ScanQrCode from '@/src/components/ScanQrCode';
import ScreenHeader from '@/src/components/ScreenHeader';
import ShowQrCode from '@/src/components/ShowQrCode';
import { Colors } from '@/src/constants/styles';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Mode = 'show' | 'scan';

export default function Wallets() {
  const insets = useSafeAreaInsets();

  const [mode, setMode] = useState<Mode>('scan');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScreenHeader variant="market" />

      {mode === 'scan' ? <ScanQrCode onPress={setMode} /> : <ShowQrCode />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBackgroundColor,
  },
});
