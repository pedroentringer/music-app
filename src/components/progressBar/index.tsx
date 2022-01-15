import { useContext, useEffect, useState } from 'react';
import { useDynamicAnimation } from 'moti';
import { runOnJS, useAnimatedGestureHandler } from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

import { 
  Container,
  BarContainer,
  Bar,
  Progress
} from './styles'

import { PlayerContext } from '../../providers/player';
import { AVPlaybackStatus } from 'expo-av';

const ProgressBar = () => {

  const playerContext = useContext(PlayerContext)

  const animation = useDynamicAnimation(() => ({
    width: 0
  }))

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    const current = animation.current?.width as number || 0 
    
    animation.animateTo({
      width: current + 1
    })
  }

  useEffect(() => {

    if(playerContext.player.playingNow.sound){
      playerContext.player.playingNow.sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate)
    }
  
  }, [playerContext.player.playingNow.sound])

  const gestureHandler = useAnimatedGestureHandler({
    onStart: async () => {
      runOnJS(playerContext.handlePause)()
    },
    onActive: (event) => {
      animation.animateTo({
        width: event.absoluteX
      })
    },
    onEnd: async (event) => {
      console.log(event)
      
      //converter o X em Millis para setar a posição

      runOnJS(playerContext.setPositionInMillis)(30000)
      runOnJS(playerContext.handlePlay)()
    },
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Container>
        <BarContainer>
          <Bar />
          <Progress state={animation} transition={{type: 'timing'}}/>
        </BarContainer>
      </Container>
    </PanGestureHandler>
  )
};

export default ProgressBar;