/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Habilitar el modo oscuro basado en la clase dark en el elemento HTML
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f7ef',
          100: '#c3ecd7',
          200: '#9ee0bd',
          300: '#78d3a3',
          400: '#5bc98e',
          500: '#2a8053', // Color principal
          600: '#247349',
          700: '#1d673f',
          800: '#175a35',
          900: '#104d2b',
          950: '#0a4022',
        },
      },
    },
  },
  plugins: [],
}
