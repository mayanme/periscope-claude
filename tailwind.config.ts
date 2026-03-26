import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Georgia", "Cambria", "serif"],
      },
      colors: {
        brand: {
          50: "#f0f4ff",
          100: "#dde7ff",
          200: "#c3d3ff",
          300: "#9ab5ff",
          400: "#6e8ffe",
          500: "#4a67f8",
          600: "#2f45ed",
          700: "#2534d9",
          800: "#242caf",
          900: "#232c8a",
          950: "#161a57",
        },
      },
    },
  },
  plugins: [],
};

export default config;
