import useAppStore, { Theme } from "@/src/store/appStore/appStore";
import { useMemo } from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import useColors from "../colors/useColors";

const buildStyles = (colors: ReturnType<typeof useColors>, theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
    },
  });
};

function BaseView({ children }: { children: React.ReactNode }) {
  const { theme } = useAppStore();
  const colors = useColors();

  const styles = useMemo(() => buildStyles(colors, theme), [colors, theme]);

  const barStyle = useMemo(() => {
    return theme === Theme.LIGHT ? "dark-content" : "light-content";
  }, [theme]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={barStyle} />
      {children}
    </View>
  );
}

export default BaseView;
