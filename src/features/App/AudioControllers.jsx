import styles from "./css/AudioControllers.module.css";

import AudioControl from "./AudioControl";
import AudioProgressBar from "./AudioProgressBar";
import { forwardRef } from "react";

const AudioControllers = forwardRef((_, ref) => {
  return (
    <div ref={ref} className={styles["audio-controllers"]}>
      <AudioProgressBar />
      <AudioControl />
    </div>
  );
});

export default AudioControllers;
