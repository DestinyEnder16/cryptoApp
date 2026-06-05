import React from 'react';
import { ImageBackground } from 'react-native';

type Props = {
  children: React.ReactNode;
};

export default function AppBackground({ children }: Props) {
  return (
    <ImageBackground
      source={require('@/assets/images/new-bg.png')}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      {children}
    </ImageBackground>
  );
}
