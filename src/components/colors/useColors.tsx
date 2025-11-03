import useAppStore, { Theme } from "@/src/store/appStore/appStore";
import { useMemo } from "react";

const lightColors = {
  background: "#FFFFFF",
  text: "#000000",
  gray: "#808080",
  black: "#000000",
  white: "#FFFFFF",
  error: "#DC143C",
};

const darkColors = {
  background: "#000000",
  text: "#FFFFFF",
  gray: "#808080",
  black: "#000000",
  error: "#DC143C",
};
function useColors() {
  const { theme } = useAppStore();

  const colors = useMemo(() => {
    return theme === Theme.LIGHT ? lightColors : darkColors;
  }, [theme]);

  return colors;
}

export default useColors;
