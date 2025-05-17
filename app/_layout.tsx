import { ThemeProvider } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import SuperTokens from "supertokens-react-native";

import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/plus-jakarta-sans";

import { Stack, useRouter } from "expo-router";

import * as SplashScreen from "expo-splash-screen";

import { useEffect } from "react";

import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { darkTheme, lightTheme } from "@/utils/theme/theme";
import { useTheme } from "@/utils/theme/useTheme";
import { Toaster } from "sonner-native";

import { ENV } from "@/constants/variables";
import { apiClient } from "@/utils/api/client";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [loaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });
  const { theme } = useTheme();

  const loadAuth = async () => {
    SuperTokens.init({
      apiDomain: ENV.AUTH_APP_DOMAIN,
    });
    const isLoggedIn = await SuperTokens.doesSessionExist();
    if (isLoggedIn) {
      SuperTokens.addAxiosInterceptors(apiClient);
      router.replace("/(tabs)");
    }
  };

  const load = async () => {
    if (loaded) {
      await loadAuth();
      await SplashScreen.hideAsync();
    }
  };

  useEffect(() => {
    load();
  }, [loaded]);

  if (!loaded) {
    return <></>;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? darkTheme : lightTheme}>
      <GestureHandlerRootView>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <Toaster
          theme="system"
          style={{
            borderRadius: 8,
            borderColor: theme.colors.border,
            borderWidth: 1,
          }}
        />
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
