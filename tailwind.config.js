/** @type {import('tailwindcss').Config} */
module.exports = {
  // Enable dark mode via class for theme switching
  darkMode: 'class',

  // Scan all relevant files for Tailwind classes
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // Source files
    './components/**/*.{js,ts,jsx,tsx}', // shadcn-ui components
    './pages/**/*.{js,ts,jsx,tsx}', // Next.js pages
  ],

  theme: {
    // Extend default Tailwind theme
    extend: {
      // Comprehensive temporal color palette
      colors: {
        temporal: {
          light: {
            DEFAULT: '#fefce8', // Past theme base
            100: '#fefce8',
            200: '#fef9c3',
            300: '#fef08a',
            400: '#fde047',
            500: '#facc15', // Accent
            600: '#eab308',
            700: '#ca8a04',
            800: '#a16207',
            900: '#854d0e',
          },
          dark: {
            DEFAULT: '#0f172a', // Future theme base
            100: '#f8fafc',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b', // Accent
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#0f172a',
          },
          paradox: {
            DEFAULT: '#f43f5e', // Paradox theme accent
            100: '#ffe4e6',
            200: '#fecdd3',
            300: '#fda4af',
            400: '#fb7185',
            500: '#f43f5e', // Base
            600: '#e11d48',
            700: '#be123c',
            800: '#9f1239',
            900: '#881337',
          },
        },
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
        primary: 'var(--primary)',
        border: 'var(--border)',
      },

      // Custom spacing for timeline precision
      spacing: {
        'timeline-unit': '4px', // Base unit for timeline scaling
        'event-marker': '8px',  // Event marker height
        'connection-gap': '2px', // Gap between connections
      },

      // Typography optimized for historical readability
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Georgia', 'serif'],
        temporal: ['Orbitron', 'sans-serif'], // Futuristic font (add via CDN or local)
      },
      fontSize: {
        'xs-timeline': '0.65rem', // Tiny text for dense timelines
        'sm-timeline': '0.75rem', // Small text for tooltips
      },

      // Enhanced shadows for depth
      boxShadow: {
        'temporal-sm': '0 1px 3px rgba(59, 130, 246, 0.2)',
        'temporal-md': '0 4px 6px rgba(59, 130, 246, 0.3)',
        'temporal-lg': '0 10px 15px rgba(59, 130, 246, 0.4)',
        'paradox': '0 0 10px rgba(244, 63, 94, 0.5)',
      },

      // Rich animation suite
      animation: {
        'fade-in': 'fade-in 0.3s ease-in-out',
        'fade-out': 'fade-out 0.3s ease-in-out',
        'temporal-glow': 'temporal-glow 2s infinite ease-in-out',
        'pulse-temporal': 'pulse-temporal 1.5s infinite',
        'warp': 'warp 0.5s ease-out',
        'ripple': 'ripple 0.6s ease-out',
        'slide-in': 'slide-in 0.4s ease-out',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-out': {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        'temporal-glow': {
          '0%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.3)' },
          '50%': { boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)' },
          '100%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.3)' },
        },
        'pulse-temporal': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.8' },
        },
        'warp': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'ripple': {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        'slide-in': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },

      // Custom utilities for timeline components
      borderWidth: {
        'timeline': '1px', // Thin borders for timeline elements
      },
      transitionProperty: {
        'height-scale': 'height, transform', // For event markers
      },
    },
  },

  // Plugins for additional functionality
  plugins: [
    require('@tailwindcss/typography'), // Prose styling for descriptions
    require('@tailwindcss/forms'),      // Better form elements
    // Custom plugin for ChronoWeave-specific utilities
    function ({ addUtilities }) {
      const newUtilities = {
        '.timeline-gradient': {
          background: 'linear-gradient(to right, var(--background), var(--card))',
        },
        '.event-hover': {
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)',
          },
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
};
