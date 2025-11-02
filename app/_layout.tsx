import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { View } from "react-native";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  /**
   *
   * @todo: create new routes for the app
   */
  return (
    <View style={{ flex: 1 }}>
      <Stack initialRouteName="home">
        <Stack.Screen name="home" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </View>
  );
}
