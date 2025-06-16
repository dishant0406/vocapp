import { makeStyles } from "@/utils/theme/makeStyles";
import { useTheme } from "@/utils/theme/useTheme";
import { Image } from "expo-image";
import { Href, useRouter } from "expo-router";
import React from "react";
import {
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
  link?: string;
};

const BLUR_HASH = "e5CPz.0000-:?Z00^*t6_19H00~U?ZD*WCM|xt-.02-ot7R*Rk%1Rk";

const Cover = (props: Props) => {
  const { theme } = useTheme();
  const styles = madeStyles(theme);
  const { title, imageUrl, duration, link } = props;

  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push((link || `/podcast/${props.id}`) as Href)}
      activeOpacity={0.8}
      style={styles.container}
    >
      <Image placeholder={BLUR_HASH} source={imageUrl} style={styles.cover} />
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
