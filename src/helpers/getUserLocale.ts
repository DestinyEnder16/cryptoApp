import type { CountryCode } from "@perttu/react-native-country-picker-modal";
import { getLocales } from "expo-localization";

export function getUserRegion(): CountryCode {
  return (getLocales()[0]?.regionCode as CountryCode) ?? "US";
}
