import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#F2C94C', // SCESoc Yellow
          dark: '#D9B443',
          light: '#FFF5CC',
        },
        surface: {
          DEFAULT: '#333333', // Card Grey
          subtle: '#222222',  // Deep Charcoal Background
        }
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;