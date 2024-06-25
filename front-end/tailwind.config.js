import sass from 'sass';
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  darkMode:'class',
  theme: {
    extend: {
      colors:{
        primary: 'var(--primary-color)',
        secondary: 'var(--secondary-color)',
      }
    },
  },
  
  plugins: [
    sass,
  ],
}