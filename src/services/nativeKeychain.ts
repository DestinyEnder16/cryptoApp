import * as Keychain from 'react-native-keychain';

type Credentials = {
  email?: string;
  password: string;
};

const SERVICE = 'com.tminus.crypto.auth';

export const setCredentials = async ({ email, password }: Credentials) => {
  // Store the credentials
  email &&
    (await Keychain.setGenericPassword(email, password, {
      service: SERVICE,
    }));
};

export const getCredentials = async () => {
  try {
    // Retrieve the credentials
    const credentials = await Keychain.getGenericPassword({
      service: SERVICE,
    });
    if (credentials) {
      console.log(
        'Credentials successfully loaded for user ' + credentials.username
      );
    } else {
      console.log('No credentials stored');
    }
  } catch (error) {
    console.error('Failed to access Keychain', error);
  }
};
