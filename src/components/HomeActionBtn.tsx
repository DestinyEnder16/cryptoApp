import { Pressable, Text } from 'react-native';
import { SvgProps } from 'react-native-svg';

interface BtnProps {
  title: string;
  icon: React.FC<SvgProps>;
}

export default function HomeActionBtn({ title, icon: Icon }: BtnProps) {
  return (
    <Pressable>
      <Text>{title}</Text>
      <Icon />
    </Pressable>
  );
}
