/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0B0D12',
          secondary: '#121620',
          card: '#171D29',
        },
        accent: {
          primary: '#8B5CF6',
          secondary: '#06B6D4',
        },
        state: {
          success: '#22C55E',
          warning: '#F59E0B',
          error: '#EF4444',
        },
        text: {
          primary: '#F3F4F6',
          secondary: '#9CA3AF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        'glow-purple': '0 0 20px -5px rgba(139, 92, 246, 0.4)',
        'glow-cyan': '0 0 20px -5px rgba(6, 182, 212, 0.4)',
        'glow-green': '0 0 20px -5px rgba(34, 197, 94, 0.4)',
      }
    },
  },
  plugins: [],
}

