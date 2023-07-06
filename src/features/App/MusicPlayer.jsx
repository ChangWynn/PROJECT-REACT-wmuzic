import styles from "./css/MusicPlayer.module.css";
import AudioControllers from "./AudioControllers";
import Playlist from "../Playlist/Playlist";

import React, { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";

import { getDownloadURL } from "firebase/storage";
import Visual from "../Visual/Visual";
import AppNavigation from "./AppNavigation";

import UploadForm from "../Upload/UploadForm";
import Menu from "../Menu/Menu";

export const MainContext = React.createContext();

const MusicPlayer = () => {
  const { allRefs } = useOutletContext();

  const [songRefs, setSongRefs] = useState(allRefs);
  const [songIsPlaying, setSongIsPlaying] = useState(false);
  const [currentSongURL, setCurrentSongURL] = useState("");
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  const [currentRepeatMode, setCurrentRepeatMode] = useState(0);
  const [shuffleMode, setShuffleMode] = useState(false);

  const currentSongRef = useRef();

  const [showForm, setShowForm] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(true);

  ////// download metadata when songRefs length changes  //////

  ////// download url of current index //////

  useEffect(() => {
    const downloadURL = async () => {
      const url = await getDownloadURL(songRefs[currentSongIndex]);
      setCurrentSongURL(url);
    };
    if (songRefs.length > 0) downloadURL();
  }, [currentSongIndex]);

  ////// auto play on index change //////

  useEffect(() => {
    const song = currentSongRef?.current;

    if (songIsPlaying) {
      song.play();
    } else song.pause();
  }, [songIsPlaying, currentSongURL]);

  const nextSong = () => {
    if (shuffleMode) shuffleModeOnHandler();
    else if (currentSongIndex === songRefs.length - 1) setCurrentSongIndex(0);
    else {
      setCurrentSongIndex((currentIndex) => {
        return currentIndex + 1;
      });
    }
  };

  const endOfTrackHandler = () => {
    if (currentRepeatMode === 1) {
      currentSongRef.current.play();
    } else {
      if (shuffleMode) {
        shuffleModeOnHandler();
      } else {
        shuffleModeOffHandler();
      }
    }
  };

  const shuffleModeOnHandler = () => {
    const currentIndex = currentSongIndex;
    const randomIndex = Math.floor(Math.random() * songRefs.length);

    if (currentIndex === randomIndex) {
      shuffleModeOnHandler();
    } else {
      setCurrentSongIndex(randomIndex);
    }
  };

  const shuffleModeOffHandler = () => {
    const isTheLastSong = currentSongIndex === songRefs.length - 1;
    if (
      (currentRepeatMode === 0 && !isTheLastSong) ||
      currentRepeatMode === 2
    ) {
      nextSong();
    }
  };

  return (
    <MainContext.Provider
      value={{
        nextSong,
        currentSongRef,
        songIsPlaying,
        setSongIsPlaying,
        currentSongIndex,
        setCurrentSongIndex,
        songRefs,
        setSongRefs,
        currentRepeatMode,
        setCurrentRepeatMode,
        shuffleMode,
        setShuffleMode,
        showPlaylist,
        setShowPlaylist,
        showForm,
        setShowForm,
      }}
    >
      <div className={styles["app"]}>
        <audio
          ref={currentSongRef}
          id="audio"
          src={currentSongURL}
          onEnded={endOfTrackHandler}
        />
        <AppNavigation />
        <div className={styles["app--middle"]}>
          <Playlist songRefs={songRefs} />
          {songRefs.length > 0 && <Visual />}
        </div>
        <Menu />
        <AudioControllers />
        <UploadForm showForm={showForm} setShowForm={setShowForm} />
      </div>
    </MainContext.Provider>
  );
};

export default MusicPlayer;
