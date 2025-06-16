import React, { useRef } from "react";

import { Tabs } from "expo-router";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";

import {
  Home11Icon,
  PodcastIcon,
  StarSquareIcon,
} from "@hugeicons/core-free-icons";

import CreateSheet from "@/components/Reusables/CreateSheet";
import { useAudioPlayerState } from "@/utils/hooks/audioEvents";
import { makeStyles, useTheme } from "@/utils/theme/useTheme";
import { TouchableOpacity, ViewStyle } from "react-native";
import { ActionSheetRef } from "react-native-actions-sheet";

export default function TabLayout() {
  const { theme } = useTheme();
  const { currentTrack } = useAudioPlayerState();
  const sheetRef = useRef<ActionSheetRef>(null);
  const styles = madeStyles(theme, {
    isPlaying: currentTrack?.url ? true : false,
  });

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.colors.text,
          headerShown: false,
          tabBarStyle: styles.tabBar,
          headerShadowVisible: false,
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
          name="create"
          options={{
            title: "",
            tabBarButton: () => (
              <TouchableOpacity
                onPress={() => {
                  if (sheetRef.current) {
                    sheetRef.current.show();
                  }
                }}
                style={styles.createButton}
              >
                <TabBarIcon color={theme.colors.text} icon={PodcastIcon} />
              </TouchableOpacity>
            ),
          }}
        />

        <Tabs.Screen
          name="bookmark"
          options={{
            title: "",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon color={color} icon={StarSquareIcon} />
            ),
          }}
        />
      </Tabs>
      <CreateSheet ref={sheetRef} />
    </>
  );
}

const madeStyles = makeStyles((theme, { isPlaying }: StyleProps) => ({
  tabBar: {
    backgroundColor: theme.colors.tint,
    borderTopLeftRadius: isPlaying ? 0 : theme.vw(10),
    borderTopRightRadius: isPlaying ? 0 : theme.vw(10),
    paddingTop: theme.vh(1.5),
    height: theme.vh(12),
    borderRightColor: theme.colors.tint,
    borderLeftColor: theme.colors.tint,
    borderTopColor: theme.colors.tint,
    borderWidth: 1,
  } as ViewStyle,
  createButton: {
    marginTop: -theme.vh(0.5),
    alignItems: "center",
    justifyContent: "center",
    height: theme.vh(6.5),
    width: theme.vh(6.5),
    borderRadius: theme.vw(10),
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.mutedForeground,
    borderWidth: 1,
  } as ViewStyle,
}));

type StyleProps = {
  isPlaying: boolean;
};
