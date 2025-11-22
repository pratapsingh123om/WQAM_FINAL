/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-navy': '#0A192F',
        'vibrant-aqua': '#00F5FF',
        'emerald-safe': '#28FF8E',
      }
    },
    fontFamily: {
      sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
    },
  },
  plugins: [],
}