import { StyleSheet, Text, View } from 'react-native';

import { Fonts } from '../constants/fonts';
import { Colors } from '../constants/styles';

interface LimitInfoFieldProps {
  level: number;
  title: string;
  info: string;
  active?: boolean;
}

export default function LimitInfoField({
  level,
  title,
  info,
  active = false,
}: LimitInfoFieldProps) {
  return (
    <View style={[styles.card, active && styles.cardActive]}>
      <View style={[styles.badge, active && styles.badgeActive]}>
        <Text style={[styles.badgeTxt, active && styles.badgeTxtActive]}>
          {level}
        </Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        <Text style={[styles.info, active && styles.infoActive]}>{info}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 20,
    paddingVertical: 22,
    paddingHorizontal: 20,
  },
  cardActive: {
    backgroundColor: Colors.lime,
  },
  badge: {
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: Colors.dotInactive,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeActive: {
    backgroundColor: Colors.green,
  },
  badgeTxt: {
    fontFamily: Fonts.medium,
    fontSize: 16,
    color: Colors.ash,
  },
  badgeTxtActive: {
    color: Colors.dark,
  },
  body: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 20,
    color: Colors.text,
  },
  info: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.textMuted,
  },
  infoActive: {
    color: Colors.lightTxt,
  },
});
