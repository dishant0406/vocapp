// Importing HugeIcons instead of Expo vector icons
import { HugeiconsIcon } from "@hugeicons/react-native";
import { type ComponentProps } from "react";

export function TabBarIcon({
  style,
  icon,
  color,
}: ComponentProps<typeof HugeiconsIcon>) {
  return (
    <HugeiconsIcon
      size={28}
      style={[{ marginBottom: -3 }, style]}
      icon={icon}
      color={color}
    />
  );
}
