/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        frost: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        cream: {
          50: '#fffbf5',
          100: '#fff7ed',
          200: '#ffedd5',
          300: '#fed7aa',
        },
      },
      fontFamily: {
        display: ['Georgia', 'Times New Roman', 'serif'],
        sans: ['Segoe UI', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 20px rgba(7, 89, 133, 0.07)',
        card: '0 12px 40px rgba(7, 89, 133, 0.1)',
        glow: '0 0 0 1px rgba(14, 165, 233, 0.15), 0 8px 24px rgba(2, 132, 199, 0.2)',
      },
      backgroundImage: {
        'frost-mesh':
          'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(186, 230, 253, 0.5), transparent), radial-gradient(ellipse 60% 40% at 100% 0%, rgba(254, 215, 170, 0.25), transparent)',
      },
    },
  },
  plugins: [],
};
