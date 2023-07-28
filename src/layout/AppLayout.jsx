import styles from "./css/AppLayout.module.css";
import PlayerControls from "../features/PlayerControls/PlayerControls";
import Playlist from "../features/Playlist/Playlist";

import React, { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";

import { getDownloadURL } from "firebase/storage";
import Visual from "../features/Visual/Visual";
import AppNavigation from "../features/AppNavigation/AppNavigation";

import UploadContext from "../features/Upload/context/UploadContext";
import Menu from "../features/Menu/Menu";

export const AppContext = React.createContext();

const AppLayout = () => {
  const { allSongRefsAndMD } = useOutletContext();

  const [songIsPlaying, setSongIsPlaying] = useState(false);

  const [songRefsAndMD, setSongRefsAndMD] = useState(allSongRefsAndMD);
  const [currentSongURL, setCurrentSongURL] = useState("");
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  const [currentRepeatMode, setCurrentRepeatMode] = useState(0);
  const [shuffleMode, setShuffleMode] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(true);
  const [showMediaMenu, setShowMediaMenu] = useState(false);

  const currentSongRef = useRef();
  const audioRef = useRef();

  const appNavRef = useRef();
  const playlistMenuRef = useRef();
  const audioControllersRef = useRef();
  const [playlistComputedHeight, setPlaylistComputedHeight] = useState();

  useEffect(() => {
    const appNavHeight = appNavRef.current?.clientHeight;
    const playlistHeight = playlistMenuRef.current?.clientHeight;
    const audioControllersHeight = audioControllersRef.current?.clientHeight;
    const otherUIcomputedHeights = appNavHeight + playlistHeight + audioControllersHeight;

    setPlaylistComputedHeight(`calc(100vh - ${otherUIcomputedHeights + "px"})`);
  }, []);

  ////// download url of current index //////

  useEffect(() => {
    const downloadURL = async () => {
      const url = await getDownloadURL(songRefsAndMD[currentSongIndex].ref);
      if (url === currentSongURL) return;
      setCurrentSongURL(url);
    };
    if (songRefsAndMD.length > 0) downloadURL();
  }, [currentSongIndex]);

  ////// auto play on index change //////

  useEffect(() => {
    const song = audioRef?.current;

    currentSongRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });

    if (songIsPlaying) {
      song.play();
    } else song.pause();
  }, [songIsPlaying, currentSongURL]);

  ////// player controls methods //////

  const nextSong = () => {
    if (shuffleMode) shuffleModeOnHandler();
    else if (currentSongIndex === songRefsAndMD.length - 1) setCurrentSongIndex(0);
    else {
      setCurrentSongIndex((currentIndex) => {
        return currentIndex + 1;
      });
    }
  };

  const endOfTrackHandler = () => {
    if (currentRepeatMode === 1) {
      audioRef.current.play();
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
    const randomIndex = Math.floor(Math.random() * songRefsAndMD.length);

    if (currentIndex === randomIndex) {
      shuffleModeOnHandler();
    } else {
      setCurrentSongIndex(randomIndex);
    }
  };

  const shuffleModeOffHandler = () => {
    const isTheLastSong = currentSongIndex === songRefsAndMD.length - 1;
    if ((currentRepeatMode === 0 && !isTheLastSong) || currentRepeatMode === 2) {
      nextSong();
    }
  };

  return (
    <AppContext.Provider
      value={{
        nextSong,
        audioRef,
        currentSongRef,
        songIsPlaying,
        setSongIsPlaying,
        currentSongIndex,
        setCurrentSongIndex,
        songRefsAndMD,
        setSongRefsAndMD,
        currentRepeatMode,
        setCurrentRepeatMode,
        shuffleMode,
        setShuffleMode,
        showPlaylist,
        setShowPlaylist,
        showForm,
        setShowForm,
        showMediaMenu,
        setShowMediaMenu,
      }}
    >
      <div className={styles["app"]}>
        <audio ref={audioRef} id="audio" src={currentSongURL} onEnded={endOfTrackHandler} />
        <AppNavigation ref={appNavRef} />
        <div
          className={styles["app--middle"]}
          style={{
            height: playlistComputedHeight,
          }}
        >
          {songRefsAndMD.length > 0 && <Playlist />}
          {songRefsAndMD.length > 0 && <Visual />}
        </div>
        <Menu ref={playlistMenuRef} />
        <PlayerControls ref={audioControllersRef} />
        <UploadContext showForm={showForm} setShowForm={setShowForm} />
      </div>
    </AppContext.Provider>
  );
};

export default AppLayout;
