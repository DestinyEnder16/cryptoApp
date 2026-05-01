import Btn from '@/src/components/Btn';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SuccessScreen() {
  const insets = useSafeAreaInsets();
  return (
    <ImageBackground
      source={require('@/assets/images/onboarding-bg.png')}
      resizeMode="cover"
    >
      <View style={[styles.container, { paddingTop: insets.top + 80 }]}>
        <Image
          source={require('@/assets/images/success-reg.png')}
          style={{ height: 250 }}
          resizeMode="contain"
        />

        <Text style={styles.heading}>
          Your account has been successfully created!
        </Text>

        <Btn text="Get started" action={() => console.log('hey')} />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    height: '100%',
    alignItems: 'center',
    gap: 50,
  },
  heading: {
    fontFamily: Fonts.bold,
    fontSize: 32,
    color: Colors.text,
    lineHeight: 48,
    textAlign: 'center',
  },
});
