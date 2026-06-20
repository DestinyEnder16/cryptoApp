import { StyleSheet, Text, View } from 'react-native';

import { Fonts } from '../constants/fonts';
import { Colors } from '../constants/styles';

interface KycLevelCardProps {
  level: number;
  title: string;
  description: string;
}

export default function KycLevelCard({
  level,
  title,
  description,
}: KycLevelCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.badge}>
        <Text style={styles.badgeTxt}>Level {level}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
    gap: 10,
    marginBottom: 30,
  },
  badge: {
    width: 92,
    height: 92,
    borderRadius: 999,
    backgroundColor: Colors.lime,
    position: 'relative',
  },
  badgeTxt: {
    color: Colors.green,
    fontFamily: Fonts.medium,
    fontSize: 12,
    alignSelf: 'center',
    marginTop: 10,
  },
  title: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 22,
    position: 'absolute',
    bottom: 10,
    left: -150,
    right: -150,
    textAlign: 'center',
  },
  description: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
