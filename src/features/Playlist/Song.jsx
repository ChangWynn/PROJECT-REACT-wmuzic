import { useContext, useEffect, useState } from "react";
import styles from "./css/Song.module.css";

import { getMetadata } from "firebase/storage";
import { Context } from "../App/MusicPlayer";

const Song = ({ itemRef, index }) => {
  const { currentSongIndex, setCurrentSongIndex } = useContext(Context);

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
    });

    setIsLoading(false);
  }, []);

  const formattedDuration = () => {
    if (duration) {
      let minutes = Math.floor(+duration / 60);
      let seconds = Math.floor(+duration % 60);

      return `${minutes.toString()}:${seconds.toString().padStart(2, "0")}`;
    }
    return "-:--";
  };

  const playSelectedSong = () => {
    setCurrentSongIndex(index);
  };

  return (
    <div
      className={`${styles["song-container"]} ${
        currentSongIndex === index && styles["current"]
      }`}
    >
      <button onClick={playSelectedSong} className={styles["song-btn"]}>
        <div className={styles["song-info"]}>
          {isLoading && <h2>Loading...</h2>}
          {!isLoading && (
            <>
              <div className={styles["song-info--img"]}>
                <img src={smallImage} alt="" />
              </div>
              <div className={styles["song-info--details"]}>
                <h2>{title}</h2>
                <h3>{artist}</h3>
              </div>
              <div className={styles["song-info--duration"]}>
                <h3>{formattedDuration()}</h3>
              </div>
            </>
          )}
        </div>
      </button>
    </div>
  );
};

export default Song;
