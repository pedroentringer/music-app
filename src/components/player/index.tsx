import { useContext, useEffect, useState } from 'react';
import { useAnimatedStyle, useSharedValue, useAnimatedGestureHandler, withSpring, runOnJS, interpolate, Extrapolate } from 'react-native-reanimated';
import { GestureEventPayload, PanGestureHandler, PanGestureHandlerEventPayload } from 'react-native-gesture-handler';

import { 
  Container,
  ControllsContainer,
  SafeArea,
  MiniBar,
  SongImage,
  ContainerMaster,
  ContainerMasterBackground
} from './styles'

import { Center } from '../../global/styles';

import { IconPrimaryButton, IconButton, PlayPauseButton } from '../../components/buttons'

import { AnimatePresence, MotiView } from 'moti'
import { PlayerContext } from '../../providers/player';
import { TextBold, TextRegular } from '../texts';
import ProgressBar from '../progressBar';
import { useWindowDimensions } from 'react-native';

const INITIAL_TIME = {
  total: { minutes: 0, seconds: 0},
  progress: { minutes: 0, seconds: 0}
}

function msToTime(durationInMillis: number) {
  let seconds = Math.floor((durationInMillis / 1000) % 60)
  let minutes = Math.floor((durationInMillis / (1000 * 60)) % 60)

  return { minutes, seconds } 
}

const SPRING_CONFIG = {
  damping: 80,
  overshootClamping: true,
  restDisplacementThreshold: 0.1,
  restSpeedThreshold: 0.1,
  stiffness: 500
}


const Player = () => {
  const playerContext = useContext(PlayerContext)
  
  const [show, setShow] = useState(false)
  
  const dimensions = useWindowDimensions()

  const HEIGHT_CARD_SHOW = dimensions.height - 200;
  const HEIGHT_CARD_FULLSCREEN = 200;

  const top = useSharedValue(dimensions.height)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      top: withSpring(top.value, SPRING_CONFIG)
    }
  })

  const backgroundAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      top.value, 
      [HEIGHT_CARD_SHOW, HEIGHT_CARD_FULLSCREEN], 
      [0, 0.8], 
      { extrapolateRight: Extrapolate.CLAMP }
    );

    return {
      opacity: opacity
    };
  });

  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      
      top.value = event.absoluteY
    },
    onEnd: (event) => {

      const position = event.absoluteY

      const closeTarget = HEIGHT_CARD_SHOW;

      if(position > closeTarget){
        top.value = dimensions.height;
        runOnJS(playerContext.handleClose)()
      }else{

        if(position > dimensions.height / 2 + 100) {
          top.value = withSpring(HEIGHT_CARD_SHOW, SPRING_CONFIG)
        }else {
          top.value = withSpring(HEIGHT_CARD_FULLSCREEN, SPRING_CONFIG)
        }

      }
    }
  });

  useEffect(() => {
    if(playerContext.player.playingNow.sound && !show){
      top.value = withSpring(HEIGHT_CARD_SHOW, SPRING_CONFIG)
      setShow(true)
    }else if(!playerContext.player.playingNow.sound && show){
      setShow(false)
    }
  }, [playerContext.player.playingNow.sound])

  if(!show) return <></>

  return (
    <ContainerMaster>
      <ContainerMasterBackground style={backgroundAnimatedStyle}/>

      <PanGestureHandler onGestureEvent={gestureHandler}>
          <Container style={animatedStyle}>
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
                {playerContext.player.isPaused && (<PlayPauseButton icon='play-arrow' onPress={playerContext.handlePlay}/>)}
                {!playerContext.player.isPaused && (<PlayPauseButton icon='pause' onPress={playerContext.handlePause}/>)}
                <IconButton icon='arrow-forward' onPress={playerContext.handleNext}/>
              </>
    
              <IconButton icon='favorite-border' />
    
            </ControllsContainer>
    
          </Container>
      
      </PanGestureHandler>
    </ContainerMaster>
  )

}

export default Player;
