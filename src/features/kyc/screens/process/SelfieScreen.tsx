import KycStepper from '@/src/features/kyc/components/KycStepper';
import ScreenIntro from '@/src/shared/components/ScreenIntro';
import { Fonts } from '@/src/shared/constants/fonts';
import { Colors } from '@/src/shared/constants/styles';
import { showToast } from '@/src/shared/helpers/showToast';
import { useUploadKycDocumentMutation } from '@/src/features/kyc/store/kycApi';
import { useAppDispatch } from '@/src/store/hooks';
import { addSelfieImageUrl } from '@/src/features/kyc/store/kycSlice';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import AppBackground from '@/src/shared/components/AppBackground';
import Btn from '@/src/shared/components/Btn';

const TIPS = [
  'Good lighting',
  'No sunglasses or masks',
  'Use your own document',
];

export default function SelfieScreen() {
  const [selfie, setSelfie] = useState<ImagePicker.ImagePickerAsset | null>(
    null
  );
  const [uploadKycDocument, { isLoading: isUploading }] =
    useUploadKycDocumentMutation();
  const dispatch = useAppDispatch();

  const captureSelfie = async () => {
    // Ask for camera access — a KYC selfie must be a live capture, not a
    // gallery pick, so we launch the camera (front-facing) directly.
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      showToast({
        type: 'error',
        title: 'Camera needed',
        message: 'Allow camera access to take a selfie.',
      });
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      cameraType: ImagePicker.CameraType.front,
      mediaTypes: ['images'],
      quality: 0.7,
    });

    if (!result.canceled) {
      setSelfie(result.assets[0]);
    }
  };

  const handleUpload = async () => {
    if (!selfie) {
      showToast({
        type: 'error',
        title: 'No selfie',
        message: 'Take a selfie first',
      });
      return;
    }

    try {
      const result = await uploadKycDocument({
        file: {
          uri: selfie.uri,
          name: selfie.fileName ?? 'selfie.jpg',
          type: selfie.mimeType ?? 'image/jpeg',
        },
        documentKind: 'selfie',
      }).unwrap();

      // Persist the hosted URL so the Review screen can submit it.
      dispatch(addSelfieImageUrl(result.publicUrl));

      showToast({
        type: 'success',
        title: 'Uploaded',
        message: 'Selfie uploaded',
      });
      router.navigate('/kyc/process/review');
    } catch (e) {
      console.error(e);
      showToast({
        type: 'error',
        title: 'Upload error',
        message: 'Selfie could not be uploaded. Try again',
      });
    }
  };

  return (
    <AppBackground>
      <ScreenIntro
        title="Selfie Check"
        description="Take a clear selfie so compliance can compare your face with your document."
        hasBackBtn
      />

      <KycStepper currentStep={2} />

      <View style={styles.content}>
        <Pressable style={styles.ringOuter} onPress={captureSelfie}>
          {selfie ? (
            <Image source={{ uri: selfie.uri }} style={styles.preview} />
          ) : (
            <Ionicons name="camera" size={56} color={Colors.text} />
          )}
        </Pressable>

        <Text style={styles.hint}>
          {selfie ? 'Tap to retake' : 'Tap to take a selfie'}
        </Text>

        <View style={styles.tips}>
          {TIPS.map((tip) => (
            <View key={tip} style={styles.tipRow}>
              <View style={styles.tipCheck}>
                <Ionicons
                  name="checkmark"
                  size={16}
                  color={Colors.primaryBackgroundColor}
                />
              </View>
              <Text style={styles.tipTxt}>{tip}</Text>
            </View>
          ))}
        </View>
      </View>

      <Btn
        text={isUploading ? 'Uploading…' : 'Upload selfie'}
        fontSize={13}
        disabled={isUploading || !selfie}
        action={() => handleUpload()}
      />
    </AppBackground>
  );
}

const RING_OUTER = 200;
const RING_INNER = 148;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: 24,
  },
  ringOuter: {
    width: RING_OUTER,
    height: RING_OUTER,
    borderRadius: RING_OUTER / 2,
    backgroundColor: '#1E5C44',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringInner: {
    width: RING_INNER,
    height: RING_INNER,
    borderRadius: RING_INNER / 2,
    backgroundColor: Colors.secondaryBackgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  preview: {
    width: '100%',
    height: '100%',
    borderRadius: 199,
  },
  hint: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: Colors.ash,
    textAlign: 'center',
    marginTop: -12,
  },
  tips: {
    gap: 12,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  tipCheck: {
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: Colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipTxt: {
    fontFamily: Fonts.medium,
    fontSize: 15,
    color: Colors.text,
  },
});
