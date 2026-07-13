import type React from 'react';
import type { SvgProps } from 'react-native-svg';
import {
  HomeDeposit,
  HomeGridTrading,
  HomeLaunchPad,
  HomeLiguidSwap,
  HomeMargin,
  HomeMenuConvert,
  HomeMenuCryptoLoans,
  HomeMenuEth,
  HomeMenuOrder,
  HomeMenuPay,
  HomeMenuPool,
  HomeMenuSpot,
  HomeMenuStaking,
  HomeMenuTransfer,
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

export interface HomeIconItem {
  icon: React.FC<SvgProps>;
  text: string;
}

export interface HomeMenuSection {
  title: string;
  items: HomeIconItem[];
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

export const homeMenu: HomeMenuSection[] = [
  {
    title: 'Common',
    items: [
      { icon: HomeMenuTransfer, text: 'Transfer' },
      { icon: HomeDeposit, text: 'Deposit' },
      { icon: HomeMenuOrder, text: 'Orders' },
      { icon: HomeReferal, text: 'Referral' },
    ],
  },
  {
    title: 'Trade',
    items: [
      { icon: HomeMenuConvert, text: 'Convert' },
      { icon: HomeMenuSpot, text: 'Spot' },
      { icon: HomeMargin, text: 'Margin' },
      { icon: HomeGridTrading, text: 'Grid Trading' },
      { icon: HomeLiguidSwap, text: 'Liquid Swap' },
    ],
  },
  {
    title: 'Finance',
    items: [
      { icon: HomeSavings, text: 'Savings' },
      { icon: HomeMenuStaking, text: 'Staking' },
      { icon: HomeMenuPay, text: 'Pay' },
      { icon: HomeMenuCryptoLoans, text: 'Crypto Loans' },
      { icon: HomeMenuPool, text: 'Pool' },
      { icon: HomeMenuEth, text: 'ETH 2.0' },
      { icon: HomeLaunchPad, text: 'Launchpad' },
    ],
  },
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
