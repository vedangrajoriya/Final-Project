/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#131313',
        foreground: '#e2e2e2',
        surface: '#131313',
        'surface-dim': '#131313',
        'surface-bright': '#393939',
        'surface-container-lowest': '#0e0e0e',
        'surface-container-low': '#1b1b1b',
        'surface-container': '#1f1f1f',
        'surface-container-high': '#2a2a2a',
        'surface-container-highest': '#353535',
        primary: {
          DEFAULT: '#007AFF', // Electric Blue
          fixed: '#d8e2ff',
          dim: '#adc6ff',
        },
        secondary: {
          DEFAULT: '#BF5AF2', // Neon Purple
          fixed: '#f6d9ff',
          dim: '#e9b3ff',
        },
        tertiary: {
          DEFAULT: '#5AC8FA', // Cyan
          fixed: '#c1e8ff',
          dim: '#74d1ff',
        },
        muted: '#353535',
        'muted-foreground': '#c1c6d7',
        border: 'rgba(255, 255, 255, 0.08)',
        outline: '#8b90a0',
        'outline-variant': '#414755',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.02) 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
