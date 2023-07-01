import { getMetadata, ref } from "firebase/storage";
import style from "./Visual.module.css";
import { storage } from "../../config/firebase";
import { useContext, useEffect, useState } from "react";
import { Context } from "../App/MusicPlayer";

import defaultCover from "../../assets/default-album-cover.jpeg";

const Visual = () => {
  const { songRefs, currentSongIndex } = useContext(Context);

  const [isLoading, setIsLoading] = useState(false);
  const [albumCover, setAlbumCover] = useState("");
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");

  useEffect(() => {
    setIsLoading(true);
    getMetadata(songRefs[currentSongIndex]).then((metadata) => {
      setAlbumCover(metadata.customMetadata.imgL);
      setTitle(metadata.customMetadata.title);
      setArtist(metadata.customMetadata.artist);
      setIsLoading(false);
    });
  }, [currentSongIndex]);

  return (
    <div className={style["container"]}>
      <div className={style["album-cover"]}>
        {isLoading ? (
          <h3>Loading...</h3>
        ) : (
          <img src={albumCover || defaultCover} />
        )}
      </div>
      <div className={style["song-info"]}>
        <h2>{title}</h2>
        <h3>{artist}</h3>
      </div>
    </div>
  );
};

export default Visual;
