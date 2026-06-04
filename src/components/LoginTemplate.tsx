import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Fonts } from '../constants/fonts';
import { Colors } from '../constants/styles';

interface TemplateProps {
  children: React.ReactNode;
  headerTxt: string;
  headerDesc?: string;
}

export default function LoginTemplate({
  children,
  headerTxt,
  headerDesc,
}: TemplateProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top + 50, paddingHorizontal: 20 }}>
      <View style={{ gap: 15 }}>
        <Text style={styles.header}>{headerTxt}</Text>
        {headerDesc && <Text style={styles.desc}>{headerDesc}</Text>}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 28,
    fontFamily: Fonts.bold,
    color: Colors.text,
  },
  desc: {
    fontFamily: Fonts.regular,
    color: Colors.grey,
  },
});
