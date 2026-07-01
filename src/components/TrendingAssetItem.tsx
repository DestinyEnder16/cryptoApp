import { Image } from 'expo-image';
import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { API_URL } from '../constants/config';
import { Fonts } from '../constants/fonts';
import { Colors } from '../constants/styles';
import { currencyConverter } from '../utils/currencyConverter';

interface TrendingAssetItemProps {
  name: string;
  symbol: string;
  priceUsd: number;
  iconUrl: string;
}

function TrendingAssetItem({
  name,
  symbol,
  priceUsd,
  iconUrl,
}: TrendingAssetItemProps) {
  const priceBtc = currencyConverter(priceUsd, 'usd', 'btc');

  const formattedUsd = priceUsd.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formattedBtc = priceBtc.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  });

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Image
          style={{ width: 40, height: 40 }}
          source={{ uri: `${API_URL}${iconUrl}` }}
        />
        <View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.symbol}>{symbol}</Text>
        </View>
      </View>

      <View style={styles.right}>
        <Text style={styles.price}>{formattedBtc}</Text>
        <Text style={styles.usd}>${formattedUsd}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 25,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.dotInactive,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  right: {
    alignItems: 'flex-end',
    gap: 2,
  },
  name: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 16,
  },
  symbol: {
    color: Colors.grey,
    fontFamily: Fonts.regular,
    fontSize: 13,
  },
  price: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 16,
  },
  usd: {
    color: Colors.grey,
    fontFamily: Fonts.regular,
    fontSize: 13,
  },
});

export default memo(TrendingAssetItem);
