import styles from "./css/ControlButton.module.css";
import { useContext } from "react";
import { MainContext } from "./MusicPlayer";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ControlButton = ({ onClickFn, FaIcon, styleName }) => {
  const { songRefs } = useContext(MainContext);
  return (
    <button onClick={onClickFn} disabled={songRefs.length < 1}>
      <FontAwesomeIcon
        icon={FaIcon}
        className={`${styles["icon"]} ${styles[styleName]} ${
          songRefs.length === 0 && styles["disabled"]
        }`}
        size="5x"
      />
    </button>
  );
};

export default ControlButton;
