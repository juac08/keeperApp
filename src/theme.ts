import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    tokens: {
      fonts: {
        heading: {
          value: 'Manrope, "Segoe UI", system-ui, sans-serif',
        },
        body: {
          value: 'Manrope, "Segoe UI", system-ui, sans-serif',
        },
      },
      colors: {
        brand: {
          50: { value: "#eaf6ff" },
          100: { value: "#cfe9ff" },
          200: { value: "#a6d5ff" },
          300: { value: "#72bbff" },
          400: { value: "#3ea0f5" },
          500: { value: "#1f86dc" },
          600: { value: "#1769b3" },
          700: { value: "#124f8a" },
          800: { value: "#0f3d6d" },
          900: { value: "#0c3157" },
        },
        blue: {
          50: { value: "#eaf6ff" },
          100: { value: "#cfe9ff" },
          200: { value: "#a6d5ff" },
          300: { value: "#72bbff" },
          400: { value: "#3ea0f5" },
          500: { value: "#1f86dc" },
          600: { value: "#1769b3" },
          700: { value: "#124f8a" },
          800: { value: "#0f3d6d" },
          900: { value: "#0c3157" },
        },
      },
      radii: {
        card: { value: "20px" },
        control: { value: "14px" },
        pill: { value: "999px" },
      },
      shadows: {
        soft: { value: "0 16px 40px rgba(15, 23, 42, 0.12)" },
        lift: { value: "0 10px 24px rgba(15, 23, 42, 0.16)" },
      },
    },
    semanticTokens: {
      colors: {
        "bg.canvas": {
          value: { _light: "#f3f6fb", _dark: "#0b1220" },
        },
        "bg.panel": {
          value: { _light: "#ffffff", _dark: "#111827" },
        },
        "bg.muted": {
          value: { _light: "#eaf0f7", _dark: "#1f2937" },
        },
        "border.muted": {
          value: { _light: "#d8e0eb", _dark: "#2b3646" },
        },
        "text.primary": {
          value: { _light: "#0f172a", _dark: "#e5e7eb" },
        },
        "text.secondary": {
          value: { _light: "#1f2937", _dark: "#c7d2fe" },
        },
        "text.muted": {
          value: { _light: "#5b6b82", _dark: "#94a3b8" },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
