import React from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import { useThemeStore } from "@/state/ThemeStore";
import { AppIconButton } from "@/ui";

export const ThemeToggle: React.FC = () => {
  const { colorMode, toggleColorMode } = useThemeStore();
  const isDark = colorMode === "dark";

  return (
    <AppIconButton
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      onClick={toggleColorMode}
    >
      {isDark ? <FiSun size={16} /> : <FiMoon size={16} />}
    </AppIconButton>
  );
};
