import { makeStyles } from "@/utils/theme/makeStyles";
import { useTheme } from "@/utils/theme/useTheme";
import React from "react";
import { Text, TextStyle, TouchableOpacity, ViewStyle } from "react-native";

type Props = {
  title: string;
  onPress?: () => void;
  selected?: boolean;
  style?: ViewStyle;
};

const Tag = (props: Props) => {
  const { theme } = useTheme();
  const { title, onPress = () => {}, selected = false } = props;
  const styles = madeStyles(theme, { selected });

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={{
        ...styles.pill,
        ...props.style,
      }}
    >
      <Text style={styles.pillText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Tag;

const madeStyles = makeStyles((theme, { selected }: StyleProp) => ({
  pill: {
    backgroundColor: theme.colors[selected ? "tag" : "tint"],
    borderRadius: theme.vw(10),
    paddingVertical: theme.vh(2),
    paddingHorizontal: theme.vh(2),
  } as ViewStyle,
  pillText: {
    color: theme.colors[selected ? "tint" : "mutedForeground"],
    fontSize: theme.fontSizes.small,
    fontWeight: theme.fontWeights.bold,
    fontFamily: theme.fontFamily.bold,
  } as TextStyle,
}));

type StyleProp = {
  selected: boolean;
};
