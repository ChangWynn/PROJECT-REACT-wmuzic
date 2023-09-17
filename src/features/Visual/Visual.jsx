import style from "./Visual.module.css";
import React, { useContext, useEffect, useState, Suspense } from "react";
import { AppContext } from "../../layout/AppLayout";

import defaultCover from "../../assets/default-album-cover.jpeg";
import Browser from "../Browser/Browser";

const Visual = () => {
  const { currentSongIndex, songRefsAndMD } = useContext(AppContext);

  const [currentSongMetadata, setCurrentSongMetadata] = useState(
    songRefsAndMD[currentSongIndex].metadata.customMetadata
  );

  useEffect(() => {
    setCurrentSongMetadata(songRefsAndMD[currentSongIndex].metadata.customMetadata);
  }, [currentSongIndex]);

  return (
    <React.Fragment>
      <div className={style["container"]}>
        <div className={style["album-cover"]}>
          <img src={currentSongMetadata.albumImgL || defaultCover} alt="album cover" />
        </div>

        <div className={style["song-info"]}>
          <h2>{currentSongMetadata.title}</h2>
          <h3>{currentSongMetadata.artist}</h3>
        </div>
        <Browser />
      </div>
    </React.Fragment>
  );
};

export default Visual;
