import { makeStyles } from "@/utils/theme/makeStyles";
import { useTheme } from "@/utils/theme/useTheme";
import { Episode } from "@/utils/types/podcast";
import { Href, usePathname, useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ImageStyle,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Duration from "../../Duration";

const EpisodeCard = ({ episode, imageUrl }: Props) => {
  const { theme } = useTheme();
  const styles = madeStyles(theme);
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = () => {
    const link = (pathname + `/` + episode.id) as Href<string>;
    router.push(link);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handleClick}
      style={styles.container}
    >
      <Image
        source={{
          uri: imageUrl,
        }}
        style={styles.image}
      />
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {episode.title}
        </Text>
        <Duration duration={episode.duration} />
        <Text style={styles.desc} numberOfLines={2} ellipsizeMode="tail">
          {episode.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default EpisodeCard;

type Props = {
  episode: Episode;
  imageUrl: string;
};

const madeStyles = makeStyles((theme) => {
  return {
    container: {
      padding: theme.vw(5),
      backgroundColor: theme.colors.background,
      borderRadius: theme.vw(8),
      flexDirection: "row",
    },
    image: {
      width: theme.vh(10),
      height: theme.vh(10),
      borderRadius: theme.vh(10),
    } as ImageStyle,
    contentContainer: {
      marginLeft: theme.vw(5),
      flex: 1,
    } as ViewStyle,
    title: {
      fontSize: theme.fontSizes.mediumSmall,
      color: theme.colors.text,
      fontWeight: theme.fontWeights.bold,
      marginTop: theme.vh(1),
      marginBottom: theme.vh(0.5),
      fontFamily: theme.fontFamily.bold,
    } as TextStyle,
    desc: {
      fontSize: theme.fontSizes.small,
      color: theme.colors.mutedForeground,
      marginTop: theme.vh(1),
      fontFamily: theme.fontFamily.regular,
    } as TextStyle,
  };
});
