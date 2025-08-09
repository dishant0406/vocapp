// theme.ts
import {
  DefaultTheme,
  Theme as NavigationTheme,
} from "@react-navigation/native";
import Constants from "expo-constants";
import { vh, vw } from "react-native-expo-typescript-viewport-units";

const statusBarHeight = Constants.statusBarHeight;

export interface CustomTheme extends Omit<NavigationTheme, "colors"> {
  colors: NavigationTheme["colors"] & {
    foreground: string;
    cardForeground: string;
    popover: string;
    popoverForeground: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    destructive: string;
    destructiveForeground: string;
    input: string;
    ring: string;
    radius: string;
    chart1: string;
    chart2: string;
    chart3: string;
    chart4: string;
    chart5: string;
    tsprimary: string;
    tssecondary: string;
    myblack: string;
    tint: string;
    tag: string;
  };
  vh: (value: number) => number;
  vw: (value: number) => number;
  spacingY: (value: number) => number;
  spacingX: (value: number) => number;
  spacing: (value: number) => number;
  statusBarHeight: number;
  fontSizes: {
    extraSmall: number;
    small: number;
    medium: number;
    large: number;
    mediumSmall: number;
    mediumLarge: number;
    largeSmall: number;
  };
  fontWeights: {
    regular: string;
    medium: string;
    bold: string;
  };
  fontFamily: {
    regular: string;
    medium: string;
    bold: string;
    extraBold: string;
  };
  zIndex: {
    zero: number;
    normal: number;
    high: number;
    higher: number;
    highest: number;
    modal: number;
    overlay: number;
    absolute: number;
    sticky: number;
    fixed: number;
    relative: number;
    absoluteTop: number;
  };
}

const OTHER = {
  vh: (value: number) => vh(value),
  vw: (value: number) => vw(value),
  spacingY: (value: number) => vh(value),
  spacingX: (value: number) => vw(value),
  spacing: (value: number) => vh(value),
  statusBarHeight: statusBarHeight,
  fontSizes: {
    extraSmall: vh(1.2),
    small: vh(1.5),
    mediumSmall: vh(2),
    medium: vh(2.5),
    mediumLarge: vh(3),
    largeSmall: vh(3.2),
    large: vh(3.5),
  },
  fontWeights: {
    regular: "400",
    medium: "500",
    bold: "700",
  },
  fontFamily: {
    regular: "PlusJakartaSans_400Regular",
    medium: "PlusJakartaSans_500Medium",
    bold: "PlusJakartaSans_700Bold",
    extraBold: "PlusJakartaSans_800ExtraBold",
  },
  zIndex: {
    zero: 0,
    normal: 10,
    high: 20,
    higher: 30,
    highest: 40,
    modal: 50,
    overlay: 60,
    absolute: 70,
    sticky: 80,
    fixed: 90,
    relative: 100,
    absoluteTop: 110,
  },
};

export const lightTheme: CustomTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    // NavigationTheme required colors
    primary: "#3A3A3A", // Deeper, richer gray
    background: "#F2F2F2", // Neutral light gray, no yellow tint
    card: "#F8F8F8", // Clean light gray for cards
    text: "#2D2D2D", // Dark charcoal text
    border: "#D4D4D4", // Clean neutral border
    notification: "#B91C1C", // Deeper red
    tint: "#F5F5F5", // Clean neutral tint

    // Custom colors - Clean neutral palette
    foreground: "#2D2D2D", // Consistent darker text
    cardForeground: "#2D2D2D",
    popover: "#F8F8F8", // Clean light background for popovers
    tag: "#B8A9F5", // Muted purple tag
    popoverForeground: "#2D2D2D",
    primaryForeground: "#F5F5F5", // Clean light foreground
    secondary: "#ECECEC", // Neutral secondary background
    secondaryForeground: "#3A3A3A",
    muted: "#E5E5E5", // Clean muted background
    mutedForeground: "#6B6B6B", // Good contrast muted text
    accent: "#ECECEC", // Matches secondary
    accentForeground: "#3A3A3A",
    destructive: "#B91C1C", // Consistent with notification
    destructiveForeground: "#F5F5F5", // Clean foreground
    input: "#F0F0F0", // Neutral input background
    ring: "#4A4A4A", // Darker focus ring
    radius: "0.5rem",

    // Chart colors - slightly muted versions
    chart1: "#E85D45",
    chart2: "#2AA79B",
    chart3: "#2E4756",
    chart4: "#EEC23E",
    chart5: "#F57C36",
    tsprimary: "#4b99de",
    tssecondary: "#5fb94a",
    myblack: "#2D2D2D", // Clean neutral dark
  },
  ...OTHER,
};

export const darkTheme: CustomTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    // NavigationTheme required colors
    primary: "#FAFAFA",
    background: "#1f1501",
    card: "#1f1501",
    text: "#FAFAFA",
    border: "#262626",
    notification: "#7F1D1D",
    tint: "#000000",
    tag: "#bfb4ff",
    // Custom colors
    foreground: "#FAFAFA",
    cardForeground: "#FAFAFA",
    popover: "#1f1501",
    popoverForeground: "#FAFAFA",
    primaryForeground: "#171717",
    secondary: "#262626",
    secondaryForeground: "#FAFAFA",
    muted: "#262626",
    mutedForeground: "#A3A3A3",
    accent: "#262626",
    accentForeground: "#FAFAFA",
    destructive: "#7F1D1D",
    destructiveForeground: "#FAFAFA",
    input: "#262626",
    ring: "#D4D4D4",
    radius: "0.5rem",
    chart1: "#3B82F6",
    chart2: "#34D399",
    chart3: "#FCD34D",
    chart4: "#A78BFA",
    chart5: "#F87171",
    tsprimary: "#4b99de",
    tssecondary: "#5fb94a",
    myblack: "#1f1501",
  },
  ...OTHER,
};
