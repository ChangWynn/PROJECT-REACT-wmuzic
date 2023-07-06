import styles from "./css/Playlist.module.css";
import Song from "./Song";

import { MainContext } from "../App/MusicPlayer";
import { useContext, useEffect, useState } from "react";
import { getMetadata } from "firebase/storage";

const Playlist = () => {
  const { showPlaylist, files } = useContext(MainContext);
  console.log("song 2", files.songMD[2]?.customMetadata);
  return (
    <div className={`${styles["container"]} ${showPlaylist && styles["show"]}`}>
      <div
        className={`${styles["playlist"]} ${showPlaylist && styles["show"]}`}
      >
        {files.songRefs.length > 0 &&
          files.songRefs.map((songRef, index) => {
            return (
              <Song
                key={songRef.name}
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
