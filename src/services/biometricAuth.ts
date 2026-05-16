import * as LocalAuthentication from 'expo-local-authentication';

async function isBiometricAvailable() {
  const suitableDevice = await LocalAuthentication.hasHardwareAsync();
  const hasEnrolledBiometrics = await LocalAuthentication.isEnrolledAsync();
  if (hasEnrolledBiometrics && suitableDevice) {
    return true;
  } else {
    return false;
  }
}

export async function authenticateWithBiometrics() {
  try {
    const response = await isBiometricAvailable();
    if (response) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate with Biometrics',
      });
      return result.success;
    } else {
      throw new Error('Biometrics not set up on this device');
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}
