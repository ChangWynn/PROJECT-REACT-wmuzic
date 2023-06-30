import UploadForm from "../Upload/UploadForm";
import style from "./css/Playlist.module.css";
import Song from "./Song";

import { Context } from "../App/MusicPlayer";
import { useContext } from "react";

const Playlist = () => {
  const { songRefs, setSongRefs } = useContext(Context);
  return (
    <div className={style["playlist"]}>
      {songRefs.length > 0 &&
        songRefs.map((itemRef, index) => {
          return <Song key={itemRef.name} itemRef={itemRef} index={index} />;
        })}
      <UploadForm setSongRefs={setSongRefs} />
    </div>
  );
};

export default Playlist;
