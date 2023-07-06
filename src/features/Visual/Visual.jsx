import style from "./Visual.module.css";
import React, { useContext, useEffect, useState } from "react";
import { MainContext } from "../App/MusicPlayer";

import defaultCover from "../../assets/default-album-cover.jpeg";
import Browser from "../Browser/Browser";

const Visual = () => {
  const { currentSongIndex, files } = useContext(MainContext);
  const [currentSongMetadata, setCurrentSongMetadata] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setCurrentSongMetadata(files.songMD[currentSongIndex].customMetadata);
    setIsLoading(false);
  }, [currentSongIndex]);

  return (
    <React.Fragment>
      <div className={style["container"]}>
        <div className={style["album-cover"]}>
          {isLoading ? (
            <h3>Loading...</h3>
          ) : (
            <img
              src={currentSongMetadata.imgL || defaultCover}
              alt="album cover"
            />
          )}
        </div>
        <div className={style["song-info"]}>
          <h2>{currentSongMetadata.title}</h2>
          <h3>{currentSongMetadata.artist}</h3>
        </div>
        <img
          className={style["background"]}
          src={currentSongMetadata.imgM || defaultCover}
          alt="album cover in the background"
        />
        <Browser />
      </div>
    </React.Fragment>
  );
};

export default Visual;
