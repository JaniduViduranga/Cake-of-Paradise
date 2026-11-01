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
        // ── Brand Palette Tokens ───────────────────────────────────────────
        brand: {
          DEFAULT: '#F5AFAF',      // Primary Brand / CTA (F5AFAF)
          cta: '#F5AFAF',          // Buttons, active tabs, brand accents
          hover: '#EFA3A3',        // Primary Brand Hover
          light: '#FBEFEF',        // Soft surface tint
        },
        accent: {
          DEFAULT: '#F5AFAF',      // Secondary / Accent (F5AFAF)
          secondary: '#F9DFDF',    // Light Accent / Border (F9DFDF)
          hover: '#EFA3A3',
        },
        surface: {
          main: '#FCF8F8',         // Background - Main (FCF8F8)
          card: '#FCF8F8',         // Background - Card / Surface (FCF8F8)
          soft: '#FBEFEF',         // Background - Subtle Tint (FBEFEF)
        },
        divider: {
          DEFAULT: '#F9DFDF',      // Borders & Dividers (F9DFDF)
          border: '#F9DFDF',
        },
        content: {
          primary: '#3D2727',      // Text - Primary (Headings & Titles)
          body: '#574A4A',         // Text - Body / Paragraphs
          muted: '#857373',        // Text - Muted / Secondary
          accent: '#F5AFAF',       // Accent Text (F5AFAF)
        },
        status: {
          success: '#48A111',      // Success / Status Green
          error: '#E00000',        // Error / Alert Red
        },

        // ── Unified Existing Theme Mapping ─────────────────────────────────
        cream: {
          50: '#FCF8F8',           // Background - Main (FCF8F8)
          100: '#FBEFEF',          // Surface Tint (FBEFEF)
          200: '#FBEFEF',
          300: '#F9DFDF',          // Borders & Dividers (F9DFDF)
          400: '#F5AFAF',          // Primary Accent (F5AFAF)
          500: '#F5AFAF',
        },
        chocolate: {
          50: '#FCF8F8',
          100: '#FBEFEF',
          200: '#F9DFDF',
          700: '#705E5E',
          800: '#574A4A',          // Text - Body / Secondary
          900: '#3D2727',          // Text - Primary (Headings & Titles)
          950: '#261717',
        },
        caramel: {
          50: '#FBEFEF',           // Card selection background tint (FBEFEF)
          100: '#FBEFEF',
          200: '#F9DFDF',
          300: '#F9DFDF',          // Border accent (F9DFDF)
          400: '#F5AFAF',
          500: '#F5AFAF',
          600: '#F5AFAF',          // Primary brand & active states (F5AFAF)
          700: '#EFA3A3',
          800: '#D88A8A',
        },
        rose: {
          50: '#FCF8F8',
          100: '#FBEFEF',
          200: '#F9DFDF',
          300: '#F9DFDF',
          400: '#F5AFAF',
          500: '#F5AFAF',
          soft: '#FCF8F8',         // Card / Surface
          blush: '#FBEFEF',        // Primary Hover / Soft background
          border: '#F9DFDF',       // Borders & Dividers
          muted: '#F9DFDF',
          accent: '#F5AFAF',       // Accent
        },
        success: {
          DEFAULT: '#48A111',      // Success / Status Green
          500: '#48A111',
        },
        error: {
          DEFAULT: '#E00000',      // Error / Alert Red
          500: '#E00000',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'warm': '0 4px 20px -2px rgba(245, 175, 175, 0.25)',
        'warm-lg': '0 12px 30px -4px rgba(245, 175, 175, 0.35)',
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
        'hero-gradient': 'linear-gradient(135deg, #FCF8F8 0%, #FBEFEF 50%, #FCF8F8 100%)',
      },
    },
  },
  plugins: [],
}
