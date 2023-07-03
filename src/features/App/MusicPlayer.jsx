import styles from "./css/MusicPlayer.module.css";
import AudioControllers from "./AudioControllers";
import Playlist from "../Playlist/Playlist";

import React, { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";

import { getDownloadURL } from "firebase/storage";
import Visual from "../Visual/Visual";
import AppNavigation from "./AppNavigation";

export const MainContext = React.createContext();

const MusicPlayer = () => {
  const { allRefs } = useOutletContext();

  const [songRefs, setSongRefs] = useState(allRefs);
  const [songIsPlaying, setSongIsPlaying] = useState(false);
  const [currentSongURL, setCurrentSongURL] = useState("");
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  const [currentRepeatMode, setCurrentRepeatMode] = useState(0);

  const currentSongRef = useRef();

  useEffect(() => {
    console.log("running");
    const downloadURL = async () => {
      const url = await getDownloadURL(songRefs[currentSongIndex]);
      setCurrentSongURL(url);
    };
    if (songRefs.length > 0) downloadURL();
  }, [currentSongIndex, songRefs]);

  useEffect(() => {
    const song = currentSongRef?.current;
    if (songIsPlaying) {
      song.play();
    } else song.pause();
  }, [songIsPlaying, currentSongURL]);

  const nextSong = () => {
    if (currentSongIndex === songRefs.length - 1) setCurrentSongIndex(0);
    else {
      setCurrentSongIndex((currentIndex) => {
        return currentIndex + 1;
      });
    }
  };

  const endOfTrackHandler = () => {
    const isTheLastSong = currentSongIndex === songRefs.length - 1;
    if (currentRepeatMode === 0 && !isTheLastSong) {
      nextSong();
    }
    if (currentRepeatMode === 1) {
      currentSongRef.current.play();
    }
    if (currentRepeatMode === 2) {
      nextSong();
    }
  };
  console.log(currentRepeatMode);

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
      }}
    >
      <div className={styles["app"]}>
        <audio
          ref={currentSongRef}
          src={currentSongURL}
          onEnded={endOfTrackHandler}
        ></audio>
        <AppNavigation />
        <div className={styles["app--middle"]}>
          <Playlist />
          {songRefs.length > 0 && <Visual />}
        </div>
        <AudioControllers />
      </div>
    </MainContext.Provider>
  );
};

export default MusicPlayer;
