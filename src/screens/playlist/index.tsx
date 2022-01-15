import { useEffect, useContext } from 'react'
import { SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { 
  Container, 
  ScrollView,
  Title,
  PlaylistName,
  PlaylistInfo,
} from './styles'

import { TextRegular } from '../../components/texts'
import { SongCard } from '../../components/songCard'
import Player from '../../components/player'

import { PlayerContext } from "../../providers/player";

import Song from "../../global/@types/song";
import Playlist from "../../global/@types/playlist";
import { MotiView } from 'moti';

const SOUNDS_LOCATIONS = '../../sounds'

export default function PlaylistScreen() {

  const playerContext = useContext(PlayerContext)

  const songs: Song[] = [
    {
      id: 1,
      authors: ['Mutreta'],
      picture: 'https://i1.sndcdn.com/artworks-000021467146-fbeds0-t500x500.jpg',
      isLiked: true,
      name: 'Morena',
      file: require(`${SOUNDS_LOCATIONS}/morena.mp3`)
    },
    {
      id: 2,
      authors: ['Mutreta'],
      picture: 'https://i1.sndcdn.com/artworks-000005835169-wtr0qm-t500x500.jpg',
      isLiked: false,
      name: 'Noites e Tempestades',
      file: require(`${SOUNDS_LOCATIONS}/noites-e-tempestades.mp3`)
    },
    {
      id: 3,
      authors: ['Mutreta'],
      picture: 'https://i1.sndcdn.com/artworks-000005835169-wtr0qm-t500x500.jpg',
      isLiked: false,
      name: 'Em Busca de Luz',
      file: require(`${SOUNDS_LOCATIONS}/em-busca-de-luz.mp3`)
    },
    {
      id: 4,
      authors: ['Mutreta'],
      picture: 'https://i1.sndcdn.com/artworks-000005835169-wtr0qm-t500x500.jpg',
      isLiked: false,
      name: 'Terral',
      file: require(`${SOUNDS_LOCATIONS}/terral.mp3`)
    }
  ]

  const playlist: Playlist = {
    id: 1,
    name: 'Liked Songs',
    author: 'Pedro Entringer',
    songs: songs
  }

  const setPlayList = async () => {
    await playerContext.initPlaylist(playlist)
  }

  useEffect(() => {
    setPlayList()
  }, []);

  return (
    <>
      <Container>
        <StatusBar style='dark' />

        <SafeAreaView />
        <ScrollView showsVerticalScrollIndicator={false}>

          <PlaylistName>  
            <TextRegular>Playlist</TextRegular>
            <Title>Have a Great Day!</Title>
          </PlaylistName>

          <PlaylistInfo>
            <TextRegular>{playlist.songs.length} songs</TextRegular>
            <TextRegular>By {playlist.author}</TextRegular>
          </PlaylistInfo>

          {
            playlist.songs.map((song, index) => {
              const key = `song-card-${index}-${song.id}`;

              return (
                <MotiView
                  key={key} 
                  from={{
                    translateY: 20,
                    opacity: 0
                  }}
                  animate={{
                    translateY: 0,
                    opacity: 1,
                  }}
                  transition={{
                    type: 'timing',
                    duration: 300,
                    delay: 500 + (100 * index)
                  }}
                >
                  <SongCard 
                    song={song}
                    onPress={async () => {
                      await playerContext.playSongByIndex(index)
                    }} 
                  />
                </MotiView>
              )
            })
          }
          
        </ScrollView>

      </Container>
      <Player />
    </>
  );
}