import styles from "./Playlist.module.css";
import Song from "./Song";
import { AppContext } from "../../layout/AppLayout";

import { useContext, useEffect, useMemo, useState } from "react";
import { Reorder } from "framer-motion";
import { duration } from "moment";

const Playlist = () => {
  const { showPlaylist, songRefsAndMD, setSongRefsAndMD, currentSongIndex, setCurrentSongIndex } =
    useContext(AppContext);

  const [currentSong, setCurrentSong] = useState(songRefsAndMD[currentSongIndex]);

  const getCurrentSong = () => {
    setCurrentSong(songRefsAndMD[currentSongIndex]);
  };

  const updateCurrentSongIndex = () => {
    const index = songRefsAndMD.indexOf(currentSong);
    setCurrentSongIndex(index);
  };

  console.log({ currentSong }, songRefsAndMD.indexOf(currentSong));
  return (
    <div className={`${styles["container"]} ${!showPlaylist && styles["hide"]}`}>
      <div className={`${styles["playlist"]} ${!showPlaylist && styles["hide"]}`}>
        <Reorder.Group axis="y" values={songRefsAndMD} onReorder={setSongRefsAndMD}>
          {songRefsAndMD.map((songRefAndMD, index) => {
            return (
              <Reorder.Item
                onDragStart={getCurrentSong}
                onDrag={() => updateCurrentSongIndex()}
                key={songRefAndMD.ref.name}
                value={songRefAndMD}
                style={{ listStyle: "none" }}
                transition={{ duration: 0.2 }}
              >
                <Song
                  index={index}
                  songRefAndMD={songRefAndMD}
                  songRef={songRefAndMD.ref}
                  songMD={songRefAndMD.metadata}
                />
              </Reorder.Item>
            );
          })}
        </Reorder.Group>
      </div>
    </div>
  );
};

export default Playlist;
