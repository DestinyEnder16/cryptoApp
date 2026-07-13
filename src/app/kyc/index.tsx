import { LoadingIcon } from '@/src/shared/components/LoadingSpinner';
import KycStart from '@/src/features/kyc/screens/kycStart';
import ApprovedScreen from '@/src/features/kyc/screens/status/ApprovedScreen';
import PendingScreen from '@/src/features/kyc/screens/status/PendingScreen';
import RejectedScreen from '@/src/features/kyc/screens/status/RejectedScreen';
import { useFetchMeQuery } from '@/src/features/profile/store/profileApi';
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

  // Render the screen that matches the user's real KYC status. We render the
  // components directly instead of <Redirect>-ing to /kyc/status/* — a redirect
  // that immediately triggers another redirect across nested stacks crashes
  // Fabric on Android ("addViewAt: failed to insert view").
  switch (user?.kycStatus) {
    case 'pending':
      return <PendingScreen />;
    case 'approved':
      return <ApprovedScreen />;
    case 'rejected':
      return <RejectedScreen />;
    default:
      // 'not_started' or unknown — start the intro flow.
      return <KycStart />;
  }
}
