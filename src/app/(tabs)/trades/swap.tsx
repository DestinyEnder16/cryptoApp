import { Redirect } from 'expo-router';

export default function SwapPage() {
  return <Redirect href="/trades/buy?tab=swap" />;
}
