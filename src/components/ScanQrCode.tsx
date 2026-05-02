import { Fonts } from '@/src/constants/fonts';
import { CameraIcon, QrcodeIcon } from '@/src/constants/images';
import { Colors } from '@/src/constants/styles';
import { StyleSheet, Text, View } from 'react-native';
import ActionBtn from './ActionBtn';

type ComponentProps = {
  onPress: React.Dispatch<React.SetStateAction<any>>;
};

export default function ScanQrCode({ onPress }: ComponentProps) {
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

      <View style={{ height: 430 }}></View>

      <View style={{ gap: 15, paddingHorizontal: 20 }}>
        <ActionBtn
          text="Show QR Code"
          icon={<QrcodeIcon />}
          styles={{ backgroundColor: Colors.green, txtColor: Colors.dark }}
          action={() => onPress('show')}
        />
        <ActionBtn
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
  desc: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    width: 270,
    textAlign: 'center',
    lineHeight: 20,
  },
});
