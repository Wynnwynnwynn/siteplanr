/** @type {import('tailwindcss').Config} */

import { tokens } from './src/design/tokens.ts';

export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: tokens.colors.primary,
        secondary: tokens.colors.secondary,
        success: tokens.colors.success,
        warning: tokens.colors.warning,
        error: tokens.colors.error,
        info: tokens.colors.info,
        neutral: tokens.colors.neutral,
      },
      fontFamily: {
        sans: tokens.typography.fonts.primary,
        mono: tokens.typography.fonts.mono,
      },
      fontSize: {
        h1: [tokens.typography.sizes.h1.size, {
          fontWeight: tokens.typography.sizes.h1.weight,
          lineHeight: tokens.typography.sizes.h1.lineHeight,
          letterSpacing: tokens.typography.sizes.h1.letterSpacing,
        }],
        h2: [tokens.typography.sizes.h2.size, {
          fontWeight: tokens.typography.sizes.h2.weight,
          lineHeight: tokens.typography.sizes.h2.lineHeight,
          letterSpacing: tokens.typography.sizes.h2.letterSpacing,
        }],
        h3: [tokens.typography.sizes.h3.size, {
          fontWeight: tokens.typography.sizes.h3.weight,
          lineHeight: tokens.typography.sizes.h3.lineHeight,
          letterSpacing: tokens.typography.sizes.h3.letterSpacing,
        }],
        h4: [tokens.typography.sizes.h4.size, {
          fontWeight: tokens.typography.sizes.h4.weight,
          lineHeight: tokens.typography.sizes.h4.lineHeight,
          letterSpacing: tokens.typography.sizes.h4.letterSpacing,
        }],
        h5: [tokens.typography.sizes.h5.size, {
          fontWeight: tokens.typography.sizes.h5.weight,
          lineHeight: tokens.typography.sizes.h5.lineHeight,
          letterSpacing: tokens.typography.sizes.h5.letterSpacing,
        }],
        h6: [tokens.typography.sizes.h6.size, {
          fontWeight: tokens.typography.sizes.h6.weight,
          lineHeight: tokens.typography.sizes.h6.lineHeight,
          letterSpacing: tokens.typography.sizes.h6.letterSpacing,
        }],
        body_lg: [tokens.typography.sizes.body_lg.size, {
          fontWeight: tokens.typography.sizes.body_lg.weight,
          lineHeight: tokens.typography.sizes.body_lg.lineHeight,
          letterSpacing: tokens.typography.sizes.body_lg.letterSpacing,
        }],
        body_md: [tokens.typography.sizes.body_md.size, {
          fontWeight: tokens.typography.sizes.body_md.weight,
          lineHeight: tokens.typography.sizes.body_md.lineHeight,
          letterSpacing: tokens.typography.sizes.body_md.letterSpacing,
        }],
        body_sm: [tokens.typography.sizes.body_sm.size, {
          fontWeight: tokens.typography.sizes.body_sm.weight,
          lineHeight: tokens.typography.sizes.body_sm.lineHeight,
          letterSpacing: tokens.typography.sizes.body_sm.letterSpacing,
        }],
        label_lg: [tokens.typography.sizes.label_lg.size, {
          fontWeight: tokens.typography.sizes.label_lg.weight,
          lineHeight: tokens.typography.sizes.label_lg.lineHeight,
          letterSpacing: tokens.typography.sizes.label_lg.letterSpacing,
        }],
        label_md: [tokens.typography.sizes.label_md.size, {
          fontWeight: tokens.typography.sizes.label_md.weight,
          lineHeight: tokens.typography.sizes.label_md.lineHeight,
          letterSpacing: tokens.typography.sizes.label_md.letterSpacing,
        }],
        label_sm: [tokens.typography.sizes.label_sm.size, {
          fontWeight: tokens.typography.sizes.label_sm.weight,
          lineHeight: tokens.typography.sizes.label_sm.lineHeight,
          letterSpacing: tokens.typography.sizes.label_sm.letterSpacing,
        }],
        caption: [tokens.typography.sizes.caption.size, {
          fontWeight: tokens.typography.sizes.caption.weight,
          lineHeight: tokens.typography.sizes.caption.lineHeight,
          letterSpacing: tokens.typography.sizes.caption.letterSpacing,
        }],
        code: [tokens.typography.sizes.code.size, {
          fontWeight: tokens.typography.sizes.code.weight,
          lineHeight: tokens.typography.sizes.code.lineHeight,
          letterSpacing: tokens.typography.sizes.code.letterSpacing,
        }],
      },
      spacing: tokens.spacing,
      boxShadow: tokens.shadows,
      borderRadius: tokens.borderRadius,
      animation: {
        // Custom animations
        'fade-in': 'fadeIn 200ms ease-out',
        'fade-out': 'fadeOut 200ms ease-out',
        'scale-in': 'scaleIn 200ms ease-out',
        'slide-up': 'slideUp 300ms ease-out',
        'slide-down': 'slideDown 300ms ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      zIndex: tokens.zIndex,
      screens: tokens.breakpoints,
    },
  },
  darkMode: 'class',
  plugins: [],
};
