import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import {
  CurrencyIcon,
  CustomizationIcon,
  FavoriteIcon,
  NotifIcon,
  ScanIcon,
  SearchIcon,
} from '../constants/images';

interface HeaderProps {
  variant: 'profile' | 'market';
}

export default function ScreenHeader({ variant }: HeaderProps) {
  return (
    <View style={[styles.rowContainer, { paddingHorizontal: 20 }]}>
      <Image
        source={require('@/assets/images/avatar.png')}
        // contentFit="cover"
        style={{ height: 36, width: 36 }}
        transition={1000}
      />

      <View style={[styles.rowContainer, { gap: 30 }]}>
        {/* <Text>icon</Text> */}
        {variant === 'profile' ? (
          <>
            <SearchIcon />
            <ScanIcon />
            <NotifIcon />
          </>
        ) : (
          <>
            <CustomizationIcon />
            <CurrencyIcon />
            <FavoriteIcon />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
});
