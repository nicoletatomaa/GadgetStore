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
          DEFAULT: '#BDFF00',
          dark:    '#96CC00',
          light:   '#D4FF4D',
          50:      '#F2FFB3',
          900:     '#1A2600',
        },
        accent: {
          DEFAULT: '#00D4FF',
          dark:    '#00AECF',
        },
        ink: {
          DEFAULT: '#111111',
          muted:   '#3D3B36',
          faint:   '#8A8578',
        },
        paper: {
          DEFAULT: '#F7F4EF',
          card:    '#FFFFFF',
          warm:    '#EDE8E0',
          border:  '#E8E3D8',
        },
        /* Tokeni folositi de admin pages si CategorySidebar */
        surface: {
          DEFAULT: '#FFFFFF',
          raised:  '#F7F4EF',
        },
        edge: '#E8E3D8',
      },
      fontFamily: {
        sans:    ['Barlow', 'system-ui', 'sans-serif'],
        display: ['"Barlow Condensed"', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'slide-up':    'slide-up 0.55s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-up-d1': 'slide-up 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.10s both',
        'slide-up-d2': 'slide-up 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.20s both',
        'slide-up-d3': 'slide-up 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.30s both',
        'pulse-slow':  'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
        /* kept for backward compat with pages that still reference old names */
        'fade-in-up':    'slide-up 0.55s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in-up-d1': 'slide-up 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.10s both',
        'fade-in-up-d2': 'slide-up 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.20s both',
      },
      keyframes: {
        'slide-up': {
          '0%':   { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
