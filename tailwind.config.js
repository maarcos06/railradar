/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        radar: {
          dark: '#0a0e17',
          card: '#111827',
          panel: '#151d2e',
          border: '#1f293d',
          accent: '#06b6d4', // cyan-500
          green: '#10b981', // emerald-500
          yellow: '#f59e0b', // amber-500
          red: '#ef4444',
          ave: '#9333ea', // purple for AVE
          alvia: '#2563eb', // blue for Alvia
          avlo: '#ec4899', // pink for Avlo
          avant: '#0891b2', // cyan for Avant
          md: '#059669', // green for Media Distancia
          intercity: '#d97706', // amber for Intercity
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};

