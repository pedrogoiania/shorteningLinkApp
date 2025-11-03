import useAppStore, { Theme } from "@/src/store/appStore/appStore";
import { useMemo } from "react";

const lightColors = {
  background: "#FFFFFF",
  text: "#000000",
  gray: "#808080",
};

const darkColors = {
  background: "#000000",
  text: "#FFFFFF",
  gray: "#808080",
};
function useColors() {
  const { theme } = useAppStore();

  const colors = useMemo(() => {
    return theme === Theme.LIGHT ? lightColors : darkColors;
  }, [theme]);

  return colors;
}

export default useColors;
