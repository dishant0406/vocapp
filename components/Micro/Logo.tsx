import { useTheme } from "@/utils/theme/useTheme";
import React from "react";
import {
  Image,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

const Logo = (props: Props) => {
  const {
    height = 100,
    width = 100,
    style = {},
    text = "Vocapp",
    textStyle = {},
    showText = false,
  } = props;
  const { theme } = useTheme();

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
        ...(style as object),
      }}
    >
      <Image
        source={require("../../assets/images/icon.png")}
        style={{
          height,
          width,
          resizeMode: "contain",
        }}
      />
      {showText && (
        <Text
          style={{
            fontSize: 20,
            textAlign: "center",
            fontWeight: "500",
            color: theme.colors.text,
            ...(textStyle as object),
          }}
        >
          {text}
        </Text>
      )}
    </View>
  );
};

export default Logo;

type Props = {
  height?: number;
  width?: number;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  text?: string;
  showText?: boolean;
};
