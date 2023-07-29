import styles from "./Playlist.module.css";
import Song from "./Song";
import { AppContext } from "../../layout/AppLayout";

import { useContext } from "react";
import { Reorder } from "framer-motion";

const Playlist = () => {
  const { showPlaylist, songRefsAndMD, setSongRefsAndMD, currentSongURL, setCurrentSongIndex } =
    useContext(AppContext);

  const updateCurrentSongIndex = () => {
    const index = songRefsAndMD.findIndex((song) => {
      return song.url === currentSongURL;
    });
    setCurrentSongIndex(index);
  };

  const updatePositions = () => {
    const newSongRefsAndMDOrder = songRefsAndMD.map((songRefAndMD, index) => {
      return { ...songRefAndMD, position: index };
    });
    setSongRefsAndMD(newSongRefsAndMDOrder);
  };

  return (
    <div className={`${styles["container"]} ${!showPlaylist && styles["hide"]}`}>
      <div className={`${styles["playlist"]} ${!showPlaylist && styles["hide"]}`}>
        <Reorder.Group axis="y" values={songRefsAndMD} onReorder={setSongRefsAndMD}>
          {songRefsAndMD.map((songRefAndMD, index) => {
            return (
              <Reorder.Item
                onDrag={updateCurrentSongIndex}
                onDragEnd={updatePositions}
                key={songRefAndMD.url}
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
