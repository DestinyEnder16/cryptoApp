import { useVerification } from '@/src/hooks/useVerification';
import { Redirect } from 'expo-router';

export default function Index() {
  const { isKycApproved } = useVerification();
  return <Redirect href={isKycApproved ? '/wallet/main' : '/wallet/locked'} />;
}
