import { Redirect } from 'expo-router';

// Entry into the process flow — start at the first sub-process.
export default function ProcessIndex() {
  return <Redirect href="/kyc/process/identity" />;
}
