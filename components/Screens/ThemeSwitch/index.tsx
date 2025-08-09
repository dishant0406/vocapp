import Header from "@/components/Reusables/Header";
import { useColorScheme } from "@/hooks/useColorScheme";
import useThemeStore, { ThemeMode } from "@/utils/store/themeStore";
import { makeStyles } from "@/utils/theme/makeStyles";
import { useTheme } from "@/utils/theme/useTheme";
import {
  Moon02Icon,
  Settings04Icon,
  Sun03Icon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ImageStyle,
  SafeAreaView,
  Switch,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from "react-native";

const ThemeSwitch = () => {
  const { theme, themeMode } = useTheme();
  const styles = madeStyles(theme);
  const { setThemeMode } = useThemeStore();
  const systemColorScheme = useColorScheme();
  const router = useRouter();

  const getEffectiveTheme = () => {
    if (themeMode === "system") {
      return systemColorScheme === "dark" ? "dark" : "light";
    }
    return themeMode;
  };

  const effectiveTheme = getEffectiveTheme();
  const isDark = effectiveTheme === "dark";

  const handleThemeToggle = () => {
    const newMode: ThemeMode = isDark ? "light" : "dark";
    setThemeMode(newMode);
  };

  const handleSystemToggle = () => {
    setThemeMode("system");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Theme" />

      {/* Main Content */}
      <View style={styles.screenContainer}>
        {/* App Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/images/icon.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Theme Status */}
        <View style={styles.themeStatus}>
          <Text style={styles.themeTitle}>
            {themeMode === "system" 
              ? `System (${effectiveTheme === "dark" ? "Dark" : "Light"})`
              : effectiveTheme === "dark" 
                ? "Dark Mode" 
                : "Light Mode"
            }
          </Text>
          <Text style={styles.themeSubtitle}>
            {themeMode === "system"
              ? "Follows your device settings"
              : effectiveTheme === "dark"
                ? "Easy on the eyes in low light"
                : "Bright and clear for daytime use"
            }
          </Text>
        </View>

        {/* Theme Controls */}
        <View style={styles.controls}>
          {/* Manual Theme Toggle */}
          <View style={[styles.controlRow, styles.controlRowBorder]}>
            <View style={styles.controlLeft}>
              <HugeiconsIcon
                icon={isDark ? Moon02Icon : Sun03Icon}
                size={theme.vw(6)}
                color={theme.colors.text}
              />
              <View style={styles.controlText}>
                <Text style={styles.controlTitle}>
                  {isDark ? "Dark" : "Light"} Mode
                </Text>
                <Text style={styles.controlSubtitle}>
                  Manual theme selection
                </Text>
              </View>
            </View>
            <Switch
              value={isDark && themeMode !== "system"}
              onValueChange={handleThemeToggle}
              trackColor={{
                false: theme.colors.muted,
                true: theme.colors.primary,
              }}
              thumbColor={theme.colors.background}
              disabled={themeMode === "system"}
            />
          </View>

          {/* System Theme Toggle */}
          <View style={styles.controlRow}>
            <View style={styles.controlLeft}>
              <HugeiconsIcon
                icon={Settings04Icon}
                size={theme.vw(6)}
                color={theme.colors.text}
              />
              <View style={styles.controlText}>
                <Text style={styles.controlTitle}>
                  Use System Setting
                </Text>
                <Text style={styles.controlSubtitle}>
                  Follow device appearance
                </Text>
              </View>
            </View>
            <Switch
              value={themeMode === "system"}
              onValueChange={handleSystemToggle}
              trackColor={{
                false: theme.colors.muted,
                true: theme.colors.primary,
              }}
              thumbColor={theme.colors.background}
            />
          </View>
        </View>

        {/* Theme Preview Icons */}
        <View style={styles.previewContainer}>
          <TouchableOpacity
            style={[
              styles.previewButton,
              !isDark && themeMode !== "system" && styles.previewButtonActive
            ]}
            onPress={() => setThemeMode("light")}
            activeOpacity={0.8}
          >
            <HugeiconsIcon
              icon={Sun03Icon}
              size={theme.vw(8)}
              color={!isDark && themeMode !== "system" ? theme.colors.primary : theme.colors.mutedForeground}
            />
            <Text style={[
              styles.previewText,
              !isDark && themeMode !== "system" && styles.previewTextActive
            ]}>
              Light
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.previewButton,
              isDark && themeMode !== "system" && styles.previewButtonActive
            ]}
            onPress={() => setThemeMode("dark")}
            activeOpacity={0.8}
          >
            <HugeiconsIcon
              icon={Moon02Icon}
              size={theme.vw(8)}
              color={isDark && themeMode !== "system" ? theme.colors.primary : theme.colors.mutedForeground}
            />
            <Text style={[
              styles.previewText,
              isDark && themeMode !== "system" && styles.previewTextActive
            ]}>
              Dark
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.previewButton,
              themeMode === "system" && styles.previewButtonActive
            ]}
            onPress={() => setThemeMode("system")}
            activeOpacity={0.8}
          >
            <HugeiconsIcon
              icon={Settings04Icon}
              size={theme.vw(8)}
              color={themeMode === "system" ? theme.colors.primary : theme.colors.mutedForeground}
            />
            <Text style={[
              styles.previewText,
              themeMode === "system" && styles.previewTextActive
            ]}>
              Auto
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ThemeSwitch;

