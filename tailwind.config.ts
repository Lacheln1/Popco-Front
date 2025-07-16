export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        popcorn1: {
          "0%": { transform: "translateY(0) scale(1)" },
          "50%": { transform: "translateY(-40px) scale(1.2)" },
          "100%": { transform: "translateY(0) scale(0.7)" },
        },
        popcorn2: {
          "0%": { transform: "translateY(0) scale(1)" },
          "50%": { transform: "translateY(-50px) scale(1.2)" },
          "100%": { transform: "translateY(0) scale(0.7)" },
        },
        popcorn3: {
          "0%": { transform: "translateY(0) scale(1) opacity(1)" },
          "50%": { transform: "translateY(-35px) scale(1.2)" },
          "100%": { transform: "translateY(0) scale(0.7) opacity(0)" },
        },
      },
      animation: {
        popcorn1: "popcorn1 0.7s ease-in-out",
        popcorn2: "popcorn2 0.7s ease-in-out",
        popcorn3: "popcorn3 0.7s ease-in-out",
      },
    },
  },
  plugins: [],
};
