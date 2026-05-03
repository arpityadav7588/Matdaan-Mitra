/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        saffron: {
          DEFAULT: '#FF9933',
          dark: '#CC7A29',
        },
        green: {
          DEFAULT: '#128807',
          dark: '#0E6B05',
        },
        navy: {
          DEFAULT: '#000080',
          dark: '#000066',
        },
      },
      fontFamily: {
        hindi: ['Noto Sans Devanagari', 'sans-serif'],
        tamil: ['Noto Sans Tamil', 'sans-serif'],
        telugu: ['Noto Sans Telugu', 'sans-serif'],
        english: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
