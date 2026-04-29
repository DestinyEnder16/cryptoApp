interface CarouselItem {
  id: number;
  heading: string;
  info: string;
  img: number;
}

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
