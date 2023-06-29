import UploadForm from "../Upload/UploadForm";
import style from "./css/Playlist.module.css";
import Song from "./Song";

import { Context } from "../App/MusicPlayer";
import { useContext } from "react";

const Playlist = () => {
  const { songsRefs, setSongsRefs, setSongsURL } = useContext(Context);
  return (
    <div className={style["playlist"]}>
      {songsRefs.items.length > 0 &&
        songsRefs.items.map((itemRef, index) => {
          return <Song key={itemRef.name} itemRef={itemRef} index={index} />;
        })}
      <UploadForm setSongsRefs={setSongsRefs} setSongsURL={setSongsURL} />
    </div>
  );
};

export default Playlist;
