export default interface Song {
    id: number,
    name: string,
    authors: string[],
    picture: string,
    isLiked: boolean,
    file: any,
}