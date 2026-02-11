import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Matrix Color Palette
        matrix: {
          black: '#0D0208',        // Deep black background
          green: '#00FF41',        // Iconic Matrix green
          'green-dark': '#008F11', // Dark green
          'green-light': '#00D632',// Light green accent
          'green-glow': '#CCFFCC', // Phosphor green for text
          'green-dim': '#003B00',  // Very dark green for borders
          terminal: '#00FF41',     // Terminal green
        },
        primary: {
          DEFAULT: '#00FF41',      // Matrix green
          dark: '#008F11',
          light: '#00D632',
        },
        dark: {
          bg: '#0D0208',          // Matrix black
          card: '#0A0F0D',        // Slightly lighter black with green tint
          border: '#003B00',      // Dark green border
        }
      },
      fontFamily: {
        mono: ['"Share Tech Mono"', '"Courier New"', 'monospace'],
        terminal: ['"VT323"', 'monospace'],
      },
      animation: {
        'waveform': 'waveform 1.5s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'glitch': 'glitch 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite',
        'flicker': 'flicker 0.15s infinite',
        'blink': 'blink 1s infinite',
        'matrix-flow': 'border-flow 3s linear infinite',
      },
      keyframes: {
        waveform: {
          '0%, 100%': { transform: 'scaleY(0.5)' },
          '50%': { transform: 'scaleY(1)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.98' },
        },
        blink: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
      },
      boxShadow: {
        'glow-green': '0 0 5px rgba(0, 255, 65, 0.5), 0 0 10px rgba(0, 255, 65, 0.3), 0 0 15px rgba(0, 255, 65, 0.2)',
        'glow-green-strong': '0 0 5px rgba(0, 255, 65, 0.8), 0 0 10px rgba(0, 255, 65, 0.6), 0 0 20px rgba(0, 255, 65, 0.4)',
      },
      textShadow: {
        'glow': '0 0 5px rgba(0, 255, 65, 0.5), 0 0 10px rgba(0, 255, 65, 0.3)',
        'glow-strong': '0 0 5px rgba(0, 255, 65, 0.8), 0 0 10px rgba(0, 255, 65, 0.6), 0 0 20px rgba(0, 255, 65, 0.4)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

export default config
