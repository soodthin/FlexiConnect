/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Bật dark mode sử dụng class 'dark'
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        // Màu be (beige) chủ đạo
        beige: {
          light: '#f7f6f3',    // Sáng, dùng nền phụ
          DEFAULT: '#f5efe6',  // Chủ đạo
          dark: '#e6e1d3',     // Đậm hơn
        },

        // Xám tùy chỉnh (tone riêng)
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

        // Các sắc thái đen
        black: '#0f0f0f',
        offblack: '#111111',
        softblack: '#222222',

        // Trắng bổ sung
        offwhite: '#fafafa',
        white: '#ffffff',
      },
    },
  },
  plugins: [],
};