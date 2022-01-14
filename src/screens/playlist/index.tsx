import { useEffect, useContext } from 'react'
import { SafeAreaView, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { 
  Container, 
  ScrollView,
  Title,
  PlaylistName,
  PlaylistInfo,
} from './styles'

import { TextRegular } from '../../components/texts'
import { PrimaryButton } from '../../components/buttons'
import { SongCard } from '../../components/songCard'

import { PlayerContext } from "../../providers/player";

import Song from "../../global/@types/song";
import Playlist from "../../global/@types/playlist";

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
    
  }

  useEffect(() => {
    setPlayList()
  }, []);

  return (
    <Container>
      <StatusBar style='dark' />

      <SafeAreaView />
      <ScrollView>

        <PlaylistName>  
          <TextRegular>Playlist</TextRegular>
          <Title>Have a Great Day!</Title>
        </PlaylistName>

        <PlaylistInfo>
          <TextRegular>{playlist.songs.length} songs</TextRegular>
          <TextRegular>By {playlist.author}</TextRegular>
        </PlaylistInfo>

        <FlatList 
          data={playlist.songs}
          keyExtractor={song => song.id.toString()}
          renderItem={({item, index}) => {
            return <SongCard 
                song={item}
                onPress={async () => {
                  await playerContext.setPlaylist(index, playlist)
                }} 
              />
          }}
        />

        <PlaylistInfo>
          <TextRegular>{playerContext.player.prevs.length} prevs</TextRegular>
          <TextRegular>{playerContext.player.playingNow?.name || '-'}</TextRegular>
          <TextRegular>{playerContext.player.nexts.length} nexts</TextRegular>
        </PlaylistInfo>


        <PlaylistInfo>
          <PrimaryButton title='Prev' onPress={playerContext.handlePrevius} />
          {playerContext.player.isPaused && (<PrimaryButton title='Play' onPress={playerContext.handlePlay} />)}
          {!playerContext.player.isPaused && (<PrimaryButton title='Pause' onPress={playerContext.handlePause} />)}
          <PrimaryButton title='Next' onPress={playerContext.handleNext} />
        </PlaylistInfo>
        
      </ScrollView>

    </Container>
  );
}