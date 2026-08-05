import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        logic: {
          greenDark: "#033b2c",
          green: "#11522c",
          greenLight: "#27a37e",
          lime: "#4cd201",
          yellow: "#f4c430",
          background: "#f5f7f6",
          border: "#e4e9e6",
          text: "#1c2823",
          muted: "#6b7771",
          danger: "#dc3545",
          warning: "#f59e0b",
          success: "#16a34a",
          info: "#2563eb",
        },
      },
      borderRadius: {
        card: "14px",
      },
    },
  },
  plugins: [],
};

export default config;
