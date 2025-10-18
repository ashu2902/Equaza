/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        // Primary brand color from UI guide
        primary: {
          DEFAULT: '#98342d',
          50: '#fdf2f2',
          100: '#fce7e6',
          200: '#f9d1cf',
          300: '#f5aeab',
          400: '#ee7f79',
          500: '#e3524a',
          600: '#d1392f',
          700: '#af2e25',
          800: '#98342d',
          900: '#7a2822',
          950: '#42120f',
        },
        // Warm beige/cream palette from Figma
        cream: {
          50: '#FEFDFB',
          100: '#FDF9F3',
          200: '#FAF0E6',
          300: '#F5E6D3',
          400: '#EDD5B7',
          500: '#E4C59B',
          600: '#D4B087',
          700: '#C19A6B',
          800: '#A67C4A',
          900: '#8B6635',
        },
        // Warm gray tones for text and backgrounds
        warm: {
          50: '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
          800: '#292524',
          900: '#1C1917',
        },
        // Extended neutral palette for sophisticated grays
        neutral: {
          25: '#fcfcfc',
          950: '#0a0a0a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        display: ['Playfair Display', 'Georgia', 'serif'], // For headings
        body: ['Inter', 'system-ui', 'sans-serif'], // For body text
        baskerville: ['Libre Baskerville', 'Georgia', 'serif'], // For brand name
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
        100: '25rem',
        112: '28rem',
        128: '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        elegant:
          '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 20px 25px -5px rgba(0, 0, 0, 0.04)',
        deep: '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'scale-in': 'scaleIn 0.6s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
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
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#374151',
            maxWidth: 'none',
            p: {
              marginTop: '1.25rem',
              marginBottom: '1.25rem',
            },
            'h1, h2, h3, h4, h5, h6': {
              color: '#111827',
              fontWeight: '600',
            },
          },
        },
      },
    },
  },
  plugins: [],
};
