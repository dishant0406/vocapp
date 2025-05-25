import { makeStyles } from "@/utils/theme/makeStyles";
import { useTheme } from "@/utils/theme/useTheme";
import { Podcast } from "@/utils/types/podcast";
import { Link } from "expo-router";
import React from "react";
import { Text, TextStyle, View, ViewStyle } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Cover from "../Cover";

type Props = {
  title?: string;
  podcasts: Podcast[];
};

const PodcastSection = (props: Props) => {
  const { title, podcasts } = props;
  const { theme } = useTheme();
  const styles = madeStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title || "Podcasts"}</Text>
        <Link href={"/"} style={styles.linkText}>
          See All
        </Link>
      </View>
      <View style={styles.coverContainer}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal
          contentContainerStyle={{ gap: theme.vw(4) }}
        >
          {podcasts.map((podcast, index) => (
            <Cover
              id={podcast.id}
              key={index}
              imageUrl={podcast.coverImage}
              title={podcast.title}
              duration={podcast.averageDuration}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default PodcastSection;

const madeStyles = makeStyles((theme) => {
  return {
    container: {
      width: theme.vw(100),
      paddingHorizontal: theme.vw(4),
    } as ViewStyle,
    title: {
      fontSize: theme.fontSizes.small,
      color: theme.colors.text,
      fontWeight: theme.fontWeights.bold,
      fontFamily: theme.fontFamily.bold,
    } as TextStyle,
    titleContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    } as ViewStyle,
    linkText: {
      fontSize: theme.fontSizes.small,
      color: theme.colors.tag,
      fontWeight: theme.fontWeights.bold,
      fontFamily: theme.fontFamily.bold,
    } as TextStyle,
    coverContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: theme.vh(2),
    } as ViewStyle,
  };
});
