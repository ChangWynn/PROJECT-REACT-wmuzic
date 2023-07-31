import styles from "./Song.module.css";
import { formatDuration } from "../../utilities/formatDuration";
import defaultThumbnails from "../../assets/default-album-cover.jpeg";

import { deleteObject } from "firebase/storage";
import { AppContext } from "../../layout/AppLayout";

import React, { useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faGripDotsVertical } from "@fortawesome/pro-solid-svg-icons";
import { faCirclePlay, faXmark } from "@fortawesome/sharp-regular-svg-icons";
import { faCirclePause } from "@fortawesome/pro-regular-svg-icons";
import UpdateModal from "../Update/UpdateModal";
import Backdrop from "../../shared/ui/Backdrop";
import { faVolume } from "@fortawesome/sharp-light-svg-icons";
import { useActionData, useOutletContext } from "react-router-dom";

import { Reorder, useDragControls } from "framer-motion";

const Song = React.memo(
  ({ songRefAndMD, songRef, songMD, index }) => {
    const {
      currentSongRef,
      currentSongURL,
      songIsPlaying,
      setSongIsPlaying,
      currentSongIndex,
      setCurrentSongIndex,
      songRefsAndMD,
      setSongRefsAndMD,
    } = useContext(AppContext);

    const [isHovered, setIsHovered] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [thumbnailIsHovered, setThumbnailIsHovered] = useState(false);

    let [metadata, setMetadata] = useState(songMD.customMetadata);
    const data = useActionData();

    useEffect(() => {
      if (songRef.name === data?.name) {
        setMetadata(data.customMetadata);
      }
    }, [data]);

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
      const newSongRefs = songRefsAndMD.filter((_, i) => i !== index);
      try {
        await deleteObject(songRef);
        if (index > newSongRefs.length - 1) {
          setCurrentSongIndex(newSongRefs.length - 1);
        }
        setSongRefsAndMD(newSongRefs);
      } catch (err) {
        console.log(err);
      }
    };

    const controls = useDragControls();

    const updateCurrentSongIndex = () => {
      const index = songRefsAndMD.findIndex((song) => {
        return song.url === currentSongURL;
      });
      setCurrentSongIndex(index);
    };

    // const updatePositions = async () => {
    //   console.log("running");
    //   const newSongRefsAndMDOrder = songRefsAndMD.map((songRefAndMD, index) => {
    //     return { ...songRefAndMD, position: index };
    //   });
    //   console.log({ newSongRefsAndMDOrder, songRefsAndMD });
    //   setSongRefsAndMD(newSongRefsAndMDOrder);
    // };

    const [isDragged, setIsDragged] = useState(false);

    return (
      <Reorder.Item
        onDrag={updateCurrentSongIndex}
        onDragStart={() => setIsDragged(true)}
        onDragEnd={() => setIsDragged(false)}
        // onDragEnd={updatePositions}
        dragControls={controls}
        dragListener={false}
        value={songRefAndMD}
        style={{ listStyle: "none", position: "relative", zIndex: 1 }}
        animate={{ scale: isDragged ? 1.05 : 1 }}
        transition={{ duration: 0.1 }}
      >
        <div
          ref={currentSongIndex === index ? currentSongRef : null}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`${styles["song-container"]} ${
            currentSongIndex === index && styles["current"]
          }`}
        >
          <div className={styles["song-btn"]} onMouseLeave={closeMenu}>
            <div className={styles["song-info"]}>
              <div
                onPointerDown={(e) => controls.start(e)}
                style={{ touchAction: "none" }}
                className={styles["vertical-grip"]}
              >
                {isHovered && <FontAwesomeIcon icon={faGripDotsVertical} size="2x" />}
              </div>
              <div
                className={styles["song-info--img"]}
                onMouseEnter={() => setThumbnailIsHovered(true)}
                onMouseLeave={() => setThumbnailIsHovered(false)}
              >
                <img src={metadata.albumImgS || defaultThumbnails} alt="" />
                <div className={styles["icon-container"]} onClick={playSelectedSong}>
                  {songIsPlaying && currentSongIndex === index && !thumbnailIsHovered && (
                    <div className={styles["icon"]}>
                      <FontAwesomeIcon size="2x" icon={faVolume} />
                    </div>
                  )}
                  {thumbnailIsHovered && (
                    <div className={styles["icon"]}>
                      <FontAwesomeIcon size="3x" icon={renderThumbnailIcon()} />
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
                    <FontAwesomeIcon size="xl" icon={showMenu ? faXmark : faEllipsisVertical} />
                  </div>
                ) : (
                  <div className={styles["song-info--duration"]}>
                    <h3>{formatDuration(metadata.duration)}</h3>
                  </div>
                )}
                {showMenu && (
                  <div className={styles["song-menu"]}>
                    <button onClick={() => setShowModal(true)}>Edit</button>
                    <button onClick={() => setShowDelete(true)}>Delete</button>
                  </div>
                )}
                {showMenu && showDelete && (
                  <div className={styles["song-menu"]}>
                    <button onClick={() => setShowDelete(false)}>Cancel</button>
                    <button className={styles["confirm-delete-btn"]} onClick={confirmDelete}>
                      Confirm
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          {showModal &&
            ReactDOM.createPortal(<Backdrop zIndex="10" />, document.getElementById("backdrop"))}
          {showModal &&
            ReactDOM.createPortal(
              <UpdateModal
                showModal={showModal}
                setShowModal={setShowModal}
                songRef={songRef}
                metadata={metadata}
              />,
              document.getElementById("modal-overlay")
            )}
        </div>
      </Reorder.Item>
    );
  },
  (prev, next) => {
    return prev.index === next.index;
  }
);

export default Song;
