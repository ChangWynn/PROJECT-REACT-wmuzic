import style from "./Playlist.module.css";

const Playlist = ({ songsRefs }) => {
  return (
    <div className={style["playlist"]}>
      {songsRefs.items.length > 0 &&
        songsRefs.items.map((itemRef) => {
          return (
            <p className={style["title"]} key={itemRef.name}>
              {itemRef.name}
            </p>
          );
        })}
    </div>
  );
};

export default Playlist;
