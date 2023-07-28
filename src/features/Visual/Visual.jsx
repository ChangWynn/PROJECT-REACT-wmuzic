import style from "./Visual.module.css";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../layout/AppLayout";

import defaultCover from "../../assets/default-album-cover.jpeg";
import Browser from "../Browser/Browser";

const Visual = () => {
  const { currentSongIndex, songRefsAndMD } = useContext(AppContext);
  const currentSongMetadata = songRefsAndMD[currentSongIndex].metadata.customMetadata;

  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   setIsLoading(true);
  //   setCurrentSongMetadata(songRefsAndMD[currentSongIndex].metadata);
  //   setIsLoading(false);
  // }, [currentSongIndex]);

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
        {/* <Browser /> */}
      </div>
    </React.Fragment>
  );
};

export default Visual;
