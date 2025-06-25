import { makeStyles, useTheme } from "@/utils/theme/useTheme";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { TouchableOpacity, ViewStyle } from "react-native";

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  position,
  onPress,
  top,
  left,
  right,
}) => {
  const { theme } = useTheme();
  const styles = madeStyles(theme);

  // Create custom style based on provided position props
  const customPositionStyle: ViewStyle = {};

  if (top !== undefined) {
    customPositionStyle.top = top;
  }

  if (left !== undefined) {
    customPositionStyle.left = left;
  }

  if (right !== undefined) {
    customPositionStyle.right = right;
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[
        styles.iconButton,
        styles[position],
        Object.keys(customPositionStyle).length > 0 ? customPositionStyle : {},
      ]}
      onPress={onPress}
    >
      <HugeiconsIcon
        icon={icon}
        size={theme.vw(6)}
        color={theme.colors.text}
        strokeWidth={2.2}
      />
    </TouchableOpacity>
  );
};

const madeStyles = makeStyles((theme) => {
  const headerPosition: ViewStyle = {
    position: "absolute",
    top: theme.vh(2),
    backgroundColor: theme.colors.tint,
    borderRadius: theme.vw(10),
    padding: theme.vw(4),
    zIndex: theme.zIndex.normal,
  };

  return {
    iconButton: {
      ...headerPosition,
      shadowColor: theme.colors.text,
    } as ViewStyle,
    leftButton: {
      left: theme.vw(8),
    } as ViewStyle,
    rightButton: {
      right: theme.vw(8),
    } as ViewStyle,
  };
});

type IconButtonProps = {
  icon: any;
  position: "leftButton" | "rightButton";
  onPress: () => void;
  top?: number;
  left?: number;
  right?: number;
};

export default IconButton;
