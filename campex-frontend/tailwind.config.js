/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f6f7f3',
          100: '#eceee4',
          200: '#d9ddc9',
          300: '#bfc6a4',
          400: '#a3ad7f',
          500: '#79864B',  // Main olive green
          600: '#6a7742',
          700: '#5a6338',
          800: '#4a502e',
          900: '#3a4024',
        },
        accent: {
          50: '#faf7ed',
          100: '#f5efd8',
          200: '#eaddaf',
          300: '#ddc77c',
          400: '#C5A253',  // Muted yellow/gold
          500: '#b89147',
          600: '#a67d3c',
          700: '#896533',
          800: '#6f522d',
          900: '#5c4427',
        },
      },
    },
  },
  plugins: [],
}