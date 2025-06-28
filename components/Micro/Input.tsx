import { CustomTheme } from "@/utils/theme/theme";
import { useTheme } from "@/utils/theme/useTheme";
import React, { forwardRef } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableWithoutFeedback,
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
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  keyboardAvoidingEnabled?: boolean; // New prop to control keyboard avoiding behavior
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
      keyboardAvoidingEnabled = false,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();
    const styles = makeStyles(theme);

    const InputComponent = (
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

    // Wrap with keyboard avoiding view if enabled
    if (keyboardAvoidingEnabled) {
      return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.keyboardAvoidingView}
          >
            {InputComponent}
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      );
    }

    // If keyboard avoiding is disabled, just wrap with TouchableWithoutFeedback for keyboard dismissal
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>{InputComponent}</View>
      </TouchableWithoutFeedback>
    );
  }
);

const makeStyles = (theme: CustomTheme) =>
  StyleSheet.create({
    keyboardAvoidingView: {
      width: "100%",
    },
    container: {
      width: "100%",
      marginBottom: vh(2),
    },
    label: {
      fontSize: vw(4),
      fontWeight: "500",
      color: theme.colors.foreground,
      marginBottom: vh(1),
    },
    inputContainer: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.colors.input,
      borderRadius: vw(2),
      backgroundColor: theme.colors.background,
      minHeight: vh(6), // Ensure consistent height
    },
    input: {
      flex: 1,
      width: "100%",
      paddingHorizontal: vw(3),
      paddingVertical: vh(2),
      fontSize: vw(4),
      color: theme.colors.foreground,
      minHeight: Platform.OS === "android" ? vh(6) : undefined, // Android specific fix
    },
    affixContainer: {
      paddingHorizontal: vw(3),
      justifyContent: "center",
      alignItems: "center",
      minHeight: vh(6), // Match input container height
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
