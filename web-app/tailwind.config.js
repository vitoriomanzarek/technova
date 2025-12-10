/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--primary))', // Cyan Glow (was dark blue)
        accent: 'hsl(var(--accent))', // Nebula Purple
        dark: 'hsl(var(--background))', // Space Black
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

