import { useVerification } from '@/src/hooks/useVerification';
import { Redirect } from 'expo-router';

export default function HomeIndex() {
  const { kycStatus, isKycApproved } = useVerification();

  if (!kycStatus) return null;

  return (
    <Redirect href={isKycApproved ? '/home/kycDone' : '/home/kycIncomplete'} />
  );
}
