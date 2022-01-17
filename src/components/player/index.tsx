import { useContext, useEffect, useState } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, useAnimatedGestureHandler, withSpring, runOnJS, interpolate, Extrapolate } from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

import { 
  Container,
  ControllsContainer,
  MiniBar,
  ContainerMasterBackground
} from './styles'

import { Center } from '../../global/styles';

import { IconPrimaryButton, IconButton, PlayPauseButton } from '../../components/buttons'

import { PlayerContext } from '../../providers/player';
import { TextBold, TextRegular } from '../texts';
import ProgressBar from '../progressBar';
import { useWindowDimensions } from 'react-native';
import { AVPlaybackStatus } from 'expo-av';

const INITIAL_TIME = {
  total: { minutes: 0, seconds: 0},
  progress: { minutes: 0, seconds: 0},
  playableDurationMillis: 0,
  positionMillis: 0
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

  const [time, setTime] = useState(INITIAL_TIME)

  const onPlaybackStatusUpdate = ({ playableDurationMillis, positionMillis }: AVPlaybackStatus) => {
    
    const playableDuration = msToTime(playableDurationMillis)
    const position = msToTime(positionMillis)

    setTime({total: playableDuration, progress: position, playableDurationMillis, positionMillis})

    if(playableDuration.minutes === position.minutes){
      if(playableDuration.seconds === position.seconds){
        playerContext.handleNext();
      }
    }
  }

  useEffect(() => {

    if(playerContext.player.playingNow.sound){
      playerContext.player.playingNow.sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate)
    }

    return () => {
      playerContext.player.playingNow.sound?.setOnPlaybackStatusUpdate(() => {})
    }
  
  }, [playerContext.player.playingNow.sound])
  
  const dimensions = useWindowDimensions()

  const HEIGHT_CARD_SHOW = dimensions.height - 200;
  const HEIGHT_CARD_FULLSCREEN = 150;

  const top = useSharedValue(dimensions.height)

  useEffect(() => {
    if(playerContext.player.playingNow.sound && !show){
      top.value = withSpring(HEIGHT_CARD_SHOW, SPRING_CONFIG)
      setShow(true)
    }else if(!playerContext.player.playingNow.sound && show){
      top.value = dimensions.height
      setShow(false)
    }
  }, [playerContext.player.playingNow.sound])

  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      top.value = event.absoluteY
    },
    onEnd: (event) => {

      const position = event.absoluteY

      const closeTarget = HEIGHT_CARD_SHOW + 100;

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

    const positionTop = interpolate(
      top.value, 
      [HEIGHT_CARD_SHOW, HEIGHT_CARD_SHOW - 1], 
      [dimensions.height, 0], 
      { extrapolateRight: Extrapolate.CLAMP }
    );

    return {
      opacity,
      top: positionTop
    };
  });

  const pictureAnimatedStyle = useAnimatedStyle(() => {
    const startIn = HEIGHT_CARD_SHOW - 100;
    const opacity = interpolate(
      top.value, 
      [startIn, HEIGHT_CARD_FULLSCREEN], 
      [0, 0.8], 
      { extrapolateRight: Extrapolate.CLAMP }
    );

    const width = interpolate(
      top.value, 
      [startIn, HEIGHT_CARD_FULLSCREEN], 
      [0, 200], 
      { extrapolateRight: Extrapolate.CLAMP }
    );

    const height = interpolate(
      top.value, 
      [startIn, HEIGHT_CARD_FULLSCREEN], 
      [0, 200], 
      { extrapolateRight: Extrapolate.CLAMP }
    );

    const borderRadius = interpolate(
      top.value, 
      [startIn, HEIGHT_CARD_FULLSCREEN], 
      [0, 20], 
      { extrapolateRight: Extrapolate.CLAMP }
    );

    const marginTop = interpolate(
      top.value, 
      [startIn, HEIGHT_CARD_FULLSCREEN], 
      [0, 20], 
      { extrapolateRight: Extrapolate.CLAMP }
    );

    const marginBottom = interpolate(
      top.value, 
      [startIn, HEIGHT_CARD_FULLSCREEN], 
      [0, 40], 
      { extrapolateRight: Extrapolate.CLAMP }
    );

    return {
      opacity,
      width,
      height,
      borderRadius,
      marginTop,
      marginBottom
    };
  });

  const categoryAnimatedStyle = useAnimatedStyle(() => {
    const startIn = HEIGHT_CARD_SHOW - 300;

    const opacity = interpolate(
      top.value, 
      [startIn, HEIGHT_CARD_FULLSCREEN], 
      [0, 0.8], 
      { extrapolateRight: Extrapolate.CLAMP }
    );

    const paddingHorizontal = interpolate(
      top.value, 
      [startIn, HEIGHT_CARD_FULLSCREEN], 
      [0, 20], 
      { extrapolateRight: Extrapolate.CLAMP }
    );

    const paddingVertical = interpolate(
      top.value, 
      [startIn, HEIGHT_CARD_FULLSCREEN], 
      [0, 8], 
      { extrapolateRight: Extrapolate.CLAMP }
    );

    const borderRadius = interpolate(
      top.value, 
      [startIn, HEIGHT_CARD_FULLSCREEN], 
      [0, 20], 
      { extrapolateRight: Extrapolate.CLAMP }
    );

    const marginBottom = interpolate(
      top.value, 
      [startIn, HEIGHT_CARD_FULLSCREEN], 
      [0, 20], 
      { extrapolateRight: Extrapolate.CLAMP }
    );

    return {
      opacity,
      paddingHorizontal,
      paddingVertical,
      borderRadius,
      marginBottom
    };
  });

  if(!show) return <></>

  if(!playerContext.player.playingNow.song) return <></>

  return (
    <>
      <ContainerMasterBackground style={backgroundAnimatedStyle}/>

      <PanGestureHandler onGestureEvent={gestureHandler}>
          <Container style={animatedStyle}>
            <Center>
              <MiniBar />
            </Center>

            <Animated.View style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}>
              <Animated.Image style={pictureAnimatedStyle} source={{uri: playerContext.player.playingNow.song.picture}} />
              
              <Animated.View style={[categoryAnimatedStyle, {backgroundColor: '#0477FD'}]}>
                <Animated.Text style={[{fontSize: 14, color: '#fff'}]}>{playerContext.player.playingNow.song.category}</Animated.Text>
              </Animated.View>
            
            </Animated.View>
    
            <TextBold>{playerContext.player.playingNow.song.name}</TextBold>
            <TextRegular>{playerContext.player.playingNow.song.authors.join(', ')}</TextRegular>

            <Animated.View style={[{flexDirection: 'row', justifyContent: 'space-between'}]}>
              <TextRegular>{time.progress.minutes.toString().padStart(2, '0')}:{time.progress.seconds.toString().padStart(2, '0')}</TextRegular>
              <TextRegular>{time.total.minutes.toString().padStart(2, '0')}:{time.total.seconds.toString().padStart(2, '0')}</TextRegular>
            </Animated.View>
    
            <ProgressBar playableDurationMillis={time.playableDurationMillis} positionMillis={time.positionMillis}/>
    
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
    </>
  )

}

export default Player;
