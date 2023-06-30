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
      <button onClick={previousSong}>
        {" "}
        <FontAwesomeIcon
          icon={faBackwardStep}
          className={styles["icon-prev-next"]}
          size="5x"
        />
      </button>
      <button onClick={togglePlay}>
        {songIsPlaying ? (
          <FontAwesomeIcon
            icon={faPause}
            className={styles["icon-play-pause"]}
            size="5x"
          />
        ) : (
          <FontAwesomeIcon
            icon={faPlay}
            className={styles["icon-play-pause"]}
            size="5x"
          />
        )}
      </button>
      <button onClick={nextSong}>
        <FontAwesomeIcon
          icon={faForwardStep}
          className={styles["icon-prev-next"]}
          size="5x"
        />
      </button>
    </div>
  );
};

export default AudioControls;
