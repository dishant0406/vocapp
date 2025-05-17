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
import { useAudioPlayer } from "@simform_solutions/react-native-audio-waveform";
import * as FileSystem from "expo-file-system";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  Event,
  State,
  Track,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from "react-native-track-player";
import Waveform from "./WaveForm";

type AudioPlayerProps = {
  url: string;
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

let isPlayerReady = false;

const setupPlayer = async (fileUri: string) => {
  // Try to check if player is already initialized
  try {
    // Throws if setupPlayer already called
    await TrackPlayer.setupPlayer({
      autoHandleInterruptions: true,
    });
  } catch (error: any) {
    // If error message indicates already initialized, ignore it
    if (
      typeof error?.message === "string" &&
      error.message.includes("already been initialized")
    ) {
      // Player is already initialized, just continue
    } else {
      // Unknown error
      console.error("Error setting up track player:", error);
    }
  }

  await TrackPlayer.updateOptions({
    android: {
      appKilledPlaybackBehavior:
        AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
    },
    capabilities: [Capability.Play, Capability.Pause, Capability.SeekTo],
    compactCapabilities: [Capability.Play, Capability.Pause],
    progressUpdateEventInterval: 1,
  });

  await TrackPlayer.reset();
  await TrackPlayer.add({
    id: "trackId",
    url: fileUri,
    title: "Audio",
    artist: "",
  } as Track);
};

const downloadFileToCache = async (url: string): Promise<string> => {
  const filename = url.split("/").pop() || `audio-${Date.now()}.mp3`;
  const fileUri = FileSystem.cacheDirectory + filename;
  const fileInfo = await FileSystem.getInfoAsync(fileUri);

  if (!fileInfo.exists) {
    const { uri } = await FileSystem.downloadAsync(url, fileUri);
    return uri;
  }
  return fileUri;
};

const AudioPlayer = forwardRef<AudioPlayerHandle, AudioPlayerProps>(
  ({ url, onPlayStateChange }, ref) => {
    const [isMuted, setIsMuted] = useState(false);
    const [isShuffled, setIsShuffled] = useState(false);
    const [localPath, setLocalPath] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const { extractWaveformData } = useAudioPlayer();
    const [waveFormData, setWaveformData] = useState<number[][]>([]);

    const { state: playbackState } = usePlaybackState();
    const progress = useProgress();
    const isPlaying = playbackState === State.Playing;

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

    // Inform parent of play state changes
    useEffect(() => {
      if (onPlayStateChange) {
        onPlayStateChange(isPlaying);
      }
    }, [isPlaying, onPlayStateChange]);

    useTrackPlayerEvents(
      [Event.PlaybackState, Event.PlaybackError],
      (event) => {
        if (event.type === Event.PlaybackError) {
          console.error("An error occurred while playing:", event.message);
        }
      }
    );

    useEffect(() => {
      let isMounted = true;
      setLoading(true);

      const setupAudio = async () => {
        try {
          const localFilePath = await downloadFileToCache(url);
          if (isMounted) {
            setLocalPath(localFilePath);
            await setupPlayer(localFilePath);
            const waveForm = await extractWaveformData({
              path: localFilePath,
              playerKey: localFilePath,
              noOfSamples: 100,
            });
            setWaveformData(waveForm);
            setLoading(false);
          }
        } catch (e) {
          console.error("Error setting up audio:", e);
          if (isMounted) {
            setLoading(false);
            setLocalPath(null);
          }
        }
      };

      setupAudio();

      return () => {
        isMounted = false;
      };
    }, [url]);

    useEffect(() => {
      return () => {
        const cleanup = async () => {
          try {
            if (isPlayerReady) {
              await TrackPlayer.pause();
              await TrackPlayer.reset();
            }
          } catch (error) {
            console.error("Error during cleanup:", error);
          }
        };
        cleanup();
      };
    }, []);

    const onPlayPause = async () => {
      try {
        if (playbackState === State.Playing) {
          await TrackPlayer.pause();
        } else {
          await TrackPlayer.play();
        }
      } catch (error) {
        console.error("Error during play/pause:", error);
      }
    };

    const onMute = async () => {
      try {
        setIsMuted((m) => !m);
        await TrackPlayer.setVolume(isMuted ? 1 : 0);
      } catch (error) {
        console.error("Error during mute toggle:", error);
      }
    };

    const onSeek = async (seconds: number) => {
      try {
        let newPos = progress.position + seconds;
        if (newPos < 0) newPos = 0;
        if (newPos > progress.duration) newPos = progress.duration;
        await TrackPlayer.seekTo(newPos);
      } catch (error) {
        console.error("Error during seek:", error);
      }
    };

    if (loading || !localPath) {
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
          <TouchableOpacity onPress={onMute}>
            <HugeiconsIcon
              icon={isMuted ? VolumeMute02Icon : VolumeHighIcon}
              color={theme.colors.text}
              size={28}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onSeek(-10)}>
            <HugeiconsIcon
              icon={GoBackward10SecIcon}
              color={theme.colors.text}
              size={28}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onPlayPause} style={styles.playButton}>
            <HugeiconsIcon
              icon={isPlaying ? PauseIcon : PlayIcon}
              color={theme.colors.text}
              size={48}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onSeek(10)}>
            <HugeiconsIcon
              icon={GoForward10SecIcon}
              color={theme.colors.text}
              size={28}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsShuffled((s) => !s)}>
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
          <Text style={styles.timeText}>{formatTime(progress.position)}</Text>
          <View style={styles.waveformContainer}>
            <Waveform
              data={waveFormData?.[0] || []}
              maxDuration={progress.duration}
              currentProgress={progress.position}
              containerStyle={styles.waveformInner}
              setPosition={(position) => {
                TrackPlayer.seekTo(position);
              }}
            />
          </View>
          <Text style={styles.timeText}>{formatTime(progress.duration)}</Text>
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
}));

export default AudioPlayer;
