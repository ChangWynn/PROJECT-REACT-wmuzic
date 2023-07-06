import styles from "./css/Song.module.css";
import { formatDuration } from "../../utilities/formatDuration";
import defaultThumbnails from "../../assets/default-album-cover.jpeg";

import { deleteObject } from "firebase/storage";
import { MainContext } from "../App/MusicPlayer";

import React, { useContext, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/pro-solid-svg-icons";
import { faCirclePlay, faXmark } from "@fortawesome/sharp-regular-svg-icons";
import { faCirclePause } from "@fortawesome/pro-regular-svg-icons";
import EditSongModal from "../EditSong/EditSongModal";
import Backdrop from "../../components/ui/Backdrop";
import { faVolume } from "@fortawesome/sharp-light-svg-icons";
import { useActionData } from "react-router-dom";

const Song = React.memo(
  ({ songRef, songMD, index }) => {
    console.log(`${index} rendered`);
    const {
      songIsPlaying,
      setSongIsPlaying,
      currentSongIndex,
      setCurrentSongIndex,
      songRefs,
      setSongRefs,
    } = useContext(MainContext);

    const [metadata, setMetadata] = useState({ ...songMD.customMetadata });

    const [isLoading, setIsLoading] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [thumbnailIsHovered, setThumbnailIsHovered] = useState(false);

    const containerRef = useRef();
    const data = useActionData();

    useEffect(() => {
      setIsLoading(true);
      const updatedMD = data?.customMetadata;

      if (metadata?.position === updatedMD?.position) {
        setMetadata({ ...updatedMD });
      }
      setIsLoading(false);
    }, [data]);

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

    const confirmDelete = async (e) => {
      e.preventDefault();
      try {
        const index = songRefs.indexOf(songRef);
        const newSongRefs = songRefs.filter((_, i) => i !== index);
        setSongRefs(newSongRefs);
        await deleteObject(songRef);
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
                  <div
                    className={styles["song-info--img"]}
                    onMouseEnter={() => setThumbnailIsHovered(true)}
                    onMouseLeave={() => setThumbnailIsHovered(false)}
                  >
                    <img src={metadata.imgM || defaultThumbnails} alt="" />
                    <div
                      className={styles["icon-container"]}
                      onClick={playSelectedSong}
                    >
                      {songIsPlaying &&
                        currentSongIndex === index &&
                        !thumbnailIsHovered && (
                          <div className={styles["icon"]}>
                            <FontAwesomeIcon size="2x" icon={faVolume} />
                          </div>
                        )}
                      {thumbnailIsHovered && (
                        <div className={styles["icon"]}>
                          <FontAwesomeIcon
                            size="3x"
                            icon={renderThumbnailIcon()}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={styles["song-info--details"]}>
                    <h2>{metadata.title}</h2>
                    <h3>{metadata.artist}</h3>
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
                        <h3>{formatDuration(metadata.duration)}</h3>
                      </div>
                    )}
                    {showMenu && (
                      <div className={styles["song-menu"]}>
                        <button onClick={() => setShowModal(true)}>Edit</button>
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
        {showModal &&
          ReactDOM.createPortal(
            <Backdrop zIndex="10" />,
            document.getElementById("backdrop")
          )}
        {showModal &&
          ReactDOM.createPortal(
            <EditSongModal
              showModal={showModal}
              setShowModal={setShowModal}
              songRef={songRef}
              metadata={metadata}
            />,
            document.getElementById("modal-overlay")
          )}
      </div>
    );
  },
  (prev, next) => {
    return prev.index === next.index;
  }
);

export default Song;
