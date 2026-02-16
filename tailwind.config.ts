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
        // Sky Blue Premium Palette
        'fresh-sky': {
          50: '#e5f6ff',
          100: '#cceeff',
          200: '#99ddff',
          300: '#66ccff',
          400: '#33bbff',
          500: '#00aaff',
          600: '#0088cc',
          700: '#006699',
          800: '#004466',
          900: '#002233',
          950: '#001824',
        },
        'steel-blue': {
          50: '#e6f5fe',
          100: '#cdecfe',
          200: '#9cd9fc',
          300: '#6ac6fb',
          400: '#38b3fa',
          500: '#06a0f9',
          600: '#0580c7',
          700: '#046095',
          800: '#034063',
          900: '#012032',
          950: '#011623',
        },
        'baltic-blue': {
          50: '#e5f7ff',
          100: '#ccefff',
          200: '#99dfff',
          300: '#66cfff',
          400: '#33beff',
          500: '#00aeff',
          600: '#008bcc',
          700: '#006999',
          800: '#004666',
          900: '#002333',
          950: '#001824',
        },
        'deep-space-blue': {
          50: '#e5f6ff',
          100: '#ccecff',
          200: '#99daff',
          300: '#66c7ff',
          400: '#33b4ff',
          500: '#00a1ff',
          600: '#0081cc',
          700: '#006199',
          800: '#004166',
          900: '#002033',
          950: '#001724',
        },
        'ink-black': {
          50: '#e9f5fc',
          100: '#d2ecf9',
          200: '#a6d9f2',
          300: '#79c6ec',
          400: '#4cb2e6',
          500: '#209fdf',
          600: '#197fb3',
          700: '#136086',
          800: '#0d4059',
          900: '#06202d',
          950: '#04161f',
        },
        // Legacy aliases (for compatibility)
        matrix: {
          black: '#04161f',           // Ink Black-950
          'black-light': '#06202d',   // Ink Black-900
          green: '#00aaff',           // Fresh Sky-500
          'green-dark': '#0088cc',    // Fresh Sky-600
          'green-light': '#33bbff',   // Fresh Sky-400
          'green-glow': '#00aaff33',  // Fresh Sky-500 alpha
          'green-dim': '#001824',     // Fresh Sky-950
          'green-neon': '#06a0f9',    // Steel Blue-500
          gray: {
            50: '#e5f6ff',   // Fresh Sky-50
            100: '#cceeff',  // Fresh Sky-100
            200: '#99ddff',  // Fresh Sky-200
            300: '#66ccff',  // Fresh Sky-300
            400: '#33bbff',  // Fresh Sky-400
            500: '#0088cc',  // Fresh Sky-600
            600: '#006699',  // Fresh Sky-700
            700: '#004466',  // Fresh Sky-800
            800: '#002233',  // Fresh Sky-900
            900: '#001824',  // Fresh Sky-950
          }
        },
        primary: {
          DEFAULT: '#00aaff',  // Fresh Sky-500
          dark: '#0088cc',     // Fresh Sky-600
          light: '#33bbff',    // Fresh Sky-400
        },
        dark: {
          bg: '#04161f',       // Ink Black-950
          card: '#06202d',     // Ink Black-900
          border: '#0d4059',   // Ink Black-800
        }
      },
      fontFamily: {
        sans: ['"Clash Display"', '"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', '"Consolas"', 'monospace'],
        clash: ['"Clash Display"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      borderRadius: {
        'none': '0',
        'sm': '0.25rem',      // 4px
        DEFAULT: '0.5rem',    // 8px
        'md': '0.75rem',      // 12px
        'lg': '1rem',         // 16px
        'xl': '1.5rem',       // 24px
        '2xl': '2rem',        // 32px
        'full': '9999px',
      },
      animation: {
        // Modern, smooth animations
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'slide-down': 'slideDown 0.8s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
        'gradient': 'gradient 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        
        // Modernized Matrix effects
        'glitch': 'glitch 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite',
        'matrix-flow': 'matrixFlow 3s linear infinite',
        'waveform': 'waveform 1.5s ease-in-out infinite',
        'blink': 'blink 1.2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glowPulse: {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(0, 170, 255, 0.3), 0 0 40px rgba(0, 170, 255, 0.1)',
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(0, 170, 255, 0.5), 0 0 60px rgba(0, 170, 255, 0.2)',
          },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        // Modernized Matrix glitch effect
        glitch: {
          '0%, 100%': { 
            transform: 'translate(0)',
            filter: 'hue-rotate(0deg)',
          },
          '33%': { 
            transform: 'translate(-2px, 2px)',
            filter: 'hue-rotate(90deg)',
          },
          '66%': { 
            transform: 'translate(2px, -2px)',
            filter: 'hue-rotate(-90deg)',
          },
        },
        matrixFlow: {
          '0%': { 
            backgroundPosition: '0% 0%',
          },
          '100%': { 
            backgroundPosition: '100% 100%',
          },
        },
        waveform: {
          '0%, 100%': { transform: 'scaleY(0.5)' },
          '50%': { transform: 'scaleY(1)' },
        },
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0.4' },
        },
      },
      boxShadow: {
        // Premium shadows - Fresh Sky glows
        'glow': '0 0 30px rgba(0, 170, 255, 0.15)',
        'glow-strong': '0 0 40px rgba(0, 170, 255, 0.25)',
        'card': '0 8px 32px rgba(4, 22, 31, 0.8)',
        'card-hover': '0 12px 48px rgba(4, 22, 31, 0.9), 0 0 60px rgba(0, 170, 255, 0.1)',
        'neon': '0 0 10px rgba(0, 170, 255, 0.3), 0 0 30px rgba(0, 170, 255, 0.15)',
        'inner-glow': 'inset 0 0 20px rgba(0, 170, 255, 0.05)',
        
        // Legacy support
        'glow-green': '0 0 5px rgba(0, 170, 255, 0.3), 0 0 10px rgba(0, 170, 255, 0.2)',
        'glow-green-strong': '0 0 5px rgba(0, 170, 255, 0.5), 0 0 10px rgba(0, 170, 255, 0.3)',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
        '3xl': '40px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-blue': 'linear-gradient(135deg, #04161f 0%, #011623 50%, #04161f 100%)',
        'shimmer-gradient': 'linear-gradient(90deg, transparent, rgba(0, 170, 255, 0.1), transparent)',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-soft': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    // Custom plugin for text shadow (modern implementation)
    function({ addUtilities }: any) {
      const textShadows = {
        '.text-glow': {
          textShadow: '0 0 10px rgba(0, 170, 255, 0.3), 0 0 20px rgba(0, 170, 255, 0.15)',
        },
        '.text-glow-strong': {
          textShadow: '0 0 10px rgba(0, 170, 255, 0.5), 0 0 20px rgba(0, 170, 255, 0.3), 0 0 30px rgba(0, 170, 255, 0.2)',
        },
        '.text-neon': {
          textShadow: '0 0 5px rgba(6, 160, 249, 0.5), 0 0 10px rgba(6, 160, 249, 0.3), 0 0 20px rgba(6, 160, 249, 0.15)',
        },
      }
      addUtilities(textShadows)
    },
  ],
}

export default config
