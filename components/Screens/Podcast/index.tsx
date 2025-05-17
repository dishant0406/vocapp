import Duration from "@/components/Reusables/Duration";
import EpisodesSheet from "@/components/Reusables/EpisodesSheet";
import IconButton from "@/components/Reusables/IconButton";
import { ALL_PODCASTS } from "@/utils/constants";
import { makeStyles } from "@/utils/theme/makeStyles";
import { useTheme } from "@/utils/theme/useTheme";
import { ArrowLeft01Icon, Bookmark01Icon } from "@hugeicons/core-free-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ImageStyle,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

const Podcast: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme } = useTheme();
  const styles = madeStyles(theme);

  const podcast = ALL_PODCASTS.find((podcast) => podcast.id === id);

  if (!podcast) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Podcast not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: podcast?.imageUrl }} style={styles.image} />
      <View style={styles.imageMask} />

      <IconButton
        icon={ArrowLeft01Icon}
        position="leftButton"
        onPress={() => router.back()}
      />

      <IconButton
        icon={Bookmark01Icon}
        position="rightButton"
        onPress={() => {}}
      />

      <Text style={styles.title}>{podcast?.name}</Text>
      <View style={styles.durationContainer}>
        <Duration duration={podcast?.duration} />
      </View>
      <Text style={styles.desc}>
        {podcast?.description || "No description available."}
      </Text>
      <EpisodesSheet podcast={podcast} />
    </View>
  );
};

export default Podcast;

const madeStyles = makeStyles((theme) => {
  return {
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    } as ViewStyle,
    image: {
      width: theme.vw(100),
      height: theme.vh(40),
      borderBottomLeftRadius: theme.vw(10),
      borderBottomRightRadius: theme.vw(10),
    } as ImageStyle,
    imageMask: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: theme.vh(40),
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: theme.vw(10),
      borderTopRightRadius: theme.vw(10),
      opacity: 0.2,
    } as ViewStyle,
    title: {
      fontSize: theme.fontSizes.mediumLarge,
      color: theme.colors.text,
      fontWeight: theme.fontWeights.bold,
      textAlign: "center",
      marginTop: theme.vh(3),
      paddingHorizontal: theme.vw(10),
      fontFamily: theme.fontFamily.bold,
    } as TextStyle,
    desc: {
      fontSize: theme.fontSizes.small,
      color: theme.colors.mutedForeground,
      textAlign: "center",
      marginTop: theme.vh(2),
      paddingHorizontal: theme.vw(5),
      fontFamily: theme.fontFamily.regular,
      lineHeight: theme.vh(2.5),
      letterSpacing: 0.3,
    } as TextStyle,
    durationContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginTop: theme.vh(0.5),
    } as ViewStyle,
  };
});
