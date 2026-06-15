import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#15231d",
        muted: "#64736b",
        line: "#e4ebe7",
        canvas: "#f5f7f6",
        brand: {
          DEFAULT: "#16825d",
          dark: "#0f6649",
          pale: "#e9f7f1",
        },
      },
      boxShadow: {
        panel: "0 1px 2px rgba(20, 44, 33, 0.04), 0 8px 28px rgba(20, 44, 33, 0.05)",
      },
    },
  },
  plugins: [],
} satisfies Config;
