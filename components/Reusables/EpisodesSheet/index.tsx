import { makeStyles } from "@/utils/theme/makeStyles";
import { useTheme } from "@/utils/theme/useTheme";
import React, { useEffect } from "react";
import {
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import ActionSheet, { useSheetRef } from "react-native-actions-sheet";
import { ScrollView } from "react-native-gesture-handler";
import EpisodeCard from "./EpisodeCard";

type Props = {
  podcast: Podcast;
};

const EpisodesSheet = ({ podcast }: Props) => {
  const ref = useSheetRef();
  const { theme } = useTheme();
  const styles = madeStyles(theme);

  const openSheet = () => {
    ref.current?.setModalVisible(true);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      openSheet();
    }, 200);

    return () => clearTimeout(timer);
  }, []);
  return (
    <ActionSheet
      isModal={false}
      backgroundInteractionEnabled
      snapPoints={[40, 100]}
      gestureEnabled
      closable={false}
      disableDragBeyondMinimumSnapPoint
      containerStyle={styles.sheetContainer}
    >
      <View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>All Episodes</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.link}>Show All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            rowGap: theme.vh(2),
          }}
          style={styles.episodesContainer}
        >
          {podcast.episodes.map((episode, index) => (
            <EpisodeCard
              imageUrl={episode.imageUrl || podcast.imageUrl}
              key={index}
              episode={episode}
            />
          ))}
        </ScrollView>
      </View>
    </ActionSheet>
  );
};

const madeStyles = makeStyles((theme) => {
  return {
    sheetContainer: {
      paddingTop: theme.vh(2),
      paddingBottom: theme.vh(2),
      paddingHorizontal: theme.vw(6),
      borderTopLeftRadius: theme.vw(10),
      borderTopRightRadius: theme.vw(10),
      backgroundColor: theme.colors.tint,
    } as ViewStyle,
    titleContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
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
      marginTop: theme.vh(2),
      height: theme.vh(50),
    } as ViewStyle,
  };
});

export default EpisodesSheet;
