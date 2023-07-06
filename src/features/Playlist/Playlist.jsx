import styles from "./css/Playlist.module.css";
import Song from "./Song";

import { MainContext } from "../App/MusicPlayer";
import { useContext, useEffect, useState } from "react";
import { getMetadata } from "firebase/storage";

const Playlist = ({ songRefs }) => {
  const { showPlaylist } = useContext(MainContext);
  const [metadata, setMetadata] = useState([]);

  useEffect(() => {
    const extractMetadata = async () => {
      const metadata = await songRefs.map(async (songRef) => {
        return await getMetadata(songRef);
      });
      setMetadata(await Promise.all(metadata));
    };

    extractMetadata();
  }, [songRefs.length]);

  return (
    <div className={`${styles["container"]} ${showPlaylist && styles["show"]}`}>
      <div
        className={`${styles["playlist"]} ${showPlaylist && styles["show"]}`}
      >
        {songRefs.length > 0 &&
          metadata.length === songRefs.length &&
          songRefs.map((songRef, index) => {
            return (
              <Song
                key={songRef.name}
                songRef={songRef}
                songMD={metadata[index]}
                index={index}
              />
            );
          })}
      </div>
    </div>
  );
};

export default Playlist;
