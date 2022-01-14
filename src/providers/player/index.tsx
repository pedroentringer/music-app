import React, { createContext, ReactNode, useState } from 'react'
import { Audio } from 'expo-av';

import Player from '../../global/@types/player'
import Playlist from '../../global/@types/playlist'
import Song from '../../global/@types/song'

export interface ContextProvider {
  player: Player,
  setPlaylist: (initialSongIndex: number, playlist: Playlist) => Promise<void>,
  handlePlay: () => Promise<void>,
  handlePause: () => Promise<void>,
  handleNext: () => Promise<void>,
  handlePrevius: () => Promise<void>,
  handleLoop: () => Promise<void>,
  handleClose: () => Promise<void>
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
  playingNow: null,
}

const PlayerProvider = ({ children }: PlayerProviderProps) => {

  const [player, setPlayer] = useState(DEFAULT_VALUE)
  const [sound, setSound] = useState<Audio.Sound | null>(new Audio.Sound());

  const createSound = async (song: Song) => {
    await sound?.unloadAsync()

    const soundCreated = await Audio.Sound.createAsync(song.file, { shouldPlay: true });

    setSound(soundCreated.sound);
    
    await soundCreated.sound.playAsync(); 
  }

  const playPauseAudio = async (song:Song) => {
    
    if(!sound) return await createSound(song)

    if (player.isPaused) {
      const soundStatus = await sound.getStatusAsync()
      
      if(soundStatus.isLoaded && !soundStatus.didJustFinish){
        await sound.playAsync();
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

      await sound.pauseAsync();

      setPlayer( prevPlayer => {
        return {
          ...prevPlayer,
          isPaused: true
        }
      })

    }
  };

  const setPlaylist = async (initialSongIndex: number, playlist: Playlist) => {
    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      shouldDuckAndroid: false,
      playThroughEarpieceAndroid: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
    });

    const playingNow:Song = playlist.songs[initialSongIndex];
    const prevSongs = playlist.songs.filter( (_song, index) => index < initialSongIndex)
    const nextSongs = playlist.songs.filter( (_song, index) => index > initialSongIndex)

    setPlayer({
      isLoop: false,
      isPaused: false,
      prevs: prevSongs,
      nexts: nextSongs,
      playingNow: playingNow,
    })

    await createSound(playingNow)
  }

  const handlePlay = async () => {
    if(player.playingNow){
      await playPauseAudio(player.playingNow)
    }
  }

  const handlePause = async () => {
    if(player.playingNow){
      await playPauseAudio(player.playingNow)
    }
  }

  const handleNext = async () => {
    await sound?.unloadAsync()
    setPlayer( prevPlayer => {

      const nextSong = prevPlayer.nexts.shift();

      if(!nextSong) return prevPlayer;

      if(prevPlayer.playingNow){
        prevPlayer.prevs.push(prevPlayer.playingNow)
      }

      prevPlayer.playingNow = nextSong;

      createSound(nextSong)

      return {
        ...prevPlayer,
        isPaused: false,
      }
    })
  }

  const handlePrevius = async () => {
    await sound?.unloadAsync()
    setPlayer( prevPlayer => {

      const nextSong = prevPlayer.prevs.pop();

      if(!nextSong) return prevPlayer;

      if(prevPlayer.playingNow){
        prevPlayer.nexts.unshift(prevPlayer.playingNow)
      }

      prevPlayer.playingNow = nextSong;

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
    setPlayer(DEFAULT_VALUE)
  }

  return (
    <PlayerContext.Provider value={{
      player,
      setPlaylist,
      handlePlay,
      handlePause,
      handleNext,
      handlePrevius,
      handleLoop,
      handleClose
    }}>
      {children}
    </PlayerContext.Provider>
  )
}

export default PlayerProvider
