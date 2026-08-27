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
          red: '#D31424',
          'red-dark': '#B3001B',
          'red-deep': '#8A0A15',
          'red-light': '#FFF1F2',
          yellow: '#FDC300',
          'yellow-dark': '#E5AB00',
          'yellow-light': '#FEF9C3',
          navy: '#0F172A',
          dark: '#1F2937',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'kiosk-card': '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
        'kiosk-glow': '0 0 35px rgba(253, 195, 0, 0.65)',
        'kiosk-red-glow': '0 0 35px rgba(211, 20, 36, 0.45)',
        'lego-stud': 'inset 0 1px 2px rgba(255, 255, 255, 0.35), 0 2px 4px rgba(0, 0, 0, 0.25)',
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
