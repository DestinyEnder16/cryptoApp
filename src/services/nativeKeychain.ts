import * as Keychain from 'react-native-keychain';

type Credentials = {
  token: string;
  email?: string;
};

const SERVICE = 'com.tminus.crypto.auth';

export const setCredentials = async ({ token, email }: Credentials) => {
  // Store the credentials
  email &&
    (await Keychain.setGenericPassword(email, token, { service: SERVICE }));
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
};
