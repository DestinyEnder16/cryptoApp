import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { authenticateWithBiometrics } from '@/src/services/biometricAuth';
import { useAppSelector } from '@/src/store/hooks';
import { selectUser } from '@/src/store/slices/authSlice';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface BtnProps {
  text: string;
  bgColor: string;
  txtColor: string;
  onClick: () => void;
}

function Btn({ text, bgColor, txtColor }: BtnProps) {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: bgColor,
        borderRadius: 14,
        alignItems: 'center',
        paddingVertical: 20,
      }}
    >
      <Text style={{ color: txtColor, fontFamily: Fonts.medium }}>{text}</Text>
    </TouchableOpacity>
  );
}

export default function Welcome() {
  const user = useAppSelector(selectUser);
  const insets = useSafeAreaInsets();
  if (!user) return null;

  return (
    <View style={{ paddingTop: insets.top + 50, paddingHorizontal: 20 }}>
      <Text style={styles.header}>Welcome Back</Text>

      <View style={{ alignItems: 'center', gap: 20 }}>
        <View style={styles.profile}>
          <Text style={styles.profileInitial}>
            {user.fullName.split('')[0]}
          </Text>
        </View>
        <Text style={styles.name}>{user.fullName}</Text>
        <Text style={styles.desc}>
          Use password or Face ID approved on this device.
        </Text>
      </View>

      <View style={{ marginTop: 50 }}>
        <View style={styles.passwordField}>
          <Text style={styles.passwordLabel}>Password</Text>
          <TextInput
            style={styles.passwordInput}
            secureTextEntry
            placeholderTextColor={Colors.grey}
          />
        </View>

        <View style={{ gap: 15 }}>
          <Btn
            text="Sign Up"
            bgColor={Colors.green}
            txtColor={Colors.dark}
            onClick={() => console.log('hey')}
          />
          <Btn
            text="Use Face ID"
            bgColor={Colors.secondaryBackgroundColor}
            txtColor={Colors.text}
            onClick={() => {
              const res = authenticateWithBiometrics();
              console.log(res);
            }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 28,
    fontFamily: Fonts.bold,
    color: Colors.text,
  },
  profile: {
    backgroundColor: Colors.green,
    width: 122,
    height: 122,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    marginTop: 30,
  },
  profileInitial: {
    fontFamily: Fonts.bold,
    fontSize: 42,
  },
  name: {
    fontFamily: Fonts.bold,
    fontSize: 20,
    color: Colors.text,
  },
  desc: {
    color: Colors.grey,
    fontFamily: Fonts.regular,
  },
  passwordField: {
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 70,
    marginBottom: 40,
  },
  passwordLabel: {
    color: Colors.grey,
    fontFamily: Fonts.regular,
    fontSize: 14,
    marginBottom: 4,
  },
  passwordInput: {
    color: Colors.text,
    fontFamily: Fonts.medium,
    fontSize: 16,
    padding: 0,
  },
});
