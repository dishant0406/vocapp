import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type ThemeMode = "light" | "dark" | "system";

interface ThemeStore {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  getEffectiveTheme: () => "light" | "dark";
}

const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      themeMode: "system",
      setThemeMode: (mode: ThemeMode) => set({ themeMode: mode }),
      getEffectiveTheme: () => {
        const { themeMode } = get();
        if (themeMode === "system") {
          // We'll need to get the system theme from outside the store
          return "light"; // Default fallback
        }
        return themeMode;
      },
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useThemeStore;
