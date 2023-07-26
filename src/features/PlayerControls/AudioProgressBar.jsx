import { useContext, useEffect, useState } from "react";
import styles from "./css/AudioProgressBar.module.css";

import { AppContext } from "../../layout/AppLayout";
import AudioDuration from "./AudioDuration";
import Slider from "../../shared/ui/Slider";
import { formatDuration } from "../../utilities/formatDuration";

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
      interval = setInterval(updateProgressBar, 50);
    }

    return () => {
      return clearInterval(interval);
    };
  }, [songIsPlaying, currentSongIndex, song]);

  const navigateInSong = (newCurrentTime) => {
    audioRef.current.currentTime = newCurrentTime;
  };

  return (
    <div className={styles["track--container"]}>
      <Slider
        objectRefRange={audioRef.current?.duration}
        currentValue={songProgression}
        setCurrentValue={setSongProgression}
        navigateFn={navigateInSong}
        formatTooltip={formatDuration}
        formatTooltipFallback={() => "0:00"}
      />
      <AudioDuration />
    </div>
  );
};

export default AudioProgressBar;
