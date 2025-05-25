import Duration from "@/components/Reusables/Duration";
import EpisodesSheet from "@/components/Reusables/EpisodesSheet";
import IconButton from "@/components/Reusables/IconButton";
import Loader from "@/components/Reusables/Loader";
import handleApiCall from "@/utils/api/apiHandler";
import { getPodcastById } from "@/utils/api/calls";
import { makeStyles } from "@/utils/theme/makeStyles";
import { useTheme } from "@/utils/theme/useTheme";
import { Podcast } from "@/utils/types/podcast";
import { ArrowLeft01Icon, Bookmark01Icon } from "@hugeicons/core-free-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ImageStyle,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

const SinglePodcast: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme } = useTheme();
  const styles = madeStyles(theme);
  const [podcast, setPodcast] = useState<Podcast | null>(null);

  useEffect(() => {
    (async () => {
      handleApiCall(getPodcastById, [id], {
        onSuccess: (data) => {
          setPodcast(data);
        },
        onError: (error) => {
          console.error("Error fetching podcast:", error);
        },
      });
    })();
  }, [id]);

  if (!podcast) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: podcast?.coverImage }} style={styles.image} />
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

      <Text style={styles.title}>{podcast?.title}</Text>
      <View style={styles.durationContainer}>
        <Duration duration={podcast?.averageDuration} />
      </View>
      <Text numberOfLines={5} style={styles.desc}>
        {podcast?.description || "No description available."}
      </Text>
      <EpisodesSheet podcast={podcast} />
    </View>
  );
};

export default SinglePodcast;

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
      fontSize: theme.fontSizes.medium,
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
