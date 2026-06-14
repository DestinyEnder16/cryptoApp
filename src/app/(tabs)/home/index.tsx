import Loader from '@/src/components/Loader';
import { useFetchMeQuery } from '@/src/store/api/profileApi';
import { Redirect } from 'expo-router';

export default function HomeIndex() {
  const { data: user, isLoading } = useFetchMeQuery();

  if (isLoading || !user) return <Loader />;

  return (
    <Redirect
      href={user.kycStatus === 'approved' ? '/home/kycDone' : '/home/kycIncomplete'}
    />
  );
}
