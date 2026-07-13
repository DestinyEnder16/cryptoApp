import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Fonts } from '@/src/shared/constants/fonts';
import { Colors } from '@/src/shared/constants/styles';

interface TemplateProps {
  children: React.ReactNode;
  headerTxt: string;
  headerDesc?: string;
  hasBackBtn?: boolean;
}

export default function LoginTemplate({
  children,
  headerTxt,
  headerDesc,
  hasBackBtn = false,
}: TemplateProps) {
  return (
    <View style={{ flex: 1 }}>
      {hasBackBtn ? (
        <View style={{ gap: 10, flexDirection: 'row' }}>
          <Pressable style={styles.backBtn}>
            <Text style={styles.backBtnText}>‹</Text>
          </Pressable>

          <View style={{ gap: 15 }}>
            <Text style={styles.header}>{headerTxt}</Text>
            {headerDesc && <Text style={styles.desc}>{headerDesc}</Text>}
          </View>
        </View>
      ) : (
        <View style={{ gap: 15 }}>
          <Text style={styles.header}>{headerTxt}</Text>
          {headerDesc && <Text style={styles.desc}>{headerDesc}</Text>}
        </View>
      )}
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
  backBtn: {
    width: 40,
    height: 40,
    backgroundColor: '#161C22',
    alignItems: 'center',
    borderRadius: 12,
    justifyContent: 'center',
  },
  backBtnText: {
    color: Colors.text,
    fontSize: 28,
    fontFamily: Fonts.medium,
  },
});
