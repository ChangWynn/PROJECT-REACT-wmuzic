import styles from "./css/Playlist.module.css";
import Song from "./Song";

import { MainContext } from "../App/MusicPlayer";
import { useContext, useEffect, useState } from "react";
import { getMetadata } from "firebase/storage";
import Menu from "../Menu/Menu";

const Playlist = () => {
  const { showPlaylist, files } = useContext(MainContext);

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
