import { useMemo } from "react";
import { useColorScheme } from "react-native";

import { create } from "zustand";

export enum Theme {
  LIGHT = "light",
  DARK = "dark",
}

type AppState = {
  theme: Theme;
  switchTheme: () => void;
};

const useAppStore = create<AppState>((set) => {
  const colorScheme = useColorScheme();

  const defaultColorSchemeToCompare = useMemo(() => {
    return "dark";
  }, []);

  const initialTheme = useMemo(() => {
    return colorScheme === defaultColorSchemeToCompare
      ? Theme.DARK
      : Theme.LIGHT;
  }, [colorScheme]);

  return {
    theme: initialTheme,
    switchTheme: () =>
      set((state) => ({
        theme: state.theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT,
      })),
  };
});

export default useAppStore;
