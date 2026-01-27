/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,tsx}",
    "./components/**/*.{js,ts,tsx}",
  ],
  // Remove this line: presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        light: "#D9D9D9",
        dark: "#1E1E1E",
      },
    },
  },
  plugins: [],
};