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
  const { songIsPlaying, previousSong, togglePlay, nextSong } =
    useContext(Context);

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
