import KycStepper from '@/src/components/KycStepper';
import ScreenIntro from '@/src/components/ScreenIntro';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { formatPrice } from '@/src/helpers/formatPrice';
import { useVerification } from '@/src/hooks/useVerification';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import AppBackground from '../../../AppBackground';
import Btn from '../../../Btn';
import { StatusRow } from './StatusRow';

export default function ApprovedScreen() {
  const { level, limits } = useVerification();

  return (
    <AppBackground>
      <ScreenIntro
        title="Verification approved"
        description="Your account limits have been upgraded."
        hasBackBtn
      />

      <KycStepper currentStep={3} />

      <View style={styles.content}>
        <View style={styles.badge}>
          <Ionicons name="checkmark" size={52} color={Colors.primaryBackgroundColor} />
        </View>

        <Text style={styles.title}>Level {level} unlocked</Text>

        <View style={styles.rows}>
          <StatusRow
            label="Trade per quote"
            value={formatPrice(limits?.tradePerTransactionUsd ?? 0, 0)}
          />
          <StatusRow
            label="Withdrawal request"
            value={formatPrice(limits?.withdrawalPerTransactionUsd ?? 0, 0)}
          />
          <StatusRow
            label="Daily withdrawal"
            value={formatPrice(limits?.dailyWithdrawalUsd ?? 0, 0)}
          />
        </View>
      </View>

      <Btn
        text="Start trading"
        fontSize={13}
        action={() => router.navigate('/(tabs)/home')}
      />
    </AppBackground>
  );
}

const BADGE = 132;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: 28,
  },
  badge: {
    width: BADGE,
    height: BADGE,
    borderRadius: BADGE / 2,
    backgroundColor: Colors.green,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 22,
    color: Colors.text,
    textAlign: 'center',
  },
  rows: {
    gap: 12,
  },
});
