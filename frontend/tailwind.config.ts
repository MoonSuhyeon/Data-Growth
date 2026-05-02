import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1F2937',
        secondary: '#6366F1',
        accent: '#F59E0B',
      },
    },
  },
  plugins: [],
} satisfies Config
