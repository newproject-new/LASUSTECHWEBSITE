/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fff5f5',
          100: '#ffebeb',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#8b0000',
          900: '#6b0f0f',
          950: '#450a0a',
        },
        navy: {
          900: '#1a1a2e',
          800: '#1c1c3a',
          700: '#252550',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounceSlow 2s infinite',
        'pulse-dot':   'pulseDot 1.5s ease-in-out infinite',
        'slide-up':    'slideUp 0.5s ease forwards',
        'fade-in':     'fadeIn 0.3s ease forwards',
        'count-up':    'countUp 2s ease-out forwards',
      },
      keyframes: {
        bounceSlow: {
          '0%, 100%': { transform: 'translateY(0)', opacity: 1 },
          '50%':       { transform: 'translateY(6px)', opacity: 0.6 },
        },
        pulseDot: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(239,68,68,0.6)' },
          '50%':       { boxShadow: '0 0 0 8px rgba(239,68,68,0)' },
        },
        slideUp: {
          from: { transform: 'translateY(100%)', opacity: 0 },
          to:   { transform: 'translateY(0)',    opacity: 1 },
        },
        fadeIn: {
          from: { opacity: 0 },
          to:   { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
