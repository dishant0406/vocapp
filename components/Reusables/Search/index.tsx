import { makeStyles } from "@/utils/theme/makeStyles";
import { useTheme } from "@/utils/theme/useTheme";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { usePathname, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { TextStyle, View, ViewStyle } from "react-native";
import { TextInput } from "react-native-gesture-handler";

const Search = () => {
  const { theme } = useTheme();
  const styles = madeStyles(theme);
  const [term, setTerm] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setTerm("");
  }, [pathname]);

  return (
    <View style={styles.container}>
      <HugeiconsIcon
        icon={Search01Icon}
        color={theme.colors.mutedForeground}
        style={styles.searchIcon}
      />
      <TextInput
        placeholder="Search for any podcast"
        placeholderTextColor={theme.colors.mutedForeground}
        style={styles.searchInput}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="off"
        textAlign="left"
        textAlignVertical="center"
        selectionColor={theme.colors.text}
        underlineColorAndroid="transparent"
        clearButtonMode="never"
        onSubmitEditing={() => {
          if (term.trim()) {
            router.push(
              `/podcasts?sort=search&query=${encodeURIComponent(term)}`
            );
          }
        }}
        onChange={(e) => setTerm(e.nativeEvent.text)}
        value={term}
        returnKeyType="search"
      />
      {/* <HugeiconsIcon
        icon={Mic01Icon}
        color={theme.colors.mutedForeground}
        style={[styles.searchIcon, { marginLeft: theme.vw(2) }]}
      /> */}
    </View>
  );
};

export default Search;

const madeStyles = makeStyles((theme) => ({
  container: {
    height: theme.vh(8),
    width: theme.vw(92),
    backgroundColor: theme.colors.tint,
    borderRadius: theme.vw(4),
    marginHorizontal: theme.vw(4),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.vw(4),
    marginBottom: theme.vh(2),
  } as ViewStyle,
  searchIcon: {
    fontSize: theme.vw(6),
    color: theme.colors.mutedForeground,
  } as TextStyle,
  searchInput: {
    flex: 1,
    fontSize: theme.fontSizes.small,
    color: theme.colors.text,
    marginLeft: theme.vw(2),
    fontFamily: theme.fontFamily.regular,
  } as TextStyle,
}));
