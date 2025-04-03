import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ThemeMode } from "../lib/shadcn/types";

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: "dark",
      setMode: (mode) => set({ mode }),
    }),
    {
      name: "theme-storage",
    }
  )
);