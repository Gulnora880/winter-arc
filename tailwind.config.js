/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#080D18",
        card: "#111B2B",
        accent: "#80BFFF",
        text: "#F2F6FC",
        muted: "#94A3B8",
      },
    },
  },
  plugins: [],
};
