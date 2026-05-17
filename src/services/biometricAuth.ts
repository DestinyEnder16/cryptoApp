import * as LocalAuthentication from 'expo-local-authentication';

export async function isBiometricAvailable(): Promise<boolean> {
  const [isEnrolled] = await Promise.all([
    LocalAuthentication.isEnrolledAsync(),
  ]);
  return isEnrolled;
}

export async function authenticateWithBiometrics(): Promise<boolean> {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Authenticate with Biometrics',
  });
  return result.success;
}
