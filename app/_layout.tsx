import { Stack } from "expo-router";
import "react-native-reanimated";


export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  /**
   *
   * @todo: create new routes for the app
   */
  return (
    <Stack>
      <Stack.Screen
        name="shortenedLinksScreen"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
