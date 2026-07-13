import { useFetchMeQuery } from '@/src/features/profile/store/profileApi';

export function useVerification() {
  const { data: user } = useFetchMeQuery();
  const kycStatus = user?.kycStatus;
  const verification = user?.verification;

  return {
    kycStatus,
    isKycApproved: kycStatus === 'approved',
    level: verification?.level ?? 0,
    tier: verification?.tier,
    label: verification?.label,
    limits: verification?.limits,
    canTrade: verification?.canTrade ?? false,
    canWithdraw: verification?.canWithdraw ?? false,
    canUseSandboxDeposits: verification?.canUseSandboxDeposits ?? false,
  };
}
