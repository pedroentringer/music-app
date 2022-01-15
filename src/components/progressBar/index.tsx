import { useContext, useEffect, useState } from 'react';
import { useDynamicAnimation } from 'moti';
import { runOnJS, useAnimatedGestureHandler } from 'react-native-reanimated';
import { GestureEventPayload, PanGestureHandler, PanGestureHandlerEventPayload } from 'react-native-gesture-handler';

import { 
  Container,
  BarContainer,
  Bar,
  Progress
} from './styles'

import { PlayerContext } from '../../providers/player';
import { AVPlaybackStatus } from 'expo-av';
import { LayoutChangeEvent } from 'react-native';
import { TextBold } from '../texts';

const ProgressBar = () => {

  const playerContext = useContext(PlayerContext)

  const [isDrag, setIsDrag] = useState(false)
  const [maxWidth, setMaxWidth] = useState(0)

  const animation = useDynamicAnimation(() => ({
    width: 0
  }))

  const onLayoutBar = (layoutEvent: LayoutChangeEvent) => {
    const { width } = layoutEvent.nativeEvent.layout;

    if(width && width > 0){
      setMaxWidth(width)
    }

  }

  const onPlaybackStatusUpdate = ({ playableDurationMillis, positionMillis }: AVPlaybackStatus) => {
    setIsDrag((prevIsDrag) => {
      if(!prevIsDrag){
        const progressInPercent =  (100 * positionMillis) / playableDurationMillis;
    
        const newWidth =  ( progressInPercent * maxWidth) / 100;
    
        animation.animateTo({
          width: newWidth
        })
      }

      return prevIsDrag
    })
  }

  useEffect(() => {

    if(playerContext.player.playingNow.sound){
      playerContext.player.playingNow.sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate)
    }
  
  }, [playerContext.player.playingNow.sound])

  const processGestureNewWidth = async (event: Readonly<GestureEventPayload & PanGestureHandlerEventPayload>) => { 
    if(playerContext.player.playingNow.sound){
      const { playableDurationMillis } = await playerContext.player.playingNow.sound.getStatusAsync()

      const progressInPercent =  (100 * event.absoluteX) / maxWidth;
  
      const newPositionInMillis =  ( progressInPercent * playableDurationMillis) / 100;

      await playerContext.setPositionInMillis(newPositionInMillis)
      
    }
    setIsDrag(false)
  }

  const gestureHandler = useAnimatedGestureHandler({
    onStart: () => {
      runOnJS(setIsDrag)(true)
    },
    onActive: (event) => {
      animation.animateTo({
        width: event.absoluteX
      })
    },
    onEnd: (event) => {
      runOnJS(processGestureNewWidth)(event)
    },
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Container>
        <BarContainer>
          <Bar onLayout={onLayoutBar}/>
          <Progress state={animation} transition={{type: 'timing', duration: 0}}/>
        </BarContainer>
      </Container>
    </PanGestureHandler>
  )
};

export default ProgressBar;