import KycStepper from '@/src/features/kyc/components/KycStepper';
import ScreenIntro from '@/src/shared/components/ScreenIntro';
import { Fonts } from '@/src/shared/constants/fonts';
import { Colors } from '@/src/shared/constants/styles';
import { showToast } from '@/src/shared/helpers/showToast';
import { useUploadKycDocumentMutation } from '@/src/features/kyc/store/kycApi';
import { useAppDispatch } from '@/src/store/hooks';
import {
  addDocumentBackImageUrl,
  addDocumentImageUrl,
} from '@/src/features/kyc/store/kycSlice';
import type { DocumentKind } from '@/src/features/kyc/types/kyc';
import * as DocumentPicker from 'expo-document-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import AppBackground from '@/src/shared/components/AppBackground';
import Btn from '@/src/shared/components/Btn';

const PARTS: { label: string; documentKind: DocumentKind }[] = [
  { label: 'Front required', documentKind: 'document_front' },
  { label: 'Back optional', documentKind: 'document_back' },
  { label: 'Passport page', documentKind: 'document_front' },
];

const DOC_INSTRUCTIONS = [
  'Upload document front',
  'Upload the back of the document',
  'Upload government issued passport',
];

export default function UploadScreen() {
  const [activePart, setActivePart] = useState(0);
  const [document, setDocument] =
    useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [uploadKycDocument, { isLoading: isUploading }] =
    useUploadKycDocumentMutation();
  const dispatch = useAppDispatch();

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*', // JPG / PNG, matching the accepted files note
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        const file = result.assets[0];
        setDocument(file);
        console.log('picked', file.name, file.uri);
      } else {
        throw new Error();
      }
    } catch {
      showToast({
        type: 'error',
        title: 'Upload error',
        message: 'No image was selected',
      });
    }
  };

  const handleUpload = async function () {
    if (!document) {
      showToast({
        type: 'error',
        title: 'No document',
        message: 'Select an image to upload first',
      });
      return;
    }

    const documentKind = PARTS[activePart].documentKind;

    try {
      const result = await uploadKycDocument({
        file: {
          uri: document.uri,
          name: document.name,
          type: document.mimeType ?? 'image/jpeg',
        },
        documentKind,
      }).unwrap();

      // Persist the hosted URL so the Review screen can submit it.
      if (documentKind === 'document_back') {
        dispatch(addDocumentBackImageUrl(result.publicUrl));
      } else {
        dispatch(addDocumentImageUrl(result.publicUrl));
      }

      showToast({
        type: 'success',
        title: 'Uploaded',
        message: `${PARTS[activePart].label} uploaded`,
      });
      router.navigate('/kyc/process/document/selfie');
    } catch (e) {
      console.error(e);
      showToast({
        type: 'error',
        title: 'Upload error',
        message: 'Image could not be uploaded. Try again',
      });
    }
  };

  return (
    <AppBackground>
      <ScreenIntro
        title="Upload document"
        description="Use a clear photo. All corners should be visible and text readable."
        hasBackBtn
      />

      <KycStepper currentStep={2} style={{ marginTop: 10 }} />

      <View style={styles.content}>
        <View style={styles.partRow}>
          {PARTS.map((part, index) => (
            <Pressable
              key={part.label}
              onPress={() => setActivePart(index)}
              style={[
                styles.partCard,
                index === activePart && styles.partCardActive,
              ]}
            >
              <View
                style={[
                  styles.partCircle,
                  index === activePart && styles.partCircleActive,
                ]}
              />
              <Text
                style={[
                  styles.partLabel,
                  index === activePart && styles.partLabelActive,
                ]}
              >
                {part.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.dropzone} onPress={pickDocument}>
          <View style={styles.dropCircle} />
          <Text style={styles.dropTxt}>
            {document ? document.name : DOC_INSTRUCTIONS[activePart]}
          </Text>
        </Pressable>

        <View style={styles.acceptedRow}>
          <Text style={styles.acceptedLabel}>Accepted files</Text>
          <Text style={styles.acceptedValue}>JPG · PNG</Text>
        </View>
      </View>

      <Btn
        text={isUploading ? 'Uploading…' : 'Upload and continue'}
        fontSize={13}
        disabled={isUploading || !document}
        action={() => handleUpload()}
      />
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    marginTop: 30,
  },
  partRow: {
    flexDirection: 'row',
    gap: 12,
  },
  partCard: {
    flex: 1,
    minHeight: 110,
    borderRadius: 16,
    padding: 14,
    justifyContent: 'space-between',
    backgroundColor: Colors.secondaryBackgroundColor,
  },
  partCardActive: {
    backgroundColor: '#2B8A63',
  },
  partCircle: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: Colors.dotInactive,
  },
  partCircleActive: {
    backgroundColor: Colors.green,
  },
  partLabel: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.ash,
  },
  partLabelActive: {
    color: Colors.text,
  },
  dropzone: {
    marginTop: 24,
    borderRadius: 20,
    paddingVertical: 36,
    alignItems: 'center',
    gap: 18,
    backgroundColor: Colors.secondaryBackgroundColor,
  },
  dropCircle: {
    width: 56,
    height: 56,
    borderRadius: 999,
    backgroundColor: Colors.lime,
  },
  dropTxt: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: Colors.text,
  },
  acceptedRow: {
    marginTop: 20,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.secondaryBackgroundColor,
  },
  acceptedLabel: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.ash,
  },
  acceptedValue: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: Colors.text,
  },
});
