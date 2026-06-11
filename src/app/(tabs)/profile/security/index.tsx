import AppBackground from '@/src/components/AppBackground';
import ProfileStripItem from '@/src/components/ProfileStripItem';
import ScreenIntro from '@/src/components/ScreenIntro';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { usePadding } from '@/src/hooks/usePadding';
import { useFetchMeQuery } from '@/src/store/api/profileApi';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function Index() {
  const paddingTop = usePadding();
  const { data: user } = useFetchMeQuery();
  const biometricEnabled = user?.settings.biometricEnabled;
  const twoFactorAuthEnabled = user?.twoFactorEnabled;

  return (
    <AppBackground>
      <View style={{ paddingTop, paddingHorizontal: 20, flex: 1 }}>
        <ScreenIntro
          title="Security"
          description="Protect account access and sensitive actions."
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ marginVertical: 50 }}
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
            subtitle="8 backup codes remaining"
            badge="View"
            onPress={() => {
              router.navigate({
                pathname: '/(tabs)/profile/security/codes',
              });
            }}
          />
          <ProfileStripItem
            title="Registered devices"
            subtitle="iPhone 15 Pro · push enabled"
            badge={2}
          />
          <ProfileStripItem
            danger={!biometricEnabled}
            title="Biometric login"
            subtitle="Face ID enabled on this device"
            badge={biometricEnabled ? 'On' : 'Off'}
          />

          <View style={styles.warning}>
            <Text style={styles.warningTitle}>
              Admin will never ask for codes
            </Text>
            <Text style={styles.warningBody}>
              Keep recovery codes private and regenerate them if exposed.
            </Text>
          </View>
        </ScrollView>
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  warning: {
    backgroundColor: Colors.brown,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginTop: 40,
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
});
