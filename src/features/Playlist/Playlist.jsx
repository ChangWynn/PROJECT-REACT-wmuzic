import UploadForm from "../Upload/UploadForm";
import style from "./css/Playlist.module.css";
import Song from "./Song";

const Playlist = ({ songsRefs, setSongsRefs, setSongsURL }) => {
  return (
    <div className={style["playlist"]}>
      {songsRefs.items.length > 0 &&
        songsRefs.items.map((itemRef) => {
          return <Song key={itemRef.name} itemRef={itemRef} />;
        })}
      <UploadForm setSongsRefs={setSongsRefs} setSongsURL={setSongsURL} />
    </div>
  );
};

export default Playlist;
