import AppBackground from '@/src/components/AppBackground';
import Btn from '@/src/components/Btn';
import ScreenIntro from '@/src/components/ScreenIntro';
import WalletAssetRow from '@/src/components/wallet/WalletAssetRow';
import WalletNote from '@/src/components/wallet/WalletNote';
import { Colors } from '@/src/constants/styles';
import { useGetDepositAddressesQuery } from '@/src/store/api/walletApi';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';

export default function DepositAssetScreen() {
  const { data: addresses, isLoading } = useGetDepositAddressesQuery();
  const [selected, setSelected] = useState<string | null>(null);

  // Default to the first asset once the list loads.
  const active = selected ?? addresses?.[0]?.assetSymbol ?? null;

  return (
    <AppBackground>
      <ScreenIntro
        title="Deposit"
        description="Choose the asset you want to fund in sandbox mode."
        hasBackBtn
      />

      {isLoading ? (
        <ActivityIndicator
          color={Colors.green}
          style={{ marginTop: 60 }}
          size="large"
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 20, paddingBottom: 30 }}
        >
          {addresses?.map((addr) => (
            <WalletAssetRow
              key={addr.assetSymbol}
              symbol={addr.assetSymbol}
              title={addr.assetSymbol}
              subtitle={addr.network}
              selectable
              selected={active === addr.assetSymbol}
              onPress={() => setSelected(addr.assetSymbol)}
            />
          ))}

          <View style={{ marginTop: 8 }}>
            <WalletNote
              title="Sandbox only"
              message="Deposits create demo ledger entries for class exercises. Do not send real funds."
            />
          </View>
        </ScrollView>
      )}

      {!!active && (
        <Btn
          text={`Continue with ${active}`}
          fontSize={13}
          action={() => router.navigate(`/wallet/deposit/address?asset=${active}`)}
        />
      )}
    </AppBackground>
  );
}
