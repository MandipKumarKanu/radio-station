/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        black: "#000",
        bg: "rgb(18, 18, 18)",
        gray: "#2a2a2a",
        gray2: "#292929",
        btn: "#C63C51",
      },
    },
  },
  plugins: [],
};
