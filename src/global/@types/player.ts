import Song from "./song";

export default interface Player {
    isLoop: boolean,
    isPaused: boolean,
    prevs: Song[],
    nexts: Song[],
    playingNow: Song | null,
}