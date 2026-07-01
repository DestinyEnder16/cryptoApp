import { useVerification } from "@/src/hooks/useVerification";
import { Redirect } from "expo-router";

export default function HomeIndex() {
  const { isKycApproved } = useVerification();

  // A push-notification error (e.g. denied permission or simulator) must not
  // block the home screen — registration is handled separately and is optional.
  return (
    <Redirect href={isKycApproved ? "/home/kycDone" : "/home/kycIncomplete"} />
  );
}
