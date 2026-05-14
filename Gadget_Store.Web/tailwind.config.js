/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#7C3AED',
          dark:    '#6D28D9',
          light:   '#8B5CF6',
          50:      '#F5F3FF',
        },
        accent: {
          DEFAULT: '#06B6D4',
          dark:    '#0891B2',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'gradient-x':    'gradient-x 8s ease infinite',
        'float':         'float 6s ease-in-out infinite',
        'float-slow':    'float 9s ease-in-out infinite',
        'fade-in-up':    'fade-in-up 0.7s ease-out both',
        'fade-in-up-d1': 'fade-in-up 0.7s ease-out 0.15s both',
        'fade-in-up-d2': 'fade-in-up 0.7s ease-out 0.3s both',
        'pulse-slow':    'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-14px)' },
        },
        'fade-in-up': {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
