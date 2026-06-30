import AppBackground from '@/src/components/AppBackground';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import {
  useFetchMarketTradesQuery,
  useFetchOrderBookQuery,
} from '@/src/store/api/marketApi';
import type { MarketTrade, OrderBookLevel } from '@/src/types/market/types';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Tab = 'orderBook' | 'trades';

export default function OrderBook() {
  const { symbol } = useLocalSearchParams<{ symbol: string }>();
  const [activeTab, setActiveTab] = useState<Tab>('orderBook');

  const {
    data: orderBookData,
    isLoading: obLoading,
    isError: obError,
  } = useFetchOrderBookQuery(
    { symbol: symbol ?? '', levels: 12 },
    { skip: !symbol }
  );

  const {
    data: tradesData,
    isLoading: tradesLoading,
    isError: tradesError,
  } = useFetchMarketTradesQuery(symbol ?? '', {
    skip: !symbol,
    pollingInterval: 10_000,
  });

  if (!symbol) {
    return (
      <AppBackground>
        <View style={styles.center}>
          <Text style={styles.errorText}>Missing coin symbol.</Text>
        </View>
      </AppBackground>
    );
  }

  const title =
    activeTab === 'orderBook' ? `${symbol} order book` : 'Recent trades';
  const subtitle =
    activeTab === 'orderBook'
      ? 'Bid and ask levels for the trade screen.'
      : 'Latest simulated market prints.';

  return (
    <AppBackground>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>‹</Text>
          </Pressable>
          <View style={styles.headerText}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabRow}>
          <Pressable
            style={[styles.tab, activeTab === 'trades' && styles.tabActive]}
            onPress={() => setActiveTab('trades')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'trades' && styles.tabTextActive,
              ]}
            >
              Trades
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === 'orderBook' && styles.tabActive]}
            onPress={() => setActiveTab('orderBook')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'orderBook' && styles.tabTextActive,
              ]}
            >
              Order book
            </Text>
          </Pressable>
        </View>

        {/* Content */}
        {activeTab === 'orderBook' ? (
          obLoading ? (
            <View style={styles.center}>
              <ActivityIndicator color={Colors.green} />
            </View>
          ) : obError || !orderBookData ? (
            <View style={styles.center}>
              <Text style={styles.errorText}>
                Could not load order book data.
              </Text>
            </View>
          ) : (
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>Mid price</Text>
                <Text style={styles.infoValue}>
                  $
                  {orderBookData.midPriceUsd.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Text>
              </View>

              <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>Spread</Text>
                <Text style={styles.infoValue}>
                  ${orderBookData.spreadUsd.toFixed(2)}
                </Text>
              </View>

              <View style={styles.tableHeader}>
                <View style={styles.halfCol}>
                  <Text style={styles.colHeaderBid}>Bids</Text>
                </View>
                <View style={styles.halfCol}>
                  <Text style={styles.colHeaderAsk}>Asks</Text>
                </View>
              </View>

              {Array.from({
                length: Math.max(
                  orderBookData.bids.length,
                  orderBookData.asks.length
                ),
              }).map((_, i) => (
                <BookRow
                  key={i}
                  bid={orderBookData.bids[i]}
                  ask={orderBookData.asks[i]}
                />
              ))}
            </ScrollView>
          )
        ) : tradesLoading ? (
          <View style={styles.center}>
            <ActivityIndicator color={Colors.green} />
          </View>
        ) : tradesError || !tradesData ? (
          <View style={styles.center}>
            <Text style={styles.errorText}>Could not load trades.</Text>
          </View>
        ) : (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {tradesData.map((trade) => (
              <TradeRow key={trade.id} trade={trade} />
            ))}
          </ScrollView>
        )}

        {/* Trade button */}
        <View style={styles.footer}>
          <Pressable
            style={styles.tradeBtn}
            onPress={() =>
              router.navigate({
                pathname: '/trades/buy',
                params: { tab: 'buy', symbol },
              })
            }
          >
            <Text style={styles.tradeBtnText}>Trade {symbol}</Text>
          </Pressable>
        </View>
      </View>
    </AppBackground>
  );
}

interface BookRowProps {
  bid?: OrderBookLevel;
  ask?: OrderBookLevel;
}

function BookRow({ bid, ask }: BookRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.halfCol}>
        {bid ? (
          <>
            <Text style={styles.bidPrice}>
              {bid.priceUsd.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
            <Text style={styles.rowAmount}>{bid.amount.toFixed(4)}</Text>
          </>
        ) : null}
      </View>
      <View style={styles.halfCol}>
        {ask ? (
          <>
            <Text style={styles.askPrice}>
              {ask.priceUsd.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
            <Text style={styles.rowAmount}>{ask.amount.toFixed(4)}</Text>
          </>
        ) : null}
      </View>
    </View>
  );
}

function TradeRow({ trade }: { trade: MarketTrade }) {
  const isBuy = trade.side === 'buy';
  return (
    <View style={styles.tradeRow}>
      <Text style={[styles.tradeSide, isBuy ? styles.tradeBuy : styles.tradeSell]}>
        {isBuy ? 'Buy' : 'Sell'}
      </Text>
      <Text style={styles.tradePrice}>
        $
        {trade.priceUsd.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </Text>
      <Text style={styles.tradeAmount}>{trade.amount.toFixed(4)}</Text>
      <Text style={styles.tradeTotal}>
        {trade.totalUsd.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: Colors.secondaryBackgroundColor,
    marginTop: 2,
  },
  backBtnText: {
    color: Colors.text,
    fontSize: 24,
    fontFamily: Fonts.medium,
    lineHeight: 26,
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 24,
  },
  subtitle: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 13,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 12,
    marginTop: 16,
    marginBottom: 4,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: Colors.secondaryBackgroundColor,
  },
  tabActive: {
    backgroundColor: Colors.green,
  },
  tabText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: Colors.ash,
  },
  tabTextActive: {
    color: Colors.dark,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 14,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 10,
  },
  infoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  infoLabel: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 14,
  },
  infoValue: {
    color: Colors.text,
    fontFamily: Fonts.medium,
    fontSize: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  halfCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  colHeaderBid: {
    color: Colors.green,
    fontFamily: Fonts.bold,
    fontSize: 14,
  },
  colHeaderAsk: {
    color: Colors.red,
    fontFamily: Fonts.bold,
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.secondaryBackgroundColor,
  },
  bidPrice: {
    flex: 1,
    color: Colors.green,
    fontFamily: Fonts.regular,
    fontSize: 13,
  },
  askPrice: {
    flex: 1,
    color: Colors.red,
    fontFamily: Fonts.regular,
    fontSize: 13,
  },
  rowAmount: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 13,
    textAlign: 'right',
  },
  tradeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 16,
    gap: 12,
  },
  tradeSide: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    width: 32,
  },
  tradeBuy: {
    color: Colors.green,
  },
  tradeSell: {
    color: Colors.red,
  },
  tradePrice: {
    flex: 1,
    color: Colors.text,
    fontFamily: Fonts.medium,
    fontSize: 14,
  },
  tradeAmount: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 13,
    textAlign: 'right',
  },
  tradeTotal: {
    color: Colors.ash,
    fontFamily: Fonts.regular,
    fontSize: 13,
    textAlign: 'right',
    minWidth: 60,
  },
  footer: {
    paddingHorizontal: 12,
    paddingBottom: 24,
    paddingTop: 12,
  },
  tradeBtn: {
    backgroundColor: Colors.green,
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: 'center',
  },
  tradeBtnText: {
    color: Colors.dark,
    fontFamily: Fonts.medium,
    fontSize: 16,
  },
});
