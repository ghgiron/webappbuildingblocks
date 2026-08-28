/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bogota: {
          red: '#CC0E35',
          'red-dark': '#99001B',
          'red-deep': '#8A0A15',
          'red-light': '#FDF2F4',
          yellow: '#FAB62D',
          'yellow-dark': '#E5A218',
          'yellow-light': '#FEF7E6',
          blue: '#3366CC',
          green: '#1B7A2E',
          black: '#333333',
          dark: '#111111',
          gray: '#F8F9FA',
        }
      },
      fontFamily: {
        sans: ['"Work Sans"', 'sans-serif'],
        title: ['Montserrat', 'sans-serif'],
        body: ['"Work Sans"', 'sans-serif'],
      },
      borderRadius: {
        'bogota': '15px',
      },
      boxShadow: {
        'kiosk-card': '0 10px 25px -5px rgba(0, 0, 0, 0.06), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
        'kiosk-glow': '0 0 25px rgba(250, 182, 45, 0.65)',
        'kiosk-red-glow': '0 0 25px rgba(204, 14, 53, 0.35)',
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounceSubtle 2s infinite ease-in-out',
        'float': 'float 3s ease-in-out infinite',
        'beam': 'beamFlow 2s linear infinite',
      },
      keyframes: {
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        beamFlow: {
          '0%': { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        }
      }
    },
  },
  plugins: [],
}
