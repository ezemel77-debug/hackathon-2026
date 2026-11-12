/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        forest: {
          950: "#132A1F",
          900: "#1B3B2A",
          800: "#234A36",
          700: "#2F5D42",
          600: "#3D7052",
          100: "#E7EFE6",
          50: "#F2F7F1",
        },
        honey: {
          700: "#A9731E",
          600: "#C58A24",
          500: "#D79A2C",
          200: "#F3DFAF",
          100: "#FAF0DC",
        },
        caramel: {
          700: "#5E3A1D",
          600: "#7B4A25",
          500: "#96602F",
        },
        cream: "#FBF8F1",
        ink: "#1E2420",
        line: "#DDD5C3",
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 6px 20px -8px rgba(27, 59, 42, 0.25)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
