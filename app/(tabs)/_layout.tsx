import React from "react";

import { Tabs } from "expo-router";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";

import { CloudDownloadIcon, Home11Icon } from "@hugeicons/core-free-icons";

import { makeStyles, useTheme } from "@/utils/theme/useTheme";
import { ViewStyle } from "react-native";

export default function TabLayout() {
  const { theme } = useTheme();
  const styles = madeStyles(theme);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.text,
        headerShown: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon color={color} icon={Home11Icon} />
          ),
        }}
      />
      <Tabs.Screen
        name="download"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon color={color} icon={CloudDownloadIcon} />
          ),
        }}
      />
    </Tabs>
  );
}

const madeStyles = makeStyles((theme) => ({
  tabBar: {
    backgroundColor: theme.colors.tint,
    borderTopLeftRadius: theme.vw(10),
    borderTopRightRadius: theme.vw(10),
    paddingTop: theme.vh(1.5),
    height: theme.vh(12),
    borderRightColor: theme.colors.tint,
    borderLeftColor: theme.colors.tint,
    borderTopColor: theme.colors.tint,
    borderWidth: 1,
    position: "absolute",
  } as ViewStyle,
}));
