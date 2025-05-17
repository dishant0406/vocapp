import { makeStyles, useTheme } from "@/utils/theme/useTheme";
import { HugeiconsIcon } from "@hugeicons/react-native";
import Constants from "expo-constants";
import { TouchableOpacity, ViewStyle } from "react-native";

const statusBarHeight = Constants.statusBarHeight;

const IconButton: React.FC<IconButtonProps> = ({ icon, position, onPress }) => {
  const { theme } = useTheme();
  const styles = madeStyles(theme);
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[styles.iconButton, styles[position]]}
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
    top: theme.vh(2) + statusBarHeight,
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
};

export default IconButton;
