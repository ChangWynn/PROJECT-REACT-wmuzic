import styles from "./css/MusicPlayer.module.css";
import AudioControllers from "./AudioControllers";
import Playlist from "../Playlist/Playlist";

import React, { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";

import { getDownloadURL } from "firebase/storage";
import Visual from "../Visual/Visual";
import AppNavigation from "./AppNavigation";

export const Context = React.createContext();

const MusicPlayer = () => {
  const { allRefs } = useOutletContext();

  const [songRefs, setSongRefs] = useState(allRefs);
  const [songIsPlaying, setSongIsPlaying] = useState(false);
  const [currentSongURL, setCurrentSongURL] = useState("");
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  const currentSongRef = useRef();

  useEffect(() => {
    const downloadURL = async () => {
      const url = await getDownloadURL(songRefs[currentSongIndex]);
      setCurrentSongURL(url);
    };
    downloadURL();
  }, [currentSongIndex]);

  useEffect(() => {
    const song = currentSongRef?.current;
    if (songIsPlaying) {
      song.play();
    } else song.pause();
  }, [songIsPlaying, currentSongURL]);

  return (
    <Context.Provider
      value={{
        currentSongRef,
        songIsPlaying,
        setSongIsPlaying,
        currentSongIndex,
        setCurrentSongIndex,
        songRefs,
        setSongRefs,
      }}
    >
      <div className={styles["app"]}>
        <audio
          ref={currentSongRef}
          src={currentSongURL}
          // onEnded={nextSong}
        ></audio>
        <AppNavigation />
        <div className={styles["app--middle"]}>
          <Playlist />
          <Visual />
        </div>
        <AudioControllers />
      </div>
    </Context.Provider>
  );
};

export default MusicPlayer;
