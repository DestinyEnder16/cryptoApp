import { Fonts } from '@/src/constants/fonts';
import { AwaitingCamera, CameraIcon, QrcodeIcon } from '@/src/constants/images';
import { Colors } from '@/src/constants/styles';
import {
  BarcodeScanningResult,
  CameraType,
  CameraView,
  useCameraPermissions,
} from 'expo-camera';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import ActionBtn from './ActionBtn';

type Mode = 'show' | 'scan';

type ComponentProps = {
  onPress: React.Dispatch<React.SetStateAction<Mode>>;
  onResult?: (data: string, reset: () => void) => void;
};

export default function ScanQrCode({ onPress, onResult }: ComponentProps) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const lockRef = useRef(false);

  const reset = () => {
    lockRef.current = false;
    setScanned(false);
  };

  const onBarcodeScanned = ({ data }: BarcodeScanningResult) => {
    if (lockRef.current) return;
    lockRef.current = true;
    setScanned(true);
    onResult?.(data, reset);
  };

  const onRequestCamera = async () => {
    if (permission?.canAskAgain === false) {
      await Linking.openSettings();
      return;
    }
    await requestPermission();
  };

  return (
    <>
      <View
        style={{
          alignItems: 'center',
          marginTop: 30,
          gap: 10,
          paddingHorizontal: 20,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <CameraIcon />

          <Text style={styles.header}>Scan QR Code</Text>
        </View>

        <Text style={styles.desc}>
          Scan the QR code and it automatically recognize it.
        </Text>
      </View>

      <View style={styles.cameraView}>
        {!permission?.granted ? (
          <Pressable onPress={onRequestCamera}>
            <AwaitingCamera />
            <Text style={styles.tapHint}>
              {permission?.canAskAgain === false
                ? 'Camera access denied. Tap to open settings.'
                : 'Tap to enable camera'}
            </Text>
          </Pressable>
        ) : (
          <CameraView
            facing={facing}
            style={styles.camera}
            onBarcodeScanned={scanned ? undefined : onBarcodeScanned}
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          />
        )}
      </View>

      <View style={{ gap: 15, paddingHorizontal: 20, marginTop: 20 }}>
        <ActionBtn
          text="Show QR Code"
          icon={<QrcodeIcon />}
          styles={{ backgroundColor: Colors.green, txtColor: Colors.dark }}
          action={() => onPress('show')}
        />
        <ActionBtn
          action={() => router.navigate('/(tabs)')}
          text="Cancel"
          styles={{ backgroundColor: Colors.ash, txtColor: Colors.text }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 18,
    color: Colors.text,
  },
  cameraView: {
    alignItems: 'center',
    marginVertical: 30,
    height: 430,
    paddingHorizontal: 20,
  },
  desc: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    width: 270,
    textAlign: 'center',
    lineHeight: 20,
  },
  tapHint: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    textAlign: 'center',
    marginVertical: 15,
  },
  camera: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
});
