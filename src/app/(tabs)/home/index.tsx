import { useVerification } from '@/src/hooks/useVerification';
import { Redirect } from 'expo-router';

export default function HomeIndex() {
  const { isKycApproved } = useVerification();

  return (
    <Redirect href={isKycApproved ? '/home/kycDone' : '/home/kycIncomplete'} />
  );
}
