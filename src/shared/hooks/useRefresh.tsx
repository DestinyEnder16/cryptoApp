import { Colors } from '@/src/shared/constants/styles';
import { useCallback, useState, type ReactElement } from 'react';
import { RefreshControl, type RefreshControlProps } from 'react-native';

/** Anything RTK Query's `refetch` returns — we only await it. */
type Refetcher = () => unknown;

/**
 * Pull-to-refresh helper. Pass the `refetch` functions of the queries a screen
 * depends on; the hook tracks a single `refreshing` flag and gives back a
 * themed <RefreshControl> ready to drop into a ScrollView/FlatList.
 *
 *   const { refreshControl } = useRefresh(refetchWallet, refetchTxns);
 *   <ScrollView refreshControl={refreshControl}>…</ScrollView>
 */
export function useRefresh(...refetchers: Refetcher[]): {
  refreshing: boolean;
  onRefresh: () => Promise<void>;
  refreshControl: ReactElement<RefreshControlProps>;
} {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all(refetchers.map((refetch) => refetch()));
    } finally {
      setRefreshing(false);
    }
    // Callers pass fresh closures each render; spreading keeps them current
    // without forcing a stable-reference contract on the query hooks.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, refetchers);

  const refreshControl = (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={Colors.green}
      colors={[Colors.green]}
      progressBackgroundColor={Colors.secondaryBackgroundColor}
    />
  );

  return { refreshing, onRefresh, refreshControl };
}
