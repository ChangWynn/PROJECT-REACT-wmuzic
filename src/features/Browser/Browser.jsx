import { useContext } from "react";
import styles from "./Browser.module.css";
import { AppContext } from "../../layout/AppLayout";
import { faAngleDoubleDown, faAngleDoubleUp } from "@fortawesome/pro-regular-svg-icons";
import ToggleDisplayBtn from "./ToggleDisplayBtn";
import Playlist from "../Playlist/Playlist";
import Visual from "../Visual/Visual";

const Browser = () => {
  const { showMediaMenu, setShowMediaMenu } = useContext(AppContext);
  return (
    <div className={`${styles["browser-container"]} ${showMediaMenu && styles["open"]}`}>
      <ToggleDisplayBtn
        faIcon={showMediaMenu ? faAngleDoubleDown : faAngleDoubleUp}
        clickEvent={() => setShowMediaMenu(!showMediaMenu)}
      />
    </div>
  );
};

export default Browser;
