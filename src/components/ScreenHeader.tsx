import { Image } from 'expo-image';
import { router } from 'expo-router';
import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import {
  CurrencyIcon,
  CustomizationIcon,
  FavoriteIcon,
  NotifIcon,
  ScanIcon,
  SettingsIcon,
} from '../constants/images';
import { Colors } from '../constants/styles';

interface HeaderProps {
  variant: 'profile' | 'market';
}

const goToSettings = () => router.navigate('/settings');
const goToProfile = () => router.navigate('/profile');
const goToWallet = () => router.navigate('/wallet/qrcode');
const goToNotifications = () => router.navigate('/home/notifications');

const AVATAR = require('@/assets/images/avatar.png');

function ScreenHeader({ variant }: HeaderProps) {
  const isProfile = variant === 'profile';
  const onAvatarPress = useCallback(goToProfile, []);

  return (
    <View style={[styles.rowContainer, styles.outer]}>
      <Pressable onPress={onAvatarPress}>
        <Image
          source={AVATAR}
          contentFit="cover"
          style={styles.avatar}
          transition={150}
          cachePolicy="memory-disk"
        />
      </Pressable>

      <View style={[styles.rowContainer, styles.icons]}>
        {isProfile ? (
          <>
            <Pressable onPress={goToSettings}>
              <SettingsIcon />
            </Pressable>
            <Pressable onPress={goToWallet}>
              <ScanIcon />
            </Pressable>
            <Pressable onPress={goToNotifications}>
              <NotifIcon />
            </Pressable>
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
    alignItems: 'center',
  },
  outer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: Colors.primaryBackgroundColor,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.15)',
  },
  icons: { gap: 30 },
  avatar: { height: 36, width: 36 },
});

export default memo(ScreenHeader);
