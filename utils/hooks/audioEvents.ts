import { useEffect } from "react";
import TrackPlayer, {
  Event,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from "react-native-track-player";
import { useShallow } from "zustand/react/shallow";
import { PlaybackService } from "../helpers/playBackService";
import { useAudioPlayerStore } from "../store/audioPlayer";

/**
 * Hook to sync TrackPlayer events with Zustand store
 * Call this hook once at the app level (e.g., in your main App component)
 */
export const useAudioEvents = () => {
  const { state: playbackState } = usePlaybackState();
  const progress = useProgress();

  // Use individual selectors to avoid object creation
  const setPlaybackState = useAudioPlayerStore(
    (state) => state.setPlaybackState
  );
  const setPosition = useAudioPlayerStore((state) => state.setPosition);
  const setDuration = useAudioPlayerStore((state) => state.setDuration);

  // Sync playback state
  useEffect(() => {
    if (playbackState) {
      setPlaybackState(playbackState);
    }
  }, [playbackState, setPlaybackState]);

  // Sync progress
  useEffect(() => {
    setPosition(progress.position);
    setDuration(progress.duration);
  }, [progress.position, progress.duration, setPosition, setDuration]);

  useEffect(() => {
    TrackPlayer.registerPlaybackService(() => PlaybackService);

    return () => {
      // Cleanup: Unregister playback service when the component unmounts
    };
  }, []);

  // Handle TrackPlayer events
  useTrackPlayerEvents(
    [Event.PlaybackState, Event.PlaybackError, Event.PlaybackTrackChanged],
    (event) => {
      switch (event.type) {
        case Event.PlaybackError:
          if ("message" in event) {
            console.error("Playback error:", event);
          }
          break;
        case Event.PlaybackTrackChanged:
          break;
      }
    }
  );
};

/**
 * Hook for components that need to react to audio player state changes
 * Using useShallow to prevent infinite re-renders
 */
export const useAudioPlayerState = () => {
  return useAudioPlayerStore(
    useShallow((state) => ({
      currentTrack: state.currentTrack,
      isPlaying: state.isPlaying,
      isLoading: state.isLoading,
      isMuted: state.isMuted,
      isShuffled: state.isShuffled,
      position: state.position,
      duration: state.duration,
    }))
  );
};

/**
 * Hook for components that need audio player controls
 * Using useShallow to prevent infinite re-renders
 */
export const useAudioPlayerControls = () => {
  return useAudioPlayerStore(
    useShallow((state) => ({
      loadTrack: state.loadTrack,
      updateTrackMetadata: state.updateTrackMetadata,
      play: state.play,
      pause: state.pause,
      togglePlayPause: state.togglePlayPause,
      seekTo: state.seekTo,
      seekBy: state.seekBy,
      toggleMute: state.toggleMute,
      toggleShuffle: state.toggleShuffle,
      reset: state.reset,
    }))
  );
};

// Alternative: Individual hooks for better performance
// Use these instead of the combined hooks above if you only need specific values

export const useCurrentTrack = () =>
  useAudioPlayerStore((state) => state.currentTrack);
export const useIsPlaying = () =>
  useAudioPlayerStore((state) => state.isPlaying);
export const useIsLoading = () =>
  useAudioPlayerStore((state) => state.isLoading);
export const usePosition = () => useAudioPlayerStore((state) => state.position);
export const useDuration = () => useAudioPlayerStore((state) => state.duration);

// Control hooks
export const useLoadTrack = () =>
  useAudioPlayerStore((state) => state.loadTrack);
export const useTogglePlayPause = () =>
  useAudioPlayerStore((state) => state.togglePlayPause);
export const useSeekTo = () => useAudioPlayerStore((state) => state.seekTo);
