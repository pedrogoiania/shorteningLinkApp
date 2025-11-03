import { useEffect } from "react";
import { useColorScheme } from "react-native";

import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export enum Theme {
  LIGHT = "light",
  DARK = "dark",
}

// Extract theme determination logic for testability
export const getInitialTheme = (colorScheme: string | null | undefined): Theme => {
  const defaultColorSchemeToCompare = "dark";
  return colorScheme === defaultColorSchemeToCompare ? Theme.DARK : Theme.LIGHT;
};

type AppState = {
  theme: Theme;
  switchTheme: () => void;
  setTheme: (theme: Theme) => void;
};

// Create store without hooks - initialization will happen in a React component
const useAppStore = create<AppState>()(
  subscribeWithSelector((set) => ({
    theme: Theme.LIGHT, // Default value
    switchTheme: () =>
      set((state) => ({
        theme: state.theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT,
      })),
    setTheme: (theme: Theme) => set({ theme }),
  }))
);

// Hook to initialize theme based on system color scheme
export const useInitializeTheme = () => {
  const colorScheme = useColorScheme();

  useEffect(() => {
    const initialTheme = getInitialTheme(colorScheme);
    useAppStore.getState().setTheme(initialTheme);
  }, [colorScheme]);
};

export default useAppStore;
