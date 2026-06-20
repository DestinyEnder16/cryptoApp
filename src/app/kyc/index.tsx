import KycStart from '@/src/components/screens/kyc/kycStart';
import { useVerification } from '@/src/hooks/useVerification';
import { Redirect } from 'expo-router';

export default function Index() {
  const { isKycApproved } = useVerification();

  // Already verified users skip the intro and land in the process flow.
  if (isKycApproved) {
    return <Redirect href="/kyc/process" />;
  }

  return <KycStart />;
}
