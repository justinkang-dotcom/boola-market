import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        yale: {
          DEFAULT: "#00356B",
          dark: "#002349",
          mid: "#286DC0",
          mist: "#E7EEF6",
        },
        gold: {
          DEFAULT: "#A6842A",
          soft: "#F4E8C8",
        },
        paper: "#FBF8F2",
        ink: "#142033",
        mute: "#5C6B7A",
        line: "#E4DDD0",
      },
      fontFamily: {
        serif: ["var(--font-garamond)", "Palatino", "Georgia", "serif"],
        sans: ["var(--font-outfit)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(20, 32, 51, 0.04), 0 8px 24px rgba(20, 32, 51, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
