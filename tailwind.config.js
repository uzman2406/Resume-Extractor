/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6eeff',
          100: '#ccdeff',
          200: '#99bcff',
          300: '#669aff',
          400: '#3378ff',
          500: '#0056ff',
          600: '#0045cc',
          700: '#003399',
          800: '#002266',
          900: '#001133',
        },
        accent: {
          50: '#e6f9f8',
          100: '#ccf4f1',
          200: '#99e9e3',
          300: '#66dfd5',
          400: '#33d4c7',
          500: '#20B2AA',
          600: '#198e88',
          700: '#136b66',
          800: '#0c4744',
          900: '#062422',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
};