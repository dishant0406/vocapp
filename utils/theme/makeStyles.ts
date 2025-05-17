import { StyleSheet as RNStyleSheet, StyleSheet } from "react-native";
import { CustomTheme } from "./theme";

// Use RN's built-in NamedStyles for typing
export function makeStyles<
  T extends RNStyleSheet.NamedStyles<T>,
  P extends object = {}
>(styles: (theme: CustomTheme, props: P) => T) {
  return (theme: CustomTheme, props: P = {} as P): T =>
    StyleSheet.create(styles(theme, props));
}
