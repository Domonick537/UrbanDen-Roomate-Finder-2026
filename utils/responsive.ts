import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const isWeb = Platform.OS === 'web';

export const breakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
};

export const getDeviceType = () => {
  if (!isWeb) return 'mobile';
  if (width >= breakpoints.desktop) return 'desktop';
  if (width >= breakpoints.tablet) return 'tablet';
  return 'mobile';
};

export const isDesktop = () => isWeb && width >= breakpoints.desktop;
export const isTablet = () => isWeb && width >= breakpoints.tablet && width < breakpoints.desktop;
export const isMobile = () => !isWeb || width < breakpoints.tablet;

export const getMaxWidth = () => {
  const deviceType = getDeviceType();
  if (deviceType === 'desktop') return 1200;
  if (deviceType === 'tablet') return 900;
  return width;
};

export const getCardWidth = () => {
  const deviceType = getDeviceType();
  if (deviceType === 'desktop') return 480;
  if (deviceType === 'tablet') return 400;
  return width - 40;
};

export const getCardHeight = () => {
  const deviceType = getDeviceType();
  if (deviceType === 'desktop') return height * 0.75;
  if (deviceType === 'tablet') return height * 0.7;
  return height * 0.7;
};

export const responsiveValue = <T,>(mobile: T, tablet?: T, desktop?: T): T => {
  const deviceType = getDeviceType();
  if (deviceType === 'desktop' && desktop !== undefined) return desktop;
  if (deviceType === 'tablet' && tablet !== undefined) return tablet;
  return mobile;
};
