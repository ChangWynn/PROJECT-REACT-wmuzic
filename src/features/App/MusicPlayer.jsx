import styles from "./css/MusicPlayer.module.css";
import AudioControllers from "./AudioControllers";
import Playlist from "../Playlist/Playlist";

import React, { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";

import { getDownloadURL, getMetadata } from "firebase/storage";
import Visual from "../Visual/Visual";
import AppNavigation from "./AppNavigation";

import UploadForm from "../Upload/UploadForm";
import Menu from "../Menu/Menu";

export const MainContext = React.createContext();

const MusicPlayer = () => {
  const { allRefs } = useOutletContext();

  const [songIsPlaying, setSongIsPlaying] = useState(false);

  const [files, setFiles] = useState({ songRefs: allRefs, songMD: [] });
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
    const otherUIcomputedHeights =
      appNavHeight + playlistHeight + audioControllersHeight;

    setPlaylistComputedHeight(`calc(100vh - ${otherUIcomputedHeights + "px"})`);
  }, []);

  console.log(playlistComputedHeight);

  ////// download metadata when songRefs length changes  //////

  useEffect(() => {
    const extractMetadata = async () => {
      const metadata = await files.songRefs.map(async (songRef) => {
        return await getMetadata(songRef);
      });
      const songMD = await Promise.all(metadata);
      setFiles((prev) => {
        return { ...prev, songMD: [...songMD] };
      });
    };

    extractMetadata();
  }, [files.songRefs.length]);

  ////// download url of current index //////

  useEffect(() => {
    const downloadURL = async () => {
      const url = await getDownloadURL(files.songRefs[currentSongIndex]);
      setCurrentSongURL(url);
    };
    if (files.songRefs.length > 0) downloadURL();
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

  const nextSong = () => {
    if (shuffleMode) shuffleModeOnHandler();
    else if (currentSongIndex === files.songRefs.length - 1)
      setCurrentSongIndex(0);
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
    const randomIndex = Math.floor(Math.random() * files.songRefs.length);

    if (currentIndex === randomIndex) {
      shuffleModeOnHandler();
    } else {
      setCurrentSongIndex(randomIndex);
    }
  };

  const shuffleModeOffHandler = () => {
    const isTheLastSong = currentSongIndex === files.songRefs.length - 1;
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
        audioRef,
        currentSongRef,
        songIsPlaying,
        setSongIsPlaying,
        currentSongIndex,
        setCurrentSongIndex,
        files,
        setFiles,
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
        <audio
          ref={audioRef}
          id="audio"
          src={currentSongURL}
          onEnded={endOfTrackHandler}
        />
        <AppNavigation ref={appNavRef} />
        <div
          className={styles["app--middle"]}
          style={{
            height: playlistComputedHeight,
          }}
        >
          {files.songMD.length === files.songRefs.length && <Playlist />}
          {files.songMD.length > 0 && <Visual />}
        </div>
        <Menu ref={playlistMenuRef} />
        <AudioControllers ref={audioControllersRef} />
        <UploadForm showForm={showForm} setShowForm={setShowForm} />
      </div>
    </MainContext.Provider>
  );
};

export default MusicPlayer;
