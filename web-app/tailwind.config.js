/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1A1F71', // Deep Blue
        accent: '#6A0DAD', // Nebula Purple
        dark: '#121212', // Space Black
        darker: '#0a0a0a',
        highlight: '#00D4FF', // Bright Cyan
        light: '#F5F5F5',
      },
      fontFamily: {
        heading: ['Montserrat', 'sans-serif'],
        body: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

