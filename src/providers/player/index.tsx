import React, { createContext, ReactNode, useEffect, useState } from 'react'
import { Audio } from 'expo-av';

import Player from '../../global/@types/player'
import Playlist from '../../global/@types/playlist'
import Song from '../../global/@types/song'

export interface ContextProvider {
  player: Player,
  initPlaylist: (playlist: Playlist) => Promise<void>,
  playSongByIndex: (initialSongIndex: number) => Promise<void>,
  handlePlay: () => Promise<void>,
  handlePause: () => Promise<void>,
  handleNext: () => Promise<void>,
  handlePrevius: () => Promise<void>,
  handleLoop: () => Promise<void>,
  handleClose: () => Promise<void>,
  setPositionInMillis: (millis: number) => Promise<void>,
}

export const PlayerContext = createContext({} as ContextProvider)

interface PlayerProviderProps {
  children?: ReactNode
}

const DEFAULT_VALUE : Player = {
  isLoop: false,
  isPaused: false,
  prevs: [],
  nexts: [],
  playingNow: {
    song: null,
    sound: null,
  },
}

const PlayerProvider = ({ children }: PlayerProviderProps) => {

  const [playlist, setPlaylist] = useState<Playlist | null>()
  const [player, setPlayer] = useState(DEFAULT_VALUE)

  useEffect(() => {
    const restartPlayerlist = async () => {
      await playSongByIndex(0)
    }

    const finishSound = async () => {
      if(player.playingNow.sound){
        await player.playingNow.sound.pauseAsync();
        await player.playingNow.sound.unloadAsync()
      }
    }

    if(!player.playingNow.song){
      if(player.isLoop){
        restartPlayerlist()
      }else{
        finishSound();
      }
    }
    
  }, [player.playingNow.song])

  const setPositionInMillis = async (millis: number) => {
    if(player.playingNow.sound){
      await player.playingNow.sound.setPositionAsync(millis)
    }
  }

  const createSound = async (song: Song) => {
    await player.playingNow.sound?.unloadAsync()

    const soundCreated = await Audio.Sound.createAsync(song.file, { shouldPlay: true });
    
    await soundCreated.sound.playAsync(); 

    setPlayer( prevPlayer => {
      return {
        ...prevPlayer,
        playingNow: {
          ...prevPlayer.playingNow,
          sound: soundCreated.sound
        }
      }
    })
  }

  const playPauseAudio = async (song:Song) => {
    
    if(!player.playingNow.sound) return await createSound(song)

    if (player.isPaused) {
      const soundStatus = await player.playingNow.sound.getStatusAsync()
      
      if(soundStatus.isLoaded && !soundStatus.didJustFinish){
        await player.playingNow.sound.playAsync();
      }else{
        await createSound(song)
      }

      setPlayer( prevPlayer => {
        return {
          ...prevPlayer,
          isPaused: false
        }
      })
    } else {

      await player.playingNow.sound.pauseAsync();

      setPlayer( prevPlayer => {
        return {
          ...prevPlayer,
          isPaused: true
        }
      })

    }
  };

  const initPlaylist = async (playlist: Playlist) => {
    setPlaylist(playlist)
    
    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      shouldDuckAndroid: false,
      playThroughEarpieceAndroid: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
    });
  }

  const playSongByIndex = async (initialSongIndex: number) => {
    if(playlist){
      const playingNow:Song = playlist.songs[initialSongIndex];
      const prevSongs = playlist.songs.filter( (_song, index) => index < initialSongIndex)
      const nextSongs = playlist.songs.filter( (_song, index) => index > initialSongIndex)
  
      setPlayer( prevPlayer => {
        return {
          ...prevPlayer,
          isPaused: false,
          prevs: prevSongs,
          nexts: nextSongs,
          playingNow: {
            ...prevPlayer.playingNow,
            song: playingNow,
          },
        }
      })

      if(playingNow.id !== player.playingNow.song?.id){
        await player.playingNow.sound?.unloadAsync()
        await createSound(playingNow)
      }else{
        await playPauseAudio(playingNow)
      }
  
    }
  }

  const handlePlay = async () => {
    if(player.playingNow.song){
      await playPauseAudio(player.playingNow.song)
    }
  }

  const handlePause = async () => {
    if(player.playingNow.song){
      await playPauseAudio(player.playingNow.song)
    }
  }

  const handleNext = async () => {
    setPlayer( prevPlayer => {
      const nextSong = prevPlayer.nexts.shift();

      if(!nextSong) {
        return {
          ...prevPlayer,
          isPaused: true,
          playingNow: {
            ...prevPlayer.playingNow,
            song: null
          }
        };
      }

      if(prevPlayer.playingNow.song){
        prevPlayer.prevs.push(prevPlayer.playingNow.song)
      }

      prevPlayer.playingNow = {
        ...prevPlayer.playingNow,
        song: nextSong,
      }

      createSound(nextSong)

      return {
        ...prevPlayer,
        isPaused: false,
      }
    })
  }

  const handlePrevius = async () => {
    setPlayer( prevPlayer => {

      const nextSong = prevPlayer.prevs.pop();

      if(!nextSong) {
        return {
          ...prevPlayer,
          isPaused: true,
          playingNow: {
            ...prevPlayer.playingNow,
            song: null
          }
        };
      }

      if(prevPlayer.playingNow.song){
        prevPlayer.nexts.unshift(prevPlayer.playingNow.song)
      }

      prevPlayer.playingNow = {
        ...prevPlayer.playingNow,
        song: nextSong,
      }

      createSound(nextSong)

      return {
        ...prevPlayer,
        isPaused: false,
      }
    })
  }

  const handleLoop = async () => {
    setPlayer( prevPlayer => {
      return {
        ...prevPlayer,
        isLoop: !prevPlayer.isLoop
      }
    })
  }

  const handleClose = async () => {
    if(player.playingNow.sound){
      await player.playingNow.sound.pauseAsync();
      await player.playingNow.sound.unloadAsync();
    }

    setPlayer(DEFAULT_VALUE)
  }

  return (
    <PlayerContext.Provider value={{
      player,
      initPlaylist,
      playSongByIndex,
      handlePlay,
      handlePause,
      handleNext,
      handlePrevius,
      handleLoop,
      handleClose,
      setPositionInMillis
    }}>
      {children}
    </PlayerContext.Provider>
  )
}

export default PlayerProvider
