import styles from "./Playlist.module.css";
import Song from "./Song";
import { AppContext } from "../../layout/AppLayout";

import { useContext } from "react";
import { Reorder } from "framer-motion";

const Playlist = () => {
  const { showPlaylist, songRefsAndMD, setSongRefsAndMD } = useContext(AppContext);

  return (
    <div className={`${styles["container"]} ${!showPlaylist && styles["hide"]}`}>
      <div className={`${styles["playlist"]} ${!showPlaylist && styles["hide"]}`}>
        <Reorder.Group axis="y" values={songRefsAndMD} onReorder={setSongRefsAndMD}>
          {songRefsAndMD.map((songRefAndMD, index) => {
            return (
              <Reorder.Item
                key={songRefAndMD.ref.name}
                value={songRefAndMD}
                style={{ listStyle: "none" }}
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
