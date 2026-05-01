import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useState } from 'react';
import { Provider } from 'react-redux';
import CustomSplash from '../components/CustomSplash';
import { Colors } from '../constants/styles';
import { store } from '../store';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [splashDone, setSplashDone] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    'NeueMontreal-Bold': require('@/assets/fonts/NeueMontreal-Bold.otf'),
    'NeueMontreal-Italic': require('@/assets/fonts/NeueMontreal-Italic.otf'),
    'NeueMontreal-Light': require('@/assets/fonts/NeueMontreal-Light.otf'),
    'NeueMontreal-Medium': require('@/assets/fonts/NeueMontreal-Medium.otf'),
    'NeueMontreal-Regular': require('@/assets/fonts/NeueMontreal-Regular.otf'),
  });

  const isReady = splashDone && (fontsLoaded || !!fontError);

  return (
    <Provider store={store}>
      {!isReady ? (
        <CustomSplash
          onLayout={() => SplashScreen.hideAsync()}
          onDone={() => setSplashDone(true)}
        />
      ) : (
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: Colors.primaryBackgroundColor,
            },
            animation: 'slide_from_bottom',
          }}
        >
          <Stack.Screen name="index" />
        </Stack>
      )}
    </Provider>
  );
}
