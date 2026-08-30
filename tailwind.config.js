/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#123B7A',
          dark: '#0B2545',
        },
        blue: {
          primary: '#1D5FA7',
          secondary: '#3B82C4',
          light: '#EAF4FB',
        },
        surface: {
          DEFAULT: '#F5F8FC',
          alt: '#FFFFFF',
        },
        ink: {
          DEFAULT: '#102A43',
          muted: '#52667A',
        },
        border: {
          DEFAULT: '#D8E2EC',
        },
        risk: {
          low: '#15803D',
          moderate: '#CA8A04',
          high: '#EA580C',
          critical: '#DC2626',
        },
        emergency: '#B91C1C',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        h1: ['3rem', { lineHeight: '1.15' }],
        h2: ['2rem', { lineHeight: '1.2' }],
        h3: ['1.375rem', { lineHeight: '1.3' }],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(11, 37, 69, 0.06), 0 4px 16px rgba(11, 37, 69, 0.06)',
        'card-hover': '0 2px 6px rgba(11, 37, 69, 0.1), 0 12px 32px rgba(11, 37, 69, 0.1)',
        focus: '0 0 0 3px rgba(29, 95, 167, 0.35)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          from: { opacity: '0', transform: 'translateX(-12px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 200ms ease-out',
        'slide-up': 'slide-up 250ms ease-out',
        'slide-in': 'slide-in 200ms ease-out',
      },
    },
  },
  plugins: [],
};
