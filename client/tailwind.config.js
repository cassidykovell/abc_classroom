/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pastel: {
          blue: "#A0D2EB",
          pink: "#FEC8D8",
          green: "#BBDBB4",
          yellow: "#FFDFD3",
          purple: "#D0BDF4",
          gray: "#E0E0E0",
        },
      },
    },
  },
  plugins: [],
}
