import { useContext, useEffect, useReducer } from 'react';

import { 
  Container,
  ControllsContainer,
  SafeArea,
  MiniBar,
  SongImage
} from './styles'

import { Center } from '../../global/styles';

import { IconPrimaryButton, IconButton, DefaultButton } from '../../components/buttons'

import { useAnimationState, AnimatePresence, MotiView } from 'moti'
import { PlayerContext } from '../../providers/player';
import { TextBold, TextRegular } from '../texts';
import ProgressBar from '../progressBar';

const INITIAL_TIME = {
  total: { minutes: 0, seconds: 0},
  progress: { minutes: 0, seconds: 0}
}

function msToTime(durationInMillis: number) {
  let seconds = Math.floor((durationInMillis / 1000) % 60)
  let minutes = Math.floor((durationInMillis / (1000 * 60)) % 60)

  return { minutes, seconds } 
}

const Player = () => {
  const playerContext = useContext(PlayerContext)

  const [visible, toggleVisible] = useReducer((s) => !s, true)
  const [fullscreen, toggleFullscreen] = useReducer((s) => !s, true)

  useEffect(() => {
    if(playerContext.player.playingNow.sound && !visible){
      return toggleVisible()
    }

    if(!playerContext.player.playingNow.sound && visible){
      return toggleVisible()
    }
  }, [playerContext.player.playingNow.sound])

  return (
    <AnimatePresence>
      {visible && (
        <MotiView 
          from={{
            translateY: 500,
            opacity: 0
          }}
          animate={{
            translateY: 0,
            opacity: 1,
          }}
          exit={{
            translateY: 500,
            opacity: 0
          }}
          transition={{
            type: 'timing',
            duration: 300
          }}
        >
          <Container>
            <Center>
              <MiniBar />
            </Center>
          
    
            <TextBold>{playerContext.player.playingNow.song?.name}</TextBold>
            <TextRegular>{playerContext.player.playingNow.song?.authors.join(', ')}</TextRegular>
    
            <ProgressBar />
    
            <ControllsContainer>
    
              {playerContext.player.isLoop && (
                <IconPrimaryButton icon='loop' onPress={playerContext.handleLoop} />
                )}
    
              {!playerContext.player.isLoop && (
                <IconButton icon='loop' onPress={playerContext.handleLoop}/>
                )}
    
              <>
                <IconButton icon='arrow-back' onPress={playerContext.handlePrevius}/>
                {playerContext.player.isPaused && (<IconButton icon='play-arrow' onPress={playerContext.handlePlay}/>)}
                {!playerContext.player.isPaused && (<IconButton icon='pause' onPress={playerContext.handlePause}/>)}
                <IconButton icon='arrow-forward' onPress={playerContext.handleNext}/>
              </>
    
              <IconButton icon='favorite-border' />
    
            </ControllsContainer>
    
          </Container>
          <SafeArea />
        </MotiView>
      
      )}
      
    </AnimatePresence>
  )

}

export default Player;
