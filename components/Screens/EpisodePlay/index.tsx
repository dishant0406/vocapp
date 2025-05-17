import AudioPlayer from "@/components/Reusables/AudioPlayer";
import Disk from "@/components/Reusables/Disk";
import IconButton from "@/components/Reusables/IconButton";
import { ALL_PODCASTS } from "@/utils/constants";
import { makeStyles, useTheme } from "@/utils/theme/useTheme";
import { ArrowLeft01Icon, CloudDownloadIcon } from "@hugeicons/core-free-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView, Text, TextStyle, View, ViewStyle } from "react-native";

const EpisodePlay = () => {
  const { theme } = useTheme();
  const styles = madeStyles(theme);
  const { id, episode } = useLocalSearchParams<{
    id: string;
    episode: string;
  }>();
  const podcast = ALL_PODCASTS.find((podcast) => podcast.id === id);
  const episodeData = podcast?.episodes.find((ep) => ep.id === episode);
  const [isPlaying, setIsPlaying] = useState(false);

  if (!podcast || !episodeData) {
    return <></>;
  }

  const IMAGE = podcast?.imageUrl;

  const router = useRouter();
  return (
    <SafeAreaView>
      <IconButton
        icon={ArrowLeft01Icon}
        position="leftButton"
        onPress={() => router.back()}
      />
      <IconButton
        icon={CloudDownloadIcon}
        position="rightButton"
        onPress={() => {}}
      />
      <View style={styles.diskContainer}>
        <Disk isPlaying={isPlaying} image={IMAGE} />
      </View>
      <Text style={styles.title}>{episodeData.name}</Text>
      <AudioPlayer
        onPlayStateChange={setIsPlaying}
        url="https://cdn.jsdelivr.net/gh/rafaelreis-hotmart/Audio-Sample-files@master/sample.mp3"
      />
    </SafeAreaView>
  );
};

const madeStyles = makeStyles((theme) => {
  return {
    diskContainer: {
      width: theme.vw(100),
      marginTop: theme.vh(8),
      flexDirection: "row",
      justifyContent: "center",
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
  };
});

export default EpisodePlay;
