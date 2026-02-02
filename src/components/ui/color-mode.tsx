import React, { useEffect } from "react";
import { useThemeStore } from "@/state/ThemeStore";

export function ColorModeProvider({ children }: { children: React.ReactNode }) {
  const { colorMode } = useThemeStore();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(colorMode);
    root.setAttribute("data-theme", colorMode);
  }, [colorMode]);

  return <>{children}</>;
}
