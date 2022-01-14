import { useContext } from 'react';
import { useDynamicAnimation } from 'moti';
import { runOnJS, useAnimatedGestureHandler } from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

import { 
  Container,
  Bar,
  Progress
} from './styles'

import { PlayerContext } from '../../providers/player';

const ProgressBar = () => {

  const playerContext = useContext(PlayerContext)

  const animation = useDynamicAnimation(() => ({
    width: 10
  }))

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
      runOnJS(playerContext.setPositionInMillis)(30000)
      runOnJS(playerContext.handlePlay)()
    },
  });


  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Container>
        <Bar />
        <Progress state={animation}/>
      </Container>
    </PanGestureHandler>
  )
};

export default ProgressBar;