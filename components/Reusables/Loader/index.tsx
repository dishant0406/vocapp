import { LOADER_LOTTIE } from "@/utils/constants";
import { makeStyles, useTheme } from "@/utils/theme/useTheme";
import LottieView from "lottie-react-native";
import React from "react";
import { SafeAreaView } from "react-native";

const Loader = () => {
  const { theme } = useTheme();
  const styles = madeStyles(theme);
  return (
    <SafeAreaView style={styles.container}>
      <LottieView
        source={{
          uri: LOADER_LOTTIE,
        }}
        autoPlay
        loop
        style={{
          width: 200,
          height: 200,
        }}
      />
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
  };
});

export default Loader;
