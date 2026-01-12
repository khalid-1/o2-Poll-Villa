/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Airbnb Cereal', 'sans-serif'],
      },
      colors: {
        cyan: {
          50: '#f0fdfd',
          100: '#dcfbfc',
          200: '#bef6f8',
          300: '#8cebf1',
          400: '#52d8e4',
          500: '#2bbccb',
          600: '#1e9aad', // Primary Brand Color
          700: '#1b7c8d',
          800: '#1c6574',
          900: '#1a5461',
          950: '#0e3843',
        }
      },
      boxShadow: {
        'premium': '0 20px 40px -15px rgba(0, 0, 0, 0.1), 0 0 20px -10px rgba(0, 0, 0, 0.05)',
        'premium-hover': '0 25px 50px -12px rgba(43, 188, 203, 0.25)',
      }
    },
  },
  plugins: [],
}
