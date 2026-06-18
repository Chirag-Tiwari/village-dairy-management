import type { Config } from 'tailwindcss';

// "Emerald trust" theme: slate neutrals carry structure and chrome,
// emerald is reserved for primary actions, money/success states, and
// the brand accent. Muted blue is available for informational states
// only, so it never competes with emerald for attention.
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        info: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        devanagari: ['var(--font-noto-devanagari)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.6s infinite linear',
        'fade-in': 'fade-in 0.15s ease-out forwards',
        'spin-slow': 'spin 3s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
