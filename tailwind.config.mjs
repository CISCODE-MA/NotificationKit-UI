import tailwindcssRtl from 'tailwindcss-rtl';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      zIndex: {
        60: '60',
        70: '70',
      },
    },
  },
  plugins: [tailwindcssRtl],
};
