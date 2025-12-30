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
        // Jean Prouvé inspired industrial color palette
        primary: {
          steel: '#4A5568',
          aluminum: '#E2E8F0',
          iron: '#2D3748',
        },
        accent: {
          copper: '#D69E2E',
          brass: '#F6E05E',
        },
        neutral: {
          white: '#FFFFFF',
          light: '#F7FAFC',
          medium: '#CBD5E0',
          dark: '#1A202C',
        },
      },
      fontFamily: {
        primary: ['Inter', 'Noto Sans SC', 'sans-serif'],
        heading: ['Poppins', 'Noto Sans SC', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      transitionDuration: {
        '150': '150ms',
        '300': '300ms',
        '500': '500ms',
      },
      transitionTimingFunction: {
        'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
        'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
      },
    },
  },
  plugins: [],
};