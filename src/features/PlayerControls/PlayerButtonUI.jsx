import styles from "./css/PlayerButtonUI.module.css";
import { useContext } from "react";
import { AppContext } from "../../layout/AppLayout";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const PlayerButtonUI = ({ onClickFn, FaIcon, styleName }) => {
  const { songRefsAndMD } = useContext(AppContext);
  return (
    <button
      className={styles["control-button"]}
      onClick={onClickFn}
      disabled={songRefsAndMD.length < 1}
    >
      <FontAwesomeIcon
        icon={FaIcon}
        className={`${styles["icon"]} ${styles[styleName]} ${
          songRefsAndMD.length === 0 && styles["disabled"]
        }`}
        size="5x"
      />
    </button>
  );
};

export default PlayerButtonUI;
