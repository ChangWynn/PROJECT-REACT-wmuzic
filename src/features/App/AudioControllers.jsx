import styles from "./css/AudioControllers.module.css";

import AudioControls from "./AudioControls";
import AudioProgressBar from "./AudioProgressBar";

const AudioControllers = () => {
  return (
    <div
      className={styles["audio-controllers"]}
      onClick={(e) => console.log(e.target.clientHeight)}
    >
      <AudioProgressBar />
      <AudioControls />
    </div>
  );
};

export default AudioControllers;
