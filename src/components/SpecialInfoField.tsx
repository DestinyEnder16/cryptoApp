import { StyleSheet, Text, View } from 'react-native';

import { Fonts } from '../constants/fonts';
import { Colors } from '../constants/styles';

// type HexColor = `#${string}`;

export type InfoStatus = 'error' | 'warning' | undefined;

interface CardProps {
  title: string;
  info: string;
  state?: InfoStatus;
}

export default function InfoCard({
  title,
  info,
  state = undefined,
}: CardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <Text
        style={[
          styles.info,
          state === 'error' && { color: Colors.red },
          state === 'warning' && { color: Colors.orangeBrown },
        ]}
      >
        {info}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 14,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 15,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: Fonts.regular,
    color: Colors.textMuted,
  },
  info: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: Colors.text,
  },
});
