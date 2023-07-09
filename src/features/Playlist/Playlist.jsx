import styles from "./css/Playlist.module.css";
import Song from "./Song";

import { AppContext } from "../../layout/AppLayout";
import { useContext } from "react";

const Playlist = () => {
  const { showPlaylist, files } = useContext(AppContext);

  return (
    <div
      className={`${styles["container"]} ${!showPlaylist && styles["hide"]}`}
    >
      <div
        className={`${styles["playlist"]} ${!showPlaylist && styles["hide"]}`}
      >
        {files.songRefs.length > 0 &&
          files.songRefs.map((songRef, index) => {
            return (
              <Song
                key={songRef.name}
                id={index}
                songRef={songRef}
                songMD={files.songMD[index]}
                index={index}
              />
            );
          })}
      </div>
    </div>
  );
};

export default Playlist;
