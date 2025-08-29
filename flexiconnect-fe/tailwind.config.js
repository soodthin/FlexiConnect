/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        beige: { light: '#f7f6f3', DEFAULT: '#f5efe6', dark: '#e6e1d3' },
        gray: {
          50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db',
          400: '#9ca3af', 500: '#6b7280', 600: '#4b5563', 700: '#374151',
          800: '#1f2937', 900: '#111827',
        },
        black: '#0f0f0f',
        offblack: '#111111',
        softblack: '#222222',
        offwhite: '#fafafa',
        white: '#ffffff',
      },
      keyframes: {
        dropdown: {
          '0%': { opacity: '0', transform: 'translateY(-5px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        dropdown: 'dropdown 0.2s ease-out forwards',
      },
    },
  },
  plugins: [],
};
