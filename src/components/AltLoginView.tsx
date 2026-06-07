import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Fonts } from '../constants/fonts';
import { FaceBookIcon, Fingerprint, GoogleIcon } from '../constants/images';
import { Colors } from '../constants/styles';
import { showToast } from '../helpers/showToast';
import { completeAuth } from '../services/auth';
import { authenticateWithBiometrics } from '../services/biometricAuth';
import { getCredentials } from '../services/nativeKeychain';
import { useAppDispatch } from '../store/hooks';
import { setToken } from '../store/slices/authSlice';
import ActionBtn from './ActionBtn';

interface ViewProps {
  showFingerPrintOption?: boolean;
}

function AltLoginView({ showFingerPrintOption = true }: ViewProps) {
  const dispatch = useAppDispatch();

  async function handleBiometricAuth() {
    const ok = await authenticateWithBiometrics();
    if (!ok) return;

    try {
      const credentials = await getCredentials();
      if (!credentials) {
        throw new Error('No saved credentials found. Please sign in again.');
      }

      dispatch(setToken(credentials.password));

      const target = await completeAuth(dispatch, credentials.password);
      if (target) router.replace(target);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      showToast({
        title: 'Login error',
        type: 'error',
        message,
      });
    }
  }

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
          <Pressable onPress={() => handleBiometricAuth()} hitSlop={20}>
            <Fingerprint />
          </Pressable>
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
