/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Satoshi', 'Montserrat', 'sans-serif'],
        serif: ['Satoshi', '"Playfair Display"', 'Georgia', 'serif'],
        satoshi: ['Satoshi', 'sans-serif'],
        heading: ['Satoshi', 'sans-serif'],
        body: ['Satoshi', 'sans-serif'],
        playfair: ['Satoshi', '"Playfair Display"', 'Georgia', 'serif'],
        montserrat: ['Satoshi', 'Montserrat', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '0.95rem', letterSpacing: '0.03em' }],
        xs: ['0.75rem', { lineHeight: '1.05rem', letterSpacing: '0.02em' }],
        sm: ['0.875rem', { lineHeight: '1.3rem', letterSpacing: '0.01em' }],
        base: ['1rem', { lineHeight: '1.55rem', letterSpacing: '0' }],
        lg: ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
        xl: ['1.25rem', { lineHeight: '1.8rem', letterSpacing: '-0.015em' }],
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.02em' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.025em' }],
        '4xl': ['2.25rem', { lineHeight: '2.6rem', letterSpacing: '-0.03em' }],
        '5xl': ['3rem', { lineHeight: '1.15', letterSpacing: '-0.035em' }],
        '6xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.04em' }],
      },
      colors: {
        // ── Standardized WCAG AA Brand Palette Tokens ─────────────────────────
        brand: {
          'text-dark': '#2E1E1A',      // High-contrast headings and primary labels
          'text-body': '#4A3F3D',      // Paragraphs, descriptions, input text
          'text-muted': '#786C6A',     // Placeholders, captions, secondary metadata
          'accent': '#C45B59',         // Emphasized heading words, badges, active tabs
          'primary': '#E87A78',        // Main CTA button fill (+ Order Custom Cake)
          'primary-hover': '#D16260',  // CTA hover & pressed states
          'border-btn': '#DCA5A4',     // Secondary button outline & text (+ View Gallery)
          'border': '#F0D5D4',         // Card borders, input field borders, dividers
          'bg-hero': '#FFF5F4',        // Hero section background tint
          'surface': '#FFFFFF',        // Card surfaces, modals, popovers
          DEFAULT: '#E87A78',
          cta: '#E87A78',
          hover: '#D16260',
          light: '#FFF5F4',
        },
        accent: {
          DEFAULT: '#C45B59',
          secondary: '#F0D5D4',
          hover: '#D16260',
        },
        surface: {
          main: '#FFF5F4',
          card: '#FFFFFF',
          soft: '#FFF5F4',
        },
        divider: {
          DEFAULT: '#F0D5D4',
          border: '#F0D5D4',
        },
        content: {
          primary: '#2E1E1A',
          body: '#4A3F3D',
          muted: '#786C6A',
          accent: '#C45B59',
        },
        status: {
          success: '#48A111',
          error: '#E00000',
        },

        // ── Backward Compatible Theme Aliases ─────────────────────────────────
        cream: {
          50: '#FFF5F4',
          100: '#FFF5F4',
          200: '#FFF5F4',
          300: '#F0D5D4',
          400: '#E87A78',
          500: '#C45B59',
        },
        chocolate: {
          50: '#FFF5F4',
          100: '#FFF5F4',
          200: '#F0D5D4',
          700: '#786C6A',
          800: '#4A3F3D',
          900: '#2E1E1A',
          950: '#1E1412',
        },
        caramel: {
          50: '#FFF5F4',
          100: '#FFF5F4',
          200: '#F0D5D4',
          300: '#F0D5D4',
          400: '#E87A78',
          500: '#E87A78',
          600: '#C45B59',
          700: '#D16260',
          800: '#B84E4C',
        },
        rose: {
          50: '#FFF5F4',
          100: '#FFF5F4',
          200: '#F0D5D4',
          300: '#F0D5D4',
          400: '#E87A78',
          500: '#C45B59',
          soft: '#FFFFFF',
          blush: '#FFF5F4',
          border: '#F0D5D4',
          muted: '#F0D5D4',
          accent: '#C45B59',
        },
        success: {
          DEFAULT: '#48A111',
          500: '#48A111',
        },
        error: {
          DEFAULT: '#E00000',
          500: '#E00000',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'warm': '0 4px 20px -2px rgba(232, 122, 120, 0.25)',
        'warm-lg': '0 12px 30px -4px rgba(232, 122, 120, 0.35)',
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
        'hero-gradient': 'linear-gradient(135deg, #FFF5F4 0%, #FFFFFF 50%, #FFF5F4 100%)',
      },
    },
  },
  plugins: [],
}
