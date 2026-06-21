import AppBackground from '@/src/components/AppBackground';
import Btn from '@/src/components/Btn';
import ScreenIntro from '@/src/components/ScreenIntro';
import WalletAssetRow from '@/src/components/wallet/WalletAssetRow';
import WalletNote from '@/src/components/wallet/WalletNote';
import { sandboxAssets } from '@/src/data/sandboxWallet';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

export default function DepositAssetScreen() {
  const [selected, setSelected] = useState(sandboxAssets[0].symbol);

  return (
    <AppBackground>
      <ScreenIntro
        title="Deposit"
        description="Choose the asset you want to fund in sandbox mode."
        hasBackBtn
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 30 }}
      >
        {sandboxAssets.map((asset) => (
          <WalletAssetRow
            key={asset.symbol}
            asset={asset}
            selectable
            selected={selected === asset.symbol}
            onPress={() => setSelected(asset.symbol)}
          />
        ))}

        <View style={{ marginTop: 8 }}>
          <WalletNote
            title="Sandbox only"
            message="Deposits create demo ledger entries for class exercises. Do not send real funds."
          />
        </View>
      </ScrollView>

      <Btn
        text={`Continue with ${selected}`}
        fontSize={13}
        action={() =>
          router.navigate(`/wallet/deposit/address?asset=${selected}`)
        }
      />
    </AppBackground>
  );
}
