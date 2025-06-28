import {
  useAudioPlayerControls,
  useAudioPlayerState,
} from "@/utils/hooks/audioEvents";
import { makeStyles, useTheme } from "@/utils/theme/useTheme";
import {
  CancelCircleIcon,
  PauseIcon,
  PlayIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Href, useRouter } from "expo-router";
import React from "react";
import {
  Image,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

type MiniAudioPlayerProps = {
  onPress?: () => void;
};

const MiniAudioPlayer: React.FC<MiniAudioPlayerProps> = ({ onPress }) => {
  const { currentTrack, isPlaying, isLoading, duration, position } =
    useAudioPlayerState();
  const router = useRouter();

  const { togglePlayPause, reset } = useAudioPlayerControls();

  const { theme } = useTheme();
  const styles = miniPlayerStyles(theme);

  if (isLoading || !currentTrack) {
    return null;
  }

  const progressBarStyle = {
    width: `${(position / duration) * 100}%`,
    height: 4,
    backgroundColor: theme.colors.text,
    borderRadius: 2,
  } as ViewStyle;

  const handleClick = () => {
    const link =
      `/podcast/${currentTrack.podcastId}/${currentTrack.id}` as Href<string>;
    router.push(link);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handleClick}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.progressBarContainer}>
        <View style={progressBarStyle} />
      </View>
      <View style={styles.playerContainer}>
        <View style={styles.trackInfoContainer}>
          <Image
            source={{ uri: currentTrack.coverImage }}
            style={{ width: 40, height: 40, borderRadius: 5 }}
            resizeMode="cover"
          />
          <Text style={styles.titleText} numberOfLines={1}>
            {currentTrack.title || "Unknown Title"}
          </Text>
        </View>

        <View style={styles.controlButtonContainer}>
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              togglePlayPause();
            }}
            style={styles.controlButton}
          >
            <HugeiconsIcon
              icon={isPlaying ? PauseIcon : PlayIcon}
              color={theme.colors.background}
              size={28}
              strokeWidth={2}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              reset();
            }}
            style={styles.controlButton}
          >
            <HugeiconsIcon
              icon={CancelCircleIcon}
              color={theme.colors.background}
              size={28}
              strokeWidth={2}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const miniPlayerStyles = makeStyles((theme) => ({
  playerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: theme.vw(2.5),
  },
  progressBarContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    borderRadius: 2,
  } as ViewStyle,
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    paddingBottom: theme.vh(5),
    backgroundColor: theme.colors.tag,
    paddingHorizontal: theme.vw(4),
    bottom: -theme.vh(4),
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    minHeight: 60,
    width: "100%",
    zIndex: theme.zIndex.normal,
  } as ViewStyle,
  trackInfoContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: theme.vw(2),
    gap: theme.vw(4),
  },
  titleText: {
    color: theme.colors.background,
    fontSize: theme.fontSizes?.mediumSmall,
    fontWeight: theme.fontWeights.bold,
    width: "70%",
  } as TextStyle,
  controlButton: {
    padding: theme.vw(2),
    alignItems: "center",
    justifyContent: "center",
  },
  controlButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
}));

export default MiniAudioPlayer;
