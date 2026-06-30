import * as Keychain from 'react-native-keychain';

type Credentials = {
  token: string;
  email?: string;
  refreshToken?: string;
};

const SERVICE = 'com.tminus.crypto.auth';
// Refresh token lives in its own entry so existing readers of the access-token
// entry (credentials.password) keep working unchanged.
const REFRESH_SERVICE = 'com.tminus.crypto.refresh';
const DEVICE_SERVICE = 'com.tminus.crypto.device';

export const setCredentials = async ({
  token,
  email,
  refreshToken,
}: Credentials) => {
  // Store the credentials
  email &&
    (await Keychain.setGenericPassword(email, token, { service: SERVICE }));
  if (refreshToken) await saveRefreshToken(refreshToken);
};

// Persist a (rotated) refresh token on its own — no email needed, so the
// reauth flow can call this after every refresh.
export const saveRefreshToken = async (refreshToken: string) => {
  await Keychain.setGenericPassword('refresh', refreshToken, {
    service: REFRESH_SERVICE,
  });
};

export const getRefreshToken = async (): Promise<string | null> => {
  try {
    const credentials = await Keychain.getGenericPassword({
      service: REFRESH_SERVICE,
    });
    return credentials ? credentials.password : null;
  } catch (error) {
    console.error('Failed to read refresh token from Keychain', error);
    return null;
  }
};

export const getCredentials = async () => {
  try {
    // Retrieve the credentials
    const credentials = await Keychain.getGenericPassword({
      service: SERVICE,
    });
    if (credentials) {
      console.log(
        'Credentials successfully loaded for user ' + credentials.password
      );
      return credentials;
    } else {
      console.log('No credentials stored');
      return false;
    }
  } catch (error) {
    console.error('Failed to access Keychain', error);
    return false;
  }
};

export const resetCredentials = async () => {
  await Keychain.resetGenericPassword({ service: SERVICE });
  await Keychain.resetGenericPassword({ service: REFRESH_SERVICE });
};

export const saveDeviceId = async (deviceId: string) => {
  await Keychain.setGenericPassword('device', deviceId, {
    service: DEVICE_SERVICE,
  });
};

export const getDeviceId = async (): Promise<string | null> => {
  try {
    const result = await Keychain.getGenericPassword({
      service: DEVICE_SERVICE,
    });
    return result ? result.password : null;
  } catch {
    return null;
  }
};

export const clearDeviceId = async () => {
  await Keychain.resetGenericPassword({ service: DEVICE_SERVICE });
};
