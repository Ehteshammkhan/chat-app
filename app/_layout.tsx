import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";

import { ChatProvider } from "../src/context/ChatContext";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ChatProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ title: "Groups" }} />

          <Stack.Screen
            name="chat"
            options={{
              title: "Chat",
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="create-group"
            options={{ title: "Create Group" }}
          />
        </Stack>

        <StatusBar style="auto" />
      </ThemeProvider>
    </ChatProvider>
  );
}
