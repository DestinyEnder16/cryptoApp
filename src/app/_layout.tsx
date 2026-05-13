import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { Colors } from '../constants/styles';
import { store } from '../store';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'NeueMontreal-Bold': require('@/assets/fonts/NeueMontreal-Bold.otf'),
    'NeueMontreal-Italic': require('@/assets/fonts/NeueMontreal-Italic.otf'),
    'NeueMontreal-Light': require('@/assets/fonts/NeueMontreal-Light.otf'),
    'NeueMontreal-Medium': require('@/assets/fonts/NeueMontreal-Medium.otf'),
    'NeueMontreal-Regular': require('@/assets/fonts/NeueMontreal-Regular.otf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <Provider store={store}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: Colors.primaryBackgroundColor,
          },
          animation: 'slide_from_bottom',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ animation: 'none' }} />
        <Stack.Screen name="profile" options={{ animation: 'none' }} />
        <Stack.Screen name="settings" options={{ animation: 'none' }} />
      </Stack>
    </Provider>
  );
}
