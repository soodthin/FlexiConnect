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
        // shadcn/ui CSS variable-based colors
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
          // Premium & AI Features (preserve existing)
          purple: {
            50: '#faf5ff',
            100: '#f3e8ff',
            500: '#a855f7',
            600: '#9333ea',
            700: '#7e22ce',
          },
          indigo: {
            50: '#eef2ff',
            100: '#e0e7ff',
            500: '#6366f1',
            600: '#4f46e5',
            700: '#4338ca',
          },
          amber: {
            50: '#fffbeb',
            100: '#fef3c7',
            500: '#f59e0b',
            600: '#d97706',
            700: '#b45309',
          },
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },

        // Primary Brand Colors - Harmonious Beige Palette
        beige: {
          50: '#fdfcfa',
          100: '#f7f6f3',
          200: '#f5efe6',
          300: '#e6e1d3',
          400: '#d4cec0',
          500: '#c2bbad',
          600: '#a39a8a',
          700: '#857c6e',
          800: '#635c52',
          900: '#4a4540',
        },

        // Neutral Grays - Enhanced for better harmony
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          150: '#ececec',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          850: '#1f1f1f',
          900: '#171717',
          950: '#0f0f0f',
        },

        // Dark Mode Specific Colors (flattened for Tailwind)
        'dark-bg-primary': '#181818',
        'dark-bg-secondary': '#232323',
        'dark-bg-tertiary': '#2a2a2a',
        'dark-bg-elevated': '#2d2d2d',
        'dark-border-primary': '#444444',
        'dark-border-secondary': '#3a3a3a',
        'dark-border-subtle': '#333333',
        'dark-text-primary': '#f5efe6',
        'dark-text-secondary': '#cccccc',
        'dark-text-tertiary': '#aaaaaa',
        'dark-text-muted': '#888888',

        // Semantic Colors - Status & Actions
        success: {
          DEFAULT: '#22c55e',
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        warning: {
          DEFAULT: '#eab308',
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
        },
        error: {
          DEFAULT: '#ef4444',
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        info: {
          DEFAULT: '#3b82f6',
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },

        // Legacy color names (for backward compatibility)
        black: '#0f0f0f',
        offblack: '#171717',
        softblack: '#262626',
        offwhite: '#fafafa',
        white: '#ffffff',
      },

      // Shadows with better harmony
      boxShadow: {
        'soft': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'soft-md': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'soft-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
        'soft-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
        'glow': '0 0 15px rgba(163, 154, 138, 0.15)',
        'glow-dark': '0 0 20px rgba(245, 239, 230, 0.1)',
      },

      // Border radius for consistency
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        'soft': '0.5rem',
        'card': '0.75rem',
        'dialog': '1rem',
        'pill': '9999px',
      },

      keyframes: {
        dropdown: {
          '0%': { opacity: '0', transform: 'translateY(-5px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        dropdown: 'dropdown 0.2s ease-out forwards',
        fadeIn: 'fadeIn 0.3s ease-out',
        slideUp: 'slideUp 0.3s ease-out',
        scaleIn: 'scaleIn 0.2s ease-out',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
