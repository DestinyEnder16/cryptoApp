import type React from 'react';
import type { SvgProps } from 'react-native-svg';
import {
  HomeDeposit,
  HomeGridTrading,
  HomeLaunchPad,
  HomeLiguidSwap,
  HomeMargin,
  HomeMore,
  HomeReferal,
  HomeSavings,
} from './images';

interface CarouselItem {
  id: number;
  heading: string;
  info: string;
  img: number;
}

interface HomeIconItem {
  icon: React.FC<SvgProps>;
  text: string;
}

export const homeIcons: HomeIconItem[] = [
  { icon: HomeDeposit, text: 'Deposit' },
  { icon: HomeReferal, text: 'Referal' },
  { icon: HomeGridTrading, text: 'Grid Trading' },
  { icon: HomeMargin, text: 'Margin' },
  { icon: HomeLaunchPad, text: 'Launch Pad' },
  { icon: HomeSavings, text: 'Savings' },
  { icon: HomeLiguidSwap, text: 'Liguid Swap' },
  { icon: HomeMore, text: 'More' },
];

export const carouselData: CarouselItem[] = [
  {
    id: 0,
    heading: 'Trade anytime anywhere',
    info: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.',
    img: require('@/assets/images/onboarding1.png'),
  },
  {
    id: 1,
    heading: 'Save and invest at the same time',
    info: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.',
    img: require('@/assets/images/onboarding2.png'),
  },
  {
    id: 2,
    heading: 'Transact fast and easy',
    info: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.',
    img: require('@/assets/images/onboarding3.png'),
  },
];
