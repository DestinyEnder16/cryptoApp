import AppBackground from '@/src/components/AppBackground';
import ScreenIntro from '@/src/components/ScreenIntro';

export default function Trades() {
  return (
    <AppBackground>
      <ScreenIntro
        title="Trade"
        description="Buy, sell, or swap with quotes that expire before execution."
      />
    </AppBackground>
  );
}
