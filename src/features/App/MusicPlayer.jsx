import styles from "./css/MusicPlayer.module.css";
import { getUserStorage } from "../../utilities/getUserStorage";

import React, { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";

import { ref, uploadBytes } from "firebase/storage";
import { storage } from "../../config/firebase";
import AudioControllers from "./AudioControllers";
import Playlist from "../Playlist/Playlist";

export const Context = React.createContext();

const MusicPlayer = () => {
  const { uid, userItems } = useOutletContext();

  const [songIsPlaying, setSongIsPlaying] = useState(false);

  const [songsRefs, setSongsRefs] = useState(userItems.songsRefs);
  const [songsURL, setSongsURL] = useState(userItems.songsURL);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  const currentSong = useRef();
  console.log(currentSong.current?.duration);
  useEffect(() => {
    const song = currentSong?.current;
    if (songIsPlaying) {
      song.play();
    } else song.pause();
  }, [songIsPlaying, currentSongIndex]);

  // MUSIC PLAYER CONTROLS
  const togglePlay = () => {
    setSongIsPlaying(!songIsPlaying);
  };

  const nextSong = () => {
    if (currentSongIndex === songsURL.length - 1) setCurrentSongIndex(0);
    else {
      setCurrentSongIndex((currentIndex) => {
        return currentIndex + 1;
      });
    }
  };

  const previousSong = () => {
    if (currentSongIndex === 0) setCurrentSongIndex(songsURL.length - 1);
    else {
      setCurrentSongIndex((currentIndex) => {
        return currentIndex - 1;
      });
    }
  };

  return (
    <Context.Provider
      value={{
        songIsPlaying,
        currentSong,
        currentSongIndex,
        songsRefs,
        songsURL,
        setSongsRefs,
        setSongsURL,
        togglePlay,
        previousSong,
        nextSong,
      }}
    >
      <div className={styles["app"]}>
        <audio
          ref={currentSong}
          src={songsURL[currentSongIndex]}
          onEnded={nextSong}
        ></audio>
        <Playlist />
        <AudioControllers />
      </div>
    </Context.Provider>
  );
};

export default MusicPlayer;
