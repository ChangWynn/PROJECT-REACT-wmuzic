import { useContext, useEffect, useState } from "react";
import styles from "./css/AudioProgressBar.module.css";

import { AppContext } from "../../layout/AppLayout";
import AudioDuration from "./AudioDuration";

const AudioProgressBar = () => {
  const [songProgression, setSongProgression] = useState(0);
  const [bufferProgression, setBufferProgression] = useState(0);

  const { audioRef, currentSongIndex, songIsPlaying } = useContext(AppContext);

  const song = audioRef?.current;

  const updateBufferProgression = ({ buffered, duration }) => {
    if (buffered.length > 0) {
      for (let i = 0; i < buffered.length; i++) {
        const bufferProgression = (buffered.end(i) / duration) * 100;
        setBufferProgression(bufferProgression);
      }
    }
  };

  const updateSongProgression = ({ currentTime, duration }) => {
    const songProgress = ((currentTime / duration) * 100).toFixed(2);
    setSongProgression(songProgress);
  };

  useEffect(() => {
    const updateProgressBar = () => {
      updateSongProgression(song);
      updateBufferProgression(song);
    };

    let interval;
    if (songIsPlaying) {
      interval = setInterval(updateProgressBar, 1000);
    }

    return () => {
      return clearInterval(interval);
    };
  }, [songIsPlaying, currentSongIndex, song]);

  const navigateInSong = (e) => {
    const width = e.target.clientWidth;
    const clickOffset = e.nativeEvent.offsetX;
    const newCurrentTime = (clickOffset / width) * audioRef.current.duration;
    const newSongProgress = (clickOffset / width) * 100;

    audioRef.current.currentTime = newCurrentTime;
    setSongProgression(newSongProgress);
  };

  return (
    <div className={styles["track--container"]}>
      <div className={styles["track--background"]}>
        <div onClick={navigateInSong} className={styles["track--overlay"]} />
        <div
          style={{ width: bufferProgression + "%" }}
          className={styles["track--buffer"]}
        />
        <div
          style={{ width: songProgression + "%" }}
          className={styles["track--progress"]}
        />
      </div>
      <AudioDuration />
    </div>
  );
};

export default AudioProgressBar;
