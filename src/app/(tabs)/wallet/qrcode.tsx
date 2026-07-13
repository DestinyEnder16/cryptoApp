import ScanQrCode from '@/src/features/wallet/components/ScanQrCode';
import ScreenHeader from '@/src/features/wallet/components/ScreenHeader';
import ShowQrCode from '@/src/features/wallet/components/ShowQrCode';
import { Colors } from '@/src/shared/constants/styles';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Mode = 'show' | 'scan';

export default function QRcode() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  const [mode, setMode] = useState<Mode>('scan');

  const handleScanResult = (data: string, reset: () => void) => {
    Alert.alert('QR Code scanned', data, [{ text: 'OK', onPress: reset }]);
  };

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top + 10,
        backgroundColor: Colors.primaryBackgroundColor,
      }}
    >
      <View style={{ paddingBottom: 10 }}>
        <ScreenHeader variant="profile" />
      </View>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: tabBarHeight + insets.bottom + 16,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {mode === 'scan' ? (
          <ScanQrCode onPress={setMode} onResult={handleScanResult} />
        ) : (
          <ShowQrCode action={setMode} />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
});
