/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'base': '#11121a',
        'line': '#42434a',
        'hover': '#222533',
        'text': '#e6e6ef',
        'accent': '#5e63ff',
        'secondary-text': '#b0b3c1',
      },
      dropShadow: {
        '3xl': '0 35px 35px rgba(0, 0, 0, 0.25)',
        '4xl': '2px 5px 0px #111980',
        '5xl': [
          '0 35px 35px rgba(0, 0, 0, 0.25)',
          '0 45px 65px rgba(0, 0, 0, 0.15)'
        ]
      },
      gridTemplateColumns:{
        'header':'350px auto'
      }
    },
  },
  plugins: [],
  darkMode: "class"
}

