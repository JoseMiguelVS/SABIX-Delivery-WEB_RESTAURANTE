/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#fa8bf5',
          300: '#db6bd7',
          500: '#bc4ab9',
          700: '#9d2a9c',
          900: '#7e097e',
        }
      }
    },
  },
  plugins: [],
}
