import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        forest: {
          DEFAULT: "#1E4D40",
          hover: "#14382F",
          light: "#E8F3EE",
          border: "#B6DBC9",
        },
        ochre: {
          DEFAULT: "#C27D38",
          hover: "#A8682A",
          light: "#FDF4EB",
          border: "#F5D8B8",
        },
        cream: {
          DEFAULT: "#F5F2EB",
          card: "#FFFFFF",
          sidebar: "#EFECE4",
          border: "#E3DDD1",
          borderDark: "#D2CAA",
        },
        charcoal: {
          DEFAULT: "#1A1D1A",
          muted: "#4A4D4A",
        },
        taupe: {
          DEFAULT: "#686660",
          light: "#8C8982",
        },
      },
    },
  },
  plugins: [],
};
export default config;
