import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    tokens: {
      fonts: {
        heading: {
          value: 'Inter, "Segoe UI", system-ui, -apple-system, sans-serif',
        },
        body: {
          value: 'Inter, "Segoe UI", system-ui, -apple-system, sans-serif',
        },
      },
      colors: {
        brand: {
          50: { value: "#eff6ff" },
          100: { value: "#dbeafe" },
          200: { value: "#bfdbfe" },
          300: { value: "#93c5fd" },
          400: { value: "#60a5fa" },
          500: { value: "#3b82f6" },
          600: { value: "#2563eb" },
          700: { value: "#1d4ed8" },
          800: { value: "#1e40af" },
          900: { value: "#1e3a8a" },
        },
        blue: {
          50: { value: "#eff6ff" },
          100: { value: "#dbeafe" },
          200: { value: "#bfdbfe" },
          300: { value: "#93c5fd" },
          400: { value: "#60a5fa" },
          500: { value: "#3b82f6" },
          600: { value: "#2563eb" },
          700: { value: "#1d4ed8" },
          800: { value: "#1e40af" },
          900: { value: "#1e3a8a" },
        },
      },
      radii: {
        card: { value: "16px" },
        control: { value: "12px" },
        pill: { value: "999px" },
      },
      shadows: {
        soft: {
          value:
            "0 1px 3px rgba(0, 0, 0, 0.08), 0 8px 30px rgba(0, 0, 0, 0.07)",
        },
        lift: { value: "0 4px 14px rgba(0, 0, 0, 0.1)" },
        glow: { value: "0 0 0 3px rgba(59, 130, 246, 0.15)" },
      },
    },
    semanticTokens: {
      colors: {
        "bg.canvas": {
          value: { _light: "#f8fafc", _dark: "#0a0f1a" },
        },
        "bg.panel": {
          value: { _light: "#ffffff", _dark: "#111827" },
        },
        "bg.muted": {
          value: { _light: "#f1f5f9", _dark: "#1e293b" },
        },
        "bg.subtle": {
          value: { _light: "#f8fafc", _dark: "#162032" },
        },
        "border.muted": {
          value: { _light: "#e2e8f0", _dark: "#1e293b" },
        },
        "border.subtle": {
          value: { _light: "#f1f5f9", _dark: "#1a2332" },
        },
        "text.primary": {
          value: { _light: "#0f172a", _dark: "#f1f5f9" },
        },
        "text.secondary": {
          value: { _light: "#334155", _dark: "#cbd5e1" },
        },
        "text.muted": {
          value: { _light: "#64748b", _dark: "#94a3b8" },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
