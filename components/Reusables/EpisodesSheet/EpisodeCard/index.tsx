import { makeStyles } from "@/utils/theme/makeStyles";
import { useTheme } from "@/utils/theme/useTheme";
import { Episode } from "@/utils/types/podcast";
import { PlayCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
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
const EpisodeCard = ({
  episode,
  imageUrl,
  noBackground = false,
  imageType = "rounded",
  link: goToLink = "",
  playIcon = false,
}: Props) => {
  const { theme } = useTheme();
  const styles = madeStyles(theme, {
    noBackground,
    imageType,
  });
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = () => {
    const link = (pathname + `/` + episode.id) as Href<string>;
    router.push((goToLink || link) as Href<string>);
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
      {playIcon && (
        <View
          style={
            {
              marginLeft: theme.vw(4),
            } as ViewStyle
          }
        >
          <HugeiconsIcon
            icon={PlayCircleIcon}
            size={theme.vw(9)}
            color={theme.colors.text}
            strokeWidth={1.5}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default EpisodeCard;

type Props = {
  episode: Episode;
  imageUrl: string;
  noBackground?: boolean;
  imageType?: "square" | "rounded";
  link?: string;
  playIcon?: boolean;
};

type StyleProps = {
  noBackground?: boolean;
  imageType?: "square" | "rounded";
};

const madeStyles = makeStyles(
  (theme, { noBackground = false, imageType }: StyleProps) => {
    return {
      container: {
        padding: theme.vw(4),
        backgroundColor: noBackground ? "transparent" : theme.colors.tint,
        borderRadius: theme.vw(8),
        flexDirection: "row",
        alignItems: "center",
      },
      image: {
        width: theme.vh(10),
        height: theme.vh(10),
        borderRadius: imageType === "rounded" ? theme.vh(10) : theme.vw(3),
      } as ImageStyle,
      contentContainer: {
        marginLeft: theme.vw(5),
        flex: 1,
      } as ViewStyle,
      title: {
        fontSize: theme.fontSizes.mediumSmall,
        color: theme.colors.text,
        fontWeight: theme.fontWeights.bold,
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
  }
);
