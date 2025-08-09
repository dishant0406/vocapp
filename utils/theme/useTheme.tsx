import { useColorScheme } from "@/hooks/useColorScheme";
import { darkTheme, lightTheme } from "./theme";

export { makeStyles } from "./makeStyles";

export const useTheme = () => {
  const colorScheme = useColorScheme();

  return {
    theme: colorScheme === "dark" ? darkTheme : lightTheme,
    // theme: darkTheme, // Force dark theme for now
  };
};
