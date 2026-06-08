import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { showToast } from '@/src/helpers/showToast';
import {
  useEnableTwoFactorMutation,
  useSetupTwoFactorMutation,
} from '@/src/store/api/authApi';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import ScreenIntro from './ScreenIntro';

const QR_SIZE = 180;

function formatSecret(secret: string) {
  return secret.match(/.{1,4}/g)?.join(' ') ?? secret;
}

export default function AuthSetup() {
  const [setupTwoFactor, { data, isLoading, isError }] =
    useSetupTwoFactorMutation();
  const [enableTwoFactor, { isLoading: isEnabling }] =
    useEnableTwoFactorMutation({ fixedCacheKey: 'enable-2fa' });
  const [code, setCode] = useState('');

  useEffect(() => {
    setupTwoFactor();
  }, [setupTwoFactor]);

  const canEnable = code.length === 6 && !!data && !isEnabling;

  async function handleEnable() {
    try {
      await enableTwoFactor({ code }).unwrap();
      router.replace('/profile/security/codes');
    } catch (err) {
      const message =
        err && typeof err === 'object' && 'data' in err
          ? 'Invalid code. Try again.'
          : 'Failed to enable 2FA';
      showToast({ type: 'error', title: '2FA error', message });
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <ScreenIntro
        title="Set up 2FA"
        description="Scan the code, then enter your authenticator code."
      />

      <View style={styles.qrCard}>
        {isLoading || !data ? (
          <ActivityIndicator color={Colors.dark} />
        ) : isError ? (
          <Text style={styles.qrError}>Failed to load</Text>
        ) : (
          <QRCode
            value={data.otpauthUri}
            size={QR_SIZE - 32}
            backgroundColor="white"
            color={Colors.dark}
          />
        )}
      </View>

      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Secret</Text>
        <Text style={styles.fieldValue}>
          {data ? formatSecret(data.secret) : '—'}
        </Text>
      </View>

      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Authenticator code</Text>
        <TextInput
          style={styles.fieldInput}
          value={code}
          onChangeText={(t) => setCode(t.replace(/\D/g, '').slice(0, 6))}
          placeholder="123456"
          placeholderTextColor={Colors.grey}
          keyboardType="number-pad"
          maxLength={6}
        />
      </View>

      <View style={{ flex: 1 }} />

      <Pressable
        style={[styles.enableBtn, !canEnable && { opacity: 0.5 }]}
        disabled={!canEnable}
        onPress={handleEnable}
      >
        <Text style={styles.enableBtnText}>
          {isEnabling ? 'Enabling…' : 'Enable 2FA'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  qrCard: {
    alignSelf: 'center',
    backgroundColor: 'white',
    width: QR_SIZE,
    height: QR_SIZE,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  qrError: {
    color: Colors.red,
    fontFamily: Fonts.regular,
  },
  field: {
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginBottom: 14,
  },
  fieldLabel: {
    color: Colors.grey,
    fontFamily: Fonts.regular,
    fontSize: 12,
    marginBottom: 4,
  },
  fieldValue: {
    color: Colors.text,
    fontFamily: Fonts.medium,
    fontSize: 16,
    letterSpacing: 1,
  },
  fieldInput: {
    color: Colors.text,
    fontFamily: Fonts.medium,
    fontSize: 16,
    padding: 0,
    letterSpacing: 1,
  },
  enableBtn: {
    backgroundColor: Colors.green,
    borderRadius: 14,
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 30,
  },
  enableBtnText: {
    color: Colors.dark,
    fontFamily: Fonts.medium,
    fontSize: 15,
  },
});
