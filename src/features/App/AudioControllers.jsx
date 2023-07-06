import styles from "./css/AudioControllers.module.css";

import AudioControl from "./AudioControl";
import AudioProgressBar from "./AudioProgressBar";

const AudioControllers = () => {
  return (
    <div className={styles["audio-controllers"]}>
      <AudioProgressBar />
      <AudioControl />
    </div>
  );
};

export default AudioControllers;
