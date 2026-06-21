import Btn from '@/src/components/Btn';
import KycStepper from '@/src/components/KycStepper';
import ScreenIntro from '@/src/components/ScreenIntro';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import AppBackground from '../../../AppBackground';

import WarningField from '@/src/components/WarningField';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

import { useCallback, useRef, useState } from 'react';
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
  const sheetRef = useRef<BottomSheet>(null);
  const [isOpen, setIsOpen] = useState(true);

  const snapPoints = ['40%'];
  const handleSnapPress = useCallback((index: number) => {
    sheetRef.current?.snapToIndex(index);
    setIsOpen(true);
  }, []);

  return (
    <View style={styles.root}>
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
          <Pressable
            style={styles.inputField}
            onPress={() => handleSnapPress(0)}
          >
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

      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        enableDynamicSizing={false}
        onClose={() => setIsOpen(false)}
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.sheetHandle}
      >
        <BottomSheetView style={styles.sheetContent}>
          <Text style={styles.sheetTxt}>hello</Text>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  sheetBackground: {
    backgroundColor: Colors.secondaryBackgroundColor,
  },
  sheetHandle: {
    backgroundColor: Colors.ash,
  },
  sheetContent: {
    flex: 1,
    padding: 20,
  },
  sheetTxt: {
    color: Colors.text,
  },
  inputField: {
    backgroundColor: Colors.secondaryBackgroundColor,
    height: 52,
    borderRadius: 14,
    color: Colors.text,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },

  txt: {
    color: Colors.textMuted,
    fontFamily: Fonts.regular,
  },
});
