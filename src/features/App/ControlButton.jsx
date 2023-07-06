import styles from "./css/ControlButton.module.css";
import { useContext } from "react";
import { MainContext } from "./MusicPlayer";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ControlButton = ({ onClickFn, FaIcon, styleName }) => {
  const { files } = useContext(MainContext);
  return (
    <button onClick={onClickFn} disabled={files.songRefs.length < 1}>
      <FontAwesomeIcon
        icon={FaIcon}
        className={`${styles["icon"]} ${styles[styleName]} ${
          files.songRefs.length === 0 && styles["disabled"]
        }`}
        size="5x"
      />
    </button>
  );
};

export default ControlButton;
