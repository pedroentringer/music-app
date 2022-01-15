import Song from "./song";
import { Audio } from 'expo-av';

export default interface Player {
    isLoop: boolean,
    isPaused: boolean,
    prevs: Song[],
    nexts: Song[],
    playingNow: {
        song: Song | null,
        sound: Audio.Sound | null
    }
}