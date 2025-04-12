/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        neon: {
          blue: '#00f7ff',
          purple: '#9d00ff',
          green: '#00ffa3',
          pink: '#ff00f7'
        },
        cyber: {
          black: '#0D0D0D',
          darker: '#1A1A1A',
          dark: '#262626',
          light: '#404040'
        },
        'cyber-black': '#0a0a0f',
        'cyber-dark': '#1a1a2e',
        'neon-blue': '#00f3ff',
        'neon-pink': '#ff00ff',
        'neon-green': '#00ff9f',
        'neon-purple': '#9d00ff',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-in-out',
        'bounce-slow': 'bounce 3s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%': { textShadow: '0 0 5px #00f3ff, 0 0 10px #00f3ff' },
          '100%': { textShadow: '0 0 10px #00f3ff, 0 0 20px #00f3ff, 0 0 30px #00f3ff' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      },
      boxShadow: {
        'message': '0 2px 4px rgba(0,0,0,0.1)',
        'message-hover': '0 4px 6px rgba(0,0,0,0.1)',
      },
      backgroundImage: {
        'cyber-grid': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
      }
    },
  },
  plugins: [],
} 
