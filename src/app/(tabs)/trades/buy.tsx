import TradeFormScreen from '@/src/features/trades/screens/TradeFormScreen';
import { useLocalSearchParams } from 'expo-router';

type TabKey = 'buy' | 'sell' | 'swap';

const VALID_TABS: TabKey[] = ['buy', 'sell', 'swap'];

export default function BuyPage() {
  const { tab, symbol } = useLocalSearchParams<{ tab?: string; symbol?: string }>();
  const initialTab: TabKey =
    VALID_TABS.includes(tab as TabKey) ? (tab as TabKey) : 'buy';
  return <TradeFormScreen initialTab={initialTab} symbol={symbol} />;
}
