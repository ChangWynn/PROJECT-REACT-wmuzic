import { useContext } from "react";
import styles from "./Browser.module.css";
import { MainContext } from "../App/MusicPlayer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDoubleDown,
  faAngleDoubleUp,
  faAngleUp,
} from "@fortawesome/pro-regular-svg-icons";
import ToggleDisplayBtn from "./ToggleDisplayBtn";

const Browser = () => {
  const { showMediaMenu, setShowMediaMenu } = useContext(MainContext);
  return (
    <div
      className={`${styles["browser-container"]} ${
        showMediaMenu && styles["open"]
      }`}
    >
      <ToggleDisplayBtn
        faIcon={showMediaMenu ? faAngleDoubleDown : faAngleDoubleUp}
        clickEvent={() => setShowMediaMenu(!showMediaMenu)}
      />
    </div>
  );
};

export default Browser;
