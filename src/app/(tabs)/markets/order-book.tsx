import AppBackground from '@/src/components/AppBackground';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { useFetchOrderBookQuery } from '@/src/store/api/marketApi';
import type { OrderBookLevel } from '@/src/types/market/types';
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

  const { data, isLoading, isError } = useFetchOrderBookQuery(
    { symbol: symbol ?? '', levels: 12 },
    { skip: !symbol }
  );

  if (!symbol) {
    return (
      <AppBackground>
        <View style={styles.center}>
          <Text style={styles.errorText}>Missing coin symbol.</Text>
        </View>
      </AppBackground>
    );
  }

  return (
    <AppBackground>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>‹</Text>
          </Pressable>
          <View style={styles.headerText}>
            <Text style={styles.title}>{symbol} order book</Text>
            <Text style={styles.subtitle}>
              Bid and ask levels for the trade screen.
            </Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabRow}>
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
        </View>

        {/* Content */}
        {activeTab === 'orderBook' ? (
          isLoading ? (
            <View style={styles.center}>
              <ActivityIndicator color={Colors.green} />
            </View>
          ) : isError || !data ? (
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
              {/* Mid price */}
              <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>Mid price</Text>
                <Text style={styles.infoValue}>
                  ${data.midPriceUsd.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Text>
              </View>

              {/* Spread */}
              <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>Spread</Text>
                <Text style={styles.infoValue}>
                  ${data.spreadUsd.toFixed(2)}
                </Text>
              </View>

              {/* Column headers */}
              <View style={styles.tableHeader}>
                <View style={styles.halfCol}>
                  <Text style={styles.colHeaderBid}>Bids</Text>
                </View>
                <View style={styles.halfCol}>
                  <Text style={styles.colHeaderAsk}>Asks</Text>
                </View>
              </View>

              {/* Bid / Ask rows */}
              {Array.from({
                length: Math.max(data.bids.length, data.asks.length),
              }).map((_, i) => (
                <BookRow
                  key={i}
                  bid={data.bids[i]}
                  ask={data.asks[i]}
                />
              ))}
            </ScrollView>
          )
        ) : (
          <View style={styles.center}>
            <Text style={styles.errorText}>Trades coming soon.</Text>
          </View>
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
      {/* Bid side */}
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

      {/* Ask side */}
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
    paddingHorizontal: 12,
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
