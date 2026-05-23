/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        codex: {
          void: '#0a0d14',
          dark: '#12161f',
          surface: '#1a2030',
          border: '#2a3348',
          gold: '#c9a84c',
          goldLight: '#e8c96a',
          parchment: '#e8d9c0',
          parchmentDim: '#a89880',
          crimson: '#8b1a1a',
          crimsonLight: '#b52222',
          steel: '#2d5a8e',
          steelLight: '#4a7ab5',
          jade: '#1a5c3a',
          jadeLight: '#2a8a58',
        },
      },
      fontFamily: {
        display: ['"Cinzel"', 'serif'],
        body: ['"Crimson Pro"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
