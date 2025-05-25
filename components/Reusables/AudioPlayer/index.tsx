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

type AudioPlayerProps = {
  id: string;
  url: string;
  title?: string;
  artist?: string;
  coverImage?: string;
  onPlayStateChange?: (isPlaying: boolean) => void;
};

export type AudioPlayerHandle = {
  isPlaying: boolean;
};

const formatTime = (sec: number) => {
  const min = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${min}:${s < 10 ? "0" : ""}${s}`;
};

const AudioPlayer = forwardRef<AudioPlayerHandle, AudioPlayerProps>(
  ({ id, url, title, artist, coverImage, onPlayStateChange }, ref) => {
    const {
      currentTrack,
      isPlaying,
      isLoading,
      isMuted,
      isShuffled,
      position,
      duration,
    } = useAudioPlayerState();

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

    // Expose isPlaying on the ref
    useImperativeHandle(
      ref,
      () => ({
        isPlaying,
      }),
      [isPlaying]
    );

    // Load track only when URL changes (not when title/artist changes)
    useEffect(() => {
      if (url && (!currentTrack || currentTrack.url !== url)) {
        loadTrack(id, url, title, artist, coverImage);
      }
    }, [url, currentTrack?.url, loadTrack]);

    // Update track metadata if title/artist changes for same URL
    useEffect(() => {
      if (currentTrack && currentTrack.url === url) {
        // Only update if title or artist actually changed
        if (
          (title && title !== currentTrack.title) ||
          (artist && artist !== currentTrack.artist) ||
          (coverImage && coverImage !== currentTrack.coverImage) ||
          (id && id !== currentTrack.id)
        ) {
          updateTrackMetadata(id, title, artist, coverImage);
        }
      }
    }, [title, artist, currentTrack, id, url, updateTrackMetadata, coverImage]);

    // Inform parent of play state changes
    useEffect(() => {
      if (onPlayStateChange) {
        onPlayStateChange(isPlaying);
      }
    }, [isPlaying, onPlayStateChange]);

    // Show loading state
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

    return (
      <View style={styles.container}>
        {/* Top controls */}
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

        {/* Waveform & Time */}
        <View style={styles.waveformRow}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <View style={styles.waveformContainer}>
            <Waveform
              data={currentTrack.waveformData?.[0] || []}
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
}));

export default AudioPlayer;
