import { useContext } from 'react';

import { 
  Container,
  SafeArea,
  ContainerSubMenu
} from './styles'

import { IconPrimaryButton, IconButton, DefaultButton } from '../../components/buttons'

import { MotiView, useAnimationState, AnimatePresence } from 'moti'
import { PlayerContext } from '../../providers/player';

const Player = (props:any) => {
  const playerContext = useContext(PlayerContext)

  const subMenuLanguage = useAnimationState({
    closed: {
      translateY: 120,
      opacity: 0
    },
    open: {
        translateY: 0,
        opacity: 1
    },
  })

  subMenuLanguage.transitionTo('closed')

  const handleLanguage = () => {
    const currentState = subMenuLanguage.current

    if(currentState !== 'open') {
      return subMenuLanguage.transitionTo('open')
    }

    subMenuLanguage.transitionTo('closed')
  }

  const renderSubMenuLanguage = () => {
    return (
      <ContainerSubMenu state={subMenuLanguage} transition={{
        type: 'timing',
        duration: 500,
      }}>
        <DefaultButton title='Português' />
        <DefaultButton title='English' />
        <DefaultButton title='français' />
      </ContainerSubMenu>
    )
  }
  return (
    <>
      <AnimatePresence>
        {
          renderSubMenuLanguage()
        }
      </AnimatePresence>
      <MotiView {...props}>
        <Container>
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
        </Container>
        <SafeArea />
      </MotiView>
    </>
  )

}

export default Player;
