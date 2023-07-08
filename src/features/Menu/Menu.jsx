import styles from "./Menu.module.css";
import MenuButton from "./MenuButton";
import { forwardRef, useContext } from "react";
import { MainContext } from "../App/MusicPlayer";

import { faPlus } from "@fortawesome/sharp-light-svg-icons";
import { faAlbum, faAlbumCollection } from "@fortawesome/sharp-solid-svg-icons";

const Menu = forwardRef((_, ref) => {
  const { showPlaylist, setShowPlaylist, setShowForm } =
    useContext(MainContext);
  return (
    <div ref={ref} className={styles["playlist--menu"]}>
      <MenuButton
        faIcon={showPlaylist ? faAlbumCollection : faAlbum}
        clickEvent={() => setShowPlaylist(!showPlaylist)}
      />
      <MenuButton faIcon={faPlus} clickEvent={() => setShowForm(true)} />
    </div>
  );
});

export default Menu;
