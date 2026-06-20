import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import Btn from '@/src/components/Btn';
import { KycStepProps } from './types';

export default function IdentityStep({ onNext, onBack }: KycStepProps) {
  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <Text style={styles.title}>Identity details</Text>
        <Text style={styles.subtitle}>
          Tell us who you are — your legal name and date of birth as they appear
          on your ID.
        </Text>
      </View>

      <View style={styles.footer}>
        <Btn text="Continue" fontSize={13} action={onNext} />
        <Pressable hitSlop={20} onPress={onBack}>
          <Text style={styles.backText}>Back</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    gap: 8,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: Colors.text,
  },
  subtitle: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.ash,
  },
  footer: {
    gap: 16,
    alignItems: 'center',
  },
  backText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: Colors.ash,
  },
});
