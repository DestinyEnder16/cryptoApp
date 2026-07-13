import AppBackground from '@/src/shared/components/AppBackground';
import Btn from '@/src/shared/components/Btn';
import ScreenIntro from '@/src/shared/components/ScreenIntro';
import WalletAssetRow from '@/src/features/wallet/components/WalletAssetRow';
import WalletNote from '@/src/features/wallet/components/WalletNote';
import { Colors } from '@/src/shared/constants/styles';
import { useGetDepositAddressesQuery } from '@/src/features/wallet/store/walletApi';
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
