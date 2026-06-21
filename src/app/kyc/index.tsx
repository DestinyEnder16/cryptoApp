import { LoadingIcon } from '@/src/components/LoadingSpinner';
import KycStart from '@/src/components/screens/kyc/kycStart';
import { useFetchMeQuery } from '@/src/store/api/profileApi';
import { Redirect } from 'expo-router';
import { View } from 'react-native';

export default function Index() {
  const { data: user, isLoading } = useFetchMeQuery();

  // Wait for /me before deciding which screen to show.
  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <LoadingIcon size={48} />
      </View>
    );
  }

  // Render the screen that matches the user's real KYC status.
  switch (user?.kycStatus) {
    case 'pending':
      return <Redirect href="/kyc/status/pending" />;
    case 'approved':
      return <Redirect href="/kyc/status/approved" />;
    case 'rejected':
      return <Redirect href="/kyc/status/rejected" />;
    default:
      // 'not_started' or unknown — start the intro flow.
      return <KycStart />;
  }
}
