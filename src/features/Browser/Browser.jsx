import { useContext } from "react";
import styles from "./Browser.module.css";
import { MainContext } from "../App/MusicPlayer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDoubleDown,
  faAngleDoubleUp,
  faAngleUp,
} from "@fortawesome/pro-regular-svg-icons";

const Browser = () => {
  const { showMediaMenu, setShowMediaMenu } = useContext(MainContext);
  return (
    <div
      className={`${styles["browser-container"]} ${
        showMediaMenu && styles["open"]
      }`}
    >
      <button onClick={() => setShowMediaMenu(!showMediaMenu)}>
        <FontAwesomeIcon
          size="xl"
          icon={showMediaMenu ? faAngleDoubleDown : faAngleDoubleUp}
          style={{ color: "#ffffff" }}
        />
      </button>
    </div>
  );
};

export default Browser;
