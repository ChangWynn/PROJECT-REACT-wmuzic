import styles from "./css/AudioControllers.module.css";

import AudioControls from "./AudioControls";
import AudioProgressBar from "./AudioProgressBar";

const AudioControllers = (props) => {
  return (
    <div className={styles["audio-controllers"]}>
      <AudioProgressBar
        currentSong={props.currentSong}
        currentSongIndex={props.currentSongIndex}
        songIsPlaying={props.songIsPlaying}
      />
      <AudioControls props={props} />
    </div>
  );
};

export default AudioControllers;
