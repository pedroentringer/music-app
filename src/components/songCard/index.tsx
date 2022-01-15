import { useContext } from 'react'

import { 
  Container,
  SongImageContainer,
  SongImageGradient,
  IconPause,
  IconPlay,
  SongImage,
  SongInfo,
  IconLiked,
  IconNotLiked
} from './styles'

import Margin from '../margin';
import Song from '../../global/@types/song';
import {TextSemiBold, TextRegular} from '../texts'
import { PlayerContext } from '../../providers/player';

interface IProps {
  song: Song
  onPress?: () => void 
}

export const SongCard = (props:IProps) => {

  const {onPress, song} = props
  
  const { player } = useContext(PlayerContext)

  return (
    <Container onPress={onPress} {...props}>
      <SongImageContainer>
        <SongImage
          source={{
            uri: song.picture
          }}
        />

        {player.playingNow.song && player.playingNow.song.id === song.id && (
          <SongImageGradient>
            {!player.isPaused && (<IconPause />)}
            {player.isPaused && (<IconPlay />)}
          </SongImageGradient>
        )}
      </SongImageContainer>
      <SongInfo>
        <TextSemiBold>{song.name}</TextSemiBold>
        <Margin top={5} />
        <TextRegular>{song.authors.join(', ')}</TextRegular>
      </SongInfo>

      {song.isLiked && (
        <IconLiked />
      )}

      {!song.isLiked && (
        <IconNotLiked />
      )}
    </Container>
  )
};
