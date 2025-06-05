import { makeStyles } from "@/utils/theme/makeStyles";
import { useTheme } from "@/utils/theme/useTheme";
import { Time02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import React from "react";
import { ImageStyle, Text, TextStyle, View } from "react-native";

const Duration = ({ duration = 0 }: { duration?: number }) => {
  const formatDuration = (duration: number) => {
    const hours = Math.floor(duration / 60);
    const minutes = (duration % 60)?.toFixed(0);
    return `${hours > 0 ? `${hours?.toFixed(0)}h ` : ""}${minutes}m`;
  };
  const formattedDuration = formatDuration(duration || 0);
  const durationText = duration
    ? `${formattedDuration} remaining`
    : "30 min remaining";

  const { theme } = useTheme();
  const styles = maadeStyles(theme);
  return (
    <View style={styles.durationContainer}>
      <HugeiconsIcon
        icon={Time02Icon}
        size={theme.fontSizes.small}
        color={theme.colors.mutedForeground}
        strokeWidth={2.5}
      />
      <Text style={styles.duration}>{durationText}</Text>
    </View>
  );
};

export default Duration;

const maadeStyles = makeStyles((theme) => ({
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: theme.vh(0.5),
  } as ImageStyle,
  duration: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.mutedForeground,
    marginLeft: theme.vw(1),
    fontFamily: theme.fontFamily.bold,
  } as TextStyle,
}));
