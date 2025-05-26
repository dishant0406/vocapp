import { makeStyles } from "@/utils/theme/makeStyles";
import { useTheme } from "@/utils/theme/useTheme";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ImageStyle,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Duration from "../Duration";

type Props = {
  id?: string;
  title?: string;
  imageUrl?: string;
  duration?: number;
  onPress?: () => void;
  selected?: boolean;
  style?: any;
};

const Cover = (props: Props) => {
  const { theme } = useTheme();
  const styles = madeStyles(theme);
  const { title, imageUrl, duration } = props;

  const router = useRouter();

  const blurHash = "LEHV6nWB2yk8pyo0adR*.7kCMdnj";

  return (
    <TouchableOpacity
      onPress={() => router.push(`/podcast/${props.id}`)}
      activeOpacity={0.8}
      style={styles.container}
    >
      <Image
        source={{
          uri: imageUrl || "",
        }}
        style={styles.cover}
      />
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {title || ""}
        </Text>
        <Duration duration={duration} />
      </View>
    </TouchableOpacity>
  );
};

export default Cover;

const madeStyles = makeStyles((theme) => {
  return {
    container: {
      width: theme.vw(40),
      marginBottom: theme.vh(4),
    } as ViewStyle,
    cover: {
      width: theme.vw(40),
      height: theme.vw(45),
      borderRadius: theme.vw(4),
    } as ImageStyle,
    title: {
      fontSize: theme.fontSizes.mediumSmall,
      color: theme.colors.text,
      fontWeight: theme.fontWeights.bold,
      marginTop: theme.vh(1),
      marginBottom: theme.vh(0.5),
      fontFamily: theme.fontFamily.bold,
    } as TextStyle,
    contentContainer: {
      paddingHorizontal: theme.vw(1),
    } as ImageStyle,
  };
});
