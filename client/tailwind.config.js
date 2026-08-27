/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      colors: {
        cream: {
          50: '#fff8f6',
          100: '#ffeee8',
          200: '#ffdad4',
          300: '#ffc4bb',
        },
        chocolate: {
          50: '#fdf5f0',
          100: '#f9e4d8',
          800: '#4f4442',
          900: '#2b1613',
          950: '#1a0e0c',
        },
        caramel: {
          400: '#a87a4a',
          500: '#8f6239',
          600: '#7d562d',
          700: '#6a4724',
        },
        rose: {
          blush: '#f5c5be',
          soft: '#fce8e4',
          muted: '#e8a49c',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #fff8f6 0%, #ffeee8 100%)',
      },
    },
  },
  plugins: [],
}
