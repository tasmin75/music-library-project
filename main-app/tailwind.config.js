/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        deck: {
          bg: "#15130f",
          panel: "#1e1b15",
          line: "#332e24",
          cream: "#ede6d6",
          muted: "#a89c85",
          amber: "#d4a017",
          amberDim: "#8a6a1e",
          rec: "#c0392b",
          tape: "#4c7a4c",
        },
      },
      fontFamily: {
        display: ["Fraunces", "ui-serif", "Georgia", "serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      letterSpacing: {
        widest2: "0.28em",
      },
      keyframes: {
        vu: {
          "0%, 100%": { height: "10%" },
          "50%": { height: "100%" },
        },
      },
      animation: {
        vu: "vu 0.9s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
