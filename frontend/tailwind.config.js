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
          50: '#fff8ed',
          100: '#ffeed1',
          200: '#ffdca1',
          500: '#c86a1f',
          600: '#af5418',
          700: '#8f4416',
        },
        accent: {
          50: '#fffbef',
          100: '#fff4cc',
          200: '#ffe7a3',
          500: '#b88a1c',
          600: '#8d6512',
        }
      }
    },
  },
  plugins: [],
}
