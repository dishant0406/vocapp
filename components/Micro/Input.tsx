import { CustomTheme } from "@/utils/theme/theme";
import { useTheme } from "@/utils/theme/useTheme";
import React, { forwardRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { vh, vw } from "react-native-expo-typescript-viewport-units";

interface InputProps extends React.ComponentProps<typeof TextInput> {
  label?: string;
  error?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputContainerStyle?: ViewStyle;
  inputStyle?: TextStyle; // Changed from ViewStyle to TextStyle
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
}

const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      prefix,
      suffix,
      containerStyle,
      inputContainerStyle,
      inputStyle,
      labelStyle,
      errorStyle,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();
    const styles = makeStyles(theme);

    return (
      <View style={[styles.container, containerStyle]}>
        {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
        <View style={[styles.inputContainer, inputContainerStyle]}>
          {prefix && (
            <View style={styles.affixContainer}>
              {typeof prefix === "string" ? (
                <Text style={styles.affixText}>{prefix}</Text>
              ) : (
                prefix
              )}
            </View>
          )}
          <TextInput
            ref={ref}
            style={[styles.input, inputStyle]}
            placeholderTextColor={theme.colors.mutedForeground}
            {...props}
          />
          {suffix && (
            <View style={styles.affixContainer}>
              {typeof suffix === "string" ? (
                <Text style={styles.affixText}>{suffix}</Text>
              ) : (
                suffix
              )}
            </View>
          )}
        </View>
        {error && <Text style={[styles.error, errorStyle]}>{error}</Text>}
      </View>
    );
  }
);

const makeStyles = (theme: CustomTheme) =>
  StyleSheet.create({
    container: {
      width: "100%", // Make the container full width
      marginBottom: vh(2),
    },
    label: {
      fontSize: vw(4),
      fontWeight: "500",
      color: theme.colors.foreground,
      marginBottom: vh(1),
    },
    inputContainer: {
      width: "100%", // Ensure input container is full width
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.colors.input,
      borderRadius: vw(2),
      backgroundColor: theme.colors.background,
    },
    input: {
      flex: 1,
      width: "100%", // Ensure input takes full width within its container
      paddingHorizontal: vw(3),
      paddingVertical: vh(2),
      fontSize: vw(4),
      color: theme.colors.foreground,
    },
    affixContainer: {
      paddingHorizontal: vw(3),
      justifyContent: "center",
      alignItems: "center",
    },
    affixText: {
      fontSize: vw(4),
      color: theme.colors.mutedForeground,
    },
    error: {
      fontSize: vw(3),
      color: theme.colors.destructive,
      marginTop: vh(1),
    },
  });

Input.displayName = "Input";

export default Input;
