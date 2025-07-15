/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        // Màu be (beige)
        beige: {
          light: '#f5f5dc',
          DEFAULT: '#e6e1d3',
          dark: '#d8d3c3',
        },

        // Xám tùy chỉnh nếu muốn tone riêng
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },

        // Đen tinh chỉnh
        black: '#0f0f0f',
        offblack: '#111111',
        softblack: '#1c1c1c',

        // Trắng bổ sung
        offwhite: '#fafafa',
      },
    },
  },
  plugins: [],
};
