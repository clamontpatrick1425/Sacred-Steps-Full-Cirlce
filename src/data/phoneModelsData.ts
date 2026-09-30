/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Phone Preview Specifications & Device Profiles
 * Supports authentic dimensions, camera cutouts, status bars, and chassis styling
 */

export interface PhoneColorway {
  name: string;
  hex: string;
  chassisClass: string;
  borderHex: string;
}

export type CutoutType = 'dynamic_island' | 'punch_hole' | 'classic_notch' | 'forehead_chin';

export interface PhoneModel {
  id: string;
  name: string;
  brand: 'Apple' | 'Samsung' | 'Google';
  os: 'iOS' | 'Android';
  screenDiagonal: string;
  resolutionLabel: string;
  viewportWidth: number;
  viewportHeight: number;
  borderRadius: number; // outer chassis border radius (px)
  innerRadius: number; // screen inner border radius (px)
  cutoutType: CutoutType;
  cutoutWidth?: number; // px
  cutoutHeight?: number; // px
  hasTouchIdButton?: boolean;
  colorways: PhoneColorway[];
}

export const PHONE_MODELS: PhoneModel[] = [
  {
    id: 'iphone-16-pro-max',
    name: 'iPhone 16 Pro Max',
    brand: 'Apple',
    os: 'iOS',
    screenDiagonal: '6.9"',
    resolutionLabel: '430 × 932 pt',
    viewportWidth: 430,
    viewportHeight: 932,
    borderRadius: 56,
    innerRadius: 46,
    cutoutType: 'dynamic_island',
    cutoutWidth: 124,
    cutoutHeight: 35,
    colorways: [
      { name: 'Natural Titanium', hex: '#3b3836', chassisClass: 'bg-[#3b3836]', borderHex: '#4f4b48' },
      { name: 'Black Titanium', hex: '#1c1b1a', chassisClass: 'bg-[#1c1b1a]', borderHex: '#2e2c2b' },
      { name: 'White Titanium', hex: '#e8e6e3', chassisClass: 'bg-[#e8e6e3]', borderHex: '#ffffff' },
      { name: 'Desert Titanium', hex: '#44372c', chassisClass: 'bg-[#44372c]', borderHex: '#5e4d3f' }
    ]
  },
  {
    id: 'iphone-16-pro',
    name: 'iPhone 16 / 15 Pro',
    brand: 'Apple',
    os: 'iOS',
    screenDiagonal: '6.3"',
    resolutionLabel: '393 × 852 pt',
    viewportWidth: 393,
    viewportHeight: 852,
    borderRadius: 52,
    innerRadius: 44,
    cutoutType: 'dynamic_island',
    cutoutWidth: 120,
    cutoutHeight: 34,
    colorways: [
      { name: 'Natural Titanium', hex: '#383533', chassisClass: 'bg-[#383533]', borderHex: '#4d4946' },
      { name: 'Deep Blue', hex: '#1e2838', chassisClass: 'bg-[#1e2838]', borderHex: '#2c3c54' },
      { name: 'Black Titanium', hex: '#181716', chassisClass: 'bg-[#181716]', borderHex: '#292726' },
      { name: 'White Titanium', hex: '#eceae5', chassisClass: 'bg-[#eceae5]', borderHex: '#fcfbfa' }
    ]
  },
  {
    id: 'samsung-s24-ultra',
    name: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    os: 'Android',
    screenDiagonal: '6.8"',
    resolutionLabel: '412 × 915 pt',
    viewportWidth: 412,
    viewportHeight: 915,
    borderRadius: 24, // Sharp, boxy signature corners
    innerRadius: 18,
    cutoutType: 'punch_hole',
    cutoutWidth: 13,
    cutoutHeight: 13,
    colorways: [
      { name: 'Titanium Gray', hex: '#313338', chassisClass: 'bg-[#313338]', borderHex: '#45484f' },
      { name: 'Titanium Black', hex: '#1c1c1f', chassisClass: 'bg-[#1c1c1f]', borderHex: '#2a2a2f' },
      { name: 'Titanium Violet', hex: '#2f2838', chassisClass: 'bg-[#2f2838]', borderHex: '#453a54' },
      { name: 'Titanium Yellow', hex: '#403b2c', chassisClass: 'bg-[#403b2c]', borderHex: '#5c543d' }
    ]
  },
  {
    id: 'google-pixel-9-pro',
    name: 'Google Pixel 9 Pro',
    brand: 'Google',
    os: 'Android',
    screenDiagonal: '6.3"',
    resolutionLabel: '412 × 892 pt',
    viewportWidth: 412,
    viewportHeight: 892,
    borderRadius: 44,
    innerRadius: 36,
    cutoutType: 'punch_hole',
    cutoutWidth: 14,
    cutoutHeight: 14,
    colorways: [
      { name: 'Obsidian', hex: '#1e1f21', chassisClass: 'bg-[#1e1f21]', borderHex: '#2f3033' },
      { name: 'Porcelain', hex: '#e8e7e1', chassisClass: 'bg-[#e8e7e1]', borderHex: '#f7f6f2' },
      { name: 'Hazel', hex: '#2b342f', chassisClass: 'bg-[#2b342f]', borderHex: '#3c4a42' },
      { name: 'Rose Quartz', hex: '#453538', chassisClass: 'bg-[#453538]', borderHex: '#5e484c' }
    ]
  },
  {
    id: 'iphone-14-classic',
    name: 'iPhone 14 / 13 (Classic Notch)',
    brand: 'Apple',
    os: 'iOS',
    screenDiagonal: '6.1"',
    resolutionLabel: '390 × 844 pt',
    viewportWidth: 390,
    viewportHeight: 844,
    borderRadius: 48,
    innerRadius: 40,
    cutoutType: 'classic_notch',
    cutoutWidth: 140,
    cutoutHeight: 28,
    colorways: [
      { name: 'Midnight', hex: '#1b2028', chassisClass: 'bg-[#1b2028]', borderHex: '#293240' },
      { name: 'Starlight', hex: '#eae7df', chassisClass: 'bg-[#eae7df]', borderHex: '#fbf9f5' },
      { name: 'Blue', hex: '#23384f', chassisClass: 'bg-[#23384f]', borderHex: '#324f6e' },
      { name: 'PRODUCT(RED)', hex: '#5c1619', chassisClass: 'bg-[#5c1619]', borderHex: '#7a1d22' }
    ]
  },
  {
    id: 'iphone-se-touchid',
    name: 'iPhone SE (Touch ID Classic)',
    brand: 'Apple',
    os: 'iOS',
    screenDiagonal: '4.7"',
    resolutionLabel: '375 × 667 pt',
    viewportWidth: 375,
    viewportHeight: 667,
    borderRadius: 40,
    innerRadius: 0, // Traditional square screen inset
    cutoutType: 'forehead_chin',
    hasTouchIdButton: true,
    colorways: [
      { name: 'Midnight', hex: '#191b1d', chassisClass: 'bg-[#191b1d]', borderHex: '#2d3033' },
      { name: 'Starlight', hex: '#ece9e2', chassisClass: 'bg-[#ece9e2]', borderHex: '#faf8f4' },
      { name: 'PRODUCT(RED)', hex: '#631419', chassisClass: 'bg-[#631419]', borderHex: '#801a21' }
    ]
  }
];

export const DEFAULT_PHONE_ID = 'iphone-16-pro';
