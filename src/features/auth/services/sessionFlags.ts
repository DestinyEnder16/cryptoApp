import AsyncStorage from '@react-native-async-storage/async-storage';

// Persisted marker that the user explicitly signed out (soft lock) on this
// device while keeping their account remembered. It survives relaunches so the
// launch flow knows to show the welcome re-entry screen instead of going
// straight home. Set on soft sign-out; cleared on successful re-entry / full
// sign-out.
const SIGNED_OUT_KEY = 'auth.signedOut';

export async function setSignedOut(value: boolean): Promise<void> {
  try {
    if (value) {
      await AsyncStorage.setItem(SIGNED_OUT_KEY, '1');
    } else {
      await AsyncStorage.removeItem(SIGNED_OUT_KEY);
    }
  } catch (err) {
    console.warn('Failed to persist signed-out flag', err);
  }
}

export async function getSignedOut(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(SIGNED_OUT_KEY)) === '1';
  } catch (err) {
    console.warn('Failed to read signed-out flag', err);
    return false;
  }
}
