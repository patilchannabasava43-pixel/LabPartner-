/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0B1120',
          dark: '#0F172A',
          card: '#1E293B',
          primary: '#4F46E5',
          indigo: '#6366F1',
          violet: '#8B5CF6',
          purple: '#A855F7',
          accent: '#EC4899',
          surface: '#F8FAFC',
          muted: '#64748B'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(15, 23, 42, 0.08), 0 2px 6px -1px rgba(15, 23, 42, 0.04)',
        'glow': '0 0 25px -5px rgba(99, 102, 241, 0.35)',
        'card': '0 10px 30px -5px rgba(15, 23, 42, 0.06)'
      }
    },
  },
  plugins: [],
}

