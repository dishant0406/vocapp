import { makeStyles } from "@/utils/theme/makeStyles";
import { useTheme } from "@/utils/theme/useTheme";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TextStyle, View, ViewStyle } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

type Props = {
  title: string;
};

const Header = (props: Props) => {
  const { theme } = useTheme();
  const styles = madeStyles(theme);
  const router = useRouter();

  const { title } = props;

  const onPress = () => {
    router.back();
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.iconButton]}
        onPress={onPress}
      >
        <HugeiconsIcon
          icon={ArrowLeft01Icon}
          size={theme.vw(6)}
          color={theme.colors.text}
          strokeWidth={2.2}
        />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.spacer} />
    </View>
  );
};

const madeStyles = makeStyles((theme) => {
  const headerPosition: ViewStyle = {
    backgroundColor: theme.colors.tint,
    borderRadius: theme.vw(10),
    padding: theme.vw(4),
  };

  return {
    iconButton: {
      ...headerPosition,
      shadowColor: theme.colors.text,
    } as ViewStyle,
    header: {
      paddingHorizontal: theme.vw(4),
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.vh(2),
    } as ViewStyle,
    titleContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    } as ViewStyle,
    spacer: {
      width: theme.vw(6) + theme.vw(8), // icon size + padding to match button width
    } as ViewStyle,
    title: {
      fontSize: theme.fontSizes.medium,
      color: theme.colors.text,
      fontWeight: "bold",
      fontFamily: theme.fontFamily.bold,
    } as TextStyle,
  };
});

export default Header;
