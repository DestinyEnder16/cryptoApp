import AppBackground from '@/src/components/AppBackground';
import Btn from '@/src/components/Btn';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { useFetchMeQuery } from '@/src/store/api/profileApi';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeIndex() {
  const { data: user } = useFetchMeQuery();
  const firstName = user?.fullName?.split(' ')[0] ?? '';

  return (
    <AppBackground>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Home</Text>
          <Text style={styles.welcome}>Welcome back, {firstName}</Text>
        </View>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total balance</Text>
          <Text style={styles.balanceAmount}>$4,892.40</Text>
          <Text style={styles.balanceMeta}>+3.8% today · verified</Text>
        </View>

        <Btn text="Deposit" action={() => console.log('deposit')} />
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 24,
  },
  header: {
    gap: 4,
  },
  title: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 28,
  },
  welcome: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 14,
  },
  balanceCard: {
    backgroundColor: Colors.lime,
    borderRadius: 20,
    padding: 24,
    gap: 8,
  },
  balanceLabel: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 13,
  },
  balanceAmount: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 36,
  },
  balanceMeta: {
    color: Colors.green,
    fontFamily: Fonts.medium,
    fontSize: 13,
  },
});
