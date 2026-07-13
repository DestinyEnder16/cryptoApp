import AppBackground from "@/src/shared/components/AppBackground";
import { LoadingIcon } from "@/src/shared/components/LoadingSpinner";
import { useVerification } from "@/src/features/kyc/hooks/useVerification";
import { Redirect } from "expo-router";
import { View } from "react-native";

export default function HomeIndex() {
  const { isKycApproved, isLoading } = useVerification();

  // Wait for /me before deciding: some login paths (e.g. password sign-in)
  // navigate here before the profile is cached, and treating "not loaded yet"
  // as "not approved" would flash the KYC-incomplete screen for verified users.
  if (isLoading) {
    return (
      <AppBackground>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <LoadingIcon size={64} />
        </View>
      </AppBackground>
    );
  }

  // A push-notification error (e.g. denied permission or simulator) must not
  // block the home screen — registration is handled separately and is optional.
  return (
    <Redirect href={isKycApproved ? "/home/kycDone" : "/home/kycIncomplete"} />
  );
}
