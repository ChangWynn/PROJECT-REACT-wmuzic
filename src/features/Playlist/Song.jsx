import styles from "./css/Song.module.css";
import { formatDuration } from "../../utilities/formatDuration";
import defaultThumbnails from "../../assets/default-album-cover.jpeg";

import { getMetadata } from "firebase/storage";
import { Context } from "../App/MusicPlayer";

import { useContext, useEffect, useState } from "react";

const Song = ({ itemRef, index }) => {
  const {
    songIsPlaying,
    setSongIsPlaying,
    currentSongIndex,
    setCurrentSongIndex,
  } = useContext(Context);

  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [smallImage, setSmallImage] = useState("");
  const [duration, setDuration] = useState("");

  useEffect(() => {
    setIsLoading(true);

    getMetadata(itemRef).then((metadata) => {
      const data = metadata.customMetadata;
      setTitle(data.title);
      setArtist(data.artist);
      setSmallImage(data.imgM);
      setDuration(data.duration);
      setIsLoading(false);
    });
  }, []);

  const playSelectedSong = () => {
    setCurrentSongIndex(index);
    if (!songIsPlaying) {
      setTimeout(() => setSongIsPlaying(true), 500);
    }
  };

  return (
    <div
      className={`${styles["song-container"]} ${
        currentSongIndex === index && styles["current"]
      }`}
    >
      {isLoading ? (
        <h3 className={styles["song--loading-message"]}>Loading...</h3>
      ) : (
        <button onClick={playSelectedSong} className={styles["song-btn"]}>
          <div className={styles["song-info"]}>
            {isLoading && <h2>Loading...</h2>}
            {!isLoading && (
              <>
                <div className={styles["song-info--img"]}>
                  <img src={smallImage || defaultThumbnails} alt="" />
                </div>
                <div className={styles["song-info--details"]}>
                  <h2>{title}</h2>
                  <h3>{artist}</h3>
                </div>
                <div className={styles["song-info--duration"]}>
                  <h3>{formatDuration(duration)}</h3>
                </div>
              </>
            )}
          </div>
        </button>
      )}
    </div>
  );
};

export default Song;
