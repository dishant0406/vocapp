import { ThemeProvider } from "@react-navigation/native";
import * as Linking from "expo-linking";
import * as NavigationBar from "expo-navigation-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LogLevel, OneSignal } from "react-native-onesignal";
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

import { useTheme } from "@/utils/theme/useTheme";

import { ENV } from "@/constants/variables";
import { apiClient } from "@/utils/api/client";
import { useAudioEvents } from "@/utils/hooks/audioEvents";
import useUserStore from "@/utils/store/userStore";
import { Toasts } from "@backpackapp-io/react-native-toast";

import { useAudioPlayerStore } from "@/utils/store/audioPlayer";
import useThemeStore from "@/utils/store/themeStore";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";

const statusBarHeight = Constants.statusBarHeight;

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const { themeMode } = useThemeStore();
  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });
  const { theme, systemColorScheme } = useTheme();
  const [appIsReady, setAppIsReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState<Href<string> | null>(null);
  const { fetchUserProfile, userProfile } = useUserStore();
  const { currentTrack } = useAudioPlayerStore();

  useEffect(() => {
    async function determineInitialRoute(): Promise<Href<string>> {
      // Task: Initialize SuperTokens
      SuperTokens.init({
        apiDomain: ENV.AUTH_APP_DOMAIN,
      });

      // Initialize OneSignal
      OneSignal.Debug.setLogLevel(LogLevel.Verbose); // Initialize with your OneSignal App ID
      OneSignal.initialize("aadd98f1-4da4-4294-bb3e-c972320a26f8");
      // Request push notification permission
      OneSignal.Notifications.requestPermission(false);

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

  // Effect to login with OneSignal when user profile is available
  useEffect(() => {
    if (userProfile?.id) {
      // Login with OneSignal using the user's ID as external ID
      OneSignal.login(userProfile.id);
    }
  }, [userProfile?.id]);

  useEffect(() => {
    Linking.addEventListener("url", (event) => {
      if (event.url === "trackplayer://notification.click") {
        if (currentTrack?.id) {
          router.dismissAll();
          router.replace(
            `/podcast/${currentTrack.podcastId}/${currentTrack.id}` as Href
          );
        }
      }
    });
  }, [currentTrack?.id]);

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync(theme.colors.tint);
    if (themeMode !== "system") {
      NavigationBar.setButtonStyleAsync(
        themeMode === "dark" ? "light" : "dark"
      );
    } else {
      NavigationBar.setButtonStyleAsync(
        systemColorScheme === "dark" ? "light" : "dark"
      );
    }
  }, [themeMode]);

  useAudioEvents();

  if (!appIsReady) {
    return null; // Render nothing while app is preparing and splash screen is active
  }

  return (
    <ThemeProvider value={theme}>
      <StatusBar
        style={
          themeMode === "system"
            ? "auto"
            : themeMode === "dark"
            ? "light"
            : "dark"
        }
      />
      <GestureHandlerRootView
        style={{
          flex: 1,
          paddingTop: statusBarHeight,
          backgroundColor: theme.colors.background,
        }}
      >
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
          fixAndroidInsets
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
