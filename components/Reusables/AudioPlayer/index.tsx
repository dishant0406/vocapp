// components/AudioPlayer.tsx
import {
  useAudioPlayerControls,
  useAudioPlayerState,
} from "@/utils/hooks/audioEvents";
import { makeStyles, useTheme } from "@/utils/theme/useTheme";
import {
  GoBackward10SecIcon,
  GoForward10SecIcon,
  PauseIcon,
  PlayIcon,
  ShuffleSquareIcon,
  VolumeHighIcon,
  VolumeMute02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import Waveform from "./WaveForm";

export type AudioPlayerHandle = {
  isPlaying: boolean;
};

type AudioPlayerProps = {
  id: string;
  url: string; // m3u8 HLS stream URL
  title?: string;
  artist?: string;
  coverImage?: string;
  podcastId: string;
  onPlayStateChange?: (isPlaying: boolean) => void;
};

const formatTime = (sec: number) => {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
};

const AudioPlayer = forwardRef<AudioPlayerHandle, AudioPlayerProps>(
  (
    { id, url, title, artist, coverImage, podcastId, onPlayStateChange },
    ref
  ) => {
    const {
      currentTrack,
      isPlaying,
      isLoading,
      isMuted,
      isShuffled,
      position,
      duration,
    } = useAudioPlayerState();
    const [waveFormData, setWaveformData] = React.useState<number[]>(
      Array.from({ length: 100 }, () => Math.random() * 100)
    );

    const {
      loadTrack,
      updateTrackMetadata,
      togglePlayPause,
      seekBy,
      toggleMute,
      toggleShuffle,
      seekTo,
    } = useAudioPlayerControls();

    const { theme } = useTheme();
    const styles = madeStyles(theme);

    useImperativeHandle(ref, () => ({ isPlaying }), [isPlaying]);

    useEffect(() => {
      if (url && (!currentTrack || currentTrack.url !== url)) {
        loadTrack(id, url, title, artist, coverImage, podcastId);
      }
    }, [url, currentTrack?.url]);

    useEffect(() => {
      if (currentTrack && currentTrack.url === url) {
        if (
          (title && title !== currentTrack.title) ||
          (artist && artist !== currentTrack.artist) ||
          (coverImage && coverImage !== currentTrack.coverImage) ||
          (id && id !== currentTrack.id)
        ) {
          updateTrackMetadata(id, podcastId, title, artist, coverImage);
        }
      }
    }, [title, artist, coverImage, id, url]);

    useEffect(() => {
      if (onPlayStateChange) onPlayStateChange(isPlaying);
    }, [isPlaying]);

    if (isLoading || !currentTrack) {
      return (
        <View
          style={[
            styles.container,
            { justifyContent: "center", minHeight: 150 },
          ]}
        >
          <ActivityIndicator color={theme.colors.text} size="large" />
          <Text style={{ color: theme.colors.text, marginTop: 12 }}>
            Loading audio...
          </Text>
        </View>
      );
    }

    // const progressPercent = duration > 0 ? (position / duration) * 100 : 0;

    return (
      <View style={styles.container}>
        <View style={styles.topRow}>
          <TouchableOpacity onPress={toggleMute}>
            <HugeiconsIcon
              icon={isMuted ? VolumeMute02Icon : VolumeHighIcon}
              color={theme.colors.text}
              size={28}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => seekBy(-10)}>
            <HugeiconsIcon
              icon={GoBackward10SecIcon}
              color={theme.colors.text}
              size={28}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={togglePlayPause} style={styles.playButton}>
            <HugeiconsIcon
              icon={isPlaying ? PauseIcon : PlayIcon}
              color={theme.colors.text}
              size={48}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => seekBy(10)}>
            <HugeiconsIcon
              icon={GoForward10SecIcon}
              color={theme.colors.text}
              size={28}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleShuffle}>
            <HugeiconsIcon
              icon={ShuffleSquareIcon}
              color={
                isShuffled ? theme.colors.accentForeground : theme.colors.text
              }
              size={28}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.progressRow}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          {/* <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${progressPercent}%` }]}
            />
          </View> */}
          <View style={styles.waveformContainer}>
            <Waveform
              data={waveFormData}
              maxDuration={duration}
              currentProgress={position}
              containerStyle={styles.waveformInner}
              setPosition={seekTo}
            />
          </View>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>
    );
  }
);

const madeStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.colors.background,
    padding: theme.vw(5),
    borderRadius: theme.vw(8),
    alignItems: "center",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  playButton: {
    width: theme.vw(18),
    height: theme.vw(18),
    borderRadius: theme.vw(18) / 2,
    backgroundColor: theme.colors.tint,
    alignItems: "center",
    justifyContent: "center",
  },
  waveformRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: theme.vh(2),
    width: "100%",
    justifyContent: "center",
  },
  timeText: {
    color: theme.colors.text,
    width: theme.vw(20),
    textAlign: "center",
    fontSize: theme.fontSizes.small,
  },
  waveformContainer: {
    flex: 1,
    height: theme.vh(10),
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: theme.vw(2),
  },
  waveformInner: {
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: theme.vh(2),
  },
  progressBar: {
    flex: 1,
    height: theme.vh(2),
    backgroundColor: theme.colors.border,
    borderRadius: theme.vw(1),
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: theme.colors.accentForeground,
    borderRadius: theme.vw(1),
  },
}));

export default AudioPlayer;
