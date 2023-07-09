import styles from "./css/PlayerButtonUI.module.css";
import { useContext } from "react";
import { AppContext } from "../../layout/AppLayout";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const PlayerButtonUI = ({ onClickFn, FaIcon, styleName }) => {
  const { files } = useContext(AppContext);
  return (
    <button
      className={styles["control-button"]}
      onClick={onClickFn}
      disabled={files.songRefs.length < 1}
    >
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

export default PlayerButtonUI;
