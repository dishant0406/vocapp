import { NO_DATA_LOTTIE } from "@/utils/constants";
import { makeStyles, useTheme } from "@/utils/theme/useTheme";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React from "react";
import { SafeAreaView, Text, TextStyle } from "react-native";
import IconButton from "../IconButton";

export const NoDataLottie = () => {
  const { theme } = useTheme();
  return (
    <LottieView
      source={{
        uri: NO_DATA_LOTTIE,
      }}
      autoPlay
      loop
      style={{
        width: 200,
        height: 200,
      }}
    />
  );
};

const NoData = ({ text }: NoDataType) => {
  const { theme } = useTheme();
  const styles = madeStyles(theme);
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <IconButton
        icon={ArrowLeft01Icon}
        position="leftButton"
        onPress={() => router.back()}
      />
      <NoDataLottie />
      <Text style={styles.text}>{text || "No data available"}</Text>
    </SafeAreaView>
  );
};

const madeStyles = makeStyles((theme) => {
  return {
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    text: {
      color: theme.colors.text,
      fontSize: theme.fontSizes.medium,
      textAlign: "center",
      marginTop: theme.vh(2),
      fontWeight: theme.fontWeights.bold,
    } as TextStyle,
  };
});

type NoDataType = {
  text?: string;
};

export default NoData;
