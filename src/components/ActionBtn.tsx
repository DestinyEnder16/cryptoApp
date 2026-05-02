import { ReactNode } from 'react';
import { Pressable, StyleProp, Text, ViewStyle } from 'react-native';
import { Fonts } from '../constants/fonts';

interface ActionBtnProps {
  styles: { backgroundColor: string; txtColor: string };
  text: string;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
  action?: () => void;
}

export default function ActionBtn({
  styles,
  text,
  icon: Icon,
  style,
  action,
}: ActionBtnProps) {
  return (
    <Pressable
      style={[
        {
          backgroundColor: styles.backgroundColor,
          borderRadius: 16,
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 15,
          justifyContent: 'center',
          gap: 10,
        },
        style,
      ]}
      onPress={action}
    >
      {Icon}
      <Text
        style={{
          color: styles.txtColor,
          fontFamily: Fonts.regular,
          fontSize: 18,
        }}
      >
        {text}
      </Text>
    </Pressable>
  );
}
