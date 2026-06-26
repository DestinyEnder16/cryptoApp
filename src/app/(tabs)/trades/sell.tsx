import { Redirect } from 'expo-router';

export default function SellPage() {
  return <Redirect href="/trades/buy?tab=sell" />;
}
