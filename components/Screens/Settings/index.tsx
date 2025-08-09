import Header from "@/components/Reusables/Header";
import { makeStyles } from "@/utils/theme/makeStyles";
import { useTheme } from "@/utils/theme/useTheme";
import {
  ArrowRight01Icon,
  PaintBoardIcon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useRouter } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from "react-native";

type OptionProps = {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress: () => void;
};

const Option = ({ icon, title, subtitle, onPress }: OptionProps) => {
  const { theme } = useTheme();
  const styles = madeStyles(theme);
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.option}
    >
      <View style={styles.optionIconContainer}>
        <HugeiconsIcon
          icon={icon}
          color={theme.colors.text}
          size={theme.vw(8)}
        />
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionText}>{title}</Text>
          {subtitle && <Text style={styles.optionSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <HugeiconsIcon
        icon={ArrowRight01Icon}
        color={theme.colors.mutedForeground}
        size={theme.vw(8)}
      />
    </TouchableOpacity>
  );
};

const Settings = () => {
  const { theme } = useTheme();
  const styles = madeStyles(theme);
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Settings" />
      
      <View style={styles.screenContainer}>
        <View style={styles.optionsContainer}>
          <Option
            icon={PaintBoardIcon}
            title="Theme"
            subtitle="Customize app appearance"
            onPress={() => router.push("/theme")}
          />
          {/* Add more settings options here as needed */}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Settings;

const madeStyles = makeStyles((theme) => {
  return {
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: theme.statusBarHeight,
    } as ViewStyle,
    screenContainer: {
      paddingHorizontal: theme.vw(4),
    } as ViewStyle,
    optionsContainer: {
      marginTop: theme.vh(2),
      width: "100%",
    } as ViewStyle,
    option: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: theme.vh(2),
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      paddingTop: theme.vh(3),
      paddingHorizontal: theme.vw(2),
    } as ViewStyle,
    optionIconContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.vh(2),
      flex: 1,
    } as ViewStyle,
    optionTextContainer: {
      flex: 1,
    } as ViewStyle,
    optionText: {
      color: theme.colors.text,
      fontSize: theme.fontSizes.mediumSmall,
      fontFamily: theme.fontFamily.bold,
    } as TextStyle,
    optionSubtitle: {
      color: theme.colors.mutedForeground,
      fontSize: theme.fontSizes.small,
      fontFamily: theme.fontFamily.regular,
      marginTop: theme.vh(0.5),
    } as TextStyle,
  };
});
