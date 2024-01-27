import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  daisyui: {
    themes: [
      {
        lightTheme: {
          "primary": "#1c1917",
          "secondary": "#f3f4f6",
          "accent": "#fde047",
          "neutral": "#f3f4f6",
          "base-100": "#ffffff",
          "info": "#f59e0b",
          "success": "#009800",
          "warning": "#f36e00",
          "error": "#e11d48",
          "body": {
            "background-color": "#e3e6e6"
          }
        },
      },
    ],
  },
  plugins: [
    require("daisyui"),
  ],
};
export default config;
