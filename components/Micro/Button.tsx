import { CustomTheme } from "@/utils/theme/theme";
import { useTheme } from "@/utils/theme/useTheme";
import React, { forwardRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { vh, vw } from "react-native-expo-typescript-viewport-units";

type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";
type ButtonSize = "default" | "sm" | "lg";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  fullWidth?: boolean;
  disabled?: boolean;
}

const Button = forwardRef<
  React.ElementRef<typeof TouchableOpacity>,
  ButtonProps
>(
  (
    {
      variant = "default",
      size = "default",
      children,
      onPress,
      style,
      fullWidth = false,
      disabled = false,
    },
    ref
  ) => {
    const [isPressed, setIsPressed] = useState(false);
    const { theme } = useTheme();
    const styles = makeStyles(theme);

    const getButtonVariantStyle = (
      variant: ButtonVariant,
      disabled: boolean
    ): ViewStyle => {
      const baseStyle = {
        default: styles.defaultButtonVariant,
        destructive: styles.destructiveButtonVariant,
        outline: styles.outlineButtonVariant,
        secondary: styles.secondaryButtonVariant,
        ghost: {},
        link: {},
      }[variant];

      return disabled
        ? { ...baseStyle, ...styles.disabledButtonVariant }
        : baseStyle;
    };

    const getTextVariantStyle = (
      variant: ButtonVariant,
      disabled: boolean
    ): TextStyle => {
      const baseStyle = {
        default: styles.defaultTextVariant,
        destructive: styles.destructiveTextVariant,
        outline: styles.outlineTextVariant,
        secondary: styles.secondaryTextVariant,
        ghost: styles.ghostTextVariant,
        link: styles.linkTextVariant,
      }[variant];

      return disabled
        ? { ...baseStyle, ...styles.disabledTextVariant }
        : baseStyle;
    };

    const getSizeStyle = (size: ButtonSize): ViewStyle => {
      return {
        sm: styles.smSize,
        lg: styles.lgSize,
        default: styles.defaultSize,
      }[size];
    };

    return (
      <TouchableOpacity
        ref={ref}
        style={[
          styles.button,
          getButtonVariantStyle(variant, disabled),
          getSizeStyle(size),
          fullWidth && styles.fullWidth,
          isPressed && !disabled && styles.pressed,
          style,
        ]}
        onPress={onPress}
        onPressIn={() => !disabled && setIsPressed(true)}
        onPressOut={() => !disabled && setIsPressed(false)}
        disabled={disabled}
      >
        <Text style={[styles.text, getTextVariantStyle(variant, disabled)]}>
          {children}
        </Text>
      </TouchableOpacity>
    );
  }
);

const makeStyles = (theme: CustomTheme) =>
  StyleSheet.create({
    button: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: vw(2),
      alignSelf: "flex-start",
    },
    fullWidth: {
      alignSelf: "stretch",
    },
    text: {
      fontSize: vw(3.5),
      fontWeight: "500",
    },
    pressed: {
      opacity: 0.8,
    },
    defaultButtonVariant: {
      backgroundColor: theme.colors.tint,
    },
    defaultTextVariant: {
      color: theme.colors.text,
    },
    destructiveButtonVariant: {
      backgroundColor: theme.colors.destructive,
    },
    destructiveTextVariant: {
      color: theme.colors.destructiveForeground,
    },
    outlineButtonVariant: {
      borderWidth: vw(0.25),
      borderColor: theme.colors.input,
    },
    outlineTextVariant: {
      color: theme.colors.foreground,
    },
    secondaryButtonVariant: {
      backgroundColor: theme.colors.secondary,
    },
    secondaryTextVariant: {
      color: theme.colors.secondaryForeground,
    },
    ghostTextVariant: {
      color: theme.colors.foreground,
    },
    linkTextVariant: {
      color: theme.colors.primary,
    },
    disabledButtonVariant: {
      backgroundColor: theme.colors.muted,
      borderColor: theme.colors.muted,
    },
    disabledTextVariant: {
      color: theme.colors.mutedForeground,
    },
    defaultSize: {
      height: vh(5),
      paddingHorizontal: vw(4),
    },
    smSize: {
      height: vh(4.5),
      paddingHorizontal: vw(3),
      borderRadius: vw(1.5),
    },
    lgSize: {
      height: vh(5.5),
      paddingHorizontal: vw(8),
      borderRadius: vw(2),
    },
  });

Button.displayName = "Button";

export { Button };
