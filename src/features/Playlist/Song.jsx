import styles from "./css/Song.module.css";
import { formatDuration } from "../../utilities/formatDuration";
import defaultThumbnails from "../../assets/default-album-cover.jpeg";

import { deleteObject, getMetadata } from "firebase/storage";
import { MainContext } from "../App/MusicPlayer";

import { useContext, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/pro-solid-svg-icons";
import { faCirclePlay, faXmark } from "@fortawesome/sharp-regular-svg-icons";
import { faCirclePause } from "@fortawesome/pro-regular-svg-icons";

const Song = ({ itemRef, index }) => {
  const {
    songIsPlaying,
    setSongIsPlaying,
    currentSongIndex,
    setCurrentSongIndex,
    songRefs,
    setSongRefs,
  } = useContext(MainContext);

  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [smallImage, setSmallImage] = useState("");
  const [duration, setDuration] = useState("");

  const containerRef = useRef();

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

  const containerClickHandler = (e) => {
    if (e.target === containerRef.current) {
      playSelectedSong();
    }
  };

  const playSelectedSong = () => {
    if (currentSongIndex === index) {
      setSongIsPlaying(!songIsPlaying);
    } else {
      setCurrentSongIndex(index);
      if (!songIsPlaying) {
        setTimeout(() => setSongIsPlaying(true), 500);
      }
    }
  };

  const renderThumbnailIcon = () => {
    if (songIsPlaying && currentSongIndex === index) return faCirclePause;
    else return faCirclePlay;
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
    setShowDelete(false);
  };

  const closeMenu = () => {
    setShowMenu(false);
    setShowDelete(false);
  };

  const confirmDelete = async () => {
    try {
      const index = songRefs.indexOf(itemRef);
      const newSongRefs = songRefs.filter((_, i) => i !== index);
      setSongRefs(newSongRefs);
      await deleteObject(itemRef);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={containerClickHandler}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`${styles["song-container"]} ${
        currentSongIndex === index && styles["current"]
      }`}
    >
      {isLoading ? (
        <h3 className={styles["song--loading-message"]}>Loading...</h3>
      ) : (
        <div className={styles["song-btn"]} onMouseLeave={closeMenu}>
          <div className={styles["song-info"]}>
            {isLoading && <h2>Loading...</h2>}
            {!isLoading && (
              <>
                <div className={styles["song-info--img"]}>
                  <img src={smallImage || defaultThumbnails} alt="" />
                  <div
                    className={styles["play-btn"]}
                    onClick={playSelectedSong}
                  >
                    <FontAwesomeIcon size="3x" icon={renderThumbnailIcon()} />
                  </div>
                </div>
                <div className={styles["song-info--details"]}>
                  <h2>{title}</h2>
                  <h3>{artist}</h3>
                </div>
                <div className={styles["hover-options"]}>
                  {isHovered ? (
                    <div className={styles["menu"]} onClick={toggleMenu}>
                      <FontAwesomeIcon
                        size="xl"
                        icon={showMenu ? faXmark : faEllipsisVertical}
                      />
                    </div>
                  ) : (
                    <div className={styles["song-info--duration"]}>
                      <h3>{formatDuration(duration)}</h3>
                    </div>
                  )}
                  {showMenu && (
                    <div className={styles["song-menu"]}>
                      <button>Edit</button>
                      <button onClick={() => setShowDelete(true)}>
                        Delete
                      </button>
                    </div>
                  )}
                  {showMenu && showDelete && (
                    <div className={styles["song-menu"]}>
                      <button onClick={() => setShowDelete(false)}>
                        Cancel
                      </button>
                      <button
                        className={styles["confirm-delete-btn"]}
                        onClick={confirmDelete}
                      >
                        Confirm
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Song;
