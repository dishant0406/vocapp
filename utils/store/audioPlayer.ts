import { useAudioPlayer } from "@simform_solutions/react-native-audio-waveform";
import * as FileSystem from "expo-file-system";
import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  State,
  Track,
} from "react-native-track-player";
import { create } from "zustand";

export interface AudioTrack {
  id: string;
  url: string;
  title: string;
  artist?: string;
  coverImage?: string;
  localPath?: string;
  waveformData?: number[][];
}

interface AudioPlayerState {
  // Current track and playback state
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  isLoading: boolean;
  isMuted: boolean;
  isShuffled: boolean;
  position: number;
  duration: number;

  // Player setup state
  isPlayerReady: boolean;

  // Actions
  loadTrack: (
    id: string,
    url: string,
    title?: string,
    artist?: string,
    coverImage?: string
  ) => Promise<void>;
  updateTrackMetadata: (
    id: string,
    title?: string,
    artist?: string,
    coverImage?: string
  ) => void;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  togglePlayPause: () => Promise<void>;
  seekTo: (position: number) => Promise<void>;
  seekBy: (seconds: number) => Promise<void>;
  toggleMute: () => Promise<void>;
  toggleShuffle: () => void;
  setPosition: (position: number) => void;
  setDuration: (duration: number) => void;
  setPlaybackState: (state: State) => void;
  reset: () => Promise<void>;
}

const setupPlayer = async (): Promise<void> => {
  try {
    await TrackPlayer.setupPlayer({
      autoHandleInterruptions: true,
    });
  } catch (error: any) {
    if (
      typeof error?.message === "string" &&
      error.message.includes("already been initialized")
    ) {
      // Player is already initialized, continue
      return;
    } else {
      console.error("Error setting up track player:", error);
      throw error;
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

export const useAudioPlayerStore = create<AudioPlayerState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  isLoading: false,
  isMuted: false,
  isShuffled: false,
  position: 0,
  duration: 0,
  isPlayerReady: false,

  updateTrackMetadata: (
    id: string,
    title?: string,
    artist?: string,
    coverImage?: string
  ) => {
    const state = get();
    if (state.currentTrack) {
      set({
        currentTrack: {
          ...state.currentTrack,
          id: id || state.currentTrack.id,
          title: title || state.currentTrack.title,
          artist: artist || state.currentTrack.artist,
          coverImage: coverImage || state.currentTrack.coverImage,
        },
      });
    }
  },

  // Updated loadTrack function for your Zustand store
  loadTrack: async (
    id: string,
    url: string,
    title: string = "Audio",
    artist: string = "",
    coverImage: string = ""
  ) => {
    const state = get();

    console.log("Loading track:", url, title, artist, coverImage);

    // If same track is already loaded and ready, don't reload
    if (
      state.currentTrack?.url === url &&
      state.currentTrack.localPath &&
      !state.isLoading
    ) {
      return;
    }

    // Prevent concurrent loading of the same URL
    if (state.isLoading && state.currentTrack?.url === url) {
      return;
    }

    set({ isLoading: true });

    try {
      // Setup player if not ready
      if (!state.isPlayerReady) {
        await setupPlayer();
        set({ isPlayerReady: true });
      }

      // Download file to cache
      const localPath = await downloadFileToCache(url);

      // Extract waveform data
      const { extractWaveformData } = useAudioPlayer();
      const waveformData = await extractWaveformData({
        path: localPath,
        playerKey: `${url}-${Date.now()}`, // Make key unique to prevent conflicts
        noOfSamples: 100,
      });

      const track: AudioTrack = {
        id,
        url,
        title,
        artist,
        coverImage,
        localPath,
        waveformData,
      };

      // Reset and add new track
      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: track.id,
        url: localPath,
        title,
        artist,
      } as Track);

      // Only update state if we're still loading the same URL
      // This prevents race conditions
      const currentState = get();
      if (currentState.isLoading) {
        set({
          currentTrack: track,
          isLoading: false,
          position: 0,
          duration: 0,
        });
      }
    } catch (error) {
      console.error("Error loading track:", error);
      // Only update error state if we're still in loading state
      const currentState = get();
      if (currentState.isLoading) {
        set({
          isLoading: false,
          currentTrack: null,
        });
      }
    }
  },

  play: async () => {
    try {
      await TrackPlayer.play();
    } catch (error) {
      console.error("Error playing:", error);
    }
  },

  pause: async () => {
    try {
      await TrackPlayer.pause();
    } catch (error) {
      console.error("Error pausing:", error);
    }
  },

  togglePlayPause: async () => {
    const { isPlaying, play, pause } = get();
    if (isPlaying) {
      await pause();
    } else {
      await play();
    }
  },

  seekTo: async (position: number) => {
    try {
      const { duration } = get();
      const clampedPosition = Math.max(0, Math.min(position, duration));
      await TrackPlayer.seekTo(clampedPosition);
    } catch (error) {
      console.error("Error seeking:", error);
    }
  },

  seekBy: async (seconds: number) => {
    const { position, seekTo } = get();
    await seekTo(position + seconds);
  },

  toggleMute: async () => {
    try {
      const { isMuted } = get();
      const newMutedState = !isMuted;
      await TrackPlayer.setVolume(newMutedState ? 0 : 1);
      set({ isMuted: newMutedState });
    } catch (error) {
      console.error("Error toggling mute:", error);
    }
  },

  toggleShuffle: () => {
    set((state) => ({ isShuffled: !state.isShuffled }));
  },

  setPosition: (position: number) => {
    set({ position });
  },

  setDuration: (duration: number) => {
    set({ duration });
  },

  setPlaybackState: (state: State) => {
    set({ isPlaying: state === State.Playing });
  },

  reset: async () => {
    try {
      await TrackPlayer.pause();
      await TrackPlayer.reset();
      set({
        currentTrack: null,
        isPlaying: false,
        position: 0,
        duration: 0,
        isMuted: false,
        isShuffled: false,
      });
    } catch (error) {
      console.error("Error resetting player:", error);
    }
  },
}));
