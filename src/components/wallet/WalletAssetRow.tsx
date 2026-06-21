import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Fonts } from '../../constants/fonts';
import { Colors } from '../../constants/styles';
import { formatPrice } from '../../helpers/formatPrice';
import type { SandboxAsset } from '../../data/sandboxWallet';
import CoinBadge from './CoinBadge';

interface WalletAssetRowProps {
  asset: SandboxAsset;
  /** Right-side caption under the name. Defaults to the asset's USD balance. */
  caption?: string;
  /** Selectable picker mode (radio on the right). */
  selectable?: boolean;
  selected?: boolean;
  onPress?: () => void;
}

export default function WalletAssetRow({
  asset,
  caption,
  selectable = false,
  selected = false,
  onPress,
}: WalletAssetRowProps) {
  return (
    <Pressable
      style={styles.row}
      onPress={onPress}
      disabled={!onPress && !selectable}
    >
      <CoinBadge symbol={asset.symbol} />

      <View style={styles.identity}>
        <Text style={styles.name}>{asset.name}</Text>
        <Text style={styles.sub}>{caption ?? asset.symbol}</Text>
      </View>

      {selectable ? (
        <View style={[styles.radio, selected && styles.radioOn]}>
          {selected && (
            <Ionicons name="checkmark" size={14} color={Colors.dark} />
          )}
        </View>
      ) : (
        <View style={styles.amounts}>
          <Text style={styles.value}>{formatPrice(asset.balanceUsd)}</Text>
          <Text style={styles.units}>{asset.units}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  identity: {
    flex: 1,
    gap: 4,
  },
  name: {
    color: Colors.text,
    fontFamily: Fonts.medium,
    fontSize: 15,
  },
  sub: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 12,
  },
  amounts: {
    alignItems: 'flex-end',
    gap: 4,
  },
  value: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 15,
  },
  units: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 12,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.dotInactive,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: {
    backgroundColor: Colors.green,
    borderColor: Colors.green,
  },
});
