/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          dark: '#031a10',
          base: '#062e1e',
          surface: '#0d472c',
          border: '#166534',
          accent: '#10b981',
          glow: '#34d399',
          gold: '#fbbf24',
          wood: '#2d1808'
        },
        samurai: {
          dark: '#08080a',
          base: '#111115',
          surface: '#181820',
          border: '#3f1519',
          crimson: '#dc2626',
          blood: '#991b1b',
          gold: '#f59e0b',
          sakura: '#f472b6',
          ink: '#030304'
        },
        city: {
          dark: '#050b14',
          base: '#0a192f',
          surface: '#112240',
          border: '#1e3a5f',
          cyan: '#00f2fe',
          amber: '#f59e0b',
          hazard: '#eab308',
          steel: '#334155'
        }
      },
      fontFamily: {
        forest: ['Cinzel', 'serif'],
        samurai: ['"Noto Serif JP"', 'serif'],
        city: ['"Space Grotesk"', 'monospace'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'slash': 'slash 0.3s ease-out forwards',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        slash: {
          '0%': { opacity: '0', transform: 'scaleX(0) rotate(-25deg)' },
          '50%': { opacity: '1', transform: 'scaleX(1) rotate(-25deg)' },
          '100%': { opacity: '0', transform: 'scaleX(1.2) rotate(-25deg) translateX(40px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
