import styles from "./css/AudioControls.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faForwardStep,
  faBackwardStep,
} from "@fortawesome/sharp-solid-svg-icons";

import { MainContext } from "./MusicPlayer";
import { useContext } from "react";
import ControlButton from "./ControlButton";
import {
  faArrowsRepeat,
  faRepeat1,
  faShuffle,
} from "@fortawesome/sharp-regular-svg-icons";

const AudioControls = () => {
  const {
    nextSong,
    songIsPlaying,
    setSongIsPlaying,
    currentSongIndex,
    setCurrentSongIndex,
    currentSongRef,
    files,
    currentRepeatMode,
    setCurrentRepeatMode,
    shuffleMode,
    setShuffleMode,
  } = useContext(MainContext);

  const togglePlay = () => {
    setSongIsPlaying(!songIsPlaying);
  };

  const prevSong = () => {
    if (currentSongRef.current.currentTime > 10) {
      currentSongRef.current.currentTime = 0;
    } else if (currentSongIndex === 0)
      setCurrentSongIndex(files.songRefs.length - 1);
    else {
      setCurrentSongIndex((currentIndex) => {
        return currentIndex - 1;
      });
    }
  };

  const toggleRepeatMode = () => {
    if (currentRepeatMode === 2) setCurrentRepeatMode(0);
    else {
      setCurrentRepeatMode((prevMode) => {
        return prevMode + 1;
      });
    }
  };

  const setRepeatIcon = () => {
    if (currentRepeatMode === 0 || currentRepeatMode === 2) {
      return faArrowsRepeat;
    } else {
      return faRepeat1;
    }
  };

  return (
    <div className={styles["audio-controls"]}>
      <ControlButton
        onClickFn={toggleRepeatMode}
        FaIcon={setRepeatIcon()}
        styleName={currentRepeatMode === 0 ? "off" : "repeat"}
      />
      <ControlButton
        onClickFn={prevSong}
        FaIcon={faBackwardStep}
        styleName="prev-next"
      />
      <ControlButton
        onClickFn={togglePlay}
        FaIcon={songIsPlaying ? faPause : faPlay}
        styleName="play-pause"
      />
      <ControlButton
        onClickFn={nextSong}
        FaIcon={faForwardStep}
        styleName="prev-next"
      />
      <ControlButton
        onClickFn={() => setShuffleMode(!shuffleMode)}
        FaIcon={faShuffle}
        styleName={shuffleMode ? "shuffle" : "off"}
      />
    </div>
  );
};

export default AudioControls;
