import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-pricvo)", "system-ui", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"]
      },
      colors: {
        brand: {
          bg: "#09090b",
          panel: "#111114",
          panelSoft: "#17171b"
        }
      },
      boxShadow: {
        glow: "0 20px 60px rgba(0,0,0,0.35)"
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(circle at top left, rgba(217,70,239,0.22), transparent 34%), radial-gradient(circle at bottom right, rgba(6,182,212,0.18), transparent 30%)"
      }
    }
  },
  plugins: []
};

export default config;
