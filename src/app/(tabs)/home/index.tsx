import { useAppSelector } from '@/src/store/hooks';
import { Redirect } from 'expo-router';

export default function HomeIndex() {
  const status = useAppSelector((state) => state.auth.user?.kycStatus);

  if (!status) return null;

  return (
    <Redirect href={status === 'approved' ? '/home/kycDone' : '/home/kycIncomplete'} />
  );
}
