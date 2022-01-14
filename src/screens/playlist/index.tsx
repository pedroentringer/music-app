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
import { PrimaryButton } from '../../components/buttons'
import Song from "../../global/@types/song";
import { PlayerContext } from "../../providers/player";
import Playlist from "../../global/@types/playlist";

const SOUNDS_LOCATIONS = '../../sounds'

export default function PlaylistScreen() {

  const playerContext = useContext(PlayerContext)

  const songs: Song[] = [
    {
      id: 1,
      authors: ['Mutreta'],
      picture: '',
      isLiked: true,
      name: 'Morena',
      file: require(`${SOUNDS_LOCATIONS}/morena.mp3`)
    },
    {
      id: 2,
      authors: ['Mutreta'],
      picture: '',
      isLiked: false,
      name: 'Noites e Tempestades',
      file: require(`${SOUNDS_LOCATIONS}/noites-e-tempestades.mp3`)
    },
    {
      id: 3,
      authors: ['Mutreta'],
      picture: '',
      isLiked: false,
      name: 'Em Busca de Luz',
      file: require(`${SOUNDS_LOCATIONS}/em-busca-de-luz.mp3`)
    },
    {
      id: 4,
      authors: ['Mutreta'],
      picture: '',
      isLiked: false,
      name: 'Terral',
      file: require(`${SOUNDS_LOCATIONS}/terral.mp3`)
    }
  ]

  const playlist: Playlist = {
    id: 1,
    name: 'Liked Songs',
    songs: songs
  }

  const setPlayList = async () => {
    await playerContext.setPlaylist(1, playlist)
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
          <TextRegular>102 Songs</TextRegular>
          <TextRegular>6 hr, 29 min</TextRegular>
        </PlaylistInfo>

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

        <PlaylistInfo>
          <TextRegular>{JSON.stringify(playerContext.player)}</TextRegular>
        </PlaylistInfo>

        

        
      </ScrollView>

    </Container>
  );
}