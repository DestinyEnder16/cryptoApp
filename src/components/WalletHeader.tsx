import Ionicons from '@expo/vector-icons/Ionicons';
import { ImageBackground } from 'expo-image';
import { memo, useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Fonts } from '../constants/fonts';
import { EyeSlash } from '../constants/images';
import { Colors } from '../constants/styles';
import { useFetchMeQuery } from '../store/api/profileApi';
import { currencyConverter } from '../utils/currencyConverter';
import ActionBtn from './ActionBtn';

const AMOUNT = 40059.83;

function WalletHeader() {
  const { data: user } = useFetchMeQuery();
  const currency = user?.settings.fiatCurrency;
  const insets = useSafeAreaInsets();

  const [visible, setVisible] = useState(true);

  const convertedAmount = useMemo(
    () =>
      currency ? `$${currencyConverter(AMOUNT, 'btc', currency)}` : '****',
    [currency]
  );

  const toggleVisibility = useCallback(() => setVisible((prev) => !prev), []);

  return (
    <ImageBackground
      source={require('@/assets/images/background.png')}
      style={[styles.bg, { paddingTop: insets.top + 10 }]}
    >
      <View style={styles.row}>
        <View>
          <Text style={styles.balance}>Current Balance</Text>

          <Text style={styles.amount}>{visible ? AMOUNT : '****'}</Text>

          <Text style={styles.convertedAmount}>
            {visible ? convertedAmount : '****'}
          </Text>
        </View>

        <View>
          <Pressable onPress={toggleVisibility} hitSlop={20}>
            {visible ? (
              <Ionicons name="eye" size={24} color={Colors.grey} />
            ) : (
              <EyeSlash />
            )}
          </Pressable>
        </View>
      </View>

      <View style={[styles.row, styles.actionRow]}>
        <ActionBtn
          text="Deposit"
          styles={depositStyles}
          style={styles.actionBtn}
        />
        <ActionBtn
          text="Withdraw"
          styles={secondaryActionStyles}
          style={styles.actionBtn}
        />
        <ActionBtn
          text="Transfer"
          styles={secondaryActionStyles}
          style={styles.actionBtn}
        />
      </View>
    </ImageBackground>
  );
}

const depositStyles = {
  backgroundColor: Colors.green,
  txtColor: Colors.dark,
};

const secondaryActionStyles = {
  backgroundColor: Colors.secondaryBackgroundColor,
  txtColor: Colors.grey,
};

export default memo(WalletHeader);

const styles = StyleSheet.create({
  bg: {
    paddingHorizontal: 15,
    paddingBottom: 10,
    gap: 50,
  },
  balance: {
    color: Colors.ash,
    marginBottom: 20,
  },
  amount: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 32,
  },
  convertedAmount: {
    color: Colors.grey,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionRow: { gap: 5 },
  actionBtn: { flex: 1 },
});
