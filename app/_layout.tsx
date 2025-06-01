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

import { Href, Stack, useRouter } from "expo-router";

import * as SplashScreen from "expo-splash-screen";

import { useEffect, useState } from "react";

import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { darkTheme, lightTheme } from "@/utils/theme/theme";
import { useTheme } from "@/utils/theme/useTheme";

import { ENV } from "@/constants/variables";
import { apiClient } from "@/utils/api/client";
import { useAudioEvents } from "@/utils/hooks/audioEvents";
import useUserStore from "@/utils/store/userStore";
import { Toasts } from "@backpackapp-io/react-native-toast";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });
  const { theme } = useTheme();
  const [appIsReady, setAppIsReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState<Href<string> | null>(null);
  const { fetchUserProfile } = useUserStore();

  useEffect(() => {
    async function determineInitialRoute(): Promise<Href<string>> {
      // Task: Initialize SuperTokens
      SuperTokens.init({
        apiDomain: ENV.AUTH_APP_DOMAIN,
      });

      // Task: Authentication Check
      const isLoggedIn = await SuperTokens.doesSessionExist();
      let determinedRoute: Href<string>;

      if (isLoggedIn) {
        SuperTokens.addAxiosInterceptors(apiClient);
        await fetchUserProfile();
        determinedRoute = "/(tabs)";
      } else {
        determinedRoute = "/";
      }

      return determinedRoute;
    }

    async function prepareApp() {
      if (fontsLoaded || fontError) {
        if (fontError) {
          console.error("Font loading error:", fontError);
          // Optionally, handle font loading errors, e.g., by navigating to a fallback
        }
        try {
          const route = await determineInitialRoute();
          setInitialRoute(route);
        } catch (e) {
          console.error("Error during app initialization or startup tasks:", e);
          setInitialRoute("/"); // Fallback route
        } finally {
          setAppIsReady(true); // Signal that app data is ready, layout can render
        }
      }
    }

    prepareApp();
  }, [fontsLoaded, fontError]); // Effect runs when font status changes

  useEffect(() => {
    if (appIsReady && initialRoute) {
      router.replace(initialRoute);
      SplashScreen.hideAsync(); // Hide splash screen after navigation
    }
  }, [appIsReady, initialRoute, router]); // Effect runs when app is ready and route is determined

  useAudioEvents();

  if (!appIsReady) {
    return null; // Render nothing while app is preparing and splash screen is active
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? darkTheme : lightTheme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {/* Ensure GestureHandlerRootView fills the screen - removed stray space from here */}
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <Toasts
          defaultStyle={{
            view: {
              backgroundColor: theme.colors.background,
              borderWidth: 1,
              borderColor: theme.colors.secondaryForeground,
              borderRadius: theme.vw(4),
            },
            text: {
              color: theme.colors.text,
              fontFamily: theme.fontFamily.medium,
            },
            indicator: {
              backgroundColor: theme.colors.background,
              display: "none",
            },
            pressable: {
              borderRadius: theme.vw(4),
            },
          }}
        />
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
