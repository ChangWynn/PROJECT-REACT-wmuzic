import styles from "./Playlist.module.css";
import Song from "./Song";
import { AppContext } from "../../layout/AppLayout";

import { useContext, useState } from "react";
import { Reorder } from "framer-motion";

const Playlist = () => {
  const { showPlaylist, songRefsAndMD, setSongRefsAndMD, currentSongIndex, setCurrentSongIndex } =
    useContext(AppContext);

  const [currentSong, setCurrentSong] = useState(songRefsAndMD[currentSongIndex]);

  const saveCurrentSong = () => {
    setCurrentSong(songRefsAndMD[currentSongIndex]);
  };

  const updateCurrentSongIndex = () => {
    const index = songRefsAndMD.indexOf(currentSong);
    setCurrentSongIndex(index);
  };

  return (
    <div className={`${styles["container"]} ${!showPlaylist && styles["hide"]}`}>
      <div className={`${styles["playlist"]} ${!showPlaylist && styles["hide"]}`}>
        <Reorder.Group axis="y" values={songRefsAndMD} onReorder={setSongRefsAndMD}>
          {songRefsAndMD.map((songRefAndMD, index) => {
            return (
              <Reorder.Item
                onDragStart={saveCurrentSong}
                onDrag={updateCurrentSongIndex}
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
