import { useContext } from "react";
import styles from "./Browser.module.css";
import { MainContext } from "../App/MusicPlayer";

const Browser = () => {
  const { showMediaMenu } = useContext(MainContext);
  return (
    <div
      className={`${styles["browser-container"]} ${
        showMediaMenu && styles["open"]
      }`}
    >
      <h1>work in progress</h1>
    </div>
  );
};

export default Browser;
