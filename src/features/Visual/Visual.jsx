import style from "./Visual.module.css";
import { useContext, useEffect, useState } from "react";
import { MainContext } from "../App/MusicPlayer";

import defaultCover from "../../assets/default-album-cover.jpeg";

const Visual = () => {
  const { currentSongIndex, files } = useContext(MainContext);
  const [currentSongMetadata, setCurrentSongMetadata] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setCurrentSongMetadata(files.songMD[currentSongIndex].customMetadata);
    // setCurrentSongMetadata({
    //   title: files.songMD[currentSongIndex].customMetadata.title,
    //   artist: files.songMD[currentSongIndex].customMetadata.artist,
    //   imgL: files.songMD[currentSongIndex].customMetadata.imgL,
    // });
    setIsLoading(false);
  }, [currentSongIndex]);

  return (
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
    </div>
  );
};

export default Visual;
