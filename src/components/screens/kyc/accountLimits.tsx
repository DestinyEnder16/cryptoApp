import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import AppBackground from '../../AppBackground';
import Btn from '../../Btn';
import KycStepper from '../../KycStepper';
import ScreenIntro from '../../ScreenIntro';

const REQUIREMENTS = [
  'A valid government-issued ID',
  'A clear selfie for face matching',
  'Around 5 minutes to complete',
];

export default function AccountLimits() {
  return (
    <AppBackground>
      <ScreenIntro
        title="What you'll unlock"
        hasBackBtn
        description="Verifying lifts your trade and withdrawal limits and raises your sandbox deposit cap."
      />

      <View style={{ marginTop: 20, paddingHorizontal: 40 }}>
        <KycStepper currentStep={0} />
      </View>

      <View style={styles.body}>
        <Text style={styles.heading}>Before you start</Text>
        {REQUIREMENTS.map((item) => (
          <View key={item} style={styles.row}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.item}>{item}</Text>
          </View>
        ))}
      </View>

      <Btn
        text="Continue"
        fontSize={13}
        action={() => router.navigate('/kyc/process')}
      />
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    marginTop: 40,
    gap: 16,
  },
  heading: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: Colors.text,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  bullet: {
    color: Colors.green,
    fontFamily: Fonts.bold,
    fontSize: 16,
  },
  item: {
    flex: 1,
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 14,
  },
});
