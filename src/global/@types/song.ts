export default interface Song {
    id: number,
    name: string,
    category: string,
    authors: string[],
    picture: string,
    isLiked: boolean,
    file: any,
}