import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    tokens: {
      fonts: {
        heading: {
          value:
            'Inter, Roboto, "Open Sans", Lato, system-ui, -apple-system, sans-serif',
        },
        body: {
          value:
            'Inter, Roboto, "Open Sans", Lato, system-ui, -apple-system, sans-serif',
        },
      },
      colors: {
        brand: {
          50: { value: "#eef4ff" },
          100: { value: "#d9e4ff" },
          200: { value: "#b9ccff" },
          300: { value: "#88a8ff" },
          400: { value: "#5b85ff" },
          500: { value: "#2f62ff" },
          600: { value: "#234bdb" },
          700: { value: "#1d3db2" },
          800: { value: "#1a358e" },
          900: { value: "#182c6a" },
        },
      },
      radii: {
        card: { value: "18px" },
        control: { value: "12px" },
        pill: { value: "999px" },
      },
      shadows: {
        soft: { value: "0 12px 30px rgba(15, 23, 42, 0.12)" },
        lift: { value: "0 8px 18px rgba(15, 23, 42, 0.14)" },
      },
    },
    semanticTokens: {
      colors: {
        "bg.canvas": { value: { _light: "#f6f8fb" } },
        "bg.panel": { value: { _light: "#ffffff" } },
        "bg.muted": { value: { _light: "#f1f4f9" } },
        "border.muted": { value: { _light: "#e2e8f0" } },
        "text.muted": { value: { _light: "#64748b" } },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
