import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SvgProps } from 'react-native-svg';

import { Fonts } from '../constants/fonts';
import { Colors } from '../constants/styles';

interface FieldProps {
  icon: React.FC<SvgProps>;
  header: string;
  desc: string;
}

export default function InfoField({ icon: Icon, header, desc }: FieldProps) {
  return (
    <View style={styles.container}>
      <Icon />
      <View style={{ gap: 10 }}>
        <Text style={styles.header}>{header}</Text>
        <Text style={styles.desc}>{desc}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 16,
    gap: 20,
    position: 'absolute',
    bottom: 30,
    marginHorizontal: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  header: {
    color: Colors.text,
    fontFamily: Fonts.medium,
    fontSize: 15,
  },
  desc: {
    color: Colors.textMuted,
    fontFamily: Fonts.regular,
    fontSize: 12,
    width: 250,
  },
});
