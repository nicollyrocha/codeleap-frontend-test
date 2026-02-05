/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        heartBeat: "heartBeat 0.6s ease-in-out",
      },
      keyframes: {
        heartBeat: {
          "0%": {
            transform: "scale(1)",
          },
          "14%": {
            transform: "scale(1.3)",
          },
          "28%": {
            transform: "scale(1)",
          },
          "42%": {
            transform: "scale(1.3)",
          },
          "70%": {
            transform: "scale(1)",
          },
        },
      },
    },
  },
  plugins: [],
};
