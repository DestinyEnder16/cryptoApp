import AppBackground from '@/src/components/AppBackground';
import Btn from '@/src/components/Btn';
import Loader from '@/src/components/Loader';
import MarketAssetView from '@/src/components/MarketAssetView';
import ScreenIntro from '@/src/components/ScreenIntro';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { useFetchWatchlistQuery } from '@/src/store/api/watchListApi';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const avatarColors = [Colors.orangeBrown, Colors.blue, Colors.green];

export default function WatchList() {
  const { data, isLoading } = useFetchWatchlistQuery();

  const assets = data?.data ?? [];

  const goToMarkets = () => router.navigate('/(tabs)/markets');

  return (
    <AppBackground>
      <View style={styles.container}>
        <ScreenIntro
          title="Watchlist"
          description="Assets you follow with row sparklines."
          hasBackBtn
        />

        {isLoading ? (
          <Loader />
        ) : (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {assets.map((asset, index) => (
              <MarketAssetView
                key={asset.id}
                coin={asset.symbol}
                color={avatarColors[index % avatarColors.length]}
              />
            ))}

            <View style={styles.addCard}>
              <Text style={styles.addTitle}>Add more assets</Text>
              <Text style={styles.addBody}>
                Use the market list to add coins to your watchlist.
              </Text>
            </View>
          </ScrollView>
        )}

        <View style={styles.footer}>
          <Btn text="Explore markets" action={goToMarkets} />
        </View>
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 30,
  },
  scroll: {
    flex: 1,
    marginTop: 24,
  },
  scrollContent: {
    gap: 10,
    paddingBottom: 16,
  },
  addCard: {
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginTop: 14,
    gap: 10,
  },
  addTitle: {
    fontFamily: Fonts.bold,
    color: Colors.text,
    fontSize: 16,
  },
  addBody: {
    fontFamily: Fonts.regular,
    color: Colors.ash,
    fontSize: 13,
    lineHeight: 18,
  },
  footer: {
    paddingTop: 16,
    paddingBottom: 16,
  },
});
