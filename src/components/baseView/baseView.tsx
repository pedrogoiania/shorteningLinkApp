import useAppStore, { Theme } from "@/src/store/appStore/appStore";
import { useMemo } from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import useColors from "../colors/useColors";

import { useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Text from "../text/text";

const buildStyles = (colors: ReturnType<typeof useColors>, theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 16,
    },
    content: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      flex: 1,
      maxHeight: 56,
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.gray,
      backgroundColor: colors.background,
      marginBottom: 4,
    },
    headerLeft: {
      width: 56,
      justifyContent: "center",
      alignItems: "center",
    },
    headerRight: {
      width: 56,
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });
};

/**
 *
 * @todo: should be translated and could be moved to a separate file
 */
enum ScreenNames {
  shortenedLinksScreen = "Shortened Links",
};

type BaseViewProps = {
  children: React.ReactNode;
  headerRight?: React.ReactNode;
  headerLeft?: React.ReactNode;
  showHeader?: boolean;
};

type HeaderProps = {
  showHeader: boolean;
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
};

function Header({ showHeader, headerLeft, headerRight }: HeaderProps) {
  const { theme } = useAppStore();
  const colors = useColors();

  const { name } = useRoute();

  const screenName = useMemo(() => {
    return ScreenNames[name as keyof typeof ScreenNames] || "Unknown";
  }, [name]);

  const styles = useMemo(() => buildStyles(colors, theme), [colors, theme]);

  if (!showHeader) return null;

  return (
    <View style={styles.header}>
      <View
        style={styles.headerRight}
      >
        {headerLeft || null}
      </View>
      <View style={styles.headerTitle}>
        <Text size="medium" weight="bold" variant="primary">
          {screenName}
        </Text>
      </View>
      <View
        style={styles.headerRight}
      >
        {headerRight || null}
      </View>
    </View>
  );
}

function BaseView({
  children,
  headerRight,
  headerLeft,
  showHeader = true,
}: BaseViewProps) {
  const { theme } = useAppStore();
  const colors = useColors();

  const styles = useMemo(() => buildStyles(colors, theme), [colors, theme]);

  const barStyle = useMemo(() => {
    return theme === Theme.LIGHT ? "dark-content" : "light-content";
  }, [theme]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={barStyle} />

      <Header
        showHeader={showHeader}
        headerLeft={headerLeft}
        headerRight={headerRight}
      />

      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
}

export default BaseView;
