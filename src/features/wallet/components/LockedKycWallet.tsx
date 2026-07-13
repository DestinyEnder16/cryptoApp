import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Fonts } from '@/src/shared/constants/fonts';
import { Colors } from '@/src/shared/constants/styles';

interface CardProps {
  title?: string;
  content?: string;
  element?: any;
}

function Card({ title, content, element }: CardProps) {
  return (
    <View style={styles.card}>
      <View style={{ gap: 10 }}>
        <Text style={styles.title}>{title}</Text>
        {content && <Text style={styles.content}>{content}</Text>}
      </View>

      <View style={{ alignSelf: 'center' }}>{element}</View>
    </View>
  );
}

export default function LockedKycWallet() {
  return (
    <View style={{ gap: 30 }}>
      <Card
        title="Available"
        content="920.00 USDT"
        element={
          <Pressable style={styles.btn}>
            <Text style={styles.btnText}>Review</Text>
          </Pressable>
        }
      />

      <Card
        title="Amount"
        content="500"
        element={<Text style={styles.title}>USDT</Text>}
      />

      <View
        style={[
          styles.card,
          { flexDirection: 'column', gap: 10, paddingBottom: 40 },
        ]}
      >
        <Text style={styles.errorTxt}>Withdrawal unavailable</Text>
        <Text style={styles.desc}>
          Your KYC is under review. Withdrawals unlock after approval.
        </Text>
      </View>

      <Card
        title="Current withdrawal limit"
        element={<Text style={styles.errorTxt}>$0</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.secondaryBackgroundColor,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 18,
  },
  title: {
    color: Colors.grey,
  },
  errorTxt: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: Colors.red,
  },
  desc: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.grey,
  },
  content: {
    fontFamily: Fonts.bold,
    fontSize: 24,
    color: Colors.text,
  },
  btn: {
    backgroundColor: Colors.orangeBrown,
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  btnText: {
    fontFamily: Fonts.medium,
    fontSize: 10,
    color: Colors.dark,
  },
});
