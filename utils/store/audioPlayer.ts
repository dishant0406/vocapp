// store/audioPlayer.ts
import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  State,
  Track,
  TrackType,
} from "react-native-track-player";
import { create } from "zustand";
import handleApiCall from "../api/apiHandler";
import { recordEpisodePlay } from "../api/calls";

export interface AudioTrack {
  id: string;
  url: string;
  title: string;
  artist?: string;
  coverImage?: string;
}

interface AudioPlayerState {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  isLoading: boolean;
  isMuted: boolean;
  isShuffled: boolean;
  position: number;
  duration: number;
  isPlayerReady: boolean;

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
    await TrackPlayer.setupPlayer({ autoHandleInterruptions: true });
  } catch (error: any) {
    if (
      typeof error?.message === "string" &&
      error.message.includes("already been initialized")
    ) {
      return;
    }
    throw error;
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

export const useAudioPlayerStore = create<AudioPlayerState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  isLoading: false,
  isMuted: false,
  isShuffled: false,
  position: 0,
  duration: 0,
  isPlayerReady: false,

  updateTrackMetadata: (id, title, artist, coverImage) => {
    const state = get();
    if (!state.currentTrack) return;
    set({
      currentTrack: {
        ...state.currentTrack,
        id: id || state.currentTrack.id,
        title: title || state.currentTrack.title,
        artist: artist || state.currentTrack.artist,
        coverImage: coverImage || state.currentTrack.coverImage,
      },
    });
  },

  loadTrack: async (id, url, title = "Audio", artist = "", coverImage = "") => {
    const state = get();
    if (state.currentTrack?.url === url && !state.isLoading) {
      return;
    }
    if (state.isLoading && state.currentTrack?.url === url) {
      return;
    }
    set({ isLoading: true });
    try {
      if (!state.isPlayerReady) {
        await setupPlayer();
        set({ isPlayerReady: true });
      }

      const track: AudioTrack = { id, url, title, artist, coverImage };

      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: track.id,
        url: track.url,
        title,
        artist,
        type: TrackType.HLS,
        artwork: coverImage || undefined,
      } as Track);

      const current = get();
      if (current.isLoading) {
        set({
          currentTrack: track,
          isLoading: false,
          position: 0,
          duration: 0,
        });
        handleApiCall(recordEpisodePlay, [id?.split("::")[1]]);
      }
    } catch (error) {
      console.error("Error loading track:", error);
      const current = get();
      if (current.isLoading) {
        set({ isLoading: false, currentTrack: null });
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
    if (isPlaying) await pause();
    else await play();
  },

  seekTo: async (position) => {
    try {
      const { duration } = get();
      const clamped = Math.max(0, Math.min(position, duration));
      await TrackPlayer.seekTo(clamped);
    } catch (error) {
      console.error("Error seeking:", error);
    }
  },

  seekBy: async (seconds) => {
    const { position, seekTo } = get();
    await seekTo(position + seconds);
  },

  toggleMute: async () => {
    try {
      const { isMuted } = get();
      const next = !isMuted;
      await TrackPlayer.setVolume(next ? 0 : 1);
      set({ isMuted: next });
    } catch (error) {
      console.error("Error toggling mute:", error);
    }
  },

  toggleShuffle: () => set((s) => ({ isShuffled: !s.isShuffled })),

  setPosition: (position) => set({ position }),
  setDuration: (duration) => set({ duration }),
  setPlaybackState: (state) => set({ isPlaying: state === State.Playing }),

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
