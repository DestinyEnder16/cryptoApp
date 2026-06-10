import React from 'react';
import { ImageBackground } from 'react-native';
import { useSafeBottomPadding } from '../hooks/usePadding';

type Props = {
  children: React.ReactNode;
};

export default function AppBackground({ children }: Props) {
  const bottomPadding = useSafeBottomPadding();
  return (
    <ImageBackground
      source={require('@/assets/images/new-bg.png')}
      resizeMode="cover"
      style={{ flex: 1, paddingBottom: bottomPadding }}
    >
      {children}
    </ImageBackground>
  );
}
