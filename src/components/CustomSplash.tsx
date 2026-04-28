import { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';

type splashProps = {
  onDone: () => void;
  onLayout?: () => void;
};

export default function CustomSplash({ onDone, onLayout }: splashProps) {
  useEffect(() => {
    const timer = setTimeout(onDone, 1500); // show for 1.5s
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <View style={styles.container} onLayout={onLayout}>
      <Image
        source={require('@/assets/images/splash_screen.png')}
        resizeMode="center"
        style={{ height: 488 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#1B232A',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
