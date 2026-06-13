import { BottomTabBarHeightContext } from '@react-navigation/bottom-tabs';
import React, { useContext } from 'react';
import { ImageBackground } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSafeBottomPadding } from '../hooks/usePadding';

type Props = {
  children: React.ReactNode;
};

export default function AppBackground({ children }: Props) {
  const insets = useSafeAreaInsets();
  const safeBottom = useSafeBottomPadding();
  const tabBarHeight = useContext(BottomTabBarHeightContext);
  // Tab bar floats at `bottom: safeBottom + 10` with height = tabBarHeight,
  // so content must clear safeBottom + tabBarHeight + 10 to not be hidden.
  const bottomPadding = tabBarHeight
    ? safeBottom + tabBarHeight + 20
    : safeBottom + 10;

  return (
    <ImageBackground
      source={require('@/assets/images/new-bg.png')}
      resizeMode="cover"
      style={{
        flex: 1,
        paddingTop: insets.top + 30,
        paddingBottom: bottomPadding,
      }}
    >
      {children}
    </ImageBackground>
  );
}
