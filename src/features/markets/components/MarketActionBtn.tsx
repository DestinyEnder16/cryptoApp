import { Pressable, Text } from 'react-native';

interface BtnProps {
  text: string;
  action: () => void;
  backgroundColor: string;
  txtColor: string;
}

export default function MarketActionBtn({
  text,
  action,
  backgroundColor,
  txtColor,
}: BtnProps) {
  return (
    <Pressable
      onPress={action}
      style={{
        backgroundColor,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
      }}
    >
      <Text style={{ color: txtColor, fontSize: 10 }}>{text}</Text>
    </Pressable>
  );
}
