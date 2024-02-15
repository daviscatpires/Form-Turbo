/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#e1c353',
        darkText: '#5a4d21',
        lightText: '#96813a',
        background: '#fbfb98',
        buttonHover: '#746c34',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      },
    },
  },
  plugins: [],
}

