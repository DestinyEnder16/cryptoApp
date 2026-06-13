import AppBackground from '@/src/components/AppBackground';
import ProfileStripItem from '@/src/components/ProfileStripItem';
import ScreenIntro from '@/src/components/ScreenIntro';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { showToast } from '@/src/helpers/showToast';
import { signOut } from '@/src/services/auth';
import {
  authenticateWithBiometrics,
  isBiometricAvailable,
} from '@/src/services/biometricAuth';
import { useLogoutMutation } from '@/src/store/api/authApi';
import { useFetchMeQuery } from '@/src/store/api/profileApi';
import {
  useEditSettingsMutation,
  useFetchMySettingsQuery,
} from '@/src/store/api/settingsApi';
import { useAppDispatch } from '@/src/store/hooks';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function Index() {
  const dispatch = useAppDispatch();

  const { data: user } = useFetchMeQuery();
  const { data: settings } = useFetchMySettingsQuery();
  const [editSettings, { isLoading: isUpdatingSettings }] =
    useEditSettingsMutation();
  const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();

  const biometricEnabled = user?.settings.biometricEnabled ?? false;
  const twoFactorAuthEnabled = user?.twoFactorEnabled;

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  async function handleBiometricToggle() {
    if (!settings || isUpdatingSettings) return;
    const next = !biometricEnabled;

    // Enabling: confirm the device actually has biometrics enrolled, then
    // require a successful biometric prompt before flipping the flag — so a
    // bystander holding an unlocked phone can't quietly enable it.
    if (next) {
      const available = await isBiometricAvailable();
      if (!available) {
        showToast({
          type: 'error',
          title: 'Biometrics not set up',
          message: 'Enable biometrics in your device settings first.',
        });
        return;
      }
      const passed = await authenticateWithBiometrics();
      if (!passed) return;
    }

    try {
      await editSettings({ ...settings, biometricEnabled: next }).unwrap();
      showToast({
        type: 'success',
        title: next ? 'Biometric login enabled' : 'Biometric login disabled',
        message: next
          ? "We'll use Face ID or fingerprint to sign you in."
          : "We won't ask for biometrics at sign-in.",
      });
    } catch {
      showToast({
        type: 'error',
        title: 'Could not update',
        message: 'Please try again.',
      });
    }
  }

  async function handleLogout() {
    try {
      await logoutMutation().unwrap();
    } catch (err) {
      // Server-side logout failed (network, already-expired token, etc).
      // Local cleanup still has to happen — otherwise the user is stuck.
      console.warn('Server logout failed; clearing local session anyway', err);
    }
    await signOut(dispatch);
    setShowLogoutModal(false);
    router.replace('/(auth)/auth');
  }

  return (
    <AppBackground>
      <View style={{ paddingHorizontal: 20, flex: 1 }}>
        <ScreenIntro
          title="Security"
          description="Protect account access and sensitive actions."
        />

        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 50 }}
        >
          <ProfileStripItem
            title="Transaction PIN"
            subtitle="Required for trades and withdrawals"
            badge="Set"
            onPress={() =>
              router.navigate({
                pathname: '/(tabs)/profile/security/pin',
              })
            }
          />
          <ProfileStripItem
            danger={!twoFactorAuthEnabled}
            title="Authenticator app"
            subtitle={
              twoFactorAuthEnabled ? 'Enabled for login protection' : 'Disabled'
            }
            badge={twoFactorAuthEnabled ? 'On' : 'Off'}
            onPress={() => {
              router.navigate({
                pathname: '/profile/security/auth',
              });
            }}
          />
          <ProfileStripItem
            title="Recovery codes"
            danger={!twoFactorAuthEnabled}
            subtitle={
              twoFactorAuthEnabled
                ? '8 backup codes remaining'
                : 'Set up the authenticator app to use recovery codes'
            }
            badge={twoFactorAuthEnabled ? 'View' : 'Locked'}
            onPress={() => {
              if (!twoFactorAuthEnabled) {
                showToast({
                  type: 'info',
                  title: 'Authenticator required',
                  message: 'You need to first set up your authenticator app',
                });
                return;
              }
              router.navigate({
                pathname: '/(tabs)/profile/security/codes',
              });
            }}
          />
          <ProfileStripItem
            title="Registered devices"
            subtitle="iPhone 15 Pro · push enabled"
            badge={2}
            onPress={() => router.navigate('/(tabs)/profile/security/devices')}
          />
          <ProfileStripItem
            danger={!biometricEnabled}
            title="Biometric login"
            subtitle={
              biometricEnabled
                ? 'Tap to disable Face ID / fingerprint sign-in'
                : 'Tap to enable Face ID / fingerprint sign-in'
            }
            badge={isUpdatingSettings ? '...' : biometricEnabled ? 'On' : 'Off'}
            onPress={handleBiometricToggle}
          />

          <View style={styles.warning}>
            <Text style={styles.warningTitle}>
              Admin will never ask for codes
            </Text>
            <Text style={styles.warningBody}>
              Keep recovery codes private and regenerate them if exposed.
            </Text>
          </View>

          <Pressable
            style={styles.logoutBtn}
            onPress={() => setShowLogoutModal(true)}
            disabled={isLoggingOut}
          >
            <Text style={styles.logoutBtnText}>Sign out</Text>
          </Pressable>
        </ScrollView>
      </View>

      <LogoutConfirmModal
        visible={showLogoutModal}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        isLoading={isLoggingOut}
      />
    </AppBackground>
  );
}

interface LogoutConfirmModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

function LogoutConfirmModal({
  visible,
  onCancel,
  onConfirm,
  isLoading,
}: LogoutConfirmModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={isLoading ? undefined : onCancel}
    >
      <View style={styles.backdrop}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={isLoading ? undefined : onCancel}
        />
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Sign out?</Text>
          <Text style={styles.modalDesc}>
            You&apos;ll need to sign in again to access your account.
          </Text>

          <View style={styles.modalActions}>
            <Pressable
              style={styles.cancelBtn}
              onPress={onCancel}
              disabled={isLoading}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.confirmBtn, isLoading && { opacity: 0.6 }]}
              onPress={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.text} />
              ) : (
                <Text style={styles.confirmBtnText}>Sign out</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  warning: {
    backgroundColor: Colors.brown,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginTop: 10,
    gap: 8,
  },
  warningTitle: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 14,
  },
  warningBody: {
    color: Colors.orangeBrown,
    fontFamily: Fonts.regular,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'left',
  },
  logoutBtn: {
    marginTop: 30,
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 14,
    paddingVertical: 20,
    alignItems: 'center',
  },
  logoutBtnText: {
    color: Colors.red,
    fontFamily: Fonts.medium,
    fontSize: 15,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    backgroundColor: Colors.primaryBackgroundColor,
    borderRadius: 20,
    padding: 20,
    gap: 10,
  },
  modalTitle: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 18,
  },
  modalDesc: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: Colors.text,
    fontFamily: Fonts.medium,
    fontSize: 15,
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: Colors.red,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmBtnText: {
    color: Colors.text,
    fontFamily: Fonts.medium,
    fontSize: 15,
  },
});
