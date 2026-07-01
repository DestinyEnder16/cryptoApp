import { useNotification } from "@/src/context/NotificationContext";
import { useVerification } from "@/src/hooks/useVerification";
import { Redirect } from "expo-router";

export default function HomeIndex() {
  const { expoPushToken, notification, error } = useNotification();
  const { isKycApproved } = useVerification();

  if (error) return;

  return (
    <Redirect href={isKycApproved ? "/home/kycDone" : "/home/kycIncomplete"} />
  );
}
