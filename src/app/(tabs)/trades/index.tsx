import { useVerification } from '@/src/hooks/useVerification';
import { Redirect } from 'expo-router';

export default function Index() {
  const { isKycApproved } = useVerification();

  // Stay inside the trades stack — redirecting out to a root route (e.g. /kyc)
  // during the tab's render phase crashes Fabric on Android. The locked screen
  // offers a "Verify Identity" button that navigates to /kyc on press instead.
  return <Redirect href={isKycApproved ? '/trades/main' : '/trades/locked'} />;
}