const madeStyles = makeStyles((theme) => {
  return {
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: theme.statusBarHeight,
    } as ViewStyle,
    screenContainer: {
      flex: 1,
      paddingHorizontal: theme.vw(4),
      paddingTop: theme.vh(2),
    } as ViewStyle,
    logoContainer: {
      alignItems: "center",
      marginBottom: theme.vh(5),
    } as ViewStyle,
    logo: {
      width: theme.vw(30),
      height: theme.vw(30),
      borderRadius: theme.vw(7.5),
    } as ImageStyle,
    themeStatus: {
      alignItems: "center",
      marginBottom: theme.vh(6),
    } as ViewStyle,
    themeTitle: {
      fontSize: theme.fontSizes.mediumLarge,
      fontWeight: theme.fontWeights.bold,
      fontFamily: theme.fontFamily.bold,
      marginBottom: theme.vh(1),
      color: theme.colors.text,
    } as TextStyle,
    themeSubtitle: {
      fontSize: theme.fontSizes.medium,
      fontFamily: theme.fontFamily.regular,
      textAlign: "center",
      lineHeight: theme.vh(3),
      color: theme.colors.mutedForeground,
    } as TextStyle,
    controls: {
      marginBottom: theme.vh(5),
    } as ViewStyle,
    controlRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: theme.vh(2),
    } as ViewStyle,
    controlRowBorder: {
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    } as ViewStyle,
    controlLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    } as ViewStyle,
    controlText: {
      marginLeft: theme.vw(4),
      flex: 1,
    } as ViewStyle,
    controlTitle: {
      fontSize: theme.fontSizes.medium,
      fontWeight: theme.fontWeights.medium,
      fontFamily: theme.fontFamily.medium,
      marginBottom: theme.vh(0.3),
      color: theme.colors.text,
    } as TextStyle,
    controlSubtitle: {
      fontSize: theme.fontSizes.small,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.mutedForeground,
    } as TextStyle,
    previewContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      paddingHorizontal: theme.vw(2.5),
    } as ViewStyle,
    previewButton: {
      alignItems: "center",
      padding: theme.vw(5),
      borderRadius: theme.vw(4),
      minWidth: theme.vw(20),
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
    } as ViewStyle,
    previewButtonActive: {
      borderWidth: 2,
      borderColor: theme.colors.primary,
    } as ViewStyle,
    previewText: {
      marginTop: theme.vh(1),
      fontSize: theme.fontSizes.small,
      fontWeight: theme.fontWeights.medium,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.mutedForeground,
    } as TextStyle,
    previewTextActive: {
      color: theme.colors.primary,
      fontFamily: theme.fontFamily.medium,
    } as TextStyle,
  };
});