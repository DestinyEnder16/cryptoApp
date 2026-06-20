import Btn from '@/src/components/Btn';
import KycStepper from '@/src/components/KycStepper';
import ScreenIntro from '@/src/components/ScreenIntro';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import AppBackground from '../../../AppBackground';

import WarningField from '@/src/components/WarningField';
import { Colors } from '@/src/constants/styles';

interface InputProps {
  placeholder: string;
}

function InputField({ placeholder }: InputProps) {
  return (
    <TextInput
      placeholder={placeholder}
      style={styles.inputField}
      placeholderTextColor={Colors.textMuted}
    />
  );
}

// Layout stub — UI to be designed.
export default function IdentityScreen() {
  return (
    <AppBackground>
      <ScreenIntro
        title="Identity details"
        description="Enter details exactly as they appear on your document."
        hasBackBtn
      />

      <KycStepper currentStep={1} />

      <View style={{ gap: 20, marginVertical: 50 }}>
        <InputField placeholder="Legal name" />
        <InputField placeholder="Country" />
        <Pressable style={styles.inputField}>
          <Text style={styles.txt}>Document Type</Text>
        </Pressable>
        <InputField placeholder="Document number" />
      </View>

      <View style={{ marginTop: 30, marginBottom: 100 }}>
        <WarningField message="Mismatched details can delay approval or require resubmission." />
      </View>

      <Btn
        text="Continue"
        fontSize={13}
        action={() => router.navigate('/kyc/process/document/upload')}
      />
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  inputField: {
    backgroundColor: Colors.secondaryBackgroundColor,
    height: 52,
    paddingVertical: 30,
    borderRadius: 14,
    color: Colors.text,
    paddingLeft: 20,
  },
  txt: {
    color: Colors.red,
  },
});
