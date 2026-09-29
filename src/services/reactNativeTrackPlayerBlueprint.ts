/**
 * SacredSteps: React Native Track Player Production Blueprint
 * Reference implementation for react-native-track-player integration
 * in the React Native / Expo build.
 */

export const REACT_NATIVE_TRACK_PLAYER_SETUP = `
import TrackPlayer, { 
  AppRegistry, 
  Capability, 
  Event, 
  RepeatMode, 
  State,
  usePlaybackState,
  useProgress 
} from 'react-native-track-player';

// 1. Service Registration (index.js / service.js)
export async function PlaybackService() {
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
  TrackPlayer.addEventListener(Event.RemoteJumpForward, async (event) => {
    const { position } = await TrackPlayer.getProgress();
    await TrackPlayer.seekTo(position + 15);
  });
  TrackPlayer.addEventListener(Event.RemoteJumpBackward, async (event) => {
    const { position } = await TrackPlayer.getProgress();
    await TrackPlayer.seekTo(Math.max(0, position - 15));
  });
  TrackPlayer.addEventListener(Event.RemoteSeek, (event) => {
    TrackPlayer.seekTo(event.position);
  });
}

// 2. Setup Player with Lock-Screen Capabilities
export async function setupTrackPlayer() {
  let isSetup = false;
  try {
    await TrackPlayer.getActiveTrackIndex();
    isSetup = true;
  } catch {
    await TrackPlayer.setupPlayer({
      autoHandleInterruptions: true,
    });
    await TrackPlayer.updateOptions({
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.JumpForward,
        Capability.JumpBackward,
        Capability.SeekTo,
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.JumpForward,
      ],
      forwardJumpInterval: 15,
      backwardJumpInterval: 15,
    });
    isSetup = true;
  }
  return isSetup;
}

// 3. Queue SacredSteps Audio Tracks
export async function queueSacredTrack(track: {
  id: string;
  url: string;
  title: string;
  artist: string;
  artwork: string;
  duration: number;
}) {
  await TrackPlayer.reset();
  await TrackPlayer.add({
    id: track.id,
    url: track.url,
    title: track.title,
    artist: track.artist || 'The Guide · SacredSteps',
    artwork: track.artwork,
    duration: track.duration,
  });
  await TrackPlayer.play();
}
`;
