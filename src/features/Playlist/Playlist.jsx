import UploadForm from "../Upload/UploadForm";
import styles from "./css/Playlist.module.css";
import Song from "./Song";

import { Context } from "../App/MusicPlayer";
import { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlbumCirclePlus } from "@fortawesome/pro-duotone-svg-icons";

const Playlist = () => {
  const [showForm, setShowForm] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { songRefs } = useContext(Context);
  return (
    <div className={styles["container"]}>
      <div className={styles["playlist"]}>
        {songRefs.length > 0 &&
          songRefs.map((itemRef, index) => {
            return <Song key={itemRef.name} itemRef={itemRef} index={index} />;
          })}
      </div>
      <div className={styles["playlist--menu"]}>
        <button className={styles["add-btn"]} onClick={() => setShowForm(true)}>
          <FontAwesomeIcon
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            icon={faAlbumCirclePlus}
            size="4x"
            style={
              isHovered && {
                "--fa-primary-color": "#ee82ee",
                "--fa-secondary-color": "#ee82ee",
              }
            }
          />
        </button>
      </div>

      <UploadForm showForm={showForm} setShowForm={setShowForm} />
    </div>
  );
};

export default Playlist;
