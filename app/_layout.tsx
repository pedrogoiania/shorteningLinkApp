import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { View } from "react-native";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  /**
   *
   * @todo: create new routes for the app
   */
  return (
    <View style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="shortenedLinksScreen" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </View>
  );
}
