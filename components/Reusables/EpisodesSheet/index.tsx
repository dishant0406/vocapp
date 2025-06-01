import { makeStyles } from "@/utils/theme/makeStyles";
import { useTheme } from "@/utils/theme/useTheme";
import { Podcast } from "@/utils/types/podcast";
import React from "react";
import { Text, TextStyle, View, ViewStyle } from "react-native";
import EpisodeCard from "./EpisodeCard";

type Props = {
  podcast: Podcast;
};

const EpisodesSheet = ({ podcast }: Props) => {
  const { theme } = useTheme();
  const styles = madeStyles(theme);

  return (
    <View style={styles.sheetContainer}>
      <View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>All Episodes</Text>
        </View>
        <View style={styles.episodesContainer}>
          {podcast.episodes.map((episode, index) => (
            <EpisodeCard
              imageUrl={podcast.coverImage}
              key={index}
              episode={episode}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const madeStyles = makeStyles((theme) => {
  return {
    sheetContainer: {
      marginTop: theme.vh(2),
      paddingBottom: theme.vh(6),
      paddingHorizontal: theme.vw(4),
    } as ViewStyle,
    titleContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingBottom: theme.vh(1),
    } as ViewStyle,
    title: {
      fontSize: theme.fontSizes.mediumSmall,
      color: theme.colors.text,
      fontWeight: theme.fontWeights.bold,
      fontFamily: theme.fontFamily.bold,
    } as TextStyle,
    link: {
      fontSize: theme.fontSizes.small,
      color: theme.colors.tag,
      fontWeight: theme.fontWeights.bold,
      fontFamily: theme.fontFamily.bold,
    } as TextStyle,
    episodesContainer: {
      gap: theme.vh(2),
    } as ViewStyle,
  };
});

export default EpisodesSheet;
