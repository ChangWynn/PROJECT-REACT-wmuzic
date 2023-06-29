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
  const { userItems } = useOutletContext();

  const [songIsPlaying, setSongIsPlaying] = useState(false);

  const [songsRefs, setSongsRefs] = useState(userItems.songsRefs);
  const [songsURL, setSongsURL] = useState(userItems.songsURL);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  const currentSong = useRef();

  useEffect(() => {
    const song = currentSong?.current;
    if (songIsPlaying) {
      song.play();
    } else song.pause();
  }, [songIsPlaying, currentSongIndex]);

  return (
    <Context.Provider
      value={{
        currentSong,
        songIsPlaying,
        setSongIsPlaying,
        currentSongIndex,
        setCurrentSongIndex,
        songsRefs,
        songsURL,
        setSongsRefs,
        setSongsURL,
      }}
    >
      <div className={styles["app"]}>
        <audio
          ref={currentSong}
          src={songsURL[currentSongIndex]}
          // onEnded={nextSong}
        ></audio>
        <Playlist />
        <AudioControllers />
      </div>
    </Context.Provider>
  );
};

export default MusicPlayer;
