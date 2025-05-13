/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      width: {
        '7.5': '30px',
      },
      height: {
        '7.5': '30px',
      },
      colors: {
        theme: {
          bg: {
            primary: 'var(--color-bg-primary)',
            secondary: 'var(--color-bg-secondary)',
            tertiary: 'var(--color-bg-tertiary)',
          },
          text: {
            primary: 'var(--color-text-primary)',
            secondary: 'var(--color-text-secondary)',
          },
          accent: 'var(--color-accent)',
          accentLight: 'var(--color-accent-light)',
          border: 'var(--color-border)',
          hover: 'var(--color-hover)',
        },
        primary: {
          50: '#eef2ff',
          100: '#d9e2ff',
          200: '#bcccff',
          300: '#92a9ff',
          400: '#637cff',
          500: '#4456ff',
          600: '#2931f5',
          700: '#2327df',
          800: '#2122b5',
          900: '#20238f',
          950: '#151563',
        },
        telegram: {
          light: {
            primary: '#ffffff',
            secondary: '#f1f3f4',
            tertiary: '#f7f9fa',
            text: {
              primary: '#000000',
              secondary: '#707579'
            },
            accent: '#3390ec',
            accentLight: '#dceeff',
            border: '#e5e7eb',
            hover: '#f1f3f5'
          },
          dark: {
            primary: '#212232',
            secondary: '#181823',
            tertiary: '#1e1e2c',
            text: {
              primary: '#ffffff',
              secondary: '#aeb7c0'
            },
            accent: '#64baff',
            accentLight: '#1e3a56',
            border: '#2e3241',
            hover: '#2a2a3c'
          }
        }
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}

