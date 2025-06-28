import TrackPlayer, { Event } from "react-native-track-player";

export const PlaybackService = async () => {
  TrackPlayer.addEventListener(Event.RemotePlay, async () => {
    console.log("Remote play event received");
    await TrackPlayer.play();
  });

  TrackPlayer.addEventListener(Event.RemotePause, async () => {
    console.log("Remote pause event received");
    await TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(Event.RemoteSeek, async (event) => {
    console.log("Remote seek event received:", event);
    TrackPlayer.seekTo(event.position);
  });
};
