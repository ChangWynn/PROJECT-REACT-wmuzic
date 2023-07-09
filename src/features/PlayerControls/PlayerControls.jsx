import styles from "./css/PlayerControls.module.css";

import PlayerButtons from "./PlayerButtons";
import AudioProgressBar from "./AudioProgressBar";
import { forwardRef } from "react";

const PlayerControls = forwardRef((_, ref) => {
  return (
    <div ref={ref} className={styles["audio-controllers"]}>
      <AudioProgressBar />
      <PlayerButtons />
    </div>
  );
});

export default PlayerControls;
