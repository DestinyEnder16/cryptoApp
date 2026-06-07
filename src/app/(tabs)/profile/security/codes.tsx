import AppBackground from '@/src/components/AppBackground';
import ScreenIntro from '@/src/components/ScreenIntro';
import { Fonts } from '@/src/constants/fonts';
import { Colors } from '@/src/constants/styles';
import { usePadding } from '@/src/hooks/usePadding';
import { useEnableTwoFactorMutation } from '@/src/store/api/authApi';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function Codes() {
  const paddingTop = usePadding();
  const [, { data }] = useEnableTwoFactorMutation({
    fixedCacheKey: 'enable-2fa',
  });

  const codes = data?.recoveryCodes ?? [];

  return (
    <AppBackground>
      <View style={{ paddingTop, paddingHorizontal: 20, flex: 1 }}>
        <ScreenIntro
          title="Recovery codes"
          description="Save these once. Each code can only be used one time."
        />

        <View style={styles.grid}>
          {codes.length === 0 ? (
            <Text style={styles.empty}>No recovery codes available.</Text>
          ) : (
            codes.map((code) => (
              <View key={code} style={styles.codeBox}>
                <Text style={styles.codeText}>{code}</Text>
              </View>
            ))
          )}
        </View>

        <View style={{ flex: 1 }} />

        <Pressable style={styles.regenBtn}>
          <Text style={styles.regenBtnText}>Regenerate codes</Text>
        </Pressable>
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 30,
  },
  codeBox: {
    width: '48%',
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  codeText: {
    color: Colors.text,
    fontFamily: Fonts.medium,
    fontSize: 14,
    letterSpacing: 1,
  },
  empty: {
    color: Colors.grey,
    fontFamily: Fonts.regular,
  },
  regenBtn: {
    backgroundColor: Colors.secondaryBackgroundColor,
    borderRadius: 14,
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 30,
  },
  regenBtnText: {
    color: Colors.text,
    fontFamily: Fonts.medium,
    fontSize: 15,
  },
});
