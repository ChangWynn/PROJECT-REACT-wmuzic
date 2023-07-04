import styles from "./css/Playlist.module.css";
import Song from "./Song";

import { MainContext } from "../App/MusicPlayer";
import { useContext } from "react";

const Playlist = () => {
  const { songRefs, showPlaylist } = useContext(MainContext);

  return (
    <div className={`${styles["container"]} ${showPlaylist && styles["show"]}`}>
      <div
        className={`${styles["playlist"]} ${showPlaylist && styles["show"]}`}
      >
        {songRefs.length > 0 &&
          songRefs.map((itemRef, index) => {
            return <Song key={itemRef.name} itemRef={itemRef} index={index} />;
          })}
      </div>
    </div>
  );
};

export default Playlist;
