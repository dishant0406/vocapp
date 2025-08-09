import { useColorScheme } from "@/hooks/useColorScheme";
import useThemeStore from "../store/themeStore";
import { darkTheme, lightTheme } from "./theme";

export { makeStyles } from "./makeStyles";

export const useTheme = () => {
  const systemColorScheme = useColorScheme();
  const { themeMode } = useThemeStore();

  const getEffectiveTheme = () => {
    if (themeMode === "system") {
      return systemColorScheme === "dark" ? darkTheme : lightTheme;
    }
    return themeMode === "dark" ? darkTheme : lightTheme;
  };

  return {
    theme: getEffectiveTheme(),
    themeMode,
    systemColorScheme,
  };
};
