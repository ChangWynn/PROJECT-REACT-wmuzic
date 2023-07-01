import styles from "./css/AudioControls.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faForwardStep,
  faBackwardStep,
} from "@fortawesome/sharp-solid-svg-icons";

import { Context } from "./MusicPlayer";
import { useContext } from "react";
import ControlButton from "./ControlButton";

const AudioControls = () => {
  const {
    songIsPlaying,
    setSongIsPlaying,
    currentSongIndex,
    setCurrentSongIndex,
    songRefs,
  } = useContext(Context);

  const togglePlay = () => {
    setSongIsPlaying(!songIsPlaying);
  };

  const nextSong = () => {
    if (currentSongIndex === songRefs.length - 1) setCurrentSongIndex(0);
    else {
      setCurrentSongIndex((currentIndex) => {
        return currentIndex + 1;
      });
    }
  };

  const previousSong = () => {
    if (currentSongIndex === 0) setCurrentSongIndex(songRefs.length - 1);
    else {
      setCurrentSongIndex((currentIndex) => {
        return currentIndex - 1;
      });
    }
  };

  return (
    <div className={styles["audio-controls"]}>
      <ControlButton
        onClickFn={previousSong}
        FaIcon={faBackwardStep}
        styleName="icon-prev-next"
      />
      <ControlButton
        onClickFn={togglePlay}
        FaIcon={songIsPlaying ? faPause : faPlay}
        styleName="icon-play-pause"
      />
      <ControlButton
        onClickFn={nextSong}
        FaIcon={faForwardStep}
        styleName="icon-prev-next"
      />
    </div>
  );
};

export default AudioControls;
