import { useFetchMeQuery } from '@/src/features/profile/store/profileApi';

export function useVerification() {
  const { data: user, isLoading, isUninitialized } = useFetchMeQuery();
  const kycStatus = user?.kycStatus;
  const verification = user?.verification;

  return {
    // True until /me has produced a definitive result. Stays false during
    // background refetches when data already exists, and false on error so
    // callers fall back to a safe default rather than spinning forever.
    isLoading: isUninitialized || isLoading,
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
