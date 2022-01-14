import Song from "./song";

export default interface Playlist {
    id: number,
    name: string,
    songs: Song[]
}