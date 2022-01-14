import Song from "./song";

export default interface Playlist {
    id: number,
    name: string,
    author: string,
    songs: Song[]
}