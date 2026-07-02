import Btn from "@/src/components/Btn";
import KycStepper from "@/src/components/KycStepper";
import ScreenIntro from "@/src/components/ScreenIntro";
import { router } from "expo-router";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import AppBackground from "../../../AppBackground";

import WarningField from "@/src/components/WarningField";
import { Fonts } from "@/src/constants/fonts";
import { Colors } from "@/src/constants/styles";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

import BottomSheetContent from "@/src/components/BottomSheetContent";
import { kycIdentitySchema } from "@/src/schemas/kycIdentitySchema";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import {
  addCountry,
  addDocumentNumber,
  addName,
} from "@/src/store/slices/kycSlice";
import { useCallback, useMemo, useRef } from "react";
interface InputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
}

function InputField({ placeholder, value, onChangeText }: InputProps) {
  return (
    <TextInput
      placeholder={placeholder}
      style={styles.inputField}
      placeholderTextColor={Colors.textMuted}
      value={value}
      onChangeText={onChangeText}
      autoCapitalize="characters"
    />
  );
}

// Layout stub — UI to be designed.
export default function IdentityScreen() {
  const sheetRef = useRef<BottomSheetModal>(null);

  const openSheet = useCallback(() => {
    // Close the keyboard first so it doesn't overlap the opening sheet.
    Keyboard.dismiss();
    sheetRef.current?.present();
  }, []);

  const dispatch = useAppDispatch();
  const { name, country, documentType, documentNumber } = useAppSelector(
    (state) => state.kyc,
  );

  const isValid = useMemo(
    () =>
      kycIdentitySchema.isValidSync({
        name,
        country,
        documentType,
        documentNumber,
      }),
    [name, country, documentType, documentNumber],
  );

  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.6}
        pressBehavior="close"
      />
    ),
    [],
  );

  return (
    <View style={styles.root}>
      <AppBackground>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <ScreenIntro
              title="Identity details"
              description="Enter details exactly as they appear on your document."
              hasBackBtn
            />

            <KycStepper currentStep={1} />

            <View style={{ gap: 20, marginVertical: 50 }}>
              <InputField
                placeholder="Legal name"
                value={name}
                onChangeText={(text) => dispatch(addName(text))}
              />
              <InputField
                placeholder="Country"
                value={country}
                onChangeText={(text) => dispatch(addCountry(text))}
              />
              <Pressable style={styles.inputField} onPress={openSheet}>
                <Text style={styles.txt}>
                  {documentType.length === 0 ? "Document Type" : documentType}
                </Text>
              </Pressable>
              <InputField
                placeholder="Document number"
                value={documentNumber}
                onChangeText={(text) => dispatch(addDocumentNumber(text))}
              />
            </View>

            <View style={{ marginTop: 30, marginBottom: 100 }}>
              <WarningField message="Mismatched details can delay approval or require resubmission." />
            </View>

            <Btn
              text="Continue"
              fontSize={13}
              disabled={!isValid}
              action={() => router.navigate("/kyc/process/document/upload")}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </AppBackground>

      <BottomSheetModal
        ref={sheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose
        enableDynamicSizing={false}
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.sheetHandle}
      >
        <BottomSheetView style={styles.sheetContent}>
          <BottomSheetContent />
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
}

const snapPoints = ["40%"];

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
  inputField: {
    backgroundColor: Colors.secondaryBackgroundColor,
    height: 60,
    borderRadius: 14,
    color: Colors.text,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  txt: {
    color: Colors.textMuted,
    fontFamily: Fonts.regular,
  },
});
