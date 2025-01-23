/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        'header': '350px auto',
        'list': '0.5fr 2fr 1fr 1fr 0.5fr'
      }
    },
  },
  plugins: [],
}

