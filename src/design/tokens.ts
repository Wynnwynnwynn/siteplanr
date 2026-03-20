/**
 * SitePlanr Design Tokens
 * Modus Design System - Color Palette, Typography, Spacing, and Shadows
 */

export const colors = {
  // Primary
  primary: {
    50: '#f0f4ff',
    100: '#e0e9ff',
    200: '#c2d5ff',
    300: '#93b2ff',
    400: '#5d86ff',
    500: '#3d5cff',
    600: '#2d3fe6',
    700: '#213dd1',
    800: '#1e31a8',
    900: '#1f2b87',
  },
  // Secondary
  secondary: {
    50: '#f3f4f6',
    100: '#e8eaed',
    200: '#d1d5db',
    300: '#b0b8c1',
    400: '#80898f',
    500: '#5a6268',
    600: '#495057',
    700: '#3c4347',
    800: '#2d3135',
    900: '#1f2124',
  },
  // Success
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#145231',
  },
  // Warning
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  // Error/Danger
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  // Info
  info: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#06b6d4',
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63',
  },
  // Neutral - Grayscale
  neutral: {
    0: '#ffffff',
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
    950: '#0a0a0a',
  },
};

export const typography = {
  fonts: {
    primary: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(', '),
    mono: ['Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'].join(
      ', '
    ),
  },
  sizes: {
    // Headings
    h1: { size: '32px', weight: 700, lineHeight: 1.25, letterSpacing: '-0.5px' },
    h2: { size: '28px', weight: 700, lineHeight: 1.3, letterSpacing: '-0.3px' },
    h3: { size: '24px', weight: 700, lineHeight: 1.33, letterSpacing: '0px' },
    h4: { size: '20px', weight: 700, lineHeight: 1.4, letterSpacing: '0px' },
    h5: { size: '18px', weight: 600, lineHeight: 1.5, letterSpacing: '0px' },
    h6: { size: '16px', weight: 600, lineHeight: 1.5, letterSpacing: '0px' },
    // Body
    body_lg: { size: '16px', weight: 400, lineHeight: 1.5, letterSpacing: '0px' },
    body_md: { size: '14px', weight: 400, lineHeight: 1.5, letterSpacing: '0px' },
    body_sm: { size: '12px', weight: 400, lineHeight: 1.5, letterSpacing: '0px' },
    // Label
    label_lg: { size: '16px', weight: 500, lineHeight: 1.5, letterSpacing: '0px' },
    label_md: { size: '14px', weight: 500, lineHeight: 1.5, letterSpacing: '0px' },
    label_sm: { size: '12px', weight: 500, lineHeight: 1.5, letterSpacing: '0px' },
    // Caption
    caption: { size: '12px', weight: 400, lineHeight: 1.4, letterSpacing: '0px' },
    // Code
    code: { size: '13px', weight: 500, lineHeight: 1.5, letterSpacing: '0px' },
  },
};

export const spacing = {
  // Base unit: 4px
  // Scale: 0, 2, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '28px',
  '4xl': '32px',
  '5xl': '36px',
  '6xl': '40px',
  '7xl': '44px',
  '8xl': '48px',
  '9xl': '52px',
  '10xl': '56px',
  '11xl': '60px',
  '12xl': '64px',
  '14xl': '72px',
  '16xl': '80px',
  '20xl': '96px',
};

export const shadows = {
  // Elevation-based shadow system
  none: 'none',
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
};

export const borderRadius = {
  none: '0px',
  sm: '2px',
  md: '4px',
  lg: '6px',
  xl: '8px',
  '2xl': '12px',
  '3xl': '16px',
  full: '9999px',
};

export const animations = {
  durations: {
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  timings: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    linear: 'linear',
  },
  transitions: {
    fast: '150ms ease',
    base: '200ms ease-out',
    slow: '300ms ease-in-out',
  },
};

export const breakpoints = {
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  backdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
};

// Dark Mode Color Overrides
export const colorsDark = {
  primary: {
    50: '#1f2b87',
    100: '#213dd1',
    200: '#2d3fe6',
    300: '#3d5cff',
    400: '#5d86ff',
    500: '#93b2ff',
    600: '#c2d5ff',
    700: '#e0e9ff',
    800: '#f0f4ff',
    900: '#f0f4ff',
  },
  neutral: {
    0: '#0a0a0a',
    50: '#212121',
    100: '#424242',
    200: '#616161',
    300: '#757575',
    400: '#9e9e9e',
    500: '#bdbdbd',
    600: '#e0e0e0',
    700: '#eeeeee',
    800: '#f5f5f5',
    900: '#fafafa',
    950: '#ffffff',
  },
};

export const tokens = {
  colors,
  colorsDark,
  typography,
  spacing,
  shadows,
  borderRadius,
  animations,
  breakpoints,
  zIndex,
};

export default tokens;
