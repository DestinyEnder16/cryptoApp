import { useAppSelector } from '../store/hooks';
import {
  selectKycStatus,
  selectVerification,
} from '../store/slices/authSlice';

export function useVerification() {
  const kycStatus = useAppSelector(selectKycStatus);
  const verification = useAppSelector(selectVerification);

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
