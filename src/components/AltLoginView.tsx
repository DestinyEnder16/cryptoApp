import { StyleSheet, Text, View } from 'react-native';
import { Fonts } from '../constants/fonts';
import { FaceBookIcon, Fingerprint, GoogleIcon } from '../constants/images';
import { Colors } from '../constants/styles';
import ActionBtn from './ActionBtn';

interface ViewProps {
  showFingerPrintOption?: boolean;
}

function AltLoginView({ showFingerPrintOption = true }: ViewProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Or login with</Text>

      <View style={styles.btnsContainer}>
        <ActionBtn
          styles={{ backgroundColor: Colors.text, txtColor: Colors.dark }}
          text="Facebook"
          icon={<FaceBookIcon />}
          style={{ flex: 1 }}
        />
        <ActionBtn
          styles={{ backgroundColor: Colors.text, txtColor: Colors.dark }}
          text="Google"
          icon={<GoogleIcon />}
          style={{ flex: 1 }}
        />
      </View>

      {showFingerPrintOption && (
        <View
          style={{
            alignSelf: 'center',
            alignItems: 'center',
            gap: 10,
            marginTop: 50,
          }}
        >
          <Fingerprint />
          <Text style={styles.txt}>Use fingerprint instead?</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  header: {
    color: Colors.ash,
    textAlign: 'center',
  },
  btnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    marginTop: 20,
  },
  txt: {
    fontFamily: Fonts.regular,
    color: Colors.grey,
  },
});

export default AltLoginView;
