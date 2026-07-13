import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { Fonts } from '@/src/shared/constants/fonts';

type OnboardingViewProps = {
  heading: string;
  info: string;
  img: number;
};

export default function OnboardingView({
  heading,
  info,
  img,
}: OnboardingViewProps) {
  const { width } = useWindowDimensions();

  /*
IMPORTANT
  Dimensions.get('window').width — one-time snapshot, breaks on rotation unless you add a listener

  */

  return (
    <ImageBackground
      source={require('@/assets/images/onboarding-bg.png')}
      resizeMode="cover"
    >
      <View style={[styles.container, { width }]}>
        <Image source={img} style={styles.image} resizeMode="contain" />
        <Text style={styles.heading}>{heading}</Text>
        <Text style={styles.info}>{info}</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  image: {
    height: 320,
    marginBottom: 40,
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: Fonts.regular,
  },
  info: {
    color: '#777',
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'center',
  },
});
