import { create } from "zustand";
import { persist } from "zustand/middleware";

type ColorMode = "light" | "dark";

type ThemeStore = {
  colorMode: ColorMode;
  toggleColorMode: () => void;
  setColorMode: (mode: ColorMode) => void;
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      colorMode: "light",
      toggleColorMode: () =>
        set((state) => ({
          colorMode: state.colorMode === "light" ? "dark" : "light",
        })),
      setColorMode: (mode) => set({ colorMode: mode }),
    }),
    {
      name: "theme-storage",
    },
  ),
);
