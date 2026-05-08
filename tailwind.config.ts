/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'esport': {
          'green': '#0a3d2f',
          'green-light': '#0d4f3c',
          'green-dark': '#062a1f',
          'accent': '#00e676',
          'accent-dim': '#00c853',
          'neon': '#00ff88',
          'gold': '#ffd700',
          'surface': 'rgba(10, 61, 47, 0.6)',
          'surface-solid': '#0a3d2f',
        },
        'rarity': {
          'common': '#b0b0b0',
          'rare': '#4a9eff',
          'epic': '#b44aff',
          'legendary': '#ffaa00',
          'unique': '#ff4444',
        }
      },
      fontFamily: {
        'display': ['Orbitron', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'card-reveal': 'cardReveal 0.6s ease-out forwards',
        'pack-open': 'packOpen 0.8s ease-out forwards',
        'pulse-neon': 'pulseNeon 1.5s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #00e67640, 0 0 20px #00e67620' },
          '100%': { boxShadow: '0 0 10px #00e67660, 0 0 40px #00e67630' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        cardReveal: {
          '0%': { transform: 'rotateY(90deg) scale(0.8)', opacity: '0' },
          '60%': { transform: 'rotateY(0deg) scale(1.05)', opacity: '1' },
          '100%': { transform: 'rotateY(0deg) scale(1)', opacity: '1' },
        },
        packOpen: {
          '0%': { transform: 'scale(1) rotate(0deg)' },
          '30%': { transform: 'scale(1.2) rotate(-5deg)' },
          '60%': { transform: 'scale(0.9) rotate(3deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)' },
        },
        pulseNeon: {
          '0%, 100%': { textShadow: '0 0 5px #00e67680, 0 0 10px #00e67640' },
          '50%': { textShadow: '0 0 10px #00e676, 0 0 30px #00e67680, 0 0 60px #00e67640' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
};
