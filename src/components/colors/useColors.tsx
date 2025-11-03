import useAppStore, { Theme } from "@/src/store/appStore/appStore";
import { useMemo } from "react";

const lightColors = {
  background: "#FFFFFF",
  text: "#000000",
};

const darkColors = {
  background: "#000000",
  text: "#FFFFFF",
};
function useColors() {
  const { theme } = useAppStore();

  const colors = useMemo(() => {
    return theme === Theme.LIGHT ? lightColors : darkColors;
  }, [theme]);

  return colors;
}

export default useColors;
