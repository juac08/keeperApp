import { create } from "zustand";
import { persist } from "zustand/middleware";

export type DensityMode = "compact" | "comfortable" | "spacious";

type DensityStore = {
  density: DensityMode;
  setDensity: (mode: DensityMode) => void;
};

export const useDensityStore = create<DensityStore>()(
  persist(
    (set) => ({
      density: "comfortable",
      setDensity: (mode) => set({ density: mode }),
    }),
    {
      name: "density-storage",
    },
  ),
);
