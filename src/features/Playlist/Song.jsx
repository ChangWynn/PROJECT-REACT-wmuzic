import { useEffect, useState } from "react";
import styles from "./css/Song.module.css";

import { getMetadata } from "firebase/storage";

const Song = ({ itemRef }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [smallImage, setSmallImage] = useState("");
  const [largeImage, setLargeImage] = useState("");

  useEffect(() => {
    setIsLoading(true);
    getMetadata(itemRef).then((metadata) => {
      const data = metadata.customMetadata;
      setTitle(data.title);
      setArtist(data.artist);
      setAlbum(data.album);
      setSmallImage(data.imgM);
      setLargeImage(data.imgL);
    });
    setIsLoading(false);
  }, []);

  return (
    <button className={styles["song-btn"]}>
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
          </>
        )}
      </div>
    </button>
  );
};

export default Song;
